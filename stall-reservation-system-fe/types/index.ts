export type StallSize = 'small' | 'medium' | 'large';
export type StallStatus = 'reserved' | 'available';

export interface Stall {
  id: string;
  name: string;
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
  status: StallStatus;
  size: StallSize;
  genres?: string[];
}

export interface Genre {
  id: number;
  name: string;
  description: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MapConfig {
  id: number;
  rows: number;
  cols: number;
  stalls: Stall[];
}

export interface Event {
  id: string | number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  venue: string;
  status: string;
  registrationOpen: boolean;
  totalStalls: number;
  availableStalls: number;
}

export interface Reservation {
  id: number;
  reservationCode: string;
  qrCode: string;
  status: string;
  userId: number;
  userName: string;
  eventId: number;
  eventName: string;
  stallId: number;
  stallNumber: string;
  hallNumber: string;
  genres: string[];
  createdAt: string;
  confirmedAt: string;
}
