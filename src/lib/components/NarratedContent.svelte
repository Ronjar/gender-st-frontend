<script lang="ts">
  import { isAvatarEnabled, avatarPath as storeAvatarPath } from "../../store";
  import { onMount } from "svelte";

  export let message = "Default message";

  let avatarEnabled = false;
  let avatarPath = "";
  let modal: HTMLDialogElement | null = null;

  isAvatarEnabled.subscribe((value) => {
    avatarEnabled = value;
  });

  storeAvatarPath.subscribe((value) => {
    avatarPath = value;
  });

  export function showNarration(newMessage: string) {
    message = newMessage;
    if (modal) {
      modal.showModal();
    }
  }

  onMount(() => {
    modal = document.getElementById("my_modal_2") as HTMLDialogElement;
  });
</script>

<!-- Open the modal using showNarration function -->
<!--<button class="btn" on:click={() => showNarration("Your custom message")}
  >open modal</button
>-->

<dialog id="my_modal_2" class="modal">
  <div class="modal-box w-full bg-transparent shadow-none">
    <div class="chat chat-start">
      {#if avatarEnabled}
        <div class="chat-image avatar">
          <img class="w-10 rounded-full" alt="User Avatar" src={avatarPath} />
        </div>
      {/if}
      {#if !avatarEnabled}
        <div class="chat-image avatar">
          <img
            class="w-10 rounded-full"
            alt="User Avatar"
            src="/img/npc/avatar0.png"
          />
        </div>
      {/if}
      <div class="chat-bubble text-xl">{message}</div>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button type="submit">close</button>
  </form>
</dialog>
