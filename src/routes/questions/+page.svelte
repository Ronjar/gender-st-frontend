<script lang="ts">
    import { writable, get, derived } from "svelte/store";
    import { goto } from "$app/navigation";
    import {
        questions,
        isAvatarEnabled,
        arePointsEnabled,
        isLeaderboardEnabled,
        isNarratedContentEnabled,
        areBadgesEnabled,
        avatarPath,
    } from "../../store";
    import Toast from "$lib/components/Toast.svelte";
    import NarratedContent from "$lib/components/NarratedContent.svelte";
    import {
        callWithProbability,
        randomBadPhrase,
        randomGoodPhrase,
    } from "$lib/scripts/narratedPhrases";

    const totalQuestions = 20;
    let currentQuestionIndex = writable(0);
    let score = writable(0);
    let userAnswers = writable<boolean[]>([]);
    let toastRef: Toast;
    let narratedRef: NarratedContent;

    let varIsAvatarEnabled = false;
    let varArePointsEnabled = false;
    let varIsLeaderboardEnabled = false;
    let varIsNarratedContentEnabled = false;
    let varAreBadgesEnabled = false;

    isAvatarEnabled.subscribe((value) => {
        varIsAvatarEnabled = value;
    });
    arePointsEnabled.subscribe((value) => {
        varArePointsEnabled = value;
    });
    isLeaderboardEnabled.subscribe((value) => {
        varIsLeaderboardEnabled = value;
    });
    isNarratedContentEnabled.subscribe((value) => {
        varIsNarratedContentEnabled = value;
    });
    areBadgesEnabled.subscribe((value) => {
        varAreBadgesEnabled = value;
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

    function unlockBadge(badgeNumber:number) {
    const unlockedImages = [
        '/img/badges/badge1.png',
        '/img/badges/badge2.png',
        '/img/badges/badge3.png',
        '/img/badges/badge4.png',
    ];
    
    const badge: any = document.getElementById(`badge${badgeNumber}`);
    if (badge) {
        badge.src = unlockedImages[badgeNumber];
    }
}

    const handleAnswer = (answer: string) => {
        // Antworten speichern
        if (correctAnswers[get(currentQuestionIndex)] === answer) {
            score.update((n) => n + 5);
            userAnswers.update((answers) => [...answers, true]);
            showToast(true);
            callWithProbability(
                0.5,
                narratedRef.showNarration,
                randomGoodPhrase(),
            );
        } else {
            userAnswers.update((answers) => [...answers, false]);
            showToast(false);
            callWithProbability(
                0.5,
                narratedRef.showNarration,
                randomBadPhrase(),
            );
        }
        console.log(get(currentQuestionIndex));
        currentQuestionIndex.update((n) => n + 1);
    };

    score.subscribe((value) => {
        if(value > 10){
            unlockBadge(1);
        }
    });

    let questionImage = "/img/questions/q-0.png";
    currentQuestionIndex.subscribe((index) => {
        if (index >= totalQuestions) {
            questions.set(get(userAnswers));
            goto("/posttest");
        }
        questionImage = `/img/questions/q-${index}.png`;
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
</script>

<div class="flex justify-between">
    <!-- Scoreboard -->
    <div class="w-1/4 mx-auto">
        {#if varIsLeaderboardEnabled}
            <table
                class="table w-full bg-base-200 shadow-md rounded-xl table-auto"
            >
                <thead class="my-10">
                    <tr class="my-10">
                        <th class="w-1/4">Rank</th>
                        <th class="w-1/4">Profile</th>
                        {#if varArePointsEnabled}<th class="w-2/4 text-center"
                                >Score</th
                            >
                        {/if}
                    </tr>
                </thead>
                <tbody>
                    {#each sortedLeaderboard as player, index}
                        <tr
                            class={player.isYou ? "bg-gray-800" : "bg-base-200"}
                        >
                            <td class="text-center text-lg">{index + 1}</td>
                            <td class="flex justify-center items-center">
                                <img
                                    src={player.profilePic}
                                    alt="profile"
                                    class="w-20 h-20 rounded-full"
                                />
                            </td>
                            {#if varArePointsEnabled}<td
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
        <p class="text-xl mb-20">Answer the following question</p>
        <div class="flex justify-between items-center">
            <div class="flex flex-col items-center">
                <img
                    src={questionImage}
                    alt="Question Image"
                    class="w-3/4 h-3/4"
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
        {#if varArePointsEnabled}
            <div class="w-1/2 stat bg-base-200 mb-10 p-4 rounded-xl shadow-md">
                <div class="stat-title">Score</div>
                <div class="stat-value text-primary">{$score}</div>
                <div class="stat-desc">5 points per question</div>
            </div>
        {/if}
        {#if varAreBadgesEnabled}
            <div class="w-1/2 bg-base-200 p-4 rounded-xl shadow-md">
                <div class="stat-title mb-5">Badges</div>
                <div id="badgeGrid" class="grid grid-cols-2 gap-4">
                    <div
                        class="grid w-32 h-32 rounded bg-base-100 text-accent-content items-center"
                    >
                        <img
                            src="/img/lock.png"
                            id="badge1"
                            class="w-3/4 h-3/4 mx-auto"
                            alt="Locked Badage 1"
                        />
                    </div>
                    <div
                        class="grid w-32 h-32 rounded bg-base-100 text-accent-content items-center"
                    >
                        <img
                            src="/img/lock.png"
                            id="badge2"
                            class="w-3/4 h-3/4 mx-auto"
                            alt="Locked Badage 2"
                        />
                    </div>
                    <div
                        class="grid w-32 h-32 rounded bg-base-100 text-accent-content items-center"
                    >
                        <img
                            src="/img/lock.png"
                            id="badge3"
                            class="w-3/4 h-3/4 mx-auto"
                            alt="Locked Badage 3"
                        />
                    </div>
                    <div
                        class="grid w-32 h-32 rounded bg-base-100 text-accent-content items-center"
                    >
                        <img
                            src="/img/lock.png"
                            id="badge4"
                            class="w-3/4 h-3/4 mx-auto"
                            alt="Locked Badage 4"
                        />
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>
