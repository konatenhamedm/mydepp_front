<script lang="ts">
  export let formdata: any;
  export let errors: any = {};
  export let values: any;
</script>

<div class="space-y-6">
  <h2 class="text-2xl font-bold text-gray-900 mb-6">
    Lieu d'exercice professionnel
  </h2>

  <!-- Message d'aide -->
  <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
    <p class="text-sm text-blue-800">
      <strong>📍 Localisation :</strong> Indiquez votre lieu d'exercice professionnel.
    </p>
  </div>

  <!-- Grille pour les champs -->
  <div class="grid grid-cols-2 md:grid-cols-2 gap-6">
    
    <!-- Région -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Région <span class="text-red-500">*</span>
      </label>
      <select
        bind:value={formdata.region}
        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
        {errors.region ? 'border-red-500' : 'border-gray-300'}"
        required
      >
        <option value="">Sélectionnez une région...</option>
        {#each values.region as item}
          <option value={item.id}>{item.libelle}</option>
        {/each}
      </select>
      {#if errors.region}
        <p class="mt-1 text-sm text-red-600">{errors.region}</p>
      {/if}
    </div>

    <!-- District -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        District <span class="text-red-500">*</span>
      </label>
      <select
        bind:value={formdata.district}
        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
        {errors.district ? 'border-red-500' : 'border-gray-300'}"
        required
      >
        <option value="">Sélectionnez un district...</option>
        {#each values.district as item}
          <option value={item.id}>{item.libelle}</option>
        {/each}
      </select>
      {#if errors.district}
        <p class="mt-1 text-sm text-red-600">{errors.district}</p>
      {/if}
    </div>

    <!-- Ville -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Ville <span class="text-red-500">*</span>
      </label>
      <select
        bind:value={formdata.ville}
        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
        {errors.ville ? 'border-red-500' : 'border-gray-300'}"
        required
      >
        <option value="">Sélectionnez une ville...</option>
        {#each values.ville as item}
          <option value={item.id}>{item.libelle}</option>
        {/each}
      </select>
      {#if errors.ville}
        <p class="mt-1 text-sm text-red-600">{errors.ville}</p>
      {/if}
    </div>

    <!-- Commune -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Commune <span class="text-red-500">*</span>
      </label>
      <select
        bind:value={formdata.commune}
        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
        {errors.commune ? 'border-red-500' : 'border-gray-300'}"
        required
      >
        <option value="">Sélectionnez une commune...</option>
        {#each values.commune as item}
          <option value={item.id}>{item.libelle}</option>
        {/each}
      </select>
      {#if errors.commune}
        <p class="mt-1 text-sm text-red-600">{errors.commune}</p>
      {/if}
    </div>

    <!-- Quartier -->
    <div class="md:col-span-2">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Quartier <span class="text-red-500">*</span>
      </label>
      <input
        type="text"
        bind:value={formdata.quartier}
        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
        {errors.quartier ? 'border-red-500' : 'border-gray-300'}"
        placeholder="Nom du quartier"
        required
      />
      {#if errors.quartier}
        <p class="mt-1 text-sm text-red-600">{errors.quartier}</p>
      {/if}
    </div>

    <!-- Lieu d'exercice professionnel -->
    <div class="md:col-span-2">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Lieu d'exercice professionnel <span class="text-gray-400 text-xs">(optionnel)</span>
      </label>
      <input
        type="text"
        bind:value={formdata.lieuExercicePro}
        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
        placeholder="Ex: Hôpital Général, Clinique..."
      />
    </div>

    <!-- Pôle sanitaire -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Pôle sanitaire <span class="text-gray-400 text-xs">(optionnel)</span>
      </label>
      <input
        type="text"
        bind:value={formdata.poleSanitaire}
        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
        placeholder="Nom du pôle sanitaire"
      />
    </div>

    <!-- Professionnel -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Type de professionnel <span class="text-gray-400 text-xs">(optionnel)</span>
      </label>
      <input
        type="text"
        bind:value={formdata.professionnel}
        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
        placeholder="Type de professionnel"
      />
    </div>

  </div>
</div>