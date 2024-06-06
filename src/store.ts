import { derived, get, writable } from 'svelte/store';

export const pretestAnswers = writable<number[]>([]);
export const questions = writable<boolean[]>([]);
export const posttestAnswers = writable<number[]>([]);

export const gamifiedElements = writable<string>("");
export const round = writable<number>(1);
export const userId = writable<number>(-1);


export const avatarPath = writable<string>("");



export const arePointsEnabled = derived(gamifiedElements, ($gamifiedElements: string) => {
    return $gamifiedElements.includes('p');
});
export const areBadgesEnabled = derived(gamifiedElements, ($gamifiedElements: string) => {
    return $gamifiedElements.includes('b');
});
export const isLeaderboardEnabled = derived(gamifiedElements, ($gamifiedElements: string) => {
    return $gamifiedElements.includes('l');
});
export const isAvatarEnabled = derived(gamifiedElements, ($gamifiedElements: string) => {
    return $gamifiedElements.includes('a');
});
export const isNarratedContentEnabled = derived(gamifiedElements, ($gamifiedElements: string) => {
    return $gamifiedElements.includes('n');
});