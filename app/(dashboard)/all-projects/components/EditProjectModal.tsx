"use client";

import { useEffect, useState } from "react";
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
import { useUpdateProjectMutation } from "@/app/store/api/authApi";
type ProjectForm = {
  project_name: string;
  project_cost: string | number;
  project_state: string;
  project_location: string;
  project_status: string;
  project_timeline: string;
  client_id: string | number;
  employees: number[]; // ✅ IMPORTANT
};
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function EditProjectModal({item, open, setOpen}: any) {
const [updateProject, { isLoading }] = useUpdateProjectMutation();
  const { data: clientsData, isLoading: clientsLoading } = useGetClientsQuery();
  const { data: employeesData, isLoading: empLoading } = useGetEmployeesQuery();

useEffect(() => {
  if (item && open) {
    console.log("Edit", item); // ✅ will work now

    setForm({
      project_name: item.project_name || "",
      project_cost: item.project_cost || "",
      project_state: item.project_state || "",
      project_location: item.project_location || "",
      project_status: item.project_status || "",
      project_timeline: item.project_timeline || "",
      client_id: item.client_id || "",
      employees: item.employees || [],
    });
  }
}, [item, open]);

const [form, setForm] = useState<ProjectForm>({
  project_name: "",
  project_cost: "",
  project_state: "",
  project_location: "",
  project_status: "",
  project_timeline: "",
  client_id: "",
  employees: [],
});

  // ✅ Pagination state
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
      id: item.id,
      project_name: form.project_name,
      project_cost: Number(form.project_cost),
      project_state: form.project_state,
      project_location: form.project_location,
      project_status: form.project_status,
      project_timeline: form.project_timeline,
      client_id: Number(form.client_id),
      employees: form.employees,
    };

    const res = await updateProject(payload).unwrap();

    toast.success(res?.message || "Project Updated ✅");

    // ✅ CLOSE MODAL HERE
    setOpen(false);

  } catch (err) {
    console.error(err);
    toast.error("Error updating project ❌");
  }
};

  return (
<Dialog open={open} onOpenChange={setOpen}>
  

      <DialogContent className="!max-w-[600px] w-[90vw] p-0 rounded-2xl flex flex-col">

        {/* HEADER */}
        <div className="flex items-center gap-3 px-6 py-4 bg-muted/40 border-b">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-slate-800 text-white flex items-center justify-center">
            <Truck className="w-4 h-4 text-white" />
          </div>
          <div>
            <DialogTitle className="text-sm font-medium">Edit Project</DialogTitle>
            <p className="text-xs text-muted-foreground">Update project details</p>
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

          <Field label="Location">
            <Input
              value={form.project_location}
              onChange={(e) => handleChange("project_location", e.target.value)}
            />
          </Field>

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

          <Field label="Select Client">
            <Select
          value={String(form.client_id)}
              onValueChange={(value) => handleChange("client_id", Number(value))}
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

          {/* ✅ Employees with pagination */}
          <div className="col-span-2">
            <Label className="text-xs text-muted-foreground">Select Employees</Label>

            <div className="grid grid-cols-7 gap-2 mt-2">
              {empLoading && <p className="text-xs">Loading...</p>}

              {paginatedEmployees.map((emp: any) => {
                const isSelected = form.employees.includes(emp.id);
                const imageUrl = emp.profile_image?.startsWith("http")
                  ? emp.profile_image
                  : `http://127.0.0.1:8000/storage/${emp.profile_image}`;

                return (
                  <div
                    key={emp.id}
                    onClick={() => {
                      if (isSelected) {
                        handleChange(
                          "employees",
                          form.employees.filter((id: number) => id !== emp.id)
                        );
                      } else {
                        handleChange("employees", [...form.employees, emp.id]);
                      }
                    }}
                    className={`flex flex-col items-center cursor-pointer p-1 rounded-md transition
                      ${
                        isSelected
                          ? "bg-blue-100 text-blue-900 border border-blue-300 dark:bg-blue-900"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }
                    `}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={emp.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <span className="text-[9px] mt-1 truncate w-12 text-center">
                      {emp.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="text-xs px-2 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              <span className="text-xs">
                Page {page} / {totalPages || 1}
              </span>

              <button
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage((p) => p + 1)}
                className="text-xs px-2 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-gradient-to-r from-cyan-500 to-slate-800 text-white hover:bg-blue-700"
          >
           {isLoading ? "Updating..." : "Update Project"}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}

/* HELPER */
function Field({ label, children }: any) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}