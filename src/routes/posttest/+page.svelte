<script lang="ts">
  import { posttestAnswers } from "../../store";
  import { goto } from "$app/navigation";
  import Toast from "./Toast.svelte";

  let answers: number[] = Array(20).fill(-1);
  let errorMessage: string = "";
  let loading: boolean = false;
  let toastRef: Toast;

  const questions: string[] = [
    "I feel calm",
    "I feel secure",
    "I feel tense",
    "I feel strained",
    "I feel at ease",
    "I feel upset",
    "I am presently worrying over possible misfortunes",
    "I feel satisfied",
    "I feel frightened",
    "I feel uncomfortable",
    "I feel self confident",
    "I feel nervous",
    "I feel jittery",
    "I feel indecisive",
    "I am relaxed",
    "I feel content",
    "I am worried",
    "I feel confused",
    "I feel steady",
    "I feel pleasant",
  ];

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    errorMessage = "";

    if (answers.includes(-1)) {
      toastRef.showToast();
      //errorMessage = 'Please answer all the questions.';
      return;
    }

    loading = true;
    try {
      // Store the answers in localStorage to be used later
      //localStorage.setItem("pretestAnswers", JSON.stringify(answers));
      posttestAnswers.set(answers)
      goto("/submission"); // Navigate to the questions page
    } catch (error) {
      errorMessage = "An error occurred. Please try again.";
    } finally { 
      loading = false;
    }
  };
</script>

<div class="p-6 max-w-4xl mx-auto bg-base-200 rounded-xl shadow-md space-y-4">
  <h1 class="text-2xl font-bold mb-6">Posttest</h1>
  <form on:submit={handleSubmit} class="space-y-6 w-full max-w-4xl">
    {#if errorMessage}
      <div class="alert alert-error">
        <div class="flex-1">
          <label>{errorMessage}</label>
        </div>
      </div>
    {/if}

    <div role="alert" class="alert bg-base-300">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="stroke-info shrink-0 w-6 h-6"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path></svg
      >
      <span
        >Evaluate yourself using the following questions. Take your time and
        answer each question honestly and to the best of your knowledge.</span
      >
    </div>

    {#each questions as question, index}
      <div class="card bg-base-300 p-4 rounded-lg shadow-md">
        <div class="form-control">
          <label class="label">
            <span class="label-text text-lg">{index + 1}. {question}</span>
          </label>
          <div class="flex space-x-4 items-center">
            <label class="flex items-center space-x-2">
              <input
                type="radio"
                bind:group={answers[index]}
                value="1"
                class="radio radio-primary"
              />
              <span class="ml-1">Not at all</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                type="radio"
                bind:group={answers[index]}
                value="2"
                class="radio radio-primary"
              />
              <span class="ml-1">A little</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                type="radio"
                bind:group={answers[index]}
                value="3"
                class="radio radio-primary"
              />
              <span class="ml-1">Somewhat</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                type="radio"
                bind:group={answers[index]}
                value="4"
                class="radio radio-primary"
              />
              <span class="ml-1">Very much so</span>
            </label>
          </div>
        </div>
      </div>
    {/each}

    <div class="form-control mt-6">
      <button type="submit" class="btn btn-primary" disabled={loading}>
        {#if loading}
          <span class="loading loading-spinner"></span>
        {/if}
        {#if !loading}
          Proceed to Questions
        {/if}
      </button>
    </div>

    {#if errorMessage}
      <div class="alert alert-error">
        <div class="flex-1">
          <label>{errorMessage}</label>
        </div>
      </div>
    {/if}
  </form>
</div>
<Toast bind:this={toastRef} />

<style>
  .loading-spinner {
    border: 2px solid transparent;
    border-radius: 50%;
    border-top: 2px solid white;
    border-right: 2px solid white;
    width: 1em;
    height: 1em;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
