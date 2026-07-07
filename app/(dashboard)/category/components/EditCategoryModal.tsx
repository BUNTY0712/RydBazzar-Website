"use client";

import { useEffect, useState } from "react";
import { FolderPen } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useUpdateCategoryMutation } from "@/app/store/api/categoryApi";

export function EditCategoryModal({
  category,
  open,
  setOpen,
  refetch,
}: any) {
  const [updateCategory, { isLoading }] =
    useUpdateCategoryMutation();

  const [formData, setFormData] = useState({
    name: "",
    status: "1",
    image: null as File | null,
  });

  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        status: String(category.status ?? 1),
        image: null,
      });

      setPreview(category.image || "");
    }
  }, [category]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!category?.id) return;

    try {
      const body = new FormData();

      body.append("name", formData.name);
      body.append("status", formData.status);

      if (formData.image) {
        body.append("image", formData.image);
      }

      const res = await updateCategory({
        id: category.id,
        formData: body,
      }).unwrap();

      toast.success(
        res?.message || "Category updated successfully"
      );

      refetch?.();
      setOpen(false);
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to update category"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[600px] p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b bg-muted/40">
          <div className="h-10 w-10 rounded-lg bg-cyan-600 flex items-center justify-center">
            <FolderPen className="h-5 w-5 text-white" />
          </div>

          <div>
            <DialogTitle>Edit Category</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Update category details
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          <Field label="Category Name">
            <Input
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
              className="w-full h-10 border rounded-md px-3"
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </Field>

          <Field label="Category Image">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  handleChange("image", file);
                  setPreview(URL.createObjectURL(file));
                }
              }}
            />
          </Field>

          {preview && (
            <div>
              <img
                src={preview}
                alt="Preview"
                className="h-24 w-24 rounded-lg border object-cover"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t">
          <DialogClose asChild>
            <Button variant="outline">
              Cancel
            </Button>
          </DialogClose>

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            {isLoading ? "Updating..." : "Update Category"}
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