import { derived, get, writable } from 'svelte/store';

export const pretestAnswers = writable<number[]>([]);
export const questions = writable<boolean[]>([]);
export const answerTime = writable<number[]>([]);
export const posttestAnswers = writable<number[]>([]);

export const gamifiedElements = writable<string>("");
export const round = writable<number>(1);
export const userId = writable<number>(-1);


export const avatarPath = writable<string>("");



export const arePointsEnabled = derived(gamifiedElements, ($gamifiedElements: string) => {
    //return $gamifiedElements.includes('p');
    return true;
});
export const areBadgesEnabled = derived(gamifiedElements, ($gamifiedElements: string) => {
    //return $gamifiedElements.includes('b');
    return true;
});
export const isLeaderboardEnabled = derived(gamifiedElements, ($gamifiedElements: string) => {
    //return $gamifiedElements.includes('l');
    return true;
});
export const isAvatarEnabled = derived(gamifiedElements, ($gamifiedElements: string) => {
    //return $gamifiedElements.includes('a');
    return true;
});
export const isNarratedContentEnabled = derived(gamifiedElements, ($gamifiedElements: string) => {
    return $gamifiedElements.includes('n');
});