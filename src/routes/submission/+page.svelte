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
  let round: number = get(wRound); // Set initial value
  let buttonVisibility = writable(false);

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
      console.log(data);
      if (data.round > 0) {
        wRound.set(data.round);
        if (data.round < 3) {
          buttonVisibility.set(true);
        }
      }
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  });

  const finishSurvey = async () => {
    if (get(wIsAvatarEnabled)) {
      goto("/avatars");
    } else {
      goto("/questions");
    }
  };
</script>

<div class="p-6 max-w-4xl mx-auto bg-base-200 rounded-xl shadow-md space-y-4">
  <h1>Thank you for your participation</h1>
  {#if round < 3}
    <p>
      You have completed round {round} of the study. Thank you very much so far!
    </p>
  {/if}
  {#if round >= 3}
    <p>
      Thank you for participating in this test. Please show this screen to the
      supervising person.
    </p>
  {/if}
  {#if $buttonVisibility}
    <p>To proceed in the study, please press the button below.</p>
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
