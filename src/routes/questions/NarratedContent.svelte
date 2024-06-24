<script lang="ts">
    import { isAvatarEnabled } from "../../store";

    let message = "Default message";
    let avatarEnabled = false;
    let isVisible = false;
    let avatarUrl = getAvatar();

    isAvatarEnabled.subscribe((value) => {
        avatarEnabled = value;
    });

    export function isShowing(){
        return isVisible;
    }

    export function showNarration(newMessage: string) {
        message = newMessage;
        avatarUrl = getAvatar();
        isVisible = true;
    }

    function getAvatar(){
        return "/img/npc/avatar" + (1 + Math.floor(Math.random() * 8)) + ".png";
    }

    export function hideNarration() {
        isVisible = false;
    }
</script>

<div class="fixed bottom-0 right-0 mb-20 mr-20 bg-transparent shadow-none  {isVisible ? 'animate-flyinbottom' : ''}" class:invisible={!isVisible}>
    <div class="chat chat-end">
        <div class="chat-bubble text-3xl">{message}</div>
        {#if avatarEnabled}
            <div class="chat-image">
                <img class="w-24 rounded-full" alt="User Avatar" src={avatarUrl} />
            </div>
        {/if}
    </div>
</div>

<style>
    .invisible {
        visibility: hidden;
    }
</style>
