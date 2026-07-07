"use client"

import { useState, useEffect } from "react"
import { MoreHorizontal, Eye, Pencil, Trash } from "lucide-react"
import Link from "next/link"
import Swal from "sweetalert2"

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
import { Button } from "@/components/ui/button"

import { AddProjectModal } from "./AddProjectModal"
import { EditProjectModal } from "./EditProjectModal"

import {
  useDeleteProjectMutation,
  useGetProjectsQuery,
} from "@/app/store/api/authApi"

export default function AllProjectContent() {

  const [deleteProject] = useDeleteProjectMutation()
  const { data, isLoading, error, refetch } = useGetProjectsQuery()

  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [openEdit, setOpenEdit] = useState(false)
  const [open, setOpen] = useState(false);

  const projects = data?.data || []

  // ✅ FILTER STATES
  const [statusFilter, setStatusFilter] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [clientFilter, setClientFilter] = useState("")

  // ✅ PAGINATION
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const startIndex = (currentPage - 1) * itemsPerPage

  // ✅ FILTER LOGIC
  const filteredProjects = projects.filter((project: any) => {
    const matchesStatus = statusFilter
      ? project.project_status === statusFilter
      : true

    const matchesLocation = locationFilter
      ? project.project_location?.toLowerCase().includes(locationFilter.toLowerCase())
      : true

    const matchesClient = clientFilter
      ? project.client_name?.toLowerCase().includes(clientFilter.toLowerCase())
      : true

    return matchesStatus && matchesLocation && matchesClient
  })

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1

  const currentProjects = filteredProjects.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  // ✅ RESET PAGE WHEN FILTER CHANGES
  useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter, locationFilter, clientFilter])

  // ✅ SMART PAGE NUMBERS
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

  // ✅ DELETE
  const handleDeleteProject = async (id: number) => {
    const result = await Swal.fire({
      title: "Delete Project?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#06b6d4",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    })

    if (result.isConfirmed) {
      try {
        const res = await deleteProject(id).unwrap()

        Swal.fire({
          title: "Deleted!",
          text: res.message || "Project deleted successfully",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        })

        refetch()
      } catch {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete project",
          icon: "error",
        })
      }
    }
  }

  return (
    <div className="p-0 bg-muted/30 min-h-screen">

      {/* ADD BUTTON */}
      <div className="flex justify-end mb-6">
        <AddProjectModal open={open} setOpen={setOpen} />
      </div>

      <Card className="rounded-2xl shadow-sm border">

        {/* HEADER */}
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold bg-gradient-to-r from-cyan-500 to-slate-800 bg-clip-text text-transparent">
              All Projects
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage all registered projects
            </p>
          </div>

          <Button variant="secondary" className="text-cyan-600">
            View All
          </Button>
        </CardHeader>

        <CardContent>

          {/* ✅ FILTER UI */}
          <div className="flex flex-wrap gap-4 mb-4">

            <select
              className="border rounded-lg px-3 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
            </select>

            <input
              type="text"
              placeholder="Search Location"
              className="border rounded-lg px-3 py-2"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />

            <input
              type="text"
              placeholder="Search Client"
              className="border rounded-lg px-3 py-2"
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
            />

            <Button
            className="bg-gradient-to-r from-cyan-500 to-slate-800 text-white cursor-pointer"
              // variant="outline"
              onClick={() => {
                setStatusFilter("")
                setLocationFilter("")
                setClientFilter("")
              }}
            >
              Reset
            </Button>

          </div>

          {/* LOADING */}
          {isLoading && <p className="p-4">Loading...</p>}

          {/* ERROR */}
          {error && (
            <p className="p-4 text-red-500">Failed to load projects</p>
          )}

          {/* TABLE */}
          {!isLoading && !error && (
            <>
              <div className="border rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>ID</TableHead>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Timeline</TableHead>
                      
                      {/* <TableHead>Location</TableHead> */}

                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {currentProjects.map((project: any) => (
                      <TableRow key={project.id}>
                        <TableCell>{project.id}</TableCell>

                        <TableCell>{project.project_name}</TableCell>

                        <TableCell>₹{project.project_cost}</TableCell>

                        <TableCell>
                          <Badge
                            variant={
                              project.project_status === "completed"
                                ? "default"
                                : project.project_status === "pending"
                                ? "secondary"
                                : project.project_status === "in_progress"
                                ? "outline"
                                : "destructive"
                            }
                          >
                            {project.project_status}
                          </Badge>
                        </TableCell>
   <TableCell>
                          {project.project_timeline}
                        </TableCell>
                        {/* <TableCell>
                          {project.project_location}
                        </TableCell> */}

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">

                            <Link href={`/project-view?id=${project.id}`}>
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

                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedProject(project)
                                    setOpenEdit(true)
                                  }}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() =>
                                    handleDeleteProject(project.id)
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
                    ))}
                  </TableBody>
                </Table>

                <EditProjectModal
                  item={selectedProject}
                  open={openEdit}
                  setOpen={setOpenEdit}
                />
              </div>

              {/* PAGINATION */}
              <div className="flex justify-between items-center mt-6 px-2">

                <span className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}–
                  {Math.min(startIndex + itemsPerPage, filteredProjects.length)} of{" "}
                  {filteredProjects.length}
                </span>
                    <div>
   <Pagination>
                  <PaginationContent>

                    <PaginationItem>
                      <PaginationPrevious
                        className={`cursor-pointer ${
                          currentPage === 1 ? "opacity-50 pointer-events-none" : ""
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}