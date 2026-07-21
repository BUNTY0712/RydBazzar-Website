import { baseApi } from "./baseApi";
import {
  FareQuoteRequest,
  FareQuoteResponse,
} from "./interface";

export const homeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<any, any>({
      query: (credentials) => ({
        url: "/admin-login",
        method: "POST",
        body: credentials,
      }),
    }),

    getBestPriceWithoutToll: builder.mutation<FareQuoteResponse, FareQuoteRequest>({
      query: (body) => ({
        url: "/api/public/fare-quote/best-price-without-toll",
        method: "POST",
        body,
      }),
    }),

    // Added to support Toll State Tax & Inclusive Price tab clicks
    getBestPriceWithToll: builder.mutation<FareQuoteResponse, FareQuoteRequest>({
      query: (body) => ({
        url: "/api/public/fare-quote/best-price-with-toll",
        method: "POST",
        body,
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

    // ✈️ Airport Corridor Pickup Mutations (Mirrored from Mobile API specification)
    getCorridorPickupSuggestions: builder.mutation<any, { fromQuery: string; limit?: number }>({
      query: ({ fromQuery, limit = 10 }) => ({
        url: "/api/public/airports/corridor-suggestions/from",
        method: "POST",
        body: {
          fromQuery,
          limit,
        },
      }),
    }),

    // ✈️ Airport Corridor Dropoff Mutations (Mirrored from Mobile API specification)
    getCorridorDropSuggestions: builder.mutation<
      any,
      {
        fromLatitude: number;
        fromLongitude: number;
        q?: string;
        limit?: number;
        fromPlaceId?: string;
        fromAirportMasterId?: string;
      }
    >({
      query: ({
        fromLatitude,
        fromLongitude,
        q = "",
        limit = 10,
        fromPlaceId,
        fromAirportMasterId,
      }) => ({
        url: "/api/public/airports/corridor-suggestions/to",
        method: "POST",
        body: {
          fromLatitude,
          fromLongitude,
          q,
          limit,
          fromPlaceId,
          fromAirportMasterId,
        },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetBestPriceWithoutTollMutation,
  useGetBestPriceWithTollMutation, 
  useGetLocationSuggestionsQuery,
  useLazyGetLocationSuggestionsQuery,
  // Exporting the matching hook triggers for your components
  useGetCorridorPickupSuggestionsMutation,
  useGetCorridorDropSuggestionsMutation,
} = homeApi;