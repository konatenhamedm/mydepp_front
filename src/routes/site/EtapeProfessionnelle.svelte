<script lang="ts">
  import {apiFetch} from '$lib/api';
  import {onMount} from 'svelte';
  import SelectInput from './SelectInput.svelte';
  import TextInput from './TextInput.svelte';

  export let formData: any;
  export let errors: any;
  export let values: any;
  export let professions: any[];
  export let codeExisteError: string;
  export let updateField: (key: string, value: string) => void;
  export let showTitle: boolean = true;

  
  /* export let updateDistrict1s: () => void;
    export let updateVille1s: () => void;
    export let updateCommune1s: () => void; */

  function saveFormStateComponent() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('formData', JSON.stringify(formData));
      /*  localStorage.setItem("step", step.toString()); */
    }
  }

  values.region = [];
  values.district = [];
  values.ville = [];
  values.commune = [];
  values.lieuObtentionDiplome = [];

  // Liste des objets à charger
  let objects = [
    {name: 'civilite', url: '/civilite'},
    {name: 'region', url: '/region'},
    {name: 'ville', url: '/ville'},
    {name: 'district', url: '/district'},
    {name: 'commune', url: '/commune'},
    {name: 'nationate', url: '/pays'},
    {name: 'situationProfessionnelle', url: '/situationProfessionnelle'},
    {name: 'lieuObtentionDiplome', url: '/lieuDiplome'},
  ];

  // Fonction pour charger les données depuis une API
  async function fetchDataChange(url: any) {
    try {
      const response = await apiFetch(true, url);
      if (!response) {
        console.error('Erreur lors de la récupération des données:', url);
        return [];
      }
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      return [];
    }
  }

  // Fonction pour appliquer les filtres en fonction des sélections
  async function applyFilters() {
    if (formData.region) {
      await updateDistricts();
    }
    /* if (formData.district) {
        await updateVilles();
    }
    if (formData.ville) {
        await updateCommunes();
    } */
  }

  // Fonction pour charger les données nécessaires lors de l'initialisation
  async function loadData() {
    for (let obj of objects) {
      const data = await fetchDataChange(obj.url);
      values[obj.name] = data;
    }
    // Une fois toutes les données chargées, appliquer les filtres
    await applyFilters();
  }

  // Fonction pour mettre à jour les districts en fonction de la région
  async function updateDistricts() {
    const selectedRegion = values.region.find(
      (region: any) => region.id === +formData.region
    );
    if (selectedRegion) {
      // Réinitialiser les autres sélections
      /* formData.district = ""; */
      /* formData.ville = ""; */
      /* formData.commune = ""; */

      // Charger les districts de la région sélectionnée
      try {
        values.district = await fetchDataChange(`/district/${formData.region}`);
        /*  values.ville = [];
            values.commune = []; */
      } catch (error) {
        console.error('Erreur lors du chargement des districts:', error);
        values.district = [];
        /* values.ville = [];
            values.commune = []; */
      }
    }
  }

  // Fonction pour mettre à jour les villes en fonction du district
  /* async function updateVilles() {
    const selectedDistrict = values.district.find(
        (district:any) => district.id === +formData.district
    );
    if (selectedDistrict) {
       
        try {
            values.ville = await fetchDataChange(`/ville/${formData.district}`);
            values.commune = [];
        } catch (error) {
            console.error("Erreur lors du chargement des villes:", error);
            values.ville = [];
            values.commune = [];
        }
    }
} */

  // Fonction pour mettre à jour les communes en fonction de la ville
  /* async function updateCommunes() {
    const selectedVille = values.ville.find(
        (ville:any) => ville.id === +formData.ville
    );
    if (selectedVille) {
        
        try {
            values.commune = await fetchDataChange(`/commune/${formData.ville}`);
        } catch (error) {
            console.error("Erreur lors du chargement des communes:", error);
            values.commune = [];
        }
    }
} */

  // Chargement des données au montage du composant (par exemple, dans onMount)
  onMount(async () => {
    await loadData();
    console.log(formData.district);
    console.log(values.ville);
    console.log(formData.commune);
  });
</script>

{#if showTitle}
  <h2
    class="text-3xl h2-baslik-anasayfa-ozel md:text-2xl font-bold my-4 text-center md:text-left"
  >
    Informations professionnelles (étape 3/6)
  </h2>
{/if}

<div class=" p-6 rounded-lg shadow-m mb-4">
  <!-- Radios: Profession -->
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-4"
  >
    {#each professions as professionGP}
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
              checked={profession.code == formData.profession}
              on:input={saveFormStateComponent}
              on:change={() => updateField('profession', profession.code)}
            />
            <label for={profession.code} class="cursor-pointer"
              >{profession.libelle}</label
            >
          </div>
        {/each}
      </div>
    {/each}
    {#if errors.profession}
      <p class="text-red-500 text-sm">{errors.profession}</p>
    {/if}
  </div>

  <!-- Inputs texte + sélecteurs -->
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-12"
  >
    <TextInput
      type="text"
      label="Numéro d'inscription au registre"
      bind:value={formData.code}
      placeholder="Entrez le numéro d'inscription au registre"
      error={codeExisteError}
      onInput={saveFormStateComponent}
      step={3}
      bind:formData
    />

    <TextInput
      type="email"
      label="Adresse email professionnel"
      bind:value={formData.emailPro}
      placeholder="Entrez votre email professionnel"
      error={errors.emailPro}
      onInput={saveFormStateComponent}
      step={3}
      bind:formData
    />

    <TextInput
      type="date"
      label="Date d'obtention du diplôme"
      bind:value={formData.dateDiplome}
      placeholder="Entrez la date"
      error={errors.dateDiplome}
      onInput={saveFormStateComponent}
      step={3}
      bind:formData
    />

    <TextInput
      type="text"
      label="Lieu d'obtention du diplôme"
      bind:value={formData.lieuDiplome}
      placeholder="Entrez le lieu"
      error={errors.lieuDiplome}
      onInput={saveFormStateComponent}
      step={3}
      bind:formData
    />

    <TextInput
      type="date"
      label="Date du premier emploi"
      bind:value={formData.datePremierDiplome}
      error={errors.datePremierDiplome}
      onInput={saveFormStateComponent}
      step={3}
      bind:formData
    />

    <TextInput
      type="text"
      label="Dénomination du diplôme"
      bind:value={formData.diplome}
      placeholder="Ex: Licence en biologie"
      error={errors.diplome}
      onInput={saveFormStateComponent}
      step={3}
      bind:formData
    />

    <SelectInput
      label="Situation professionnelle"
      bind:value={formData.situationPro}
      options={values.situationProfessionnelle.map(
        (c: {id: number; libelle: string}) => ({
          id: String(c.id),
          libelle: c.libelle,
        })
      )}
      placeholder="Sélectionnez votre situation"
      error={errors.situationPro}
      onInput={saveFormStateComponent}
      step={3}
      bind:formData
    />

    <!-- Région -->
    <div class="form__group">
      <label class="block text-2xl font-medium mb-1">Région sanitaire *</label>
      <select
        class="w-full form__input"
        bind:value={formData.region}
        on:change={() => {
          saveFormStateComponent();
          updateDistricts();
        }}
      >
        <option value="">Sélectionnez votre Région</option>
        {#each values.region as region}
          <option value={region.id} selected={+formData.region === region.id}>
            {region.libelle}
          </option>
        {/each}
      </select>
      {#if errors.region}
        <p class="text-red-500 text-sm">{errors.region}</p>
      {/if}
    </div>

    <!-- District -->
    <div class="form__group">
      <label class="block text-2xl font-medium mb-1">District sanitaire *</label
      >
      <select
        class="w-full form__input"
        bind:value={formData.district}
        on:change={() => {
          saveFormStateComponent();
          //updateVilles();
        }}
      >
        <option value="" selected={formData.district === ''}
          >Sélectionnez votre district
        </option>
        {#each values.district as district}
          <option
            value={district.id}
            selected={formData.district === district.id}
          >
            {district.libelle}
          </option>
        {/each}
      </select>
      {#if errors.district}
        <p class="text-red-500 text-sm">{errors.district}</p>
      {/if}
    </div>

    <!-- Ville -->
    <div class="form__group">
      <label class="block text-2xl font-medium mb-1">Ville *</label>
      <select
        class="w-full form__input"
        bind:value={formData.ville}
        on:change={() => {
          saveFormStateComponent();
          // updateCommunes();
        }}
      >
        <option value="" selected={formData.ville === ''}
          >Sélectionnez votre ville</option
        >
        {#each values.ville as ville}
          <option value={ville.id} selected={formData.ville === ville.id}>
            {ville.libelle}
          </option>
        {/each}
      </select>
      {#if errors.ville}
        <p class="text-red-500 text-sm">{errors.ville}</p>
      {/if}
    </div>

    <!-- Commune -->
    <div class="form__group">
      <label class="block text-2xl font-medium mb-1">Commune *</label>
      <select
        class="w-full form__input"
        bind:value={formData.commune}
        on:change={saveFormStateComponent}
      >
        <option value="" selected={formData.commune === ''}
          >Sélectionnez votre commune</option
        >
        {#each values.commune as commune}
          <option value={commune.id} selected={formData.commune === commune.id}>
            {commune.libelle}
          </option>
        {/each}
      </select>
      {#if errors.commune}
        <p class="text-red-500 text-sm">{errors.commune}</p>
      {/if}
    </div>

    <TextInput
      label="Quartier"
      type="text"
      bind:value={formData.quartier}
      placeholder="Entrez votre Quartier"
      error={errors.quartier}
      onInput={saveFormStateComponent}
      step={3}
      bind:formData
    />

    <TextInput
      label="Ilot,lot"
      type="text"
      bind:value={formData.poleSanitaire}
      placeholder="Entrez votre Ilot,Lot"
      error={errors.poleSanitaire}
      onInput={saveFormStateComponent}
      step={3}
      bind:formData
    />

    <TextInput
      label="Structure d'exercice professionnel"
      type="text"
      bind:value={formData.professionnel}
      placeholder="Entrez la structure"
      error={errors.professionnel}
      onInput={saveFormStateComponent}
      step={3}
      bind:formData
    />

    <TextInput
      label="Lieu d'exercice professionnel"
      type="text"
      bind:value={formData.lieuExercicePro}
      placeholder="Entrez le lieu"
      error={errors.lieuExercicePro}
      onInput={saveFormStateComponent}
      step={3}
      bind:formData
    />
  </div>
  <div
    class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-6"
  >
    <SelectInput
      label="Type de diplôme"
      bind:value={formData.typeDiplome}
      options={values.typeDiplome.map(
        (c: {id: number; libelle: string}) => ({
          id: String(c.id),
          libelle: c.libelle,
        })
      )}
      placeholder="Sélectionnez le type diplôme"
      error={errors.typeDiplome}
      onInput={saveFormStateComponent}
      step={3}
      bind:formData
    />
    <SelectInput
      label="Status professionnel"
      bind:value={formData.statusPro}
      options={values.statusPro.map(
        (c: {id: number; libelle: string}) => ({
          id: String(c.id),
          libelle: c.libelle,
        })
      )}
      placeholder="Sélectionnez votre status professionnel"
      error={errors.statusPro}
      onInput={saveFormStateComponent}
      step={3}
      bind:formData
    />
    
    <SelectInput
      label="Origine du diplôme"
      bind:value={formData.lieuObtentionDiplome}
      options={values.lieuObtentionDiplome.map(
        (c: {id: number; libelle: string}) => ({
          id: String(c.id),
          libelle: c.libelle,
        })
      )}
      placeholder="Sélectionnez  l'origine du  diplome"
      error={errors.lieuObtentionDiplome}
      onInput={saveFormStateComponent}
      step={3}
      bind:formData
    />
  </div>
</div>
