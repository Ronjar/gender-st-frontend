<script lang="ts">
    import { writable, get } from "svelte/store";
    import {
        questions as waQuestions,
        answerTime as waAnswerTime,
        isAvatarEnabled as waAvatars,
        arePointsEnabled as wwaPoints,
        isLeaderboardEnabled as waLeaderboard,
        isNarratedContentEnabled as waNarratedContent,
        areBadgesEnabled as waBadges,
        roundBasedPadding,
    } from "../../store";
    import Toast from "$lib/components/Toast.svelte";
    import NarratedContent from "./NarratedContent.svelte";
    import ScoreModal from "$lib/components/ScoreModal.svelte";
    import {
        callWithProbability,
        randomBadPhrase,
        randomGoodPhrase,
    } from "$lib/scripts/narratedPhrases";
    import Badges from "./Badges.svelte";
    import Leaderboard from "./Leaderboard.svelte";

    const totalQuestions = 20;
    let currentQuestionIndex = writable(0 + get(roundBasedPadding));
    let score = writable(0);
    let userAnswers = writable<boolean[]>([]);
    let answerTime = writable<number[]>([]);
    let questionStartTime: number;
    let toastRef: Toast;
    let narratedRef: NarratedContent;
    let badgesRef: Badges;
    let leaderboardRef: Leaderboard;
    let scoreModalRef: ScoreModal;
    let isUIEnabled = writable(true);

    let isAvatarEnabled = false;
    let arePointsEnabled = false;
    let isLeaderboardEnabled = false;
    let isNarratedContentEnabled = false;
    let areBadgesEnabled = false;
    let areQuestionsFinished = false;

    waAvatars.subscribe((value) => {
        isAvatarEnabled = value;
    });
    wwaPoints.subscribe((value) => {
        arePointsEnabled = value;
    });
    waLeaderboard.subscribe((value) => {
        isLeaderboardEnabled = value;
    });
    waNarratedContent.subscribe((value) => {
        isNarratedContentEnabled = value;
    });
    waBadges.subscribe((value) => {
        areBadgesEnabled = value;
    });

    let correctAnswers = [
        "B", //0
        "E",
        "E",
        "E",
        "A",
        "B",
        "D",
        "E",
        "B",
        "B",
        "E", //10
        "B",
        "C",
        "E",
        "A",
        "C",
        "B",
        "D",
        "B",
        "A",
        "E", //20
        "B",
        "A",
        "C",
        "D",
        "A",
        "A",
        "A",
        "C",
        "D",
        "B", //30
        "D",
        "A",
        "B",
        "A",
        "D",
        "A",
        "B",
        "A",
        "B",
        "D", //40
        "B",
        "D",
        "B",
        "E",
        "C",
        "B",
        "C",
        "E",
        "C",
        "B", //50
        "D",
        "B",
        "A",
        "C",
        "D",
        "A",
        "E",
        "D",
        "D",
    ];

    function showToast(isSuccess: boolean) {
        const message = isSuccess ? "Correct answer!" : "Wrong answer!";
        toastRef.showToast(isSuccess, message);
    }

    const handleAnswer = async (answer: string) => {
        isUIEnabled.set(false);
        const endTime = Date.now();
        const timeTaken = endTime - questionStartTime;
        answerTime.update((times) => [...times, timeTaken]);
        // Save the answers
        if (correctAnswers[get(currentQuestionIndex)] === answer) {
            score.update((n) => n + 1);
            userAnswers.update((answers) => [...answers, true]);
            showToast(true);
            if (narratedRef !== undefined) {
                if (get(currentQuestionIndex) % 3 === 0) {
                    narratedRef.showNarration(randomGoodPhrase());
                }
            }
        } else {
            userAnswers.update((answers) => [...answers, false]);
            showToast(false);
            if (narratedRef !== undefined) {
                if (get(currentQuestionIndex) % 3 === 0) {
                    narratedRef.showNarration(randomBadPhrase());
                }
            }
        }
        await preloadNextQuestionImage();
        await waitForNextQuestion();
        currentQuestionIndex.update((n) => n + 1);
        if (narratedRef !== undefined) {
            narratedRef.hideNarration();
        }
        isUIEnabled.set(true);
    };

    const waitForNextQuestion = () => {
        return new Promise((resolve) => {
            if (narratedRef !== undefined && narratedRef.isShowing()) {
                setTimeout(() => resolve(true), 4000);
            } else {
                setTimeout(() => resolve(true), 1000);
            }
        });
    };

    const preloadNextQuestionImage = () => {
        return new Promise((resolve) => {
            const nextIndex = get(currentQuestionIndex) + 1;
            if (nextIndex < totalQuestions) {
                const nextImage = new Image();
                nextImage.src = `/img/questions/q-${nextIndex}.png`;
                nextImage.onload = () => resolve(true);
            } else {
                resolve(true);
            }
        });
    };

    score.subscribe((value) => {
        if (leaderboardRef !== undefined){
        leaderboardRef.updateUserScore(value);
        }
        if (badgesRef !== undefined) {
            switch (value) {
                case 1:
                    badgesRef.unlockBadge(1);
                    break;
                case 5:
                    badgesRef.unlockBadge(2);
                    break;
                case 10:
                    badgesRef.unlockBadge(3);
                    break;
                case 18:
                    badgesRef.unlockBadge(4);
                    break;
            }
        }
    });

    let questionImage = `/img/questions/q-${0 + get(roundBasedPadding)}.png`;
    currentQuestionIndex.subscribe((index) => {
        if (get(userAnswers).length < totalQuestions) {
            questionImage = `/img/questions/q-${index}.png`;
        } else {
            scoreModalRef.setScore(get(score));
            if (areBadgesEnabled) {
                scoreModalRef.setBadgeCount(badgesRef.unlockedBadgesCount());
            }
            if(isLeaderboardEnabled){
            scoreModalRef.setLeaderboardPlace(
                leaderboardRef.getLeaderboardPlacement()
            );
            }
            scoreModalRef.openModal();
            waAnswerTime.set(get(answerTime));
            waQuestions.set(get(userAnswers));
            areQuestionsFinished = true;
        }
    });

    function handleImageLoad() {
        questionStartTime = Date.now();
    }
</script>

<ScoreModal bind:this={scoreModalRef} />
{#if isNarratedContentEnabled}
    <NarratedContent bind:this={narratedRef} />
{/if}
<div class="flex justify-between">
    <!-- Scoreboard -->
    <div class="w-1/4 mx-auto">
        {#if isLeaderboardEnabled}
            <Leaderboard bind:this={leaderboardRef}/>
        {/if}
    </div>
    <!-- Question Board -->
    <div class="p-6 w-1/2 mx-10 bg-base-200 rounded-xl shadow-md">
        <div
            class={$isUIEnabled
                ? ""
                : "grayscale brightness-50 pointer-events-none"}
        >
            {#if !areQuestionsFinished}
                <p class="text-xl">Answer the following question</p>
                <p class="text-m mb-20">
                    Choose the option that best fits to replace the question
                    mark
                </p>
                <div class="flex justify-between items-center">
                    <div class="flex flex-col items-center">
                        <img
                            src={questionImage}
                            alt="Question"
                            class="w-3/4 h-3/4"
                            on:load={handleImageLoad}
                        />
                        <div class="flex mt-4 space-x-4">
                            <button
                                class="btn btn-primary"
                                on:click={() => handleAnswer("A")}
                                disabled={!$isUIEnabled}>Option A</button
                            >
                            <button
                                class="btn btn-primary"
                                on:click={() => handleAnswer("B")}
                                disabled={!$isUIEnabled}>Option B</button
                            >
                            <button
                                class="btn btn-primary"
                                on:click={() => handleAnswer("C")}
                                disabled={!$isUIEnabled}>Option C</button
                            >
                            <button
                                class="btn btn-primary"
                                on:click={() => handleAnswer("D")}
                                disabled={!$isUIEnabled}>Option D</button
                            >
                            <button
                                class="btn btn-primary"
                                on:click={() => handleAnswer("E")}
                                disabled={!$isUIEnabled}>Option E</button
                            >
                        </div>
                    </div>
                </div>
            {/if}
            {#if areQuestionsFinished}
                <div class="flex justify-center items-center h-64">
                    <div class="mx-auto">
                        <h2>
                            Thank you for completing this round of logic
                            puzzles!<br /> Now, we have some questions for you. To
                            proceed, please press the button below.
                        </h2>
                        <a class="btn btn-primary mt-10 w-full" href="/stai">
                            Proceed to questions
                        </a>
                    </div>
                </div>
            {/if}
        </div>
        <Toast bind:this={toastRef} />
    </div>
    <!-- Scores and Badges -->
    <div class="w-1/4 mx-auto flex flex-col">
        {#if arePointsEnabled}
            <div class="w-1/2 stat bg-base-200 mb-10 p-4 rounded-xl shadow-md">
                <div class="stat-title">Score</div>
                <div class="stat-value text-primary">{$score}</div>
                <div class="stat-desc">1 point per question</div>
            </div>
        {/if}
        {#if areBadgesEnabled}
            <Badges bind:this={badgesRef} />
        {/if}
    </div>
</div>

<style>
    .disabled {
        filter: grayscale(100%);
        pointer-events: none;
    }
</style>
