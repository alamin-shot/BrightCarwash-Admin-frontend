"use client";

import { useState, useRef, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { HeroStatusSelector } from './HeroStatusSelector';
import { toast } from 'react-toastify';

interface HeroRightSideContentProps {
    status: 'form' | 'banner' | 'hidden';
    onStatusChange: (status: 'form' | 'banner' | 'hidden') => void;
    bannerImageUrl?: string;
    onBannerImageUpload: (file: File) => Promise<string>;
    onBannerImageSave: (data: { bannerImageUrl: string }) => Promise<void>;
    isUploading?: boolean;
}

export function HeroRightSideContent({
    status,
    onStatusChange,
    bannerImageUrl,
    onBannerImageUpload,
    onBannerImageSave,
    isUploading = false,
}: HeroRightSideContentProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | undefined>(bannerImageUrl);
    const [isSaving, setIsSaving] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [textAlignment, setTextAlignment] = useState<
        'left' | 'center' | 'right'
    >('left');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (bannerImageUrl !== imageUrl) {
            setImageUrl(bannerImageUrl);
            setImageError(false);
        }
    }, [bannerImageUrl]);

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

        try {
            const uploadedUrl = await onBannerImageUpload(selectedFile);
            setImageUrl(uploadedUrl);
            setSelectedFile(null);
            setPreviewUrl(null);
            setImageError(false);

            setIsSaving(true);
            await onBannerImageSave({ bannerImageUrl: uploadedUrl });
            setIsSaving(false);
            toast.success('Banner image updated successfully');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to update banner image');
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleOpenPicker = () => {
        if (!isUploading && !isSaving) {
            fileInputRef.current?.click();
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
        <div className='p-6 bg-[#F8FAFB] rounded-lg border border-[#DFE1E7] flex flex-col gap-4'>
            <span className='text-[#1B1B1B] text-xl font-medium leading-6'>
                Right Side Content
            </span>
            <HeroStatusSelector status={status} onChange={onStatusChange} />

            {status === 'form' && (
                <div className='p-4 bg-[#EBF5FF] rounded-lg border border-[#0098E8] flex flex-col gap-2'>
                    <span className='text-[#1B1B1B] text-lg font-medium leading-4'>
                        Booking Form active
                    </span>
                    <p className='text-[#777980] text-sm font-normal leading-6'>
                        Shows vehicle select, name, date, phone, and email fields. The
                        primary button label is used as the submit button.
                    </p>
                </div>
            )}

            {status === 'banner' && (
                <div className='flex flex-col gap-2'>
                    <label className='text-[#777980] font-inter text-base font-normal leading-5'>
                        Banner Image
                    </label>
                    <div
                        className={`h-64 rounded-lg border-2 border-dashed transition-all overflow-hidden bg-white flex items-center justify-center relative ${isDragging
                            ? 'border-[#0098E8] bg-[#EBF5FF]'
                            : 'border-[#DFE1E7]'
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
                                    alt='Banner'
                                    className='w-full h-full object-cover'
                                    onError={() => setImageError(true)}
                                    onLoad={() => setImageError(false)}
                                />
                                <div
                                    className='absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-black/60 transition-all'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenPicker();
                                    }}
                                >
                                    <div className='w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm'>
                                        <Icon
                                            name='upload'
                                            width={24}
                                            height={24}
                                            color='white'
                                        />
                                    </div>
                                    <span className='text-white text-sm font-medium'>
                                        Click to upload new banner
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className='flex flex-col items-center gap-3'>
                                <Icon name='upload' width={48} height={48} color='#A5A5AB' />
                                <div className='text-center'>
                                    <p className='text-[#777980] text-base font-medium leading-5'>
                                        Upload your banner image here, or drag and drop
                                    </p>
                                    <p className='text-[#A5A5AB] text-sm font-normal leading-5'>
                                        PNG, JPG, WebP up to 10MB
                                    </p>
                                    {imageError && (
                                        <p className='text-[#D14343] text-xs mt-2'>
                                            Unable to load the current image. Please try another
                                            file.
                                        </p>
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
                        )}
                    </div>
                    {isPreviewMode && (
                        <div className='flex gap-2 justify-end'>
                            <Button
                                variant='outline'
                                onClick={handleCancel}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
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
                                Replace Banner
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {status === 'hidden' && (
                <>
                    <div className='p-4 bg-[#F8FAFB] rounded-lg border border-[#DFE1E7] flex flex-col items-center justify-center gap-2 py-8'>
                        <Icon name='eye-off' width={32} height={32} color='#A5A5AB' />
                        <p className='text-[#777980] font-inter text-sm'>
                            Form and banner are hidden. Only text content is visible.
                        </p>
                    </div>

                    {/* ✅ Text Alignment - ONLY visible when status is 'hidden' */}
                    <div className='flex flex-col gap-2'>
                        <label className='text-[#777980] font-inter text-base font-normal leading-5'>
                            Text Alignment
                        </label>
                        <div className='flex gap-2'>
                            <button
                                onClick={() => setTextAlignment('left')}
                                className={`flex-1 p-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${textAlignment === 'left'
                                    ? 'bg-[#EBF5FF] border-[#0098E8]'
                                    : 'bg-white border-[#DFE1E7] hover:border-[#0098E8]'
                                    }`}
                            >
                                <div className='w-6 h-6 flex flex-col gap-1'>
                                    <div className='w-4 h-0.5 bg-[#0098E8]' />
                                    <div className='w-2 h-0.5 bg-[#0098E8]' />
                                    <div className='w-4 h-0.5 bg-[#0098E8]' />
                                    <div className='w-2 h-0.5 bg-[#0098E8]' />
                                </div>
                                <span
                                    className={`text-sm font-medium ${textAlignment === 'left'
                                        ? 'text-[#0098E8]'
                                        : 'text-[#777980]'
                                        }`}
                                >
                                    Left Align
                                </span>
                            </button>

                            <button
                                onClick={() => setTextAlignment('center')}
                                className={`flex-1 p-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${textAlignment === 'center'
                                    ? 'bg-[#EBF5FF] border-[#0098E8]'
                                    : 'bg-white border-[#DFE1E7] hover:border-[#0098E8]'
                                    }`}
                            >
                                <div className='w-6 h-6 flex flex-col items-center gap-1'>
                                    <div className='w-4 h-0.5 bg-[#777980]' />
                                    <div className='w-2 h-0.5 bg-[#777980]' />
                                    <div className='w-4 h-0.5 bg-[#777980]' />
                                    <div className='w-2 h-0.5 bg-[#777980]' />
                                </div>
                                <span className='text-sm font-medium text-[#777980]'>
                                    Center Align
                                </span>
                            </button>

                            <button
                                onClick={() => setTextAlignment('right')}
                                className={`flex-1 p-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${textAlignment === 'right'
                                    ? 'bg-[#EBF5FF] border-[#0098E8]'
                                    : 'bg-white border-[#DFE1E7] hover:border-[#0098E8]'
                                    }`}
                            >
                                <div className='w-6 h-6 flex flex-col items-end gap-1'>
                                    <div className='w-4 h-0.5 bg-[#777980]' />
                                    <div className='w-2 h-0.5 bg-[#777980]' />
                                    <div className='w-4 h-0.5 bg-[#777980]' />
                                    <div className='w-2 h-0.5 bg-[#777980]' />
                                </div>
                                <span className='text-sm font-medium text-[#777980]'>
                                    Right Align
                                </span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}