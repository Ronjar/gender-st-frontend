<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { BASE_URL } from "$lib/constants";

  let usersCount = 0;
  let datasetCounts = {
    _: 0,
    p: 0,
    b: 0,
    l: 0,
    a: 0,
    n: 0,
    pbla: 0,
    pblan: 0,
  };

  let errorMessage = "";
  let loading = false;
  let isAuthenticated = false;
  let password = "";

  const hardcodedPassword = "enpro23"; // hardcoded password

  const fetchStats = async () => {
    loading = true;
    try {
      const response = await fetch(`${BASE_URL}/stats`);
      const data = await response.json();

      if (response.ok) {
        usersCount = data.users;
        datasetCounts = {
          _: data.dataSets.x,
          p: data.dataSets.p,
          b: data.dataSets.b,
          l: data.dataSets.l,
          a: data.dataSets.a,
          n: data.dataSets.n,
          pbla: data.dataSets.pbla,
          pblan: data.dataSets.pblan,
        };
      } else {
        errorMessage = data.message || "An error occurred. Please try again.";
      }
    } catch (error) {
      errorMessage = "An error occurred. Please try again.";
    } finally {
      loading = false;
    }
  };

  onMount(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  });

  const handleLogin = () => {
    if (password === hardcodedPassword) {
      isAuthenticated = true;
      fetchStats();
    } else {
      errorMessage = "Incorrect password. Please try again.";
    }
  };

  const totalDatasets = () => {
    return Object.values(datasetCounts).reduce((a, b) => a + b, 0);
  };
</script>

{#if !isAuthenticated}
  <div class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
    <div class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Admin Login</h3>
        <div class="py-4">
          <input
            type="password"
            bind:value={password}
            class="input input-bordered w-full"
            placeholder="Enter password"
          />
        </div>
        {#if errorMessage}
          <div class="alert alert-error">
            <div>{errorMessage}</div>
          </div>
        {/if}
        <div class="modal-action">
          <button class="btn btn-primary" on:click={handleLogin}>Login</button>
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="p-6 max-w-4xl mx-auto bg-base-200 rounded-xl shadow-md">
    <h1 class="text-2xl font-bold mb-10">Admin Dashboard</h1>
    {#if loading}
      <div class="loading loading-spinner"></div>
    {:else}
      <div class="mb-10 flex flex-col">
        <div class="stats bg-primary text-primary-content mb-10">
          <div class="stat">
            <div class="stat-title text-primary-content">Total Users</div>
            <div class="stat-value">{usersCount}</div>
          </div>
        </div>
        <div class="stats shadow">
          <div class="stat">
            <div class="stat-title">Ohne</div>
            <div class="stat-value">{datasetCounts._}</div>
          </div>
          <div class="stat">
            <div class="stat-title">P</div>
            <div class="stat-value">{datasetCounts.p}</div>
          </div>
          <div class="stat">
            <div class="stat-title">B</div>
            <div class="stat-value">{datasetCounts.b}</div>
          </div>
          <div class="stat">
            <div class="stat-title">L</div>
            <div class="stat-value">{datasetCounts.l}</div>
          </div>
          <div class="stat">
            <div class="stat-title">A</div>
            <div class="stat-value">{datasetCounts.a}</div>
          </div>
          <div class="stat">
            <div class="stat-title">N</div>
            <div class="stat-value">{datasetCounts.n}</div>
          </div>
          <div class="stat">
            <div class="stat-title">PBLA</div>
            <div class="stat-value">{datasetCounts.pbla}</div>
          </div>
          <div class="stat">
            <div class="stat-title">PBLAN</div>
            <div class="stat-value">{datasetCounts.pblan}</div>
          </div>
          <div class="stat bg-base-300">
            <div class="stat-title">Total</div>
            <div class="stat-value text-secondary">{totalDatasets()}</div>
          </div>
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  .loading-spinner {
    border: 4px solid transparent;
    border-radius: 50%;
    border-top: 4px solid #3498db;
    border-right: 4px solid #3498db;
    width: 3em;
    height: 3em;
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
