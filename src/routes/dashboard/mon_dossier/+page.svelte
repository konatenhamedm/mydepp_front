<script lang="ts">
  import FooterNew from "$components/_includes/FooterNew.svelte";
  import HeaderNew from "$components/_includes/HeaderNew.svelte";
  import { fade } from "svelte/transition";
  import { getAuthCookie } from "$lib/auth";
  import { onMount } from "svelte";
  import { BASE_URL_API, BASE_URL_API_UPLOAD } from "$lib/api";
  import SelectInput from "../../site/SelectInput.svelte";
  import axios from "axios";

  let user = getAuthCookie();

  let values = {
    civilite: [],
    statusPro: [],
    typeDiplome: [],
    nationate: [],
    situationProfessionnelle: [],
    lieuObtentionDiplome: [],
    region: [],
    ville: [],
    district: [],
    commune: [],
  };
  let objects = [
    { name: "civilite", url: "/civilite/" },
    { name: "statusPro", url: "/statusPro" },
    { name: "typeDiplome", url: "/typeDiplome" },
    { name: "lieuObtentionDiplome", url: "/lieuDiplome" },
    { name: "nationate", url: "/pays/" },
    { name: "situationProfessionnelle", url: "/situationProfessionnelle/" },
    { name: "region", url: "/region" },
    { name: "ville", url: "/ville" },
    { name: "district", url: "/district" },
    { name: "commune", url: "/commune" },
  ];

  async function fetchDataFirst() {
    try {
      let res = null;
      objects.forEach(async (element) => {
        res = await axios
          .get(`https://backend.leadagro.net/api${element.url}`)
          .then((response: any) => {
            values[element.name as keyof typeof values] = response.data.data;
          })
          .catch((error: any) => {
            console.error("Erreur lors de la récupération des données:", error);
            values[element.name as keyof typeof values] = [];
          });
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  }

  let userData: any = {};
  let nbDocumentSoumis = 0;
  let Documents: any[] = [];
  let isLoading: boolean = true;
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
          body: JSON.stringify(professionnelData)
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
          console.log("Professionnel data:", userData?.personne);
          professionnelData = userData?.personne;
        }
        nbDocumentSoumis = userData?.personne?.documents?.length || 6;
        Documents = userData?.personne?.documents || [];
      });
  }

  onMount(async () => {
    user = await getAuthCookie();
    fetchDataFirst();
    console.log("User dans mon dossier:", user);
    await getUserInfo();
    document.title = "Mon dossier - MyDepp";
    isLoading = false;
  });
  let activeTab = "profil";
</script>

<main
  class="font-[var(--font-geist-sans)] bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen flex flex-col"
>
  <HeaderNew />

  <!-- <div
    class="bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-b border-blue-100 shadow-sm mt-4 pt-12"
  > -->
  <div class="bg-blue-600 shadow-sm border-b mt-4 pt-12 pb-5 mt-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <a class="text-white transition-colors" href="/dashboard"
            ><i class="ri-arrow-left-line text-xl"></i></a
          >
          <div>
            <h1 class="text-2xl font-bold text-white">
              Mise a Jour du dossier
            </h1>
            <p class="text-white">Effectuer la mise a jour de votre profils</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- </div> -->

  {#if isLoading}
    <div
      class="text-center items-center min-w-7xl mx-auto h-auto px-4 sm:px-6 lg:px-8 py-10 grid gap-6 md:grid-cols-3 lg:grid-cols-4"
    >
      <!-- Skeleton loader -->
      {#each Array(6) as _, i}
        <div
          class="bg-gray-100 rounded-2xl p-6 animate-pulse"
          style="animation-delay: {i * 0.08}s"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-gray-300"></div>
            <div class="w-16 h-6 rounded-full bg-gray-300"></div>
          </div>
          <div class="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-gray-300 rounded w-full"></div>
        </div>
      {/each}
    </div>
  {:else}
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
            {#if userData.typeUser === "PROFESSIONNEL"}
              <button
                class="relative py-4 text-sm font-medium transition-all duration-300 border-b-2"
                class:!border-blue-600={activeTab === "infoPro"}
                class:!text-blue-600={activeTab === "infoPro"}
                class:border-transparent={activeTab !== "infoPro"}
                class:text-gray-500={activeTab !== "infoPro"}
                on:click={() => (activeTab = "infoPro")}
              >
                <i class="ri-user-line mr-2"></i> Informations professionnelles
              </button>

              <button
                class="relative py-4 text-sm font-medium transition-all duration-300 border-b-2"
                class:!border-blue-600={activeTab === "Organisation"}
                class:!text-blue-600={activeTab === "Organisation"}
                class:border-transparent={activeTab !== "Organisation"}
                class:text-gray-500={activeTab !== "Organisation"}
                on:click={() => (activeTab = "Organisation")}
              >
                <i class="ri-user-line mr-2"></i> Organisation
              </button>
            {/if}

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
            <form class="space-y-6" on:submit|preventDefault={handleSubmit}>
              {#if activeTab === "profil"}
                <!-- <form class="space-y-6" on:submit|preventDefault={handleSubmit}> -->
                {#if userData.typeUser === "ETABLISSEMENT"}
                  <div class="grid grid-cols-2 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        class="block text-lg font-medium text-gray-700 mb-2"
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
                      <label
                        class="block text-lg font-medium text-gray-700 mb-2"
                        >Adresse</label
                      >
                      <input
                        type="text"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={etablissementData.adresse}
                      />
                    </div>

                    <div>
                      <label
                        class="block text-lg font-medium text-gray-700 mb-2"
                        >Nom du representant</label
                      >
                      <input
                        type="text"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={etablissementData.nomRepresentant}
                      />
                    </div>

                    <div>
                      <label
                        class="block text-lg font-medium text-gray-700 mb-2"
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
                      <label
                        class="block text-sm font-medium text-gray-700 mb-2"
                        >Nom</label
                      >
                      <input
                        type="text"
                        bind:value={professionnelData.nom}
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 mb-2"
                        >Prénoms</label
                      >
                      <input
                        type="text"
                        bind:value={professionnelData.prenoms}
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div class="md:col-span-2">
                      <label
                        class="block text-sm font-medium text-gray-700 mb-2"
                        >Numéro</label
                      >
                      <input
                        type="text"
                        bind:value={professionnelData.number}
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 mb-2"
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
                      <label
                        class="block text-sm font-medium text-gray-700 mb-2"
                        >Email professionnel</label
                      >
                      <input
                        type="text"
                        bind:value={professionnelData.emailPro}
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <!-- <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Appartenance à une organisation</label
                    >
                    <input
                      type="tel"
                      bind:value={professionnelData.appartenirOrganisation}
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      
                    />
                  </div> -->

                    <!-- <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Appartenance à un ordre</label
                    >
                    <input
                      type="text"
                      bind:value={professionnelData.appartenirOrdre}
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      
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
                  </div> -->
                  </div>
                {/if}

                <!-- </form> -->
              {:else if activeTab === "infoPro" && userData.typeUser === "PROFESSIONNEL"}
                <div>
                  <label class="block text-lg font-medium text-gray-700 mb-2"
                    >Profession</label
                  >
                  <input
                    type="text"
                    disabled
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                    value={userData?.personne?.profession.libelle}
                  />
                </div>
                <div class="grid grid-cols-2 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-lg font-medium text-gray-700 mb-2"
                      >Numéro d'inscription au registre
                    </label>
                    <input
                      type="text"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                      value={professionnelData?.code}
                    />
                  </div>
                  <div>
                    <label class="block text-lg font-medium text-gray-700 mb-2"
                      >Adresse email professionnel *</label
                    >
                    <input
                      type="text"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                      value={professionnelData.emailPro}
                    />
                  </div>
                  <div>
                    <label class="block text-lg font-medium text-gray-700 mb-2"
                      >Date d'obtention du diplôme *</label
                    >
                    <input
                      type="date"
                      bind:value={professionnelData.dateDiplome}
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                    />
                  </div>

                  <div>
                    <label class="block text-lg font-medium text-gray-700 mb-2"
                      >Lieu d'obtention du diplôme *</label
                    >
                    <input
                      type="text"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                      value={professionnelData?.lieuDiplome}
                    />
                  </div>
                  <div>
                    <label class="block text-lg font-medium text-gray-700 mb-2"
                      >Date du premier emploi *</label
                    >
                    <input
                      type="date"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                      value={professionnelData.datePremierDiplome}
                    />
                  </div>
                  <div>
                    <label class="block text-lg font-medium text-gray-700 mb-2"
                      >Dénomination du diplôme *</label
                    >
                    <input
                      type="text"
                      bind:value={professionnelData.diplome}
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                    />
                  </div>

                  <div>
                    <label class="block text-lg font-medium text-gray-700 mb-2"
                      >Situation professionnelle *</label
                    >
                    <div class="relative">
                      <select
                        id="situationPro"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-8 bg-gray-50 focus:bg-white focus:outline-none duration-200"
                        required={true}
                        name="situationPro"
                        
                        bind:value={professionnelData.situationPro.id}
                      >
                        <option value=""  >
                          Sélectionnez votre situation professionnelle
                        </option>
                        {#each values.situationProfessionnelle as situation}
                         <option value={situation.id} selected={situation.libelle == professionnelData.situationPro.libelle}>{situation.libelle}</option>
                        {/each}
                      </select>
                    </div>
                  </div>
                  <div>
                  <label class="block text-lg font-medium text-gray-700 mb-2"
                    >Région sanitaire *</label
                  >
                  <div class="relative">
                    <select
                      id="region"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-8 bg-gray-50 focus:bg-white focus:outline-none duration-200"
                      required={true}
                      name="region"
                      bind:value={professionnelData.region.id}
                    >
                      <option value="" disabled >
                        Sélectionnez votre région sanitaire
                      </option>
                      {#each values.region as region}
                        <option selected={parseInt(region.id) ==  parseInt(professionnelData.region.id)} value={region.id}>{region.libelle}</option>
                      {/each}
                    </select>
                  </div>
                  </div>
                  <div>
                    <label class="block text-lg font-medium text-gray-700 mb-2"
                      >District sanitaire *</label
                    >
                    <div class="relative">
                      <select
                        id="district"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-8 bg-gray-50 focus:bg-white focus:outline-none duration-200"
                        required={true}
                        name="district"
                        bind:value={professionnelData.district.id}
                      >
                        <option value="" disabled selected>
                          Sélectionnez votre district sanitaire
                        </option>
                        {#each values.district as district}
                          <option value={district.id}>{district.libelle}</option
                          >
                        {/each}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label class="block text-lg font-medium text-gray-700 mb-2"
                      >Ville *</label
                    >
                    <div class="relative">
                      <select
                        id="ville"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-8 bg-gray-50 focus:bg-white focus:outline-none duration-200"
                        required={true}
                        name="ville"
                        bind:value={professionnelData.ville.id}
                      >
                        <option value="" disabled selected>
                          Sélectionnez votre ville
                        </option>
                        {#each values.ville as ville}
                          <option value={ville.id}>{ville.libelle}</option>
                        {/each}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label class="block text-lg font-medium text-gray-700 mb-2"
                      >Commune *</label
                    >
                    <div class="relative">
                      <select
                        id="commune"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-8 bg-gray-50 focus:bg-white focus:outline-none duration-200"
                        required={true}
                        name="commune"
                        bind:value={professionnelData.commune.id}
                      >
                        <option value="" disabled selected>
                          Sélectionnez votre commune
                        </option>
                        {#each values.commune as commune}
                          <option value={commune.id}>{commune.libelle}</option>
                        {/each}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label class="block text-lg font-medium text-gray-700 mb-2"
                      >Quartier *</label
                    >
                    <input
                      type="text"
                      bind:value={professionnelData.quartier}
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                    />
                  </div>
                  <div>
                    <label class="block text-lg font-medium text-gray-700 mb-2"
                      >Ilot,lot</label
                    >
                    <input
                      type="text"
                      bind:value={professionnelData.poleSanitaire}
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                    />
                  </div>
                  <div>
                    <label class="block text-lg font-medium text-gray-700 mb-2"
                      >Structure d'exercice professionnel *</label
                    >
                    <input
                      type="text"
                      bind:value={professionnelData.professionnel}
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                    />
                  </div>
                  <div>
                    <label class="block text-lg font-medium text-gray-700 mb-2"
                      >Lieu d'exercice professionnel *</label
                    >
                    <input
                      type="text"
                      bind:value={professionnelData.lieuExercicePro}
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                    />
                  </div>
                  <div>
                    <label class="block text-lg font-medium text-gray-700 mb-2"
                      >Type de diplôme *</label
                    >
                    <div class="relative">
                      <select
                        id="typeDiplome"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-8 bg-gray-50 focus:bg-white focus:outline-none duration-200"
                        required={true}
                        name="typeDiplome"
                        bind:value={professionnelData.typeDiplome.id}
                      >
                        <option value="" disabled selected>
                          Sélectionnez votre type de diplôme
                        </option>
                        {#each values.typeDiplome as profession}
                          <option value={profession.id}
                            >{profession.libelle}</option
                          >
                        {/each}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label class="block text-lg font-medium text-gray-700 mb-2"
                      >Status professionnel *</label
                    >
                    <div class="relative">
                      <select
                        id="statusPro"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-8 bg-gray-50 focus:bg-white focus:outline-none duration-200"
                        required={true}
                        name="statusPro"
                        bind:value={professionnelData.statusPro.id}
                      >
                        <option value="" disabled selected>
                          Sélectionnez votre status professionnel
                        </option>
                        {#each values.statusPro as status}
                          <option value={status.id}>{status.libelle}</option>
                        {/each}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label class="block text-lg font-medium text-gray-700 mb-2"
                      >Origine du diplôme *</label
                    >
                    <div class="relative">
                      <select
                        id="lieuObtentionDiplome"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-8 bg-gray-50 focus:bg-white focus:outline-none duration-200"
                        required={true}
                        name="lieuObtentionDiplome"
                        bind:value={professionnelData.lieuObtentionDiplome.id}
                      >
                        <option value="" disabled selected>
                          Sélectionnez l'origine de votre diplôme
                        </option>
                        {#each values.lieuObtentionDiplome as lieu}
                          <option value={lieu.id}>{lieu.libelle}</option>
                        {/each}
                      </select>
                    </div>
                  </div>
                </div>
              {:else if activeTab === "Organisation" && userData.typeUser === "PROFESSIONNEL"}
                <div>
                  <label class="block text-lg font-medium text-gray-700 mb-2"
                    >Organisation</label
                  >
                  <div class="flex gap-4">
                    <div class="flex items-center gap-2">
                      <input
                        type="radio"
                        bind:group={professionnelData.appartenirOrganisation}
                        value="oui"
                        disabled
                        class="form-radio text-white"
                        checked={professionnelData.appartenirOrganisation ===
                          "oui"}
                      />
                      <label> Oui </label>
                    </div>
                    <div class="flex items-center gap-2">
                      <input
                        type="radio"
                        bind:group={professionnelData.appartenirOrganisation}
                        value="non"
                        disabled
                        class="form-radio text-white"
                        checked={professionnelData.appartenirOrganisation ===
                          "non"}
                      />
                      <label> Non </label>
                    </div>
                  </div>
                </div>
                <label class="block text-lg font-medium text-gray-700 mb-2"
                  >Ordre</label
                >
                <div class="flex gap-4">
                  <div class="flex items-center gap-2">
                    <input
                      type="radio"
                      bind:group={professionnelData.appartenirOrdre}
                      value="oui"
                      disabled
                      class="form-radio text-white"
                      checked={professionnelData.appartenirOrdre === "oui"}
                    />
                    <span class="ml-2">Oui</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <input
                      type="radio"
                      bind:group={professionnelData.appartenirOrdre}
                      value="non"
                      disabled
                      class="form-radio text-white"
                      checked={professionnelData.appartenirOrdre === "non"}
                    />
                    <span class="ml-2">Non</span>
                  </div>
                </div>
              {:else if activeTab === "documents"}
              {#if Documents.length > 0 }
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
              {:else if professionnelData.cni != null}
                <ul class="space-y-4">
                  <li
                    class="flex items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div class="flex items-center gap-4">
                      <i class="ri-file-line text-3xl text-blue-500"></i>
                      <div>
                        <p class="font-medium text-gray-900">CNI</p>
                        <a
                          class="text-lg"
                          style="background-color:#2563eb; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; margin-top: 0.5rem; display: inline-block;"
                          href={professionnelData.cni.url
                            ? BASE_URL_API_UPLOAD + professionnelData.cni.url
                            : "#"}>Voir Document</a
                        >
                      </div>
                    </div>
                  </li>
                  <li
                    class="flex items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div class="flex items-center gap-4">
                      <i class="ri-file-line text-3xl text-blue-500"></i>
                      <div>
                        <p class="font-medium text-gray-900">PHOTO</p>
                        <a
                          class="text-lg"
                          style="background-color:#2563eb; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; margin-top: 0.5rem; display: inline-block;"
                          href={professionnelData.photo.url
                            ? BASE_URL_API_UPLOAD + professionnelData.photo.url
                            : "#"}>Voir Document</a
                        >
                      </div>
                    </div>
                  </li>

                  <li
                    class="flex items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div class="flex items-center gap-4">
                      <i class="ri-file-line text-3xl text-blue-500"></i>
                      <div>
                        <p class="font-medium text-gray-900">CASIER</p>
                        <a
                          class="text-lg"
                          style="background-color:#2563eb; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; margin-top: 0.5rem; display: inline-block;"
                          href={professionnelData.casier.url
                            ? BASE_URL_API_UPLOAD + professionnelData.casier.url
                            : "#"}>Voir Document</a
                        >
                      </div>
                    </div>
                  </li>
                  <li
                    class="flex items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div class="flex items-center gap-4">
                      <i class="ri-file-line text-3xl text-blue-500"></i>
                      <div>
                        <p class="font-medium text-gray-900">CERTIFICAT</p>
                        <a
                          class="text-lg"
                          style="background-color:#2563eb; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; margin-top: 0.5rem; display: inline-block;"
                          href={professionnelData.certificat
                            ? BASE_URL_API_UPLOAD +
                              professionnelData.certificat.url
                            : "#"}>Voir Document</a
                        >
                      </div>
                    </div>
                  </li>
                  <li
                    class="flex items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div class="flex items-center gap-4">
                      <i class="ri-file-line text-3xl text-blue-500"></i>
                      <div>
                        <p class="font-medium text-gray-900">DIPLOME</p>
                        <a
                          class="text-lg"
                          style="background-color:#2563eb; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; margin-top: 0.5rem; display: inline-block;"
                          href={professionnelData.diplomeFile
                            ? BASE_URL_API_UPLOAD +
                              professionnelData.diplomeFile.url
                            : "#"}>Voir Document</a
                        >
                      </div>
                    </div>
                  </li>
                  <li
                    class="flex items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div class="flex items-center gap-4">
                      <i class="ri-file-line text-3xl text-blue-500"></i>
                      <div>
                        <p class="font-medium text-gray-900">CV</p>
                        <a
                          class="text-lg"
                          style="background-color:#2563eb; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; margin-top: 0.5rem; display: inline-block;"
                          href={professionnelData.cv
                            ? BASE_URL_API_UPLOAD + professionnelData.cv.url
                            : "#"}>Voir Document</a
                        >
                      </div>
                    </div>
                  </li>
                </ul>
              {:else}
                <div class="text-center py-16 text-gray-500">
                  <i class="ri-folder-2-line text-6xl text-gray-400 mb-4"></i>
                  <p class="text-lg">Aucun document ajouté pour le moment.</p>
                </div>
              {/if}
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
          </div>
        </div>
      </div>
    </div>
  {/if}
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
