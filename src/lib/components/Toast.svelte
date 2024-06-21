<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let type = "success"; // 'success' or 'error'
  export let message = "";
  export let visible = false;

  const dispatch = createEventDispatcher();

  export function showTypedToast(messageType: string, msg: string, timeout: number = 2000){
    type = messageType;
    message = msg;
    visible = true;

    setTimeout(() => {
      visible = false;
      dispatch("dismiss");
    }, timeout);
  }

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
      class={`alert alert-${type} shadow-lg`}
    >
      <div>
        <span>{message}</span>
      </div>
    </div>
  {/if}
</div>
