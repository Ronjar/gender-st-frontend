<script lang="ts">
    let badges = [
        {
            id: 1,
            src: "/img/badges/badge1.png",
            unlocked: false,
            tooltip: "Get 1 right answer",
        },
        {
            id: 2,
            src: "/img/badges/badge2.png",
            unlocked: false,
            tooltip: "Get 5 right answers",
        },
        {
            id: 3,
            src: "/img/badges/badge3.png",
            unlocked: false,
            tooltip: "Get 10 right answers",
        },
        {
            id: 4,
            src: "/img/badges/badge4.png",
            unlocked: false,
            tooltip: "Get 18 right answers",
        },
    ];

    export function unlockBadge(id: number) {
        badges = badges.map((badge) => {
            if (badge.id === id) {
                return { ...badge, unlocked: true };
            }
            return badge;
        });
    }
</script>

<div class="w-1/2 bg-base-200 p-4 rounded-xl shadow-md">
    <p class="stat-title mb-2">Badges</p>
    <div class="grid grid-cols-2 gap-4">
        {#each badges as badge}
            <div class="tooltip" data-tip={badge.tooltip}>
                <div class="flex justify-center">
                    <img
                        src={badge.src}
                        alt="Badge"
                        class="w-24 h-24 rounded-xl {badge.unlocked
                            ? 'animate-bling'
                            : 'grayscale'}"
                    />
                </div>
            </div>
        {/each}
        <div class="stat-desc">Hover a badge to see its requirements</div>
    </div>
</div>
