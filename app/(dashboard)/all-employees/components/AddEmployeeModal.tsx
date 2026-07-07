"use client";

import { useState, useRef } from "react";
import { Plus, Truck, Info, User, Upload } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateEmployeeMutation } from "@/app/store/api/authApi";
import { toast } from "sonner";

export function AddEmployeeModal({ employeeRefetch }: any) {
  const [open, setOpen] = useState(false);
  const [createEmployee, { isLoading }] = useCreateEmployeeMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    status: "active",
    profile_image: null as File | null,
  });

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone_number", formData.phone_number);
    data.append("status", formData.status);
    if (formData.profile_image) {
      data.append("profile_image", formData.profile_image);
    }

    try {
      await createEmployee(data).unwrap();
      toast.success("Employee created successfully ✅");
      
      // Reset form
      setFormData({ name: "", email: "", phone_number: "", status: "active", profile_image: null });
      if (employeeRefetch) employeeRefetch();
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create employee ❌");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-cyan-500 to-slate-800 text-white gap-1.5">
          <Plus className="w-4 h-4" /> Create Employee
        </Button>
      </DialogTrigger>

      <DialogContent className="!max-w-[600px] w-[90vw] p-0 rounded-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center gap-3 px-6 py-4 bg-muted/40 border-b">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Truck className="w-4 h-4 text-white" />
          </div>
          <div>
            <DialogTitle className="text-sm font-medium">Create Employee</DialogTitle>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <Field label="Name">
            <Input className="h-9" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Email">
              <Input className="h-9" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
            </Field>
            <Field label="Phone">
              <Input className="h-9" value={formData.phone_number} onChange={(e) => handleChange("phone_number", e.target.value)} />
            </Field>
          </div>

          <Field label="Status">
            <Select value={formData.status} onValueChange={(v) => handleChange("status", v)}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Profile Image">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" /> Upload
              </Button>
              <span className="text-xs text-muted-foreground truncate">
                {formData.profile_image ? formData.profile_image.name : "No file chosen"}
              </span>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" 
                onChange={(e) => handleChange("profile_image", e.target.files?.[0])} />
            </div>
          </Field>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t">
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={handleSubmit} disabled={isLoading} className="bg-blue-600">
            {isLoading ? "Creating..." : "Create Employee"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}