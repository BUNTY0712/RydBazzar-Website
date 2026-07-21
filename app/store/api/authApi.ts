import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Send OTP (Initiate Login)
    login: builder.mutation<any, { mobile: string; role: string }>({
      query: (formData) => ({
        url: "/api/user/auth/send-otp",
        method: "POST",
        body: formData,
      }),
    }),

    // 2. Verify OTP (Get JWT Token)
    verifyOtp: builder.mutation<any, { mobile: string; otp: string; role: string }>({
      query: (formData) => ({
        url: "/api/user/auth/verify-otp",
        method: "POST",
        body: formData,
      }),
    }),

    // 3. Admin Register
    register: builder.mutation<any, any>({
      query: (data) => ({
        url: "/admin/register",
        method: "POST",
        body: data,
        invalidatesTags: ["Users"], // Invalidates cache to refetch users list if needed
      }),
    }),
  }),
});

// Auto-generated hooks based on the endpoints defined above
export const {
  useLoginMutation,
  useVerifyOtpMutation,
  useRegisterMutation,
} = authApi;