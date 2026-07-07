"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Eye,
  Trash,
  Loader2,
  Upload,
} from "lucide-react";
import Link from "next/link";

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

import { AddDealerModal } from "./AddDealerModal";

import {
  useGetDealersQuery,
  useDeleteDealerMutation,
} from "@/app/store/api/authApi";

import Swal from "sweetalert2";

export default function AllDealerContent() {
  const { data, isLoading, refetch } = useGetDealersQuery();
  const dealers = data || [];

  const [deleteDealer] = useDeleteDealerMutation();

  // ✅ PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(dealers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = dealers.slice(startIndex, startIndex + itemsPerPage);

  // ✅ PAGE NUMBERS
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  // ✅ DELETE FUNCTION
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Delete Dealer?",
      text: "This cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#06b6d4",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteDealer(id).unwrap();

        Swal.fire({
          title: "Deleted!",
          text: res.message || "Dealer deleted successfully",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        refetch();
      } catch (err) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete dealer",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="p-0 bg-muted/30 min-h-screen">
      {/* TOP */}
      <div className="flex justify-end mb-6">
        <AddDealerModal />
      </div>

      <Card className="rounded-2xl shadow-sm border">
        {/* HEADER */}
        <CardHeader>
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-cyan-500 to-slate-800 bg-clip-text text-transparent">
            All Dealers
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage all dealers
          </p>
        </CardHeader>

        <CardContent>
          {/* TABLE */}
          <div className="border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Projects</TableHead>
                  <TableHead>Images</TableHead>
                  <TableHead className="text-right">View</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-cyan-600" />
                    </TableCell>
                  </TableRow>
                ) : currentData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No dealers found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentData.map((dealer: any) => (
                    <TableRow key={dealer.id}>
                      {/* ID */}
                      <TableCell>{dealer.id}</TableCell>

                      {/* NAME */}
                      <TableCell>{dealer.name}</TableCell>

                      {/* PROJECTS */}
                      <TableCell>
                        {dealer.projects?.length > 0 ? (
                          dealer.projects
                            .map((p: any) => p.project_name)
                            .join(", ")
                        ) : (
                          <span className="text-xs text-gray-400">
                            No Project
                          </span>
                        )}
                      </TableCell>

                      {/* IMAGES */}
                      <TableCell>
                        <div className="flex gap-1">
                          {dealer.images?.length > 0 ? (
                            dealer.images
                              .slice(0, 3)
                              .map((img: string, i: number) => (
                                <img
                                  key={i}
                                  src={`http://127.0.0.1:8000/storage/${img}`}
                                  alt="dealer"
                                  className="w-8 h-8 rounded object-cover border"
                                />
                              ))
                          ) : (
                            <span className="text-xs text-gray-400">
                              No Image
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* ACTIONS */}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/dealer-view?dealerId=${dealer.id}`}>
                            <Button size="icon" variant="ghost">
                              <Eye className="h-4 w-4 text-cyan-600" />
                            </Button>
                          </Link>

                          <DropdownMenu>
                            {/* <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger> */}

                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(dealer.id)}
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
          </div>

          {/* PAGINATION */}
          <div className="flex justify-between items-center mt-6 px-2">
            <span className="text-sm text-muted-foreground">
              Showing {startIndex + 1}–
              {Math.min(startIndex + itemsPerPage, dealers.length)} of{" "}
              {dealers.length}
            </span>
                <div>
  <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className={`cursor-pointer ${
                      currentPage === 1
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }`}
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                  />
                </PaginationItem>

                {getPageNumbers().map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      className={`cursor-pointer ${
                        currentPage === page
                          ? "bg-gradient-to-r from-cyan-500 to-slate-800 text-white"
                          : ""
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
                      currentPage === totalPages
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }`}
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, totalPages)
                      )
                    }
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