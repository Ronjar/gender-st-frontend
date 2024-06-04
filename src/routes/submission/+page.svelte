<script lang="ts">
  import { onMount } from "svelte";
  import {
    pretestAnswers,
    questions,
    posttestAnswers,
    round as waRound,
  } from "../../store";
  import { get, writable } from "svelte/store";
  import { goto } from "$app/navigation";

  let loading = false;
  let apiResponse: number;
  let buttonVisiblility = writable<boolean>(false);
  let round: number;
  waRound.subscribe((value) => {
    round = value;
  });

  onMount(async () => {
    const pretest = get(pretestAnswers);
    const questionList = get(questions);
    const posttest = get(posttestAnswers);

    try {
      const response = await fetch("http://localhost:6969/addset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pretestAnswers: pretest,
          questions: questionList,
          posttestAnswers: posttest,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      apiResponse = data.nextPage;
    waRound.set(apiResponse);
      if (apiResponse > 0) {
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
    goto("pretest")
  };
</script>

<div class="p-6 max-w-4xl mx-auto bg-base-200 rounded-xl shadow-md space-y-4">
  <h1>{getTitle()}</h1>
  <p>Results are submitted any moment.</p>
  {#if buttonVisiblility}
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
  .button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  }

  .loading {
    cursor: not-allowed;
    opacity: 0.6;
  }
</style>
