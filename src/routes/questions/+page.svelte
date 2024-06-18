<script lang="ts">
    import { writable, get, derived } from "svelte/store";
    import { goto } from "$app/navigation";
    import {
        questions as waQuestions,
        answerTime as waAnswerTime,
        isAvatarEnabled as waAvatars,
        arePointsEnabled as wwaPoints,
        isLeaderboardEnabled as waLeaderboard,
        isNarratedContentEnabled as waNarratedContent,
        areBadgesEnabled as waBadges,
        avatarPath,
        round,
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

    const totalQuestions = 20;
    let currentQuestionIndex = writable(0 + get(roundBasedPadding));
    let score = writable(0);
    let userAnswers = writable<boolean[]>([]);
    let answerTime = writable<number[]>([]);
    let questionStartTime: number;
    let toastRef: Toast;
    let narratedRef: NarratedContent;
    let badgesRef: Badges;
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
        "B", //20
        "C",
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
        "B", //40
        "B",
        "D",
        "C",
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

    let opponents = [
        { score: 77, profilePic: "/img/npc/avatar1.png", isYou: false },
        { score: 69, profilePic: "/img/npc/avatar2.png", isYou: false },
        { score: 42, profilePic: "/img/npc/avatar3.png", isYou: false },
        { score: 33, profilePic: "/img/npc/avatar4.png", isYou: false },
        { score: 21, profilePic: "/img/npc/avatar5.png", isYou: false },
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
                callWithProbability(
                    0.4,
                    narratedRef.showNarration,
                    randomGoodPhrase(),
                );
            }
        } else {
            userAnswers.update((answers) => [...answers, false]);
            showToast(false);
            if (narratedRef !== undefined) {
                callWithProbability(
                    0.4,
                    narratedRef.showNarration,
                    randomBadPhrase(),
                );
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
                setTimeout(() => resolve(true), 5000);
            } else {
                setTimeout(() => resolve(true), 2000);
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
            scoreModalRef.setLeaderboardPlace(
                sortedLeaderboard.findIndex((player) => player.isYou) + 1,
            );
            scoreModalRef.openModal();
            waAnswerTime.set(get(answerTime));
            waQuestions.set(get(userAnswers));
            areQuestionsFinished = true;
        }
    });

    const leaderboard = derived(score, ($score) => {
        const players = [
            ...opponents,
            {
                profilePic: get(avatarPath),
                score: $score,
                isYou: true,
            },
        ];
        return players.sort((a, b) => b.score - a.score);
    });

    let sortedLeaderboard: any[] = [];
    leaderboard.subscribe((value: any) => {
        sortedLeaderboard = value;
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
            <div class="bg-base-200 shadow-md rounded-xl p-6">
                <span class="text-primary stat-value"><b>Leaderboard</b></span>
                <table class="table w-full table-auto mt-10">
                    <thead class="my-10">
                        <tr class="my-10">
                            <th class="w-1/4">Rank</th>
                            {#if isAvatarEnabled}<th class="w-1/4">Profile</th>
                            {/if}
                            {#if arePointsEnabled}<th class="w-2/4 text-center"
                                    >Score</th
                                >
                            {/if}
                        </tr>
                    </thead>
                    <tbody>
                        {#each sortedLeaderboard as player, index}
                            <tr
                                class={player.isYou
                                    ? "bg-base-300"
                                    : "bg-base-200"}
                            >
                                <td class="text-center text-lg">{index + 1}</td>
                                {#if isAvatarEnabled}
                                    <td
                                        class="flex justify-center items-center"
                                    >
                                        <img
                                            src={player.profilePic}
                                            alt="profile"
                                            class="w-20 h-20 rounded-full"
                                        />
                                    </td>
                                {/if}
                                {#if arePointsEnabled}<td
                                        class="text-center text-lg"
                                        >{player.score}</td
                                    >{/if}
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {/if}
    </div>
    <!-- Question Board -->
    <div
        class="p-6 w-1/2 mx-10 bg-base-200 rounded-xl shadow-md">
        <div class="{$isUIEnabled ? '' : 'grayscale brightness-50 pointer-events-none'}">
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
                    <a class="btn btn-primary mx-auto" href="/stai">
                        Proceed to next page
                    </a>
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
