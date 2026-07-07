"use client"

import React, { useState } from "react"
import { FileText } from "lucide-react"
import { useSearchParams } from "next/navigation"

import { useGetProjectPdfsQuery } from "@/app/store/api/authApi"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddPdfModal } from "./AddPdfModal"

const ProjectPdfContent = () => {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null)
  const router = useRouter()

  const searchParams = useSearchParams()
  const projectId = Number(searchParams.get("id"))

  // ✅ Fetch API data
  const { data, isLoading, refetch } =
    useGetProjectPdfsQuery(projectId, {
      skip: !projectId,
    })

  const pdfFiles = data || []

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
      PDF Gallery
    </h2>
  </div>

  {/* ✅ Upload Modal */}
  <AddPdfModal projectId={projectId} refetch={refetch} />
</div>

      {/* LOADING */}
      {isLoading && (
        <p className="text-center text-gray-500">Loading files...</p>
      )}

      {/* EMPTY STATE */}
      {!isLoading && pdfFiles.length === 0 && (
        <p className="text-center text-gray-400">
          No files uploaded yet
        </p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {pdfFiles.map((file: any, index: number) => (
          <div
            key={index}
            onClick={() => setSelectedPdf(file.file_url)}
            className="cursor-pointer p-5 rounded-xl border bg-white shadow-sm hover:shadow-lg transition flex items-center gap-4"
          >
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-slate-800 text-white">
              <FileText className="h-6 w-6" />
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

      {/* PDF PREVIEW MODAL */}
      {selectedPdf && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setSelectedPdf(null)}
        >
          <div
            className="bg-white w-[90%] h-[90%] rounded-xl overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE */}
            <button
              onClick={() => setSelectedPdf(null)}
              className="absolute top-2 right-2 bg-gray-200 px-3 py-1 rounded-md text-sm z-10"
            >
              ✕
            </button>

            {/* PDF VIEW */}
            <iframe
              src={selectedPdf}
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectPdfContent