"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { useUpdateProfileMutation } from "@/services/settings.api";
import type { ProfileFormData } from "@/types/settings";
import {
    formatUSPhoneNumber,
    toBackendPhoneFormat,
    fromBackendPhoneFormat,
    sanitizeNameInput,
} from "@/lib/inputFormatters";

export function useProfileSettings(initialData: ProfileFormData) {
    const [form, setForm] = useState<ProfileFormData>({
        ...initialData,
        phone: fromBackendPhoneFormat(initialData.phone),
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData.avatar);
    const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

    useEffect(() => {
        if (initialData) {
            setForm({
                ...initialData,
                phone: fromBackendPhoneFormat(initialData.phone),
            });
            setAvatarPreview(initialData.avatar);
        }
    }, [initialData]);

    const updateField = useCallback(<K extends keyof ProfileFormData>(key: K, value: ProfileFormData[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    }, []);

    // Sanitize + restrict name fields to letters only
    const updateNameField = useCallback((key: "first_name" | "last_name", value: string) => {
        setForm((prev) => ({ ...prev, [key]: sanitizeNameInput(value) }));
    }, []);

    // Format phone as user types, capped at 10 digits
    const updatePhoneField = useCallback((value: string) => {
        setForm((prev) => ({ ...prev, phone: formatUSPhoneNumber(value) }));
    }, []);

    const handleAvatarUpload = useCallback((file: File) => {
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    }, []);

    const handleDeleteAvatar = useCallback(() => {
        setAvatarFile(null);
        setAvatarPreview(null);
        updateField("avatar", null);
    }, [updateField]);

    const handleSave = useCallback(async () => {
        try {
            await updateProfile({
                firstName: form.first_name.trim(),
                lastName: form.last_name.trim(),
                phoneNumber: toBackendPhoneFormat(form.phone),
                image: avatarFile,
            }).unwrap();
            toast.success("Profile updated");
            setAvatarFile(null);
        } catch {
            toast.error("Failed to update profile");
        }
    }, [form, avatarFile, updateProfile]);

    return {
        form,
        isSaving,
        isUploading: false,
        avatar: avatarPreview,
        updateField,
        updateNameField,
        updatePhoneField,
        handleAvatarUpload,
        handleDeleteAvatar,
        handleSave,
    };
}