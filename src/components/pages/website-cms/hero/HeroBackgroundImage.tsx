'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { toast } from 'react-toastify';
import { getFullImageUrl } from '@/lib/image-url';

interface HeroBackgroundImageProps {
    initialImageUrl?: string;
    onImageUpload: (file: File) => Promise<string>;
    onSave: (data: { backgroundImageUrl: string }) => Promise<void>;
    label?: string;
}

export function HeroBackgroundImage({
    initialImageUrl,
    onImageUpload,
    onSave,
    label = 'Background Image',
}: HeroBackgroundImageProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | undefined>(initialImageUrl);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [imageError, setImageError] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            setImageError(false);

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

    const fullUrl = imageUrl ? getFullImageUrl(imageUrl) : '';
    const displayUrl = previewUrl || fullUrl;
    const isPreviewMode = !!previewUrl;
    const isLoading = isUploading || isSaving;

    const handleOpenPicker = () => {
        if (!isLoading) {
            fileInputRef.current?.click();
        }
    };

    return (
        <div className='p-6 bg-[#F8FAFB] rounded-lg border border-[#DFE1E7] flex flex-col gap-4'>
            <div className='flex justify-between items-center'>
                <span className='text-[#1B1B1B] text-xl font-medium leading-6'>
                    {label}
                </span>
                <div className='flex gap-2'>
                    {isPreviewMode ? (
                        <>
                            <Button
                                variant='outline'
                                className='w-auto! py-2.5 px-4 text-[#777980]'
                                onClick={handleCancel}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                className='w-auto! py-2.5 px-4 bg-[#0098E8] text-white'
                                onClick={handleReplaceClick}
                                isLoading={isLoading}
                                loadingText='Uploading...'
                                disabled={isLoading}
                            >
                                <Icon
                                    name='upload'
                                    width={16}
                                    height={16}
                                    className='mr-2'
                                    color='white'
                                />
                                Replace Image
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant='outline'
                            className='w-auto! flex! py-2.5 px-4 text-[#777980]'
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isLoading}
                        >
                            <Icon name='upload' width={16} height={16} className='mr-2' />
                            Replace Image
                        </Button>
                    )}
                </div>
                <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/*'
                    onChange={handleFileChange}
                    className='hidden'
                />
            </div>

            <div
                className={`h-80 rounded-lg border-2 border-dashed transition-all overflow-hidden bg-[#F1F1F1] flex items-center justify-center relative ${isDragging ? 'border-[#0098E8] bg-[#EBF5FF]' : 'border-[#DFE1E7]'
                    } ${!displayUrl ? 'cursor-pointer' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => {
                    if (!displayUrl && !isPreviewMode) {
                        handleOpenPicker();
                    }
                }}
            >
                {isLoading ? (
                    <div className='flex flex-col items-center gap-2'>
                        <div className='w-8 h-8 border-2 border-[#0098E8] border-t-transparent rounded-full animate-spin' />
                        <span className='text-[#777980] text-sm'>
                            {isUploading ? 'Uploading...' : 'Saving...'}
                        </span>
                    </div>
                ) : displayUrl && !imageError ? (
                    <div className='relative w-full h-full'>
                        <img
                            src={displayUrl}
                            alt='Background'
                            className='w-full h-full object-cover'
                            onError={() => {
                                setImageError(true);
                            }}
                            onLoad={() => {
                                setImageError(false);
                            }}
                        />
                        <div
                            className='absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-black/50 transition-all'
                            onClick={(event) => {
                                event.stopPropagation();
                                handleOpenPicker();
                            }}
                        >
                            <div className='w-14 h-14 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm'>
                                <Icon name='upload' width={28} height={28} color='white' />
                            </div>
                            <div className='text-center'>
                                <p className='text-white text-base font-medium'>
                                    Drop your image here, or click to browse
                                </p>
                                <p className='text-white/60 text-sm mt-1'>
                                    PNG, JPG, WebP up to 10MB
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='flex flex-col items-center gap-3'>
                        <Icon name='upload' width={48} height={48} color='#A5A5AB' />
                        <div className='text-center'>
                            <p className='text-[#777980] text-sm font-medium'>
                                Drop your image here, or click to browse
                            </p>
                            <p className='text-[#A5A5AB] text-xs mt-1'>
                                PNG, JPG, WebP up to 10MB
                            </p>
                            {imageError && (
                                <p className='text-[#D14343] text-xs mt-2'>
                                    Unable to load the current image. Please try another file.
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}