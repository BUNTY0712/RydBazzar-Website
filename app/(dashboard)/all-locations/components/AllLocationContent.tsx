"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash,
} from "lucide-react";

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

import { AddLocationModal } from "./AddLocationModal";
import { useGetLocationsQuery } from "@/app/store/api/authApi";

export default function AllLocationContent() {
  // ✅ API
  const { data, isLoading, error } = useGetLocationsQuery();

  const locations = data?.data || [];

  // ✅ PAGINATION
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(locations.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const currentData = locations.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const getPageNumbers = () => {
    const pages: number[] = [];
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
        <AddLocationModal />
      </div>

      <Card className="rounded-2xl shadow-sm border">
        {/* HEADER */}
        <CardHeader>
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-cyan-500 to-slate-800 bg-clip-text text-transparent">
            All Locations
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage all locations
          </p>
        </CardHeader>

        <CardContent>
          {/* TABLE */}
          <div className="border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>ID</TableHead>
                  <TableHead>Location Name</TableHead>
                  <TableHead>Dealers</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {/* ✅ Loading */}
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={5}>Loading...</TableCell>
                  </TableRow>
                )}

                {/* ❌ Error */}
                {error && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      Error loading locations
                    </TableCell>
                  </TableRow>
                )}

                {/* ❌ Empty */}
                {!isLoading && locations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No locations found
                    </TableCell>
                  </TableRow>
                )}

                {/* ✅ DATA */}
                {currentData.map((loc: any) => (
                  <TableRow key={loc.id}>
                    <TableCell>{loc.id}</TableCell>

                    <TableCell>{loc.location_name}</TableCell>

                    {/* Dealers */}
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {loc.dealers?.length ? (
                          loc.dealers.map((dealer: any) => (
                            <span
                              key={dealer.id}
                              className="px-2 py-0.5 text-xs bg-blue-100 rounded"
                            >
                              {dealer.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No dealers
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Date */}
                    <TableCell>
                      {new Date(loc.created_at).toLocaleDateString()}
                    </TableCell>

                    {/* Actions */}
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
                            <DropdownMenuItem>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>

                            <DropdownMenuItem className="text-red-600">
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* ✅ PAGINATION */}
          {!isLoading && locations.length > 0 && (
            <div className="flex justify-between items-center mt-6 px-2">
              <span className="text-sm text-muted-foreground">
                Showing {startIndex + 1}–
                {Math.min(
                  startIndex + ITEMS_PER_PAGE,
                  locations.length
                )}{" "}
                of {locations.length}
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
                        setCurrentPage((prev) =>
                          Math.max(prev - 1, 1)
                        )
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}