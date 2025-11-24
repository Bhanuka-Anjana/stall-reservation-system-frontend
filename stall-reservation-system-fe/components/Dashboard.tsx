"use client";

import { Flex, Text, Card, Button, Heading, Checkbox, Grid, Badge, Box } from "@radix-ui/themes";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Event, Reservation } from "@/types";
import { EventCarousel } from "./EventCarousel";

//TODO: upcoming items should be automaticall scroll
const AVAILABLE_GENRES = [
  "Fiction", "Non-Fiction", "Science Fiction", "Fantasy", 
  "Mystery", "Thriller", "Romance", "Historical", 
  "Biography", "Self-Help", "Children's", "Young Adult",
  "Comics/Graphic Novels", "Poetry", "Academic/Textbooks"
];

export function Dashboard() {
  const { user } = useAuth();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [userReservations, setUserReservations] = useState<Reservation[]>([]);
  const [isLoadingReservations, setIsLoadingReservations] = useState(true);

  // Fetch upcoming events
  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const response = await fetch('https://fluffy-train-xqwq79vrw7x29qpx-8080.app.github.dev/api/events/upcoming');
        if (response.ok) {
          const data = await response.json();
          setUpcomingEvents(Array.isArray(data) ? data : data.data || []);
        }
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
      } finally {
        setIsLoadingEvents(false);
      }
    };
    fetchUpcomingEvents();
  }, []);

  // Load saved genres
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`user_genres_${user.id}`);
      if (saved) {
        try {
          setSelectedGenres(JSON.parse(saved));
        } catch {
          setSelectedGenres([]);
        }
      }
    }
  }, [user]);

  // Fetch user reservations from backend
  useEffect(() => {
    const fetchReservations = async () => {
      if (!user) {
        setIsLoadingReservations(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoadingReservations(false);
          return;
        }

        const response = await fetch('https://fluffy-train-xqwq79vrw7x29qpx-8080.app.github.dev/api/reservations/my-reservations', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const result = await response.json();
          const reservations = Array.isArray(result.data) ? result.data : [];
          setUserReservations(reservations);
        } else {
          console.error('Failed to fetch reservations');
          setUserReservations([]);
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
        setUserReservations([]);
      } finally {
        setIsLoadingReservations(false);
      }
    };

    fetchReservations();
  }, [user]);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const saveGenres = () => {
    if (!user) return;
    setIsSaving(true);
    localStorage.setItem(`user_genres_${user.id}`, JSON.stringify(selectedGenres));
    setTimeout(() => setIsSaving(false), 500); // Fake delay for feedback
  };

  return (
    <Flex direction="column" gap="6" width="100%">
      <Box>
        <Heading size="8">Welcome, {user?.username || 'User'}!</Heading>
        <Text color="gray" size="4">Manage your book fair participation</Text>
      </Box>

      <Grid columns={{ initial: '1', md: '2' }} gap="6">
        {/* Upcoming Events Section */}
        <Card size="3" style={{ gridColumn: '1 / -1' }}>
          <Flex direction="column" gap="4">
            <Heading size="5">Upcoming Events</Heading>
            {isLoadingEvents ? (
              <Text color="gray">Loading events...</Text>
            ) : (
              <EventCarousel events={upcomingEvents} />
            )}
          </Flex>
        </Card>

        {/* Reservations Section */}
        <Card size="3">
          <Flex direction="column" gap="4">
            <Heading size="5">My Reservations</Heading>
            
            {isLoadingReservations ? (
              <Text color="gray">Loading reservations...</Text>
            ) : userReservations.length === 0 ? (
              <Text color="gray" style={{ fontStyle: 'italic' }}>
                You haven't reserved any stalls yet.
              </Text>
            ) : (
              <Flex direction="column" gap="3">
                {userReservations.map(reservation => (
                  <Card key={reservation.id} variant="surface">
                    <Flex direction="column" gap="2">
                      <Flex justify="between" align="start">
                        <Flex direction="column" gap="1">
                          <Text weight="bold" size="2">{reservation.eventName}</Text>
                          <Text size="2" color="gray">Stall: {reservation.stallNumber} (Hall {reservation.hallNumber})</Text>
                          <Text size="1" color="gray">Code: {reservation.reservationCode}</Text>
                        </Flex>
                        <Badge color={reservation.status === 'CONFIRMED' ? 'green' : 'orange'}>
                          {reservation.status}
                        </Badge>
                      </Flex>
                      {reservation.genres && reservation.genres.length > 0 && (
                        <Flex gap="1" wrap="wrap">
                          {reservation.genres.map((genre, idx) => (
                            <Badge key={idx} color="blue" variant="soft" size="1">
                              {genre}
                            </Badge>
                          ))}
                        </Flex>
                      )}
                    </Flex>
                  </Card>
                ))}
              </Flex>
            )}
          </Flex>
        </Card>

        {/* Genres Section */}
        <Card size="3">
          <Flex direction="column" gap="4">
            <Heading size="5">Literary Genres</Heading>
            <Text size="2" color="gray">
              Select the genres you will be displaying or selling at the exhibition.
            </Text>

            <Grid columns="2" gap="2">
              {AVAILABLE_GENRES.map(genre => (
                <Flex key={genre} gap="2" align="center">
                  <Checkbox 
                    checked={selectedGenres.includes(genre)}
                    onCheckedChange={() => handleGenreToggle(genre)}
                  />
                  <Text size="2">{genre}</Text>
                </Flex>
              ))}
            </Grid>

            <Button 
              mt="2" 
              onClick={saveGenres} 
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Preferences"}
            </Button>
          </Flex>
        </Card>
      </Grid>
    </Flex>
  );
}
