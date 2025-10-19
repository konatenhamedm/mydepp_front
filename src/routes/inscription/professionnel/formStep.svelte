<script>

   
    export let formdata;
  export let values;
     const situationsMatrimoniales = [
    {value: 'Célibataire', label: 'Célibataire'},
    {value: 'Marié(e)', label: 'Marié(e)'},
    {value: 'Divorcé(e)', label: 'Divorcé(e)'},
    {value: 'Veuf (Veuve)', label: 'Veuf (Veuve)'},
  ];
</script>

<main>
    <form >
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
                        bind:value={formdata.nom}
                      />
                    </div>
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
                        bind:value={formdata.prenoms}
                      />
                    </div>
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
                     <select
                       id="Nationalite"
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
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
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
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
                  </div>
                </div>
                 <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      for="emailAutre"
                      class="block text-sm font-medium text-gray-700 mb-2"
                      >Email *</label
                    >
                    <div class="relative">
                      <input
                        type="email"
                        id="emailAutre"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                        placeholder="Votre email"
                        required={true}
                        
                        name="emailAutre"
                        bind:value={formdata.emailAutre}
                      />
                    </div>
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
                        bind:value={formdata.numero}
                      />
                    </div>
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
                        bind:value={formdata.dateNaissance}
                      />
                    </div>
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
                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
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
.text-sm {
  font-size: 0.875rem;
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