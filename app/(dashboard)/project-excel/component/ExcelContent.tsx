"use client"

import React, { useState } from "react"
import { FileSpreadsheet } from "lucide-react"
import { useSearchParams } from "next/navigation"

import { useGetProjectExcelsQuery } from "@/app/store/api/authApi"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddExcelModal } from "./AddExcelModal"

const ExcelContent = () => {
  const [selectedFile, setSelectedFile] = useState<any>(null)
const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = Number(searchParams.get("id"))

  // ✅ API CALL
  const { data, isLoading, refetch } =
    useGetProjectExcelsQuery(projectId, {
      skip: !projectId,
    })

  const excelFiles = data || []

  return (
    <div className="p-6 min-h-screen bg-gray-50">

      {/* HEADER */}
     {/* HEADER */}
<div className="flex justify-between items-center mb-6">
  
  <div className="flex items-center gap-3">
    
    {/* ✅ BACK BUTTON */}
    <Button
    variant="outline"
    size="sm"
    onClick={() => router.back()}
    className="rounded-lg flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-slate-800 cursor-pointer border-none text-white hover:bg-gradient-to-r hover:from-cyan-600 hover:to-slate-900 transition"
  >
  <ArrowLeft className="h-10 w-10 text-white" />
  </Button>

    <h2 className="text-xl font-semibold bg-gradient-to-r from-cyan-500 to-slate-800 bg-clip-text text-transparent">
      Excel Gallery
    </h2>
  </div>

  {/* ✅ Upload Modal */}
  <AddExcelModal projectId={projectId} refetch={refetch} />
</div>

      {/* LOADING */}
      {isLoading && (
        <p className="text-center text-gray-500">Loading files...</p>
      )}

      {/* EMPTY */}
      {!isLoading && excelFiles.length === 0 && (
        <p className="text-center text-gray-400">
          No Excel files uploaded yet
        </p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {excelFiles.map((file: any, index: number) => (
          <div
            key={index}
            onClick={() => setSelectedFile(file)}
            className="cursor-pointer p-5 rounded-xl border bg-white shadow-sm hover:shadow-lg transition flex items-center gap-4"
          >
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-slate-800 text-white">
              <FileSpreadsheet className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-800">
                {file.file_name}
              </p>
             <span
  className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full capitalize
    ${
      file.asset_type === "master"
        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
        : "bg-gray-200 text-gray-700"
    }
  `}
>
  {file.asset_type}
</span>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL (DOWNLOAD / OPEN) */}
      {selectedFile && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setSelectedFile(null)}
        >
          <div
            className="bg-white w-[400px] rounded-xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedFile(null)}
              className="absolute top-2 right-2 bg-gray-200 px-3 py-1 rounded-md text-sm"
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold mb-4">
              {selectedFile.file_name}
            </h3>

            <div className="flex flex-col gap-3">
              {/* OPEN */}
              <a
                href={selectedFile.file_url}
                target="_blank"
                className="bg-blue-600 text-white px-4 py-2 rounded text-center"
              >
                Open File
              </a>

              {/* DOWNLOAD */}
              <a
                href={selectedFile.file_url}
                download
                className="bg-gray-800 text-white px-4 py-2 rounded text-center"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExcelContent