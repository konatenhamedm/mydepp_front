<script lang="ts">
  import FooterNew from '$components/_includes/FooterNew.svelte';
  import HeaderNew from '$components/_includes/HeaderNew.svelte';
  import axios from 'axios';
  import FormStep2 from './formStep2.svelte';
  import {onMount} from 'svelte';
  import FormStep3 from './formStep3.svelte';
  import Modal from './Modal.svelte';
  import FormStep from './formStep.svelte';
  import Intermed1 from './intermed1.svelte';
  import LastSteps from './last_steps.svelte';
  import {BASE_URL_API} from '$lib/api';
  import Recap from './recap.svelte';

  let step = 1;
  let done = false;
  let lastStep = false;
  let showPassword = false;
  let isPaiementProcessing = false;
  let authenticating = false;
  let isPaiementDone = false;
  let message = '';
  let isModalOpen = false;
  let intermed = 0;
  let pdfUrl: any;

  // Variables pour les erreurs de validation
  let errors: {[key: string]: string} = {};
  let imagePreview: {[key: string]: string} = {};

  function openModal(reference: any) {
    pdfUrl = reference;
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
    localStorage.clear();
  }

  // Fonction de validation des emails
  function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Fonction de validation des numéros de téléphone
  function validatePhone(phone: string): boolean {
    // Format: accepte +XXX XXXXXXXXX ou XXXXXXXXXX (au moins 8 chiffres)
    const phoneRegex = /^(\+?[0-9]{1,4}[\s]?)?[0-9]{8,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  // Fonction pour valider les champs d'une étape
  function validateStep(currentStep: number): boolean {
    errors = {}; // Réinitialiser les erreurs
    let isValid = true;

    if (currentStep === 1) {
      // Validation Step 1: Email et mot de passe
      if (!formdata.email) {
        errors.email = "L'email est requis";
        isValid = false;
      } else if (!validateEmail(formdata.email)) {
        errors.email = "Format d'email invalide";
        isValid = false;
      }

      if (!formdata.password) {
        errors.password = 'Le mot de passe est requis';
        isValid = false;
      } else if (formdata.password.length < 8) {
        errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
        isValid = false;
      }

      if (!formdata.confirmPassword) {
        errors.confirmPassword = 'Veuillez confirmer le mot de passe';
        isValid = false;
      } else if (formdata.password !== formdata.confirmPassword) {
        errors.confirmPassword = 'Les mots de passe ne correspondent pas';
        isValid = false;
      }
    }

    if (currentStep === 2) {
      // Validation Step 2: Informations personnelles
      const requiredFields = [
        {field: 'nom', label: 'Nom'},
        {field: 'prenoms', label: 'Prénoms'},
        {field: 'nationalite', label: 'Nationalité'},
        {field: 'civilite', label: 'Civilité'},
        {field: 'dateNaissance', label: 'Date de naissance'},
        {field: 'situation', label: 'Situation'},
      ];

      requiredFields.forEach(({field, label}) => {
        if (!formdata[field]) {
          errors[field] = `${label} est requis(e)`;
          isValid = false;
        }
      });

      // Validation du numéro de téléphone
      if (!formdata.numero) {
        errors.numero = 'Le numéro de téléphone est requis';
        isValid = false;
      } else if (!validatePhone(formdata.numero)) {
        errors.numero = 'Format de numéro de téléphone invalide';
        isValid = false;
      }

      // Validation de l'email alternatif s'il est fourni
      if (formdata.emailAutre && !validateEmail(formdata.emailAutre)) {
        errors.emailAutre = "Format d'email invalide";
        isValid = false;
      }
    }

    if (currentStep === 3) {
      // Validation Step 3: Informations professionnelles
      const requiredFields = [
        {field: 'profession', label: 'Profession'},
        {field: 'diplome', label: 'Diplôme'},
        {field: 'typeDiplome', label: 'Type de diplôme'},
        {field: 'dateDiplome', label: 'Date du diplôme'},
        {field: 'lieuObtentionDiplome', label: "Lieu d'obtention du diplôme"},
        {field: 'situationPro', label: 'Situation professionnelle'},
      ];

      requiredFields.forEach(({field, label}) => {
        if (!formdata[field]) {
          errors[field] = `${label} est requis(e)`;
          isValid = false;
        }
      });

      // Validation de l'email professionnel s'il est fourni
      if (formdata.emailPro && !validateEmail(formdata.emailPro)) {
        errors.emailPro = "Format d'email invalide";
        isValid = false;
      }
    }

    if (currentStep === 4) {
      // Validation Step 4: Lieu d'exercice
      const requiredFields = [
        {field: 'region', label: 'Région'},
        {field: 'district', label: 'District'},
        {field: 'ville', label: 'Ville'},
        {field: 'commune', label: 'Commune'},
        {field: 'quartier', label: 'Quartier'},
      ];

      requiredFields.forEach(({field, label}) => {
        if (!formdata[field]) {
          errors[field] = `${label} est requis(e)`;
          isValid = false;
        }
      });
    }

    if (currentStep === 5) {
      // Validation Step 5: Documents
      const requiredFiles = [
        {field: 'photo', label: "Photo d'identité"},
        {field: 'cni', label: 'CNI'},
        {field: 'diplomeFile', label: 'Diplôme'},
        {field: 'casier', label: 'Casier judiciaire'},
      ];

      requiredFiles.forEach(({field, label}) => {
        if (!formdata[field]) {
          errors[field] = `${label} est requis(e)`;
          isValid = false;
        }
      });
    }

    return isValid;
  }

  const nextStep = () => {
    // Valider l'étape actuelle avant de passer à la suivante
    if (!validateStep(step)) {
      message = 'Veuillez remplir tous les champs obligatoires correctement';
      return;
    }

    message = ''; // Effacer le message d'erreur

    if (step == 3 && intermed == 0) {
      intermed = 1;
    } else {
      step += 1;
      if (step == 6) {
        lastStep = true;
      }
    }

    console.log(formdata);
  };

  const prevStep = () => {
    if (step > 1) {
      step -= 1;
    }
    if (step < 3) {
      intermed = 0;
    }
    lastStep = false;
    message = ''; // Effacer les messages d'erreur
  };

  let formdata = {
    email: '',
    password: '',
    confirmPassword: '',
    // Personal Informations
    code: '',
    nom: '',
    prenoms: '',
    nationalite: '',
    civilite: '',
    emailAutre: '',
    numero: '',
    dateNaissance: '',
    situation: '',

    // Professional informations
    profession: '',
    emailPro: '',
    dateDiplome: '',
    lieuDiplome: '',
    datePremierDiplome: '',
    poleSanitairePro: '',
    diplome: '',
    situationPro: '',

    poleSanitaire: '',
    region: '',
    district: '',
    ville: '',
    commune: '',
    quartier: '',
    professionnel: '',
    lieuExercicePro: '',
    statusPro: '',
    typeDiplome: '',
    lieuObtentionDiplome: '',
    //media informations

    photo: '',
    cni: '',
    casier: '',
    diplomeFile: '',
    certificat: '',
    cv: '',

    // organization informations

    appartenirOrganisation: 'non',
    organisationNom: '',
    appartenirOrdre: 'non',
    numeroInscription: '',
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
    {name: 'civilite', url: '/civilite/'},
    {name: 'statusPro', url: '/statusPro'},
    {name: 'typeDiplome', url: '/typeDiplome'},
    {name: 'lieuObtentionDiplome', url: '/lieuDiplome'},
    {name: 'nationate', url: '/pays/'},
    {name: 'situationProfessionnelle', url: '/situationProfessionnelle/'},
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
          .get(`https://backend.leadagro.net/api${element.url}`)
          .then((response) => {
            values[element.name as keyof typeof values] = response.data.data;
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération des données:', error);
            values[element.name as keyof typeof values] = [];
          });
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  }

  let uploadedFiles: {[key: string]: string} = {};

  // Fonction pour gérer l'upload de fichiers avec prévisualisation
  function handleFileUpload(event: any, fieldName: string) {
    const file = event.target.files[0];
    if (file) {
      formdata[fieldName] = file;

      // Créer une prévisualisation pour les images
      if (file.type.startsWith('image/')) {
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

  onMount(() => {
    fetchDataFirst();
    console.log(values);
    let references = localStorage.getItem('reference');
    if (references) {
      checkTransactionID(references);
    }
    console.log('references', references);
  });

  function clickPaiement() {
    // Valider toutes les étapes avant le paiement
    let allValid = true;
    for (let i = 1; i <= 5; i++) {
      if (!validateStep(i)) {
        allValid = false;
        break;
      }
    }

    if (!allValid) {
      message =
        'Veuillez remplir tous les champs obligatoires avant de procéder au paiement';
      return;
    }

    isPaiementProcessing = true;
    initPaiement();
  }

  async function initPaiement() {
    authenticating = true;
    // Créer un FormData pour les données du formulaire
    let formDatas = new FormData();

    Object.keys(formdata).forEach((key) => {
      formDatas.append(key, formdata[key]);
    });

    const reference = localStorage.getItem('reference');
    if (reference) {
      formDatas.append('reference', reference);
    }
    formDatas.append('type', 'professionnel');

    const selectedFilesFromStorage = null;

    if (selectedFilesFromStorage) {
      // Ajouter chaque fichier au FormData
      Object.keys(selectedFilesFromStorage).forEach((fieldName) => {
        const fileData = selectedFilesFromStorage[fieldName];
        if (fileData && fileData.data) {
          const byteCharacters = atob(fileData.data.split(',')[1]);
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
            type: 'application/octet-stream',
          });
          formDatas.append(fieldName, blob, fileData.name);
        }
      });
    }

    console.log(formDatas);

    await fetch(BASE_URL_API + '/paiement/paiement', {
      method: 'POST',
      body: formDatas,
    })
      .then((response) => response.json())
      .then((result) => {
        authenticating = false;

        if (result.data.url) {
          localStorage.setItem('reference', result.data.reference);
          window.location.href = result.data.url + '?return=1';
        }
      })
      .catch((error) => {
        console.error('Erreur paiements :', error);
        isPaiementProcessing = false;
        authenticating = false;
      });
  }

  async function checkTransactionID(idtransaction: any) {
    if (!idtransaction) return false;
    console.log('idtransaction', idtransaction);
    try {
      const res = await fetch(
        `https://backend.leadagro.net/api/paiement/info/transaction/${idtransaction}`
      );
      const data = await res.json();
      isPaiementDone = data.data.state;

      console.log('data.data', data.data);
      if (data.data.state == true) {
        openModal(idtransaction);
      } else {
        message = "Le paiement n'a pas été effectué. Veuillez réessayer.";
      }
      return data.data;
    } catch (error) {
      console.error(
        'Erreur lors de la vérification de la transaction :',
        error
      );
      return false;
    }
  }
</script>

<main>
  <HeaderNew />
  <section
    class="relative text-white"
    style="  background-image: linear-gradient(135deg, #2563eb 0%, #7e22ce 100%);padding-top:100px;padding-bottom:50px;
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
      <!-- Message d'erreur global -->
      {#if message}
        <div
          class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
        >
          <p class="font-semibold">{message}</p>
        </div>
      {/if}

      <div class="bg-white rounded-lg shadow-xl p-8 mb-8">
        <!-- Progress Steps -->
        <div class="mb-8">
          <div class="flex justify-between items-center">
            {#each [1, 2, 3, 4, 5, 6] as s}
              <div class="flex flex-col items-center flex-1">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                  {step >= s ? 'bg-blue-600' : 'bg-gray-300'}"
                >
                  {s}
                </div>
                <div class="text-xs mt-2 text-center">
                  {s === 1 ? 'Compte' : ''}
                  {s === 2 ? 'Personnel' : ''}
                  {s === 3 ? 'Professionnel' : ''}
                  {s === 4 ? 'Lieu' : ''}
                  {s === 5 ? 'Documents' : ''}
                  {s === 6 ? 'Récapitulatif' : ''}
                </div>
              </div>
              {#if s < 6}
                <div
                  class="flex-1 h-1 mx-2
                  {step > s ? 'bg-blue-600' : 'bg-gray-300'}"
                ></div>
              {/if}
            {/each}
          </div>
        </div>

        <!-- Step 1: Informations de compte -->
        {#if step === 1}
          <div class="space-y-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">
              Informations de compte
            </h2>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email <span class="text-red-500">*</span>
              </label>
              <input
                type="email"
                bind:value={formdata.email}
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                {errors.email ? 'border-red-500' : 'border-gray-300'}"
                placeholder="votre@email.com"
                required
              />
              {#if errors.email}
                <p class="mt-1 text-sm text-red-600">{errors.email}</p>
              {/if}
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe <span class="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                bind:value={formdata.password}
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                {errors.password ? 'border-red-500' : 'border-gray-300'}"
                placeholder="Minimum 8 caractères"
                required
              />
              {#if errors.password}
                <p class="mt-1 text-sm text-red-600">{errors.password}</p>
              {/if}
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le mot de passe <span class="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                bind:value={formdata.confirmPassword}
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                {errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}"
                placeholder="Confirmez votre mot de passe"
                required
              />
              {#if errors.confirmPassword}
                <p class="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              {/if}
            </div>

            <div class="flex items-center">
              <input
                type="checkbox"
                bind:checked={showPassword}
                class="mr-2"
                id="showPassword"
              />
              <label for="showPassword" class="text-sm text-gray-700">
                Afficher les mots de passe
              </label>
            </div>
          </div>
        {/if}

        <!-- Step 2: Informations personnelles -->
        {#if step === 2}
          <FormStep {formdata} {errors} bind:values />
        {/if}

        <!-- Step 3: Informations professionnelles -->
        {#if step === 3}
          {#if intermed === 0}
            <FormStep2 {formdata} {errors} bind:values />
          {:else}
            <Intermed1 {formdata} {errors} bind:values />
          {/if}
        {/if}

        <!-- Step 4: Lieu d'exercice -->
        {#if step === 4}
          <FormStep3 {formdata} {errors} bind:values />
        {/if}

        <!-- Step 5: Documents -->
        {#if step === 5}
          <div class="space-y-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">
              Documents requis
            </h2>

            <!-- Photo d'identité -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Photo d'identité <span class="text-red-500">*</span>
              </label>
              <div class="flex gap-4 items-start">
                {#if imagePreview.photo}
                  <div class="flex-shrink-0">
                    
                    <img style="height: 50px !important;width: 124px !important;"
                      src={imagePreview.photo}
                      alt="Aperçu photo"
                      class="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                    />
                  </div>
                {/if}
                <div class="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    on:change={(e) => handleFileUpload(e, 'photo')}
                    class="w-full h-[50px] px-4 py-2 border rounded-lg
            {errors.photo ? 'border-red-500' : 'border-gray-300'}"
                    required
                  />
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
                    
                    <img  style="height: 50px !important;width: 124px !important;"
                      src={imagePreview.cni}
                      alt="Aperçu CNI"
                      class="w-64 h-40 object-cover rounded-lg border-2 border-gray-300"
                    />
                  </div>
                {/if}
                <div class="flex-1">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    on:change={(e) => handleFileUpload(e, 'cni')}
                    class="w-full h-[50px] px-4 py-2 border rounded-lg
            {errors.cni ? 'border-red-500' : 'border-gray-300'}"
                    required
                  />
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
                    
                    <img style="height: 50px !important;width: 124px !important;"
                      src={imagePreview.diplomeFile}
                      alt="Aperçu diplôme"
                      class="w-64 h-40 object-cover rounded-lg border-2 border-gray-300"
                    />
                  </div>
                {/if}
                <div class="flex-1">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    on:change={(e) => handleFileUpload(e, 'diplomeFile')}
                    class="w-full h-[50px] px-4 py-2 border rounded-lg
            {errors.diplomeFile ? 'border-red-500' : 'border-gray-300'}"
                    required
                  />
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
                    
                    <img style="height: 50px !important;width: 124px !important;"
                      src={imagePreview.casier}
                      alt="Aperçu casier"
                      class="w-64 h-40 object-cover rounded-lg border-2 border-gray-300"
                    />
                  </div>
                {/if}
                <div class="flex-1">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    on:change={(e) => handleFileUpload(e, 'casier')}
                    class="w-full h-[50px] px-4 py-2 border rounded-lg
            {errors.casier ? 'border-red-500' : 'border-gray-300'}"
                    required
                  />
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
                    
                    <img style="height: 50px !important;width: 124px !important;"
                      src={imagePreview.certificat}
                      alt="Aperçu certificat"
                      class="w-64 h-40 object-cover rounded-lg border-2 border-gray-300"
                    />
                  </div>
                {/if}
                <div class="flex-1">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    on:change={(e) => handleFileUpload(e, 'certificat')}
                    class="w-full h-[50px] px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <!-- CV (optionnel) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                CV (optionnel)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                on:change={(e) => handleFileUpload(e, 'cv')}
                class="w-full h-[50px] px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        {/if}

        <!-- Step 6: Récapitulatif -->
        {#if step === 6}
          <Recap {formdata} />
        {/if}

        <!-- Navigation Buttons -->
        <div class="flex justify-between mt-8">
          {#if step > 1}
            <button
              on:click={prevStep}
              class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Précédent
            </button>
          {:else}
            <div></div>
          {/if}

          {#if step < 6}
            <button
              on:click={nextStep}
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Suivant
            </button>
          {:else}
            <button
              on:click={clickPaiement}
              disabled={isPaiementProcessing || authenticating}
              class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {#if authenticating}
                Traitement...
              {:else}
                Procéder au paiement
              {/if}
            </button>
          {/if}
        </div>
      </div>
    </div>
  </div>

  {#if isModalOpen}
    <Modal {pdfUrl} on:close={closeModal} />
  {/if}

  <FooterNew />
</main>

<style>
  /* Vos styles CSS existants ici */


  input[type='text'],
  input[type='email'],
  input[type='password'],
  input[type='date'],
  input[type='file'],
  select,
  textarea {
    transition:
      border-color 0.2s ease-in-out,
      box-shadow 0.2s ease-in-out;
  }

  input[type='text']:focus,
  input[type='email']:focus,
  input[type='password']:focus,
  input[type='date']:focus,
  input[type='file']:focus,
  select:focus,
  textarea:focus {
    outline: none;
  }
</style>
