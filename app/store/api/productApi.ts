import { baseApi } from "./baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get All Products
    getAllProducts: builder.query({
      query: () => ({
        url: "get-all-products",
        method: "GET",
      }),
      providesTags: ["Products"],
    }),

    // Get Single Product
    getProductById: builder.query({
      query: (id) => ({
        url: `get-product/${id}`,
        method: "GET",
      }),
    }),
    deleteProductImage: builder.mutation({
      query: (imageId) => ({
        url: `delete-product-image/${imageId}`,
        method: "DELETE",
      }),
      // Automatically triggers re-fetching product arrays across your components
      invalidatesTags: ["Products"], 
    }),

    // Create Product
    createProduct: builder.mutation({
      query: (formData) => ({
        url: "create-product",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),

    // Update Product
    updateProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `update-product/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),

    // Delete Product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `delete-product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useDeleteProductImageMutation, // Add this here
} = productApi;