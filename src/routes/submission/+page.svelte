<script lang="ts">
  import { onMount } from "svelte";
  import {
    pretestAnswers as waPretestAnswers,
    questions as waQuestions,
    answerTime as waAnswerTime,
    posttestAnswers as waPosttestAnswers,
    round as waRound,
    gamifiedElements as waGamifiedElements,
    userId as waUserId,
  } from "../../store";
  import { writable, get } from "svelte/store";
  import { goto } from "$app/navigation";
  import { BASE_URL } from "$lib/constants";

  let loading = false;
  let apiResponse: number;
  let buttonVisiblility = writable(false);
  let round: number;
  waRound.subscribe((value) => {
    round = value;
  });

  onMount(async () => {
    const userId = get(waUserId);
    const pretest = get(waPretestAnswers);
    const questionList = get(waQuestions);
    const answerTime = get(waAnswerTime);
    const posttest = get(waPosttestAnswers);
    const gamifiedElements = get(waGamifiedElements);

    try {
      const response = await fetch(`${BASE_URL}/addset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          gamifiedElements: gamifiedElements,
          pretestAnswers: pretest,
          questions: questionList,
          answerTime: answerTime,
          posttestAnswers: posttest,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      waRound.set(data.round);
      waGamifiedElements.set(data.gamifiedElements);
      if (data.round > 0) {
        
        buttonVisiblility.set(true);
      }
    } catch (error) {
      console.error("Error uploading data:", error);
      apiResponse = -1;
    }
  });

  function getTitle() {
    if (round < 3) {
      return "End of study part " + round;
    } else {
      ("End of study");
    }
  }

  const finishSurvey = async () => {
    goto("pretest");
  };
</script>

<div class="p-6 max-w-4xl mx-auto bg-base-200 rounded-xl shadow-md space-y-4">
  <h1>{getTitle()}</h1>
  <p>Results are submitted any moment...</p>
  {#if $buttonVisiblility}
    <button
      class="btn btn-primary {loading ? 'loading' : ''}"
      on:click={finishSurvey}
      disabled={loading}
    >
      Next round
    </button>
  {/if}
</div>

<!--
<div>
  <p>Vielen Dank, dass Sie an unserer Umfrage teilgenommen haben!</p>
  <button
    class="button {loading ? 'loading' : ''}"
    on:click={finishSurvey}
    disabled={loading}
  >
    {loading ? "Wird geladen..." : "Umfrage beenden"}
  </button>
</div>
-->
<style>

  .loading {
    cursor: not-allowed;
    opacity: 0.6;
  }
</style>
