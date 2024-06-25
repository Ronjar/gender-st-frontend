<script lang="ts">
  import { ngse } from "../../store";
  import { goto } from "$app/navigation";
  import Toast from "$lib/components/FormToast.svelte";
  import HoverTranslate from "$lib/components/HoverTranslate.svelte"; // Import the HoverTranslate component

  let answers: number[] = Array(8).fill(-1); // Adjusting array length to 8 for the new questions
  let errorMessage: string = "";
  let loading: boolean = false;
  let toastRef: Toast;

  const questions = [
    "I will be able to achieve most of the goals that I set for myself.",
    "When facing difficult tasks, I am certain that I will accomplish them.",
    "In general, I think that I can obtain outcomes that are important to me.",
    {
      text: "I believe I can succeed at most any ",
      component: "st_ngse_endeavor",
      end: " to which I set my mind.",
    },
    "I will be able to successfully overcome many challenges.",
    "I am confident that I can perform effectively on many different tasks.",
    "Compared to other people, I can do most tasks very well.",
    "Even when things are tough, I can perform quite well.",
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
      ngse.set(answers);
      goto("/sims");
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
                {question.end}
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
              <span class="ml-1">Strongly disagree</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                type="radio"
                bind:group={answers[index]}
                value="2"
                class="radio radio-primary"
              />
              <span class="ml-1">Disagree</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                type="radio"
                bind:group={answers[index]}
                value="3"
                class="radio radio-primary"
              />
              <span class="ml-1">Neither agree nor disagree</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                type="radio"
                bind:group={answers[index]}
                value="4"
                class="radio radio-primary"
              />
              <span class="ml-1">Agree</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                type="radio"
                bind:group={answers[index]}
                value="5"
                class="radio radio-primary"
              />
              <span class="ml-1">Strongly agree</span>
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
  </form>
  <Toast bind:this={toastRef} />
</div>

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
