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
  import InputSelect2 from "$components/inputs/InputSelect2.svelte";
  import InputSelect from "$components/inputs/InputSelect.svelte";
  import Svelecte from "svelecte";
  import SpinnerBlue from "$components/_skeletons/SpinnerBlue.svelte";

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
  let errors: { [key: string]: string } = {};
  let imagePreview: { [key: string]: string } = {};
  function openModal(reference: any) {
    pdfUrl = reference; // ✅ Met à jour la variable réactive
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
    localStorage.clear();
  }

  const validateEmail = (email: string): boolean => {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  const validatePhone = (phone: string): boolean => {
    const re = /^(07|01|05)[0-9]{8}$/;
    return re.test(String(phone));
  };

  const validatePassword = (password: string): boolean => {
    // Au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial
    const re =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  };
  async function checkEmail(email: any) {
    if (!email) return false;

    try {
      const res = await fetch(
        `${BASE_URL_API}/user/check/email/existe/${email}`
      );
      const data = await res.json();
      return data.data; // Assurez-vous que l'API renvoie un objet avec une clé valid
    } catch (error) {
      errorMessageAccountCreation = "Erreur lors de la vérification de l'email.";
      console.error(
        "Erreur lors de la vérification de la transaction :",
        error
      );
      return false;
    }
  }

  // Fonction pour valider les champs d'une étape
  async function validateStep(currentStep: number): Promise<boolean> {
    errors = {}; // Réinitialiser les erreurs
    let isValid = true;

    if (currentStep === 1) {
      // Validation Step 1: Email et mot de passe
      if (!formData.email) {
        errors.email = "L'email est requis";
        isValid = false;
      } else if (!validateEmail(formData.email)) {
        errors.email = "Email invalide, merci de vérifier le format";
        isValid = false;
      } else if (await checkEmail(formData.email)) {
        errors.email = "Cet email est déjà utilisé";
        isValid = false;
      }

      if (!formData.password) {
        errors.password = "Le mot de passe est requis";
        isValid = false;
      } else if (formData.password.length < 8) {
        errors.password = "Le mot de passe doit contenir au moins 8 caractères";
        isValid = false;
      } else if (!validatePassword(formData.password)) {
        errors.password =
          "Le mot de passe doit contenir une majuscule, une minuscule, un chiffre ";
        isValid = false;
      }

      if (!formData.confirmPassword) {
        errors.confirmPassword = "Veuillez confirmer le mot de passe";
        isValid = false;
      } else if (formData.password.length < 8) {
        errors.password = "Le mot de passe doit contenir au moins 8 caractères";
        isValid = false;
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Les mots de passe ne correspondent pas";
        isValid = false;
      } else if (!validatePassword(formData.confirmPassword)) {
        errors.confirmPassword =
          "Le mot de passe doit contenir une majuscule, une minuscule, un chiffre ";
        isValid = false;
      }
      return isValid;
    }

    if (currentStep === 2) {
      // Validation Step 2: Informations personnelles
      const requiredFields = [
        { field: "nom", label: "Nom" },
        { field: "prenoms", label: "Prénoms" },
        { field: "nationalite", label: "Nationalité" },
        { field: "civilite", label: "Civilité" },
        { field: "emailAutre", label: "emailAutre" },
        { field: "dateNaissance", label: "Date de naissance" },
        { field: "situation", label: "Situation" },
      ];

      requiredFields.forEach(({ field, label }) => {
        if (!formData[field]) {
          errors[field] = `${label} est requis(e)`;
          isValid = false;
        }
      });

      // Validation du numéro de téléphone
      if (!formData.numero) {
        errors.numero = "Le numéro de téléphone est requis";
        isValid = false;
      } else if (!validatePhone(formData.numero)) {
        errors.numero = "Format de numéro de téléphone invalide";
        isValid = false;
      }

      // Validation de l'email alternatif s'il est fourni
      if (formData.emailAutre && !validateEmail(formData.emailAutre)) {
        errors.emailAutre = "Format d'email invalide";
        isValid = false;
      }
    }

    if (currentStep === 3) {
      // Validation Step 3: Informations professionnelles
      const requiredFields = [
        { field: "profession", label: "Profession" },
        { field: "diplome", label: "Diplôme" },
        { field: "typeDiplome", label: "Type de diplôme" },
        { field: "dateDiplome", label: "Date du diplôme" },
        { field: "lieuObtentionDiplome", label: "Lieu d'obtention du diplôme" },
        { field: "situationPro", label: "Situation professionnelle" },
        { field: "emailPro", label: "Adresse email professionnel" },
        { field: "dateDiplome", label: "Date d'obtention du diplôme" },
        { field: "lieuDiplome", label: "Lieu d'obtention du diplôme" },
        { field: "datePremierDiplome", label: "Date du premier emploi" },
        { field: "diplome", label: "Dénomination du diplôme" },
        { field: "situationPro", label: "Situation professionnelle" },
        { field: "region", label: "Région sanitaire" },
        { field: "district", label: "District sanitaire" },
        { field: "ville", label: "Ville" },
        { field: "commune", label: "Commune" },
        { field: "quartier", label: "Quartier" },

        {
          field: "professionnel",
          label: "Structure d'exercice professionnel",
        },
        { field: "lieuExercicePro", label: "Lieu d'exercice professionnel" },
        { field: "typeDiplome", label: "Type de diplôme" },
        { field: "statusPro", label: "Status professionnel" },
        { field: "lieuObtentionDiplome", label: "Origine du diplôme" },
      ];

      requiredFields.forEach(({ field, label }) => {
        if (!formData[field]) {
          errors[field] = `${label} est requis(e)`;
          isValid = false;
        }
      });

      // Validation de l'email professionnel s'il est fourni
      if (formData.emailPro && !validateEmail(formData.emailPro)) {
        errors.emailPro = "Format d'email invalide";
        isValid = false;
      }
    }

    if (currentStep === 4) {
      // Validation Step 4: Lieu d'exercice
      const requiredFiles = [
        { field: "photo", label: "Photo d'identité" },
        { field: "cni", label: "Copie CNI (Carte nationale d’identité)" },
        {
          field: "casier",
          label: "Extrait Casier judiciaire (Datant de moins 3 mois)",
        },
        { field: "diplomeFile", label: "Diplôme légalisé" },
        // { field: "certificat", label: "Certificat de résidence (Datant de moins 3 mois)" },
        // { field: "cv", label: "CV" }
      ];

      requiredFiles.forEach(({ field, label }) => {
        if (!formData[field]) {
          errors[field] = `${label} est requis(e)`;
          isValid = false;
        }
      });
    }

    if (currentStep === 5) {
      // Validation Step 5: Documents
      const requiredFiles = [
        { field: "photo", label: "Photo d'identité" },
        { field: "cni", label: "CNI" },
        { field: "diplomeFile", label: "Diplôme" },
        { field: "casier", label: "Casier judiciaire" },
      ];

      requiredFiles.forEach(({ field, label }) => {
        if (!formData[field]) {
          errors[field] = `${label} est requis(e)`;
          isValid = false;
        }
      });
    }
    if (currentStep === 6) {
      // Validation Step 6: Organisation et ordre professionnel
      if (formData.appartenirOrdre === "oui") {
        if (formData.organisationNom.length === 0) {
          errors.organisationNom = "Le nom de l'organisation est requis";
          isValid = false;
        }
      }
    }
    return isValid;
  }

  const nextStep = async () => {
    // Valider l'étape actuelle avant de passer à la suivante
    const validate = await validateStep(step);

    if (!validate && isValidNumeroInscription == false) {
      message = "Veuillez remplir tous les champs obligatoires correctement";
      return;
    }

    message = ""; // Effacer le message d'erreur
    // alert("next step");
    if (isValidNumeroInscription) {
      step == 6;
      lastStep = true;
    }
    step += 1;
    if (step == 6) {
      lastStep = true;
    }
  };

  const prevStep = () => {
    if (step == 6 && isValidNumeroInscription == true) {
      step = 3;
      lastStep = false;
    }
    if (step > 1) {
      step -= 1;
    }

    lastStep = false;
    message = ""; // Effacer les messages d'erreur
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
  ////on recupere le type de personne et les autres trucs a mettre dans le formulaire
  async function fetchDataFirst() {
    try {
      let res = null;
      objects.forEach(async (element) => {
        res = await axios
          .get(`https://backend.leadagro.net/api${element.url}`)
          .then((response) => {
            values[element.name as keyof typeof values] = response.data.data;
          })
          .catch((error) => {
            errorMessageAccountCreation = "Erreur lors de la récupération des données.";
            console.error("Erreur lors de la récupération des données:", error);
            values[element.name as keyof typeof values] = [];
          });
      });
    } catch (error) {
      errorMessageAccountCreation = "Erreur lors de la récupération des données.";
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
    if (await checkPaiementStatus(formData.profession)) {
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
          errorMessageAccountCreation = "Erreur lors de l'initialisation du paiement.";
          console.error("Erreur paiements :", error);
          isPaiementProcessing = false;
          authenticating = false;
        });
    } else {
      await fetch(BASE_URL_API + "/professionnel/create", {
        method: "POST",
        body: formDatas,
      })
        .then((response) => response.json())
        .then((result) => {
          authenticating = false;
       
          window.location.href = "/success";
        })
        .catch((error) => {
          errorMessageAccountCreation = "Erreur lors de la création du compte. Veuillez réessayer.\n Si le problème persiste, contactez le support.";
          console.error("Erreur paiements :", error);
          isPaiementProcessing = false;
          authenticating = false;
        });
    }
  }
  async function checkTransactionID(idtransaction: any) {
    if (!idtransaction) return false;
    console.log("idtransaction", idtransaction);
    try {
      const res = await fetch(
        `https://backend.leadagro.net/api/paiement/info/transaction/${idtransaction}`
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

  const situationsMatrimoniales = [
    { value: "Célibataire", label: "Célibataire" },
    { value: "Marié(e)", label: "Marié(e)" },
    { value: "Divorcé(e)", label: "Divorcé(e)" },
    { value: "Veuf (Veuve)", label: "Veuf (Veuve)" },
  ];

  let professions: any[] = [];

  async function getAllProfessions() {
    await axios
      .get("https://backend.leadagro.net/api/typeProfession")
      .then((response) => {
        professions = response.data.data;
        console.log("YYYYYY", professions);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des professions", error);
        professions = [];
      });
  }

  onMount(async () => {
    await getAllProfessions();
    console.log("formData dans formStep2", professions);
  });

  function handleFileUpload(event: any, fieldName: string) {
    const file = event.target.files[0];
    if (file) {
      formData[fieldName] = file;

      // Créer une prévisualisation pour les images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          imagePreview[fieldName] = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }

      // Effacer l'erreur pour ce champ
      if (errors[fieldName]) {
        delete errors[fieldName];
      }
    }
  }

  let specialite: any = null;
  ///variable pour dire que j'ai trouvé un numero d'inscription et qu'on peut finaliser le formulaire sans payer
  let isValidNumeroInscription = false;
  let fetchId: any = null;
  let numeroTempInscription: any = null;
  let numeroInscriptionErrors: string = "";
  let checkAction = 0;
  ///Ecoute active pour voir si je trouve un numero d'inscription et faire le process qui suit

  function checkExistenceNumeroInscription(numeroInscription: any) {
    if (!numeroInscription) return;
    if (numeroInscription.length < 21) return;
    if (numeroTempInscription == numeroInscription) {
      checkAction = 1;
    }
    if (checkAction == 1) return;
    axios
      .get(
        `${BASE_URL_API}/professionnel/check/code/existe/${numeroInscription}`
      )
      .then((response) => {
        console.log("Response existence numero d'inscription:", response.data);
        numeroTempInscription = numeroInscription;
        isValidNumeroInscription = response.data.data.statut;
        if (isValidNumeroInscription) {
          fetchId = response.data.data.id;
          step = 6;
          lastStep = true;
          formData.numeroInscription = "";
        } else {
          fetchId = null;
          formData.numeroInscription = "";
          numeroTempInscription = null;
          numeroInscriptionErrors = "Numéro d'inscription invalide.";
        }
        const data = response.data;
        console.log("data.exists", data.exists);
        if (data.exists) {
          specialite = data.specialite;
          formData.profession = specialite;
          if (errors["profession"]) {
            delete errors["profession"];
          }
        } else {
          specialite = null;
          formData.profession = "";
        }
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la vérification du numéro d'inscription :",
          error
        );
      });
  }
  let accountCreationLoader = false;
  let errorMessageAccountCreation = "";
  function validateAccountWithNumInsc() {
    if (isValidNumeroInscription) {
      let formulaire = new FormData();
      accountCreationLoader = true;
      axios
        .post(`${BASE_URL_API}/user/api/create-new-user-with-code`, {
          code: numeroTempInscription,
          email: formData.email,
          password: formData.password,
        })
        .then((response) => {
          console.log(
            "Response validation avec numero d'inscription:",
            response.data
          );
          accountCreationLoader = false;
          alert("Votre inscription a été validée avec succès !");
          window.location.href = "/success";
          // Vous pouvez rediriger l'utilisateur ou effectuer d'autres actions ici
        })
        .catch((error) => {
          accountCreationLoader = false;
          errorMessageAccountCreation =
            "Erreur lors de la création du compte. Veuillez réessayer.\n Si le problème persiste, contactez le support.";
          console.error(
            "Erreur lors de la validation avec le numéro d'inscription :",
            error
          );
        });
    }
  }

  $: formData.numeroInscription &&
    checkExistenceNumeroInscription(formData.numeroInscription);

  let specialiteFetched: any[] = [];
  function handleSpecialiteChange(event: any) {
    console.log("Selected typeProfession ID:", event);
    axios
      .get(
        `${BASE_URL_API}/profession/get/profession/typeProfession/${event.id}`
      )
      .then((response: any) => {
        specialiteFetched = response.data.data;
        formData.profession = "";
        console.log("Specialite fetched:", specialiteFetched);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération de la spécialité :",
          error
        );
      });
  }
let paiementStatus: boolean = false;
  async function checkPaiementStatus(professionCode: any): Promise<boolean> {
    if (!professionCode) return false;

    try {
      const res = await fetch(
        BASE_URL_API + `/profession/get/status/paiement/${professionCode}`
      );
      const data = await res.json();
      paiementStatus = data.data;
      console.log("Paiement status:", data.data);
      return data.data; // Assurez-vous que l'API renvoie un objet avec une clé `valid`
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de la transaction :",
        error
      );
      return false;
    }
  }

  const openCalendar = (event: any) => {
    event.target.showPicker();
  };
</script>

<main>
  <HeaderNew />
  <section
    class="relative text-white bg-blue-600"
    style="padding-top:100px;padding-bottom:50px;
"
  >
    <div class="absolute inset-0 bg-black/20"></div>
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 class="text-4xl md:text-5xl font-bold mb-6">
        Inscription Professionnel de santé
      </h1>
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
              class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 bg-blue-600 text-white border-purple-600"
            >
              1
            </div>
            <div class="w-16 h-0.5 mx-2 bg-blue-600"></div>
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
              class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 bg-blue-600 text-white border-blue-600"
            >
              2
            </div>
            <div class="w-16 h-0.5 mx-2 bg-blue-600"></div>
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
              class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 bg-blue-600 text-white border-blue-600"
            >
              3
            </div>
            <div class="w-16 h-0.5 mx-2 bg-blue-600"></div>
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
              class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 bg-blue-600 text-white border-blue-600"
            >
              4
            </div>
            <div class="w-16 h-0.5 mx-2 bg-blue-600"></div>
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
              class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 bg-blue-600 text-white border-blue-600"
            >
              5
            </div>
            <div class="w-16 h-0.5 mx-2 bg-blue-600"></div>
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
              class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 bg-blue-600 text-white border-blue-600"
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
          <span class="text-blue-600 font-medium">Information de Connexion</span
          >
        {:else}
          <span class="text-gray-500">Information de Connexion</span>
        {/if}
        {#if step >= 2}
          <span class="text-blue-600 font-medium">Information Personnelles</span
          >
        {:else}
          <span class="text-gray-500">Information Personnelles</span>
        {/if}
        {#if step >= 3}
          <span class="text-blue-600 font-medium"
            >Informations professionnelles</span
          >
        {:else}
          <span class="text-gray-500">Informations professionnelles</span>
        {/if}
        {#if step >= 4}
          <span class="text-blue-600 font-medium">Documents Administratifs</span
          >
        {:else}
          <span class="text-gray-500">Documents Administratifs</span>
        {/if}
        {#if step >= 5}
          <span class="text-blue-600 font-medium"
            >Informations Organisationnelles</span
          >
        {:else}
          <span class="text-gray-500">Informations Organisationnelles </span>
        {/if}
        {#if step == 6}
          <span class="text-blue-600 font-medium">Document de Validation</span>
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
                  >
                  <input
                    type="email"
                    id="email"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="votre.email@exemple.com"
                    required={true}
                    name="email"
                    bind:value={formData.email}
                  />

                  {#if errors.email}
                    <p class="text-red-600 text-sm mt-1">{errors.email}</p>
                  {/if}
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
                    {#if errors.password}
                      <p class="text-red-600 text-sm mt-1">{errors.password}</p>
                    {/if}
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
                    {#if errors.confirmPassword}
                      <p class="text-red-600 text-sm mt-1">
                        {errors.confirmPassword}
                      </p>
                    {/if}
                  </div>
                </div>
              </div>
            </div>
          {:else if step === 2}
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  for="nom"
                  class="block text-sm font-medium text-gray-700 mb-2"
                  >Nom *</label
                >
                <div class="relative">
                  <input
                    type="text"
                    id="nom"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                    placeholder="Votre nom"
                    required={true}
                    name="nom"
                    bind:value={formData.nom}
                  />
                </div>
                {#if errors.nom}
                  <p class="text-red-600 text-sm mt-1">{errors.nom}</p>
                {/if}
              </div>
              <div>
                <label
                  for="prenoms"
                  class="block text-sm font-medium text-gray-700 mb-2"
                  >Prénoms *</label
                >
                <div class="relative">
                  <input
                    type="text"
                    id="prenoms"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                    placeholder="Confirmez votre mot de passe"
                    required={true}
                    name="prenoms"
                    bind:value={formData.prenoms}
                  />
                </div>
                {#if errors.prenoms}
                  <p class="text-red-600 text-sm mt-1">{errors.prenoms}</p>
                {/if}
              </div>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  for="Nationalite"
                  class="block text-sm font-medium text-gray-700 mb-2"
                  >Nationalite *</label
                >

                <div class="relative">
                  <Svelecte
                    multiple={false}
                    options={values.nationate}
                    bind:value={formData.nationalite}
                    controlClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                    labelField="libelle"
                    valueField="id"
                    placeholder="Sélectionnez votre région sanitaire"
                  />
                </div>
                {#if errors.nationalite}
                  <p class="text-red-600 text-sm mt-1">{errors.nationalite}</p>
                {/if}
              </div>
              <div>
                <label
                  for="civilite"
                  class="block text-sm font-medium text-gray-700 mb-2"
                  >Civilité *</label
                >
                <div class="relative">
                  <Svelecte
                    multiple={false}
                    options={values.civilite}
                    bind:value={formData.civilite}
                    labelField="libelle"
                    valueField="id"
                    placeholder="Sélectionnez votre civilité"
                    controlClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                  />
                </div>
                {#if errors.civilite}
                  <p class="text-red-600 text-sm mt-1">{errors.civilite}</p>
                {/if}
              </div>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  for="emailAutre"
                  class="block text-sm font-medium text-gray-700 mb-2"
                  >Email Professional *</label
                >
                <div class="relative">
                  <input
                    type="email"
                    id="emailAutre"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                    placeholder="Votre email"
                    required={true}
                    name="emailAutre"
                    bind:value={formData.emailAutre}
                  />
                </div>
                {#if errors.emailAutre}
                  <p class="text-red-600 text-sm mt-1">{errors.emailAutre}</p>
                {/if}
              </div>
              <div>
                <label
                  for="numero"
                  class="block text-sm font-medium text-gray-700 mb-2"
                  >Contact *</label
                >
                <div class="relative">
                  <input
                    type="text"
                    id="numero"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                    placeholder="Votre numéro de téléphone"
                    required={true}
                    name="numero"
                    bind:value={formData.numero}
                  />
                </div>
                {#if errors.numero}
                  <p class="text-red-600 text-sm mt-1">{errors.numero}</p>
                {/if}
              </div>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  for="dateNaissance"
                  class="block text-sm font-medium text-gray-700 mb-2"
                  >Date de Naissance*</label
                >
                <div class="relative">
                  <input
                    type="date"
                    id="dateNaissance"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                    placeholder="Votre date de naissance"
                    required={true}
                    name="dateNaissance"
                    bind:value={formData.dateNaissance}
                    onclick={openCalendar}
                  />
                </div>
                {#if errors.dateNaissance}
                  <p class="text-red-600 text-sm mt-1">
                    {errors.dateNaissance}
                  </p>
                {/if}
              </div>
              <div>
                <label
                  for="situation"
                  class="block text-sm font-medium text-gray-700 mb-2"
                  >Situation matrimoniale *</label
                >
                <div class="relative">
                  <Svelecte
                    multiple={false}
                    options={situationsMatrimoniales}
                    bind:value={formData.situation}
                    controlClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                    labelField="label"
                    valueField="value"
                    placeholder="Sélectionnez votre situation matrimoniale"
                  />
                </div>
                {#if errors.situation}
                  <p class="text-red-600 text-sm mt-1">{errors.situation}</p>
                {/if}
              </div>
            </div>
          {:else if step === 3 && intermed == 0}
            <div>
              <label
                for="numeroInscription"
                class="block text-lg font-medium text-gray-700 mb-2"
                >Numéro d'inscription au registre</label
              >
              <div class="relative">
                <input
                  type="text"
                  id="numeroInscription"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                  placeholder="Votre numéro d'inscription"
                  required={true}
                  name="numeroInscription"
                  bind:value={formData.numeroInscription}
                />
              </div>
              {#if errors.numeroInscription}
                <p class="text-red-600 text-sm mt-1">
                  {errors.numeroInscription}
                </p>
              {/if}
              {#if isValidNumeroInscription == true}
                <div
                  class="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg"
                >
                  <p class="text-green-800">
                    Numéro d'inscription valide. Cliquer sur le bouton "Valider
                    les informations" pour finaliser l'inscription.
                  </p>
                </div>
              {:else if numeroInscriptionErrors.length > 0}
                <div
                  class="mt-4 p-4 bg-red-100 border border-red-300 rounded-lg"
                >
                  <p class="text-red-800">
                    Numéro d'inscription invalide. Veuillez vérifier et
                    réessayer.
                  </p>
                </div>
              {/if}
            </div>
            {#if isValidNumeroInscription == false}
              <!-- <div class=" p-6 rounded-lg shadow-m mb-4"> -->
              <!-- Radios: Profession -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label
                    for="profession"
                    class="block text-lg font-medium text-gray-700 mb-2"
                    >Profession *</label
                  >
                  <Svelecte
                    multiple={false}
                    options={professions}
                    bind:value={specialite}
                    onChange={(event: any) => handleSpecialiteChange(event)}
                    controlClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                    labelField="libelle"
                    valueField="libelle"
                    placeholder="Sélectionnez votre groupe de spécialisation"
                  />
                </div>
                <div>
                  <label
                    for="profession"
                    class="block text-lg font-medium text-gray-700 mb-2"
                    >Spécialité *</label
                  >

                  <!-- 
                  A mettre pour l'ancien systeme avec les groupes de professions
                  options={professions.find(
                    (prof: any) => prof.libelle === specialite
                  )?.professions || []} -->

                  <Svelecte
                    multiple={false}
                    options={specialiteFetched || []}
                    bind:value={formData.profession}
                    controlClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                    labelField="libelle"
                    valueField="code"
                    placeholder="Sélectionnez votre spécialité"
                  />
                </div>

                <!-- {#each professions as professionGP}
                  <div class="form__group mb-4">
                    <label
                      class="form_label font-bold block mb-2"
                      for="profession-{professionGP.libelle}"
                    >
                      <big>{professionGP.libelle}</big>
                    </label>

                    {#each professionGP.professions as profession}
                      <div class="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={profession.code}
                          name="rd_profession"
                          class="cursor-pointer"
                          value={profession.code}
                          checked={formData.profession === profession.code}
                          onchange={() =>
                            (formData.profession = profession.code)}
                        />
                        <label for={profession.code} class="cursor-pointer"
                          >{profession.libelle}</label
                        >
                      </div>
                    {/each}
                  </div>
                {/each} -->
              </div>
              {#if errors.profession}
                <p class="text-red-600 text-sm mt-1">{errors.profession}</p>
              {/if}
              <!-- </div> -->
              <!-- {/if}
          {#if intermed == 1 && step === 3} -->

              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    for="emailPro"
                    class="block text-lg font-medium text-gray-700 mb-2"
                    >Adresse email professionnel *</label
                  >
                  <div class="relative">
                    <input
                      type="text"
                      id="emailPro"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                      placeholder="Confirmez votre adresse email"
                      required={true}
                      name="emailPro"
                      bind:value={formData.emailPro}
                    />
                  </div>
                  {#if errors.emailPro}
                    <p class="text-red-600 text-sm mt-1">{errors.emailPro}</p>
                  {/if}
                </div>
              </div>

              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    for="dateDiplome"
                    class="block text-lg font-medium text-gray-700 mb-2"
                    >Date d'obtention du diplôme *</label
                  >
                  <div class="relative">
                    <input
                      type="date"
                      id="dateDiplome"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                      placeholder="Votre date d'obtention du diplôme"
                      required={true}
                      name="dateDiplome"
                      bind:value={formData.dateDiplome}
                      onclick={openCalendar}
                    />
                  </div>
                  {#if errors.dateDiplome}
                    <p class="text-red-600 text-sm mt-1">
                      {errors.dateDiplome}
                    </p>
                  {/if}
                </div>
                <div>
                  <label
                    for="lieuDiplome"
                    class="block text-lg font-medium text-gray-700 mb-2"
                    >Lieu d'obtention du diplôme *</label
                  >
                  <div class="relative">
                    <input
                      type="text"
                      id="lieuDiplome"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                      placeholder="Votre lieu d'obtention du diplôme"
                      required={true}
                      name="lieuDiplome"
                      bind:value={formData.lieuDiplome}
                    />
                  </div>
                  {#if errors.lieuDiplome}
                    <p class="text-red-600 text-sm mt-1">
                      {errors.lieuDiplome}
                    </p>
                  {/if}
                </div>
              </div>

              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    for="datePremierDiplome"
                    class="block text-lg font-medium text-gray-700 mb-2"
                    >Date du premier emploi *</label
                  >
                  <div class="relative">
                    <input
                      type="date"
                      id="datePremierDiplome"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                      placeholder="Votre date d'obtention du diplôme"
                      required={true}
                      name="datePremierDiplome"
                      bind:value={formData.datePremierDiplome}
                      onclick={openCalendar}
                    />
                  </div>
                  {#if errors.datePremierDiplome}
                    <p class="text-red-600 text-sm mt-1">
                      {errors.datePremierDiplome}
                    </p>
                  {/if}
                </div>
                <div>
                  <label
                    for="diplome"
                    class="block text-lg font-medium text-gray-700 mb-2"
                    >Dénomination du diplôme *</label
                  >
                  <div class="relative">
                    <input
                      type="text"
                      id="diplome"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                      placeholder="Denomination du  diplôme"
                      required={true}
                      name="diplome"
                      bind:value={formData.diplome}
                    />
                  </div>
                  {#if errors.diplome}
                    <p class="text-red-600 text-sm mt-1">{errors.diplome}</p>
                  {/if}
                </div>
              </div>

              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    for="situationPro"
                    class="block text-lg font-medium text-gray-700 mb-2"
                    >Situation professionnelle *</label
                  >
                  <div class="relative">
                    <Svelecte
                      multiple={false}
                      options={values.situationProfessionnelle}
                      bind:value={formData.situationPro}
                      controlClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                      labelField="libelle"
                      valueField="id"
                      placeholder="Sélectionnez votre situation professionnelle"
                    />
                  </div>
                  {#if errors.situationPro}
                    <p class="text-red-600 text-sm mt-1">
                      {errors.situationPro}
                    </p>
                  {/if}
                </div>
                <div>
                  <label
                    for="region"
                    class="block text-lg font-medium text-gray-700 mb-2"
                    >Région sanitaire *</label
                  >
                  <div class="relative">
                    <Svelecte
                      multiple={false}
                      options={values.region}
                      bind:value={formData.region}
                      controlClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                      labelField="libelle"
                      valueField="id"
                      placeholder="Sélectionnez votre région sanitaire"
                    />
                  </div>
                  {#if errors.region}
                    <p class="text-red-600 text-sm mt-1">{errors.region}</p>
                  {/if}
                </div>
              </div>

              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    for="district"
                    class="block text-lg font-medium text-gray-700 mb-2"
                    >District sanitaire *</label
                  >
                  <div class="relative">
                    <Svelecte
                      multiple={false}
                      options={values.district}
                      bind:value={formData.district}
                      controlClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                      labelField="libelle"
                      valueField="id"
                      placeholder="Sélectionnez votre district sanitaire"
                    />
                  </div>
                  {#if errors.district}
                    <p class="text-red-600 text-sm mt-1">{errors.district}</p>
                  {/if}
                </div>
                <div>
                  <label
                    for="ville"
                    class="block text-lg font-medium text-gray-700 mb-2"
                    >Ville *</label
                  >
                  <div class="relative">
                    <Svelecte
                      multiple={false}
                      options={values.ville}
                      bind:value={formData.ville}
                      controlClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                      labelField="libelle"
                      valueField="id"
                      placeholder="Sélectionnez votre ville"
                    />
                  </div>
                  {#if errors.ville}
                    <p class="text-red-600 text-sm mt-1">{errors.ville}</p>
                  {/if}
                </div>
              </div>

              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    for="commune"
                    class="block text-lg font-medium text-gray-700 mb-2"
                    >Commune *</label
                  >
                  <div class="relative">
                    <Svelecte
                      multiple={false}
                      options={values.commune}
                      bind:value={formData.commune}
                      controlClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                      labelField="libelle"
                      valueField="id"
                      placeholder="Sélectionnez votre commune"
                    />
                  </div>
                  {#if errors.commune}
                    <p class="text-red-600 text-sm mt-1">{errors.commune}</p>
                  {/if}
                </div>
                <div>
                  <label
                    for="quartier"
                    class="block text-lg font-medium text-gray-700 mb-2"
                    >Quartier *</label
                  >
                  <div class="relative">
                    <input
                      type="text"
                      id="quartier"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                      placeholder="Votre quartier"
                      required={true}
                      name="quartier"
                      bind:value={formData.quartier}
                    />
                  </div>
                  {#if errors.quartier}
                    <p class="text-red-600 text-sm mt-1">{errors.quartier}</p>
                  {/if}
                </div>
              </div>

              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    for="Ilot,lot"
                    class="block text-lg font-medium text-gray-700 mb-2"
                    >Ilot,lot</label
                  >
                  <div class="relative">
                    <input
                      type="text"
                      id="Ilot,lot"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                      placeholder="Votre Ilot,lot"
                      required={true}
                      name="Ilot,lot"
                      bind:value={formData.poleSanitaire}
                    />
                  </div>
                </div>
                <div>
                  <label
                    for="professionnel"
                    class="block text-lg font-medium text-gray-700 mb-2"
                    >Structure d'exercice professionnel *</label
                  >
                  <div class="relative">
                    <input
                      type="text"
                      id="professionnel"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                      placeholder="Votre strucuture d'exercice professionnel"
                      required={true}
                      name="professionnel"
                      bind:value={formData.professionnel}
                    />
                  </div>
                  {#if errors.professionnel}
                    <p class="text-red-600 text-sm mt-1">
                      {errors.professionnel}
                    </p>
                  {/if}
                </div>
              </div>

              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    for="lieuExercicePro"
                    class="block text-lg font-medium text-gray-700 mb-2"
                    >Lieu d'exercice professionnel *</label
                  >
                  <div class="relative">
                    <input
                      type="text"
                      id="lieuExercicePro"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                      placeholder="Votre lieu d'exercice professionnel"
                      required={true}
                      name="lieuExercicePro"
                      bind:value={formData.lieuExercicePro}
                    />
                  </div>
                  {#if errors.lieuExercicePro}
                    <p class="text-red-600 text-sm mt-1">
                      {errors.lieuExercicePro}
                    </p>
                  {/if}
                </div>
                <div>
                  <label
                    for="typeDiplome"
                    class="block text-lg font-medium text-gray-700 mb-2"
                    >Type de diplôme *</label
                  >
                  <div class="relative">
                    <Svelecte
                      multiple={false}
                      options={values.typeDiplome}
                      bind:value={formData.typeDiplome}
                      controlClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                      labelField="libelle"
                      valueField="id"
                      placeholder="Sélectionnez votre type de diplôme"
                    />
                  </div>
                  {#if errors.typeDiplome}
                    <p class="text-red-600 text-sm mt-1">
                      {errors.typeDiplome}
                    </p>
                  {/if}
                </div>
              </div>

              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    for="statusPro"
                    class="block text-lg font-medium text-gray-700 mb-2"
                    >Status professionnel *</label
                  >
                  <div class="relative">
                    <Svelecte
                      multiple={false}
                      options={values.statusPro}
                      bind:value={formData.statusPro}
                      controlClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                      labelField="libelle"
                      valueField="id"
                      placeholder="Sélectionnez votre status professionnel"
                    />
                  </div>
                  {#if errors.statusPro}
                    <p class="text-red-600 text-sm mt-1">{errors.statusPro}</p>
                  {/if}
                </div>
                <div>
                  <label
                    for="lieuObtentionDiplome"
                    class="block text-lg font-medium text-gray-700 mb-2"
                    >Origine du diplôme *</label
                  >
                  <div class="relative">
                    <Svelecte
                      multiple={false}
                      options={values.lieuObtentionDiplome}
                      bind:value={formData.lieuObtentionDiplome}
                      controlClass="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                      labelField="libelle"
                      valueField="id"
                      placeholder="Sélectionnez l'origine de votre diplôme"
                    />
                  </div>
                  {#if errors.lieuObtentionDiplome}
                    <p class="text-red-600 text-sm mt-1">
                      {errors.lieuObtentionDiplome}
                    </p>
                  {/if}
                </div>
              </div>
            {:else}
              <Recap
                formdata={formData}
                {values}
                isValidated={isValidNumeroInscription}
              />
            {/if}
          {/if}
          {#if step === 4 && isValidNumeroInscription == false}
            <div class="space-y-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">
                Documents requis
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
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
                          <img
                          
                          src={imagePreview.cni}
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
                         <img
                          
                          src={imagePreview.diplomeFile}
                          alt="Aperçu diplôme"
                          class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                        />
                      </div>
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
                       
                        {#if imagePreview.casier.startsWith("data:image")}
                           <img
                          
                          src={imagePreview.casier}
                          alt="Aperçu casier "
                          class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                        />
                        {:else}
                          <!-- <span style="display:flex;align-items:center;justify-content:center;height:50px;width:50px;background:#f3f4f6;border-radius:8px;border:1px solid #eee;">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="#2563eb"><path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm7 1.5V9h5.5L13 3.5zM6 4h6v5a1 1 0 0 0 1 1h5v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4zm2 10v2h8v-2H8z"/></svg>
                          </span> -->
                          <iframe
                            src={imagePreview.casier}
                            class="w-64 h-40 object-cover rounded-lg border-2 border-gray-300"
                          ></iframe>
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
                      <div class="flex-shrink-0">
                         <img
                          
                          src={imagePreview.certificat}
                          alt="Aperçu certificat"
                          class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                        />
                      </div>
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
                      {#if imagePreview.cv.startsWith("data:image")}
                        <img
                          
                          src={imagePreview.cv}
                          alt="Aperçu cv"
                          class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                        />
                      {:else}
                        <svg
                          width="64px"
                          height="64px"
                          viewBox="-4 0 40 40"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></g><g id="SVGRepo_iconCarrier">
                            <path
                              d="M25.6686 26.0962C25.1812 26.2401 24.4656 26.2563 23.6984 26.145C22.875 26.0256 22.0351 25.7739 21.2096 25.403C22.6817 25.1888 23.8237 25.2548 24.8005 25.6009C25.0319 25.6829 25.412 25.9021 25.6686 26.0962ZM17.4552 24.7459C17.3953 24.7622 17.3363 24.7776 17.2776 24.7939C16.8815 24.9017 16.4961 25.0069 16.1247 25.1005L15.6239 25.2275C14.6165 25.4824 13.5865 25.7428 12.5692 26.0529C12.9558 25.1206 13.315 24.178 13.6667 23.2564C13.9271 22.5742 14.193 21.8773 14.468 21.1894C14.6075 21.4198 14.7531 21.6503 14.9046 21.8814C15.5948 22.9326 16.4624 23.9045 17.4552 24.7459ZM14.8927 14.2326C14.958 15.383 14.7098 16.4897 14.3457 17.5514C13.8972 16.2386 13.6882 14.7889 14.2489 13.6185C14.3927 13.3185 14.5105 13.1581 14.5869 13.0744C14.7049 13.2566 14.8601 13.6642 14.8927 14.2326ZM9.63347 28.8054C9.38148 29.2562 9.12426 29.6782 8.86063 30.0767C8.22442 31.0355 7.18393 32.0621 6.64941 32.0621C6.59681 32.0621 6.53316 32.0536 6.44015 31.9554C6.38028 31.8926 6.37069 31.8476 6.37359 31.7862C6.39161 31.4337 6.85867 30.8059 7.53527 30.2238C8.14939 29.6957 8.84352 29.2262 9.63347 28.8054ZM27.3706 26.1461C27.2889 24.9719 25.3123 24.2186 25.2928 24.2116C24.5287 23.9407 23.6986 23.8091 22.7552 23.8091C21.7453 23.8091 20.6565 23.9552 19.2582 24.2819C18.014 23.3999 16.9392 22.2957 16.1362 21.0733C15.7816 20.5332 15.4628 19.9941 15.1849 19.4675C15.8633 17.8454 16.4742 16.1013 16.3632 14.1479C16.2737 12.5816 15.5674 11.5295 14.6069 11.5295C13.948 11.5295 13.3807 12.0175 12.9194 12.9813C12.0965 14.6987 12.3128 16.8962 13.562 19.5184C13.1121 20.5751 12.6941 21.6706 12.2895 22.7311C11.7861 24.0498 11.2674 25.4103 10.6828 26.7045C9.04334 27.3532 7.69648 28.1399 6.57402 29.1057C5.8387 29.7373 4.95223 30.7028 4.90163 31.7107C4.87693 32.1854 5.03969 32.6207 5.37044 32.9695C5.72183 33.3398 6.16329 33.5348 6.6487 33.5354C8.25189 33.5354 9.79489 31.3327 10.0876 30.8909C10.6767 30.0029 11.2281 29.0124 11.7684 27.8699C13.1292 27.3781 14.5794 27.011 15.985 26.6562L16.4884 26.5283C16.8668 26.4321 17.2601 26.3257 17.6635 26.2153C18.0904 26.0999 18.5296 25.9802 18.976 25.8665C20.4193 26.7844 21.9714 27.3831 23.4851 27.6028C24.7601 27.7883 25.8924 27.6807 26.6589 27.2811C27.3486 26.9219 27.3866 26.3676 27.3706 26.1461ZM30.4755 36.2428C30.4755 38.3932 28.5802 38.5258 28.1978 38.5301H3.74486C1.60224 38.5301 1.47322 36.6218 1.46913 36.2428L1.46884 3.75642C1.46884 1.6039 3.36763 1.4734 3.74457 1.46908H20.263L20.2718 1.4778V7.92396C20.2718 9.21763 21.0539 11.6669 24.0158 11.6669H30.4203L30.4753 11.7218L30.4755 36.2428ZM28.9572 10.1976H24.0169C21.8749 10.1976 21.7453 8.29969 21.7424 7.92417V2.95307L28.9572 10.1976ZM31.9447 36.2428V11.1157L21.7424 0.871022V0.823357H21.6936L20.8742 0H3.74491C2.44954 0 0 0.785336 0 3.75711V36.2435C0 37.5427 0.782956 40 3.74491 40H28.2001C29.4952 39.9997 31.9447 39.2143 31.9447 36.2428Z"
                              fill="#EB5757"
                            ></path>
                          </g></svg
                        >
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
            </div>
          {:else if step == 5 && isValidNumeroInscription == false}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div class="form__group mb-4">
                <label
                  class="form_label font-bold block mb-2"
                  for="appartenance"
                >
                  <big>Appartenez-vous à une organisation ? </big>
                </label>

                <div class="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={"appartenance_oui"}
                    name="rd_profession"
                    class="cursor-pointer"
                    value={"oui"}
                    checked={formData.appartenirOrganisation === "oui"}
                    onchange={() => (formData.appartenirOrganisation = "oui")}
                  />
                  <label for={"appartenance_oui"} class="cursor-pointer"
                    >Oui</label
                  >
                </div>
                <div class="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={"appartenance_non"}
                    name="rd_profession"
                    class="cursor-pointer"
                    value={"non"}
                    checked={formData.appartenirOrganisation === "non"}
                    onchange={() => (formData.appartenirOrganisation = "non")}
                  />
                  <label for={"appartenance_non"} class="cursor-pointer"
                    >Non</label
                  >
                </div>
                {#if formData.appartenirOrganisation === "oui"}
                  <label class="form_label font-bold block mb-2" for="ordre">
                    <big>Nom de l'organisation </big>
                  </label>

                  <div class="flex items-center space-x-2">
                    <input
                      type="text"
                      id={"appartenance_organisation"}
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                      bind:value={formData.organisationNom}
                    />
                    {#if errors.organisationNom}
                      <div
                        class="mt-1 p-2 bg-red-100 border border-red-300 rounded-lg"
                      >
                        <p class="text-red-800 text-sm">
                          {errors.organisationNom}
                        </p>
                      </div>
                    {/if}
                  </div>
                {/if}
              </div>

              <div class="form__group mb-4">
                <label class="form_label font-bold block mb-2" for="ordre">
                  <big>Appartenez-vous à un ordre ? </big>
                </label>

                <div class="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={"ordre_oui"}
                    name="rd_ordre"
                    class="cursor-pointer"
                    value={"oui"}
                    checked={formData.appartenirOrdre === "oui"}
                    onchange={() => (formData.appartenirOrdre = "oui")}
                  />
                  <label for={"ordre_oui"} class="cursor-pointer">Oui</label>
                </div>
                <div class="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={"ordre_non"}
                    name="rd_ordre"
                    class="cursor-pointer"
                    value={"non"}
                    checked={formData.appartenirOrdre === "non"}
                    onchange={() => (formData.appartenirOrdre = "non")}
                  />
                  <label for={"ordre_non"} class="cursor-pointer">Non</label>
                </div>
              </div>
            </div>
          {:else if step == 6}
            <div class="text-center">
              <h2 class="text-xl font-semibold text-gray-900 mb-6">
                Finalisation de l'inscription
              </h2>

              <Recap
                formdata={formData}
                {values}
                isValidated={isValidNumeroInscription}
              />
              {#if isPaiementProcessing}
                <p class="text-purple-600 mb-4">
                  {paiementStatus? "Traitement du paiement, veuillez patienter...": "Validation de l'inscription, veuillez patienter..."}
                </p>
                <SpinnerBlue />
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
                <!-- {:else} -->
                <!-- {#if isValidNumeroInscription == false}
                <p class="text-gray-700 mb-4">
                  Cliquez sur "Terminer" pour finaliser votre inscription et
                  procéder au paiement.
                </p>
                {:else}
                <p class="text-gray-700 mb-4">
                  Cliquez sur "Terminer" pour finaliser votre inscription.
                </p> -->
              {/if}
            </div>
          {/if}
          {#if accountCreationLoader}
            <div class="flex justify-center items-center mt-6">
              <SpinnerBlue />
            </div>
          {/if}
          {#if errorMessageAccountCreation}
            <div
              class="mt-6 p-4 bg-red-100 border border-red-300 rounded-lg"
            >
              <p class="text-red-800">{errorMessageAccountCreation}</p>
            </div>
          {/if}
          <div class="flex justify-between mt-8 pt-6">
            <button
              onclick={() => {
                prevStep();
              }}
              type="button"
              disabled={step === 1}
              class="{step == 1
                ? 'bg-white text-gray-900'
                : 'bg-gray-200 text-gray-700'} px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {step > 1 ? "Précédent" : ""}
            </button>

            {#if lastStep}
              {#if isValidNumeroInscription == false}
                <button
                  onclick={() => {
                    clickPaiement();
                  }}
                  type="button"
                  class="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                 {paiementStatus? " Passer au paiement": "Terminer l'inscription"}
                </button>
              {:else}
                <button
                  onclick={() => {
                    validateAccountWithNumInsc();
                  }}
                  type="button"
                  class="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  Valider les informations
                </button>
              {/if}
            {:else}
              <button
                onclick={() => {
                  nextStep();
                }}
                type="button"
                disabled={lastStep}
                class="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap align-right"
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
