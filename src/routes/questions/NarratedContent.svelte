<script lang="ts">
    import { isAvatarEnabled, avatarPath as storeAvatarPath } from "../../store";

    let message = "Default message";
    let avatarEnabled = false;
    let avatarPath = "";
    let isVisible = false;

    isAvatarEnabled.subscribe((value) => {
        avatarEnabled = value;
    });

    storeAvatarPath.subscribe((value) => {
        avatarPath = value;
    });

    export function showNarration(newMessage: string) {
        message = newMessage;
        isVisible = true;
    }

    export function hideNarration() {
        isVisible = false;
    }
</script>

<div class="fixed bottom-0 right-0 mb-20 mr-20 bg-transparent shadow-none  {isVisible ? 'animate-flyinbottom' : ''}" class:invisible={!isVisible}>
    <div class="chat chat-end">
        <div class="chat-bubble text-3xl">{message}</div>
        {#if !avatarEnabled}
            <div class="chat-image">
                <img class="w-24 rounded-full" alt="User Avatar" src="/img/npc/avatar6.png" />
            </div>
        {/if}
    </div>
</div>

<style>
    .invisible {
        visibility: hidden;
    }
    .visible {
        visibility: visible;
    }
</style>
