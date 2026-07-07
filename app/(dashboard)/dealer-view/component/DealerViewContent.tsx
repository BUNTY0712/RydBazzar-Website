"use client"

import React, { useState } from "react"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  useGetDealerByIdQuery,
  useDeleteDealerImageMutation,
} from "@/app/store/api/authApi"
import { AddImageModal } from "./AddImageModal"
import Swal from "sweetalert2"

const DealerViewContent = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const dealerId = Number(searchParams.get("dealerId"))

  const { data, isLoading, refetch } = useGetDealerByIdQuery(dealerId)
  const [deleteDealerImage] = useDeleteDealerImageMutation()

  if (!dealerId) {
    return <p className="p-6 text-red-500">Invalid Dealer ID</p>
  }

  if (isLoading) return <p className="p-6">Loading...</p>

  // ✅ IMPORTANT: include id
  const allImages =
    data?.data?.images?.map((img: any) => ({
      id: img.id,
      url: `http://127.0.0.1:8000/storage/${img.image_url}`,
      dealerName: data?.data?.name,
    })) || []

  // ✅ DELETE HANDLER
const handleDelete = async (e: any, imageId: number) => {
  e.stopPropagation()

  const result = await Swal.fire({
    title: "Delete Image?",
    text: "This action cannot be undone!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, delete it!",
  })

  if (!result.isConfirmed) return

  try {
    // 🔄 show loading
    Swal.fire({
      title: "Deleting...",
      text: "Please wait",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })

    const res = await deleteDealerImage(imageId).unwrap()

    // ✅ success
    Swal.fire({
      title: "Deleted!",
      text: res.message || "Image deleted successfully",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    })

    refetch()
  } catch (err: any) {
    // ❌ error
    Swal.fire({
      title: "Error!",
      text: err?.data?.message || "Something went wrong",
      icon: "error",
    })
  }
}

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="flex justify-between items-center gap-3 mb-6">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="rounded-lg flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-slate-800 cursor-pointer border-none text-white"
          >
            <ArrowLeft className="h-6 w-6 text-white" />
          </Button>

          <h2 className="text-xl font-semibold bg-gradient-to-r from-cyan-500 to-slate-800 bg-clip-text text-transparent">
            Dealer Image Gallery
          </h2>
        </div>

        <AddImageModal dealerId={dealerId} refetch={refetch} />
      </div>

      {/* EMPTY */}
      {allImages.length === 0 ? (
        <p>No Images Found</p>
      ) : (
        <>
          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {allImages.map((img: any) => (
              <div
                key={img.id}
                onClick={() => setSelectedImage(img.url)}
                className="cursor-pointer rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition relative group"
              >
                {/* ❌ DELETE ICON */}
                <button
                  onClick={(e) => handleDelete(e, img.id)}
                  className="absolute top-2 right-2 bg-red-500 cursor-pointer hover:bg-red-600 text-white p-1.5 rounded-full shadow-md z-10 opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <Image
                  src={img.url}
                  alt="gallery"
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover"
                />

                <div className="absolute bottom-0 w-full bg-black/50 text-white text-sm p-2">
                  {img.dealerName}
                </div>
              </div>
            ))}
          </div>

          {/* IMAGE PREVIEW */}
          {selectedImage && (
            <div
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative max-w-3xl w-full p-4">
                <Image
                  src={selectedImage}
                  alt="preview"
                  width={800}
                  height={500}
                  className="w-full h-auto rounded-xl"
                />

                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 bg-white px-3 py-1 rounded-md text-sm shadow"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default DealerViewContent