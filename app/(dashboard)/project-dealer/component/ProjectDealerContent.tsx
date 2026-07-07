"use client"

import React, { useState } from "react"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGetProjectByIdQuery } from "@/app/store/api/authApi"

const ProjectDealerContent = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    const searchParams = useSearchParams()
    const router = useRouter()
    const projectId = Number(searchParams.get("id"))

    const { data, isLoading } = useGetProjectByIdQuery(projectId)

    if (isLoading) return <p className="p-6">Loading...</p>

    // ✅ Extract all dealer images into single array
    const allImages =
        data?.data?.dealers_data?.flatMap((dealer: any) =>
            dealer.images.map((img: any) => ({
                url: `http://127.0.0.1:8000/storage/${img.image_url}`,
                dealerName: dealer.name,
            }))
        ) || []

    return (
        <div className="p-6 min-h-screen bg-gray-50">

            {/* HEADER */}
            <div className="flex items-center gap-3 mb-6">
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

            {/* EMPTY STATE */}
            {allImages.length === 0 ? (
                <p>No Images Found</p>
            ) : (
                <>
                    {/* GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {allImages.map((img: any, index: number) => (
                            <div
                                key={index}
                                onClick={() => setSelectedImage(img.url)}
                                className="cursor-pointer rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition relative"
                            >
                                <Image
                                    src={img.url}
                                    alt="gallery"
                                    width={600}
                                    height={400}
                                    className="w-full h-48 object-cover"
                                />

                                {/* Dealer Name Overlay */}
                                <div className="absolute bottom-0 w-full bg-black/50 text-white text-sm p-2">
                                    {img.dealerName}
                                </div>
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

export default ProjectDealerContent