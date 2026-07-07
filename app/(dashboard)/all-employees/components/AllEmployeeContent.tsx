"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash,
  Loader2,
} from "lucide-react";

import Swal from "sweetalert2";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { AddEmployeeModal } from "./AddEmployeeModal";
import { EditEmployeeModal } from "./EditEmployeeModal";

import {
  useGetEmployeesQuery,
  useDeleteEmployeeMutation,
} from "@/app/store/api/authApi";

const ITEMS_PER_PAGE = 6;

export default function AllEmployeeContent() {
  const [currentPage, setCurrentPage] = useState(1);

  const [deleteEmployee, { isLoading: deleting }] =
    useDeleteEmployeeMutation();

  const [selectedEmp, setSelectedEmp] = useState<any>(null);
  const [openEdit, setOpenEdit] = useState(false);

  const { data: employeeResponse, isLoading, refetch } =
    useGetEmployeesQuery();

  const list = employeeResponse?.data || [];

  // ✅ PAGINATION
  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const currentData = list.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

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

  // ✅ DELETE
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#06b6d4",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteEmployee(id).unwrap();

        Swal.fire({
          title: "Deleted!",
          text: res.message || "Employee deleted successfully",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        refetch();
      } catch {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete employee",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="p-0 bg-muted/30 min-h-screen">

      {/* TOP */}
      <div className="flex justify-end mb-6">
        <AddEmployeeModal employeeRefetch={refetch} />
      </div>

      <Card className="rounded-2xl shadow-sm border">

        {/* HEADER */}
        <CardHeader>
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-cyan-500 to-slate-800 bg-clip-text text-transparent">
            All Employees
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage all registered employees in one place.
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
                  <TableHead>Email</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-cyan-600" />
                    </TableCell>
                  </TableRow>
                ) : (
                  currentData.map((emp: any) => (
                    <TableRow key={emp.id}>
                      <TableCell>{emp.id}</TableCell>
                      <TableCell>{emp.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {emp.email}
                      </TableCell>
                      <TableCell>{emp.phone_number}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(emp.created_at).toLocaleDateString()}
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
                                  setSelectedEmp(emp);
                                  setOpenEdit(true);
                                }}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() =>
                                  !deleting && handleDelete(emp.id)
                                }
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

            <EditEmployeeModal
              emp={selectedEmp}
              open={openEdit}
              setOpen={setOpenEdit}
              refetch={refetch}
            />
          </div>

          {/* PAGINATION */}
          <div className="flex justify-between items-center mt-6">

            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1}–
              {Math.min(startIndex + ITEMS_PER_PAGE, list.length)} of {list.length}
            </p>
                <div>
  <Pagination>
              <PaginationContent>

                {/* PREVIOUS */}
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