"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { toast } from 'react-toastify';

interface HeroBackgroundImageProps {
    initialImageUrl?: string;
    onImageUpload: (file: File) => Promise<string>;
    onSave: (data: { backgroundImageUrl: string }) => Promise<void>;
}

export function HeroBackgroundImage({ initialImageUrl, onImageUpload, onSave }: HeroBackgroundImageProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | undefined>(initialImageUrl);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setImageUrl(initialImageUrl);
    }, [initialImageUrl]);

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
        e.target.value = '';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            handleFileSelect(file);
        } else {
            toast.warning('Please drop an image file');
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleReplaceClick = async () => {
        if (!selectedFile) {
            toast.warning('Please select an image first');
            return;
        }

        setIsUploading(true);
        try {
            const uploadedUrl = await onImageUpload(selectedFile);
            setImageUrl(uploadedUrl);
            setSelectedFile(null);
            setPreviewUrl(null);

            setIsSaving(true);
            await onSave({ backgroundImageUrl: uploadedUrl });
            setIsSaving(false);
            toast.success('Image updated successfully');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to update image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getFullImageUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`;
    };

    const fullUrl = imageUrl ? getFullImageUrl(imageUrl) : '';
    const displayUrl = previewUrl || fullUrl;
    const isPreviewMode = !!previewUrl;
    const isLoading = isUploading || isSaving;

    return (
        <div className="p-6 bg-[#F8FAFB] rounded-lg border border-[#DFE1E7] flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <span className="text-[#1B1B1B] text-xl font-medium leading-6">Background Image</span>
                <div className="flex gap-2">
                    {isPreviewMode && (
                        <>
                            <Button
                                variant="outline"
                                className="w-auto! py-2.5 px-4 text-[#777980] flex"
                                onClick={handleCancel}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="w-auto! py-2.5 px-4 bg-[#0098E8] text-white flex"
                                onClick={handleReplaceClick}
                                isLoading={isLoading}
                                loadingText="Uploading..."
                                disabled={isLoading}
                            >
                                <Icon name="upload" width={16} height={16} className="mr-2" color="white" />
                                Replace Image
                            </Button>
                        </>
                    )}
                    {!isPreviewMode && (
                        <Button
                            variant="outline"
                            className="w-auto! py-2.5 px-4 text-[#777980] flex"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isLoading}
                        >
                            <Icon name="upload" width={16} height={16} className="mr-2" />
                            Replace Image
                        </Button>
                    )}
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            <div
                className={`h-80 rounded-lg border-2 border-dashed transition-all overflow-hidden bg-[#F1F1F1] flex items-center justify-center relative ${isDragging
                        ? 'border-[#0098E8] bg-[#EBF5FF]'
                        : 'border-[#DFE1E7]'
                    } ${!displayUrl ? 'cursor-pointer' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => {
                    if (!displayUrl && !isPreviewMode) {
                        fileInputRef.current?.click();
                    }
                }}
            >
                {isLoading ? (
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-2 border-[#0098E8] border-t-transparent rounded-full animate-spin" />
                        <span className="text-[#777980] text-sm">{isUploading ? 'Uploading...' : 'Saving...'}</span>
                    </div>
                ) : displayUrl ? (
                    <img
                        src={displayUrl}
                        alt="Background"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            if (!isPreviewMode) {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }
                        }}
                    />
                ) : (
                    <div className="flex flex-col items-center gap-3">
                        <Icon name="upload" width={48} height={48} color="#A5A5AB" />
                        <div className="text-center">
                            <p className="text-[#777980] text-sm font-medium">Drop your image here, or click to browse</p>
                            <p className="text-[#A5A5AB] text-xs mt-1">PNG, JPG, WebP up to 10MB</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}