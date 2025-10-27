<script lang="ts">
  export let formdata: any;
  export let errors: any = {};
  export let values: any;
</script>

<div class="space-y-6">
  <h2 class="text-2xl font-bold text-gray-900 mb-6">
    Informations professionnelles
  </h2>

  <!-- Message d'aide -->
  <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
    <p class="text-sm text-blue-800">
      <strong>💼 Information :</strong> Renseignez vos informations professionnelles et diplômes.
    </p>
  </div>

  <!-- Grille pour les champs -->
  <div class="grid grid-cols-2 md:grid-cols-2 gap-6">
    
    <!-- Profession -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Profession <span class="text-red-500">*</span>
      </label>
      <input
        type="text"
        bind:value={formdata.profession}
        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
        {errors.profession ? 'border-red-500' : 'border-gray-300'}"
        placeholder="Ex: Médecin, Infirmier..."
        required
      />
      {#if errors.profession}
        <p class="mt-1 text-sm text-red-600">{errors.profession}</p>
      {/if}
    </div>

    <!-- Email professionnel -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Email professionnel <span class="text-gray-400 text-xs">(optionnel)</span>
      </label>
      <input
        type="email"
        bind:value={formdata.emailPro}
        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
        {errors.emailPro ? 'border-red-500' : 'border-gray-300'}"
        placeholder="professionnel@email.com"
      />
      {#if errors.emailPro}
        <p class="mt-1 text-sm text-red-600">{errors.emailPro}</p>
      {/if}
    </div>

    <!-- Diplôme -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Diplôme <span class="text-red-500">*</span>
      </label>
      <input
        type="text"
        bind:value={formdata.diplome}
        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
        {errors.diplome ? 'border-red-500' : 'border-gray-300'}"
        placeholder="Nom du diplôme"
        required
      />
      {#if errors.diplome}
        <p class="mt-1 text-sm text-red-600">{errors.diplome}</p>
      {/if}
    </div>

    <!-- Type de diplôme -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Type de diplôme <span class="text-red-500">*</span>
      </label>
      <select
        bind:value={formdata.typeDiplome}
        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
        {errors.typeDiplome ? 'border-red-500' : 'border-gray-300'}"
        required
      >
        <option value="">Sélectionnez...</option>
        {#each values.typeDiplome as item}
          <option value={item.id}>{item.libelle}</option>
        {/each}
      </select>
      {#if errors.typeDiplome}
        <p class="mt-1 text-sm text-red-600">{errors.typeDiplome}</p>
      {/if}
    </div>

    <!-- Date du diplôme -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Date d'obtention du diplôme <span class="text-red-500">*</span>
      </label>
      <input
        type="date"
        bind:value={formdata.dateDiplome}
        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
        {errors.dateDiplome ? 'border-red-500' : 'border-gray-300'}"
        required
      />
      {#if errors.dateDiplome}
        <p class="mt-1 text-sm text-red-600">{errors.dateDiplome}</p>
      {/if}
    </div>

    <!-- Lieu d'obtention du diplôme -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Lieu d'obtention du diplôme <span class="text-red-500">*</span>
      </label>
      <select
        bind:value={formdata.lieuObtentionDiplome}
        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
        {errors.lieuObtentionDiplome ? 'border-red-500' : 'border-gray-300'}"
        required
      >
        <option value="">Sélectionnez...</option>
        {#each values.lieuObtentionDiplome as item}
          <option value={item.id}>{item.libelle}</option>
        {/each}
      </select>
      {#if errors.lieuObtentionDiplome}
        <p class="mt-1 text-sm text-red-600">{errors.lieuObtentionDiplome}</p>
      {/if}
    </div>

    <!-- Date du premier diplôme -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Date du premier diplôme <span class="text-gray-400 text-xs">(optionnel)</span>
      </label>
      <input
        type="date"
        bind:value={formdata.datePremierDiplome}
        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
      />
    </div>

    <!-- Situation professionnelle -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Situation professionnelle <span class="text-red-500">*</span>
      </label>
      <select
        bind:value={formdata.situationPro}
        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
        {errors.situationPro ? 'border-red-500' : 'border-gray-300'}"
        required
      >
        <option value="">Sélectionnez...</option>
        {#each values.situationProfessionnelle as item}
          <option value={item.id}>{item.libelle}</option>
        {/each}
      </select>
      {#if errors.situationPro}
        <p class="mt-1 text-sm text-red-600">{errors.situationPro}</p>
      {/if}
    </div>

    <!-- Statut professionnel -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Statut professionnel <span class="text-gray-400 text-xs">(optionnel)</span>
      </label>
      <select
        bind:value={formdata.statusPro}
        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
      >
        <option value="">Sélectionnez...</option>
        {#each values.statusPro as item}
          <option value={item.id}>{item.libelle}</option>
        {/each}
      </select>
    </div>

    <!-- Pôle sanitaire pro -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Pôle sanitaire <span class="text-gray-400 text-xs">(optionnel)</span>
      </label>
      <input
        type="text"
        bind:value={formdata.poleSanitairePro}
        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
        placeholder="Nom du pôle sanitaire"
      />
    </div>

  </div>
</div>