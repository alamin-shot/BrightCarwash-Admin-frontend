"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useSendEmailMutation } from "@/services/email-list.api";
import type { ComposeEmailFormState } from "@/types/email-list";

const initialState: ComposeEmailFormState = {
    from: "",
    to: [],
    cc: [],
    bcc: [],
    subject: "",
    body: "",
    files: [],
    useTemplate: false,
    templateId: "",
    showCcBcc: false,
};

export function useComposeEmail() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailFromUrl = searchParams.get("to");

    const [form, setForm] = useState<ComposeEmailFormState>({
        ...initialState,
        to: emailFromUrl ? [emailFromUrl] : [],
    });

    const [sendEmail, { isLoading: isSending }] = useSendEmailMutation();

    const updateField = useCallback(<K extends keyof ComposeEmailFormState>(
        key: K,
        value: ComposeEmailFormState[K]
    ) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    }, []);

    const addEmail = useCallback((field: "to" | "cc" | "bcc", email: string) => {
        const trimmed = email.trim();
        if (!trimmed) return;
        setForm((prev) => {
            if (prev[field].includes(trimmed)) return prev;
            return { ...prev, [field]: [...prev[field], trimmed] };
        });
    }, []);

    const removeEmail = useCallback((field: "to" | "cc" | "bcc", email: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: prev[field].filter((e) => e !== email),
        }));
    }, []);

    const addFiles = useCallback((newFiles: FileList) => {
        setForm((prev) => ({
            ...prev,
            files: [...prev.files, ...Array.from(newFiles)],
        }));
    }, []);

    const removeFile = useCallback((index: number) => {
        setForm((prev) => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index),
        }));
    }, []);

    const toggleCcBcc = useCallback(() => {
        setForm((prev) => ({ ...prev, showCcBcc: !prev.showCcBcc }));
    }, []);

    const handleSend = useCallback(async () => {
        if (form.to.length === 0) {
            toast.warning("Please add at least one recipient");
            return;
        }
        if (!form.subject.trim()) {
            toast.warning("Please enter a subject");
            return;
        }
        if (!form.body.trim()) {
            toast.warning("Please enter email body");
            return;
        }

        try {
            await sendEmail({
                to: form.to.join(","),
                cc: form.cc.length > 0 ? form.cc : undefined,
                bcc: form.bcc.length > 0 ? form.bcc : undefined,
                subject: form.subject,
                body: form.body,
                files: form.files.length > 0 ? form.files : undefined,
            }).unwrap();

            toast.success("Email sent successfully!");
            router.push("/marketing/email-list");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to send email");
        }
    }, [form, sendEmail, router]);

    return {
        form,
        isSending,
        updateField,
        addEmail,
        removeEmail,
        addFiles,
        removeFile,
        toggleCcBcc,
        handleSend,
    };
}