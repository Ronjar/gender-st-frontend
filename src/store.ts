import { writable } from 'svelte/store';

export const pretestAnswers = writable<number[]>([]);
export const questions = writable<string[]>([]);
export const posttestAnswers = writable<number[]>([]);
