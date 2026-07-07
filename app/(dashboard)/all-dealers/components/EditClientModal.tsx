"use client";

import { useEffect, useState } from "react";
import { Plus, UserPlus } from "lucide-react";
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
import { useCreateClientMutation, useUpdateClientMutation } from "@/app/store/api/authApi"; // Import the hook
import { toast } from "sonner";

export function EditClientModal({ client, open, setOpen, refetch }: any) {


  // Updated state to match the API requirements
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
  });

const [updateClient, { isLoading }] = useUpdateClientMutation();
useEffect(() => {
  if (!open) {
    setFormData({
      name: "",
      email: "",
      phone_number: "",
      password: "",
    });
  }
}, [open]);
useEffect(() => {
  if (client) {
    setFormData({
      name: client.name || "",
      email: client.email || "",
      phone_number: client.phone_number || "",
      password: "", // ❌ don't prefill password
    });
  }
}, [client]);
  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

const handleSubmit = async () => {
  try {
    const res = await updateClient({
      id: client.id,
      name: formData.name,
      email: formData.email,
      phone_number: formData.phone_number,
    }).unwrap();

    toast.success(res?.message || "Client updated ✅");

    refetch(); // ✅ refresh table
    setOpen(false);
  } catch (err: any) {
    toast.error(err?.data?.message || "Update failed ❌");
  }
};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
  

      <DialogContent className="!max-w-[600px] w-[90vw] p-0 rounded-2xl flex flex-col">
        <div className="flex items-center gap-3 px-6 py-4 bg-muted/40 border-b">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <UserPlus className="w-4 h-4 text-white" />
          </div>
          <div>
            <DialogTitle className="text-sm font-medium">Edit Client</DialogTitle>
            <p className="text-xs text-muted-foreground">Update client account details</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <Field label="Name">
            <Input value={formData.name} onChange={(e) => handleChange("name", e.target.value)} />
          </Field>
          <Field label="Email">
            <Input value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
          </Field>
          <Field label="Phone Number">
            <Input value={formData.phone_number} onChange={(e) => handleChange("phone_number", e.target.value)} />
          </Field>
          <Field label="Password">
            <Input type="password" onChange={(e) => handleChange("password", e.target.value)} />
          </Field>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit} disabled={isLoading}>
{isLoading ? "Updating..." : "Update Client"}
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