"use client";

import { useState } from "react";

type ModalType = "sender" | "subject" | "recipients" | null;

export function useStepTwoModals() {
    const [activeModal, setActiveModal] = useState<ModalType>(null);

    const openModal = (modal: ModalType) => setActiveModal(modal);
    const closeModal = () => setActiveModal(null);

    return {
        senderModalOpen: activeModal === "sender",
        subjectModalOpen: activeModal === "subject",
        recipientsModalOpen: activeModal === "recipients",
        openModal,
        closeModal,
    };
}