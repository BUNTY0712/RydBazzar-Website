"use client";

import { useState } from "react";
import { Plus, ImageIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUploadDealerImagesMutation } from "@/app/store/api/authApi";

export function AddImageModal({ dealerId, refetch }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [uploadDealerImages, { isLoading }] =
    useUploadDealerImagesMutation();

  // ✅ Handle file select + preview
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFiles = e.target.files;
  if (!selectedFiles) return;

  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  const newFiles: File[] = [];
  const newPreviews: string[] = [];

  for (let file of Array.from(selectedFiles)) {
    if (!allowedTypes.includes(file.type)) {
      alert("Only images (jpg, png) allowed ❌");
      return;
    }
    newFiles.push(file);
    newPreviews.push(URL.createObjectURL(file));
  }

  // ✅ merge with existing files
  const existingFiles = Array.from(files || []);
  const allFiles = [...existingFiles, ...newFiles];

  const dt = new DataTransfer();
  allFiles.forEach((file) => dt.items.add(file));

  setFiles(dt.files);

  // ✅ merge previews also
  setPreviewUrls((prev) => [...prev, ...newPreviews]);
};

  // ✅ Remove single image
  const removeImage = (index: number) => {
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newPreviews);

    const newFiles = Array.from(files || []).filter((_, i) => i !== index);

    const dt = new DataTransfer();
    newFiles.forEach((f) => dt.items.add(f));

    setFiles(dt.files);
  };

  // ✅ Upload
  const handleSubmit = async () => {
    if (!files || !dealerId) {
      alert("Select images first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("dealer_id", dealerId.toString());

      Array.from(files).forEach((file) => {
        formData.append("images[]", file);
      });

      await uploadDealerImages(formData).unwrap();

      if (refetch) refetch();

      // reset
      setFiles(null);
      setPreviewUrls([]);
      setIsOpen(false);

      alert("Images uploaded successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Upload failed ❌");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-cyan-500 to-slate-800 text-white gap-1.5">
         <Upload className="w-4 h-4" /> Upload Images
        </Button>
      </DialogTrigger>

      <DialogContent className="!max-w-[500px] w-[90vw] p-0 rounded-2xl flex flex-col">
        {/* HEADER */}
        <div className="flex items-center gap-3 px-6 py-4 bg-muted/40 border-b">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <ImageIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <DialogTitle className="text-sm font-medium">
              Upload Images
            </DialogTitle>
            <p className="text-xs text-muted-foreground">
              JPG, PNG allowed
            </p>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">
          {/* File input */}
          <Field label="Select Images">
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
          </Field>

          {/* Preview */}
          {previewUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {previewUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative rounded-lg overflow-hidden border"
                >
                  <img
                    src={url}
                    alt="preview"
                    className="w-full h-24 object-cover"
                  />

                  {/* Remove button */}
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Reusable field wrapper
function Field({ label, children }: any) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}