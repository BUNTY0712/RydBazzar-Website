import { baseApi } from "./baseApi";

export const rentalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Rental Booking
    createRentalBooking: builder.mutation<any, any>({
      query: (rentalData) => ({
        url: "/api/user/rentals",
        method: "POST",
        body: rentalData,
      }),
    }),

    // Get Rental Fare Quote
    getRentalFareQuote: builder.mutation<any, any>({
      query: (rentalFareData) => ({
        url: "/api/public/fare-quote/rental",
        method: "POST",
        body: rentalFareData,
      }),
    }),
  }),
});

export const {
  useCreateRentalBookingMutation,
  useGetRentalFareQuoteMutation,
} = rentalApi;