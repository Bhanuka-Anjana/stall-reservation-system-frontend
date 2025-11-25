"use client";

import { Box, Flex, Text, Card } from "@radix-ui/themes";
import { Stall } from "@/types";
import { MAP_ROWS, MAP_COLS } from "@/utils/layoutGenerator";

interface MapContainerProps {
  mapId: number;
  stalls: Stall[];
  selectedStallIds?: string[];
  myReservedStallIds?: string[];
  onStallClick?: (stall: Stall) => void;
}

export function MapContainer({ mapId, stalls, selectedStallIds = [], myReservedStallIds = [], onStallClick }: MapContainerProps) {
  console.log("MapContainer rendered", { mapId, stallsCount: stalls.length, selectedStallIds });

  return (
    <Flex direction="column" gap="4" width="100%" height="100%">
      <Text size="5" weight="bold">Hall {mapId}</Text>
      
      {/* The Big Map Container */}
      <Box 
        style={{ 
          border: '2px solid var(--gray-5)', 
          borderRadius: 'var(--radius-3)',
          backgroundColor: 'var(--gray-2)',
          padding: '20px',
          position: 'relative',
          flex: 1,
          minHeight: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${MAP_COLS}, 1fr)`,
            gridTemplateRows: `repeat(${MAP_ROWS}, 1fr)`,
            gap: '10px',
            width: '100%',
            height: '100%',
            aspectRatio: `${MAP_COLS}/${MAP_ROWS}`,
            maxHeight: '100%'
        }}>
            {stalls.map((stall) => (
                <div
                  key={stall.id}
                  style={{
                    gridColumn: `${stall.col + 1} / span ${stall.colSpan}`,
                    gridRow: `${stall.row + 1} / span ${stall.rowSpan}`,
                    width: '100%',
                    height: '100%',
                  }}
                  onClick={() => {
                    console.log("Card wrapper clicked", stall.id);
                    onStallClick?.(stall);
                  }}
                >
                <Card 
                  style={{ 
                    width: '100%',
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: stall.status === 'reserved' 
                      ? (myReservedStallIds.includes(stall.id) ? 'var(--purple-9)' : 'var(--gray-8)')
                      : selectedStallIds.includes(stall.id)
                        ? 'var(--blue-9)'
                        : 'var(--green-8)',
                    color: (selectedStallIds.includes(stall.id) || (stall.status === 'reserved' && myReservedStallIds.includes(stall.id))) ? 'white' : 'inherit',
                    cursor: 'pointer',
                    padding: '2px'
                  }}
                >
                  <Flex direction="column" align="center" style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
                    <Text size="1" weight="bold" style={{ fontSize: 'clamp(8px, 1vw, 12px)' }}>{stall.name}</Text>
                  </Flex>
                </Card>
                </div>
            ))}
        </div>
      </Box>
      
      <Flex gap="4" justify="center" pb="2">
        <Flex align="center" gap="2">
          <Box style={{ width: 16, height: 16, backgroundColor: 'var(--green-8)', border: '1px solid var(--green-6)' }} />
          <Text size="2">Available</Text>
        </Flex>
        <Flex align="center" gap="2">
          <Box style={{ width: 16, height: 16, backgroundColor: 'var(--gray-8)', border: '1px solid var(--gray-6)' }} />
          <Text size="2">Reserved</Text>
        </Flex>
        <Flex align="center" gap="2">
          <Box style={{ width: 16, height: 16, backgroundColor: 'var(--purple-9)', border: '1px solid var(--purple-10)' }} />
          <Text size="2">My Reservations</Text>
        </Flex>
        <Flex align="center" gap="2">
          <Box style={{ width: 16, height: 16, backgroundColor: 'var(--blue-9)', border: '1px solid var(--blue-10)' }} />
          <Text size="2">Selected</Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
