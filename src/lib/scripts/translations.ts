// src/lib/translations.ts
export const translations = {
    "st_details_deletion_code": {
        original: "Deletion Code",
        translation: "Löschungscode",
        description: "As this questionaire includes personal data you can choose to delete it with this code, by writing an email to st180554@stud.uni-stuttgart.de"
    },
    "st_stai_tense": {
        original: "tense",
        translation: "angespannt"
    },
    "st_stai_content": {
        original: "content",
        translation: "zufrieden",
        description: ""
    },
    "st_ngse_endeavor": {
        original: "endeavor",
        translation: "Bemühung",
        description: ""
    },
    "st_": {
        original: "",
        translation: "",
        description: ""
    }
} as const;

export type TranslationEntry = {
    original: string;
    translation: string;
    description?: string;
};

export type TranslationKey = keyof typeof translations;
