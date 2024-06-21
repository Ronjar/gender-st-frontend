<script lang="ts">
  import { onMount } from "svelte";
  import { BASE_URL } from "$lib/constants";
  import Toast from "$lib/components/Toast.svelte";

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

  let loading = false;
  let isAuthenticated = false;
  let password = "";
  let deletionCode = "";
  let showDeleteAllModal = false;
  let toastRef: Toast;

  const hardcodedPassword = "gender24"; // hardcoded password

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
        toastRef.showTypedToast("error", data.message || "Fetching stats failed.");
      }
    } catch (error) {
      toastRef.showTypedToast("error", "An error occurred. Is your database running / are you connected to network?");
    } finally {
      loading = false;
    }
  };

  const downloadCSV = async () => {
    try {
      const response = await fetch(`${BASE_URL}/csv`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "data.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        toastRef.showTypedToast("error", "Failed to download CSV.");
      }
    } catch (error) {
      toastRef.showTypedToast("warning", "An error occurred while downloading CSV.");
    }
  };

  const downloadData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/downloaddb`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "data.db";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        toastRef.showTypedToast("error", "Failed to download DB.");
      }
    } catch (error) {
      toastRef.showTypedToast("warning", "An error occurred while downloading DB.");
    }
  };

  const deleteDataset = async () => {
    try {
      const response = await fetch(`${BASE_URL}/removeuser/${deletionCode}`, {
        method: "DELETE",
      });

      const data = await response.text();
      if (response.ok) {
        toastRef.showTypedToast("success", "User data deleted successfully.");
        fetchStats();
      } else if(response.status === 404) {
        toastRef.showTypedToast("error", "User not found.");
      } else {
        toastRef.showTypedToast("error", data || "Failed to delete dataset.");
      }
    } catch (error) {
      toastRef.showTypedToast("warning", "An error occurred while deleting the dataset.");
    }
  };

  const handleBackup = async () => {
    try {
      const response = await fetch(`${BASE_URL}/backup`);
      const data = await response.text();
      if (response.ok) {
        toastRef.showTypedToast("success", data || "Backup created successfully.");
      } else {
        toastRef.showTypedToast("error", data || "Failed to create backup.");
      }
    } catch (error) {
      console.log(error);
      toastRef.showTypedToast("warning", "An error occurred while creating the backup.");
    }
  };

  const handleDeleteAll = async () => {
    try {
      const response = await fetch(`${BASE_URL}/everything`, {
        method: "DELETE",
      });
      const data = await response.text();
      if (response.ok) {
        toastRef.showTypedToast("success", data || "All data deleted successfully.");
      } else {
        toastRef.showTypedToast("error", data || "Failed to delete all data.");
      }
      showDeleteAllModal = false;
    } catch (error) {
      toastRef.showTypedToast("warning", "An error occurred while deleting all data.");
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
      toastRef.showTypedToast("error", "Incorrect password. Please try again.");
    }
  };

  const totalDatasets = () => {
    return Object.values(datasetCounts).reduce((a, b) => a + b, 0);
  };
</script>
<div class="fixed top-0 left-1/3 w-1/3 h-10">
<Toast bind:this={toastRef} />
</div>
{#if !isAuthenticated}
  <div
    class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
  >
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
      <div class="card bg-base-300 p-6 mb-10">
        <h2 class="text-xl font-bold mb-4">Statistics</h2>
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
          <div class="stat bg-base-200">
            <div class="stat-title">Total</div>
            <div class="stat-value text-secondary">{totalDatasets()}</div>
          </div>
        </div>
      </div>
      <div class="card bg-base-300 p-6 mb-10">
        <h2 class="text-xl font-bold mb-4">Backup</h2>
        <button class="btn btn-primary mb-4" on:click={downloadCSV}
          >Download CSV</button
        >
        <button class="btn btn-primary mb-4" on:click={handleBackup}
          >Backup Data</button
        >
        <button class="btn btn-primary mb-4" on:click={downloadData}
          >Download DB file</button
        >
      </div>
      <div class="card bg-base-300 p-6 mb-10">
        <h2 class="text-xl font-bold mb-4">Data Deletion</h2>
        <div class="join mb-4">
        <input
          type="text"
          bind:value={deletionCode}
          class="input input-bordered w-full join-item "
          placeholder="Enter deletion code"
        />
        <button class="btn btn-error join-item" on:click={deleteDataset}
          >Delete Dataset</button
        >
      </div>
        <button
          class="btn btn-error"
          on:click={() => (showDeleteAllModal = true)}>Delete All Data</button
        >
      </div>
    {/if}
  </div>
{/if}

{#if showDeleteAllModal}
  <div
    class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
  >
    <div class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Are you sure?</h3>
        <p>
          This action will delete all data permanently. This cannot be undone.
        </p>
        <div class="modal-action">
          <button class="btn" on:click={() => (showDeleteAllModal = false)}
            >Cancel</button
          >
          <button class="btn btn-error" on:click={handleDeleteAll}
            >Delete All</button
          >
        </div>
      </div>
    </div>
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
