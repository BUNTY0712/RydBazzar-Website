"use client";

import { useState } from "react";
import { Plus, FolderPlus } from "lucide-react";
import { toast } from "sonner";

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

import { useCreateCategoryMutation } from "@/app/store/api/categoryApi";

export function AddCategoryModal({ refetch }: any) {
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    status: "1",
    image: null as File | null,
  });

  const [createCategory, { isLoading }] =
    useCreateCategoryMutation();

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (!formData.image) {
      toast.error("Please select an image");
      return;
    }

    try {
      const body = new FormData();

      body.append("name", formData.name);
      body.append("status", formData.status);
      body.append("image", formData.image);

      const res = await createCategory(body).unwrap();

      toast.success(
        res?.message || "Category created successfully"
      );

      setFormData({
        name: "",
        status: "1",
        image: null,
      });

      setOpen(false);

      if (refetch) {
        refetch();
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to create category"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-cyan-500 to-slate-800 text-white gap-2">
          <Plus className="h-4 w-4" />
          Create Category
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[600px] p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b bg-muted/40">
          <div className="h-10 w-10 rounded-lg bg-cyan-600 flex items-center justify-center">
            <FolderPlus className="h-5 w-5 text-white" />
          </div>

          <div>
            <DialogTitle>Create Category</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Add a new category
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          <Field label="Category Name">
            <Input
              placeholder="Enter category name"
              value={formData.name}
              onChange={(e) =>
                handleChange("name", e.target.value)
              }
            />
          </Field>

          <Field label="Status">
            <select
              value={formData.status}
              onChange={(e) =>
                handleChange("status", e.target.value)
              }
              className="w-full h-10 rounded-md border px-3"
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </Field>

          <Field label="Category Image">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleChange(
                  "image",
                  e.target.files?.[0] || null
                )
              }
            />
          </Field>

          {formData.image && (
            <img
              src={URL.createObjectURL(formData.image)}
              alt="Preview"
              className="h-24 w-24 rounded-lg object-cover border"
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            {isLoading ? "Creating..." : "Create Category"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}