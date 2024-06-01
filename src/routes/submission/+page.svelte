<script lang="ts">
    import { onMount } from 'svelte';
    import { pretestAnswers, questions, posttestAnswers } from '../../store';
    import { get } from 'svelte/store';
    import { goto } from '@sveltejs/kit';
  
    let loading = false;
    let apiResponse: string;
  
    onMount(async () => {
      const pretest = get(pretestAnswers);
      const questionList = get(questions);
      const posttest = get(posttestAnswers);
  
      try {
        const response = await fetch('https://api.example.com/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pretestAnswers: pretest,
            questions: questionList,
            posttestAnswers: posttest,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
        apiResponse = data.nextPage;
      } catch (error) {
        console.error('Error uploading data:', error);
        apiResponse = '/error';
      }
    });
  
    const finishSurvey = async () => {
        if(apiResponse == "finished"){

        }
      loading = true;
  
      // Here you could re-upload or perform other operations if needed
  
      loading = false;
      goto(apiResponse);
    };
  </script>
  
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
  
  <div>
    <h1>Umfrage des Studienteils</h1>
    <p>Vielen Dank, dass Sie an unserer Umfrage teilgenommen haben!</p>
    <button class="button {loading ? 'loading' : ''}" on:click={finishSurvey} disabled={loading}>
      {loading ? 'Wird geladen...' : 'Umfrage beenden'}
    </button>
  </div>
  