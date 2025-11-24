import { useState, useMemo, useEffect } from 'react';
import { generateStalls } from '@/utils/layoutGenerator';
import { Stall } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export function useReservation(eventId: string) {
  const { isAuthenticated, user } = useAuth();
  const [cart, setCart] = useState<Stall[]>([]);
  const [myReservations, setMyReservations] = useState<string[]>([]);
  
  // Initialize maps with event-specific availability
  const [maps, setMaps] = useState(() => [1, 2, 3].map(id => ({
      id,
      stalls: generateStalls(id, eventId)
  })));

  // Load user reservations for this event
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`user_reservations_${user.id}_${eventId}`);
      if (stored) {
        try {
          setMyReservations(JSON.parse(stored));
        } catch {
          setMyReservations([]);
        }
      } else {
        setMyReservations([]);
      }
    } else {
      setMyReservations([]);
    }
  }, [user, eventId]);

  const hallStats = useMemo(() => maps.map(map => ({
      id: map.id,
      total: map.stalls.length,
      available: map.stalls.filter(s => s.status === 'available').length
  })), [maps]);

  const addUserReservations = (stallIds: string[]) => {
    if (!user) return;
    const updated = [...myReservations, ...stallIds];
    localStorage.setItem(`user_reservations_${user.id}_${eventId}`, JSON.stringify(updated));
    setMyReservations(updated);
  };

  const toggleCartItem = (stall: Stall) => {
    if (!isAuthenticated) {
      toast.error("Please login to reserve a stall");
      return;
    }

    if (stall.status === 'reserved') {
      // Check if it's reserved by the current user
      if (myReservations.includes(stall.id)) {
        toast.info("You have already reserved this stall");
      } else {
        toast.error("This stall is already booked");
      }
      return;
    }

    // Check if already in cart
    if (cart.some(s => s.id === stall.id)) {
      setCart(prev => prev.filter(s => s.id !== stall.id));
      return;
    }

    const currentReservationsCount = myReservations.length;
    
    if (currentReservationsCount + cart.length >= 3) {
      toast.error("Maximum reservation limit of 3 stalls reached");
      return;
    }

    setCart(prev => [...prev, stall]);
  };

  const removeFromCart = (stallId: string) => {
    setCart(prev => prev.filter(s => s.id !== stallId));
  };

  const processReservation = () => {
    if (cart.length === 0) return;

    // Update map state
    setMaps(prev => prev.map(m => ({
      ...m,
      stalls: m.stalls.map(s => {
        const inCart = cart.find(c => c.id === s.id);
        return inCart ? { ...s, status: 'reserved' as const } : s;
      })
    })));

    addUserReservations(cart.map(s => s.id));
    toast.success(`${cart.length} stall(s) reserved successfully!`);
    setCart([]);
  };

  return {
    maps,
    hallStats,
    cart,
    myReservations,
    toggleCartItem,
    removeFromCart,
    processReservation
  };
}