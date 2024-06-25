<script lang="ts">
  import { stai, isAvatarEnabled } from "../../store";
  import { goto } from "$app/navigation";
  import Toast from "$lib/components/FormToast.svelte";
  import HoverTranslate from "$lib/components/HoverTranslate.svelte"; // Import the HoverTranslate component

  let answers: number[] = Array(6).fill(-1);
  let errorMessage: string = "";
  let loading: boolean = false;
  let toastRef: Toast;

  const questions = [
    "Right now I feel calm",
    "Right now I am tense",
    "Right now I feel upset",
    "Right now I am relaxed",
    { text: "Right now I feel ", component: "st_stai_content" },
    "Right now I am worried",
  ];

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    errorMessage = "";

    if (answers.includes(-1)) {
      toastRef.showToast();
      return;
    }

    loading = true;
    try {
      // Store the answers in localStorage to be used later
      stai.set(answers);
      goto("/ngse");
    } catch (error) {
      errorMessage = "An error occurred. Please try again.";
    } finally {
      loading = false;
    }
  };
</script>

<div class="p-6 max-w-4xl mx-auto bg-base-200 rounded-xl shadow-md space-y-4">
  <form on:submit={handleSubmit} class="space-y-6 w-full max-w-4xl">
    <div role="alert" class="alert bg-base-300">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="stroke-info shrink-0 w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <span
        >Evaluate yourself using the following questions. Take your time and
        answer each question honestly and to the best of your knowledge.</span
      >
    </div>

    {#each questions as question, index}
      <div class="card bg-base-300 p-4 rounded-lg shadow-md">
        <div class="form-control">
          <label class="label">
            <span class="label-text text-lg">
              {index + 1}.
              {#if typeof question === "string"}
                {question}
              {:else}
                {question.text}
                <HoverTranslate word={question.component} />
              {/if}
            </span>
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
          Proceed to next page
        {/if}
      </button>
    </div>
    <!--
    {#if errorMessage}
      <div class="alert alert-error">
        <div class="flex-1">
          <label>{errorMessage}</label>
        </div>
      </div>
    {/if}-->
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
