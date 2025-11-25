"use client";

import { Flex, Box, Card, Heading, Text, Button, IconButton } from "@radix-ui/themes";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Event } from "@/types";
import Link from "next/link";
import { useRef } from "react";

interface EventCarouselProps {
  events: Event[];
}

export function EventCarousel({ events }: EventCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth; // Scroll one view width
      const newScrollLeft = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Flex align="center" gap="2">
        <IconButton 
          variant="soft" 
          radius="full" 
          onClick={() => scroll('left')}
          style={{ flexShrink: 0 }}
        >
          <ChevronLeftIcon width="20" height="20" />
        </IconButton>
        
        <div 
          ref={scrollContainerRef}
          style={{ 
            display: 'flex', 
            overflowX: 'auto', 
            scrollSnapType: 'x mandatory', 
            gap: '16px',
            padding: '4px',
            scrollbarWidth: 'none', // Hide scrollbar Firefox
            msOverflowStyle: 'none', // Hide scrollbar IE/Edge
            flex: 1
          }}
          className="no-scrollbar" // We'll need to ensure this class works or use inline styles
        >
          <style jsx global>{`
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {events.map(event => (
            <Box 
              key={event.id} 
              style={{ 
                minWidth: '300px', 
                maxWidth: '350px',
                flex: '0 0 auto', 
                scrollSnapAlign: 'center' 
              }}
            >
              <Card variant="surface" style={{ height: '100%' }}>
                <Flex direction="column" gap="2" height="100%">
                  <Box>
                    <Heading size="3">{event.name}</Heading>
                    <Text size="2" color="gray">{event.startDate} • {event.venue}</Text>
                  </Box>
                  <Text size="2" style={{ flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {event.description}
                  </Text>
                  <Link href={`/reservations?eventId=${event.id}`}>
                    <Button variant="solid" style={{ width: '100%', cursor: 'pointer' }}>
                      Reserve Stalls
                    </Button>
                  </Link>
                </Flex>
              </Card>
            </Box>
          ))}
        </div>

        <IconButton 
          variant="soft" 
          radius="full" 
          onClick={() => scroll('right')}
          style={{ flexShrink: 0 }}
        >
          <ChevronRightIcon width="20" height="20" />
        </IconButton>
      </Flex>
    </div>
  );
}
