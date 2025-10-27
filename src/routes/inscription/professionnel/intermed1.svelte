<script lang="ts">
  export let formdata: any;
  export let errors: any = {};
  export let values: any;
</script>

<div class="space-y-6">
  <h2 class="text-2xl font-bold text-gray-900 mb-6">
    Informations complémentaires
  </h2>

  <!-- Message d'aide -->
  <div class="p-4 bg-purple-50 border border-purple-200 rounded-lg mb-6">
    <p class="text-sm text-purple-800">
      <strong>📋 Informations additionnelles :</strong> Renseignez vos informations sur les organisations professionnelles.
    </p>
  </div>

  <!-- Grille pour les champs -->
  <div class="space-y-6">
    
    <!-- Appartenance à une organisation -->
    <div class="p-6 bg-gray-50 rounded-lg border border-gray-200">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">
        Organisation professionnelle
      </h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Appartenez-vous à une organisation professionnelle ?
          </label>
          <div class="flex gap-6">
            <label class="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                bind:group={formdata.appartenirOrganisation}
                value="oui"
                class="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-gray-700">Oui</span>
            </label>
            <label class="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                bind:group={formdata.appartenirOrganisation}
                value="non"
                class="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-gray-700">Non</span>
            </label>
          </div>
        </div>

        {#if formdata.appartenirOrganisation === "oui"}
          <div class="mt-4 pl-6 border-l-4 border-blue-500">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'organisation
            </label>
            <input
              type="text"
              bind:value={formdata.organisationNom}
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
              placeholder="Nom de l'organisation"
            />
          </div>
        {/if}
      </div>
    </div>

    <!-- Appartenance à un ordre -->
    <div class="p-6 bg-gray-50 rounded-lg border border-gray-200">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">
        Ordre professionnel
      </h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Êtes-vous inscrit à un ordre professionnel ?
          </label>
          <div class="flex gap-6">
            <label class="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                bind:group={formdata.appartenirOrdre}
                value="oui"
                class="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-gray-700">Oui</span>
            </label>
            <label class="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                bind:group={formdata.appartenirOrdre}
                value="non"
                class="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-gray-700">Non</span>
            </label>
          </div>
        </div>

        {#if formdata.appartenirOrdre === "oui"}
          <div class="mt-4 pl-6 border-l-4 border-blue-500">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Numéro d'inscription à l'ordre
            </label>
            <input
              type="text"
              bind:value={formdata.numeroInscription}
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
              placeholder="Numéro d'inscription"
            />
          </div>
        {/if}
      </div>
    </div>

    <!-- Code professionnel -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Code professionnel <span class="text-gray-400 text-xs">(optionnel)</span>
      </label>
      <input
        type="text"
        bind:value={formdata.code}
        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
        placeholder="Code professionnel"
      />
    </div>

  </div>
</div>

<style>
  input[type="radio"]:checked {
    background-color: #2563eb;
  }
</style>