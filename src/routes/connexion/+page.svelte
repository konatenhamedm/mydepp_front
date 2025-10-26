<script lang="ts">
  import FooterNew from "$components/_includes/FooterNew.svelte";
  import HeaderNew from "$components/_includes/HeaderNew.svelte";
  import { CookieManager, login } from "$lib/auth";
  import axios from "axios";

  let email = "";
  let password = "";
  let errorMessage = "";
  let isLoading = false;
  let showPassword = false; // Variable pour gérer l'affichage du mot de passe
  let authenticating = false; // Variable pour gérer l'état d'authentification

  // Fonction pour basculer l'affichage du mot de passe
  const togglePasswordVisibility = () => {
    showPassword = !showPassword;
  };

  async function handleSubmit(event: any) {
    event.preventDefault();
    errorMessage = ""; // Reset error message

    console.log("Email:", email);
    console.log("Password:", password);

    if (email && password) {
      isLoading = true;

      try {
        const success = await login(email, password, "front");
        /* alert(JSON.stringify(success)); */

        console.log(success);
        if (success?.token != null) {
          window.location.href = "/dashboard";
        } else {
          errorMessage = "Veuillez vérifier vos identifiants";
          authenticating = false;
          isLoading = false;
          setTimeout(() => {
            errorMessage = ""; // Efface le message après 3 secondes
          }, 3000);
        }
        authenticating = false;
      } catch (error) {
        isLoading = false;
        authenticating = false;
        errorMessage = "Une erreur est survenue";
      }
    } else {
      errorMessage = "Veuillez remplir tous les champs.";
    }
  }
</script>

<main class="flex flex-col min-h-screen">
  <HeaderNew />

  <!-- Container avec image de fond -->
  <div
    class="flex-1 bg-[url('/bg5.jpg')] bg-cover bg-center bg-no-repeat min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <!-- Overlay pour assombrir légèrement le fond -->
    <div class="absolute inset-0 bg-black/30"></div>

    <!-- Contenu centré -->
    <div class="relative z-10 max-w-md w-full">
      <!-- En-tête -->
      <div class="text-center mb-8">
        <div
          class="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-2xl"
        >
          <i class="ri-login-box-line text-white text-4xl"></i>
        </div>
        <h2 class="text-4xl font-bold text-white mb-2 drop-shadow-lg">
          Connexion
        </h2>
        <p class="text-white text-lg drop-shadow-md">
          Accédez à votre espace E-DEPPS
        </p>
      </div>

      <!-- Formulaire -->
      <div
        class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20"
      >
        {#if errorMessage}
          <div
            class="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3"
          >
            <i class="ri-error-warning-line text-red-500 text-xl mt-0.5"></i>
            <div>
              <p class="text-red-800 font-medium">{errorMessage}</p>
            </div>
          </div>
        {/if}

        <form class="space-y-6" on:submit={handleSubmit}>
          <!-- Champ Email -->
          <div>
            <label
              for="email"
              class="block text-sm font-semibold text-gray-700 mb-2"
            >
              Adresse email <span class="text-red-500">*</span>
            </label>
            <div class="relative items-center grid grid-cols-1">
              <div
                class="absolute left-4  transform  pointer-events-none"
              >
                <i class="ri-mail-line text-gray-400 text-lg"></i>
              </div>
              <input
                type="email"
                id="email"
                required
                bind:value={email}
                class="w-full px-[40px] py-3.5 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900 placeholder-gray-400 bg-white"
                placeholder="Votre.email@exemple.com"
                name="email"
              />
            </div>
          </div>

          <!-- Champ Mot de passe -->
          <div>
            <label
              for="password"
              class="block text-sm font-semibold text-gray-700 mb-2"
            >
              Mot de passe <span class="text-red-500">*</span>
            </label>
            <div class="relative items-center grid grid-cols-1">
              <div
                class="absolute left-4  mr-4 transform  pointer-events-none"
              >
                <i class="ri-lock-line text-gray-400 text-lg"></i>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                bind:value={password}
                class="w-full px-[40px] py-3.5 pl-12 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900 placeholder-gray-400 bg-white"
                placeholder="Votre mot de passe"
                name="password"
              />
              <button
                type="button"
                on:click={togglePasswordVisibility}
                class="absolute right-4  transform  text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                aria-label={showPassword
                  ? "Masquer le mot de passe"
                  : "Afficher le mot de passe"}
              >
                <i
                  class="{showPassword
                    ? 'ri-eye-off-line'
                    : 'ri-eye-line'} text-lg"
                ></i>
              </button>
            </div>
          </div>

          <!-- Mot de passe oublié -->
          <div class="flex items-center justify-end">
            <a
              href="/connexion/forgot_password"
              class="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Mot de passe oublié ?
            </a>
          </div>

          <!-- Bouton de soumission -->
          <button
            type="submit"
            disabled={!email || !password || isLoading}
            class="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            {#if isLoading}
              <i class="ri-loader-4-line text-xl animate-spin"></i>
              <span>Connexion en cours...</span>
            {:else}
              <span>Se connecter</span>
              <i class="ri-arrow-right-line text-xl"></i>
            {/if}
          </button>
        </form>

        <!-- Lien d'inscription (commenté comme dans ton code) -->
        <!-- <div class="mt-6 text-center pt-6 border-t border-gray-200">
          <p class="text-gray-600">
            Pas encore de compte ?
            <a
              href="/inscription"
              class="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Créer un compte
            </a>
          </p>
        </div> -->
      </div>

      <!-- Info supplémentaire -->
      <p class="mt-6 text-center text-sm text-white drop-shadow-md">
        En vous connectant, vous acceptez nos
        <a
          href="#"
          class="text-blue-200 hover:text-white hover:underline font-medium"
          >conditions d'utilisation</a
        >
      </p>
    </div>
  </div>

  <FooterNew />
</main>

<style>
  @import url("https://cdn.jsdelivr.net/npm/remixicon@4.6.0/fonts/remixicon.css");

  /* S'assurer que le main prend toute la hauteur */
  main {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Container avec image de fond */
  main > div:first-of-type {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Overlay pour le fond */
  main > div:first-of-type > div:first-child {
    position: absolute;
    inset: 0;
  }

  /* Animation pour le spinner */
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  /* Style personnalisé pour les inputs */
  input:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  /* Animation du bouton */
  button[type="submit"]:not(:disabled):active {
    transform: translateY(0) scale(0.98);
  }

  /* Drop shadow pour meilleure lisibilité sur fond */
  .drop-shadow-lg {
    filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.3));
  }

  .drop-shadow-md {
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
  }

  /* Backdrop blur pour le formulaire */
  .backdrop-blur-sm {
    backdrop-filter: blur(8px);
  }
</style>
