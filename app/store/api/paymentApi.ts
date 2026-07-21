import { baseApi } from "./baseApi";
import {
  FareQuoteRequest,
  FareQuoteResponse,
} from "./interface";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAvailableAddons: builder.query<any, void>({
      query: () => ({
        url: "/api/public/addons/available",
        method: "GET",
      }),
    }),

    createFinalBooking: builder.mutation<any, any>({
      query: (bookingData) => ({
        url: "/api/user/bookings",
        method: "POST",
        body: bookingData,
      }),
    }),

    getLocationSuggestions: builder.query<any, { query: string; location?: string; limit?: number }>({
      query: ({ query, location, limit = 10 }) => {
        let url = `/api/public/maps/autocomplete?query=${encodeURIComponent(query)}`;
        if (location) url += `&location=${encodeURIComponent(location)}`;
        if (limit) url += `&limit=${limit}`;
        return { url, method: "GET" };
      },
    }),
  }),
});

export const {
  useGetAvailableAddonsQuery,
  useCreateFinalBookingMutation, // Exported mutation hook
  useGetLocationSuggestionsQuery,
  useLazyGetLocationSuggestionsQuery,
} = paymentApi;