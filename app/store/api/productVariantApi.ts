import { baseApi } from "./baseApi";

export const productVariantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Fetch all product variants (Matches: GET /get-all-product-variants)
    getAllProductVariants: builder.query({
      query: () => ({
        url: "/get-all-product-variants",
        method: "GET",
      }),
      providesTags: ["ProductVariants"],
    }),

    // 2. Fetch a single variant by its unique ID (Matches: GET /get-product-variants/{id})
    getProductVariantById: builder.query({
      query: (id) => ({
        url: `/get-product-variants/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "ProductVariants", id }],
    }),

    // 3. Create a brand new variant (Matches: POST /create-product-variant)
    createProductVariant: builder.mutation({
      query: (newVariant) => ({
        url: "/create-product-variant",
        method: "POST",
        body: newVariant,
      }),
      invalidatesTags: ["ProductVariants", "Products"], // Also invalidates main products to update dynamic totals if applicable
    }),

    // 4. Update an existing variant by ID (Matches: PUT /update-product-variant/{id})
    updateProductVariant: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `/update-product-variant/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ProductVariants", id },
        "ProductVariants",
        "Products",
      ],
    }),

    // 5. Delete a product variant by ID (Matches: DELETE /delete-product-variant/{id})
    deleteProductVariant: builder.mutation({
      query: (id) => ({
        url: `/delete-product-variant/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ProductVariants", "Products"],
    }),

    // 6. Fetch all variations tied specifically to one Product ID (Matches: GET /products/{productId}/variants)
    getVariantsByProductId: builder.query({
      query: (productId) => ({
        url: `/products/${productId}/variants`,
        method: "GET",
      }),
      providesTags: ["ProductVariants"],
    }),
  }),
});

// Auto-generated hooks based on the endpoints defined above
export const {
  useGetAllProductVariantsQuery,
  useGetProductVariantByIdQuery,
  useCreateProductVariantMutation,
  useUpdateProductVariantMutation,
  useDeleteProductVariantMutation,
  useGetVariantsByProductIdQuery,
} = productVariantApi;