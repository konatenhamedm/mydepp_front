<script lang="ts">
  import FooterNew from "$components/_includes/FooterNew.svelte";
  import HeaderNew from "$components/_includes/HeaderNew.svelte";
  import { fade } from "svelte/transition";
  import { getAuthCookie } from "$lib/auth";
  import { onMount } from "svelte";
  import { BASE_URL_API, BASE_URL_API_UPLOAD } from "$lib/api";
  import SelectInput from "../../site/SelectInput.svelte";
  import axios from "axios";
  import Svelecte from "svelecte";
  //de
  let user = getAuthCookie();
  let isSubmitting: boolean = false;
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
    ordre: [],
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
    { name: "ordre", url: "/ordre" },
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
  let   professionnelData: any = {
    nom: "",
    prenoms: "",
    number: "",
    emailPro: "",
    appartenirOrdre: "",
    ordre: "",
    numeroInscription: "",
    appartenirOrganisation: "",
    organisationNom: "",
  };
  let etablissementData: any = {
    adresse: "",
    nomRepresentant: "",
    denomination: "",
  };

  const handleSubmit = async (event) => {
    isSubmitting = true;
    if (userData.typeUser === "ETABLISSEMENT") {
      // Convert etablissementData to FormData
      // console.log("Etablissement data to submit:", etablissementData);
      const formData = new FormData();
      Object.entries(etablissementData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      isSubmitting = false;
      await fetch(BASE_URL_API + "/etablissement/update/" + user?.personneId, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((result) => {
          // console.log("Etablissement profile updated:", result);
          alert("Profil mis à jour avec succès !");
          isSubmitting = false;
        })
        .catch((error) => {
          console.error("Erreur lors de la mise à jour du profil:", error);
          alert("Une erreur est survenue lors de la mise à jour du profil.");
          isSubmitting = false;
        });
    } else {
      // Convert professionnelData to FormData
      const formData = new FormData();
      // console.log("Professionnel data to submit:", professionnelData);
      // Object.entries(professionnelData).forEach(([key, value]) => {
      //   formData.append(key, value);
      // });
      formData.append("nom", professionnelData.nom);
      formData.append("prenoms", professionnelData.prenoms);
      formData.append("numero", professionnelData.number);
      formData.append("emailPro", professionnelData.emailPro);
      formData.append("dateDiplome", professionnelData.dateDiplome);
      formData.append("lieuDiplome", professionnelData.lieuDiplome);
      formData.append(
        "datePremierDiplome",
        professionnelData.datePremierDiplome
      );
      formData.append("diplome", professionnelData.diplome);
      formData.append("situationPro", professionnelData.situationPro.id);
      formData.append("region", professionnelData.region.id);
      formData.append("district", professionnelData.district.id);
      formData.append("ville", professionnelData.ville.id);
      formData.append("commune", professionnelData.commune.id);
      formData.append("quartier", professionnelData.quartier);
      formData.append("poleSanitaire", professionnelData.poleSanitaire);
      formData.append("professionnel", professionnelData.professionnel);
      formData.append("lieuExercicePro", professionnelData.lieuExercicePro);
      formData.append("appartenirOrdre", professionnelData.appartenirOrdre);
      if (professionnelData.appartenirOrdre === "oui") {
        formData.append("ordre", professionnelData.ordre?.id || professionnelData.ordre);
        formData.append("numeroInscription", professionnelData.numeroInscription);
      }else{
        formData.append("ordre", "");
        formData.append("numeroInscription", "");
      }
      formData.append("appartenirOrganisation", professionnelData.appartenirOrganisation);
      if (professionnelData.appartenirOrganisation === "oui") {
        formData.append("organisationNom", professionnelData.organisationNom);
      }else{
        formData.append("organisationNom", "");

      }

      isSubmitting = false;
      await fetch(BASE_URL_API + "/professionnel/update/" + user?.personneId, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((result) => {
          // console.log("Professionnel profile updated:", result);
          alert("Profil mis à jour avec succès !");
          isSubmitting = false;
        })
        .catch((error) => {
          console.error("Erreur lors de la mise à jour du profil:", error);
          alert("Une erreur est survenue lors de la mise à jour du profil.");
          isSubmitting = false;
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
        console.log("user data mon dossier", userData);
        if (user?.type === "ETABLISSEMENT") {
          etablissementData = userData?.personne;
          console.log("Etablissement data:", etablissementData);
        } else {
          console.log("Professionnel data:", userData);
          // Mappage explicite pour gérer les champs vides
          const p = userData?.personne || {};
          professionnelData = {
            nom: p.nom || "",
            prenoms: p.prenoms || "",
            number: p.number || "",
            emailPro: p.emailPro || "",
            appartenirOrdre: p.appartenirOrdre || "",
            ordre: p.ordre || {},
            numeroInscription: p.numeroInscription || "",
            appartenirOrganisation: p.appartenirOrganisation || "",
            organisationNom: p.organisationNom || "",
            dateDiplome: p.dateDiplome || "",
            lieuDiplome: p.lieuDiplome || "",
            datePremierDiplome: p.datePremierDiplome || "",
            diplome: p.diplome || "",
            situationPro: p.situationPro || {},
            region: p.region || {},
            district: p.district || {},
            ville: p.ville || {},
            commune: p.commune || {},
            quartier: p.quartier || "",
            poleSanitaire: p.poleSanitaire || "",
            professionnel: p.professionnel || "",
            lieuExercicePro: p.lieuExercicePro || "",
            typeDiplome: p.typeDiplome || {},
            statusPro: p.statusPro || {},
            lieuObtentionDiplome: p.lieuObtentionDiplome || {},
          };
        }

        // Gestion des documents individuels
        const docFields = [
          "photo",
          "cv",
          "casier",
          "certificat",
          "diplomeFile",
          "cni"
        ];
        nbDocumentSoumis = 0;
        Documents = [];
        const personne = userData?.personne || {};
        docFields.forEach((field) => {
          if (personne[field] && personne[field].url) {
            nbDocumentSoumis++;
            Documents.push({
              libelle: field.toUpperCase(),
              ...personne[field]
            });
          }
        });
      });
  }
  //hh
  onMount(async () => {
    user = await getAuthCookie();
    fetchDataFirst();
    // console.log("User dans mon dossier:", user);
    await getUserInfo();
    document.title = "Mon dossier - MyDepp";
    isLoading = false;
  });
  let activeTab = "profil";

  let formData= new FormData();
  let imagePreview: any = {};
  let errors: any = {};

  // function handleFileUpload(event: any, fieldName: string) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     // Créer une prévisualisation pour les images
  //     if (file.type.startsWith("image/")) {
  //       const reader = new FileReader();
  //       reader.onload = (e) => {
  //         imagePreview[fieldName] = e.target?.result as string;
  //       };
  //       reader.readAsDataURL(file);
  //     }else{
  //       imagePreview[fieldName] = null;
  //     }
  //     formData.append(fieldName, file);
  //     const fileData = file
  //     if (fileData) {
  //       const byteCharacters = atob(fileData.data.split(",")[1]);
  //       const byteArrays = [];

  //       for (let offset = 0; offset < byteCharacters.length; offset += 512) {
  //         const slice = byteCharacters.slice(offset, offset + 512);
  //         const byteNumbers = new Array(slice.length);
  //         for (let i = 0; i < slice.length; i++) {
  //           byteNumbers[i] = slice.charCodeAt(i);
  //         }
  //         byteArrays.push(new Uint8Array(byteNumbers));
  //       }

  //       const blob = new Blob(byteArrays, {
  //         type: "application/octet-stream",
  //       });
  //       // formData.append(fieldName, blob, fileData.name);
  //       formData[fieldName] = blob;
  //     }

  //     // Effacer l'erreur pour ce champ
  //     if (errors[fieldName]) {
  //       delete errors[fieldName];
  //     }
  //   }
  // }

  function handleFileUpload(event: any, fieldName: string) {
  const file = event.target.files[0];
  if (file) {
    // Créer une prévisualisation pour les images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview[fieldName] = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      imagePreview[fieldName] = null;
    }
    
    formData.append(fieldName, file);

    // Effacer l'erreur pour ce champ
    if (errors[fieldName]) {
      delete errors[fieldName];
    }
  }
}

  // function handleFileUpload(event: any, fieldName: string) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     formData[fieldName] = file;

  //     // Créer une prévisualisation pour les images
  //     if (file.type.startsWith("image/")) {
  //       const reader = new FileReader();
  //       reader.onload = (e) => {
  //         imagePreview[fieldName] = e.target?.result as string;
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //     // gestion quand c'est pas une image
  //     else {
  //       imagePreview[fieldName] = file.name; // Afficher le nom du fichier
  //     }
  //     // Effacer l'erreur pour ce champ
  //     if (errors[fieldName]) {
  //       delete errors[fieldName];
  //     }
  //   }
  // }


  async function handleSaveImage() {
    // Logique pour sauvegarder l'image sur le serveur
    isSubmitting = true;
    console.log("Sauvegarder l'image pour le champ:", formData);

    await fetch(BASE_URL_API + "/professionnel/update-all-documents/"+user?.id, {
      method: "POST",
      body: formData
    })
      .then((response) => response.json())
      .then((result) => {
        // console.log("Image sauvegardée avec succès:", result);
        alert("Image sauvegardée avec succès !");
        isSubmitting = false;
        localStorage.clear();
        window.location.href="/connexion";
      })
      .catch((error) => {
        console.error("Erreur lors de la sauvegarde de l'image:", error);
        alert("Une erreur est survenue lors de la sauvegarde de l'image.");
        isSubmitting = false;
      });
  }
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
              onclick={() => (activeTab = "profil")}
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
                onclick={() => (activeTab = "infoPro")}
              >
                <i class="ri-user-line mr-2"></i> Informations professionnelles
              </button>

              <button
                class="relative py-4 text-sm font-medium transition-all duration-300 border-b-2"
                class:!border-blue-600={activeTab === "Organisation"}
                class:!text-blue-600={activeTab === "Organisation"}
                class:border-transparent={activeTab !== "Organisation"}
                class:text-gray-500={activeTab !== "Organisation"}
                onclick={() => (activeTab = "Organisation")}
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
              onclick={() => (activeTab = "documents")}
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
            <form class="space-y-6" onsubmit={handleSubmit}>
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
                        value={userData?.username}
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
              <div class="grid grid-cols-2 md:grid-cols-2 gap-6">
              <div>
                  <label class="block text-lg font-medium text-gray-700 mb-2"
                    >Profession</label
                  >
                  <input
                    type="text"
                    disabled
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                    value={userData?.personne?.profession?.libelle}
                  />
                </div>
                  <div>
                    <label class="block text-lg font-medium text-gray-700 mb-2"
                      >Numéro d'inscription au registre
                    </label>
                    <input
                    disabled
                      type="text"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                      value={userData?.personne?.code}
                    />
                  </div>
                   <div>
                    <label class="block text-lg font-medium text-gray-700 mb-2"
                      >Ordre selectionné *</label
                    >
                    <div class="relative">
                       <Svelecte
                        multiple={false}
                        options={values.ordre}
                        bind:value={professionnelData.ordre.id}
                        controlClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                        labelField="libelle"
                        valueField="id"
                        placeholder="Sélectionnez votre ordre"
                      />
                    </div>
                       
                  </div>
                  <div>
                    <label class="block text-lg font-medium text-gray-700 mb-2"
                      >Nom de L'ordre *</label
                    >
                    <input
                      type="text"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                      value={professionnelData.organisationNom}
                    />
                  </div>
                  </div> 
                <div class="grid grid-cols-2 md:grid-cols-2 gap-6">
                  <!-- <div>
                    <label class="block text-lg font-medium text-gray-700 mb-2"
                      >Numéro d'inscription au registre
                    </label>
                    <input
                      type="text"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                      value={professionnelData?.code}
                    />
                  </div> -->
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
                        <option value="">
                          Sélectionnez votre situation professionnelle
                        </option>
                        {#each values.situationProfessionnelle as situation}
                          <option
                            value={situation.id}
                            selected={parseInt(situation.id) ==
                              parseInt(professionnelData?.situationPro)}
                            >{situation.libelle}</option
                          >
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
                        <option value="" disabled>
                          Sélectionnez votre région sanitaire
                        </option>
                        {#each values.region as region}
                          <option
                            selected={parseInt(region.id) ==
                              parseInt(professionnelData?.region?.id)}
                            value={region.id}>{region.libelle}</option
                          >
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
                  <!-- <div>
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
                  </div> -->
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
                
                {#if professionnelData.appartenirOrdre === "oui"}
                  <div class="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-lg font-medium text-gray-700 mb-2"
                        >Ordre professionnel</label
                      >
                      <input
                        type="text"
                        disabled
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                        value={professionnelData.ordre?.libelle || "Non renseigné"}
                      />
                    </div>
                    <div>
                      <label class="block text-lg font-medium text-gray-700 mb-2"
                        >Numéro d'inscription</label
                      >
                      <input
                        type="text"
                        disabled
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                        value={professionnelData.numeroInscription || "Non renseigné"}
                      />
                    </div>
                  </div>
                {/if}
                
                {#if professionnelData.appartenirOrganisation === "oui"}
                  <div class="mt-4">
                    <label class="block text-lg font-medium text-gray-700 mb-2"
                      >Nom de l'organisation</label
                    >
                    <input
                      type="text"
                      disabled
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                      value={professionnelData.organisationNom || "Non renseigné"}
                    />
                  </div>
                {/if}
              {:else if activeTab === "documents"}
                {#if Documents.length > 0}
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
                              target="_blank"
                              style="background-color:#2563eb; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; margin-top: 0.5rem; display: inline-block;"
                              href={document.path
                                ? BASE_URL_API_UPLOAD + document.url
                                : "#"}>Voir Document</a
                            >
                          </div>
                        </div>
                      </li>
                    {/each}
                  </ul>
                {:else if professionnelData.cni != null}
                  <div class="mt-6 grid grid-cols-2 gap-6">
                    <ul class="space-y-4">
                      <li
                        class="flex items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div class="flex items-center gap-4">
                          <i class="ri-file-line text-3xl text-blue-500"></i>
                          <div>
                            <p class="font-medium text-gray-900">CNI</p>
                            <div class="grid grid-cols-2 space-x-4">
                              <a
                                target="_blank"
                                class="text-lg"
                                style="background-color:#2563eb; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; margin-top: 0.5rem; display: inline-block;"
                                href={professionnelData.cni.url
                                  ? BASE_URL_API_UPLOAD +
                                    professionnelData.cni.url
                                  : "#"}>Voir Document</a
                              >
                            </div>
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
                              target="_blank"
                              style="background-color:#2563eb; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; margin-top: 0.5rem; display: inline-block;"
                              href={professionnelData.photo.url
                                ? BASE_URL_API_UPLOAD +
                                  professionnelData.photo.url
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
                              target="_blank"
                              style="background-color:#2563eb; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; margin-top: 0.5rem; display: inline-block;"
                              href={professionnelData.casier.url
                                ? BASE_URL_API_UPLOAD +
                                  professionnelData.casier.url
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
                              target="_blank"
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
                              target="_blank"
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
                              target="_blank"
                              style="background-color:#2563eb; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; margin-top: 0.5rem; display: inline-block;"
                              href={professionnelData.cv
                                ? BASE_URL_API_UPLOAD + professionnelData.cv.url
                                : "#"}>Voir Document</a
                            >
                          </div>
                        </div>
                      </li>
                    </ul>
                    {#if user?.status == "refuse_mise_a_jour"}
                      <div class="space-y-6">
                        <h2 class="text-2xl font-bold text-gray-900 mb-6">
                          Section de Mise à jour des documents
                        </h2>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                          <!-- Photo d'identité -->
                          <div>
                            <label
                              class="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Photo d'identité <span class="text-red-500"
                                >*</span
                              >
                            </label>
                            <div class="flex gap-4 items-start">
                              {#if imagePreview.photo}
                                <div class="flex-shrink-0">
                                  <img
                                    src={imagePreview.photo}
                                    alt="Aperçu photo"
                                    class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                                  />
                                </div>
                              {/if}
                              <div class="flex-1">
                                <div
                                  class="relative w-full h-32 border-dashed border-2 border-gray-300"
                                >
                                  <label
                                    for="file-photo"
                                    class="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none text-center"
                                  >
                                    Cliquez ou glissez-déposez une image ici
                                  </label>

                                  <input
                                    type="file"
                                    id="file-photo"
                                    accept="image/*"
                                    onchange={(e) =>
                                      handleFileUpload(e, "photo")}
                                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    required
                                  />
                                </div>
                                {#if errors.photo}
                                  <p class="mt-1 text-sm text-red-600">
                                    {errors.photo}
                                  </p>
                                {/if}
                              </div>
                            </div>
                          </div>

                          <!-- CNI -->
                          <div>
                            <label
                              class="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Carte nationale d'identité (CNI) <span
                                class="text-red-500">*</span
                              >
                            </label>
                            <div class="flex gap-4 items-start">
                              {#if imagePreview.cni}
                                <div class="flex-shrink-0">
                                  <!-- <p>{imagePreview.cni}</p> -->
                                  {#if imagePreview.cni.startsWith("data:image") || imagePreview.cni.endsWith(".jpg") || imagePreview.cni.endsWith(".png")}
                                    <img
                                      src={imagePreview.cni}
                                      alt="Aperçu cni"
                                      class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                                    />
                                  {:else}
                                    <img
                                      src="/PDF.png"
                                      alt="Aperçu cni"
                                      class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                                    />
                                  {/if}
                                </div>
                              {:else}
                                <div class="flex-shrink-0">
                                  <img
                                    src="/PDF.png"
                                    alt="Aperçu cni"
                                    class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                                  />
                                </div>
                              {/if}
                              <div class="flex-1">
                                <div
                                  class="relative w-full h-32 border-dashed border-2 border-gray-300"
                                >
                                  <label
                                    for="file-cni"
                                    class="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none text-center"
                                  >
                                    Cliquez ou glissez-déposez une image ici
                                  </label>

                                  <input
                                    type="file"
                                    id="file-cni"
                                    accept="image/*,application/pdf"
                                    onchange={(e) => handleFileUpload(e, "cni")}
                                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    required
                                  />
                                </div>
                                {#if errors.cni}
                                  <p class="mt-1 text-sm text-red-600">
                                    {errors.cni}
                                  </p>
                                {/if}
                              </div>
                            </div>
                          </div>

                          <!-- Diplôme -->
                          <div>
                            <label
                              class="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Diplôme <span class="text-red-500">*</span>
                            </label>
                            <div class="flex gap-4 items-start">
                              {#if imagePreview.diplomeFile}
                                <div class="flex-shrink-0">
                                  {#if imagePreview.diplomeFile.startsWith("data:image") || imagePreview.diplomeFile.endsWith(".jpg") || imagePreview.diplomeFile.endsWith(".png")}
                                    <img
                                      src={imagePreview.diplomeFile}
                                      alt="Aperçu diplôme"
                                      class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                                    />
                                  {:else}
                                    <img
                                      src="/PDF.png"
                                      alt="Aperçu diplôme"
                                      class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                                    />
                                  {/if}
                                </div>
                              {:else}
                                <img
                                  src="/PDF.png"
                                  alt="Aperçu diplôme"
                                  class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                                />
                              {/if}
                              <div class="flex-1">
                                <div
                                  class="relative w-full h-32 border-dashed border-2 border-gray-300"
                                >
                                  <label
                                    for="file-diplomeFile"
                                    class="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none text-center"
                                  >
                                    Cliquez ou glissez-déposez une image ici
                                  </label>

                                  <input
                                    type="file"
                                    id="file-diplomeFile"
                                    accept="image/*,application/pdf"
                                    onchange={(e) =>
                                      handleFileUpload(e, "diplomeFile")}
                                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    required
                                  />
                                </div>
                                {#if errors.diplomeFile}
                                  <p class="mt-1 text-sm text-red-600">
                                    {errors.diplomeFile}
                                  </p>
                                {/if}
                              </div>
                            </div>
                          </div>

                          <!-- Casier judiciaire -->
                          <div>
                            <label
                              class="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Casier judiciaire <span class="text-red-500"
                                >*</span
                              >
                            </label>
                            <div class="flex gap-4 items-start">
                              {#if imagePreview.casier}
                                <div class="flex-shrink-0">
                                  {#if imagePreview.casier.startsWith("data:image") || imagePreview.casier.endsWith(".jpg") || imagePreview.casier.endsWith(".png")}
                                    <img
                                      src={imagePreview.casier}
                                      alt="Aperçu casier "
                                      class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                                    />
                                  {:else}
                                    <img
                                      src="/PDF.png"
                                      alt="Aperçu diplôme"
                                      class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                                    />
                                  {/if}
                                </div>
                              {:else}
                                <img
                                  src="/PDF.png"
                                  alt="Aperçu diplôme"
                                  class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                                />
                              {/if}
                              <div class="flex-1">
                                <div
                                  class="relative w-full h-32 border-dashed border-2 border-gray-300"
                                >
                                  <label
                                    for="file-casier"
                                    class="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none text-center"
                                  >
                                    Cliquez ou glissez-déposez une image ici
                                  </label>

                                  <input
                                    type="file"
                                    id="file-casier"
                                    accept="image/*,application/pdf"
                                    onchange={(e) =>
                                      handleFileUpload(e, "casier")}
                                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    required
                                  />
                                </div>
                                {#if errors.casier}
                                  <p class="mt-1 text-sm text-red-600">
                                    {errors.casier}
                                  </p>
                                {/if}
                              </div>
                            </div>
                          </div>

                          <!-- Certificat (optionnel) -->
                          <div>
                            <label
                              class="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Certificat (optionnel)
                            </label>
                            <div class="flex gap-4 items-start">
                              {#if imagePreview.certificat}
                                {#if imagePreview.certificat.startsWith("data:image") || imagePreview.certificat.endsWith(".jpg") || imagePreview.certificat.endsWith(".png")}
                                  <img
                                    src={imagePreview.certificat}
                                    alt="Aperçu certificat"
                                    class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                                  />
                                {:else}
                                  <img
                                    src="/PDF.png"
                                    alt="Aperçu diplôme"
                                    class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                                  />
                                {/if}
                              {:else}
                                <img
                                  src="/PDF.png"
                                  alt="Aperçu diplôme"
                                  class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                                />
                              {/if}
                              <div class="flex-1">
                                <div
                                  class="relative w-full h-32 border-dashed border-2 border-gray-300"
                                >
                                  <label
                                    for="file-certificat"
                                    class="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none text-center"
                                  >
                                    Cliquez ou glissez-déposez une image ici
                                  </label>

                                  <input
                                    type="file"
                                    id="file-certificat"
                                    accept="image/*,application/pdf"
                                    onchange={(e) =>
                                      handleFileUpload(e, "certificat")}
                                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- CV (optionnel) -->
                          <div>
                            <label
                              class="block text-sm font-medium text-gray-700 mb-2"
                            >
                              CV (optionnel)
                            </label>
                            <div class="flex gap-4 items-start">
                              {#if imagePreview?.cv}
                                {#if imagePreview.cv.startsWith("data:image") || imagePreview.cv.endsWith(".jpg") || imagePreview.cv.endsWith(".png")}
                                  <img
                                    src={imagePreview.cv}
                                    alt="Aperçu cv"
                                    class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                                  />
                                {:else}
                                  <img
                                    src="/PDF.png"
                                    alt="Aperçu diplôme"
                                    class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                                  />
                                {/if}
                              {:else}
                                <img
                                  src="/PDF.png"
                                  alt="Aperçu diplôme"
                                  class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                                />
                              {/if}
                              <div class="flex-1">
                                <div
                                  class="relative w-full h-32 border-dashed border-2 border-gray-300"
                                >
                                  <label
                                    for="file-cv"
                                    class="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none text-center"
                                  >
                                    Cliquez ou glissez-déposez une image ici
                                  </label>

                                  <input
                                    type="file"
                                    id="file-cv"
                                    accept="image/*,application/pdf"
                                    onchange={(e) => handleFileUpload(e, "cv")}
                                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onclick={handleSaveImage}
                            disabled={isSubmitting}
                            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-[1.02]"
                            style="background-color: #2563eb;"
                            >{isSubmitting ? "Envoi en cours..." : "Renvoyer les dossiers"}</button
                          >
                        </div>
                      </div>
                    {/if}
                  </div>
                {:else}
                <div>
                 <div class="grid grid-cols-2 lg:grid-cols-2 gap-6 mb-4">
                <!-- Photo d'identité -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Photo d'identité <span class="text-red-500">*</span>
                  </label>
                  <div class="flex gap-4 items-start">
                    {#if imagePreview.photo}
                      <div class="flex-shrink-0">
                        <img
                          src={imagePreview.photo}
                          alt="Aperçu photo"
                          class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                        />
                      </div>
                    {/if}
                    <div class="flex-1">
                      <div
                        class="relative w-full h-32 border-dashed border-2 border-gray-300"
                      >
                        <label
                          for="file-photo"
                          class="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none text-center"
                        >
                          Cliquez ou glissez-déposez une image ici
                        </label>

                        <input
                          type="file"
                          id="file-photo"
                          accept="image/*"
                          onchange={(e) => handleFileUpload(e, "photo")}
                          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          required
                        />
                      </div>
                      {#if errors.photo}
                        <p class="mt-1 text-sm text-red-600">{errors.photo}</p>
                      {/if}
                    </div>
                  </div>
                </div>

                <!-- CNI -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Carte nationale d'identité (CNI) <span class="text-red-500"
                      >*</span
                    >
                  </label>
                  <div class="flex gap-4 items-start">
                    {#if imagePreview.cni}
                      <div class="flex-shrink-0">
                 
                        {#if imagePreview.cni.startsWith("data:image") || imagePreview.cni.endsWith(".jpg") || imagePreview.cni.endsWith(".png")}
                          <img
                            src={imagePreview.cni}
                            alt="Aperçu cni"
                            class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                          />
                        {:else }
                          <img
                            src="/PDF.png"
                            alt="Aperçu cni"
                            class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                          />
                        {/if}
                      </div>
                      
                    {/if}
                    <div class="flex-1">
                      <div
                        class="relative w-full h-32 border-dashed border-2 border-gray-300"
                      >
                        <label
                          for="file-cni"
                          class="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none text-center"
                        >
                          Cliquez ou glissez-déposez une image ici
                        </label>

                        <input
                          type="file"
                          id="file-cni"
                          accept="image/*,application/pdf"
                          onchange={(e) => handleFileUpload(e, "cni")}
                          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          required
                        />
                      </div>
                      {#if errors.cni}
                        <p class="mt-1 text-sm text-red-600">{errors.cni}</p>
                      {/if}
                    </div>
                  </div>
                </div>

                <!-- Diplôme -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Diplôme <span class="text-red-500">*</span>
                  </label>
                  <div class="flex gap-4 items-start">
                    {#if imagePreview.diplomeFile}
                      <div class="flex-shrink-0">
                        {#if imagePreview.diplomeFile.startsWith("data:image")}
                          <img
                            src={imagePreview.diplomeFile}
                            alt="Aperçu diplôme"
                            class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                          />
                        {:else }
                        <img
                          src="/PDF.png"
                          alt="Aperçu diplôme"
                          class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                        />
                        {/if}
                      </div>
                      <!-- {:else }
                       <img
                         src="/PDF.png"
                         alt="Aperçu diplôme"
                         class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                       /> -->
                    {/if}
                    <div class="flex-1">
                      <div
                        class="relative w-full h-32 border-dashed border-2 border-gray-300"
                      >
                        <label
                          for="file-diplomeFile"
                          class="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none text-center"
                        >
                          Cliquez ou glissez-déposez une image ici
                        </label>

                        <input
                          type="file"
                          id="file-diplomeFile"
                          accept="image/*,application/pdf"
                          onchange={(e) => handleFileUpload(e, "diplomeFile")}
                          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          required
                        />
                      </div>
                      {#if errors.diplomeFile}
                        <p class="mt-1 text-sm text-red-600">
                          {errors.diplomeFile}
                        </p>
                      {/if}
                    </div>
                  </div>
                </div>

                <!-- Casier judiciaire -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Casier judiciaire <span class="text-red-500">*</span>
                  </label>
                  <div class="flex gap-4 items-start">
                    {#if imagePreview.casier}
                      <div class="flex-shrink-0">
                        {#if imagePreview.casier.startsWith("data:image") || imagePreview.casier.endsWith(".jpg") || imagePreview.casier.endsWith(".png")}
                          <img
                            src={imagePreview.casier}
                            alt="Aperçu casier "
                            class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                          />
                         {:else }
                        <img
                          src="/PDF.png"
                          alt="Aperçu diplôme"
                          class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                        />
                        {/if}
                      </div>
                      
                    {/if}
                    <div class="flex-1">
                      <div
                        class="relative w-full h-32 border-dashed border-2 border-gray-300"
                      >
                        <label
                          for="file-casier"
                          class="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none text-center"
                        >
                          Cliquez ou glissez-déposez une image ici
                        </label>

                        <input
                          type="file"
                          id="file-casier"
                          accept="image/*,application/pdf"
                          onchange={(e) => handleFileUpload(e, "casier")}
                          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          required
                        />
                      </div>
                      {#if errors.casier}
                        <p class="mt-1 text-sm text-red-600">{errors.casier}</p>
                      {/if}
                    </div>
                  </div>
                </div>

                <!-- Certificat (optionnel) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Certificat (optionnel)
                  </label>
                  <div class="flex gap-4 items-start">
                    {#if imagePreview.certificat}
                      {#if imagePreview.certificat.startsWith("data:image") || imagePreview.certificat.endsWith(".jpg") || imagePreview.certificat.endsWith(".png")}
                        <img
                          src={imagePreview.certificat}
                          alt="Aperçu certificat"
                          class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                        />
                      {:else }
                        <img
                          src="/PDF.png"
                          alt="Aperçu diplôme"
                          class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                        />
                      {/if}
                    
                    {/if}
                    <div class="flex-1">
                      <div
                        class="relative w-full h-32 border-dashed border-2 border-gray-300"
                      >
                        <label
                          for="file-certificat"
                          class="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none text-center"
                        >
                          Cliquez ou glissez-déposez une image ici
                        </label>

                        <input
                          type="file"
                          id="file-certificat"
                          accept="image/*,application/pdf"
                          onchange={(e) => handleFileUpload(e, "certificat")}
                          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- CV (optionnel) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    CV (optionnel)
                  </label>
                  <div class="flex gap-4 items-start">
                    {#if imagePreview?.cv}
                      {#if imagePreview.cv.startsWith("data:image") || imagePreview.cv.endsWith(".jpg") || imagePreview.cv.endsWith(".png")}
                        <img
                          src={imagePreview.cv}
                          alt="Aperçu cv"
                          class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                        />
                      {:else }
                        <img
                          src="/PDF.png"
                          alt="Aperçu diplôme"
                          class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                        />
                      {/if}
                     
                    {/if}
                    <div class="flex-1">
                      <div
                        class="relative w-full h-32 border-dashed border-2 border-gray-300"
                      >
                        <label
                          for="file-cv"
                          class="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none text-center"
                        >
                          Cliquez ou glissez-déposez une image ici
                        </label>

                        <input
                          type="file"
                          id="file-cv"
                          accept="image/*,application/pdf"
                          onchange={(e) => handleFileUpload(e, "cv")}
                          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
               <button
                            type="button"
                            onclick={handleSaveImage}
                            disabled={isSubmitting}
                            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-[1.02]"
                            style="background-color: #2563eb;"
                            >{isSubmitting ? "Envoi en cours..." : "Renvoyer les dossiers"}</button
                          >
                </div>
                {/if}
              {/if}
              {#if activeTab != "documents"}
              <div class="flex justify-end space-x-4 pt-6">
                <a
                  class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
                  href="/dashboard"
                >
                  Annuler
                </a>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-[1.02]"
                  style="background-color: #2563eb;"
                >
                  Sauvegarder les modifications
                </button>
              </div>
              {/if}
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
