const wrongAnswerPhrases: string[] = [
    "Keep going, you'll get it next time!",
    "Don't worry, practice makes perfect.",
    "Every mistake is a step forward.",
    "You're learning, and that's what matters!",
    "Stay positive, you'll succeed!",
    "Mistakes are proof you're trying.",
    "You're closer than you think!",
    "Keep your head up, you're improving.",
    "It's okay to get it wrong, keep trying!",
    "You've got this, just keep at it!"
];

const correctAnswerPhrases: string[] = [
    "Great job! I knew you could do it.",
    "Excellent work, keep it up!",
    "You're doing amazing, well done!",
    "Fantastic! You nailed it.",
    "You're on a roll, awesome!",
    "Perfect! Keep shining.",
    "Bravo! That's the right answer.",
    "Outstanding work, you're unstoppable!",
    "You're killing it, amazing job!",
    "Superb! You're doing great."
];

export function randomGoodPhrase(): string {
    const randomIndex: number = Math.floor(Math.random() * correctAnswerPhrases.length);
    return correctAnswerPhrases[randomIndex];
}

export function randomBadPhrase(): string {
    const randomIndex: number = Math.floor(Math.random() * wrongAnswerPhrases.length);
    return wrongAnswerPhrases[randomIndex];
}

export function callWithProbability<T extends any[]>(probability: number, method: (...args: T) => void, ...args: T): void {
    if (Math.random() < probability) {
        method(...args);
    }
}
 