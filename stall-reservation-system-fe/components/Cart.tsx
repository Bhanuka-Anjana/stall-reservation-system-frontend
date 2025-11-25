"use client";

import { Card, Flex, Text, Button, ScrollArea, Box, Separator } from "@radix-ui/themes";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Stall } from "@/types";

interface CartProps {
  items: Stall[];
  onRemove: (stallId: string) => void;
  onCheckout: () => void;
}

export function Cart({ items, onRemove, onCheckout }: CartProps) {
  if (items.length === 0) return null;

  return (
    <Card style={{ 
      position: 'fixed',
      right: '20px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '300px', 
      maxHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      zIndex: 50
    }}>
      <Flex direction="column" gap="3">
        <Flex justify="between" align="center">
          <Text size="3" weight="bold">Selected Stalls ({items.length})</Text>
        </Flex>
        
        <Separator size="4" />

        <ScrollArea type="auto" scrollbars="vertical" style={{ maxHeight: '200px' }}>
          <Flex direction="column" gap="2">
            {items.map(stall => (
              <Flex key={stall.id} justify="between" align="center" p="2" style={{ backgroundColor: 'var(--gray-3)', borderRadius: 'var(--radius-2)' }}>
                <Flex direction="column">
                  <Text size="2" weight="bold">{stall.name}</Text>
                  <Text size="1" color="gray">{stall.size} size</Text>
                </Flex>
                <Button variant="ghost" color="red" size="1" onClick={() => onRemove(stall.id)}>
                  <Cross2Icon />
                </Button>
              </Flex>
            ))}
          </Flex>
        </ScrollArea>

        <Separator size="4" />

        <Button onClick={onCheckout} size="2" variant="solid">
          Confirm Reservation
        </Button>
      </Flex>
    </Card>
  );
}
