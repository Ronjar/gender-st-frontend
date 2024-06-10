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
        round
    } from "../../store";
    import Toast from "$lib/components/Toast.svelte";
    import NarratedContent from "./NarratedContent.svelte";
    import {
        callWithProbability,
        randomBadPhrase,
        randomGoodPhrase,
    } from "$lib/scripts/narratedPhrases";
    import Badges from "./Badges.svelte";

    const totalQuestions = 20;
    let currentQuestionIndex = writable(0);
    let score = writable(0);
    let userAnswers = writable<boolean[]>([]);
    let answerTime = writable<number[]>([]);
    let questionStartTime: number;
    let toastRef: Toast;
    let narratedRef: NarratedContent;
    let badgesRef: Badges;

    let isAvatarEnabled = false;
    let arePointsEnabled = false;
    let isLeaderboardEnabled = false;
    let isNarratedContentEnabled = false;
    let areBadgesEnabled = false;

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
        "B",
        "E",
        "E",
        "E",
        "A",
        "B",
        "D",
        "E",
        "B",
        "B",
        "E",
        "B",
        "C",
        "E",
        "A",
        "C",
        "B",
        "D",
        "B",
        "A",
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

    const handleAnswer = (answer: string) => {
        narratedRef.hideNarration();
        const endTime = Date.now();
        const timeTaken = endTime - questionStartTime;
        answerTime.update((times) => [...times, timeTaken]);
        // Antworten speichern
        if (correctAnswers[get(currentQuestionIndex)] === answer) {
            score.update((n) => n + 5);
            userAnswers.update((answers) => [...answers, true]);
            showToast(true);
            callWithProbability(
                1,
                narratedRef.showNarration,
                randomGoodPhrase(),
            );
        } else {
            userAnswers.update((answers) => [...answers, false]);
            showToast(false);
            callWithProbability(
                1,
                narratedRef.showNarration,
                randomBadPhrase(),
            );
        }
        currentQuestionIndex.update((n) => n + 1);
    };

    score.subscribe((value) => {
        switch (value / 5) {
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
    });

    let questionImage = `/img/questions/q-${0+(get(round)-1)*20}.png`;
    currentQuestionIndex.subscribe((index) => {
        if (index >= totalQuestions) {
            waAnswerTime.set(get(answerTime));
            waQuestions.set(get(userAnswers));
            goto("/posttest");
        }
        questionImage = `/img/questions/q-${index+(get(round)-1)*20}.png`;
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

<div class="flex justify-between">
    <!-- Scoreboard -->
    <div class="w-1/4 mx-auto">
        {#if isLeaderboardEnabled}
            <table
                class="table w-full bg-base-200 shadow-md rounded-xl table-auto"
            >
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
                            class={player.isYou ? "bg-base-300" : "bg-base-200"}
                        >
                            <td class="text-center text-lg">{index + 1}</td>
                            {#if isAvatarEnabled}
                                <td class="flex justify-center items-center">
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
        {/if}
    </div>
    <!-- Question Board -->
    <div class="p-6 w-1/2 mx-10 bg-base-200 rounded-xl shadow-md">
        <p class="text-xl">Answer the following question</p>
        <p class="text-m mb-20">Select the option most</p>
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
                        on:click={() => handleAnswer("A")}>Option A</button
                    >
                    <button
                        class="btn btn-primary"
                        on:click={() => handleAnswer("B")}>Option B</button
                    >
                    <button
                        class="btn btn-primary"
                        on:click={() => handleAnswer("C")}>Option C</button
                    >
                    <button
                        class="btn btn-primary"
                        on:click={() => handleAnswer("D")}>Option D</button
                    >
                    <button
                        class="btn btn-primary"
                        on:click={() => handleAnswer("E")}>Option E</button
                    >
                </div>
            </div>
        </div>
        <Toast bind:this={toastRef} />
        {#if isNarratedContentEnabled}
            <NarratedContent bind:this={narratedRef} />
        {/if}
    </div>
    <!-- Scores and Badges -->
    <div class="w-1/4 mx-auto flex flex-col">
        {#if arePointsEnabled}
            <div class="w-1/2 stat bg-base-200 mb-10 p-4 rounded-xl shadow-md">
                <div class="stat-title">Score</div>
                <div class="stat-value text-primary">{$score}</div>
                <div class="stat-desc">5 points per question</div>
            </div>
        {/if}
        {#if areBadgesEnabled}
            <Badges bind:this={badgesRef} />
        {/if}
    </div>
</div>
