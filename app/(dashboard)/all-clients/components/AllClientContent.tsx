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

import { AddClientModal } from "./AddClientModal";
import { EditClientModal } from "./EditClientModal";

import {
  useGetClientsQuery,
  useDeleteClientMutation,
} from "@/app/store/api/authApi";

import Swal from "sweetalert2";

export default function AllClientContent() {
  const { data: clientsResponse, isLoading, refetch } = useGetClientsQuery();
  const clients = clientsResponse?.data || [];

  const [deleteClient] = useDeleteClientMutation();
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [openEdit, setOpenEdit] = useState(false);

  // ✅ PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(clients.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentData = clients.slice(
    startIndex,
    startIndex + itemsPerPage
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
  const handleDeleteClient = async (id: number) => {
    const result = await Swal.fire({
      title: "Delete Client?",
      text: "This cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#06b6d4",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteClient(id).unwrap();

        Swal.fire({
          title: "Deleted!",
          text: res.message || "Client deleted successfully",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        refetch();
      } catch (err) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete client",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="p-0 bg-muted/30 min-h-screen">

      {/* TOP */}
      <div className="flex justify-end mb-6">
        <AddClientModal clientRefetch={refetch} />
      </div>

      <Card className="rounded-2xl shadow-sm border">

        {/* HEADER */}
        <CardHeader>
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-cyan-500 to-slate-800 bg-clip-text text-transparent">
            All Clients
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
                    <TableCell colSpan={6} className="h-24 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-cyan-600" />
                    </TableCell>
                  </TableRow>
                ) : (
                  currentData.map((client: any) => (
                    <TableRow key={client.id}>
                      <TableCell>{client.id}</TableCell>
                      <TableCell>{client.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {client.email}
                      </TableCell>
                      <TableCell>{client.phone_number}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(client.created_at).toLocaleDateString()}
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
                                  setSelectedClient(client);
                                  setOpenEdit(true);
                                }}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() =>
                                  handleDeleteClient(client.id)
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

            <EditClientModal
              client={selectedClient}
              open={openEdit}
              setOpen={setOpenEdit}
              refetch={refetch}
            />
          </div>

          {/* ✅ PAGINATION */}
          <div className="flex justify-between items-center mt-6">

            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1}–
              {Math.min(startIndex + itemsPerPage, clients.length)} of{" "}
              {clients.length}
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