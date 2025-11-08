<script>
  import { apiFetch } from "$lib/api";
  import axios from "axios";
  import { onMount } from "svelte";

  export let formdata;
  export let values;
  let professions = [];

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
    console.log("formdata dans formStep2", professions);
  });
</script>

<main>
  <form class=" grid gap-6">
    <div class="grid md:grid-cols-2 gap-4 ">
      <div>
        <label
          for="numeroInscription"
          class="block text-lg font-medium text-gray-700 mb-2"
          >Numéro d'inscription au registre *</label
        >
        <div class="relative">
          <input
            type="text"
            id="numeroInscription"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
            placeholder="Votre numéro d'inscription"
            required={true}
            name="numeroInscription"
            bind:value={formdata.numeroInscription}
          />
        </div>
      </div>
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
            bind:value={formdata.emailPro}
          />
        </div>
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
            bind:value={formdata.dateDiplome}
          />
        </div>
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
            bind:value={formdata.lieuDiplome}
          />
        </div>
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
            bind:value={formdata.datePremierDiplome}
          />
        </div>
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
            bind:value={formdata.diplome}
          />
        </div>
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
          <select
            id="situationPro"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-8 bg-gray-50 focus:bg-white focus:outline-none duration-200"
            required={true}
            name="situationPro"
            bind:value={formdata.situationPro}
          >
            <option value="" disabled selected>
              Sélectionnez votre situation professionnelle
            </option>
            {#each values.situationProfessionnelle as situation}
              <option value={situation.id}>{situation.libelle}</option>
            {/each}
            
           
          </select>
        </div>
      </div>
      <div>
        <label
          for="region"
          class="block text-lg font-medium text-gray-700 mb-2"
          >Région sanitaire *</label
        >
        <div class="relative">
            <select
            id="region"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-8 bg-gray-50 focus:bg-white focus:outline-none duration-200"
            required={true}
            name="region"
            bind:value={formdata.region}
          >
            <option value="" disabled selected>
              Sélectionnez votre région sanitaire
            </option>
            {#each values.region as region}
              <option value={region.id}>{region.libelle}</option>
            {/each}
            
           
          </select>
        </div>
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
            <select
            id="district"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-8 bg-gray-50 focus:bg-white focus:outline-none duration-200"
            required={true}
            name="district"
            bind:value={formdata.district}
          >
            <option value="" disabled selected>
              Sélectionnez votre district sanitaire
            </option>
            {#each values.district as district}
              <option value={district.id}>{district.libelle}</option>
            {/each}
            
           
          </select>
        </div>
      </div>
      <div>
         <label
          for="ville"
          class="block text-lg font-medium text-gray-700 mb-2"
          >Ville *</label
        >
        <div class="relative">
            <select
            id="ville"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-8 bg-gray-50 focus:bg-white focus:outline-none duration-200"
            required={true}
            name="ville"
            bind:value={formdata.ville}
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
    </div>

    <div class="grid md:grid-cols-2 gap-4">
      <div>
         <label
          for="commune"
          class="block text-lg font-medium text-gray-700 mb-2"
          >Commune *</label
        >
        <div class="relative">
            <select
            id="commune"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-8 bg-gray-50 focus:bg-white focus:outline-none duration-200"
            required={true}
            name="commune"
            bind:value={formdata.commune}
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
            bind:value={formdata.quartier}
          />
        </div>
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
            bind:value={formdata.Ilot}
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
            bind:value={formdata.professionnel}
          />
        </div>
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
            bind:value={formdata.lieuExercicePro}
          />
        </div>
      </div>
      <div>
        <label
          for="typeDiplome"
          class="block text-lg font-medium text-gray-700 mb-2"
          >Type de diplôme *</label
        >
        <div class="relative">
         <select
            id="typeDiplome"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-8 bg-gray-50 focus:bg-white focus:outline-none duration-200"
            required={true}
            name="typeDiplome"
            bind:value={formdata.typeDiplome}
          >
            <option value="" disabled selected>
              Sélectionnez votre type de diplôme
            </option>
            {#each values.typeDiplome as profession}
              <option value={profession.id}>{profession.libelle}</option>
            {/each}
            
           
          </select>
        </div>
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
         <select
            id="statusPro"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-8 bg-gray-50 focus:bg-white focus:outline-none duration-200"
            required={true}
            name="statusPro"
            bind:value={formdata.statusPro}
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
        <label
          for="lieuObtentionDiplome"
          class="block text-lg font-medium text-gray-700 mb-2"
          >Origine du diplôme *</label
        >
        <div class="relative">
         <select
            id="lieuObtentionDiplome"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-8 bg-gray-50 focus:bg-white focus:outline-none duration-200"
            required={true}
            name="lieuObtentionDiplome"
            bind:value={formdata.lieuObtentionDiplome}
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
  </form>
</main>

<style>
  .grid {
    display: grid;
  }
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .gap-8 {
    gap: 2rem;
  }

  /* Label */
  .block {
    display: block;
  }
 
  .font-semibold {
    font-weight: 600;
  }
  .text-gray-700 {
    color: #374151;
  }
  .mb-3 {
    margin-bottom: 0.75rem;
  }

  /* Input et select */
  .w-full {
    width: 100%;
  }
  .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .py-3 {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }
  .border-b-2 {
    border-bottom-width: 2px;
  }
  .border-blue-300 {
    border-color: #93c5fd;
  }
  .bg-gray-50 {
    background-color: #f9fafb;
  }
  .focus\:bg-white:focus {
    background-color: #fff;
  }
  .focus\:border-blue-500:focus {
    border-color: #3b82f6;
  }
  .focus\:outline-none:focus {
    outline: none;
  }
  .transition-all {
    transition-property: all;
    transition-duration: 0.2s;
  }
  .duration-200 {
    transition-duration: 0.2s;
  }
  .pr-8 {
    padding-right: 2rem;
  }

  /* Pour l'icône de flèche */
  .absolute {
    position: absolute;
  }
  .right-3 {
    right: 0.75rem;
  }
  .top-1\/2 {
    top: 50%;
  }
  .transform {
    transform: translateY(-50%);
  }
  .w-5 {
    width: 1.25rem;
  }
  .h-5 {
    height: 1.25rem;
  }
  .flex {
    display: flex;
  }
  .items-center {
    align-items: center;
  }
  .justify-center {
    justify-content: center;
  }
  .text-gray-400 {
    color: #9ca3af;
  }
</style>