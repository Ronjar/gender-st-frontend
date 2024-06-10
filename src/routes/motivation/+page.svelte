<script lang="ts">
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
        "There may be good reasons to do this activity, but personally I don’t see any",
        "Because I think that this activity is pleasant",
        "Because I think that this activity is good for me",
        "Because it is something that I have to do",
        "I do this activity but I am not sure if it is worth it",
        "Because this activity is fun",
        "By personal decision",
        "Because I don’t have any choice",
        "I don’t know; I don’t see what this activity brings me",
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
            goto("/results"); // Example redirect
        } catch (error) {
            errorMessage = "An error occurred. Please try again.";
        } finally {
            loading = false;
        }
    };
</script>

<div class="p-6 max-w-4xl mx-auto bg-base-200 rounded-xl shadow-md space-y-4">
    <h1 class="text-2xl font-bold mb-6">Situational Motivation Scale</h1>
    <form on:submit={handleSubmit}>
        {#each questions as question, index}
            <div class="card bg-base-300 p-4 rounded-lg shadow-md">
                <div class="form-control">
                    <label class="label">
                        <span class="label-text text-lg"
                            >{index + 1}. {question}</span
                        >
                    </label>
                    <div class="flex space-x-4 items-center">
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
</div>
<Toast bind:this={toastRef} />

<style>
    .loading-spinner {
        /* Add your spinner styles here */
    }
</style>
