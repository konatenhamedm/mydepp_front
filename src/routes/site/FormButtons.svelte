
<script>
    import Spinner from "$components/_skeletons/Spinner.svelte";

    export let step;
    export let prevStep;
    export let nextStep;
    export let clickValidation;
    export let clickPaiement;
    export let connexion;
    export let authenticating;
    export let isPaiementDone;
    export let paiementStatus;
    export let formData;
    export let message;
  </script>
  
  <div class="form__group">
    {#if step > 1}
      <button
        hidden={isPaiementDone == true}
        disabled={authenticating == true || isPaiementDone == true}
        type="button"
        class="buton buton--kirmizi"
        on:click={prevStep}
      >
        ← RETOUR
      </button>
    {/if}
  
    {#if step <= 5}
      <button
        type="button"
        class="buton buton--kirmizi"
        on:click={nextStep}
      >
        SUIVANT →
      </button>
    {:else}
      {#if formData.code !== ""}
        <button
          type="button"
          on:click={clickValidation}
          class="buton buton--kirmizi bg-green-500"
        >
          {#if authenticating}
            <div class="grid grid-cols-2">
              <div><Spinner /></div>
              <div>Valider</div>
            </div>
          {:else}
            Valider
          {/if}
        </button>
      {/if}
  
      {#if formData.code === "" && isPaiementDone == false && paiementStatus == true}
        <button
          type="button"
          on:click={clickPaiement}
          class="buton buton--kirmizi bg-green-500"
        >
          {#if authenticating}
            <div class="grid grid-cols-2">
              <div><Spinner /></div>
              <div>Effectuer le paiement</div>
            </div>
          {:else}
            Effectuer le paiement
          {/if}
        </button>
      {/if}
  
      {#if formData.code === "" && isPaiementDone == false && paiementStatus == false}
        <button
          type="button"
          on:click={clickValidation}
          class="buton buton--kirmizi bg-green-500"
        >
          {#if authenticating}
            <div class="grid grid-cols-2">
              <div><Spinner /></div>
              <div>Valider</div>
            </div>
          {:else}
            Valider
          {/if}
        </button>
      {/if}
  
      {#if isPaiementDone == true && paiementStatus == true}
        <button
          type="button"
          on:click={connexion}
          class="buton buton--kirmizi bg-green-500"
        >
          Connectez vous
        </button>
      {/if}
    {/if}
  
    <br /><br />
  
    {#if message !== ""}
      <div
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong class="font-bold">Oups erreur!</strong>
        <span class="block sm:inline">{message}</span>
      </div>
    {/if}
  </div>
  