<script lang="ts">
  import { onMount } from "svelte";

  import { BASE_URL_API } from "$lib/api";
  import { apiFetch } from "$lib/api";
  
  import { goto } from "$app/navigation";
  import Spinner from "$components/_skeletons/Spinner.svelte";
  import { CookieManager } from "$lib/auth";




  
  let user = CookieManager.get("auth") || {};
  let isPaiementProcessing = false;
  $: isPaiementDone = false;
  $: message = "";
  let step = 1;





 
  /////fin
  interface DocumentItem {
    libelle: string;
    path: any; // chemin ou base64 du fichier
    libelleGroupe: string;
  }
  let uploadedFiles: { [key: string]: string } = {}; // key: libelle+libelleGroupe, value: file name or base64

 function handleDocumentChange(event: Event, libelle: string, libelleGroupe: any) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  formData.documents.push({
    libelle,
    path: file, // on garde le File brut
    libelleGroupe,
  });

  uploadedFiles[libelle + libelleGroupe] = file.name;
  localStorage.setItem("formDataOep", JSON.stringify(formData));
}

  let formData: {
   
    documents: DocumentItem[];
  } = {
    
    documents: [],
  };

  // Définition des erreurs
  let errors = {
   
    documents: "",
  };
  let emailCheck = false;
 



  function validateStep() {
    let valid = true;
    if (step === 1) {
   
   valid = Object.values(errors).every((errorMsg) => errorMsg === "");
    }

    if (step === 2) {
     
    
      // Déterminer si tout est valide
      valid = Object.values(errors).every((errorMsg) => errorMsg === "");
    }


    return valid;
  }

  ////Fonction asynchrone pour recuperer le groupe de documents pour le type de personne


  // 🔹 Fonction pour sauvegarder l'état actuel du formulaire
  async function saveFormState() {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      localStorage.setItem("formDataOep", JSON.stringify(formData));
      localStorage.setItem("stepOep", step.toString());
  

      console.log("formData sauvegardé:", formData);
      ///recuperer les informations du type de document lorsque le type de personne est selectionné
    }
  }

//   function updateFormData(fieldName: any, file: any) {
//     if (file) {
//       // Lire le fichier en Base64 pour le stocker dans localStorage
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => {
//         // Ajouter le fichier à selectedFiles
//         selectedFiles = {
//           ...selectedFiles,
//           [fieldName]: { name: file.name, data: reader.result },
//         };

//         // Stocker dans le localStorage
//         localStorage.setItem("selectedFilesOep", JSON.stringify(selectedFiles));

//         // Mettre à jour les noms de fichiers affichés
//         fileNames = { ...fileNames, [fieldName]: file.name };
//       };
//     }
//   }


  // 🔹 Fonction pour restaurer le formulaire après un retour
  // Restaurer les données et l'étape depuis localStorage
  async function restoreFormState() {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      const savedFormData = localStorage.getItem("formDataOep");
      const savedStep = localStorage.getItem("stepOep");

      if (savedFormData) {
        formData = JSON.parse(savedFormData);
        console.log("formData restauré:", savedFormData);
      }

      if (savedStep) {
        step = parseInt(savedStep);
      } else {
        localStorage.setItem("stepOep", step.toString());
      }
    }
  }

  // ✅ Vérifier si on revient après un paiements
  onMount(async () => {
    console.log("Mounted component, checking for return param...",data);
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("return")) {
      await restoreFormState();
    }
  });

  // Lire la valeur de `step` depuis localStorage, sinon initialiser à 1

  let messagefile = "";
  // Fonction pour changer d'étape et sauvegarder dans localStorage
  function nextStep() {
    if (validateStep()) {
      step += 1;
      localStorage.setItem("stepOep", step.toString());
      return;
    } else {
      messagefile = "Veuillez remplir tous les champs obligatoires.";
    }
  }

  function prevStep() {
    if (step > 1) {
      step -= 1;
      localStorage.setItem("stepOep", step.toString());
    }
  }

  // 🔹 Gestion du paiements
  function clickPaiement() {
    console.log("click payment");
    isPaiementProcessing = true;
    saveFormState(); // 🔥 Sauvegarder avant de partir

    initPaiement();
  }

  let authenticating = false;
  async function initPaiement() {
    authenticating = true;
    console.log("formdata", formData);

    let formDatas = new FormData();

    formDatas.append("etablissement", user.personneId);
    formDatas.append("niveauIntervention", values.userData.personne.niveauIntervention.id);
    formDatas.append("email", values.userData.email);
    formDatas.append("user", user.id);

    // Ajouter les documents dans le format souhaité
    if (formData.documents && Array.isArray(formData.documents)) {
      console.log("formData.documents", formData.documents);
      formData.documents.forEach((doc, index) => {
        formDatas.append(`documents[${index}][libelle]`, doc.libelle);
        formDatas.append(`documents[${index}][path]`, doc.path);
        if (doc.libelleGroupe) {
          formDatas.append(
            `documents[${index}][libelleGroupe]`,
            doc.libelleGroupe
          );
        }
      });
    }
console.log("formDatas avant fichiers", formDatas);
    // Ajouter la référence et le type
    const reference = localStorage.getItem("reference");
    if (reference) {
      formDatas.append("reference", reference);
    }
    formDatas.append("type", "etablissement");

    const selectedFilesFromStorage = JSON.parse(
      localStorage.getItem("selectedFiles") || "{}"
    );

    if (selectedFilesFromStorage) {
      Object.keys(selectedFilesFromStorage).forEach((fieldName) => {
        const fileData = selectedFilesFromStorage[fieldName];
        if (fileData && fileData.data) {
          const base64Data = fileData.data.split(",")[1];
          const byteCharacters = atob(base64Data);
          const byteArrays = [];

          for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }
            byteArrays.push(new Uint8Array(byteNumbers));
          }

          const blob = new Blob(byteArrays, {
            type: fileData.type || "application/octet-stream",
          });
          formDatas.append(fieldName, blob, fileData.name);
        }
      });
    }

    console.log("Contenu de formDatas:");
    for (let [key, value] of formDatas.entries()) {
      if (value instanceof Blob) {
        console.log(
          key,
          `[Fichier: ${value.name || "sans nom"}, type: ${value.type}, taille: ${value.size} octets]`
        );
      } else {
        console.log(key, value);
      }
    }

    console.log("formDatas", formDatas);

    try {
      const response = await fetch(`${BASE_URL_API}/paiement/inite/oep`, {
        method: "POST",
        body: formDatas,
      });

      const result = await response.json();
      console.log("Réponse du serveur:", result);

      authenticating = false;
      
      if (result && result.url) {
        alert(result.url);
        localStorage.setItem("reference", result.reference);
        window.location.href = result.url + "?return=1";
      }
    } catch (error) {
      console.error("Erreur lors du paiement:", error);
      isPaiementProcessing = false;
      authenticating = false;
    }
  }
  function connexion() {
    goto("/site/connexion");
    localStorage.clear(); // Nettoyer les données du localStorage
  }

  // Déclenche la vérification de façon réactive dès que transactionID change
  $: if (typeof window !== "undefined" && localStorage.getItem("reference")) {
    const reference = localStorage.getItem("reference").toString();
    if (reference) {
    }
  }

  /**
   * @type {any[]}
   */
 

  let values: {
    userData: any;
    typeDocument: any[];
  } = {
    userData: {},
    typeDocument: [],
  };

   let objects = [
    
     {
      name: "userData",
      url: "/etablissement/get/one",
      id: user.personneId,
    },
    {
      name: "typeDocument",
      url: "/libelleGroupe/all/oep",
      id: user.typePersonne,
    },
  ];

  async function fetchData() {
    try {
      let res = null;
      objects.forEach(async (element) => {
        if (element.id) {
          res = await apiFetch(true, `${element.url}/${element.id}`);
        } else {
          res = await apiFetch(true, element.url);
        }
        console.log(element.name, res)
        if (res) {
          if (Object.keys(values).includes(element.name)) {
            values[element.name as keyof typeof values] = res.data;
          } else {
            console.error(`Invalid key: ${element.name}`);
          }
        } else {
          console.error(
            "Erreur lors de la récupération des données:",
            res.statusText
          );
        }
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  }

  onMount(async () => {
    fetchData();
    localStorage.removeItem("formDataOep");
  });
  onMount(() => {
    //localStorage.clear();
    const savedStep = localStorage.getItem("stepOep");
    if (savedStep) {
      step = parseInt(savedStep);
    }

    const savedData = localStorage.getItem("formDataOep");

    if (savedStep) step = parseInt(savedStep);
    if (savedData) formData = JSON.parse(savedData);

    if (savedData) {
      formData = { ...formData, ...JSON.parse(savedData) };
    }

    const savedFiles = localStorage.getItem("fileNames");
    if (savedFiles) {
      fileNames = JSON.parse(savedFiles);
    }

    console.log("fileNames:", localStorage.getItem("reference"));
  });

  // Sauvegarder les données du formulaire dans localStorage à chaque modification
  function updateField(field: any, value: any) {
    formData[field] = value;
    localStorage.setItem("formDataOep", JSON.stringify(formData));
  }
</script>

<div id="">
  <Header />
  <Slide {user} />
  <section class="text-center pb-20" style="padding-top:150px">
    <h2 class="h2-baslik-anasayfa-ozel pb-10 text-uppercase">
     Initialisation de l'OEP
    </h2>
    <p class="text-center paragraf">
      Veuillez renseigner vos informations afin de procéder à l'ouverture de votre dossier OEP.
    </p>
  </section>

  <main style="padding-top:200px">
    <!--İletişim Form Alanı-->
    <section class="iletisim-form-alani pt-20">
      <div class="tablo">
        <div class="" style="visibility: visible;">
          <form
            class="form one_customer"
            method="post"
            on:submit|preventDefault={clickPaiement}
          >
            {#if step === 1}
              <h2 class="h2-baslik-anasayfa-ozel h-yazi-margin-kucuk">
                Documents de l'établissement 
              </h2>
              <div class="tablo">
                <div class="tablo--1h-ve-2">
                  {#each values.typeDocument as document}
                    <div style="margin-top: 20px;"></div>
                    <h2 class="h2-baslik-anasayfa-ozel h-yazi-margin-kucuk">
                      {document.libelle}
                    </h2>
                    <div class="grid grid-cols-2">
                      {#each document.typeDocuments as requiredFile, index}
                        <div class="form__grup">
                          <label class="form_label"
                            >{requiredFile.libelle} *</label
                          >
                          <div class="flex items-center">
                            {#if uploadedFiles[requiredFile.libelle + document.id]}
                              <span
                                class="file-preview"
                                style="margin-right:8px;"
                              >
                                {#if formData.documents
                                  .find((d) => d.libelle === requiredFile.libelle && d.libelleGroupe === document.id)
                                  ?.path.startsWith("data:image")}
                                  <!-- Affiche la miniature de l'image -->
                                  <img
                                    src={formData.documents.find(
                                      (d) =>
                                        d.libelle === requiredFile.libelle &&
                                        d.libelleGroupe === document.id
                                    )?.path}
                                    alt="miniature"
                                    style="width:70px;height:70px;object-fit:cover;border-radius:4px;border:1px solid #ccc;"
                                  />
                                {:else}
                                  <!-- Affiche le nom du fichier si ce n'est pas une image -->
                                  <span style="font-size:12px;color:#555;">
                                    {uploadedFiles[
                                      requiredFile.libelle + document.id
                                    ]}
                                  </span>
                                {/if}
                              </span>
                            {/if}

                            <input
                              accept="image/*, .pdf"
                              type="file"
                              class="form__input"
                              on:change={(e) =>
                                handleDocumentChange(
                                  e,
                                  requiredFile.libelle,
                                  document.id
                                )}
                              placeholder="Documents à fournir"
                            />

                            {#if errors.documents}
                              <p class="error">{errors.documents}</p>
                            {/if}
                          </div>
                        </div>
                      {/each}
                    </div>
                  {/each}
                </div>
              </div>
              {#if isPaiementDone == true}
               <div class="tablo">
                <div class="tablo--1h-ve-2">
                  <!-- on:click={clickPaiement} -->
                  <div class="grid grid-cols-1 gap-20 flex justify-center">
                    <div class="">
                     
                      
                        <p>
                          Votre dossier est en cours de validation, Merci pour votre paiement.
                        </p>
                        <br />
                    

                      <br />
                    </div>
                  </div>
                </div>
              </div>
                {/if}
            {/if}

            <!-- Étape 1 -->
            

          
           

            <!-- Boutons de navigation -->
            <div class="form__grup">
           
                {#if isPaiementDone == false}
                  <button
                    type="button"
                    on:click={clickPaiement}
                    class="buton buton--kirmizi bg-green-500"
                  >
                    {#if authenticating}
                      <div class="grid grid-cols-2">
                        <div>
                          <Spinner />
                        </div>
                        <div>Effectuer le paiement</div>
                      </div>
                    {:else}
                      Effectuer le paiement
                    {/if}
                  </button>
                {/if}
                {#if isPaiementDone == true}
                  <button
                    type="button"
                    on:click={connexion}
                    class="buton buton--kirmizi bg-green-500"
                  >
                    Connectez vous
                  </button>
                {/if}
              

              <br />
              <br />
              {#if message !== ""}
                <div
                  class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <strong class="font-bold">Oups erreur!</strong>
                  <span class="block sm:inline">{message}</span>
                </div>
              {/if}
            </div>
          </form>
        </div>
      </div>
    </section>
  </main>

  <style>
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

    .form__grup {
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

    .file-icon {
      display: flex;
      align-items: center;
      color: #e53e3e; /* red for PDF, change as needed */
    }
  </style>
  <Footer />
</div>
