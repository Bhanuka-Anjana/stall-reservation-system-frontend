"use client";

import { Container, Heading, Grid, Card, Flex, Text, Badge, Button, Box } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { Event } from "@/types";
import Link from "next/link";
import { CalendarIcon, SewingPinIcon } from "@radix-ui/react-icons";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://fluffy-train-xqwq79vrw7x29qpx-8080.app.github.dev/api/events');
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
  }, []);

  return (
    <Container size="4" p="4">
      <Heading size="8" mb="6">All Events</Heading>

      {isLoading ? (
        <Text>Loading events...</Text>
      ) : events.length === 0 ? (
        <Text>No events found.</Text>
      ) : (
        <Grid columns={{ initial: '1', md: '2', lg: '3' }} gap="4">
          {events.map(event => (
            <Card key={event.id} size="3">
              <Flex direction="column" gap="3" height="100%">
                <Flex justify="between" align="start">
                  <Badge color={event.status === 'ONGOING' ? 'green' : event.status === 'UPCOMING' ? 'blue' : 'gray'}>
                    {event.status}
                  </Badge>
                  {event.registrationOpen && (
                    <Badge color="green" variant="outline">Registration Open</Badge>
                  )}
                </Flex>

                <Heading size="4">{event.name}</Heading>
                
                <Text size="2" color="gray" style={{ flex: 1 }}>
                  {event.description}
                </Text>

                <Box>
                  <Flex gap="2" align="center" mb="1">
                    <CalendarIcon />
                    <Text size="2">{event.startDate} - {event.endDate}</Text>
                  </Flex>
                  <Flex gap="2" align="center">
                    <SewingPinIcon />
                    <Text size="2">{event.venue}</Text>
                  </Flex>
                </Box>

                <Flex justify="between" align="center" mt="2">
                  <Text size="2" color="gray">
                    {event.availableStalls} / {event.totalStalls} Stalls Available
                  </Text>
                  <Link href={`/reservations?eventId=${event.id}`}>
                    <Button disabled={!event.registrationOpen}>
                      View Details
                    </Button>
                  </Link>
                </Flex>
              </Flex>
            </Card>
          ))}
        </Grid>
      )}
    </Container>
  );
}