
<script>
    export let step;
    export let paiementStatus;
    export let isPaiementDone;
    export let formData;
    export let reference;
    export let openModal;
    export let messagefile;
  </script>
  
  {#if step === 6}
    <h2 class="h2-baslik-anasayfa-ozel h-yazi-margin-kucuk">
      {#if !paiementStatus}
        VEUILLEZ VALIDER POUR FINALISER VOTRE INSCRIPTION
      {:else if isPaiementDone == false}
        VEUILLEZ PROCéDER AU PAIEMENT
      {:else if isPaiementDone == true}
        INFORMATIONS SUR LE PAIEMENT
      {/if}
    </h2>
  
    <div class="tablo">
      <div class="tablo--1h-ve-2">
        <div class="grid grid-cols-1 gap-6 justify-centeru">
          <div>
            {#if !paiementStatus || formData.code !== ""}
              <p>
                Vous pouvez soumettre le formulaire afin de finaliser votre inscription.
              </p>
              <br />
            {:else if isPaiementDone == false}
              <p>
                Veillez vous rendre sur le site de votre banque et effectuer le paiement.
              </p>
              <br />
            {:else if isPaiementDone == true}
              <p>
                Votre inscription a été effectuée avec succès, vous pouvez imprimer le reçu de paiement 
                <a
                  href="javascript:void(0);"
                  class="text-blue-500"
                  on:click={() => openModal(reference)}
                >
                  ICI
                </a>.
              </p>
              <br />
              <p>
                Veillez vous connecter avec vos identifiants en cliquant sur le bouton ci-dessous.
              </p>
              <br />
            {/if}
  
            {#if messagefile != ""}
              <div role="alert">
                <div class="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                  Erreur s'est produite
                </div>
                <div class="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                  <p>{messagefile}</p>
                </div>
              </div>
            {/if}
          </div>
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
