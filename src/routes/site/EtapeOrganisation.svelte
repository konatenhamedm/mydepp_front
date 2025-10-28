<script lang="ts">
  export let step;
  export let formData: any;
  export let updateField: (field: string, value: any) => void;
  export let errors;
  function saveFormStateComponent() {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      localStorage.setItem("formData", JSON.stringify(formData));
      /*  localStorage.setItem("step", step.toString()); */
    }
  }
</script>

{#if step === 5}
  <h2 class="h2-baslik-anasayfa-ozel h-yazi-margin-kucuk">
    Informations organisationnelles (étape 5/6)
  </h2>
  <div class="tablo">
    <div class="tablo--1h-ve-2">
      <div
        class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6"
      >
        <!-- Question oui/non -->
        <div class="form__group mb-4">
          <label class="form_label mb-4" for="organisation">
            Appartenez-vous à une organisation ?
          </label>
          <div class="flex items-center space-x-4">
            {#each ["oui", "non"] as organisation}
              <div class="flex items-center space-x-2">
                <input
                  type="radio"
                  class="cursor-pointer"
                  name="rd_profession"
                  value={organisation}
                  id={organisation}
                  checked={organisation == formData.appartenirOrganisation}
                  on:input={saveFormStateComponent}
                  on:input={(e: any) =>
                    updateField("appartenirOrganisation", e.target.value)}
                  on:change={() =>
                    (formData.appartenirOrganisation = organisation)}
                />
                <label for={organisation} class="cursor-pointer uppercase">
                  {organisation}
                </label>
              </div>
            {/each}
          </div>
        </div>

        <!-- Si oui, nom de l'organisation -->
        {#if formData.appartenirOrganisation == "oui"}
          <div class="form__group">
            <label class="form_label">Nom de l'organisation *</label>
            <input
              type="text"
              class="form__input"
              placeholder="Nom de l'organisation"
              bind:value={formData.organisationNom}
              on:input={saveFormStateComponent}
            />
            {#if errors.organisationNom}
              <p class="error">{errors.organisationNom}</p>
            {/if}
          </div>
        {/if}

        <br>


        <div class="form__group mb-4">
          <label class="form_label mb-4" for="organisation">
            Appartenez-vous à un ordre ?
          </label>
          <div class="flex items-center space-x-4">
            {#each ["oui", "non"] as ordre}
              <div class="flex items-center space-x-2">
                <input
                  type="radio"
                  class="cursor-pointer"
                  name="vd_ordre"
                  value={ordre}
                  id={ordre}
                  checked={ordre == formData.appartenirOrdre}
                  on:input={saveFormStateComponent}
                  on:input={(e: any) =>
                    updateField("appartenirOrdre", e.target.value)}
                  on:change={() =>
                    (formData.appartenirOrdre = ordre)}
                />
                <label for={ordre} class="cursor-pointer uppercase">
                  {ordre}
                </label>
              </div>
            {/each}
          </div>
        </div>

        <!-- Si oui, nom de l'organisation -->
        {#if formData.appartenirOrdre == "oui"}
          <div class="form__group">
            <label class="form_label">Numéro d'inscription *</label>
            <input
              type="text"
              class="form__input"
              placeholder="Numéro d'inscription"
              bind:value={formData.numeroInscription}
              on:input={saveFormStateComponent}
            />
            {#if errors.numeroInscription}
              <p class="error">{errors.numeroInscription}</p>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  /*  .iletisim-form-alani {
      padding: 10rem 261px 10rem !important;
      
  } */

  .iletisim-form-alani {
    padding: 4rem 235px 5rem !important;
    margin-top: -20vh !important;
    background-color: #fff;
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .footerss p {
    display: flex;
    flex-wrap: wrap;
    justify-content: start !important;
    align-items: start !important;
  }
  h2.h2-baslik-footer.h-yazi-margin-kucuk,
  .footer__list,
  .footer__sosyal {
    display: flex;
    flex-wrap: wrap;
    justify-content: start !important;
    align-items: start !important;
  }
  .form {
    max-width: 100%;
    margin: auto;
  }
  .tablo {
    display: flex;
    flex-direction: column;
  }
  .row {
    display: flex;
    gap: 1px; /* Espacement entre les champs */
    flex-wrap: wrap;
  }

  .form__group {
    flex: 1; /* Permet aux champs de prendre la même largeur */
    min-width: 250px; /* Empêche les champs d'être trop petits */
  }
  h3 {
    font-size: 1.5em;
    margin-bottom: 15px;
    color: #333;
  }

  .error {
    color: red;
    font-size: 14px;
    margin-top: 5px;
  }

  .bouncingImage {
    cursor: pointer;
  }

  .bouncingImage:hover {
    scale: 1.1;
    duration: 2;
  }

  button.ml-2.s-98Y-TDGwojhe {
    position: relative !important;
    right: 70px !important;
  }

  svg.feather.feather-eye.s-98Y-TDGwojhe {
    position: relative !important;
    right: 50px !important;
    color: gray !important;
  }

  .download-link {
    margin-left: 10px;
    color: blue;
    text-decoration: underline;
    cursor: pointer;
  }
</style>
