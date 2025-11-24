import { useState } from "react";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useReservation } from "@/hooks/useReservation";
import { useRouter } from "next/navigation";

interface BookfairMapProps {
  eventId: string;
}

export function BookfairMap({ eventId }: BookfairMapProps) {
  const [view, setView] = useState<'overview' | 'detail'>('overview');
  const [selectedHallId, setSelectedHallId] = useState<number | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  console.log("Rendering BookfairMap for eventId:", eventId);

  const { 
    maps, 
    hallStats, 
    cart, 
    myReservations,
    genres,
    toggleCartItem, 
    removeFromCart, 
    updateStallGenres,
    processReservation 
  } = useReservation(eventId);

  const handleHallSelect = (hallId: number) => {
      setSelectedHallId(hallId);
      setView('detail');
  };

  const handleBack = () => {
      setView('overview');
      setSelectedHallId(null);
  };

  const handleConfirmReservation = async () => {
    setIsProcessing(true);
    try {
      const success = await processReservation();
      if (success) {
        setShowConfirmDialog(false);
        // Navigate to home page
        router.push('/');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedMap = maps.find(m => m.id === selectedHallId);

  return (
    <Flex direction="column" gap="2" width="100%" height="100%" style={{ position: 'relative' }}>
      <AlertDialog.Root open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Confirm Reservation</AlertDialog.Title>
          <AlertDialog.Description size="2">
            Are you sure you want to reserve the following stalls?
            <ul>
              {cart.map(s => <li key={s.id}>{s.name} ({s.size})</li>)}
            </ul>
            Total: {cart.length} stall(s)
          </AlertDialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray" disabled={isProcessing}>
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button 
                variant="solid" 
                color="green" 
                onClick={handleConfirmReservation}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Confirm Reservation'}
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>

      {view === 'detail' && (
        <Button 
            variant="ghost" 
            onClick={handleBack} 
            style={{ alignSelf: 'flex-start', cursor: 'pointer' }}
        >
            <ArrowLeftIcon /> Back to Overview
        </Button>
      )}

      <Flex style={{ flex: 1, minHeight: 0, width: '100%' }}>
        {view === 'overview' ? (
            <OverviewMap onHallSelect={handleHallSelect} hallStats={hallStats} />
        ) : (
            selectedMap && (
                <MapContainer 
                  mapId={selectedMap.id} 
                  stalls={selectedMap.stalls} 
                  selectedStallIds={cart.map(s => s.id)}
                  myReservedStallIds={myReservations}
                  onStallClick={toggleCartItem}
                />
            )
        )}
      </Flex>

      {cart.length > 0 && (
        <Cart 
          items={cart}
          genres={genres}
          onRemove={removeFromCart}
          onGenreChange={updateStallGenres}
          onCheckout={() => setShowConfirmDialog(true)} 
        />
      )}