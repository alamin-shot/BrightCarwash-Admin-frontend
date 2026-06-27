"use client";

import { useState, useEffect } from "react";

interface CardState {
    sender: boolean;
    recipients: boolean;
    subject: boolean;
    design: boolean;
}

interface StepTwoStateProps {
    designFilled?: boolean;
    initialFilled?: CardState;
}

export function useStepTwoState({ designFilled = false, initialFilled }: StepTwoStateProps) {
    const [filled, setFilled] = useState<CardState>(
        initialFilled || { sender: false, recipients: false, subject: false, design: designFilled }
    );

    useEffect(() => {
        if (designFilled && !filled.design) {
            setFilled((prev) => ({ ...prev, design: true }));
        }
    }, [designFilled, filled.design]);

    const toggleFilled = (key: keyof CardState) => {
        setFilled((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const allFilled = filled.sender && filled.recipients && filled.subject && filled.design;

    return { filled, toggleFilled, allFilled };
}