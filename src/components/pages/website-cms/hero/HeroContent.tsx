"use client";

import { useState } from 'react';
import { HeroHeader } from './HeroHeader';
import { HeroBackgroundImage } from './HeroBackgroundImage';
import { HeroTextContent } from './HeroTextContent';
import { HeroRightSideContent } from './HeroRightSideContent';
import { HeroTrustStatistics } from './HeroTrustStatistics';
import { useHeroData } from '@/hooks/useHeroData';

export function HeroContent() {
    const {
        initialData,
        isLoading,
        isUpdating,
        handleImageUpload,
        handleSave,
    } = useHeroData();

    const [textData, setTextData] = useState({
        eyebrowText: initialData.eyebrowText,
        mainHeadline: initialData.mainHeadline,
        subtext: initialData.subtext,
    });

    const [statsData, setStatsData] = useState({
        starRating: initialData.starRating,
        carsWashed: initialData.carsWashed,
        avgTime: initialData.avgTime,
    });

    const [status, setStatus] = useState<'form' | 'banner' | 'hidden'>(initialData.status);
    const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | undefined>(initialData.backgroundImageUrl);

    // ✅ All sections save together via Update button
    const handleFullSave = async () => {
        await handleSave({
            ...textData,
            ...statsData,
            backgroundImageUrl,
            status,
        });
    };

    // ✅ Background image saves separately (includes its own save)
    const handleBackgroundSave = async (data: { backgroundImageUrl: string }) => {
        setBackgroundImageUrl(data.backgroundImageUrl);
        await handleSave({
            ...textData,
            ...statsData,
            ...data,
            status,
        });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4 w-full">
                <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            <HeroHeader onSave={handleFullSave} isUpdating={isUpdating} />

            <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-4">
                    <HeroBackgroundImage
                        initialImageUrl={backgroundImageUrl}
                        onImageUpload={handleImageUpload}
                        onSave={handleBackgroundSave}
                    />
                    <HeroTextContent
                        eyebrowText={textData.eyebrowText}
                        setEyebrowText={(value) => setTextData({ ...textData, eyebrowText: value })}
                        mainHeadline={textData.mainHeadline}
                        setMainHeadline={(value) => setTextData({ ...textData, mainHeadline: value })}
                        subtext={textData.subtext}
                        setSubtext={(value) => setTextData({ ...textData, subtext: value })}
                    />
                </div>

                <div className="flex-1 flex flex-col gap-4">
                    <HeroRightSideContent
                        status={status}
                        onStatusChange={setStatus}
                    />
                    <HeroTrustStatistics
                        starRating={statsData.starRating}
                        setStarRating={(value) => setStatsData({ ...statsData, starRating: value })}
                        carsWashed={statsData.carsWashed}
                        setCarsWashed={(value) => setStatsData({ ...statsData, carsWashed: value })}
                        avgTime={statsData.avgTime}
                        setAvgTime={(value) => setStatsData({ ...statsData, avgTime: value })}
                    />
                </div>
            </div>
        </div>
    );
}