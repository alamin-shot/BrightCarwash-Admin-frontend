"use client";

import { useMemo } from 'react';
import {
    useGetHeroSectionQuery,
    useUpdateHeroSectionMutation,
    uploadHeroImage,
} from '@/services/hero.api';
import { toast } from 'react-toastify';

export interface HeroFormData {
    eyebrowText: string;
    mainHeadline: string;
    subtext: string;
    starRating: string;
    carsWashed: string;
    avgTime: string;
    backgroundImageUrl?: string;
    bannerImageUrl?: string;
    status: 'form' | 'banner' | 'hidden';
}

export function useHeroData() {
    const { data: hero, isLoading, refetch } = useGetHeroSectionQuery();
    const [updateHero, { isLoading: isUpdating }] =
        useUpdateHeroSectionMutation();

    const initialData = useMemo<HeroFormData>(() => {
        if (!hero?.content) {
            return {
                eyebrowText: '',
                mainHeadline: '',
                subtext: '',
                starRating: '4.9',
                carsWashed: '12K+',
                avgTime: '15-Min Average',
                backgroundImageUrl: undefined,
                bannerImageUrl: undefined,
                status: 'form',
            };
        }

        return {
            eyebrowText: hero.content.eyebrow_text || '',
            mainHeadline: hero.content.main_headline || '',
            subtext: hero.content.subtext || '',
            starRating: hero.content.star_rating || '4.9',
            carsWashed: hero.content.cars_washed || '12K+',
            avgTime: hero.content.avg_time || '15-Min Average',
            backgroundImageUrl:
                hero.content.backgroundImageUrl || hero.content.background_image_url,
            // ✅ Try both camelCase and snake_case from backend
            bannerImageUrl: hero.content.bannerImageUrl || hero.content.banner_image_url || hero.content.bannerImageUrl,
            status: hero.content.status || (hero.is_active ? 'form' : 'hidden'),
        };
    }, [hero]);

    const handleImageUpload = async (file: File): Promise<string> => {
        const imagePath = await uploadHeroImage(file);
        toast.success('Image uploaded successfully');
        return imagePath;
    };

    const handleSave = async (data: HeroFormData) => {
        try {
            const content: Record<string, string | boolean | undefined> = {
                eyebrow_text: data.eyebrowText,
                main_headline: data.mainHeadline,
                subtext: data.subtext,
                star_rating: data.starRating,
                cars_washed: data.carsWashed,
                avg_time: data.avgTime,
                status: data.status,
            };

            if (data.backgroundImageUrl) {
                content.backgroundImageUrl = data.backgroundImageUrl;
            }

            // ✅ Try sending as both camelCase and snake_case
            if (data.bannerImageUrl) {
                content.bannerImageUrl = data.bannerImageUrl;
                content.banner_image_url = data.bannerImageUrl; // ✅ Try snake_case too
            }

            console.log('📤 Sending content to backend:', content);

            await updateHero({
                key: 'home_hero',
                data: {
                    content: content,
                    is_active: data.status !== 'hidden',
                },
            }).unwrap();
            toast.success('Hero section updated successfully');
            refetch();
        } catch (error) {
            console.error('Update error:', error);
            toast.error('Failed to update hero section');
            throw error;
        }
    };

    return {
        initialData,
        isLoading,
        isUpdating,
        handleImageUpload,
        handleSave,
        refetch,
    };
}