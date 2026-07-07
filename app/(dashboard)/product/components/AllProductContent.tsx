// AllProductContent.tsx
"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash,
  Loader2,
  Layers, // Added icon representation for variants layout
} from "lucide-react";

import {
  useGetAllProductsQuery,
  useDeleteProductMutation,
} from "@/app/store/api/productApi";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import Swal from "sweetalert2";

import { AddProductModal } from "./AddProductModal";
import { EditProductModal } from "./EditProductModal";
import { ManageVariantsModal } from "./ManageVariantsModal"; // Import the modal

export default function AllProductContent() {
  const { data, isLoading, refetch } = useGetAllProductsQuery({});
  const [deleteProduct] = useDeleteProductMutation();

  const products = data?.data || [];

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openVariants, setOpenVariants] = useState(false); // Modal control state logic
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(products.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = products.slice(startIndex, startIndex + itemsPerPage);

  const handleDeleteProduct = async (id: number) => {
    const result = await Swal.fire({
      title: "Delete Product?",
      text: "This action will also permanently delete all associated gallery photos!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete Everything",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteProduct(id).unwrap();
      Swal.fire("Deleted!", "Product and images wiped successfully.", "success");
      refetch();
    } catch (error: any) {
      Swal.fire("Error", error?.data?.message || "Delete failed", "error");
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(start + maxVisible - 1, totalPages);

    if (end - start < maxVisible - 1) {
      start = Math.max(end - maxVisible + 1, 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="p-0 bg-muted/30 min-h-screen">
      <div className="flex justify-end mb-6">
        <AddProductModal refetch={refetch} />
      </div>

      <Card className="rounded-2xl shadow-sm border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-cyan-500 to-slate-800 bg-clip-text text-transparent">
            All Products
          </CardTitle>
          <p className="text-sm text-muted-foreground">Manage all products and variations</p>
        </CardHeader>

        <CardContent>
          <div className="border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>ID</TableHead>
                  <TableHead>Media</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sub Category</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={11} className="h-24 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-cyan-600" />
                    </TableCell>
                  </TableRow>
                ) : currentData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="h-24 text-center text-sm text-muted-foreground">
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentData.map((product: any) => (
                    <TableRow key={product.id} className="group transition-colors">
                      <TableCell className="font-medium">#{product.id}</TableCell>

                      {/* Updated Media Gallery Preview Stack Component */}
                      <TableCell>
                        <div className="relative h-12 w-12 custom-media-stack">
                          {product.thumbnail_url ? (
                            <img
                              src={product.thumbnail_url}
                              alt={product.name}
                              className="h-12 w-12 rounded-lg object-cover border shadow-sm relative z-10 bg-background"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg border bg-muted flex items-center justify-center relative z-10 text-muted-foreground">
                              —
                            </div>
                          )}
                          
                          {/* Visual Indicator Layer for Secondary Images */}
                          {product.gallery && product.gallery.length > 0 && (
                            <div className="absolute -right-1.5 -bottom-1.5 h-6 w-6 rounded-full bg-cyan-600 border border-background text-white flex items-center justify-center shadow-md z-20 scale-90 group-hover:scale-100 transition-transform">
                              <span className="text-[10px] font-bold flex items-center gap-0.5">
                                +{product.gallery.length}
                              </span>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>{product.category_name || "—"}</TableCell>
                      <TableCell>{product.sub_category_name || "—"}</TableCell>
                      <TableCell>{product.brand_name || "—"}</TableCell>
                      <TableCell className="max-w-[180px] truncate font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>₹{Number(product.price).toLocaleString("en-IN")}</TableCell>
                      <TableCell>{product.stock}</TableCell>

                      <TableCell>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium tracking-wide ${
                            product.status == 1
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {product.status == 1 ? "Active" : "Inactive"}
                        </span>
                      </TableCell>

                      <TableCell>
                        {new Date(product.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {/* Quick access Variant manager shortcut entry button node */}
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 text-cyan-600"
                            title="Manage Variants"
                            onClick={() => {
                              setSelectedProduct(product);
                              setOpenVariants(true);
                            }}
                          >
                            <Layers className="h-4 w-4" />
                          </Button>

                          <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-cyan-50 dark:hover:bg-cyan-950/30">
                            <Eye className="h-4 w-4 text-cyan-600" />
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-[150px]">
                              {/* Option context alternative dropdown fallback shortcut selection click link tool item */}
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setOpenVariants(true);
                                }}
                              >
                                <Layers className="mr-2 h-4 w-4 text-muted-foreground" />
                                Variants
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setOpenEdit(true);
                                }}
                              >
                                <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />
                                Edit
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <EditProductModal
              product={selectedProduct}
              open={openEdit}
              setOpen={setOpenEdit}
              refetch={refetch}
            />

            {/* Mount Variant Management component anchor boundary element context tree */}
            <ManageVariantsModal
              product={selectedProduct}
              open={openVariants}
              setOpen={setOpenVariants}
              refetchProducts={refetch}
            />
          </div>

          {/* Pagination Controls Footer */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-muted-foreground">
              Showing {products.length === 0 ? 0 : startIndex + 1}–
              {Math.min(startIndex + itemsPerPage, products.length)} of {products.length}
            </p>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className={`cursor-pointer ${
                      currentPage === 1 ? "opacity-40 pointer-events-none" : ""
                    }`}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  />
                </PaginationItem>

                {getPageNumbers().map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      className={`cursor-pointer rounded-lg h-9 w-9 p-0 flex items-center justify-center transition-all ${
                        currentPage === page
                          ? "bg-gradient-to-r from-cyan-500 to-slate-800 text-white font-medium shadow-sm scale-105"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    className={`cursor-pointer ${
                      currentPage === totalPages ? "opacity-40 pointer-events-none" : ""
                    }`}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}