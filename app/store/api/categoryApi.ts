import { baseApi } from "./baseApi";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get All Categories
    getAllCategories: builder.query({
      query: () => ({
        url: "get-all-categories",
        method: "GET",
      }),
      providesTags: ["Projects"],
    }),

    // Get Single Category
    getCategoryById: builder.query({
      query: (id) => ({
        url: `get-categories/${id}`,
        method: "GET",
      }),
    }),

    // Create Category
    createCategory: builder.mutation({
      query: (formData) => ({
        url: "create-category",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Projects"],
    }),

    // Update Category
    updateCategory: builder.mutation({
      query: ({ id, formData }) => ({
        url: `update-category/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Projects"],
    }),

    // Delete Category
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `delete-category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;