import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
// || "http://127.0.0.1:8000/api"
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://paddle.icontattoozone.com/api",
    baseUrl: 'http://127.0.0.1:8000/api/',

    prepareHeaders: (headers) => {
      // attach token if exists
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ["Dashboard", "Auth", "Clients","Projects","Employees","Dealers","Locations","Products","Brands",'ProductVariants'],
  endpoints: () => ({}),
})