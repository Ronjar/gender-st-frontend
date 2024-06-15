<script lang="ts">
  import { onMount } from "svelte";

  let modal: any;
  let score = 0;
  let badgeCount = 0;
  let leaderboardPlace = 6

  export function setScore(vScore:number){
    score = vScore;
  }
  export function setBadgeCount(vBadgeCount: number){
    badgeCount = vBadgeCount;
  }
  export function setLeaderboardPlace(vLeaderboardPlace: number) {
    leaderboardPlace = vLeaderboardPlace;
  }

  export function openModal() {
    if (modal) {
      modal.showModal();
    }
  }

  onMount(() => {
    modal = document.getElementById("score_modal");
  });
</script>

<!-- Open the modal using ID.showModal() method -->
<dialog id="score_modal" class="modal">
  <div class="modal-box max-w-2xl">
    <h3 class="font-bold text-lg">You finished this rounds questions</h3>
    <p>These are the results</p>
    <div class="stats bg-base-200 shadow m-5">
      <div class="stat">
        <div class="stat-title">Score</div>
        <div class="stat-value text-primary">{score}</div>
        <div class="stat-desc">right answers</div>
      </div>
      
      <div class="stat">
        <div class="stat-title">Badges</div>
        <div class="stat-value text-secondary">{badgeCount}</div>
        <div class="stat-desc">badges unlocked</div>
      </div>
      
      <div class="stat">
        <div class="stat-title">You placed</div>
        <div class="stat-value">{leaderboardPlace}</div>
        <div class="stat-desc text-secondary">on the Leaderboard</div>
      </div>
    </div>
    <div class="modal-action">
      <form method="dialog">
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn">Close</button>
      </form>
    </div>
  </div>
</dialog>
