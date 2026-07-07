import { baseApi } from "./baseApi"
import { CreateClientRequest, CreateClientResponse, CreateEmployeeResponse, CreateProjectRequest, CreateProjectResponse, GetClientsResponse, GetEmployeesResponse, GetProjectsResponse, RegisterRequest, RegisterResponse, UpdateClientRequest, UpdateClientResponse, UpdateProjectRequest, UpdateProjectResponse } from "./interface"

export interface LoginRequest {
  password: string
  email: string
}

export interface LoginResponse {
  token: string
  message?: string   // ✅ add this
  user?: any         // optional if exists
}

export interface SendOtpRequest {
  mobile: string
}

export interface VerifyOtpRequest {
  mobile: string
  otp: string
}

export interface ResetPasswordRequest {
  mobile: string
  otp: string
  password: string
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/admin-login",
        method: "POST",
        body: credentials,
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    // ✅ SEND OTP
    sendOtp: builder.mutation<any, SendOtpRequest>({
      query: (data) => ({
        url: "/send-otp",
        method: "POST",
        body: data,
      }),
    }),


    // ✅ VERIFY OTP
    verifyOtp: builder.mutation<any, VerifyOtpRequest>({
      query: (data) => ({
        url: "/verify-otp",
        method: "POST",
        body: data,
      }),
    }),

    // ✅ RESET PASSWORD
    resetPassword: builder.mutation<any, ResetPasswordRequest>({
      query: (data) => ({
        url: "/reset-password",
        method: "POST",
        body: data,
      }),
    }),
    getProjectById: builder.query<any, number>({
      query: (id) => ({
        url: `/get-project/${id}`,
        method: "GET",
      }),
    }),
    getProjects: builder.query<GetProjectsResponse, void>({
      query: () => ({
        url: "/get-all-projects",
        method: "GET",
      }),
      // This query "subscribes" to the Projects tag
      providesTags: ["Projects"],
    }),
    deleteProject: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/delete-projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"], // refresh project list
    }),
    createProject: builder.mutation<CreateProjectResponse, CreateProjectRequest>({
      query: (data) => ({
        url: "/create-projects",
        method: "POST",
        body: data,
      }),
      // This mutation "triggers" a refresh for anyone watching the Projects tag
      invalidatesTags: ["Projects"],
    }),

    updateProject: builder.mutation<UpdateProjectResponse, UpdateProjectRequest>({
      query: ({ id, ...body }) => ({
        url: `/update-projects/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Projects"], // refresh project list
    }),

    getClients: builder.query<GetClientsResponse, void>({
      query: () => ({
        url: "/get-all-clients",
        method: "GET",
      }),
      providesTags: ["Clients"],
    }),

    updateClient: builder.mutation<UpdateClientResponse, UpdateClientRequest>({
      query: ({ id, ...body }) => ({
        url: `/update-clients/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Clients"], // ✅ refresh client list
    }),

    getEmployees: builder.query<GetEmployeesResponse, void>({
      query: () => ({
        url: "/get-all-employees",
        method: "GET",
      }),
      // providesTags: ["Employees"],
    }),
    // Your existing definition:

    // Inside endpoints: (builder) => ({ ... })

    createClient: builder.mutation<CreateClientResponse, CreateClientRequest>({
      query: (data) => ({
        url: "/create-clients",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Clients"], // Refreshes the client list
    }),

    deleteClient: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/delete-clients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Clients"], // refresh client list
    }),

    deleteEmployee: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/delete-employees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Employees"], // refresh employee list
    }),
    updateEmployee: builder.mutation<
      { message: string; data: any },
      { id: number; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/update-employees/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Employees"], // refresh employee list
    }),
    // Add to endpoints in authApi
    createEmployee: builder.mutation<CreateEmployeeResponse, FormData>({
      query: (formData) => ({
        url: "/create-employees",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Employees"], // Assuming you use this tag for employee lists
    }),


    createDealer: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/create-dealers",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Dealers"],
    }),

    getDealers: builder.query<any, void>({
      query: () => ({
        url: "/get-dealers",
        method: "GET",
      }),
      providesTags: ["Dealers"],
    }),
    getUnassignedDealers: builder.query<any, void>({
      query: () => ({
        url: "/get-unassigned-dealers",
        method: "GET",
      }),
      providesTags: ["Dealers"],
    }),

    deleteDealer: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/delete-dealers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Dealers"],
    }),

    getLocations: builder.query<any, void>({
      query: () => ({
        url: "/get-locations",
        method: "GET",
      }),
      providesTags: ["Locations"],
    }),

    createLocation: builder.mutation<any, { location_name: string; dealers: number[] }>({
      query: (data) => ({
        url: "/create-location",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Locations"], // optional (if you later fetch locations)
    }),


    // Add this inside the endpoints: (builder) => ({ ... }) block
    uploadProjectAsset: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/project-upload-asset",
        method: "POST",
        body: formData,
      }),
    }),
    getProjectPdfs: builder.query<any, number>({
      query: (projectId) => ({
        url: `/project/${projectId}/pdfs`,
        method: "GET",
      }),
    }),
    getProjectExcels: builder.query<any, number>({
      query: (projectId) => ({
        url: `/project/${projectId}/excels`,
        method: "GET",
      }),
    }),

    getDealerById: builder.query<any, number>({
      query: (id) => ({
        url: `/get-dealers/${id}`,
        method: "GET",
      }),
    }),
    uploadDealerImages: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/upload-dealer-images",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Dealers"], // optional refresh
    }),


    deleteDealerImage: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/delete-dealer-image/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Dealers"], // refresh dealer data
    }),

    getDashboardContent: builder.query<any, void>({
      query: () => ({
        url: "/get-all-dashboard-content",
        method: "GET",
      }),
    }),

    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (data) => ({
        url: "/admin/register",   // 👉 your endpoint
        method: "POST",
        body: data,
        invalidatesTags: ["Users"], // Invalidate users cache on successful registration
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useLogoutMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useRegisterMutation,
  useCreateProjectMutation,   // ✅ add this
  useGetClientsQuery,   // ✅ ADD THIS
  useGetEmployeesQuery,   // ✅ ADD THIS
  useGetProjectsQuery,
  useCreateClientMutation, // ✅ ADD THIS
  useCreateEmployeeMutation,
  useDeleteEmployeeMutation,
  useDeleteProjectMutation,
  useDeleteClientMutation,
  useUpdateProjectMutation,
  useUpdateEmployeeMutation,
  useUpdateClientMutation,
  useGetProjectByIdQuery,
  useCreateDealerMutation,
  useGetDealersQuery,
  useDeleteDealerMutation,
  useCreateLocationMutation,
  useGetLocationsQuery,
  useGetUnassignedDealersQuery,
  useUploadProjectAssetMutation,
  useGetProjectPdfsQuery,
  useGetProjectExcelsQuery,
  useGetDealerByIdQuery,
  useUploadDealerImagesMutation,
  useDeleteDealerImageMutation,
  useGetDashboardContentQuery,

} = authApi