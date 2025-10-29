<script lang="ts">
  import Notification from "$components/_includes/Notification.svelte";
  import Spinner from "$components/_skeletons/Spinner.svelte";
  import { login } from "$lib/auth";

  let showNotification = false;
  let notificationMessage = "";
  let notificationType = "info";

  let username = "admin";
  let password = "@DM1N";
  $: authenticating = false;
  let showPassword = false; // To toggle password visibility
  $: message = "";
  let error = "";

  let passwordWarning = "";
  let isPasswordValid = false;

  async function handleSubmit(event: any) {
    authenticating = true;
    event.preventDefault();
    try {
      const success = await login(username, password, "backoffice");
      /* alert(JSON.stringify(success)); */

      console.log(success);
      if (success?.token != null) {
        window.location.href = "/admin";
      } else {
        message = "Veuillez vérifier vos identifiants";
        authenticating = false;
        setTimeout(() => {
          message = ""; // Efface le message après 3 secondes
        }, 3000);
      }
      authenticating = false;
    } catch (error) {
      authenticating = false;
      message = "Une erreur est survenue";
    }
  }
</script>

<!-- style="background-color: #4075d7;"  -->
<div
  class="flex justify-center items-center min-h-screen bg-gray-100 px-4 bg-[url('/bg5.jpg')] bg-top bg-no-repeat bg-full bg-cover bg-center bg-no-repeat min-h-screen flex items-center justify-center"
>
  <div class="w-full max-w-md">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-center mb-3">
        <img
          src="/_files/logo-depps.png"
          alt="Logo"
          class="h-20"
          width="150"
          height="820"
        />
      </div>
      <h2 class="text-2xl font-semibold text-gray-800 mb-4 mt-3 text-center">
        Veillez vous connecter ici
      </h2>
      <!-- 	<p class="text-gray-600 text-sm mb-6">
				Entrez l’adresse email associée à votre compte. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
			</p> -->

      <form on:submit|preventDefault={handleSubmit}>
        <div class="mb-4">
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 mb-1">Username</label
          >
          <input
            id="email"
            type="text"
            bind:value={username}
            placeholder="email@exemple.com"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
          />
        </div>

        <div class="mb-4">
          <label
            for="newPassword"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Mot de passe</label
          >
          <div class="relative">
            <input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              bind:value={password}
              placeholder="Entrez votre  mot de passe"
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
        </div>
        <div
          class="mt-[23px] mb-[19px] flex items-center justify-center gap-[15px] max-sm:flex-wrap sm:justify-between"
        >
          <div class="flex"></div>
          <a
            class=" hover:text-dark dark:hover:text-title-dark text-blue-200 font-medium"
            href="/connexion/forgot_password">Mot de passe oublié?</a
          >
        </div>

        {#if message && !authenticating}
          <div class="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {message}
          </div>
        {/if}

        <button
          type="submit"
          class="w-full flex justify-center items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 px-4 rounded disabled:opacity-50"
          disabled={authenticating}
          style="background-color: #54a0fe !important;"
        >
          {#if authenticating}
            <Spinner size_height="18px" />
            <span>Connection...</span>
          {:else}
            Se connecter
          {/if}
        </button>
      </form>
    </div>
  </div>
</div>
