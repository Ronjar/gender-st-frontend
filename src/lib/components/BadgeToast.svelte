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
    }, 1000);
  }
</script>

<div class="fixed right-10 bottom-10">
  {#if visible}
    <div
      class={`alert shadow-lg`}
    >
      <div>
        <span>{message}</span>
      </div>
    </div>
  {/if}
</div>
