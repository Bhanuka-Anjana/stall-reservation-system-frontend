import { useState, useMemo, useEffect } from 'react';
import { Stall, Genre } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface StallResponse {
  id: number;
  stallNumber: string;
  hallNumber: string;
  eventId: number;
  size: string;
  pricePerStall: number;
  available: boolean;
  location: string;
}

export function useReservation(eventId: string) {
  const { isAuthenticated, user } = useAuth();
  const [cart, setCart] = useState<Stall[]>([]);
  const [myReservations, setMyReservations] = useState<string[]>([]);
  const [isLoadingStalls, setIsLoadingStalls] = useState(true);
  const [genres, setGenres] = useState<Genre[]>([]);
  
  // Initialize maps with fetched stalls
  const [maps, setMaps] = useState<{ id: number; stalls: Stall[] }[]>([]);

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        console.log('Fetching genres...');
        const response = await fetch('https://fluffy-train-xqwq79vrw7x29qpx-8080.app.github.dev/api/genres');
        if (response.ok) {
          const data = await response.json();
          console.log('Genres response:', data);
          const genresData = Array.isArray(data) ? data : data.data || [];
          const activeGenres = genresData.filter((g: Genre) => g.active);
          console.log('Active genres:', activeGenres);
          setGenres(activeGenres);
        } else {
          console.error('Failed to fetch genres, status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, []);

  // Fetch stalls from backend
  useEffect(() => {
    const fetchStalls = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://fluffy-train-xqwq79vrw7x29qpx-8080.app.github.dev/api/stalls/event/${eventId}`, {
          headers: token ? {
            'Authorization': `Bearer ${token}`
          } : {}
        });
        
        if (response.ok) {
          const data = await response.json();
          let stallsData: StallResponse[] = [];
          
          if (Array.isArray(data)) {
            stallsData = data;
          } else if (data && Array.isArray(data.data)) {
            stallsData = data.data;
          } else if (data && typeof data === 'object' && 'id' in data) {
            stallsData = [data];
          }
          
          // Group stalls by hall number
          const stallsByHall = new Map<number, Stall[]>();
          
          stallsData.forEach((stall) => {
            const hallNum = parseInt(stall.hallNumber);
            
            if (!stallsByHall.has(hallNum)) {
              stallsByHall.set(hallNum, []);
            }
            
            const sizeMap: { [key: string]: 'small' | 'medium' | 'large' } = {
              'SMALL': 'small',
              'MEDIUM': 'medium',
              'LARGE': 'large'
            };
            
            const size = sizeMap[stall.size.toUpperCase()] || 'medium';
            const rowSpan = 1; // Height is always the same
            const colSpan = size === 'large' ? 3 : size === 'medium' ? 2 : 1;
            
            // Get current hall's stalls to calculate proper positioning
            const hallStalls = stallsByHall.get(hallNum)!;
            const indexInHall = hallStalls.length;
            
            const transformedStall: Stall = {
              id: `${stall.id}`,
              name: stall.stallNumber,
              size: size,
              status: stall.available ? 'available' : 'reserved',
              row: Math.floor(indexInHall / 5),
              col: indexInHall % 5,
              rowSpan: rowSpan,
              colSpan: colSpan
            };
            
            hallStalls.push(transformedStall);
          });
          
          // Create maps array from grouped stalls and place them on border and middle square
          const mapsArray = Array.from(stallsByHall.entries()).map(([hallId, stalls]) => {
            // Define grid size (6 rows x 13 cols)
            const GRID_ROWS = 6;
            const GRID_COLS = 13;
            
            // Inner square configuration
            const INNER_ROW_START = 2;
            const INNER_ROW_END = 3;
            const INNER_COL_START = 4;
            const INNER_COL_END = 8;
            
            // Function to check if position is on border or inner square boundary
            const isValidPosition = (r: number, c: number) => {
              const isBorder = r === 0 || r === GRID_ROWS - 1 || c === 0 || c === GRID_COLS - 1;
              const isInnerRow = r === INNER_ROW_START || r === INNER_ROW_END;
              const isInnerCol = c === INNER_COL_START || c === INNER_COL_END;
              const isInnerRectBoundary = (isInnerRow && c >= INNER_COL_START && c <= INNER_COL_END) ||
                                          (isInnerCol && r >= INNER_ROW_START && r <= INNER_ROW_END);
              return isBorder || isInnerRectBoundary;
            };
            
            // Generate all valid positions
            const validPositions: { row: number; col: number }[] = [];
            for (let r = 0; r < GRID_ROWS; r++) {
              for (let c = 0; c < GRID_COLS; c++) {
                if (isValidPosition(r, c)) {
                  validPositions.push({ row: r, col: c });
                }
              }
            }
            
            // Place fetched stalls in valid positions, then fill remaining with "not available"
            const filledStalls: Stall[] = [];
            const occupiedCells = new Set<string>();
            
            // Helper to check if a stall can fit at a position
            const canFitStall = (row: number, col: number, colSpan: number) => {
              if (col + colSpan > GRID_COLS) return false;
              for (let c = col; c < col + colSpan; c++) {
                if (occupiedCells.has(`${row}-${c}`)) return false;
                if (!isValidPosition(row, c)) return false;
              }
              return true;
            };
            
            // Mark cells as occupied
            const markOccupied = (row: number, col: number, colSpan: number) => {
              for (let c = col; c < col + colSpan; c++) {
                occupiedCells.add(`${row}-${c}`);
              }
            };
            
            // Place fetched stalls
            let posIndex = 0;
            for (const stall of stalls) {
              let placed = false;
              // Try to find a valid position for this stall
              while (posIndex < validPositions.length && !placed) {
                const pos = validPositions[posIndex];
                if (canFitStall(pos.row, pos.col, stall.colSpan)) {
                  filledStalls.push({
                    ...stall,
                    row: pos.row,
                    col: pos.col
                  });
                  markOccupied(pos.row, pos.col, stall.colSpan);
                  placed = true;
                }
                posIndex++;
              }
              if (!placed) break; // No more space for stalls
            }
            
            // Fill remaining valid positions with empty stalls
            for (let i = 0; i < validPositions.length; i++) {
              const pos = validPositions[i];
              if (!occupiedCells.has(`${pos.row}-${pos.col}`)) {
                filledStalls.push({
                  id: `empty-${hallId}-${i}`,
                  name: '—',
                  size: 'small',
                  status: 'reserved',
                  row: pos.row,
                  col: pos.col,
                  rowSpan: 1,
                  colSpan: 1
                });
              }
            }
            
            return {
              id: hallId,
              stalls: filledStalls
            };
          });
          
          setMaps(mapsArray);
        }
      } catch (error) {
        console.error('Error fetching stalls:', error);
        toast.error('Failed to load stalls');
      } finally {
        setIsLoadingStalls(false);
      }
    };
    
    if (eventId) {
      fetchStalls();
    }
  }, [eventId]);

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

  const updateStallGenres = (stallId: string, genreId: string, checked: boolean) => {
    setCart(prev => prev.map(stall => {
      if (stall.id === stallId) {
        const currentGenres = stall.genres || [];
        const updatedGenres = checked
          ? [...currentGenres, genreId]
          : currentGenres.filter(g => g !== genreId);
        return { ...stall, genres: updatedGenres };
      }
      return stall;
    }));
  };

  const processReservation = async (): Promise<boolean> => {
    if (cart.length === 0) return false;

    // Check if all stalls have at least one genre selected
    const stallsWithoutGenre = cart.filter(s => !s.genres || s.genres.length === 0);
    if (stallsWithoutGenre.length > 0) {
      toast.error('Please select at least one genre for all stalls');
      return false;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to make a reservation');
      return false;
    }

    try {
      let successCount = 0;
      const reservations = [];

      // Process each stall reservation one at a time
      for (const stall of cart) {
        const genreIds = stall.genres?.map(g => parseInt(g)) || [];
        
        const requestBody = {
          eventId: parseInt(eventId),
          stallId: parseInt(stall.id),
          genreIds: genreIds
        };

        console.log('Creating reservation:', requestBody);

        const response = await fetch('https://fluffy-train-xqwq79vrw7x29qpx-8080.app.github.dev/api/reservations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(requestBody)
        });

        const result = await response.json();
        
        if (response.ok && result.success) {
          successCount++;
          reservations.push(result.data);
          console.log('Reservation created:', result.data);
        } else {
          toast.error(result.message || `Failed to reserve stall ${stall.name}`);
          console.error('Reservation failed:', result);
        }
      }

      if (successCount > 0) {
        // Update map state for successfully reserved stalls
        setMaps(prev => prev.map(m => ({
          ...m,
          stalls: m.stalls.map(s => {
            const inCart = cart.find(c => c.id === s.id);
            return inCart ? { ...s, status: 'reserved' as const, genres: inCart.genres } : s;
          })
        })));

        addUserReservations(cart.map(s => s.id));
        toast.success(`${successCount} stall(s) reserved successfully!`);
        setCart([]);
        return true;
      } else {
        toast.error('Failed to create any reservations');
        return false;
      }
    } catch (error) {
      console.error('Error processing reservations:', error);
      toast.error('An error occurred while processing reservations');
      return false;
    }
  };

  return {
    maps,
    hallStats,
    cart,
    myReservations,
    genres,
    toggleCartItem,
    removeFromCart,
    updateStallGenres,
    processReservation
  };
}