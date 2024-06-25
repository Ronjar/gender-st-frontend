<script lang="ts">
    import {
        translations,
        type TranslationKey,
        type TranslationEntry,
    } from "$lib/scripts/translations";
    import { onMount } from "svelte";

    export let word: TranslationKey;
    let original: string | undefined;
    let translation: string | undefined;
    let description: string | undefined;

    onMount(() => {
        const entry: TranslationEntry = translations[word];
        original = entry.original;
        translation = entry.translation;
        description = entry.description;
    });
</script>

<div class="relative inline-block group">
    <span class="dashed-underline">{original}</span>
    {#if translation}
        <div
            class="absolute hidden group-hover:block bg-base-100 text-base-content p-6 rounded-xl shadow-2xl max-w-lg mt-3 z-10"
        >
            <div class="font-bold text-primary text-xl">{translation}</div>
            {#if description}
                <div class="mt-2 text-sm text-gray-500">{description}</div>
            {/if}
        </div>
    {/if}
</div>

<style>
    .dashed-underline {
        text-decoration: underline;
        text-decoration-style: dashed;
        cursor: pointer;
    }
</style>
