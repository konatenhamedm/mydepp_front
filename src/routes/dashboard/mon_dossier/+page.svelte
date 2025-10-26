<script lang="ts">
  import FooterNew from "$components/_includes/FooterNew.svelte";
  import HeaderNew from "$components/_includes/HeaderNew.svelte";
  import { fade } from "svelte/transition";
  import { getAuthCookie } from "$lib/auth";
  import { onMount } from "svelte";
  import { BASE_URL_API, BASE_URL_API_UPLOAD } from "$lib/api";



  let user = getAuthCookie();
  let userData: any = {};
  let nbDocumentSoumis = 0;
  let Documents: any[] = [];
  let professionnelData: any = {
    nom: "",
    prenoms: "",
    number: "",
    emailPro: "",

  };
  let etablissementData: any = {
    adresse: "",
    nomRepresentant: "",
    denomination: "",
  };


    const handleSubmit = async  (event) => {
    if (userData.typeUser === "ETABLISSEMENT") {
     await fetch(
        BASE_URL_API + "/etablissement/update/" + user?.personneId,
        {
          method: "POST",
          body: JSON.stringify(etablissementData),
        }
      )
        .then((response) => response.json())
        .then((result) => {
          console.log("Etablissement profile updated:", result);
        });
    } else {
      await fetch(
        BASE_URL_API + "/professionnel/update/" + user?.personneId,
        {
          method: "POST",
          body: JSON.stringify(professionnelData),
        }
      )
        .then((response) => response.json())
        .then((result) => {
          console.log("Professionnel profile updated:", result);
        });
    }
  };


  async function getUserInfo() {
    await fetch(
      BASE_URL_API +
        (user?.type === "ETABLISSEMENT"
          ? "/etablissement/get/one/"
          : "/professionnel/get/one/") +
        user?.personneId
    )
      .then((response) => response.json())
      .then((result) => {
        userData = result.data;
        if (user?.type === "ETABLISSEMENT") {
          etablissementData = userData?.personne;
        } else {
          professionnelData = userData?.personne;
        }
        nbDocumentSoumis = userData?.personne?.documents?.length;
        Documents = userData?.personne?.documents || [];
      });
  }

  onMount(async () => {
    user = await getAuthCookie();
    console.log("User dans mon dossier:", user);
    await getUserInfo();
    document.title = "Mon dossier - MyDepp";
  });
  let activeTab = "profil";
</script>

<main
  class="font-[var(--font-geist-sans)] bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen flex flex-col"
>
  <HeaderNew />

  <div
    class="bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-b border-blue-100 shadow-sm mt-4 pt-12"
  >
    <div
      class="max-w-screen-2xl mx-auto px-6 pt-8 lg:px-10 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
    >
      <div class="flex items-start md:items-center gap-4">
        <a
          class="text-blue-600 hover:text-blue-800 transition-colors mt-1"
          href="/dashboard"
        >
          <div
            class="p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition-transform hover:scale-105"
          >
            <i class="ri-arrow-left-line text-lg"></i>
          </div>
        </a>

        <div>
          <h1
            class="text-2xl md:text-3xl font-bold text-gray-900 leading-tight"
          >
            Mise à jour du dossier
          </h1>
          <p class="text-gray-600 text-sm md:text-base">
            Gérez votre profil et vos documents
          </p>
        </div>
      </div>

      <!-- <div class="flex items-center gap-3">
        <span class="px-4 py-1.5 bg-red-100 text-red-800 rounded-full text-sm font-medium border border-red-200 shadow-sm">
          <i class="ri-error-warning-line mr-1"></i> 1 document manquant
        </span>
        <button
          class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-200 hover:-translate-y-0.5"
        >
          <i class="ri-refresh-line mr-1"></i> Rafraîchir
        </button>
      </div> -->
    </div>
  </div>

  <div class="flex-1 w-full mt-1">
    <div class="max-w-screen-2xl mx-auto px-6 lg:px-10 py-10">
      <div
        class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-visible"
      >
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
            <span
              class="ml-2 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs"
              >{nbDocumentSoumis}</span
            >
          </button>
        </nav>

        <!-- Contenu dynamique -->
        <div class="p-8" transition:fade>
          {#if activeTab === "profil"}
            <form class="space-y-6" on:submit|preventDefault={handleSubmit}>
              {#if userData.typeUser === "ETABLISSEMENT"}
                <div class="grid grid-cols-2 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-lg font-medium text-gray-700 mb-2"
                      >Email</label
                    >
                    <input
                      type="text"
                      disabled
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                      value={userData?.email}
                    />
                  </div>

                  <!-- <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                  <input
                    type="text"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={userData?.personne?.adresse}
                  />
                </div> -->

                  <div class="md:col-span-1">
                    <label class="block text-lg font-medium text-gray-700 mb-2"
                      >Adresse</label
                    >
                    <input
                      type="text"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={etablissementData.adresse}
                    />
                  </div>

                  <div>
                    <label class="block text-lg font-medium text-gray-700 mb-2"
                      >Nom du representant</label
                    >
                    <input
                      type="text"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={etablissementData.nomRepresentant}
                    />
                  </div>

                  <div>
                    <label class="block text-lg font-medium text-gray-700 mb-2"
                      >Denomination</label
                    >
                    <input
                      type="text"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={etablissementData.denomination}
                    />
                  </div>
                </div>
              {:else}
                <div class="grid grid-cols-2 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Nom</label
                    >
                    <input
                      type="text"
                      bind:value={professionnelData.nom}
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Prénoms</label
                    >
                    <input
                      type="text"
                      bind:value={professionnelData.prenoms}
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Numéro</label
                    >
                    <input
                      type="text"
                      bind:value={professionnelData.number}
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Email</label
                    >
                    <input
                      type="text"
                      disabled
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={userData?.personne?.email}
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Email professionnel</label
                    >
                    <input
                      type="text"
                      bind:value={professionnelData.emailPro}
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Appartenance à une organisation</label
                    >
                    <input
                      type="tel"
                      disabled
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={userData?.personne?.appartenirOrganisation}
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Appartenance à un ordre</label
                    >
                    <input
                      type="text"
                      disabled
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={userData?.personne?.appartenirOrdre}
                    />
                  </div>

                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Situation Professionnelle</label
                    >
                    <input
                      type="text"
                      disabled
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={userData?.personne?.situationPro.libelle}
                    />
                  </div>
                </div>
              {/if}
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
                  style="background-color: #2563eb;"
                >
                  Sauvegarder les modifications
                </button>
              </div>
            </form>
          {:else if Documents.length > 0}
            <ul class="space-y-4">
              {#each Documents as document}
                <li
                  class="flex items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div class="flex items-center gap-4">
                    <i class="ri-file-line text-3xl text-blue-500"></i>
                    <div>
                      <p class="font-medium text-gray-900">
                        {document.libelle}
                      </p>
                      <a
                        class="text-lg"
                        style="background-color:#2563eb; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; margin-top: 0.5rem; display: inline-block;"
                        href={document.path
                          ? BASE_URL_API_UPLOAD + document.path
                          : "#"}>Voir Document</a
                      >
                    </div>
                  </div>
                </li>
              {/each}
            </ul>
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
