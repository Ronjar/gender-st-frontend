<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let message = "New Badge unlocked";
  export let visible = false;

  const dispatch = createEventDispatcher();

  export function showToast() {
    visible = true;

    setTimeout(() => {
      visible = false;
      dispatch("dismiss");
    }, 3000);
  }
</script>

<div class="fixed bottom-0 right-0 mb-10 mr-10 w-1/3">
  {#if visible}
    <div
      class={`alert shadow-lg`}
    >
      <div>
        <span class="text-xl p-6">{message}</span>
      </div>
    </div>
  {/if}
</div>
