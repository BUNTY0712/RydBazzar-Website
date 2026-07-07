"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash, Plus, Pencil, Check, X, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

// Import your complete set of RTK Query mutations and queries
import {
  useGetVariantsByProductIdQuery,
  useCreateProductVariantMutation,
  useUpdateProductVariantMutation,
  useDeleteProductVariantMutation,
} from "@/app/store/api/productVariantApi";

interface ManageVariantsFormProps {
  product: any;
  refetchProducts: () => void;
  onBeforeFinish: (isValid: boolean) => void;
}

export function ManageVariantsForm({ product, refetchProducts, onBeforeFinish }: ManageVariantsFormProps) {
  // 1. Fetch live variant records from the backend
  const { data: responseData, isLoading: isFetching, refetch: refetchVariants } = useGetVariantsByProductIdQuery(
    product?.id,
    { skip: !product?.id }
  );

  // 2. Setup RTK Mutation hooks
  const [createProductVariant, { isLoading: isCreating }] = useCreateProductVariantMutation();
  const [updateProductVariant, { isLoading: isUpdating }] = useUpdateProductVariantMutation();
  const [deleteProductVariant, { isLoading: isDeleting }] = useDeleteProductVariantMutation();

  const [newVariant, setNewVariant] = useState({ size: "", color: "", stock: 0 });
  
  // Inline edit state structures
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ size: "", color: "", stock: 0 });

  const variants = responseData?.data || [];

  // FIXED: Using a clean string selector instead of passing a DOM Element object
  const modalTargetSelector = '[role="dialog"]';

  // Exposed Validation orchestrator logic triggers feedback UI banners 
  const validateAndComplete = () => {
    if (editingId !== null) {
      Swal.fire({
        icon: "warning",
        title: "Unsaved Changes",
        text: "Please save or cancel your active row edit before finishing.",
        confirmButtonColor: "#0891b2",
        target: modalTargetSelector, 
      });
      onBeforeFinish(false);
      return;
    }

    if (variants.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Variants Added",
        text: "You must add at least one configuration variant for this product.",
        confirmButtonColor: "#0891b2",
        target: modalTargetSelector,
      });
      onBeforeFinish(false);
      return;
    }

    onBeforeFinish(true);
  };

  // 3. Handle Adding a Variant to DB
  const handleAddVariant = async () => {
    if (!newVariant.size.trim() || !newVariant.color.trim()) {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Please enter values for both Size and Color.",
        target: modalTargetSelector
      });
      return;
    }

    try {
      await createProductVariant({
        product_id: product.id,
        size: newVariant.size,
        color: newVariant.color,
        stock: newVariant.stock,
      }).unwrap();

      setNewVariant({ size: "", color: "", stock: 0 });
      refetchVariants();
      refetchProducts();

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Variant added successfully",
        showConfirmButton: false,
        timer: 2000,
        target: modalTargetSelector
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.data?.message || "Failed to add product variant",
        target: modalTargetSelector
      });
    }
  };

  // 4. Initialize Inline Row Edit Mode
  const startEditing = (variant: any) => {
    setEditingId(variant.id);
    setEditForm({
      size: variant.size,
      color: variant.color,
      stock: variant.stock
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  // 5. Handle Updating a Variant in DB
  const handleUpdateVariant = async (variantId: number) => {
    if (!editForm.size.trim() || !editForm.color.trim()) {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Size and Color values cannot be empty.",
        target: modalTargetSelector
      });
      return;
    }

    try {
      await updateProductVariant({
        id: variantId,
        product_id: product.id,
        size: editForm.size,
        color: editForm.color,
        stock: editForm.stock
      }).unwrap();

      setEditingId(null);
      refetchVariants();
      refetchProducts();

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Variant updated successfully",
        showConfirmButton: false,
        timer: 2000,
        target: modalTargetSelector
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.data?.message || "Failed to update variant",
        target: modalTargetSelector
      });
    }
  };

  // 6. Handle Deleting a Variant from DB
  const handleDeleteVariant = async (variantId: number) => {
    const result = await Swal.fire({
      title: "Remove this option?",
      text: "This specific product variant will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      target: modalTargetSelector
    });

    if (!result.isConfirmed) return;

    try {
      await deleteProductVariant(variantId).unwrap();
      refetchVariants();
      refetchProducts();
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Variant dropped successfully.",
        target: modalTargetSelector
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.data?.message || "Failed to delete variant",
        target: modalTargetSelector
      });
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium tracking-tight">
          Manage Variants for: <span className="text-cyan-600 font-semibold">{product?.name}</span>
        </h3>
      </div>

      {/* Form Grid to Add New Variant Row */}
      <div className="grid grid-cols-3 gap-3 items-end bg-muted/40 p-4 rounded-xl border">
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Size</label>
          <Input 
            placeholder="e.g., XL, 42" 
            value={newVariant.size} 
            onChange={e => setNewVariant({...newVariant, size: e.target.value})}
            disabled={isCreating}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Color</label>
          <Input 
            placeholder="e.g., Red, Navy" 
            value={newVariant.color} 
            onChange={e => setNewVariant({...newVariant, color: e.target.value})}
            disabled={isCreating}
          />
        </div>
        <div className="flex gap-2">
          <div className="w-full">
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Stock</label>
            <Input 
              type="number" 
              min="0"
              value={newVariant.stock} 
              onChange={e => setNewVariant({...newVariant, stock: Math.max(0, parseInt(e.target.value) || 0)})}
              disabled={isCreating}
            />
          </div>
          <Button 
            onClick={handleAddVariant} 
            size="icon" 
            className="bg-cyan-600 hover:bg-cyan-700 shrink-0"
            disabled={isCreating}
          >
            {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Variants Matrix Data Table */}
      <div className="border rounded-lg max-h-[320px] overflow-y-auto relative bg-background">
        <Table>
          <TableHeader className="bg-muted/50 sticky top-0 z-10">
            <TableRow>
              <TableHead>Size</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Available Stock</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-cyan-600" />
                </TableCell>
              </TableRow>
            ) : variants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground text-sm py-8">
                  No variants created yet for this product.
                </TableCell>
              </TableRow>
            ) : (
              variants.map((v: any) => {
                const isEditingThisRow = editingId === v.id;

                return (
                  <TableRow key={v.id} className="hover:bg-muted/40 transition-colors">
                    {isEditingThisRow ? (
                      <>
                        <TableCell className="p-2">
                          <Input 
                            value={editForm.size} 
                            onChange={e => setEditForm({...editForm, size: e.target.value})}
                            className="h-8 py-0"
                          />
                        </TableCell>
                        <TableCell className="p-2">
                          <Input 
                            value={editForm.color} 
                            onChange={e => setEditForm({...editForm, color: e.target.value})}
                            className="h-8 py-0"
                          />
                        </TableCell>
                        <TableCell className="p-2">
                          <Input 
                            type="number"
                            min="0"
                            value={editForm.stock} 
                            onChange={e => setEditForm({...editForm, stock: Math.max(0, parseInt(e.target.value) || 0)})}
                            className="h-8 py-0 font-mono"
                          />
                        </TableCell>
                        <TableCell className="text-right p-2">
                          <div className="flex justify-end gap-1">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="text-green-600 hover:text-green-700 hover:bg-green-50 h-8 w-8"
                              onClick={() => handleUpdateVariant(v.id)}
                              disabled={isUpdating}
                            >
                              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="text-slate-500 hover:bg-muted h-8 w-8"
                              onClick={cancelEditing}
                              disabled={isUpdating}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="font-medium">{v.size}</TableCell>
                        <TableCell>{v.color}</TableCell>
                        <TableCell className="font-mono">{v.stock} units</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg h-8 w-8"
                              onClick={() => startEditing(v)}
                              disabled={editingId !== null || isDeleting}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg h-8 w-8"
                              onClick={() => handleDeleteVariant(v.id)}
                              disabled={editingId !== null || isDeleting}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="pt-2 border-t flex justify-end">
        <Button 
          onClick={validateAndComplete}
          className="bg-slate-800 hover:bg-slate-900 text-white font-medium shadow-sm transition-colors"
        >
          <Check className="h-4 w-4 mr-2" />
          Finish Configurations
        </Button>
      </div>
    </div>
  );
}