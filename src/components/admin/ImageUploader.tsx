'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { uploadImage } from '@/app/actions/upload'
import { Input } from '@/components/ui/input'
import { Loader2, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
    value?: string
    onChange: (url: string) => void
    className?: string
}

export default function ImageUploader({ value, onChange, className }: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [preview, setPreview] = useState(value || '')

    useEffect(() => {
        setPreview(value || '')
    }, [value])

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (!file) return

        setIsUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const result = await uploadImage(formData)
            if (result.success && result.url) {
                setPreview(result.url)
                onChange(result.url)
            } else {
                alert(result.error || 'Upload failed')
            }
        } catch (error) {
            console.error('Upload error', error)
            alert('Upload error')
        } finally {
            setIsUploading(false)
        }
    }, [onChange])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': []
        },
        maxFiles: 1,
        disabled: isUploading
    })

    return (
        <div className={cn("space-y-4", className)}>
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 min-h-[150px]",
                    isDragActive ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300",
                    isUploading && "opacity-50 cursor-not-allowed"
                )}
            >
                <input {...getInputProps()} />

                {preview ? (
                    <div className="relative w-full h-[200px] flex items-center justify-center rounded-md overflow-hidden bg-muted/50">
                        <img
                            src={preview}
                            alt="Preview"
                            className="max-w-full max-h-full object-contain"
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation() // Prevent dropzone click
                                setPreview('')
                                onChange('')
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-sm z-10"
                            type="button"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <>
                        {isUploading ? (
                            <Loader2 className="h-10 w-10 text-gray-400 animate-spin" />
                        ) : (
                            <Upload className="h-10 w-10 text-gray-400" />
                        )}
                        <p className="text-sm text-gray-500 font-medium text-center">
                            {isUploading ? "Uploading..." : "Drag & drop an image here, or click to select"}
                        </p>
                        <p className="text-xs text-gray-400">
                            Supports: PNG, JPG, GIF
                        </p>
                    </>
                )}
            </div>

            {/* Fallback manual input */}
            <Input
                placeholder="Or paste image URL directly..."
                value={preview}
                onChange={(e) => {
                    setPreview(e.target.value)
                    onChange(e.target.value)
                }}
                className="text-xs text-muted-foreground"
            />
        </div>
    )
}
