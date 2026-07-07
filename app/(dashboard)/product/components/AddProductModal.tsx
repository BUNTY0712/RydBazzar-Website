"use client";

import { useState } from "react";
import { Plus, PackagePlus, X, ArrowRight } from "lucide-react";
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

import { useCreateProductMutation } from "@/app/store/api/productApi";
import { useGetAllCategoriesQuery } from "@/app/store/api/categoryApi";
import { useGetAllSubCategoriesQuery } from "@/app/store/api/subCategoryApi";
import { useGetAllBrandsQuery } from "@/app/store/api/brandApi";
import { ManageVariantsForm } from "./ManageVariantsForm";

export function AddProductModal({ refetch }: any) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "variants">("form");
  const [createdProduct, setCreatedProduct] = useState<any>(null);

  const [createProduct, { isLoading }] = useCreateProductMutation();

  const { data: categoryData } = useGetAllCategoriesQuery({});
  const { data: subCategoryData } = useGetAllSubCategoriesQuery({});
  const { data: brandData } = useGetAllBrandsQuery({});

  const categories = categoryData?.data || [];
  const subCategories = subCategoryData?.data || [];
  const brands = brandData?.data || [];

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

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(() => {
        setStep("form");
        setCreatedProduct(null);
      }, 200);
    }
  };

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === "category_id") updated.sub_category_id = "";
      return updated;
    });
  };

  const handleAddGalleryImages = (newFiles: FileList) => {
    const fileArray = Array.from(newFiles);
    setFormData((prev) => {
      const uniqueNewFiles = fileArray.filter(
        (newFile) => !prev.images.some((oldFile) => oldFile.name === newFile.name && oldFile.size === newFile.size)
      );
      return { ...prev, images: [...prev.images, ...uniqueNewFiles] };
    });
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const filteredSubCategories = subCategories.filter(
    (item: any) => item.category_id == formData.category_id
  );

  const handleSubmit = async () => {
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

      if (formData.thumbnail) body.append("thumbnail", formData.thumbnail);

      if (formData.images && formData.images.length > 0) {
        for (let i = 0; i < formData.images.length; i++) {
          body.append("images[]", formData.images[i]);
        }
      }

      const res = await createProduct(body).unwrap();
      toast.success(res?.message || "Product created successfully");
      
      setCreatedProduct(res?.data || res?.product);
      
      setFormData({
        category_id: "",
        sub_category_id: "",
        brand_id: "",
        name: "",
        description: "",
        price: "",
        sale_price: "",
        stock: "",
        status: "1",
        thumbnail: null,
        images: [],
      });
      
      refetch?.();
      setStep("variants");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create product");
    }
  };

  // Intercept callback handler triggered by child variant panel validation parameters
  const handleVariantValidationResult = (isValid: boolean) => {
    if (isValid) {
      handleOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-cyan-500 to-slate-800 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Product
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[750px] w-full p-0 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-cyan-600 flex items-center justify-center">
              <PackagePlus className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle>{step === "form" ? "Create Product" : "Manage Product Variants"}</DialogTitle>
              <p className="text-sm text-muted-foreground">
                {step === "form" ? "Add new product details" : "Configure matrix configurations"}
              </p>
            </div>
          </div>
          {step === "form" && (
            <div className="text-sm font-medium px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full dark:bg-cyan-900 dark:text-cyan-200">
              {formData.images.length} {formData.images.length === 1 ? "image" : "images"} selected
            </div>
          )}
        </div>

        {step === "form" ? (
          <>
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Field label="Product Name">
                  <Input value={formData.name} onChange={(e) => handleChange("name", e.target.value)} />
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
                    <option key={item.id} value={item.id}>{item.name}</option>
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
                    <option key={item.id} value={item.id}>{item.name}</option>
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
                    <option key={item.id} value={item.id}>{item.name}</option>
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
                <Input type="number" value={formData.price} onChange={(e) => handleChange("price", e.target.value)} />
              </Field>

              <Field label="Sale Price">
                <Input type="number" value={formData.sale_price} onChange={(e) => handleChange("sale_price", e.target.value)} />
              </Field>

              <Field label="Stock">
                <Input type="number" value={formData.stock} onChange={(e) => handleChange("stock", e.target.value)} />
              </Field>

              <Field label="Main Thumbnail">
                <Input type="file" accept="image/*" className="pt-1.5" onChange={(e) => handleChange("thumbnail", e.target.files?.[0] || null)} />
              </Field>

              {formData.thumbnail && (
                <div className="md:col-span-2 space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Selected Main Thumbnail Preview</Label>
                  <div className="group relative h-24 w-24 rounded-xl border bg-background shadow-sm overflow-hidden">
                    <img src={URL.createObjectURL(formData.thumbnail)} alt="Thumbnail Preview" className="h-full w-full object-cover" />
                    <button type="button" onClick={() => handleChange("thumbnail", null)} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>
              )}

              <div className="md:col-span-2">
                <Field label="Product Gallery Photos (Select Multiple)">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    className="pt-1.5"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleAddGalleryImages(e.target.files);
                        e.target.value = ""; 
                      }
                    }}
                  />
                  {formData.images.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-cyan-600 font-medium">Staged Gallery Images ({formData.images.length})</p>
                      <div className="flex flex-wrap gap-3 p-3 rounded-xl border border-dashed bg-muted/30">
                        {formData.images.map((file, index) => (
                          <div key={`${file.name}-${index}`} className="group relative h-16 w-16 rounded-lg border bg-background shadow-sm overflow-hidden">
                            <img src={URL.createObjectURL(file)} alt="Gallery Staged Preview" className="h-full w-full object-cover" />
                            <button type="button" onClick={() => handleRemoveGalleryImage(index)} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <X className="h-4 w-4 text-white drop-shadow" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Field>
              </div>

              <div className="md:col-span-2">
                <Field label="Description">
                  <textarea value={formData.description} onChange={(e) => handleChange("description", e.target.value)} className="w-full border rounded-md p-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-ring bg-background" />
                </Field>
              </div>
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t shrink-0 bg-background">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSubmit} disabled={isLoading} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                {isLoading ? "Creating..." : <>Next<ArrowRight className="h-4 w-4 ml-2" /></>}
              </Button>
            </div>
          </>
        ) : (
          /* STEP 2: The finish buttons are now managed directly within the form structure */
          <div className="p-6 overflow-y-auto block w-full max-h-[65vh]">
            <ManageVariantsForm 
              product={createdProduct} 
              refetchProducts={refetch} 
              onBeforeFinish={handleVariantValidationResult}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}