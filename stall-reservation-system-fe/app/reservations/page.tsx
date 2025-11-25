"use client";

import { Flex, Text, Container, Box, Card, Badge, Grid, Separator, Skeleton } from "@radix-ui/themes";
import { BookfairMap } from "@/components/BookfairMap";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { Event } from "@/types";
import { CalendarIcon, SewingPinIcon } from "@radix-ui/react-icons";

function ReservationsContent() {
  const searchParams = useSearchParams();
  const eventIdParam = searchParams.get('eventId');
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  
  useEffect(() => {
    if (!eventIdParam) {
      setIsLoadingEvent(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        const response = await fetch(`https://fluffy-train-xqwq79vrw7x29qpx-8080.app.github.dev/api/events/${eventIdParam}`);
        if (response.ok) {
          const data = await response.json();
          setEvent(data.data || data);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setIsLoadingEvent(false);
      }
    };
    fetchEvent();
  }, [eventIdParam]);

  const eventId = eventIdParam || 'default';

  return (
    <div style={{ height: 'calc(100vh - 65px)', overflow: 'hidden', display: 'flex', flexDirection: 'column', paddingRight: '280px' }}>
      <Container size="4" p="4" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        
        <Grid columns={{ initial: '1', md: '300px 1fr' }} gap="4" style={{ height: '100%' }}>
          
          {/* Left Sidebar - Event Details */}
          <Card style={{ height: '100%', overflowY: 'auto' }}>
            {isLoadingEvent ? (
              <Flex direction="column" gap="4">
                <Box>
                  <Skeleton width="60px" height="20px" style={{ marginBottom: '8px' }} />
                  <Skeleton width="100%" height="28px" />
                  <Skeleton width="80%" height="28px" style={{ marginTop: '4px' }} />
                </Box>

                <Separator size="4" />

                <Flex direction="column" gap="3">
                  <Flex gap="2" align="start">
                    <Skeleton width="18px" height="18px" />
                    <Box style={{ flex: 1 }}>
                      <Skeleton width="40px" height="16px" />
                      <Skeleton width="120px" height="16px" style={{ marginTop: '4px' }} />
                    </Box>
                  </Flex>

                  <Flex gap="2" align="start">
                    <Skeleton width="18px" height="18px" />
                    <Box style={{ flex: 1 }}>
                      <Skeleton width="50px" height="16px" />
                      <Skeleton width="100px" height="16px" style={{ marginTop: '4px' }} />
                    </Box>
                  </Flex>
                </Flex>

                <Separator size="4" />

                <Box>
                  <Skeleton width="80px" height="16px" style={{ marginBottom: '4px' }} />
                  <Skeleton width="100%" height="16px" />
                  <Skeleton width="100%" height="16px" style={{ marginTop: '4px' }} />
                  <Skeleton width="90%" height="16px" style={{ marginTop: '4px' }} />
                </Box>

                <Box style={{ backgroundColor: 'var(--gray-3)', padding: '10px', borderRadius: 'var(--radius-2)' }}>
                  <Flex justify="between" mb="1">
                    <Skeleton width="60px" height="14px" />
                    <Skeleton width="30px" height="14px" />
                  </Flex>
                  <Flex justify="between">
                    <Skeleton width="60px" height="14px" />
                    <Skeleton width="30px" height="14px" />
                  </Flex>
                </Box>
              </Flex>
            ) : event ? (
              <Flex direction="column" gap="4">
                <Box>
                  <Badge color="blue" mb="2">{event.status}</Badge>
                  <Text size="5" weight="bold" as="div" style={{ lineHeight: 1.2 }}>
                    {event.name}
                  </Text>
                </Box>

                <Separator size="4" />

                <Flex direction="column" gap="3">
                  <Flex gap="2" align="start">
                    <CalendarIcon width="18" height="18" style={{ marginTop: 2, flexShrink: 0 }} />
                    <Box>
                      <Text size="2" weight="bold" as="div">Date</Text>
                      <Text size="2" color="gray">
                        {event.startDate} to {event.endDate}
                      </Text>
                    </Box>
                  </Flex>

                  <Flex gap="2" align="start">
                    <SewingPinIcon width="18" height="18" style={{ marginTop: 2, flexShrink: 0 }} />
                    <Box>
                      <Text size="2" weight="bold" as="div">Venue</Text>
                      <Text size="2" color="gray">{event.venue}</Text>
                    </Box>
                  </Flex>
                </Flex>

                <Separator size="4" />

                <Box>
                  <Text size="2" weight="bold" mb="1" as="div">About Event</Text>
                  <Text size="2" color="gray">{event.description}</Text>
                </Box>

                <Box style={{ backgroundColor: 'var(--gray-3)', padding: '10px', borderRadius: 'var(--radius-2)' }}>
                  <Flex justify="between" mb="1">
                    <Text size="1">Total Stalls</Text>
                    <Text size="1" weight="bold">{event.totalStalls}</Text>
                  </Flex>
                  <Flex justify="between">
                    <Text size="1">Available</Text>
                    <Text size="1" weight="bold" color="green">{event.availableStalls}</Text>
                  </Flex>
                </Box>
              </Flex>
            ) : (
              <Flex direction="column" align="center" justify="center" height="100%">
                <Text color="gray">Select an event to view details</Text>
              </Flex>
            )}
          </Card>

          {/* Right Side - Map */}
          <Flex direction="column" gap="4" style={{ height: '100%', minHeight: 0 }}>
             <Box style={{ flex: 1, minHeight: 0, position: 'relative' }}>
                <BookfairMap eventId={eventId} />
             </Box>
          </Flex>

        </Grid>
      </Container>
    </div>
  );
}

export default function ReservationsPage() {
  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <ReservationsContent />
    </Suspense>
  );
}
