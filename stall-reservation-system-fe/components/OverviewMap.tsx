"use client";

import { Box, Flex, Text, Card } from "@radix-ui/themes";

interface OverviewMapProps {
  onHallSelect: (hallId: number) => void;
  hallStats: { id: number; total: number; available: number }[];
}

export function OverviewMap({ onHallSelect, hallStats }: OverviewMapProps) {
  // Mock venue layout with 3 halls
  const halls = [
    { id: 1, name: "Hall 1", top: '10%', left: '5%', width: '42%', height: '35%', color: 'var(--blue-3)' },
    { id: 2, name: "Hall 2", top: '10%', left: '53%', width: '42%', height: '35%', color: 'var(--plum-3)' },
    { id: 3, name: "Hall 3", top: '55%', left: '29%', width: '42%', height: '35%', color: 'var(--orange-3)' },
  ];

  // Filter halls that have stalls
  const availableHalls = halls.filter(hall => 
    hallStats.some(stat => stat.id === hall.id)
  );

  if (availableHalls.length === 0) {
    return (
      <Flex direction="column" align="center" justify="center" width="100%" height="100%">
        <Text size="5" weight="bold" mb="2">No Stalls Available</Text>
        <Text size="3" color="gray">There are no stalls configured for this event yet.</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="4" width="100%" height="100%">
      <Text size="5" weight="bold">Venue Overview</Text>
      <Text size="2" color="gray">Select a hall to view details</Text>
      
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
        {availableHalls.map((hall) => {
          const stats = hallStats.find(s => s.id === hall.id);
          return (
            <Card 
              key={hall.id} 
              onClick={() => onHallSelect(hall.id)}
              style={{ 
                position: 'absolute',
                top: hall.top,
                left: hall.left,
                width: hall.width,
                height: hall.height,
                backgroundColor: hall.color,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s',
              }}
              className="hover:scale-[1.02] hover:shadow-lg"
            >
              <Flex direction="column" align="center" gap="1">
                <Text size="6" weight="bold">{hall.name}</Text>
                {stats && (
                    <>
                        <Text size="2">
                            Available: {stats.available}
                        </Text>
                        <Text size="2">
                            Total: {stats.total}
                        </Text>
                    </>
                )}
                <Text size="1" color="gray">Click to view layout</Text>
              </Flex>
            </Card>
          );
        })}
      </Box>
    </Flex>
  );
}
