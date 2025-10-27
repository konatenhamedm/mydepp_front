<script>
  export let formdata;
  export let values;
  export let errors = {}; // ← AJOUT : prop pour les erreurs

  const situationsMatrimoniales = [
    {value: 'Célibataire', label: 'Célibataire'},
    {value: 'Marié(e)', label: 'Marié(e)'},
    {value: 'Divorcé(e)', label: 'Divorcé(e)'},
    {value: 'Veuf (Veuve)', label: 'Veuf (Veuve)'},
  ];
</script>

<main>
    <form>
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
                        class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12
                        {errors.nom ? 'border-red-500' : 'border-gray-300'}"
                        placeholder="Votre nom"
                        required={true}
                        name="nom"
                        bind:value={formdata.nom}
                      />
                    </div>
                    <!-- ↓ AJOUT : Message d'erreur -->
                    {#if errors.nom}
                      <p class="mt-1 text-sm text-red-600">{errors.nom}</p>
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
                        class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12
                        {errors.prenoms ? 'border-red-500' : 'border-gray-300'}"
                        placeholder="Vos prénoms"
                        required={true}
                        name="prenoms"
                        bind:value={formdata.prenoms}
                      />
                    </div>
                    <!-- ↓ AJOUT : Message d'erreur -->
                    {#if errors.prenoms}
                      <p class="mt-1 text-sm text-red-600">{errors.prenoms}</p>
                    {/if}
                  </div>
                </div>
                
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      for="Nationalite"
                      class="block text-sm font-medium text-gray-700 mb-2"
                      >Nationalité *</label
                    >
                    <div class="relative">
                     <select
                       id="Nationalite"
                       class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12
                       {errors.nationalite ? 'border-red-500' : 'border-gray-300'}"
                       required={true}
                       name="Nationalite"
                       bind:value={formdata.nationalite}
                     >
                       <option value="">Sélectionnez votre nationalité</option>
                       {#each values.nationate as option}
                         <option value={option.id}>{option.libelle}</option>
                       {/each}
                     </select>
                    </div>
                    <!-- ↓ AJOUT : Message d'erreur -->
                    {#if errors.nationalite}
                      <p class="mt-1 text-sm text-red-600">{errors.nationalite}</p>
                    {/if}
                  </div>
                  <div>
                    <label
                      for="civilite"
                      class="block text-sm font-medium text-gray-700 mb-2"
                      >Civilité *</label
                    >
                    <div class="relative">
                      <select
                       id="civilite"
                       class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12
                       {errors.civilite ? 'border-red-500' : 'border-gray-300'}"
                       required={true}
                       name="civilite"
                       bind:value={formdata.civilite}
                     >
                       <option value="">Sélectionnez votre civilité</option>
                       {#each values.civilite as option}
                         <option value={option.code}>{option.libelle}</option>
                       {/each}
                     </select>
                    </div>
                    <!-- ↓ AJOUT : Message d'erreur -->
                    {#if errors.civilite}
                      <p class="mt-1 text-sm text-red-600">{errors.civilite}</p>
                    {/if}
                  </div>
                </div>
                
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      for="emailAutre"
                      class="block text-sm font-medium text-gray-700 mb-2"
                      >Email <span class="text-gray-400 text-xs">(optionnel)</span></label
                    >
                    <div class="relative">
                      <input
                        type="email"
                        id="emailAutre"
                        class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12
                        {errors.emailAutre ? 'border-red-500' : 'border-gray-300'}"
                        placeholder="Votre email"
                        name="emailAutre"
                        bind:value={formdata.emailAutre}
                      />
                    </div>
                    <!-- ↓ AJOUT : Message d'erreur -->
                    {#if errors.emailAutre}
                      <p class="mt-1 text-sm text-red-600">{errors.emailAutre}</p>
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
                        class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12
                        {errors.numero ? 'border-red-500' : 'border-gray-300'}"
                        placeholder="Votre numéro de téléphone"
                        required={true}
                        name="numero"
                        bind:value={formdata.numero}
                      />
                    </div>
                    <!-- ↓ AJOUT : Message d'erreur -->
                    {#if errors.numero}
                      <p class="mt-1 text-sm text-red-600">{errors.numero}</p>
                    {:else}
                      <p class="mt-1 text-xs text-gray-500">Format : +225 0123456789 ou 0123456789</p>
                    {/if}
                  </div>
                </div>
                
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      for="dateNaissance"
                      class="block text-sm font-medium text-gray-700 mb-2"
                      >Date de Naissance *</label
                    >
                    <div class="relative">
                      <input
                        type="date"
                        id="dateNaissance"
                        class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12
                        {errors.dateNaissance ? 'border-red-500' : 'border-gray-300'}"
                        placeholder="Votre date de naissance"
                        required={true}
                        name="dateNaissance"
                        bind:value={formdata.dateNaissance}
                      />
                    </div>
                    <!-- ↓ AJOUT : Message d'erreur -->
                    {#if errors.dateNaissance}
                      <p class="mt-1 text-sm text-red-600">{errors.dateNaissance}</p>
                    {/if}
                  </div>
                  <div>
                    <label
                      for="situation"
                      class="block text-sm font-medium text-gray-700 mb-2"
                      >Situation matrimoniale *</label
                    >
                    <div class="relative">
                      <select
                       id="situation"
                       class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12
                       {errors.situation ? 'border-red-500' : 'border-gray-300'}"
                       required={true}
                       name="situation"
                       bind:value={formdata.situation}
                     >
                       <option value="">Sélectionnez votre situation matrimoniale</option>
                       {#each situationsMatrimoniales as option}
                         <option value={option.value}>{option.label}</option>
                       {/each}
                     </select>
                    </div>
                    <!-- ↓ AJOUT : Message d'erreur -->
                    {#if errors.situation}
                      <p class="mt-1 text-sm text-red-600">{errors.situation}</p>
                    {/if}
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
.gap-4 {
  gap: 1rem;
}
.gap-8 {
  gap: 2rem;
}

/* Label */
.block {
  display: block;
}
.text-sm {
  font-size: 0.875rem;
}
.text-xs {
  font-size: 0.75rem;
}
.font-semibold {
  font-weight: 600;
}
.font-medium {
  font-weight: 500;
}
.text-gray-700 {
  color: #374151;
}
.text-gray-400 {
  color: #9ca3af;
}
.text-gray-500 {
  color: #6b7280;
}
.text-red-600 {
  color: #dc2626;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.mb-3 {
  margin-bottom: 0.75rem;
}
.mt-1 {
  margin-top: 0.25rem;
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
.border {
  border-width: 1px;
}
.border-b-2 {
  border-bottom-width: 2px;
}
.border-gray-300 {
  border-color: #d1d5db;
}
.border-red-500 {
  border-color: #ef4444;
}
.border-blue-300 {
  border-color: #93c5fd;
}
.rounded-lg {
  border-radius: 0.5rem;
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
.focus\:border-transparent:focus {
  border-color: transparent;
}
.focus\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.focus\:ring-purple-500:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(168 85 247 / var(--tw-ring-opacity));
}
.focus\:outline-none:focus {
  outline: none;
}
.transition-all {
  transition-property: all;
  transition-duration: 0.2s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
.duration-200 {
  transition-duration: 0.2s;
}
.pr-8 {
  padding-right: 2rem;
}
.pr-12 {
  padding-right: 3rem;
}

/* Pour l'icône de flèche */
.absolute {
  position: absolute;
}
.relative {
  position: relative;
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
</style>