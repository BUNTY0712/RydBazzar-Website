"use client";

import { useState } from "react";
import { Plus, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateProjectMutation } from "@/app/store/api/authApi";
import { useGetClientsQuery } from "@/app/store/api/authApi";
import { useGetEmployeesQuery } from "@/app/store/api/authApi";
import { useGetLocationsQuery } from "@/app/store/api/authApi"; // ✅ ADD

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function AddProjectModal({ open, setOpen }: any) {
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const { data: clientsData, isLoading: clientsLoading } = useGetClientsQuery();
  const { data: employeesData, isLoading: empLoading } = useGetEmployeesQuery();
  const { data: locationsData, isLoading: locationLoading } = useGetLocationsQuery(); // ✅

  const [openLocation, setOpenLocation] = useState(false); // ✅ dropdown toggle

  const [form, setForm] = useState({
    project_name: "",
    project_cost: "",
    project_state: "",
    project_location: "",
    project_status: "",
    project_timeline: "",
    client_id: "",
    employees: [] as number[],
    project_location_id: [] as number[], // ✅ IMPORTANT
  });

  // Pagination
  const [page, setPage] = useState(1);
  const perPage = 14;

  const allEmployees = employeesData?.data || [];
  const totalPages = Math.ceil(allEmployees.length / perPage);

  const start = (page - 1) * perPage;
  const paginatedEmployees = allEmployees.slice(start, start + perPage);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        project_cost: Number(form.project_cost),
        client_id: Number(form.client_id),
        employees: form.employees,
        project_location_id: form.project_location_id, // ✅ send array
      };

      const res = await createProject(payload).unwrap();

      toast.success(res?.message || "Project Created ✅");

      setOpen(false);

      setForm({
        project_name: "",
        project_cost: "",
        project_state: "",
        project_location: "",
        project_status: "",
        project_timeline: "",
        client_id: "",
        employees: [],
        project_location_id: [],
      });
    } catch (err) {
      console.error(err);
      toast.error("Error creating project ❌");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          className="bg-gradient-to-r from-cyan-500 to-slate-800 text-white gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Create Project
        </Button>
      </DialogTrigger>

      <DialogContent className="!max-w-[600px] w-[90vw] p-0 rounded-2xl flex flex-col">

        {/* HEADER */}
        <div className="flex items-center gap-3 px-6 py-4 bg-muted/40 border-b">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-slate-800 flex items-center justify-center">
            <Truck className="w-4 h-4 text-white" />
          </div>
          <div>
            <DialogTitle className="text-sm font-medium">Create Project</DialogTitle>
            <p className="text-xs text-muted-foreground">Add new project details</p>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 grid grid-cols-2 gap-4">

          <Field label="Project Name">
            <Input
              value={form.project_name}
              onChange={(e) => handleChange("project_name", e.target.value)}
            />
          </Field>

          <Field label="Project Cost">
            <Input
              type="number"
              value={form.project_cost}
              onChange={(e) => handleChange("project_cost", e.target.value)}
            />
          </Field>

          <Field label="State">
            <Input
              value={form.project_state}
              onChange={(e) => handleChange("project_state", e.target.value)}
            />
          </Field>

          <Field label="Location (Text)">
            <Input
              value={form.project_location}
              onChange={(e) => handleChange("project_location", e.target.value)}
            />
          </Field>

          {/* ✅ MULTI SELECT DROPDOWN */}
          <div className="col-span-2">
            <Label className="text-xs text-muted-foreground">Select Locations</Label>

            <div className="relative mt-2">
              <div
                onClick={() => setOpenLocation(!openLocation)}
                className="border rounded-md px-3 py-2 text-sm bg-white cursor-pointer"
              >
                {form.project_location_id.length > 0
                  ? `${form.project_location_id.length} location(s) selected`
                  : "Select Locations"}
              </div>

              {openLocation && (
                <div className="absolute z-50 mt-1 w-full border rounded-md bg-white shadow-md max-h-40 overflow-y-auto">
                  {locationLoading && <p className="p-2 text-xs">Loading...</p>}

                  {locationsData?.data?.map((loc: any) => {
                    const isSelected = form.project_location_id.includes(loc.id);

                    return (
                      <div
                        key={loc.id}
                        onClick={() => {
                          if (isSelected) {
                            handleChange(
                              "project_location_id",
                              form.project_location_id.filter((id) => id !== loc.id)
                            );
                          } else {
                            handleChange("project_location_id", [
                              ...form.project_location_id,
                              loc.id,
                            ]);
                          }
                        }}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <input type="checkbox" checked={isSelected} readOnly />
                        <span>{loc.location_name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* STATUS */}
          <Field label="Status">
            <Select
              value={form.project_status}
              onValueChange={(value) => handleChange("project_status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Timeline">
            <Input
              value={form.project_timeline}
              onChange={(e) => handleChange("project_timeline", e.target.value)}
            />
          </Field>

          {/* CLIENT */}
          <Field label="Select Client">
            <Select
              value={form.client_id}
              onValueChange={(value) => handleChange("client_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={clientsLoading ? "Loading..." : "Select client"} />
              </SelectTrigger>
              <SelectContent>
                {clientsData?.data?.map((client: any) => (
                  <SelectItem key={client.id} value={String(client.id)}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* EMPLOYEES */}
          <div className="col-span-2">
            <Label className="text-xs text-muted-foreground">Select Employees</Label>

            <div className="grid grid-cols-7 gap-2 mt-2">
              {empLoading && <p className="text-xs">Loading...</p>}

              {paginatedEmployees.map((emp: any) => {
                const isSelected = form.employees.includes(emp.id);

                return (
                 <div
  key={emp.id}
  onClick={() => {
    if (isSelected) {
      handleChange(
        "employees",
        form.employees.filter((id) => id !== emp.id)
      );
    } else {
      handleChange("employees", [...form.employees, emp.id]);
    }
  }}
  className={`cursor-pointer p-2 rounded-md flex flex-col items-center text-center border ${
    isSelected ? "bg-blue-200 border-blue-400" : "hover:bg-gray-100"
  }`}
>
  {/* ✅ Profile Image */}
  <img
    src={emp.profile_image}
    alt={emp.name}
    className="w-10 h-10 rounded-full object-cover mb-1 border"
    onError={(e: any) => {
      e.target.src = "https://via.placeholder.com/40"; // fallback image
    }}
  />

  {/* ✅ Name */}
  <span className="text-xs">{emp.name}</span>
</div>
                );
              })}
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button className="bg-gradient-to-r from-cyan-500 to-slate-800" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: any) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}