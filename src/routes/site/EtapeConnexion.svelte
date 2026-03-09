
<script lang="ts">
    export let formData:any;
    export let errors;
    export let emailError;
    export let emailPassword;
    export let saveFormState;
    export let showPassword;
    export let showPasswordConfirm;
    export let togglePassword;
    export let totalstep = 6;
    export let toggleConfirmPassword;

    function saveFormStateComponent() {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      localStorage.setItem("formData", JSON.stringify(formData));
     /*  localStorage.setItem("step", step.toString()); */
    }
  }
  
  </script>
  
  <h2 class="text-3xl h2-baslik-anasayfa-ozel font-semibold mb-4 text-center md:text-left">
    Informations de connexion (étape 1/{totalstep})
  </h2>
  <br /><br />
  
  <div class="w-full mb-4" style="width:100%">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Email -->
      <div class="flex flex-col form__group">
        <label for="email" class="text-3xl font-medium mb-1">E-mail *</label>
        <input
          id="email"
          required
          type="email"
          class="form__input w-full"
          bind:value={formData.email}
          placeholder="E-mail"
          on:input={(e) => {
            saveFormStateComponent();
            
          }}
        />
        {#if emailError}
          <p class="text-red-500 text-sm">{emailError}</p>
        {/if}
       
      </div>
  
      <!-- Mot de passe -->
      <div class="flex flex-col form__group relative">
        <label for="password" class="text-3xl font-medium mb-1">Mot de passe *</label>
        <div class="flex items-center">
          <input
            id="password" style="width:100%"
            type={showPassword ? "text" : "password"}
            class="form__input w-full px-3 pr-10"
            bind:value={formData.password}
            placeholder="Mot de passe"
            on:input={(e) => {
              saveFormState();
              
            }}
          />
          <button
            type="button"
            class="absolute right-3 text-black"
            on:click={togglePassword}
          >
            {#if showPassword}
              <!-- eye-off icon -->
              <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="feather feather-eye-off"
                          ><path
                            d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                          ></path><line x1="1" y1="1" x2="23" y2="23"
                          ></line></svg
                        >
            {:else}
              <!-- eye icon -->
              <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-eye"
              ><path
                d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
              ></path><circle cx="12" cy="12" r="3"></circle></svg
            >
            {/if}
          </button>
        </div>
        {#if errors.password}
          <p class="text-red-500 text-sm">{errors.password}</p>
        {/if}
        {#if emailPassword}
        <p class="text-red-500 text-sm">{emailPassword}</p>
      {/if}
      </div>
  
      <!-- Confirmation mot de passe -->
      <div class="flex flex-col form__group relative">
        <label for="confirm-password" class="text-3xl font-medium mb-1">Confirmer le mot de passe *</label>
        <div class="flex items-center">
          <input
            id="confirm-password" style="width:100%"
            type={showPasswordConfirm ? "text" : "password"}
            class="form__input w-full px-3 pr-10"
            bind:value={formData.confirmPassword}
            placeholder="Mot de passe"
            on:input={(e) => {
              saveFormState();
             
            }}
          />
          <button
            type="button"
            class="absolute right-3 text-black"
            on:click={toggleConfirmPassword}
          >
            {#if showPasswordConfirm}
            <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-eye-off"
            ><path
              d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
            ></path><line x1="1" y1="1" x2="23" y2="23"
            ></line></svg
          >
            {:else}
            <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-eye"
            ><path
              d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
            ></path><circle cx="12" cy="12" r="3"></circle></svg
          >
            {/if}
          </button>
        </div>
        {#if errors.confirmPassword}
          <p class="text-red-500 text-sm">{errors.confirmPassword}</p>
        {/if}
      </div>
    </div>
  </div>
  <style>
  
  
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