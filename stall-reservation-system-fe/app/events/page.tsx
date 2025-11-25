"use client";

import { Container, Heading, Grid, Card, Flex, Text, Badge, Button, Box, Skeleton, IconButton } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { Event } from "@/types";
import Link from "next/link";
import { CalendarIcon, SewingPinIcon, ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/utils/apiConfig";

const ITEMS_PER_PAGE = 6;

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const endpoint = filter === 'upcoming' 
          ? `${API_BASE_URL}/events/upcoming`
          : `${API_BASE_URL}/events`;
          
        const response = await fetch(endpoint);
        if (response.ok) {
          const data = await response.json();
          setEvents(Array.isArray(data) ? data : data.data || []);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [filter]);

  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);
  const currentEvents = events.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll the content container to top, not the window
    const container = document.getElementById('events-scroll-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ height: 'calc(100vh - 65px)', display: 'flex', flexDirection: 'column' }}>
      <Box p="4" style={{ flex: 1, overflowY: 'auto' }} id="events-scroll-container">
        <Heading size="8" mb="6">{filter === 'upcoming' ? 'Upcoming Events' : 'All Events'}</Heading>

        {isLoading ? (
          <Grid columns={{ initial: '1', md: '2', lg: '3', xl: '4' }} gap="4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} size="2">
                <Flex direction="column" gap="2" height="100%">
                  <Flex justify="between" align="start">
                    <Skeleton width="60px" height="20px" />
                    <Skeleton width="100px" height="20px" />
                  </Flex>

                  <Skeleton width="80%" height="24px" />
                  
                  <Box style={{ flex: 1 }}>
                    <Skeleton width="100%" height="16px" />
                    <Skeleton width="90%" height="16px" style={{ marginTop: '4px' }} />
                  </Box>

                  <Box>
                    <Flex gap="2" align="center" mb="1">
                      <Skeleton width="16px" height="16px" />
                      <Skeleton width="120px" height="16px" />
                    </Flex>
                    <Flex gap="2" align="center">
                      <Skeleton width="16px" height="16px" />
                      <Skeleton width="150px" height="16px" />
                    </Flex>
                  </Box>

                  <Flex justify="between" align="center" mt="2">
                    <Skeleton width="100px" height="16px" />
                    <Skeleton width="100px" height="32px" />
                  </Flex>
                </Flex>
              </Card>
            ))}
          </Grid>
        ) : events.length === 0 ? (
          <Text>No events found.</Text>
        ) : (
          <Grid columns={{ initial: '1', md: '2', lg: '3', xl: '4' }} gap="4">
            {currentEvents.map(event => (
              <Card key={event.id} size="2">
                <Flex direction="column" gap="2" height="100%">
                  <Flex justify="between" align="start">
                    <Badge color={event.status === 'ONGOING' ? 'green' : event.status === 'UPCOMING' ? 'blue' : 'gray'}>
                      {event.status}
                    </Badge>
                    {event.registrationOpen && (
                      <Badge color="green" variant="outline">Registration Open</Badge>
                    )}
                  </Flex>

                  <Heading size="3">{event.name}</Heading>
                  
                  <Text size="2" color="gray" style={{ flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {event.description}
                  </Text>

                  <Box>
                    <Flex gap="2" align="center" mb="1">
                      <CalendarIcon />
                      <Text size="2">{event.startDate} - {event.endDate}</Text>
                    </Flex>
                    <Flex gap="2" align="center">
                      <SewingPinIcon />
                      <Text size="2" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.venue}</Text>
                    </Flex>
                  </Box>

                  <Flex justify="between" align="center" mt="1">
                    <Text size="2" color="gray">
                      {event.availableStalls} / {event.totalStalls} Stalls
                    </Text>
                    {isAuthenticated ? (
                      <Link href={`/reservations?eventId=${event.id}`}>
                        <Button size="1" disabled={!event.registrationOpen}>
                          View Details
                        </Button>
                      </Link>
                    ) : (
                      <Button size="1" disabled variant="soft">
                        Login to View
                      </Button>
                    )}
                  </Flex>
                </Flex>
              </Card>
            ))}
          </Grid>
        )}
      </Box>

      {/* Pagination Footer */}
      <Box 
        p="4" 
        style={{ 
          borderTop: '1px solid var(--gray-5)', 
          backgroundColor: 'var(--color-background)',
          flexShrink: 0,
          display: isLoading ? 'none' : 'block'
        }}
      >
        <Flex justify="center" align="center" gap="4">
          <Button 
            variant="soft" 
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <ChevronLeftIcon /> Previous
          </Button>
          
          <Text size="2">
            Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
          </Text>

          <Button 
            variant="soft" 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next <ChevronRightIcon />
          </Button>
        </Flex>
      </Box>
    </div>
  );
}
