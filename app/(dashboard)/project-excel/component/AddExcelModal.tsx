"use client";

import { useState } from "react";
import { Plus, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUploadProjectAssetMutation } from "@/app/store/api/authApi";

export function AddExcelModal({ projectId, refetch }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [assetType, setAssetType] = useState("basic");

  const [uploadProjectAsset, { isLoading }] =
    useUploadProjectAssetMutation();

  // ✅ Excel File Validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const allowedTypes = [
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Only Excel files (.xls, .xlsx) are allowed ❌");
      return;
    }

    setFile(selectedFile);
  };

  // ✅ Submit
  const handleSubmit = async () => {
    if (!fileName || !file || !assetType) {
      alert("All fields are required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("project_id", projectId.toString());
      formData.append("asset_type", assetType);
      formData.append("file", file);
      formData.append("file_name", fileName);

      await uploadProjectAsset(formData).unwrap();

      // ✅ refresh list (if passed)
      if (refetch) refetch();

      // reset
      setFile(null);
      setFileName("");
      setAssetType("basic");
      setIsOpen(false);

      alert("Excel uploaded successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Upload failed ❌");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-cyan-500 to-slate-800 text-white gap-1.5">
          <Plus className="w-4 h-4" /> Add Excel
        </Button>
      </DialogTrigger>

      <DialogContent className="!max-w-[500px] w-[90vw] p-0 rounded-2xl flex flex-col">
        {/* HEADER */}
        <div className="flex items-center gap-3 px-6 py-4 bg-muted/40 border-b">
          <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
            <FileSpreadsheet className="w-4 h-4 text-white" />
          </div>
          <div>
            <DialogTitle className="text-sm font-medium">
              Upload Excel
            </DialogTitle>
            <p className="text-xs text-muted-foreground">
              Only .xls, .xlsx allowed
            </p>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">
          {/* File Name */}
          <Field label="File Name">
            <Input
              placeholder="Enter file name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </Field>

          {/* Type */}
          <Field label="Type">
            <select
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
              className="border rounded-md h-9 px-2 text-sm"
            >
              <option value="basic">Basic</option>
              <option value="master">Master</option>
            </select>
          </Field>

          {/* Upload */}
          <Field label="Upload Excel">
            <Input
              type="file"
              accept=".xls,.xlsx"
              onChange={handleFileChange}
            />
          </Field>

          {/* Preview */}
          {file && (
            <div className="text-sm text-gray-600">
              Selected: {file.name}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
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

function Field({ label, children }: any) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}