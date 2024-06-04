<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";

  export let type = "success"; // 'success' or 'error'
  export let message = "";
  export let visible = false;

  const dispatch = createEventDispatcher();

  export function showToast(isSuccess: boolean, msg: string) {
    type = isSuccess ? "success" : "error";
    message = msg;
    visible = true;

    setTimeout(() => {
      visible = false;
      dispatch("dismiss");
    }, 1000);
  }
</script>

<div class="mt-5 mx-auto">
  {#if visible}
    <div
      class={`alert ${type === "success" ? "alert-success" : "alert-error"} shadow-lg`}
    >
      <div>
        <span>{message}</span>
      </div>
    </div>
  {/if}
</div>
