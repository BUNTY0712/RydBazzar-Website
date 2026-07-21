import { baseApi } from "./baseApi";

export const tripApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Added the requested global user bookings query
    getUserBookings: builder.query<
      any,
      {
        mobile?: string;
        page?: number;
        size?: number;
        sortBy?: string;
        sortDir?: string;
      }
    >({
      query: ({
        mobile,
        page = 0,
        size = 20,
        sortBy = "createdAt",
        sortDir = "DESC",
      }) => {
        let url = `/api/user/bookings?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;

        if (mobile) {
          url += `&mobile=${mobile}`;
        }

        return {
          url,
          method: "GET",
        };
      },
    }),

    getPastTrips: builder.query<any, { mobile?: string; page?: number; size?: number }>({
      query: ({ mobile, page = 0, size = 20 }) => {
        let url = `/api/user/bookings/past?page=${page}&size=${size}`;
        if (mobile) url += `&mobile=${mobile}`;
        return { url, method: "GET" };
      },
    }),

    getCurrentTrips: builder.query<any, { mobile?: string; page?: number; size?: number }>({
      query: ({ mobile, page = 0, size = 20 }) => {
        let url = `/api/user/bookings/current?page=${page}&size=${size}`;
        if (mobile) url += `&mobile=${mobile}`;
        return { url, method: "GET" };
      },
    }),

    getUpcomingTrips: builder.query<any, { mobile?: string; page?: number; size?: number }>({
      query: ({ mobile, page = 0, size = 20 }) => {
        let url = `/api/user/bookings/upcoming?page=${page}&size=${size}`;
        if (mobile) url += `&mobile=${mobile}`;
        return { url, method: "GET" };
      },
    }),
  }),
});

export const {
  useGetUserBookingsQuery,
  useLazyGetUserBookingsQuery,
  useGetPastTripsQuery,
  useLazyGetPastTripsQuery,
  useGetCurrentTripsQuery,
  useLazyGetCurrentTripsQuery,
  useGetUpcomingTripsQuery,
  useLazyGetUpcomingTripsQuery,
} = tripApi;