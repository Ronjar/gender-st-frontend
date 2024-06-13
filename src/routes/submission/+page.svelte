<script lang="ts">
  import { onMount } from "svelte";
  import {
    stai as wStai,
    ngse as wNgse,
    sims as wSims,
    questions as wQuestions,
    answerTime as wAnswerTime,
    round as wRound,
    gamifiedElements as wGamifiedElements,
    isAvatarEnabled as wIsAvatarEnabled,
    userId as wUserId,
  } from "../../store";
  import { writable, get } from "svelte/store";
  import { goto } from "$app/navigation";
  import { BASE_URL } from "$lib/constants";

  let loading = false;
  let apiResponse: number;
  let buttonVisiblility = writable(false);
  let round: number;
  wRound.subscribe((value) => {
    round = value;
  });

  onMount(async () => {
    const userId = get(wUserId);
    const stai = get(wStai);
    const ngse = get(wNgse);
    const sims = get(wSims);
    const questions = get(wQuestions);
    const answerTime = get(wAnswerTime);
    const gamifiedElements = get(wGamifiedElements)[round];
    round = get(wRound);
    //const stai = [1,2,3,1,2,3];
    //const ngse = [1,2,3,4,1,2,3,4];
    //const sims = [1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4];
    //const questions = [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false];
    //const answerTime = [1000, 2000, 1000, 2000, 1000, 2000, 1000, 2000, 1000, 2000, 1000, 2000, 1000, 2000, 1000, 2000, 1000, 2000, 1000, 2000,];
    //const gamifiedElements = "pblan";


    try {
      const response = await fetch(`${BASE_URL}/addset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          gamifiedElements: gamifiedElements,
          stai: stai,
          ngse: ngse,
          sims: sims,
          questions: questions,
          answerTime: answerTime,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (data.round > 0 || data.round < 3) {
        wRound.set(data.round);
        buttonVisiblility.set(true);
      }
    } catch (error) {
      console.error("Error uploading data:", error);
      apiResponse = -1;
    }
  });

  function getTitle() {
    if (round < 2) {
      return `End of study part ${round+1}`;
    } else {
      return "End of study, tank you for your participation";
    }
  }

  const finishSurvey = async () => {
    if (get(wIsAvatarEnabled)) {
      goto("/avatars");
    } else {
      goto("/questions");
    }
  };
</script>

<div class="p-6 max-w-4xl mx-auto bg-base-200 rounded-xl shadow-md space-y-4">
  <h1>{getTitle()}</h1>
  {#if !$buttonVisiblility}
    <p>Results are submitted any moment...</p>
  {/if}
  {#if $buttonVisiblility}
    <p>Results are submitted</p>
    <button
      class="btn btn-primary mt-5 {loading ? 'loading' : ''}"
      on:click={finishSurvey}
      disabled={loading}
    >
      Next round
    </button>
  {/if}
</div>

<style>
  .loading {
    cursor: not-allowed;
    opacity: 0.6;
  }
</style>
