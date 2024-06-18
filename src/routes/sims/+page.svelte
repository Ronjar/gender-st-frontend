<script lang="ts">
    import { sims } from "../../store";
    import { goto } from "$app/navigation";
    import Toast from "$lib/components/FormToast.svelte";

    let answers = Array(16).fill(-1);
    let errorMessage = "";
    let loading = false;
    let toastRef: Toast;

    const questions = [
        "Because I think that this activity is interesting",
        "Because I am doing it for my own good",
        "Because I am supposed to do it",
        "There may be good reasons to do this activity, but personally I don't see any",
        "Because I think that this activity is pleasant",
        "Because I think that this activity is good for me",
        "Because it is something that I have to do",
        "I do this activity but I am not sure if it is worth it",
        "Because this activity is fun",
        "By personal decision",
        "Because I don't have any choice",
        "I don't know; I don't see what this activity brings me",
        "Because I feel good when doing this activity",
        "Because I believe that this activity is important for me",
        "Because I feel that I have to do it",
        "I do this activity, but I am not sure it is a good thing to pursue it",
    ];

    const handleSubmit = async (event: Event) => {
        event.preventDefault();
        errorMessage = "";

        if (answers.some((answer) => answer === -1)) {
            toastRef.showToast();
            return;
        }

        loading = true;
        try {
            // Implement your logic for storing answers or navigating
            sims.set(answers);
            goto("/submission");
        } catch (error) {
            errorMessage = "An error occurred. Please try again.";
        } finally {
            loading = false;
        }
    };
</script>

<div class="p-6 max-w-6xl mx-auto bg-base-200 rounded-xl shadow-md space-y-4">
    <h1 class="text-2xl font-bold mb-6">
        Why are you currently engaged in this activity?
    </h1>
    <form on:submit={handleSubmit} class="space-y-6 w-full max-w-6xl">
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
                >Evaluate yourself using the following questions. Take your time
                and answer each question honestly and to the best of your
                knowledge.</span
            >
        </div>

        {#each questions as question, index}
            <div class="card bg-base-300 p-4 rounded-lg shadow-md">
                <div class="form-control">
                    <label class="label">
                        <span class="label-text text-lg"
                            >{index + 1}. {question}</span
                        >
                    </label>
                    <div class="flex space-x-4 items-center">
                        <label class="flex items-center space-x-2">
                            <input
                                type="radio"
                                bind:group={answers[index]}
                                value="1"
                                class="radio radio-primary"
                            />
                            <span class="ml-1">corresponds not all</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input
                                type="radio"
                                bind:group={answers[index]}
                                value="2"
                                class="radio radio-primary"
                            />
                            <span class="ml-1">corresponds a very little</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input
                                type="radio"
                                bind:group={answers[index]}
                                value="3"
                                class="radio radio-primary"
                            />
                            <span class="ml-1">corresponds a little</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input
                                type="radio"
                                bind:group={answers[index]}
                                value="4"
                                class="radio radio-primary"
                            />
                            <span class="ml-1">corresponds moderatly</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input
                                type="radio"
                                bind:group={answers[index]}
                                value="5"
                                class="radio radio-primary"
                            />
                            <span class="ml-1">corresponds enough</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input
                                type="radio"
                                bind:group={answers[index]}
                                value="6"
                                class="radio radio-primary"
                            />
                            <span class="ml-1">corresponds a lot</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input
                                type="radio"
                                bind:group={answers[index]}
                                value="7"
                                class="radio radio-primary"
                            />
                            <span class="ml-1">corresponds exactly</span>
                        </label>
                    </div>
                    <!--<div class="flex space-x-4 items-center">
                        {#each Array(7).fill(null) as _, i}
                            <label class="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    bind:group={answers[index]}
                                    value={i + 1}
                                    class="radio radio-primary"
                                />
                                <span>{i + 1}</span>
                            </label>
                        {/each}
                    </div>-->
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
