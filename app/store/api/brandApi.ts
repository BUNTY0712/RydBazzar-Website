import { baseApi } from "./baseApi";

export const brandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // Get All Brands
    getAllBrands: builder.query({
      query: () => ({
        url: "get-all-brands",
        method: "GET",
      }),
      providesTags: ["Brands"],
    }),

    // Get Single Brand
    getBrandById: builder.query({
      query: (id) => ({
        url: `get-brand/${id}`,
        method: "GET",
      }),
    }),

    // Create Brand
    createBrand: builder.mutation({
      query: (formData) => ({
        url: "create-brand",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Brands"],
    }),

    // Update Brand
    updateBrand: builder.mutation({
      query: ({ id, formData }) => ({
        url: `update-brand/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Brands"],
    }),

    // Delete Brand
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `delete-brand/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brands"],
    }),

  }),
});

export const {
  useGetAllBrandsQuery,
  useGetBrandByIdQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;