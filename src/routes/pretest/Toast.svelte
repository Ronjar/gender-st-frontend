<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";
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

<div class="toast fixed top-0 left-1/4 w-1/2">
  {#if visible}
    <div
      class="alert alert-error shadow-lg"
    >
      <div>
        <span>Please answer all questions</span>
      </div>
    </div>
  {/if}
</div>

<style>
  .toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 1rem;
    border-radius: 0.5rem;
  }
  .toast.show {
    display: block;
  }
</style>