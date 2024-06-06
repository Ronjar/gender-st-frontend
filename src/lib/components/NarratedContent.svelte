<script lang="ts">
    import { isAvatarEnabled, avatarPath as storeAvatarPath } from "../store";
    import { get } from "svelte/store";


    let avatarEnabled = false;
    let avatarPath = "";
    isAvatarEnabled.subscribe((value) => {
        avatarEnabled = value;
    });
    storeAvatarPath.subscribe((value) => {
        avatarPath = value;
    });
</script>

<div class="chat chat-start">
    {#if isAvatarEnabled}
    <div class="chat-image avatar">
      <div class="w-10 rounded-full">
        <img alt="Tailwind CSS chat bubble component" src={avatarPath} />
      </div>
    </div>
    {/if}
    <div class="chat-bubble">Message</div>
  </div>