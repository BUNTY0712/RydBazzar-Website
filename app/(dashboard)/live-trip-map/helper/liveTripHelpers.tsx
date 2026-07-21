export const WS_BANNER_DELAY_MS = 3000;

/**
 * Calculates exponential backoff delay for WebSocket reconnection.
 */
export const reconnectDelay = (attempt: number): number => {
  const base = 1000; // 1s base delay
  const max = 30000; // 30s max delay
  const delay = Math.min(max, base * Math.pow(1.8, attempt - 1));
  return delay + Math.random() * 500; // Add jitter
};

/**
 * Determines whether to attempt reconnect based on retry count.
 */
export const shouldReconnect = (attempts: number, stopped: boolean): boolean => {
  if (stopped) return false;
  return attempts < 20; // Maximum attempts
};

/**
 * Returns true if trip status indicates the trip has started or is in progress.
 */
export const isTripInProgress = (status?: string | null): boolean => {
  if (!status) return false;
  const normalized = status.toUpperCase();
  return normalized === 'STARTED' || normalized === 'IN_PROGRESS' || normalized === 'COMPLETED';
};

/**
 * Extracts or resolves booking ID from params or storage.
 */
export const resolveBookingId = (paramsBookingId?: string): string => {
  if (paramsBookingId) return paramsBookingId;
  if (typeof window !== 'undefined') {
    const stored = sessionStorage.getItem('activeInspectedBooking');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.bookingId || '';
      } catch (e) {
        console.error('Failed to parse activeInspectedBooking:', e);
      }
    }
  }
  return '';
};