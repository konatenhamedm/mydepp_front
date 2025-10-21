<script lang="ts">
  import FooterNew from "$components/_includes/FooterNew.svelte";
  import HeaderNew from "$components/_includes/HeaderNew.svelte";
  import { fade } from "svelte/transition";

  let activeTab = "profil";
</script>

<main class="font-[var(--font-geist-sans)] bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen flex flex-col">

  <HeaderNew />

  <div class="bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-b border-blue-100 shadow-sm mt-4 pt-12">
    <div class="max-w-screen-2xl mx-auto px-6 pt-8 lg:px-10 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
 
      <div class="flex items-start md:items-center gap-4">
        <a class="text-blue-600 hover:text-blue-800 transition-colors mt-1" href="/dashboard">
          <div class="p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition-transform hover:scale-105">
            <i class="ri-arrow-left-line text-lg"></i>
          </div>
        </a>

        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            Mise à jour du dossier
          </h1>
          <p class="text-gray-600 text-sm md:text-base">
            Gérez votre profil et vos documents
          </p>
        </div>
      </div>


      <div class="flex items-center gap-3">
        <span class="px-4 py-1.5 bg-red-100 text-red-800 rounded-full text-sm font-medium border border-red-200 shadow-sm">
          <i class="ri-error-warning-line mr-1"></i> 1 document manquant
        </span>
        <button
          class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-200 hover:-translate-y-0.5"
        >
          <i class="ri-refresh-line mr-1"></i> Rafraîchir
        </button>
      </div>
    </div>
  </div>


  <div class="flex-1 w-full mt-1">
    <div class="max-w-screen-2xl mx-auto px-6 lg:px-10 py-10">
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-visible">
 
        <nav class="flex flex-wrap gap-6 border-b border-gray-200 px-6">
          <button
            class="relative py-4 text-sm font-medium transition-all duration-300 border-b-2"
            class:!border-blue-600={activeTab === "profil"}
            class:!text-blue-600={activeTab === "profil"}
            class:border-transparent={activeTab !== "profil"}
            class:text-gray-500={activeTab !== "profil"}
            on:click={() => (activeTab = "profil")}
          >
            <i class="ri-user-line mr-2"></i> Informations du profil
          </button>

          <button
            class="relative py-4 text-sm font-medium transition-all duration-300 border-b-2"
            class:!border-blue-600={activeTab === "documents"}
            class:!text-blue-600={activeTab === "documents"}
            class:border-transparent={activeTab !== "documents"}
            class:text-gray-500={activeTab !== "documents"}
            on:click={() => (activeTab = "documents")}
          >
            <i class="ri-file-list-line mr-2"></i> Documents soumis
            <span class="ml-2 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">1</span>
          </button>
        </nav>

        <!-- Contenu dynamique -->
        <div class="p-8" transition:fade>
          {#if activeTab === "profil"}
            <form class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nom de l'établissement</label>
                  <input
                    type="text"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value="Clinique de la Santé"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">SIRET</label>
                  <input
                    type="text"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value="12345678901234"
                  />
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                  <input
                    type="text"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value="123 Avenue de la Santé"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                  <input
                    type="text"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value="Toulouse"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Code postal</label>
                  <input
                    type="text"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value="31000"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value="05 61 00 00 00"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value="contact@clinique-sante.fr"
                  />
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Directeur / Responsable</label>
                  <input
                    type="text"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value="Dr. Martin Dubois"
                  />
                </div>
              </div>

              <div class="flex justify-end space-x-4 pt-6">
                <a
                  class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
                  href="/dashboard"
                >
                  Annuler
                </a>
                <button
                  type="submit"
                  class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-[1.02]"
                >
                  Sauvegarder les modifications
                </button>
              </div>
            </form>
          {:else}
            <div class="text-center py-16 text-gray-500">
              <i class="ri-folder-2-line text-6xl text-gray-400 mb-4"></i>
              <p class="text-lg">Aucun document ajouté pour le moment.</p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>


  <FooterNew />
</main>

<style>
  button {
    outline: none;
  }
  button:focus-visible {
    outline: 2px solid rgb(59 130 246);
    outline-offset: 2px;
  }
</style>