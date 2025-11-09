<script lang="ts">
  import { onMount } from "svelte";

  import { BASE_URL_API } from "$lib/api";
  import { apiFetch } from "$lib/api";
  
  import { goto } from "$app/navigation";
  import Spinner from "$components/_skeletons/Spinner.svelte";
  import { CookieManager, getAuthCookie } from "$lib/auth";
  import HeaderNew from "$components/_includes/HeaderNew.svelte";
  import FooterNew from "$components/_includes/FooterNew.svelte";

export let data;
 let formData: {
   
    documents: DocumentItem[];
  } = {
    
    documents: [],
  };

  // Définition des erreurs
  let errors = {
   
    documents: "",
  };

  
  let user = data.user;
  console.log("user dans oep_initie", user);
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

  // Lire le fichier en base64 pour l'affichage
  const reader = new FileReader();
  reader.onload = () => {
    formData.documents.push({
      libelle,
      path: reader.result, // base64 pour image/pdf
      libelleGroupe,
    });
    uploadedFiles[libelle + libelleGroupe] = file.name;
    localStorage.setItem("formDataOep", JSON.stringify(formData));
  };
  if (file.type.startsWith("image/")) {
    reader.readAsDataURL(file);
  } else if (file.type === "application/pdf") {
    reader.readAsDataURL(file);
  }
}

 
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
        // alert(result.url);
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
      id: user.personneId ? user.personneId : null,
    },
    {
      name: "typeDocument",
      url: "/libelleGroupe/all/oep",
      id: user.typePersonne ? user.typePersonne : null,
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

   function updateFormData(fieldName: any, file: any) {
    if (file) {
      // Lire le fichier en Base64 pour le stocker dans localStorage
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Ajouter le fichier à selectedFiles
        selectedFiles = {
          ...selectedFiles,
          [fieldName]: { name: file.name, data: reader.result },
        };

        // Stocker dans le localStorage
        localStorage.setItem("selectedFilesOep", JSON.stringify(selectedFiles));

        // Mettre à jour les noms de fichiers affichés
        fileNames = { ...fileNames, [fieldName]: file.name };
      };
    }
  }

  onMount(async () => {
    
    console.log("Mounted component, fetching data...", user);
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


<div class="oep-bg-gradient">
  <HeaderNew />
  <section class="oep-section-header">
    <h2 class="oep-title">Initialisation de l'OEP</h2>
    <p class="oep-subtitle">
      Veuillez renseigner vos informations afin de procéder à l'ouverture de votre dossier OEP.
    </p>
  </section>

  <main class="oep-main">
    <section class="oep-form-section">
      <div class="oep-form-wrapper">
        <form
          class="oep-form"
          method="post"
          on:submit|preventDefault={clickPaiement}
        >
          {#if step === 1}
            <h2 class="oep-form-title">Documents de l'établissement</h2>
            <div class="oep-form-block">
              {#each values.typeDocument as document}
                <div class="oep-document-group">
                  <h2 class="oep-document-title">{document.libelle}</h2>
                  <div class="oep-grid">
                    {#each document.typeDocuments as requiredFile, index}
                      <div class="oep-form-group">
                        <label class="oep-label">{requiredFile.libelle} *</label>
                        <div class="oep-file-flex">
                          {#if uploadedFiles[requiredFile.libelle + document.id]}
                            <span class="oep-file-preview">
                              {#if formData.documents
                                .find((d) => d.libelle === requiredFile.libelle && d.libelleGroupe === document.id)
                                ?.path?.startsWith("data:image")}
                                <img
                                  src={formData.documents.find(
                                    (d) =>
                                      d.libelle === requiredFile.libelle &&
                                      d.libelleGroupe === document.id
                                  )?.path}
                                  alt="miniature"
                                  class="oep-file-img"
                                  style="max-width:80px; max-height:80px; border-radius:8px; border:1px solid #eee;"
                                />
                              {:else if formData.documents.find((d) => d.libelle === requiredFile.libelle && d.libelleGroupe === document.id)?.path?.startsWith("data:application/pdf")}
                                <span style="display:flex; align-items:center; gap:4px;">
                                  <svg width="32" height="32" viewBox="0 0 24 24" fill="#2563eb"><path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm7 1.5V9h5.5L13 3.5zM6 4h6v5a1 1 0 0 0 1 1h5v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4zm2 10v2h8v-2H8z"/></svg>
                                  <span class="oep-file-name">PDF</span>
                                </span>
                              {:else}
                                <span class="oep-file-name">
                                  {uploadedFiles[requiredFile.libelle + document.id]}
                                </span>
                              {/if}
                            </span>
                          {/if}
                          <input
                            accept="image/*, .pdf"
                            type="file"
                            class="oep-input-file"
                            on:change={(e) =>
                              handleDocumentChange(
                                e,
                                requiredFile.libelle,
                                document.id
                              )}
                            placeholder="Documents à fournir"
                          />
                          {#if errors.documents}
                            <p class="oep-error">{errors.documents}</p>
                          {/if}
                        </div>
                      </div>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
            {#if isPaiementDone == true}
              <div class="oep-form-block">
                <div class="oep-validation-message">
                  <p>Votre dossier est en cours de validation, Merci pour votre paiement.</p>
                </div>
              </div>
            {/if}
          {/if}

          <div class="oep-form-group oep-btn-group">
            {#if isPaiementDone == false}
              <button
                type="button"
                on:click={clickPaiement}
                class="oep-btn"
              >
                {#if authenticating}
                  <div class="oep-btn-flex">
                    <Spinner />
                    <span>Effectuer le paiement</span>
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
                class="oep-btn"
              >
                Connectez vous
              </button>
            {/if}

            {#if message !== ""}
              <div class="oep-alert" role="alert">
                <strong>Oups erreur!</strong>
                <span>{message}</span>
              </div>
            {/if}
          </div>
        </form>
      </div>
    </section>
  </main>
  <FooterNew/>
</div>


<style>
  .oep-bg-gradient {
    min-height: 100vh;
    background: linear-gradient(to bottom right, #eff6ff, #fff, #f3e8ff);
    padding: 0;
  }
  .oep-section-header {
    text-align: center;
    padding-top: 100px;
    padding-bottom: 40px;
  }
  .oep-title {
    font-size: 2.5em;
    font-weight: 700;
    text-transform: uppercase;
    color: #6d28d9;
    margin-bottom: 10px;
    letter-spacing: 2px;
    text-shadow: 0 2px 8px #e0e7ff;
  }
  .oep-subtitle {
    font-size: 1.2em;
    color: #374151;
    margin-bottom: 0;
  }
  .oep-main {
    padding-top: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 70vh;
  }
  .oep-form-section {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }
  .oep-form-wrapper {
    background: rgba(255,255,255,0.95);
    box-shadow: 0 8px 32px 0 rgba(60, 60, 120, 0.15);
    border-radius: 24px;
    padding: 40px 32px;
    max-width: 900px;
    width: 100%;
    margin-bottom: 40px;
    border: 1px solid #e0e7ff;
  }
  .oep-form {
    width: 100%;
  }
  .oep-form-title {
    font-size: 1.7em;
    color: #2563eb;
    margin-bottom: 24px;
    font-weight: 600;
    text-shadow: 0 1px 4px #e0e7ff;
  }
  .oep-form-block {
    margin-bottom: 32px;

  }
  .oep-document-group {
    margin-bottom: 32px;
    background: #f3f4f6;
    border-radius: 16px;
    box-shadow: 0 2px 8px 0 rgba(60, 60, 120, 0.07);
    padding: 24px 18px;
  }
  .oep-document-title {
    font-size: 1.2em;
    color: #7c3aed;
    margin-bottom: 18px;
    font-weight: 500;
  }
  .oep-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 24px;
  }
  .oep-form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 12px;
  }
  .oep-label {
    font-size: 1em;
    color: #374151;
    margin-bottom: 8px;
    font-weight: 500;
  }
  .oep-file-flex {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .oep-file-preview {
    margin-right: 8px;
    display: flex;
    align-items: center;
  }
  .oep-file-img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    box-shadow: 0 2px 8px #e0e7ff;
    transition: transform 0.2s;
  }
  .oep-file-img:hover {
    transform: scale(1.08);
    box-shadow: 0 4px 16px #a5b4fc;
  }
  .oep-file-name {
    font-size: 13px;
    color: #6366f1;
    background: #eef2ff;
    padding: 2px 8px;
    border-radius: 6px;
    font-weight: 500;
  }
  .oep-input-file {
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    background: #fff;
    font-size: 1em;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-shadow: 0 1px 4px #e0e7ff;
  }
  .oep-input-file:focus {
    border-color: #6366f1;
    box-shadow: 0 2px 8px #a5b4fc;
    outline: none;
  }
  .oep-error {
    color: #ef4444;
    font-size: 14px;
    margin-top: 5px;
    font-weight: 500;
  }
  .oep-validation-message {
    text-align: center;
    font-size: 1.1em;
    color: #059669;
    background: #e0f2fe;
    border-radius: 12px;
    padding: 18px 0;
    margin-top: 12px;
    box-shadow: 0 2px 8px #bae6fd;
  }
  .oep-btn-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
    margin-top: 24px;
  }
  .oep-btn {
    background: linear-gradient(90deg, #6366f1 0%, #7c3aed 100%);
    color: #fff;
    font-size: 1.1em;
    font-weight: 600;
    padding: 12px 32px;
    border-radius: 12px;
    border: none;
    box-shadow: 0 2px 8px #e0e7ff;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .oep-btn:hover {
    background: linear-gradient(90deg, #7c3aed 0%, #6366f1 100%);
    transform: scale(1.04);
    box-shadow: 0 4px 16px #a5b4fc;
  }
  .oep-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .oep-btn-flex {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .oep-alert {
    background: #fee2e2;
    border: 1px solid #fca5a5;
    color: #b91c1c;
    padding: 12px 18px;
    border-radius: 10px;
    margin-top: 10px;
    font-size: 1em;
    box-shadow: 0 2px 8px #fecaca;
    text-align: center;
  }
</style>