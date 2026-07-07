"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash,
  Loader2,
} from "lucide-react";
import {
  useDeleteSubCategoryMutation,
  useGetAllSubCategoriesQuery,
} from "@/app/store/api/subCategoryApi";

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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { AddSubCategoryModal } from "./AddSubCategoryModal";
import { EditSubCategoryModal } from "./EditSubCategoryModal";

export default function AllCategoryContent() {
  const {
    data,
    isLoading,
    refetch,
  } = useGetAllSubCategoriesQuery({});

  const [deleteSubCategory] = useDeleteSubCategoryMutation();
  const subCategories = data?.data || [];

  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [openEdit, setOpenEdit] = useState(false);

  // ✅ PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(subCategories.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentData = subCategories.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleDeleteCategory = async (id: number) => {
    const result = await Swal.fire({
      title: "Delete Category?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteSubCategory(id).unwrap();
      Swal.fire(
        "Deleted!",
        "Category deleted successfully.",
        "success"
      );
      refetch();
    } catch (error: any) {
      Swal.fire(
        "Error",
        error?.data?.message || "Delete failed",
        "error"
      );
    }
  };

  // ✅ SMART PAGE NUMBERS
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
      {/* TOP */}
      <div className="flex justify-end mb-6">
        <AddSubCategoryModal />
      </div>

      <Card className="rounded-2xl shadow-sm border">
        {/* HEADER */}
        <CardHeader>
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-cyan-500 to-slate-800 bg-clip-text text-transparent">
            All SubCategories
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage all registered clients
          </p>
        </CardHeader>

        <CardContent>
          {/* TABLE */}
          <div className="border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>ID</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>SubCategory Name</TableHead>
                  <TableHead>Parent Category</TableHead> {/* Added Header */}
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center"> {/* Updated colSpan to 7 */}
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-cyan-600" />
                    </TableCell>
                  </TableRow>
                ) : (
                  currentData.map((category: any) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.id}</TableCell>

                      <TableCell>
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="h-12 w-12 rounded object-cover"
                        />
                      </TableCell>

                      <TableCell>{category.name}</TableCell>

                      {/* ✅ ADDED: Displays the parent category name from your backend join query */}
                      <TableCell className="font-medium text-slate-700">
                        {category.category_name || "N/A"}
                      </TableCell>

                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            category.status == 1
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {category.status == 1 ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(category.created_at).toLocaleDateString()}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="icon" variant="ghost">
                            <Eye className="h-4 w-4 text-cyan-600" />
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedCategory(category);
                                  setOpenEdit(true);
                                }}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteCategory(category.id)}
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

            <EditSubCategoryModal
              category={selectedCategory}
              open={openEdit}
              setOpen={setOpenEdit}
              refetch={refetch}
            />
          </div>

          {/* ✅ PAGINATION */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1}–
              {Math.min(startIndex + itemsPerPage, subCategories.length)} of{" "}
              {subCategories.length}
            </p>
            <div>
              <Pagination>
                <PaginationContent>
                  {/* PREVIOUS */}
                  <PaginationItem>
                    <PaginationPrevious
                      className={`cursor-pointer ${
                        currentPage === 1 ? "opacity-50 pointer-events-none" : ""
                      }`}
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    />
                  </PaginationItem>

                  {/* PAGE NUMBERS */}
                  {getPageNumbers().map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        className={`cursor-pointer rounded-lg px-3 py-1 ${
                          currentPage === page
                            ? "bg-gradient-to-r from-cyan-500 to-slate-800 text-white shadow-md"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  {/* NEXT */}
                  <PaginationItem>
                    <PaginationNext
                      className={`cursor-pointer ${
                        currentPage === totalPages ? "opacity-50 pointer-events-none" : ""
                      }`}
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}