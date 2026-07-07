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

import {
  useUpdateSubCategoryMutation,
} from "@/app/store/api/subCategoryApi";

import {
  useGetAllCategoriesQuery,
} from "@/app/store/api/categoryApi";

export function EditSubCategoryModal({
  category,
  open,
  setOpen,
  refetch,
}: any) {
  const [updateSubCategory, { isLoading }] =
    useUpdateSubCategoryMutation();

  const { data: categoryData } =
    useGetAllCategoriesQuery({});

  const categories = categoryData?.data || [];

  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    status: "1",
    image: null as File | null,
  });

  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (category) {
      setFormData({
        category_id: String(category.category_id || ""),
        name: category.name || "",
        status: String(category.status ?? 1),
        image: null,
      });

      // FIX: Changed from category.image to category.image_url to pull the complete URL path
      setPreview(category.image_url || "");
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

    if (!formData.category_id) {
      toast.error("Please select category");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Sub category name is required");
      return;
    }

    try {
      const body = new FormData();

      body.append("category_id", formData.category_id);
      body.append("name", formData.name);
      body.append("status", formData.status);

      // FIX: Only append the image if the user selected a brand new file
      if (formData.image instanceof File) {
        body.append("image", formData.image);
      }

      const res = await updateSubCategory({
        id: category.id,
        formData: body,
      }).unwrap();

      toast.success(
        res?.message || "Sub Category updated successfully"
      );

      refetch?.();
      setOpen(false);
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          "Failed to update sub category"
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
            <DialogTitle>Edit Sub Category</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Update sub category details
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          <Field label="Category">
            <select
              value={formData.category_id}
              onChange={(e) =>
                handleChange(
                  "category_id",
                  e.target.value
                )
              }
              className="w-full h-10 border rounded-md px-3"
            >
              <option value="">
                Select Category
              </option>

              {categories.map((cat: any) => (
                <option
                  key={cat.id}
                  value={cat.id}
                >
                  {cat.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Sub Category Name">
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
              <option value="1">
                Active
              </option>
              <option value="0">
                Inactive
              </option>
            </select>
          </Field>

          <Field label="Image">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file =
                  e.target.files?.[0];

                if (file) {
                  handleChange("image", file);
                  setPreview(
                    URL.createObjectURL(file)
                  );
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
                onError={(e) => {
                  // Fallback case if the image fails to resolve over network
                  (e.target as HTMLImageElement).style.display = "none";
                }}
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
            {isLoading
              ? "Updating..."
              : "Update Sub Category"}
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