"use client";

import { Flex, Text, Card, Button, Heading, Checkbox, Grid, Badge, Box, Skeleton } from "@radix-ui/themes";
import { DownloadIcon, ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Event, Reservation, Genre } from "@/types";
import { EventCarousel } from "./EventCarousel";

export function Dashboard() {
  const { user } = useAuth();
  const [availableGenres, setAvailableGenres] = useState<Genre[]>([]);
  const [isLoadingGenres, setIsLoadingGenres] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [userReservations, setUserReservations] = useState<Reservation[]>([]);
  const [isLoadingReservations, setIsLoadingReservations] = useState(true);
  const [currentReservationPage, setCurrentReservationPage] = useState(1);
  const [downloadingReservationId, setDownloadingReservationId] = useState<number | null>(null);

  const RESERVATIONS_PER_PAGE = 3;

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

  // Fetch available genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('https://fluffy-train-xqwq79vrw7x29qpx-8080.app.github.dev/api/genres');
        if (response.ok) {
          const data = await response.json();
          // Handle both array response and { data: [...] } response format
          const genresData = Array.isArray(data) ? data : data.data || [];
          setAvailableGenres(genresData);
        }
      } catch (error) {
        console.error('Error fetching genres:', error);
      } finally {
        setIsLoadingGenres(false);
      }
    };
    fetchGenres();
  }, []);

  // Calculate reserved genres for highlighting
  const reservedGenres = new Set(userReservations.flatMap(r => r.genres || []));

  const totalReservationPages = Math.ceil(userReservations.length / RESERVATIONS_PER_PAGE);
  const currentReservations = userReservations.slice(
    (currentReservationPage - 1) * RESERVATIONS_PER_PAGE,
    currentReservationPage * RESERVATIONS_PER_PAGE
  );

  const handleDownloadQR = async (reservationId: number) => {
    try {
      setDownloadingReservationId(reservationId);
      const token = localStorage.getItem('token');
      if (!token) {
        setDownloadingReservationId(null);
        return;
      }

      const response = await fetch(`https://fluffy-train-xqwq79vrw7x29qpx-8080.app.github.dev/api/reservations/${reservationId}/qr-code`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reservation-${reservationId}-qr.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Failed to download QR code');
      }
    } catch (error) {
      console.error('Error downloading QR code:', error);
    } finally {
      setDownloadingReservationId(null);
    }
  };

  return (
    <Flex direction="column" gap="6" width="100%">
      <Box>
        <Heading size="8">Welcome, {user?.username || 'User'}!</Heading>
        <Text color="gray" size="4">Organize your next book fair participation</Text>
      </Box>

      <Grid columns={{ initial: '1', md: '2' }} gap="6">
        {/* Upcoming Events Section */}
        <Card size="3" style={{ gridColumn: '1 / -1' }}>
          <Flex direction="column" gap="4">
            <Heading size="5">Upcoming Events</Heading>
            {isLoadingEvents ? (
              <Flex gap="4" style={{ overflow: 'hidden' }}>
                {[1, 2, 3].map((i) => (
                  <Card key={i} style={{ minWidth: '300px' }}>
                    <Flex direction="column" gap="2">
                      <Flex justify="between">
                        <Skeleton width="60px" height="20px" />
                        <Skeleton width="80px" height="20px" />
                      </Flex>
                      <Skeleton width="70%" height="24px" />
                      <Skeleton width="100%" height="16px" />
                      <Flex gap="2" mt="2">
                        <Skeleton width="16px" height="16px" />
                        <Skeleton width="100px" height="16px" />
                      </Flex>
                    </Flex>
                  </Card>
                ))}
              </Flex>
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
              <Flex direction="column" gap="3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} variant="surface">
                    <Flex direction="column" gap="2">
                      <Flex justify="between" align="start">
                        <Flex direction="column" gap="1">
                          <Skeleton width="150px" height="20px" />
                          <Skeleton width="120px" height="16px" />
                          <Skeleton width="80px" height="14px" />
                        </Flex>
                        <Flex direction="column" align="end" gap="2">
                          <Skeleton width="60px" height="20px" />
                          <Skeleton width="80px" height="24px" />
                        </Flex>
                      </Flex>
                      <Flex gap="1">
                         <Skeleton width="50px" height="16px" />
                         <Skeleton width="50px" height="16px" />
                      </Flex>
                    </Flex>
                  </Card>
                ))}
              </Flex>
            ) : userReservations.length === 0 ? (
              <Text color="gray" style={{ fontStyle: 'italic' }}>
                You haven't reserved any stalls yet.
              </Text>
            ) : (
              <>
              <Flex direction="column" gap="3">
                {currentReservations.map(reservation => (
                  <Card key={reservation.id} variant="surface">
                    <Flex direction="column" gap="2">
                      <Flex justify="between" align="start">
                        <Flex direction="column" gap="1">
                          <Text weight="bold" size="2">{reservation.eventName}</Text>
                          <Text size="2" color="gray">Stall: {reservation.stallNumber} (Hall {reservation.hallNumber})</Text>
                          <Text size="1" color="gray">Code: {reservation.reservationCode}</Text>
                        </Flex>
                        <Flex direction="column" align="end" gap="2">
                          <Badge color={reservation.status === 'CONFIRMED' ? 'green' : 'orange'}>
                            {reservation.status}
                          </Badge>
                          <Button 
                            size="1" 
                            variant="outline" 
                            onClick={() => handleDownloadQR(reservation.id)} 
                            style={{ cursor: 'pointer' }}
                            disabled={downloadingReservationId === reservation.id}
                          >
                            {downloadingReservationId === reservation.id ? (
                              "Downloading..."
                            ) : (
                              <>
                                <DownloadIcon /> QR Code
                              </>
                            )}
                          </Button>
                        </Flex>
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

              {totalReservationPages > 1 && (
                <Flex justify="center" align="center" gap="4" mt="4">
                  <Button 
                    variant="soft" 
                    disabled={currentReservationPage === 1}
                    onClick={() => setCurrentReservationPage(prev => prev - 1)}
                  >
                    <ChevronLeftIcon /> Previous
                  </Button>
                  
                  <Text size="2">
                    Page {currentReservationPage} of {totalReservationPages}
                  </Text>

                  <Button 
                    variant="soft" 
                    disabled={currentReservationPage === totalReservationPages}
                    onClick={() => setCurrentReservationPage(prev => prev + 1)}
                  >
                    Next <ChevronRightIcon />
                  </Button>
                </Flex>
              )}
            </>
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

            <Flex direction="column" gap="3">
              <Grid gap="4" align="center" style={{ gridTemplateColumns: '200px 1fr', borderBottom: '1px solid var(--gray-4)', paddingBottom: '8px' }}>
                <Text size="2" weight="bold">Genre</Text>
                <Text size="2" weight="bold">Description</Text>
              </Grid>

              {isLoadingGenres ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Grid key={i} gap="4" align="center" style={{ gridTemplateColumns: '200px 1fr' }}>
                    <Flex gap="2" align="center">
                      <Skeleton width="16px" height="16px" />
                      <Skeleton width="100px" height="16px" />
                    </Flex>
                    <Skeleton width="100%" height="16px" />
                  </Grid>
                ))
              ) : (
                availableGenres.map(genre => {
                  const isReserved = reservedGenres.has(genre.name);
                  return (
                    <Grid key={genre.id} gap="4" align="center" style={{ gridTemplateColumns: '200px 1fr' }}>
                      <Flex gap="2" align="center">
                        <Checkbox 
                          checked={isReserved}
                          disabled
                        />
                        <Text 
                          size="2" 
                          weight={isReserved ? "bold" : "regular"} 
                          color={isReserved ? "blue" : undefined}
                        >
                          {genre.name}
                        </Text>
                      </Flex>
                      <Text size="2" color="gray">{genre.description}</Text>
                    </Grid>
                  );
                })
              )}
            </Flex>
          </Flex>
        </Card>
      </Grid>
    </Flex>
  );
}
