import { derived, get, writable } from 'svelte/store';

export const stai = writable<number[]>([]);
export const ngse = writable<number[]>([]);
export const sims = writable<number[]>([]);
export const questions = writable<boolean[]>([]);
export const answerTime = writable<number[]>([]);

export const gamifiedElements = writable<string[]>(["", "", ""]);
export const round = writable<number>(0);
export const userId = writable<number>(-1);


export const avatarPath = writable<string>("");

export const roundBasedPadding = derived(round, ($round: number) => {
    return $round * 20;
});

export const arePointsEnabled = derived(round, ($round: number) => {
    return get(gamifiedElements)[$round].includes('p');
    return true;
});
export const areBadgesEnabled = derived(round, ($round: number) => {
    return get(gamifiedElements)[$round].includes('b');
    return true;
});
export const isLeaderboardEnabled = derived(round, ($round: number) => {
    return get(gamifiedElements)[$round].includes('l');
    return true;
});
export const isAvatarEnabled = derived(round, ($round: number) => {
    return get(gamifiedElements)[$round].includes('a');
    return true;
});
export const isNarratedContentEnabled = derived(round, ($round: number) => {
    return get(gamifiedElements)[$round].includes('n');
    return true;
});