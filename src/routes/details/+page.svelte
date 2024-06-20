<script lang="ts">
  import {
    gamifiedElements,
    round,
    userId,
  } from "../../store";
  import { goto } from "$app/navigation";
  import { get } from "svelte/store";
  import { BASE_URL } from "$lib/constants";

  let gender = "";
  let age = "";
  let studyProgram = "";
  let phdStudyProgram = "";
  let errorMessage = "";
  let loading = false;

  const descriptions = [
    "Last letter of the father's first name",
    "Last number of the birthday",
    "First letter of the mother's first name",
    "Month of the father's birthday (01-12)",
    "Last digit of postcode",
  ];

  let deletionCodeStrings = {
    field1: "",
    field2: "",
    field3: "",
    field4: "",
    field5: "",
  };

  const studyPrograms = [
    "Acoustics M.Ac.",
    "Aerospace Engineering B.Sc.",
    "Air Quality Control, Solid Waste and Waste Water Process Engineering (WASTE) M.Sc.",
    "Architecture and Urban Planning B.Sc.",
    "Architecture and Urban Planning M.Sc.",
    "Art History B.A.",
    "Art History M.A.",
    "Artificial Intelligence and Data Science M.Sc.",
    "Autonomous Systems M.Sc.",
    "Automotive Engineering B.Sc.",
    "Automotive Engineering M.Sc.",
    "Biological Engineering B.Sc.",
    "Biological Engineering M.Sc.",
    "Biology Teaching Degree",
    "Building Physics and Environmental Responsive Construction M.Sc.",
    "Business Administration B.A.",
    "Business Administration, technically oriented B.Sc.",
    "Business Administration, technically oriented M.Sc.",
    "Chemical- and Bio-Engineering B.Sc.",
    "Chemistry B.A.",
    "Chemistry B.Sc.",
    "Chemistry M.Sc.",
    "Chemistry Teaching Degree",
    "Civil Engineering B.A.",
    "Civil Engineering B.Sc.",
    "Civil Engineering M.Sc.",
    "Computational Linguistics M.Sc.",
    "Computational Mechanics of Materials and Structures (COMMAS) M.Sc.",
    "Computer Science B.A.",
    "Computer Science B.Sc.",
    "Computer Science M.Sc.",
    "Computer Science Teaching Degree",
    "Cultures of Knowledge M.A.",
    "Data Science B.Sc.",
    "Digital Humanities M.A.",
    "Electrical Engineering and Information Technology B.A.",
    "Electrical Engineering and Information Technology B.Sc.",
    "Electrical Engineering and Information Technology M.Sc.",
    "Electrical Engineering M.Sc.",
    "Electromobility M.Sc.",
    "Empirical Political and Social Research (German-French) M.A.",
    "Empirical Political and Social Research M.A.",
    "Energy Engineering M.Sc.",
    "Engineering Cybernetics B.Sc.",
    "Engineering Cybernetics M.Sc.",
    "English and American Studies / English Linguistics M.A.",
    "English Linguistics (IfLA)",
    "English Teaching Degree",
    "English, B.A.",
    "English, M.A.",
    "Environmental Engineering B.Sc.",
    "Environmental Engineering M.Sc.",
    "Food Chemistry – Cooperation Hohenheim University B.Sc.",
    "Food Chemistry – Cooperation Hohenheim University M.Sc.",
    "French Teaching Degree",
    "Geodesy and Geoinformatics Engineering B.Sc.",
    "Geomatics Engineering (GEOENGINE) M.Sc.",
    "German B.A.",
    "German Linguistics",
    "German Literature M.A.",
    "German Teaching Degree",
    "History - Sources and Interpretations M.A.",
    "History B.A.",
    "History of Natural Sciences and Technology B.A.",
    "History Teaching Degree",
    "Information Systems B.Sc.",
    "Information Systems M.Sc.",
    "Information Technology (INFOTECH) M.Sc.",
    "Infrastructure Planning M.Sc.",
    "Institute of Business Administration (BWI)",
    "Integrated Urbanism and Sustainable Design M.Sc.",
    "Integrative Technologies and Architectural Design Research (ITECH) M.Sc.",
    "International Construction: Practice and Law MBE",
    "Intra- und Entrepreneurship (tech) MBE",
    "Italian Teaching Degree",
    "Linguistics B.A.",
    "Logistics Management MBE",
    "Materials Science B.Sc.",
    "Materials Science M.Sc.",
    "Mathematics B.A.",
    "Mathematics B.Sc.",
    "Mathematics M.Sc.",
    "Mathematics Teaching Degree",
    "Mechanical Engineering B.A.",
    "Mechanical Engineering B.Sc.",
    "Mechanical Engineering M.Sc.",
    "Mechanical Engineering / Micro-Engineering, Apparatus Technology and Technical Optics M.Sc.",
    "Mechanical Engineering / Materials and Production Engineering M.Sc.",
    "Mechanical Engineering / Product Development and Design M.Sc.",
    "Mechatronics B.Sc.",
    "Mechatronics M.Sc.",
    "Media Computer Science B.Sc.",
    "Medical Engineering B.Sc.",
    "Medical Engineering M.Sc.",
    "Movement Science B.Sc.",
    "Movement Science and Biomechanics M.Sc.",
    "Natural and Technical Sciences Teaching Degree",
    "Natural Language Processing B.Sc.",
    "Philosophy B.A.",
    "Philosophy M.A.",
    "Philosophy/Ethics Teaching Degree",
    "Photonic Engineering M.Sc.",
    "Physics B.A.",
    "Physics B.Sc.",
    "Physics M.Sc.",
    "Physics Teaching Degree",
    "Political Sciences B.A.",
    "Political Sciences Teaching Degree",
    "Political Sciences/Economics Teaching Degree",
    "Practical Philosophy and History of Philosophy",
    "Practically Oriented Cultural Philosophy (German-French) M.A.",
    "Process Engineering B.Sc.",
    "Process Engineering M.Sc.",
    "Public Planning and Participation M.Sc.",
    "Real Estate Engineering and Management B.Sc.",
    "Real Estate Engineering and Management M.Sc.",
    "Real Estate Management (REM) M.Sc.",
    "Renewable Energy Engineering B.Sc.",
    "Romance Linguistics (ILG)",
    "Romance Studies B.A.",
    "Romance Studies M.A.",
    "Simulation Technology B.Sc.",
    "Social Sciences (German-French) B.A.",
    "Social Sciences B.A.",
    "Sociology B.A.",
    "Software Engineering B.Sc.",
    "Software Engineering M.Sc.",
    "Sport Science: Sociology and Economics B.A.",
    "Sport Science: Sociology and Economics M.A.",
    "Sport Sciences B.A.",
    "Sustainable Electrical Power Supply M.Sc.",
    "Technical Biology B.Sc.",
    "Technical Biology M.Sc.",
    "Technical Education B.Sc.",
    "Technical Education M.Sc.",
    "Technically Oriented Business Administration B.Sc.",
    "Technology Management B.Sc.",
    "Technology Management M.Sc.",
    "Theoretical and Comparative Linguistics M.A.",
    "Transport Engineering B.Sc.",
    "Vocational Education and Human Resources Development M.A.",
    "Vocational Education/Technical Education B.A.",
    "Water Resources Engineering and Management (WAREM) M.Sc.",
  ];

  let currentDescription = "";

  function showDescription(field: number) {
    currentDescription = descriptions[field];
  }

  function handleInput(event: any, nextFieldId: string) {
    const input = event.target;

    if (input.id === 'field1' || input.id === 'field3') {
      input.value = input.value.replace(/[^a-zA-Z]/g, ''); // Remove non-alphabetic characters
    }

    if (input.id === 'field2' || input.id === 'field5') {
      input.value = input.value.replace(/\D/g, ''); // Remove non-numeric characters
    }

    if (input.id === 'field4') {
      input.value = input.value.replace(/\D/g, ''); // Remove non-numeric characters
      if (Number(input.value) < 1 || Number(input.value) > 12) {
        input.value = '';
      }
    }

    if (input.value.length === input.maxLength) {
      const nextField = document.getElementById(nextFieldId);
      if (nextField) {
        nextField.focus();
      }
    }
  }

  let userType = "";

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    errorMessage = "";

    if (!gender || !age || !userType || (userType === "student" && !studyProgram) || (userType === "PhD student" && !phdStudyProgram) || Object.values(deletionCodeStrings).some(value => value === "")) {
      errorMessage = "Please fill out all fields.";
      return;
    }

    const deletionCode = Object.values(deletionCodeStrings).join("").toUpperCase();
    const finalStudyProgram = userType === "student" ? studyProgram : phdStudyProgram;

    loading = true;
    try {
      const response = await fetch(`${BASE_URL}/adduser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gender, age, studyProgram: finalStudyProgram, deletionCode }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        // Assuming the server returns an ID in the format { id: 'unique-identifier' }
        gamifiedElements.set(data.gamifiedElements);
        userId.set(data.userId);
        if (data.gamifiedElements[0].includes('a')) {
          goto("/avatars");
        } else {
          goto("/questions");
        }
      } else {
        errorMessage = data.message || "An error occurred. Please try again.";
      }
    } catch (error) {
      errorMessage = "An error occurred. Please try again.";
    } finally {
      loading = false;
    }
  };
</script>

<div class="p-6 max-w-4xl mx-auto bg-base-200 rounded-xl shadow-md space-y-4">
  <h1 class="text-2xl font-bold">Personal Data</h1>
  <form on:submit={handleSubmit} class="space-y-4">
    {#if errorMessage}
      <div class="alert alert-error">
        <div class="flex-1">
          <label>{errorMessage}</label>
        </div>
      </div>
    {/if}

    <div class="form-control">
      <label class="label">
        <span class="label-text">Gender</span>
      </label>
      <select bind:value={gender} class="select select-bordered">
        <option value="" disabled selected>Select your gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Age</span>
      </label>
      <input
        type="number"
        bind:value={age}
        class="input input-bordered"
        min="18"
        max="100"
        required
      />
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">User Type</span>
      </label>
      <div class="flex space-x-6 m-2">
        <label class="flex items-center space-x-2">
          <input type="radio" bind:group={userType} value="student" class="radio radio-primary" />
          <span>Student</span>
        </label>
        <label class="flex items-center space-x-2">
          <input type="radio" bind:group={userType} value="PhD student" class="radio radio-primary" />
          <span>PhD Student</span>
        </label>
      </div>
    </div>

    {#if userType === 'student'}
      <div class="form-control">
        <label class="label">
          <span class="label-text">Study Program</span>
        </label>
        <select bind:value={studyProgram} class="select select-bordered">
          <option value="" disabled selected>Select your study program</option>
          {#each studyPrograms as program}
            <option value={program}>{program}</option>
          {/each}
        </select>
      </div>
    {/if}

    {#if userType === 'PhD student'}
      <div class="form-control">
        <label class="label">
          <span class="label-text">Area of research</span>
        </label>
        <input
          type="text"
          bind:value={phdStudyProgram}
          class="input input-bordered"
          maxlength="100"
          autocomplete="off"
        />
      </div>
    {/if}

    <div class="form-control">
      <label class="label">
        <span class="label-text">Deletion code</span>
      </label>
      <div class="join">
        <input
          id="field1"
          type="text"
          name="field1"
          class="input w-20 input-bordered join-item"
          maxlength="1"
          on:focus={() => showDescription(0)}
          on:input={(event) => handleInput(event, 'field2')}
          bind:value={deletionCodeStrings.field1}
          autocomplete="off"
        />
        <input
          id="field2"
          type="text"
          name="field2"
          class="input w-20 input-bordered join-item"
          maxlength="1"
          on:focus={() => showDescription(1)}
          on:input={(event) => handleInput(event, 'field3')}
          bind:value={deletionCodeStrings.field2}
          pattern="[0-9]*"
          autocomplete="off"
        />
        <input
          id="field3"
          type="text"
          name="field3"
          class="input w-20 input-bordered join-item"
          maxlength="1"
          on:focus={() => showDescription(2)}
          on:input={(event) => handleInput(event, 'field4')}
          bind:value={deletionCodeStrings.field3}
          autocomplete="off"
        />
        <input
          id="field4"
          type="text"
          name="field4"
          class="input w-20 input-bordered join-item"
          maxlength="2"
          on:focus={() => showDescription(3)}
          on:input={(event) => handleInput(event, 'field5')}
          bind:value={deletionCodeStrings.field4}
          pattern="[0-9]*"
          autocomplete="off"
        />
        <input
          id="field5"
          type="text"
          name="field5"
          class="input w-20 input-bordered join-item"
          maxlength="1"
          on:focus={() => showDescription(4)}
          on:input={(event) => handleInput(event, '')}
          bind:value={deletionCodeStrings.field5}
          pattern="[0-9]*"
          autocomplete="off"
        />
      </div>
      <div class="description mt-1 text-gray-400 text-s">{currentDescription}</div>
    </div>

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
