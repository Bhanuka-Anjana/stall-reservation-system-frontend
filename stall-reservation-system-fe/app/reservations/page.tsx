import { Flex, Text, Container, Box, Card, Badge, Grid, Separator } from "@radix-ui/themes";
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