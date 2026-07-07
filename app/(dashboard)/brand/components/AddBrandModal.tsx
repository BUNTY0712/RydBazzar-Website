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

import {
  useCreateBrandMutation,
} from "@/app/store/api/brandApi";

export function AddBrandModal({ refetch }: any) {
  const [open, setOpen] = useState(false);

  const [createBrand, { isLoading }] =
    useCreateBrandMutation();

  const [formData, setFormData] = useState({
    name: "",
    logo: null as File | null,
  });

  const handleChange = (
    key: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Brand name is required");
      return;
    }

    try {
      const body = new FormData();

      body.append("name", formData.name);

      if (formData.logo) {
        body.append("logo", formData.logo);
      }

      const res = await createBrand(body).unwrap();

      toast.success(
        res?.message ||
          "Brand created successfully"
      );

      setFormData({
        name: "",
        logo: null,
      });

      setOpen(false);

      refetch?.();
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          "Failed to create brand"
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-cyan-500 to-slate-800 text-white gap-2">
          <Plus className="h-4 w-4" />
          Create Brand
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[600px] p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b bg-muted/40">
          <div className="h-10 w-10 rounded-lg bg-cyan-600 flex items-center justify-center">
            <FolderPlus className="h-5 w-5 text-white" />
          </div>

          <div>
            <DialogTitle>
              Create Brand
            </DialogTitle>

            <p className="text-sm text-muted-foreground">
              Add a new brand
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          <Field label="Brand Name">
            <Input
              placeholder="Enter brand name"
              value={formData.name}
              onChange={(e) =>
                handleChange(
                  "name",
                  e.target.value
                )
              }
            />
          </Field>

          <Field label="Brand Logo">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleChange(
                  "logo",
                  e.target.files?.[0] ||
                    null
                )
              }
            />
          </Field>

          {formData.logo && (
            <img
              src={URL.createObjectURL(
                formData.logo
              )}
              alt="Preview"
              className="h-24 w-24 rounded-lg object-cover border"
            />
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
              ? "Creating..."
              : "Create Brand"}
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