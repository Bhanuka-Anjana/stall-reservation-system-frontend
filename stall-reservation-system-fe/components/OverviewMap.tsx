"use client";

import { Box, Flex, Text, Card } from "@radix-ui/themes";

interface OverviewMapProps {
  onHallSelect: (hallId: number) => void;
  hallStats: { id: number; total: number; available: number }[];
}

export function OverviewMap({ onHallSelect, hallStats }: OverviewMapProps) {
  // Mock venue layout with 4 halls
  const halls = [
    { id: 1, name: "Hall 1", top: '10%', left: '5%', width: '42%', height: '35%', color: 'var(--blue-8)' },
    { id: 2, name: "Hall 2", top: '10%', left: '53%', width: '42%', height: '35%', color: 'var(--plum-8)' },
    { id: 3, name: "Hall 3", top: '55%', left: '5%', width: '42%', height: '35%', color: 'var(--orange-8)' },
    { id: 4, name: "Hall 4", top: '55%', left: '53%', width: '42%', height: '35%', color: 'var(--green-8)' },
  ];

  return (
    <Flex direction="column" gap="4" width="100%" height="100%">
      <Text size="5" weight="bold">Venue Overview</Text>
      <Text size="2" color="gray">Select a suitable hall and go inside of it and explore the stalls.</Text>
      
      <Box 
        style={{ 
          border: '2px solid var(--gray-5)', 
          borderRadius: 'var(--radius-3)',
          backgroundColor: 'var(--gray-2)',
          padding: '20px',
          position: 'relative',
          flex: 1,
          minHeight: '500px',
        }}
      >
        {halls.map((hall) => {
          const stats = hallStats.find(s => s.id === hall.id);
          const isAvailable = !!stats;
          
          return (
            <Card 
              key={hall.id} 
              onClick={() => isAvailable && onHallSelect(hall.id)}
              style={{ 
                position: 'absolute',
                top: hall.top,
                left: hall.left,
                width: hall.width,
                height: hall.height,
                backgroundColor: isAvailable ? hall.color : 'var(--gray-8)',
                cursor: isAvailable ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s',
                opacity: isAvailable ? 1 : 0.7,
              }}
              className={isAvailable ? "hover:scale-[1.02] hover:shadow-lg" : ""}
            >
              <Flex direction="column" align="center" gap="1">
                <Text size="6" weight="bold" color={isAvailable ? undefined : 'gray'}>{hall.name}</Text>
                {isAvailable ? (
                    <>
                        <Text size="2">
                            Available: {stats.available}
                        </Text>
                        <Text size="2">
                            Total: {stats.total}
                        </Text>
                        <Text size="1" color="gray">Click to view layout</Text>
                    </>
                ) : (
                    <Text size="2" color="gray" weight="bold">Unavailable</Text>
                )}
              </Flex>
            </Card>
          );
        })}
      </Box>
    </Flex>
  );
}
