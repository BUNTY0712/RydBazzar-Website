"use client"

import { useState } from "react"
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash,
  FileText,
  Calendar,
  DollarSign,
  Hash,
} from "lucide-react"
import Link from "next/link"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowLeft } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import { useGetProjectByIdQuery } from "@/app/store/api/authApi"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

export default function ProjectContent() {
  const searchParams = useSearchParams()
  const projectId = Number(searchParams.get("id"))

  const { data, isLoading } = useGetProjectByIdQuery(projectId)
  // console.log("data", data);

  const project = data?.data
  const employees = project?.employees_data || []

  // ✅ PAGINATION
  const ITEMS_PER_PAGE = 5
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(employees.length / ITEMS_PER_PAGE) || 1
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE

  const currentData = employees.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  )

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5

    let start = Math.max(currentPage - 2, 1)
    let end = Math.min(start + maxVisible - 1, totalPages)

    if (end - start < maxVisible - 1) {
      start = Math.max(end - maxVisible + 1, 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  }

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  // ✅ INFO CARDS (NO LOCATION HERE)
const infoData = [
  { label: "Project Name", value: project?.project_name, icon: Hash },

  { label: "Timeline", value: project?.project_timeline, icon: Calendar },
  { label: "Cost", value: project?.project_cost, icon: DollarSign },

  { label: "Gallery", value: 100, icon: FileText, route: "/project-gallery" },
  { label: "Pdf", value: 100, icon: FileText, route: "/project-pdf" },
  { label: "Excel Sheets", value: 100, icon: FileText, route: "/project-excel" },
  { label: "Dealers", value: 100, icon: FileText, route: "/project-dealer" },

]
const router = useRouter()

  return (
    <div className="p-4 bg-muted/30 min-h-screen">
      
      {/* HEADER */}
 {/* HEADER */}
<div className="flex justify-between items-center mb-6">
  <div className="flex items-center gap-3">
    
    {/* ✅ BACK BUTTON */}
  <Button
    variant="outline"
    size="sm"
    onClick={() => router.back()}
    className="rounded-lg flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-slate-800 cursor-pointer border-none text-white hover:bg-gradient-to-r hover:from-cyan-600 hover:to-slate-900 transition"
  >
  <ArrowLeft className="h-10 w-10 text-white" />
  </Button>

    <h2 className="text-xl font-semibold bg-gradient-to-r from-cyan-500 to-slate-800 bg-clip-text text-transparent">
      Project Details
    </h2>
  </div>

  <p className="text-sm text-muted-foreground">
    Total Employees: {employees.length}
  </p>
</div>

      <Card className="rounded-2xl shadow-sm border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {project?.project_name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage project and assigned employees
          </p>
        </CardHeader>

        <CardContent>

          {/* ✅ INFO GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
         {infoData.map((item, index) => {
  const Icon = item.icon

  const content = (
    <div className="flex items-center gap-4 p-4 rounded-xl border bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition">
      <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-slate-800 text-white">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <p className="text-xs text-muted-foreground">
          {item.label}
        </p>
        <p className="text-sm font-semibold text-gray-800">
          {item.value || "-"}
        </p>
      </div>
    </div>
  )

  // 👉 if route exists → make clickable
  return item.route ? (
    <Link
      key={index}
      href={`${item.route}?id=${projectId}`}
      className="cursor-pointer"
    >
      {content}
    </Link>
  ) : (
    <div key={index}>{content}</div>
  )
})}
          </div>

          {/* ✅ SEPARATE LOCATION CARDS */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Locations
            </h3>

            <div className="flex flex-wrap gap-3">
              {project?.locations_data?.map((loc: any) => (
                <div
                  key={loc.id}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl border bg-gradient-to-br from-white to-gray-50 shadow-sm"
                >
                  <div className="h-8 w-8 flex items-center justify-center rounded-md bg-gradient-to-br from-cyan-500 to-slate-800 text-white">
                    <FileText className="h-4 w-4" />
                  </div>

                  <p className="text-sm font-medium text-gray-800">
                    {loc.location_name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ✅ TABLE */}
          <div className="border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>ID</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {currentData.map((emp: any) => (
                  <TableRow key={emp.id}>
                    <TableCell>{emp.id}</TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={emp.profile_image} />
                          <AvatarFallback>
                            {emp.name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        {emp.name}
                      </div>
                    </TableCell>

                    <TableCell>{emp.email}</TableCell>
                    <TableCell>{emp.phone_number}</TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          emp.status === "active"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {emp.status}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {new Date(emp.created_at).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/project-view/${emp.id}`}>
                          <Button size="icon" variant="ghost">
                            <Eye className="h-4 w-4 text-cyan-600" />
                          </Button>
                        </Link>

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
                              Remove
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
         {/* PAGINATION */}
         <div className="flex justify-between items-center mt-6 px-2">
  <span className="text-sm text-muted-foreground">
    Showing {startIndex + 1}–
    {Math.min(startIndex + ITEMS_PER_PAGE, employees.length)} of{" "}
    {employees.length}
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
  )
}