<script lang="ts">
  import FooterNew from "$components/_includes/FooterNew.svelte";
  import HeaderNew from "$components/_includes/HeaderNew.svelte";
  import axios from "axios";
  import FormStep2 from "./formStep2.svelte";
  import { onMount } from "svelte";
  import FormStep3 from "./formStep3.svelte";
  import Modal from "./Modal.svelte";
  import FormStep from "./formStep.svelte";
  import Intermed1 from "./intermed1.svelte";
  import LastSteps from "./last_steps.svelte";
  import { BASE_URL_API } from "$lib/api";
  import Recap from "./recap.svelte";
  let step = 1;
  let done = false;
  let lastStep = false;
  let showPassword = false;
  let isPaiementProcessing = false;
  let authenticating = false;
  let isPaiementDone = false;
  let message = "";
  let isModalOpen = false;
  let intermed = 0;
  let pdfUrl: any;
  function openModal(reference: any) {
    pdfUrl = reference; // ✅ Met à jour la variable réactive
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
    localStorage.clear();
  }

  const nextStep = () => {
    
    if (step == 3 && intermed == 0) {
      intermed = 1;
    } else {
      step += 1;
      if (step == 6) {
        lastStep = true;
      }
    }

    console.log(formData);
  };
  const prevStep = () => {
    if (step > 1) {
      step -= 1;
    }
    if (step < 3) {
      intermed = 0;
    }
    lastStep = false;
  };

  let formData = {
    email: "",
    password: "",
    confirmPassword: "",
    // Personal Informations
    code: "",
    nom: "",
    prenoms: "",
    nationalite: "",
    civilite: "",
    emailAutre: "",
    numero: "",
    dateNaissance: "",
    situation: "",

    // Professional informations
    profession: "",
    emailPro: "",
    dateDiplome: "",
    lieuDiplome: "",
    datePremierDiplome: "",
    poleSanitairePro: "",
    diplome: "",
    situationPro: "",

    poleSanitaire: "",
    region: "",
    district: "",
    ville: "",
    commune: "",
    quartier: "",
    professionnel: "",
    lieuExercicePro: "",
    statusPro: "",
    typeDiplome: "",
    lieuObtentionDiplome: "",
    //media informations

    photo: "",
    cni: "",
    casier: "",
    diplomeFile: "",
    certificat: "",
    cv: "",

    // organization informations

    appartenirOrganisation: "non",
    organisationNom: "",
    appartenirOrdre: "non",
    numeroInscription: "",
  };

  let values = {
    civilite: [],
    statusPro: [],
    typeDiplome: [],
    nationate: [],
    situationProfessionnelle: [],
    lieuObtentionDiplome: [],
    region : [],
    ville : [],
    district : [],
    commune : [],
  };
  let objects = [
    { name: "civilite", url: "/civilite/" },
    { name: "statusPro", url: "/statusPro" },
    { name: "typeDiplome", url: "/typeDiplome" },
    { name: "lieuObtentionDiplome", url: "/lieuDiplome" },
    { name: "nationate", url: "/pays/" },
    { name: "situationProfessionnelle", url: "/situationProfessionnelle/" },
    {name: 'region', url: '/region'},
    {name: 'ville', url: '/ville'},
    {name: 'district', url: '/district'},
    {name: 'commune', url: '/commune'},
  ];
  ////on recupere le type de personne et les autres trucs a mettre dans le formulaire
  async function fetchDataFirst() {
    try {
      let res = null;
      objects.forEach(async (element) => {
        res = await axios
          .get(`http://backend.leadagro.net/api${element.url}`)
          .then((response) => {
            values[element.name as keyof typeof values] = response.data.data;
          })
          .catch((error) => {
            console.error("Erreur lors de la récupération des données:", error);
            values[element.name as keyof typeof values] = [];
          });
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  }

  let uploadedFiles: { [key: string]: string } = {}; // key: libelle+libelleGroupe, value: file name or base64

  onMount(() => {
    fetchDataFirst();
    console.log(values);
    let references = localStorage.getItem("reference");
    if (references) {
      checkTransactionID(references);
    }
    console.log("references", references);
  });

  function clickPaiement() {
    isPaiementProcessing = true;

    initPaiement();
  }

 async function initPaiement() {
    authenticating = true;
    // Créer un FormData pour les données du formulaire
    let formDatas = new FormData();

    Object.keys(formData).forEach((key) => {
      formDatas.append(key, formData[key]);
    });

    const reference = localStorage.getItem("reference");
    if (reference) {
      formDatas.append("reference", reference);
    }
    formDatas.append("type", "professionnel");

    const selectedFilesFromStorage = null;

    if (selectedFilesFromStorage) {
      // Ajouter chaque fichier au FormData
      Object.keys(selectedFilesFromStorage).forEach((fieldName) => {
        const fileData = selectedFilesFromStorage[fieldName];
        if (fileData && fileData.data) {
          const byteCharacters = atob(fileData.data.split(",")[1]);
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
            type: "application/octet-stream",
          });
          formDatas.append(fieldName, blob, fileData.name);
        }
      });
    }

    console.log(formDatas);

    await fetch(BASE_URL_API + "/paiement/paiement", {
      method: "POST",
      body: formDatas,
    })
      .then((response) => response.json())
      .then((result) => {
        authenticating = false;

        if (result.data.url) {
          localStorage.setItem("reference", result.data.reference);
          window.location.href = result.data.url + "?return=1"; // 🔥 Ajout du paramètre `return`
        }
      })
      .catch((error) => {
        console.error("Erreur paiements :", error);
        isPaiementProcessing = false;
        authenticating = false;
      });
  }
  async function checkTransactionID(idtransaction: any) {
    if (!idtransaction) return false;
    console.log("idtransaction", idtransaction);
    try {
      const res = await fetch(
        `http://backend.leadagro.net/api/paiement/info/transaction/${idtransaction}`
      );
      const data = await res.json();
      isPaiementDone = data.data.state;

      console.log("data.data", data.data);
      if (data.data.state == true) {
        openModal(idtransaction);
      } else {
        message = "Le paiement n'a pas été effectué. Veuillez réessayer.";
      }
      return data.data; // Assurez-vous que l'API renvoie un objet avec une clé `valid`
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de la transaction :",
        error
      );
      return false;
    }
  }
</script>

<main>
  <HeaderNew />
<section
          class="relative  text-white "
          style="  background-image: linear-gradient(135deg, #2563eb 0%, #7e22ce 100%);padding-top:100px;padding-bottom:50px;
"
        >
          <div class="absolute inset-0 bg-black/20"></div>
          <div
            class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          >
            <h1 class="text-4xl md:text-5xl font-bold mb-6">Inscription Professionnel de santé</h1>
            <p class="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Bienvenue dans la section d'inscription des professionnels de santé
            </p>
          </div>
        </section>
  <div
    class=" flex items-center justify-center py-30 px-4 sm:px-6 lg:px-8"
    style="background-image: linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%);"
  >
    <div class="max-w-7xl w-full">
      <!-- <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Inscription Professionnel de santé
        </h1>
        <p class="text-gray-600">
          Bienvenue dans la section d'inscription des professionnels de santé
        </p>
      </div> -->
        
      <div class="flex justify-between mb-8 text-sm">
        {#if step >= 1}
          <div class="flex items-center">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 bg-purple-600 text-white border-purple-600"
            >
              1
            </div>
            <div class="w-16 h-0.5 mx-2 bg-purple-600"></div>
          </div>
        {:else}
          <div class="flex items-center">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 text-white border-gray-300"
            >
              1
            </div>
            <div class="w-16 h-0.5 mx-2 bg-gray-300"></div>
          </div>
        {/if}

        {#if step >= 2}
          <div class="flex items-center">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 bg-purple-600 text-white border-purple-600"
            >
              2
            </div>
            <div class="w-16 h-0.5 mx-2 bg-purple-600"></div>
          </div>
        {:else}
          <div class="flex items-center">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 bg-white text-gray-400 border-gray-300"
            >
              2
            </div>
            <div class="w-16 h-0.5 mx-2 bg-gray-300"></div>
          </div>
        {/if}

        {#if step >= 3}
          <div class="flex items-center">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 bg-purple-600 text-white border-purple-600"
            >
              3
            </div>
            <div class="w-16 h-0.5 mx-2 bg-purple-600"></div>
          </div>
        {:else}
          <div class="flex items-center">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 bg-white text-gray-400 border-gray-300"
            >
              3
            </div>
            <div class="w-16 h-0.5 mx-2 bg-gray-300"></div>
          </div>
        {/if}

        {#if step >= 4}
          <div class="flex items-center">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 bg-purple-600 text-white border-purple-600"
            >
              4
            </div>
            <div class="w-16 h-0.5 mx-2 bg-purple-600"></div>
          </div>
        {:else}
          <div class="flex items-center">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 bg-white text-gray-400 border-gray-300"
            >
              4
            </div>
            <div class="w-16 h-0.5 mx-2 bg-gray-300"></div>
          </div>
        {/if}

        {#if step >= 5}
          <div class="flex items-center">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 bg-purple-600 text-white border-purple-600"
            >
              5
            </div>
            <div class="w-16 h-0.5 mx-2 bg-purple-600"></div>
          </div>
        {:else}
          <div class="flex items-center">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 bg-white text-gray-400 border-gray-300"
            >
              5
            </div>
            <div class="w-16 h-0.5 mx-2 bg-gray-300"></div>
          </div>
        {/if}

        {#if step == 6}
          <div class="flex items-center">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 bg-purple-600 text-white border-purple-600"
            >
              6
            </div>
            
          </div>
        {:else}
          <div class="flex items-center">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 bg-white text-gray-400 border-gray-300"
            >
              6
            </div>
          </div>
        {/if}
      </div>
      <div class="flex justify-between mb-8 text-sm">
        {#if step >= 1}
          <span class="text-purple-600 font-medium">Information generale</span>
        {:else}
          <span class="text-gray-500">Information generale</span>
        {/if}
        {#if step >= 2}
          <span class="text-purple-600 font-medium"
            >Information Personnelles</span
          >
        {:else}
          <span class="text-gray-500">Information Personnelles</span>
        {/if}
        {#if step >= 3}
          <span class="text-purple-600 font-medium"
            >Information professionnelles</span
          >
        {:else}
          <span class="text-gray-500">Information professionnelles</span>
        {/if}
        {#if step >= 4}
          <span class="text-purple-600 font-medium"
            >Documents Administratifs</span
          >
        {:else}
          <span class="text-gray-500">Documents Administratifs</span>
        {/if}
        {#if step >= 5}
          <span class="text-purple-600 font-medium"
            >Informations Organisationnelles</span
          >
        {:else}
          <span class="text-gray-500">Informations Organisationnelles </span>
        {/if}
        {#if step == 6}
          <span class="text-purple-600 font-medium">Document de Validation</span
          >
        {:else}
          <span class="text-gray-500">Document de Validation</span>
        {/if}
      </div>
      <div class="bg-white rounded-lg shadow-sm border p-8">
        <form>
          {#if step === 1}
            <div>
              <h2 class="text-xl font-semibold text-gray-900 mb-6">
                Informations de connexion
              </h2>
              <div class="space-y-6">
                <div>
                  <label
                    for="email"
                    class="block text-sm font-medium text-gray-700 mb-2"
                    >E-mail *</label
                  ><input
                    type="email"
                    id="email"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="votre.email@exemple.com"
                    required={true}
                    name="email"
                    bind:value={formData.email}
                  />
                </div>
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      for="password"
                      class="block text-sm font-medium text-gray-700 mb-2"
                      >Mot de passe *</label
                    >
                    <div class="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                        placeholder="Votre mot de passe"
                        required={true}
                        name="password"
                        bind:value={formData.password}
                      /><button
                        onclick={() => {
                          showPassword = !showPassword;
                        }}
                        type="button"
                        class="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <i class="ri-eye-line text-gray-400 hover:text-gray-600"
                        ></i>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label
                      for="confirmPassword"
                      class="block text-sm font-medium text-gray-700 mb-2"
                      >Confirmer le mot de passe *</label
                    >
                    <div class="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="confirmPassword"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                        placeholder="Confirmez votre mot de passe"
                        required={true}
                        name="confirmPassword"
                        bind:value={formData.confirmPassword}
                      /><button
                        onclick={() => {
                          showPassword = !showPassword;
                        }}
                        type="button"
                        class="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <i class="ri-eye-line text-gray-400 hover:text-gray-600"
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {:else if step === 2}
            <FormStep {values} formdata={formData} />
          {:else if step === 3 && intermed == 0}
            <FormStep2 formdata={formData} />
          {/if}
          {#if intermed == 1 && step === 3}
            <Intermed1 formdata={formData} values={values} />
          {/if}
          {#if step === 4}
            <FormStep3 formData={formData} />
          {:else if step == 5}
          <LastSteps formdata={formData} />
          {:else if step == 6}
            <div class="text-center">
              <h2 class="text-xl font-semibold text-gray-900 mb-6">
                Finalisation de l'inscription
              </h2>
              <Recap formdata={formData} values={values} />
              {#if isPaiementProcessing}
                <p class="text-purple-600 mb-4">
                  Traitement du paiement, veuillez patienter...
                </p>
              {:else if authenticating}
                <p class="text-purple-600 mb-4">
                  Authentification en cours, veuillez patienter...
                </p>
              {:else if isPaiementDone}
                <p class="text-green-600 mb-4">
                  Paiement effectué avec succès !
                </p>
              {:else if message}
                <p class="text-red-600 mb-4">{message}</p>
              {:else}
                <p class="text-gray-700 mb-4">
                  Cliquez sur "Terminer" pour finaliser votre inscription et
                  procéder au paiement.
                </p>
              {/if}
            </div>
           {/if}

          <div class="flex justify-between mt-8 pt-6 border-t">
            <button
              onclick={() => {
                prevStep();
              }}
              hidden={step === 1}
              type="button"
              disabled={step === 1}
              class="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              Précédent</button
            >
            {#if lastStep}
              <button
                onclick={() => {
                  clickPaiement();
                }}
                type="button"
                class="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                Terminer
              </button>
            {:else}
              <button
                onclick={() => {
                  nextStep();
                }}
                type="button"
                disabled={lastStep}
                class="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                Suivant
              </button>
            {/if}
          </div>
        </form>
      </div>
     
    </div>
  </div>

  <FooterNew />
</main>
{#if isModalOpen == true}
  <Modal isOpen={isModalOpen} {pdfUrl} onClose={closeModal} />
{/if}

<style>
  @import url("https://cdn.jsdelivr.net/npm/remixicon@4.6.0/fonts/remixicon.min.css");
  *,
  :after,
  :before {
    --tw-border-spacing-x: 0;
    --tw-border-spacing-y: 0;
    --tw-translate-x: 0;
    --tw-translate-y: 0;
    --tw-rotate: 0;
    --tw-skew-x: 0;
    --tw-skew-y: 0;
    --tw-scale-x: 1;
    --tw-scale-y: 1;
    --tw-pan-x: ;
    --tw-pan-y: ;
    --tw-pinch-zoom: ;
    --tw-scroll-snap-strictness: proximity;
    --tw-gradient-from-position: ;
    --tw-gradient-via-position: ;
    --tw-gradient-to-position: ;
    --tw-ordinal: ;
    --tw-slashed-zero: ;
    --tw-numeric-figure: ;
    --tw-numeric-spacing: ;
    --tw-numeric-fraction: ;
    --tw-ring-inset: ;
    --tw-ring-offset-width: 0px;
    --tw-ring-offset-color: #fff;
    --tw-ring-color: rgb(59 130 246/0.5);
    --tw-ring-offset-shadow: 0 0 #0000;
    --tw-ring-shadow: 0 0 #0000;
    --tw-shadow: 0 0 #0000;
    --tw-shadow-colored: 0 0 #0000;
    --tw-blur: ;
    --tw-brightness: ;
    --tw-contrast: ;
    --tw-grayscale: ;
    --tw-hue-rotate: ;
    --tw-invert: ;
    --tw-saturate: ;
    --tw-sepia: ;
    --tw-drop-shadow: ;
    --tw-backdrop-blur: ;
    --tw-backdrop-brightness: ;
    --tw-backdrop-contrast: ;
    --tw-backdrop-grayscale: ;
    --tw-backdrop-hue-rotate: ;
    --tw-backdrop-invert: ;
    --tw-backdrop-opacity: ;
    --tw-backdrop-saturate: ;
    --tw-backdrop-sepia: ;
    --tw-contain-size: ;
    --tw-contain-layout: ;
    --tw-contain-paint: ;
    --tw-contain-style: ;
  }
  ::backdrop {
    --tw-border-spacing-x: 0;
    --tw-border-spacing-y: 0;
    --tw-translate-x: 0;
    --tw-translate-y: 0;
    --tw-rotate: 0;
    --tw-skew-x: 0;
    --tw-skew-y: 0;
    --tw-scale-x: 1;
    --tw-scale-y: 1;
    --tw-pan-x: ;
    --tw-pan-y: ;
    --tw-pinch-zoom: ;
    --tw-scroll-snap-strictness: proximity;
    --tw-gradient-from-position: ;
    --tw-gradient-via-position: ;
    --tw-gradient-to-position: ;
    --tw-ordinal: ;
    --tw-slashed-zero: ;
    --tw-numeric-figure: ;
    --tw-numeric-spacing: ;
    --tw-numeric-fraction: ;
    --tw-ring-inset: ;
    --tw-ring-offset-width: 0px;
    --tw-ring-offset-color: #fff;
    --tw-ring-color: rgb(59 130 246/0.5);
    --tw-ring-offset-shadow: 0 0 #0000;
    --tw-ring-shadow: 0 0 #0000;
    --tw-shadow: 0 0 #0000;
    --tw-shadow-colored: 0 0 #0000;
    --tw-blur: ;
    --tw-brightness: ;
    --tw-contrast: ;
    --tw-grayscale: ;
    --tw-hue-rotate: ;
    --tw-invert: ;
    --tw-saturate: ;
    --tw-sepia: ;
    --tw-drop-shadow: ;
    --tw-backdrop-blur: ;
    --tw-backdrop-brightness: ;
    --tw-backdrop-contrast: ;
    --tw-backdrop-grayscale: ;
    --tw-backdrop-hue-rotate: ;
    --tw-backdrop-invert: ;
    --tw-backdrop-opacity: ;
    --tw-backdrop-saturate: ;
    --tw-backdrop-sepia: ;
    --tw-contain-size: ;
    --tw-contain-layout: ;
    --tw-contain-paint: ;
    --tw-contain-style: ;
  }
  /*
! tailwindcss v3.4.17 | MIT License | https://tailwindcss.com
*/
  *,
  :after,
  :before {
    box-sizing: border-box;
    border: 0 solid #e5e7eb;
  }
  :after,
  :before {
    --tw-content: "";
  }
  :host,
  html {
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;
    font-family:
      ui-sans-serif,
      system-ui,
      sans-serif,
      Apple Color Emoji,
      Segoe UI Emoji,
      Segoe UI Symbol,
      Noto Color Emoji;
    font-feature-settings: normal;
    font-variation-settings: normal;
    -webkit-tap-highlight-color: transparent;
  }
  body {
    margin: 0;
    line-height: inherit;
  }
  hr {
    height: 0;
    color: inherit;
    border-top-width: 1px;
  }
  abbr:where([title]) {
    -webkit-text-decoration: underline dotted;
    text-decoration: underline dotted;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: inherit;
    font-weight: inherit;
  }
  a {
    color: inherit;
    text-decoration: inherit;
  }
  b,
  strong {
    font-weight: bolder;
  }
  code,
  kbd,
  pre,
  samp {
    font-family:
      ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      Liberation Mono,
      Courier New,
      monospace;
    font-feature-settings: normal;
    font-variation-settings: normal;
    font-size: 1em;
  }
  small {
    font-size: 80%;
  }
  sub,
  sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }
  sub {
    bottom: -0.25em;
  }
  sup {
    top: -0.5em;
  }
  table {
    text-indent: 0;
    border-color: inherit;
    border-collapse: collapse;
  }
  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: inherit;
    font-feature-settings: inherit;
    font-variation-settings: inherit;
    font-size: 100%;
    font-weight: inherit;
    line-height: inherit;
    letter-spacing: inherit;
    color: inherit;
    margin: 0;
    padding: 0;
  }
  button,
  select {
    text-transform: none;
  }
  button,
  input:where([type="button"]),
  input:where([type="reset"]),
  input:where([type="submit"]) {
    -webkit-appearance: button;
    background-color: transparent;
    background-image: none;
  }
  :-moz-focusring {
    outline: auto;
  }
  :-moz-ui-invalid {
    box-shadow: none;
  }
  progress {
    vertical-align: baseline;
  }
  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    height: auto;
  }
  [type="search"] {
    -webkit-appearance: textfield;
    outline-offset: -2px;
  }
  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }
  ::-webkit-file-upload-button {
    -webkit-appearance: button;
    font: inherit;
  }
  summary {
    display: list-item;
  }
  blockquote,
  dd,
  dl,
  figure,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  hr,
  p,
  pre {
    margin: 0;
  }
  fieldset {
    margin: 0;
  }
  fieldset,
  legend {
    padding: 0;
  }
  menu,
  ol,
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  dialog {
    padding: 0;
  }
  textarea {
    resize: vertical;
  }
  input::-moz-placeholder,
  textarea::-moz-placeholder {
    opacity: 1;
    color: #9ca3af;
  }
  input::placeholder,
  textarea::placeholder {
    opacity: 1;
    color: #9ca3af;
  }
  [role="button"],
  button {
    cursor: pointer;
  }
  :disabled {
    cursor: default;
  }
  audio,
  canvas,
  embed,
  iframe,
  img,
  object,
  svg,
  video {
    display: block;
    vertical-align: middle;
  }
  img,
  video {
    max-width: 100%;
    height: auto;
  }
  [hidden]:where(:not([hidden="until-found"])) {
    display: none;
  }
  .fixed {
    position: fixed;
  }
  .absolute {
    position: absolute;
  }
  .relative {
    position: relative;
  }
  .inset-0 {
    inset: 0;
  }
  .-bottom-4 {
    bottom: -1rem;
  }
  .-left-4 {
    left: -1rem;
  }
  .-right-4 {
    right: -1rem;
  }
  .-top-4 {
    top: -1rem;
  }
  .bottom-8 {
    bottom: 2rem;
  }
  .left-1\/2 {
    left: 50%;
  }
  .left-4 {
    left: 1rem;
  }
  .right-4 {
    right: 1rem;
  }
  .right-8 {
    right: 2rem;
  }
  .top-0 {
    top: 0;
  }
  .top-1\/2 {
    top: 50%;
  }
  .z-10 {
    z-index: 10;
  }
  .z-50 {
    z-index: 50;
  }
  .order-1 {
    order: 1;
  }
  .order-2 {
    order: 2;
  }
  .mx-1 {
    margin-left: 0.25rem;
    margin-right: 0.25rem;
  }
  .mx-2 {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
  .mx-auto {
    margin-left: auto;
    margin-right: auto;
  }
  .mb-1 {
    margin-bottom: 0.25rem;
  }
  .mb-12 {
    margin-bottom: 3rem;
  }
  .mb-16 {
    margin-bottom: 4rem;
  }
  .mb-2 {
    margin-bottom: 0.5rem;
  }
  .mb-3 {
    margin-bottom: 0.75rem;
  }
  .mb-4 {
    margin-bottom: 1rem;
  }
  .mb-6 {
    margin-bottom: 1.5rem;
  }
  .mb-8 {
    margin-bottom: 2rem;
  }
  .ml-10 {
    margin-left: 2.5rem;
  }
  .ml-2 {
    margin-left: 0.5rem;
  }
  .mt-0\.5 {
    margin-top: 0.125rem;
  }
  .mt-1 {
    margin-top: 0.25rem;
  }
  .mt-12 {
    margin-top: 3rem;
  }
  .mt-2 {
    margin-top: 0.5rem;
  }
  .mt-4 {
    margin-top: 1rem;
  }
  .mt-6 {
    margin-top: 1.5rem;
  }
  .mt-8 {
    margin-top: 2rem;
  }
  .block {
    display: block;
  }
  .flex {
    display: flex;
  }
  .grid {
    display: grid;
  }
  .hidden {
    display: none;
  }
  .h-1 {
    height: 0.25rem;
  }
  .h-10 {
    height: 2.5rem;
  }
  .h-12 {
    height: 3rem;
  }
  .h-16 {
    height: 4rem;
  }
  .h-20 {
    height: 5rem;
  }
  .h-24 {
    height: 6rem;
  }
  .h-3 {
    height: 0.75rem;
  }
  .h-32 {
    height: 8rem;
  }
  .h-4 {
    height: 1rem;
  }
  .h-5 {
    height: 1.25rem;
  }
  .h-6 {
    height: 1.5rem;
  }
  .h-8 {
    height: 2rem;
  }
  .h-auto {
    height: auto;
  }
  .h-screen {
    height: 100vh;
  }
  .min-h-screen {
    min-height: 100vh;
  }
  .w-10 {
    width: 2.5rem;
  }
  .w-12 {
    width: 3rem;
  }
  .w-16 {
    width: 4rem;
  }
  .w-20 {
    width: 5rem;
  }
  .w-24 {
    width: 6rem;
  }
  .w-3 {
    width: 0.75rem;
  }
  .w-32 {
    width: 8rem;
  }
  .w-4 {
    width: 1rem;
  }
  .w-5 {
    width: 1.25rem;
  }
  .w-6 {
    width: 1.5rem;
  }
  .w-8 {
    width: 2rem;
  }
  .w-auto {
    width: auto;
  }
  .w-full {
    width: 100%;
  }
  .max-w-3xl {
    max-width: 48rem;
  }
  .max-w-4xl {
    max-width: 56rem;
  }
  .max-w-7xl {
    max-width: 80rem;
  }
  .max-w-md {
    max-width: 28rem;
  }
  .flex-shrink-0 {
    flex-shrink: 0;
  }
  .-translate-x-1\/2 {
    --tw-translate-x: -50%;
  }
  .-translate-x-1\/2,
  .-translate-y-1\/2 {
    transform: translate(var(--tw-translate-x), var(--tw-translate-y))
      rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y))
      scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  }
  .-translate-y-1\/2 {
    --tw-translate-y: -50%;
  }
  .transform {
    transform: translate(var(--tw-translate-x), var(--tw-translate-y))
      rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y))
      scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  }
  @keyframes spin {
    to {
      transform: rotate(1turn);
    }
  }
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  .cursor-pointer {
    cursor: pointer;
  }
  .resize-none {
    resize: none;
  }
  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  .grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .flex-col {
    flex-direction: column;
  }
  .items-start {
    align-items: flex-start;
  }
  .items-center {
    align-items: center;
  }
  .items-baseline {
    align-items: baseline;
  }
  .justify-center {
    justify-content: center;
  }
  .justify-between {
    justify-content: space-between;
  }
  .gap-12 {
    gap: 3rem;
  }
  .gap-4 {
    gap: 1rem;
  }
  .gap-6 {
    gap: 1.5rem;
  }
  .gap-8 {
    gap: 2rem;
  }
  .space-x-2 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-x-reverse: 0;
    margin-right: calc(0.5rem * var(--tw-space-x-reverse));
    margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));
  }
  .space-x-3 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-x-reverse: 0;
    margin-right: calc(0.75rem * var(--tw-space-x-reverse));
    margin-left: calc(0.75rem * calc(1 - var(--tw-space-x-reverse)));
  }
  .space-x-4 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-x-reverse: 0;
    margin-right: calc(1rem * var(--tw-space-x-reverse));
    margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));
  }
  .space-x-8 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-x-reverse: 0;
    margin-right: calc(2rem * var(--tw-space-x-reverse));
    margin-left: calc(2rem * calc(1 - var(--tw-space-x-reverse)));
  }
  .space-y-1 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-y-reverse: 0;
    margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));
    margin-bottom: calc(0.25rem * var(--tw-space-y-reverse));
  }
  .space-y-3 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-y-reverse: 0;
    margin-top: calc(0.75rem * calc(1 - var(--tw-space-y-reverse)));
    margin-bottom: calc(0.75rem * var(--tw-space-y-reverse));
  }
  .space-y-4 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-y-reverse: 0;
    margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));
    margin-bottom: calc(1rem * var(--tw-space-y-reverse));
  }
  .space-y-6 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-y-reverse: 0;
    margin-top: calc(1.5rem * calc(1 - var(--tw-space-y-reverse)));
    margin-bottom: calc(1.5rem * var(--tw-space-y-reverse));
  }
  .space-y-8 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-y-reverse: 0;
    margin-top: calc(2rem * calc(1 - var(--tw-space-y-reverse)));
    margin-bottom: calc(2rem * var(--tw-space-y-reverse));
  }
  .overflow-hidden {
    overflow: hidden;
  }
  .whitespace-nowrap {
    white-space: nowrap;
  }
  .rounded {
    border-radius: 0.25rem;
  }
  .rounded-2xl {
    border-radius: 1rem;
  }
  .rounded-full {
    border-radius: 9999px;
  }
  .rounded-lg {
    border-radius: 0.5rem;
  }
  .rounded-xl {
    border-radius: 0.75rem;
  }
  .border {
    border-width: 1px;
  }
  .border-2 {
    border-width: 2px;
  }
  .border-t {
    border-top-width: 1px;
  }
  .border-blue-600 {
    --tw-border-opacity: 1;
    border-color: rgb(37 99 235 / var(--tw-border-opacity, 1));
  }
  .border-gray-200 {
    --tw-border-opacity: 1;
    border-color: rgb(229 231 235 / var(--tw-border-opacity, 1));
  }
  .border-gray-300 {
    --tw-border-opacity: 1;
    border-color: rgb(209 213 219 / var(--tw-border-opacity, 1));
  }
  .border-gray-800 {
    --tw-border-opacity: 1;
    border-color: rgb(31 41 55 / var(--tw-border-opacity, 1));
  }
  .border-red-200 {
    --tw-border-opacity: 1;
    border-color: rgb(254 202 202 / var(--tw-border-opacity, 1));
  }
  .border-transparent {
    border-color: transparent;
  }
  .border-white {
    --tw-border-opacity: 1;
    border-color: rgb(255 255 255 / var(--tw-border-opacity, 1));
  }
  .border-yellow-200 {
    --tw-border-opacity: 1;
    border-color: rgb(254 240 138 / var(--tw-border-opacity, 1));
  }
  .border-t-transparent {
    border-top-color: transparent;
  }
  .bg-black\/20 {
    background-color: rgb(0 0 0/0.2);
  }
  .bg-black\/40 {
    background-color: rgb(0 0 0/0.4);
  }
  .bg-blue-100 {
    --tw-bg-opacity: 1;
    background-color: rgb(219 234 254 / var(--tw-bg-opacity, 1));
  }
  .bg-blue-400 {
    --tw-bg-opacity: 1;
    background-color: rgb(96 165 250 / var(--tw-bg-opacity, 1));
  }
  .bg-blue-50 {
    --tw-bg-opacity: 1;
    background-color: rgb(239 246 255 / var(--tw-bg-opacity, 1));
  }
  .bg-blue-500 {
    --tw-bg-opacity: 1;
    background-color: rgb(59 130 246 / var(--tw-bg-opacity, 1));
  }
  .bg-blue-600 {
    --tw-bg-opacity: 1;
    background-color: rgb(37 99 235 / var(--tw-bg-opacity, 1));
  }
  .bg-blue-800 {
    --tw-bg-opacity: 1;
    background-color: rgb(30 64 175 / var(--tw-bg-opacity, 1));
  }
  .bg-gray-200 {
    --tw-bg-opacity: 1;
    background-color: rgb(229 231 235 / var(--tw-bg-opacity, 1));
  }
  .bg-gray-50 {
    --tw-bg-opacity: 1;
    background-color: rgb(249 250 251 / var(--tw-bg-opacity, 1));
  }
  .bg-gray-900 {
    --tw-bg-opacity: 1;
    background-color: rgb(17 24 39 / var(--tw-bg-opacity, 1));
  }
  .bg-green-100 {
    --tw-bg-opacity: 1;
    background-color: rgb(220 252 231 / var(--tw-bg-opacity, 1));
  }
  .bg-green-50 {
    --tw-bg-opacity: 1;
    background-color: rgb(240 253 244 / var(--tw-bg-opacity, 1));
  }
  .bg-green-500 {
    --tw-bg-opacity: 1;
    background-color: rgb(34 197 94 / var(--tw-bg-opacity, 1));
  }
  .bg-green-600 {
    --tw-bg-opacity: 1;
    background-color: rgb(22 163 74 / var(--tw-bg-opacity, 1));
  }
  .bg-orange-500 {
    --tw-bg-opacity: 1;
    background-color: rgb(249 115 22 / var(--tw-bg-opacity, 1));
  }
  .bg-pink-600 {
    --tw-bg-opacity: 1;
    background-color: rgb(219 39 119 / var(--tw-bg-opacity, 1));
  }
  .bg-purple-100 {
    --tw-bg-opacity: 1;
    background-color: rgb(243 232 255 / var(--tw-bg-opacity, 1));
  }
  .bg-purple-50 {
    --tw-bg-opacity: 1;
    background-color: rgb(250 245 255 / var(--tw-bg-opacity, 1));
  }
  .bg-purple-500 {
    --tw-bg-opacity: 1;
    background-color: rgb(168 85 247 / var(--tw-bg-opacity, 1));
  }
  .bg-purple-600 {
    --tw-bg-opacity: 1;
    background-color: rgb(147 51 234 / var(--tw-bg-opacity, 1));
  }
  .bg-red-100 {
    --tw-bg-opacity: 1;
    background-color: rgb(254 226 226 / var(--tw-bg-opacity, 1));
  }
  .bg-red-50 {
    --tw-bg-opacity: 1;
    background-color: rgb(254 242 242 / var(--tw-bg-opacity, 1));
  }
  .bg-red-500 {
    --tw-bg-opacity: 1;
    background-color: rgb(239 68 68 / var(--tw-bg-opacity, 1));
  }
  .bg-teal-500 {
    --tw-bg-opacity: 1;
    background-color: rgb(20 184 166 / var(--tw-bg-opacity, 1));
  }
  .bg-white {
    --tw-bg-opacity: 1;
    background-color: rgb(255 255 255 / var(--tw-bg-opacity, 1));
  }
  .bg-white\/10 {
    background-color: rgb(255 255 255/0.1);
  }
  .bg-white\/20 {
    background-color: rgb(255 255 255/0.2);
  }
  .bg-white\/50 {
    background-color: rgb(255 255 255/0.5);
  }
  .bg-yellow-50 {
    --tw-bg-opacity: 1;
    background-color: rgb(254 252 232 / var(--tw-bg-opacity, 1));
  }
  .bg-gradient-to-br {
    background-image: linear-gradient(
      to bottom right,
      var(--tw-gradient-stops)
    );
  }
  .from-blue-50 {
    --tw-gradient-from: #eff6ff var(--tw-gradient-from-position);
    --tw-gradient-to: rgb(239 246 255/0) var(--tw-gradient-to-position);
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
  }
  .from-blue-600 {
    --tw-gradient-from: #2563eb var(--tw-gradient-from-position);
    --tw-gradient-to: rgb(37 99 235/0) var(--tw-gradient-to-position);
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
  }
  .to-purple-50 {
    --tw-gradient-to: #faf5ff var(--tw-gradient-to-position);
  }
  .to-purple-700 {
    --tw-gradient-to: #7e22ce var(--tw-gradient-to-position);
  }
  .object-contain {
    -o-object-fit: contain;
    object-fit: contain;
  }
  .p-3 {
    padding: 0.75rem;
  }
  .p-4 {
    padding: 1rem;
  }
  .p-6 {
    padding: 1.5rem;
  }
  .p-8 {
    padding: 2rem;
  }
  .px-2 {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  .px-3 {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
  .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .px-6 {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  .px-8 {
    padding-left: 2rem;
    padding-right: 2rem;
  }
  .py-12 {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
  .py-16 {
    padding-top: 4rem;
    padding-bottom: 4rem;
  }
  .py-2 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  .py-20 {
    padding-top: 5rem;
    padding-bottom: 5rem;
  }
  .py-3 {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }
  .py-4 {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  .py-6 {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }
  .pb-3 {
    padding-bottom: 0.75rem;
  }
  .pl-12 {
    padding-left: 3rem;
  }
  .pr-12 {
    padding-right: 3rem;
  }
  .pr-8 {
    padding-right: 2rem;
  }
  .pt-16 {
    padding-top: 4rem;
  }
  .pt-2 {
    padding-top: 0.5rem;
  }
  .pt-6 {
    padding-top: 1.5rem;
  }
  .text-center {
    text-align: center;
  }
  .text-right {
    text-align: right;
  }
  .text-2xl {
    font-size: 1.5rem;
    line-height: 2rem;
  }
  .text-3xl {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }
  .text-4xl {
    font-size: 2.25rem;
    line-height: 2.5rem;
  }
  .text-5xl {
    font-size: 3rem;
    line-height: 1;
  }
  .text-base {
    font-size: 1rem;
    line-height: 1.5rem;
  }
  .text-lg {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
  .text-sm {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  .text-xl {
    font-size: 1.25rem;
    line-height: 1.75rem;
  }
  .text-xs {
    font-size: 0.75rem;
    line-height: 1rem;
  }
  .font-bold {
    font-weight: 700;
  }
  .font-medium {
    font-weight: 500;
  }
  .font-semibold {
    font-weight: 600;
  }
  .leading-relaxed {
    line-height: 1.625;
  }
  .leading-tight {
    line-height: 1.25;
  }
  .text-blue-100 {
    --tw-text-opacity: 1;
    color: rgb(219 234 254 / var(--tw-text-opacity, 1));
  }
  .text-blue-400 {
    --tw-text-opacity: 1;
    color: rgb(96 165 250 / var(--tw-text-opacity, 1));
  }
  .text-blue-600 {
    --tw-text-opacity: 1;
    color: rgb(37 99 235 / var(--tw-text-opacity, 1));
  }
  .text-blue-800 {
    --tw-text-opacity: 1;
    color: rgb(30 64 175 / var(--tw-text-opacity, 1));
  }
  .text-blue-900 {
    --tw-text-opacity: 1;
    color: rgb(30 58 138 / var(--tw-text-opacity, 1));
  }
  .text-gray-100 {
    --tw-text-opacity: 1;
    color: rgb(243 244 246 / var(--tw-text-opacity, 1));
  }
  .text-gray-300 {
    --tw-text-opacity: 1;
    color: rgb(209 213 219 / var(--tw-text-opacity, 1));
  }
  .text-gray-400 {
    --tw-text-opacity: 1;
    color: rgb(156 163 175 / var(--tw-text-opacity, 1));
  }
  .text-gray-500 {
    --tw-text-opacity: 1;
    color: rgb(107 114 128 / var(--tw-text-opacity, 1));
  }
  .text-gray-600 {
    --tw-text-opacity: 1;
    color: rgb(75 85 99 / var(--tw-text-opacity, 1));
  }
  .text-gray-700 {
    --tw-text-opacity: 1;
    color: rgb(55 65 81 / var(--tw-text-opacity, 1));
  }
  .text-gray-900 {
    --tw-text-opacity: 1;
    color: rgb(17 24 39 / var(--tw-text-opacity, 1));
  }
  .text-green-600 {
    --tw-text-opacity: 1;
    color: rgb(22 163 74 / var(--tw-text-opacity, 1));
  }
  .text-green-700 {
    --tw-text-opacity: 1;
    color: rgb(21 128 61 / var(--tw-text-opacity, 1));
  }
  .text-purple-800 {
    --tw-text-opacity: 1;
    color: rgb(107 33 168 / var(--tw-text-opacity, 1));
  }
  .text-purple-900 {
    --tw-text-opacity: 1;
    color: rgb(88 28 135 / var(--tw-text-opacity, 1));
  }
  .text-red-700 {
    --tw-text-opacity: 1;
    color: rgb(185 28 28 / var(--tw-text-opacity, 1));
  }
  .text-white {
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity, 1));
  }
  .text-white\/80 {
    color: rgb(255 255 255/0.8);
  }
  .text-white\/90 {
    color: rgb(255 255 255/0.9);
  }
  .text-yellow-600 {
    --tw-text-opacity: 1;
    color: rgb(202 138 4 / var(--tw-text-opacity, 1));
  }
  .text-yellow-800 {
    --tw-text-opacity: 1;
    color: rgb(133 77 14 / var(--tw-text-opacity, 1));
  }
  .opacity-0 {
    opacity: 0;
  }
  .opacity-100 {
    opacity: 1;
  }
  .opacity-50 {
    opacity: 0.5;
  }
  .opacity-90 {
    opacity: 0.9;
  }
  .shadow-lg {
    --tw-shadow: 0 10px 15px -3px rgb(0 0 0/0.1), 0 4px 6px -4px rgb(0 0 0/0.1);
    --tw-shadow-colored:
      0 10px 15px -3px var(--tw-shadow-color),
      0 4px 6px -4px var(--tw-shadow-color);
  }
  .shadow-lg,
  .shadow-md {
    box-shadow:
      var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
      var(--tw-shadow);
  }
  .shadow-md {
    --tw-shadow: 0 4px 6px -1px rgb(0 0 0/0.1), 0 2px 4px -2px rgb(0 0 0/0.1);
    --tw-shadow-colored:
      0 4px 6px -1px var(--tw-shadow-color),
      0 2px 4px -2px var(--tw-shadow-color);
  }
  .shadow-sm {
    --tw-shadow: 0 1px 2px 0 rgb(0 0 0/0.05);
    --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
  }
  .shadow-sm,
  .shadow-xl {
    box-shadow:
      var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
      var(--tw-shadow);
  }
  .shadow-xl {
    --tw-shadow:
      0 20px 25px -5px rgb(0 0 0/0.1), 0 8px 10px -6px rgb(0 0 0/0.1);
    --tw-shadow-colored:
      0 20px 25px -5px var(--tw-shadow-color),
      0 8px 10px -6px var(--tw-shadow-color);
  }
  .backdrop-blur-sm {
    --tw-backdrop-blur: blur(4px);
    -webkit-backdrop-filter: var(--tw-backdrop-blur)
      var(--tw-backdrop-brightness) var(--tw-backdrop-contrast)
      var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
      var(--tw-backdrop-invert) var(--tw-backdrop-opacity)
      var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
    backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
      var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale)
      var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert)
      var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
      var(--tw-backdrop-sepia);
  }
  .transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 0.15s;
  }
  .transition-colors {
    transition-property:
      color, background-color, border-color, text-decoration-color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 0.15s;
  }
  .transition-opacity {
    transition-property: opacity;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 0.15s;
  }
  .transition-shadow {
    transition-property: box-shadow;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 0.15s;
  }
  .duration-1000 {
    transition-duration: 1s;
  }
  .duration-300 {
    transition-duration: 0.3s;
  }
  .hover\:border-blue-500:hover {
    --tw-border-opacity: 1;
    border-color: rgb(59 130 246 / var(--tw-border-opacity, 1));
  }
  .hover\:border-blue-600:hover {
    --tw-border-opacity: 1;
    border-color: rgb(37 99 235 / var(--tw-border-opacity, 1));
  }
  .hover\:border-purple-500:hover {
    --tw-border-opacity: 1;
    border-color: rgb(168 85 247 / var(--tw-border-opacity, 1));
  }
  .hover\:bg-blue-100:hover {
    --tw-bg-opacity: 1;
    background-color: rgb(219 234 254 / var(--tw-bg-opacity, 1));
  }
  .hover\:bg-blue-50:hover {
    --tw-bg-opacity: 1;
    background-color: rgb(239 246 255 / var(--tw-bg-opacity, 1));
  }
  .hover\:bg-blue-500:hover {
    --tw-bg-opacity: 1;
    background-color: rgb(59 130 246 / var(--tw-bg-opacity, 1));
  }
  .hover\:bg-blue-700:hover {
    --tw-bg-opacity: 1;
    background-color: rgb(29 78 216 / var(--tw-bg-opacity, 1));
  }
  .hover\:bg-blue-900:hover {
    --tw-bg-opacity: 1;
    background-color: rgb(30 58 138 / var(--tw-bg-opacity, 1));
  }
  .hover\:bg-gray-50:hover {
    --tw-bg-opacity: 1;
    background-color: rgb(249 250 251 / var(--tw-bg-opacity, 1));
  }
  .hover\:bg-green-100:hover {
    --tw-bg-opacity: 1;
    background-color: rgb(220 252 231 / var(--tw-bg-opacity, 1));
  }
  .hover\:bg-green-700:hover {
    --tw-bg-opacity: 1;
    background-color: rgb(21 128 61 / var(--tw-bg-opacity, 1));
  }
  .hover\:bg-pink-700:hover {
    --tw-bg-opacity: 1;
    background-color: rgb(190 24 93 / var(--tw-bg-opacity, 1));
  }
  .hover\:bg-purple-700:hover {
    --tw-bg-opacity: 1;
    background-color: rgb(126 34 206 / var(--tw-bg-opacity, 1));
  }
  .hover\:bg-white:hover {
    --tw-bg-opacity: 1;
    background-color: rgb(255 255 255 / var(--tw-bg-opacity, 1));
  }
  .hover\:bg-white\/20:hover {
    background-color: rgb(255 255 255/0.2);
  }
  .hover\:bg-white\/30:hover {
    background-color: rgb(255 255 255/0.3);
  }
  .hover\:text-blue-300:hover {
    --tw-text-opacity: 1;
    color: rgb(147 197 253 / var(--tw-text-opacity, 1));
  }
  .hover\:text-blue-600:hover {
    --tw-text-opacity: 1;
    color: rgb(37 99 235 / var(--tw-text-opacity, 1));
  }
  .hover\:text-blue-700:hover {
    --tw-text-opacity: 1;
    color: rgb(29 78 216 / var(--tw-text-opacity, 1));
  }
  .hover\:text-gray-600:hover {
    --tw-text-opacity: 1;
    color: rgb(75 85 99 / var(--tw-text-opacity, 1));
  }
  .hover\:text-gray-900:hover {
    --tw-text-opacity: 1;
    color: rgb(17 24 39 / var(--tw-text-opacity, 1));
  }
  .hover\:text-white:hover {
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity, 1));
  }
  .hover\:shadow-2xl:hover {
    --tw-shadow: 0 25px 50px -12px rgb(0 0 0/0.25);
    --tw-shadow-colored: 0 25px 50px -12px var(--tw-shadow-color);
  }
  .hover\:shadow-2xl:hover,
  .hover\:shadow-xl:hover {
    box-shadow:
      var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
      var(--tw-shadow);
  }
  .hover\:shadow-xl:hover {
    --tw-shadow:
      0 20px 25px -5px rgb(0 0 0/0.1), 0 8px 10px -6px rgb(0 0 0/0.1);
    --tw-shadow-colored:
      0 20px 25px -5px var(--tw-shadow-color),
      0 8px 10px -6px var(--tw-shadow-color);
  }
  .focus\:border-transparent:focus {
    border-color: transparent;
  }
  .focus\:text-gray-900:focus {
    --tw-text-opacity: 1;
    color: rgb(17 24 39 / var(--tw-text-opacity, 1));
  }
  .focus\:outline-none:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }
  .focus\:ring-2:focus {
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
      var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
      calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow:
      var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
      var(--tw-shadow, 0 0 #0000);
  }
  .focus\:ring-blue-500:focus {
    --tw-ring-opacity: 1;
    --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity, 1));
  }
  .focus\:ring-purple-500:focus {
    --tw-ring-opacity: 1;
    --tw-ring-color: rgb(168 85 247 / var(--tw-ring-opacity, 1));
  }
  .disabled\:cursor-not-allowed:disabled {
    cursor: not-allowed;
  }
  .disabled\:opacity-50:disabled {
    opacity: 0.5;
  }
  .group:hover .group-hover\:scale-105 {
    --tw-scale-x: 1.05;
    --tw-scale-y: 1.05;
    transform: translate(var(--tw-translate-x), var(--tw-translate-y))
      rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y))
      scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
  }
  @media (min-width: 640px) {
    .sm\:grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .sm\:flex-row {
      flex-direction: row;
    }
    .sm\:px-3 {
      padding-left: 0.75rem;
      padding-right: 0.75rem;
    }
    .sm\:px-6 {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
  }
  @media (min-width: 768px) {
    .md\:block {
      display: block;
    }
    .md\:hidden {
      display: none;
    }
    .md\:grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .md\:grid-cols-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .md\:grid-cols-5 {
      grid-template-columns: repeat(5, minmax(0, 1fr));
    }
    .md\:text-2xl {
      font-size: 1.5rem;
      line-height: 2rem;
    }
    .md\:text-3xl {
      font-size: 1.875rem;
      line-height: 2.25rem;
    }
    .md\:text-4xl {
      font-size: 2.25rem;
      line-height: 2.5rem;
    }
    .md\:text-5xl {
      font-size: 3rem;
      line-height: 1;
    }
    .md\:text-6xl {
      font-size: 3.75rem;
      line-height: 1;
    }
  }
  @media (min-width: 1024px) {
    .lg\:order-1 {
      order: 1;
    }
    .lg\:order-2 {
      order: 2;
    }
    .lg\:grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .lg\:px-8 {
      padding-left: 2rem;
      padding-right: 2rem;
    }
  }
  @font-face {
    font-family: Inter;
    font-style: normal;
    font-weight: 100 900;
    font-display: swap;
    unicode-range:
      u+0460-052f, u+1c80-1c8a, u+20b4, u+2de0-2dff, u+a640-a69f, u+fe2e-fe2f;
  }
  @font-face {
    font-family: Inter;
    font-style: normal;
    font-weight: 100 900;
    font-display: swap;
    unicode-range: u+0301, u+0400-045f, u+0490-0491, u+04b0-04b1, u+2116;
  }
  @font-face {
    font-family: Inter;
    font-style: normal;
    font-weight: 100 900;
    font-display: swap;
    unicode-range: u+1f??;
  }
  @font-face {
    font-family: Inter;
    font-style: normal;
    font-weight: 100 900;
    font-display: swap;
    unicode-range:
      u+0370-0377, u+037a-037f, u+0384-038a, u+038c, u+038e-03a1, u+03a3-03ff;
  }
  @font-face {
    font-family: Inter;
    font-style: normal;
    font-weight: 100 900;
    font-display: swap;
    unicode-range:
      u+0102-0103, u+0110-0111, u+0128-0129, u+0168-0169, u+01a0-01a1,
      u+01af-01b0, u+0300-0301, u+0303-0304, u+0308-0309, u+0323, u+0329,
      u+1ea0-1ef9, u+20ab;
  }
  @font-face {
    font-family: Inter;
    font-style: normal;
    font-weight: 100 900;
    font-display: swap;
    unicode-range:
      u+0100-02ba, u+02bd-02c5, u+02c7-02cc, u+02ce-02d7, u+02dd-02ff, u+0304,
      u+0308, u+0329, u+1d00-1dbf, u+1e00-1e9f, u+1ef2-1eff, u+2020,
      u+20a0-20ab, u+20ad-20c0, u+2113, u+2c60-2c7f, u+a720-a7ff;
  }
  @font-face {
    font-family: Inter;
    font-style: normal;
    font-weight: 100 900;
    font-display: swap;
    unicode-range:
      u+00??, u+0131, u+0152-0153, u+02bb-02bc, u+02c6, u+02da, u+02dc, u+0304,
      u+0308, u+0329, u+2000-206f, u+20ac, u+2122, u+2191, u+2193, u+2212,
      u+2215, u+feff, u+fffd;
  }
  @font-face {
    font-family: Inter Fallback;
    src: local("Arial");
    ascent-override: 90.44%;
    descent-override: 22.52%;
    line-gap-override: 0%;
    size-adjust: 107.12%;
  }
  .__className_63c354 {
    font-family:
      Inter,
      Inter Fallback;
    font-style: normal;
  }
</style>
