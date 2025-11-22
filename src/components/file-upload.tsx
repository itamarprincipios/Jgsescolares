"use client";

import { Upload, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    currentImage?: string | null;
    accept?: string;
}

export default function FileUpload({ onFileSelect, currentImage, accept = "image/*" }: FileUploadProps) {
    const [preview, setPreview] = useState<string | null>(currentImage || null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileSelect(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearPreview = () => {
        setPreview(null);
    };

    return (
        <div className="space-y-3">
            {preview ? (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-white/10">
                    <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-cover"
                    />
                    <button
                        onClick={clearPreview}
                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                        type="button"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-xs text-slate-400">Upload</span>
                    <input
                        type="file"
                        className="hidden"
                        accept={accept}
                        onChange={handleFileChange}
                    />
                </label>
            )}
        </div>
    );
}
