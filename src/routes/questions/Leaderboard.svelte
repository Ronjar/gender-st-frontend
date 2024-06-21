<script lang="ts">
    import { writable, derived, get } from "svelte/store";
    import { avatarPath } from "../../store";

    // Writable stores for leaderboard settings
    import {
        isAvatarEnabled as waAvatars,
        arePointsEnabled as wwaPoints,
        isLeaderboardEnabled as waLeaderboard,
    } from "../../store";

    let isAvatarEnabled = false;
    let arePointsEnabled = false;
    let isLeaderboardEnabled = false;

    waAvatars.subscribe((value) => {
        isAvatarEnabled = value;
    });
    wwaPoints.subscribe((value) => {
        arePointsEnabled = value;
    });
    waLeaderboard.subscribe((value) => {
        isLeaderboardEnabled = value;
    });

    // Function to get a random leaderboard number
    function getRandomLeaderboardNumber(base: number): number {
        return base + (3 - Math.floor(Math.random() * 6));
    }

    // Generate a random avatar image path and player name
    function getRandomAvatar(usedAvatars: Set<number>): {
        profilePic: string;
        playerName: string;
    } {
        let avatarIndex;
        do {
            avatarIndex = 1 + Math.floor(Math.random() * 8); // We have avatar1 to avatar8
        } while (usedAvatars.has(avatarIndex));
        usedAvatars.add(avatarIndex);
        return {
            profilePic: `/img/npc/avatar${avatarIndex}.png`,
            playerName: `Player ${avatarIndex}`,
        };
    }

    let usedAvatars = new Set<number>();

    // Initialize opponent data
    let opponents = [
        {
            score: getRandomLeaderboardNumber(16),
            ...getRandomAvatar(usedAvatars),
            isYou: false,
        },
        {
            score: getRandomLeaderboardNumber(13),
            ...getRandomAvatar(usedAvatars),
            isYou: false,
        },
        {
            score: getRandomLeaderboardNumber(10),
            ...getRandomAvatar(usedAvatars),
            isYou: false,
        },
        {
            score: getRandomLeaderboardNumber(7),
            ...getRandomAvatar(usedAvatars),
            isYou: false,
        },
        {
            score: getRandomLeaderboardNumber(4),
            ...getRandomAvatar(usedAvatars),
            isYou: false,
        },
    ];

    // Writable store for user score
    let userScore = writable(0);

    // Update user score function
    export function updateUserScore(newScore: number) {
        userScore.set(newScore);
    }

    // Derived store to create the leaderboard
    const leaderboard = derived([userScore], ([$userScore]) => {
        const players = [
            ...opponents,
            {
                profilePic: get(avatarPath),
                playerName: "You",
                score: $userScore,
                isYou: true,
            },
        ];
        return players.sort((a, b) => b.score - a.score);
    });

    let sortedLeaderboard: any[] = [];
    leaderboard.subscribe((value: any) => {
        sortedLeaderboard = value;
    });

    export function getLeaderboardPlacement(): number {
        const you = sortedLeaderboard.findIndex((player) => player.isYou);
        return you + 1; // +1 because findIndex returns 0-based index
    }
</script>

<div class="bg-base-200 shadow-md rounded-xl p-6">
    <span class="text-primary stat-value"><b>Leaderboard</b></span>
    <table class="table w-full table-auto mt-10">
        <thead class="my-10">
            <tr class="my-10">
                <th class="w-1/4">Rank</th>
                {#if isAvatarEnabled}<th class="w-1/4">Profile</th>{/if}
                <th class="w-1/4">Name</th>
                {#if arePointsEnabled}<th class="w-2/4 text-center">Score</th
                    >{/if}
            </tr>
        </thead>
        <tbody>
            {#each sortedLeaderboard as player, index}
                <tr
                    class={player.isYou
                        ? "bg-base-300 rounded-l"
                        : "bg-base-200"}
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
                    <td class="text-center text-lg">{player.playerName}</td>
                    {#if arePointsEnabled}<td class="text-center text-lg"
                            >{player.score}</td
                        >{/if}
                </tr>
            {/each}
        </tbody>
    </table>
</div>
