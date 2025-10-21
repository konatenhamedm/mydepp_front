<script lang="ts">
  import Spinner from '../../../components/_skeletons/Spinner.svelte';
  import MetaTag from '$lib/utils/MetaTag.svelte';
  import {login, motPasseOublie} from '$lib/auth';
  import { apiFetch } from '$lib/api';
    import Notification from "$components/_includes/Notification.svelte";

    let showNotification = false;
    let notificationMessage = "";
    let notificationType = "info";
  let email = '';
  let newPassword = '';
  let message = '';
  let authenticating = false;
  let showPassword = false;
  let passwordWarning = '';
  let isPasswordValid = false;

  $: {
    if (newPassword.length > 0 && newPassword.length < 8) {
      passwordWarning = 'Le mot de passe doit comporter au moins 8 caractères.';
      isPasswordValid = false;
    } else {
      passwordWarning = '';
      isPasswordValid = true;
    }
  }
async function handleSubmit(event: any) {

        authenticating = true;
      event.preventDefault();
      try {
        await apiFetch(true, "/resetpassword/reset/email/admin", "POST", {email: email}).then((res) => {
        if (res) {
            authenticating = false;
            if (res.code == 200) {
              notificationMessage = "Un email a été envoyé à votre adresse";
              notificationType = "success";
              showNotification = true;
                setTimeout(() => {
                    window.location.href = "/login";
                }, 3000);
             
            } else {
              message = res.message;
              notificationMessage = res.message;
              notificationType = "error";
              showNotification = true;
            }
        }
      });
      
        authenticating = false;
      } catch (error) {
        authenticating = false;
        message = "Une erreur est survenue";
      }


     
    }
  const path = '/login/mot_passe_oublie';
  const description = 'Mot de passe oublié lebedoo';
  const title = 'Admin | mot de passe oublié';
  const subtitle = 'Mot de passe oublié';
</script>

<MetaTag {path} {description} {title} {subtitle} />

<div
  class="flex justify-center items-center min-h-screen bg-gray-100 px-4 bg-[url('/bg5.jpg')] bg-top bg-no-repeat bg-full"
>
  <div class="w-full max-w-md">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-center mb-6">
        <img
          src="/_files/logo-depps.png"
          alt="Logo"
          class="h-20"
          width="150"
          height="850"
        />
      </div>
      <h2 class="text-xl font-semibold text-gray-800 mb-4 mt-3">
        Mot de passe oublié ?
      </h2>
      <p class="text-gray-600 text-sm mb-6">
        Entrez l’adresse email associée à votre compte. Nous vous enverrons un
        lien pour réinitialiser votre mot de passe.
      </p>

      <form on:submit={handleSubmit}>
        <div class="mb-4">
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Adresse email</label
          >
          <input
            id="email"
            type="email"
            bind:value={email}
            placeholder="email@exemple.com"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
          />
        </div>

        <!-- <div class="mb-4">
          <label
            for="newPassword"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Nouveau mot de passe</label
          >
          <div class="relative">
            <input
              id="newPassword"
              type={showPassword ? 'text' : 'password'}
              bind:value={newPassword}
              placeholder="Entrez votre nouveau mot de passe"
              required
              class="w-full px-3 py-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-2 flex items-center text-gray-600"
              on:click={() => (showPassword = !showPassword)}
              tabindex="-1"
            >
              {#if showPassword}
                👁️‍🗨️
              {:else}
                👁️
              {/if}
            </button>
          </div>
          {#if passwordWarning}
            <p class="text-xs text-red-500 mt-1">{passwordWarning}</p>
          {/if}
        </div> -->

        {#if message && !authenticating}
          <div class="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {message}
          </div>
        {/if}

        <button
          type="submit"
          class="w-full flex justify-center items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 px-4 rounded disabled:opacity-50"
          disabled={!isPasswordValid || authenticating}
          style="background-color: #54a0fe !important;"
        >
          {#if authenticating}
            <Spinner size_height="18px" />
            <span>Soumission...</span>
          {:else}
            Soumettre
          {/if}
        </button>

        <div class="mt-4 text-center">
          <a href="/login" class="text-sm text-sky-500 hover:underline"
            >Retour à la connexion</a
          >
        </div>
      </form>
    </div>
  </div>
</div>
  <style>
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    </style>
    
    {#if showNotification}
      <Notification message={notificationMessage} type={notificationType} duration={5000} />
    {/if}
    