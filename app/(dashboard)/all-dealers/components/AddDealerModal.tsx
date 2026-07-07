"use client";

import { useState } from "react";
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
import { useCreateDealerMutation } from "@/app/store/api/authApi";


export function AddDealerModal() {
  const [images, setImages] = useState<File[]>([]);
  const [dealerName, setDealerName] = useState("");

  const [createDealer, { isLoading }] = useCreateDealerMutation();

  // ✅ Handle multiple file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);
    setImages((prev) => [...prev, ...filesArray]);

    e.target.value = "";
  };

  // ✅ Remove image
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Submit handler (API Integrated)
  const handleSubmit = async () => {
    if (!dealerName) {
      alert("Dealer name is required");
      return;
    }

    try {
      const formData = new FormData();

      // ⚠️ IMPORTANT: must match backend
      formData.append("name", dealerName);

      images.forEach((img) => {
        formData.append("images[]", img);
      });

      const res = await createDealer(formData).unwrap();

      console.log("Success:", res);

      // ✅ Reset form after success
      setDealerName("");
      setImages([]);

      alert("Dealer created successfully ✅");
    } catch (error: any) {
      console.error("Error:", error);
      alert("Something went wrong ❌");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-cyan-500 to-slate-800 text-white gap-1.5">
          <Plus className="w-4 h-4" /> Add Dealer
        </Button>
      </DialogTrigger>

      <DialogContent className="!max-w-[500px] w-[90vw] p-0 rounded-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 bg-muted/40 border-b">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <UserPlus className="w-4 h-4 text-white" />
          </div>
          <div>
            <DialogTitle className="text-sm font-medium">
              Add Dealer
            </DialogTitle>
            <p className="text-xs text-muted-foreground">
              Enter dealer details
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Dealer Name */}
          <Field label="Dealer Name">
            <Input
              placeholder="Enter dealer name"
              value={dealerName}
              onChange={(e) => setDealerName(e.target.value)}
            />
          </Field>

          {/* Upload Images */}
          <Field label="Upload Images">
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
          </Field>

          {/* Preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {images.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-full h-20 object-cover rounded-md border"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black text-white text-xs px-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Dealer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Field Component
function Field({ label, children }: any) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}