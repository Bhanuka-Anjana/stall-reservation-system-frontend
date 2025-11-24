"use client";

import { Flex, Text, Card, Button, Heading, Checkbox, Grid, Badge, Box } from "@radix-ui/themes";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Stall } from "@/types";
import { UPCOMING_EVENTS } from "@/data/events";
import { generateStalls } from "@/utils/layoutGenerator";
import { EventCarousel } from "./EventCarousel";

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
  const [userReservations, setUserReservations] = useState<{ eventId: string | number, stalls: Stall[] }[]>([]);

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

  // Load all reservations for all events
  useEffect(() => {
    if (user) {
      const allReservations: { eventId: string | number, stalls: Stall[] }[] = [];
      
      UPCOMING_EVENTS.forEach(event => {
        const stored = localStorage.getItem(`user_reservations_${user.id}_${event.id}`);
        if (stored) {
          try {
            const stallIds: string[] = JSON.parse(stored);
            if (stallIds.length > 0) {
              // We need to regenerate stalls for this event to get details
              // This is a bit inefficient but works for client-side demo
              const eventStalls: Stall[] = [];
              [1, 2, 3].forEach(mapId => {
                const stalls = generateStalls(mapId, event.id.toString());
                stalls.forEach(s => {
                  if (stallIds.includes(s.id)) {
                    eventStalls.push(s);
                  }
                });
              });
              allReservations.push({ eventId: event.id, stalls: eventStalls });
            }
          } catch (e) {
            console.error("Error parsing reservations", e);
          }
        }
      });
      setUserReservations(allReservations);
    }
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
            <EventCarousel events={UPCOMING_EVENTS} />
          </Flex>
        </Card>

        {/* Reservations Section */}
        <Card size="3">
          <Flex direction="column" gap="4">
            <Heading size="5">My Reservations</Heading>
            
            {userReservations.length === 0 ? (
              <Text color="gray" style={{ fontStyle: 'italic' }}>
                You haven't reserved any stalls yet.
              </Text>
            ) : (
              <Flex direction="column" gap="4">
                {userReservations.map(res => {
                  const event = UPCOMING_EVENTS.find(e => e.id === res.eventId);
                  return (
                    <Box key={res.eventId}>
                      <Text weight="bold" size="2" mb="2">{event?.name || 'Unknown Event'}</Text>
                      <Flex direction="column" gap="2">
                        {res.stalls.map(stall => (
                          <Card key={stall.id} variant="surface">
                            <Flex justify="between" align="center">
                              <Flex direction="column">
                                <Text weight="bold">{stall.name}</Text>
                                <Text size="2" color="gray">Size: {stall.size}</Text>
                              </Flex>
                              <Badge color="purple">Reserved</Badge>
                            </Flex>
                          </Card>
                        ))}
                      </Flex>
                    </Box>
                  );
                })}
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