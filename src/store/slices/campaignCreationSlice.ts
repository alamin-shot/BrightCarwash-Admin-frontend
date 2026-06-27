import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CampaignCreationState {
    campaignName: string;
    tags: string[];
    tagInput: string;
    selectedTemplateName: string;
    templateId: string | null; // ✅ ADD THIS
    designFilled: boolean;
    selectedGroupId: string | null;
    selectedGroupName: string | null;
    senderName: string;
    senderEmail: string;
    subject: string;
    previewText: string;
    filled: {
        sender: boolean;
        recipients: boolean;
        subject: boolean;
        design: boolean;
    };
    isEdit: boolean;
    campaignId: string | null;
}

const initialState: CampaignCreationState = {
    campaignName: '',
    tags: [],
    tagInput: '',
    selectedTemplateName: '',
    templateId: null, // ✅ ADD THIS
    designFilled: false,
    selectedGroupId: null,
    selectedGroupName: null,
    senderName: 'Foysal Hasan',
    senderEmail: 'foysalhasan.bdcalling@gmail.com',
    subject: '',
    previewText: '',
    filled: {
        sender: false,
        recipients: false,
        subject: false,
        design: false,
    },
    isEdit: false,
    campaignId: null,
};

const campaignCreationSlice = createSlice({
    name: 'campaignCreation',
    initialState,
    reducers: {
        resetCampaignCreation: () => initialState,

        setCampaignName: (state, action: PayloadAction<string>) => {
            state.campaignName = action.payload;
        },

        setTags: (state, action: PayloadAction<string[]>) => {
            state.tags = action.payload;
        },

        addTag: (state, action: PayloadAction<string>) => {
            if (!state.tags.includes(action.payload)) {
                state.tags.push(action.payload);
            }
        },

        setTagInput: (state, action: PayloadAction<string>) => {
            state.tagInput = action.payload;
        },

        removeTag: (state, action: PayloadAction<string>) => {
            state.tags = state.tags.filter(t => t !== action.payload);
        },

        setSelectedTemplateName: (state, action: PayloadAction<string>) => {
            state.selectedTemplateName = action.payload;
        },

        setTemplateId: (state, action: PayloadAction<string | null>) => {
            state.templateId = action.payload;
        },

        setDesignFilled: (state, action: PayloadAction<boolean>) => {
            state.designFilled = action.payload;
            state.filled.design = action.payload;
        },

        setSelectedGroup: (state, action: PayloadAction<{ id: string; name: string }>) => {
            state.selectedGroupId = action.payload.id;
            state.selectedGroupName = action.payload.name;
            state.filled.recipients = true;
        },

        setSender: (state, action: PayloadAction<{ name: string; email: string }>) => {
            state.senderName = action.payload.name;
            state.senderEmail = action.payload.email;
            state.filled.sender = true;
        },

        setSubject: (state, action: PayloadAction<{ subject: string; preview: string }>) => {
            state.subject = action.payload.subject;
            state.previewText = action.payload.preview;
            state.filled.subject = true;
        },

        loadCampaignForEdit: (state, action: PayloadAction<Partial<CampaignCreationState>>) => {
            Object.assign(state, action.payload);
            state.isEdit = true;
        },
    },
});

export const {
    resetCampaignCreation,
    setCampaignName,
    setTags,
    addTag,
    removeTag,
    setTagInput,
    setSelectedTemplateName,
    setTemplateId, // ✅ EXPORT THIS
    setDesignFilled,
    setSelectedGroup,
    setSender,
    setSubject,
    loadCampaignForEdit,
} = campaignCreationSlice.actions;

export default campaignCreationSlice.reducer;