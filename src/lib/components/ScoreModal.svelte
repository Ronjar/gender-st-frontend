<script lang="ts">
    import { onMount } from 'svelte';
  
    let modal: any;
    export let score = 0;
  
    export function openModal() {
      if (modal) {
        modal.showModal();
      }
    }
  
    onMount(() => {
      modal = document.getElementById('score_modal');
    });
  </script>

<!-- Open the modal using ID.showModal() method -->
<dialog id="score_modal" class="modal">
    <div class="modal-box">
        <h3 class="font-bold text-lg">You finished this rounds questions</h3>
        <p class="py-4">You answered {score} of 20 questions right. Great job!</p>
        <div class="modal-action">
            <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <button class="btn">Close</button>
            </form>
        </div>
    </div>
</dialog>
