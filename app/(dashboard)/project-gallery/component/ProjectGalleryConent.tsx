"use client"

import React, { useState } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

const images = [
  "https://picsum.photos/id/1011/600/400",
  "https://picsum.photos/id/1015/600/400",
  "https://picsum.photos/id/1016/600/400",
  "https://picsum.photos/id/1020/600/400",
  "https://picsum.photos/id/1024/600/400",
  "https://picsum.photos/id/1027/600/400",
]

const ProjectGalleryConent = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
const projectId = Number(searchParams.get("id"))

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      
   {/* HEADER */}
<div className="flex items-center gap-3 mb-6">
  
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
    Image Gallery
  </h2>
</div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, index) => (
          <div
            key={index}
            onClick={() => setSelectedImage(img)}
            className="cursor-pointer rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition"
          >
            <Image
              src={img}
              alt="gallery"
              width={600}
              height={400}
              className="w-full h-48 object-cover"
            />
          </div>
        ))}
      </div>

      {/* MODAL PREVIEW */}
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

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-white px-3 py-1 rounded-md text-sm shadow"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectGalleryConent