"use client";

import { useEffect, useState } from "react";
import { Package, X } from "lucide-react";
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
  useUpdateProductMutation, 
  useDeleteProductImageMutation // Imported the hook
} from "@/app/store/api/productApi";
import { useGetAllCategoriesQuery } from "@/app/store/api/categoryApi";
import { useGetAllSubCategoriesQuery } from "@/app/store/api/subCategoryApi";
import { useGetAllBrandsQuery } from "@/app/store/api/brandApi";

export function EditProductModal({ product, open, setOpen, refetch }: any) {
  const [updateProduct, { isLoading }] = useUpdateProductMutation();
  const [deleteProductImage] = useDeleteProductImageMutation(); // Initialized mutation trigger

  const { data: categoryData } = useGetAllCategoriesQuery({});
  const { data: subCategoryData } = useGetAllSubCategoriesQuery({});
  const { data: brandData } = useGetAllBrandsQuery({});

  const categories = categoryData?.data || [];
  const subCategories = subCategoryData?.data || [];
  const brands = brandData?.data || [];

  const [preview, setPreview] = useState("");
  const [existingGallery, setExistingGallery] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    category_id: "",
    sub_category_id: "",
    brand_id: "",
    name: "",
    description: "",
    price: "",
    sale_price: "",
    stock: "",
    status: "1",
    thumbnail: null as File | null,
    images: [] as File[],
  });

  useEffect(() => {
    if (product) {
      setFormData({
        category_id: String(product.category_id || ""),
        sub_category_id: String(product.sub_category_id || ""),
        brand_id: String(product.brand_id || ""),
        name: product.name || "",
        description: product.description || "",
        price: String(product.price || ""),
        sale_price: String(product.sale_price || ""),
        stock: String(product.stock || ""),
        status: String(product.status ?? 1),
        thumbnail: null,
        images: [],
      });

      setPreview(product.thumbnail_url || "");
      setExistingGallery(product.gallery || []);
    }
  }, [product]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === "category_id") {
        updated.sub_category_id = "";
      }
      return updated;
    });
  };

  // Handler to call backend and remove selected gallery image from current view
  const handleDeleteGalleryImage = async (imageId: number) => {
    if (!confirm("Are you sure you want to remove this image from the gallery?")) return;

    try {
      await deleteProductImage(imageId).unwrap();
      toast.success("Image removed from gallery");
      
      // Update UI instantly by filtering out the item locally
      setExistingGallery((prev) => prev.filter((img) => img.id !== imageId));
      
      // Keep primary list synchronizations completely healthy
      refetch?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to remove gallery image");
    }
  };

  const filteredSubCategories = subCategories.filter(
    (item: any) => item.category_id == formData.category_id
  );

  const handleSubmit = async () => {
    if (!product?.id) return;

    try {
      const body = new FormData();
      body.append("category_id", formData.category_id);
      body.append("sub_category_id", formData.sub_category_id);
      body.append("brand_id", formData.brand_id);
      body.append("name", formData.name);
      body.append("description", formData.description);
      body.append("price", formData.price);
      body.append("sale_price", formData.sale_price);
      body.append("stock", formData.stock);
      body.append("status", formData.status);

      if (formData.thumbnail) {
        body.append("thumbnail", formData.thumbnail);
      }

      if (formData.images && formData.images.length > 0) {
        for (let i = 0; i < formData.images.length; i++) {
          body.append("images[]", formData.images[i]);
        }
      }

      const res = await updateProduct({
        id: product.id,
        formData: body,
      }).unwrap();

      toast.success(res?.message || "Product updated successfully");
      refetch?.();
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update product");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[750px] p-0 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b bg-muted/40 shrink-0">
          <div className="h-10 w-10 rounded-lg bg-cyan-600 flex items-center justify-center">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div>
            <DialogTitle>Edit Product</DialogTitle>
            <p className="text-sm text-muted-foreground">Update product details</p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="md:col-span-2">
            <Field label="Product Name">
              <Input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Category">
            <select
              value={formData.category_id}
              onChange={(e) => handleChange("category_id", e.target.value)}
              className="w-full h-10 border rounded-md px-3 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select Category</option>
              {categories.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Sub Category">
            <select
              value={formData.sub_category_id}
              onChange={(e) => handleChange("sub_category_id", e.target.value)}
              className="w-full h-10 border rounded-md px-3 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              disabled={!formData.category_id}
            >
              <option value="">Select Sub Category</option>
              {filteredSubCategories.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Brand">
            <select
              value={formData.brand_id}
              onChange={(e) => handleChange("brand_id", e.target.value)}
              className="w-full h-10 border rounded-md px-3 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select Brand</option>
              {brands.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Status">
            <select
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full h-10 border rounded-md px-3 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </Field>

          <Field label="Price">
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
            />
          </Field>

          <Field label="Sale Price">
            <Input
              type="number"
              value={formData.sale_price}
              onChange={(e) => handleChange("sale_price", e.target.value)}
            />
          </Field>

          <Field label="Stock">
            <Input
              type="number"
              value={formData.stock}
              onChange={(e) => handleChange("stock", e.target.value)}
            />
          </Field>

          <Field label="Change Thumbnail">
            <Input
              type="file"
              accept="image/*"
              className="pt-1.5"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleChange("thumbnail", file);
                  setPreview(URL.createObjectURL(file));
                }
              }}
            />
          </Field>

          {/* Thumbnail Preview Area */}
          {preview && (
            <div className="md:col-span-2 space-y-1.5">
              <Label className="text-xs text-muted-foreground">Active Thumbnail Preview</Label>
              <div className="relative h-20 w-20 rounded-lg border overflow-hidden shadow-inner bg-muted">
                <img src={preview} alt="Preview" className="h-full w-full object-cover" />
              </div>
            </div>
          )}

          {/* Add Additional Photos Field */}
          <div className="md:col-span-2">
            <Field label="Upload Additional Gallery Photos">
              <Input
                type="file"
                accept="image/*"
                multiple
                className="pt-1.5"
                onChange={(e) => {
                  if (e.target.files) {
                    handleChange("images", Array.from(e.target.files));
                  }
                }}
              />
              {formData.images.length > 0 && (
                <p className="text-xs text-cyan-600 mt-1 font-medium">
                  {formData.images.length} new image(s) staged to upload.
                </p>
              )}
            </Field>
          </div>

          {/* Existing Live Product Images Display with Delete/Remove Buttons */}
          {existingGallery.length > 0 && (
            <div className="md:col-span-2 space-y-2">
              <Label className="text-xs text-muted-foreground">Current Live Gallery Images</Label>
              <div className="flex flex-wrap gap-3 p-3 rounded-lg border bg-muted/20">
                {existingGallery.map((img: any) => (
                  <div key={img.id} className="group relative h-16 w-16 rounded-md border overflow-hidden bg-background shadow-sm">
                    <img
                      src={img.image_url}
                      alt="Gallery Asset"
                      className="h-full w-full object-cover"
                    />
                    
                    {/* Delete Icon Overlay Option Button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteGalleryImage(img.id)}
                      className="absolute top-1 right-1 h-5 w-5 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center rounded-full opacity-90 transition-transform active:scale-95 shadow-sm"
                      title="Remove from Gallery"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="md:col-span-2">
            <Field label="Description">
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full border rounded-md p-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-ring bg-background"
              />
            </Field>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t shrink-0 bg-background">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            {isLoading ? "Updating..." : "Update Product"}
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