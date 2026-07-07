import { baseApi } from "./baseApi";

export const subCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get All Sub Categories
    getAllSubCategories: builder.query({
      query: () => ({
        url: "get-all-sub-categories",
        method: "GET",
      }),
      providesTags: ["Projects"],
    }),

    // Get Single Sub Category
    getSubCategoryById: builder.query({
      query: (id) => ({
        url: `get-sub-category/${id}`,
        method: "GET",
      }),
    }),

    // Create Sub Category
    createSubCategory: builder.mutation({
      query: (formData) => ({
        url: "create-sub-category",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Projects"],
    }),

    // Update Sub Category
    updateSubCategory: builder.mutation({
      query: ({ id, formData }) => ({
        url: `update-sub-category/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Projects"],
    }),

    // Delete Sub Category
    deleteSubCategory: builder.mutation({
      query: (id) => ({
        url: `delete-sub-category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),
  }),
});

export const {
  useGetAllSubCategoriesQuery,
  useGetSubCategoryByIdQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = subCategoryApi;