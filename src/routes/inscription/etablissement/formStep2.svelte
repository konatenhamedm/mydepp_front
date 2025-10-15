<script>

    export let typePersonne;
    export let niveauIntervention;
    export let formdata;

    console.log(typePersonne);
    console.log(niveauIntervention);
</script>

<main>
    <form >
            <div class="grid md:grid-cols-2 gap-8">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3"
                  >Niveau d'Intervention *</label
                >
                <div class="relative">
                  <select
                    name="niveauIntervention"
                    
                    bind:value={formdata.niveauIntervention}
                    class="w-full px-4 py-3 border-b-2 border-blue-300 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all duration-200 pr-8"
                  >
                   <option value="" selected={true}>
                      Sélectionnez le niveau d'intervention
                    </option>
                  {#each niveauIntervention as intervention}
                    <option value={intervention.id}>{intervention.libelle}</option>
                  {/each}
                 
                   
                   
                  </select>
                  <div
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center"
                  >
                    <i class="ri-arrow-down-s-line text-gray-400"></i>
                  </div>
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3"
                  >Entité juridique *</label
                >
                <div class="relative">
                  <select
                    name="entiteJuridique"
                    
                    bind:value={formdata.typePersonne}
                    class="w-full px-4 py-3 border-b-2 border-blue-300 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all duration-200 pr-8"
                  >
                    <option value="" selected={true}>Choisir l'entité</option>
                    {#each typePersonne as type}
                    <option value={type.libelle}>{type.libelle}</option>
                  {/each}
                  </select>
                  <div
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center"
                  >
                    <i class="ri-arrow-down-s-line text-gray-400"></i>
                  </div>
                </div>
              </div>
            </div>
            {#if formdata.typePersonne == "PHYSIQUE"}
            <div class="grid md:grid-cols-2 gap-8">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3"
                  >Nom *</label
                ><input
                  type="text"
                  
                  bind:value={formdata.nom}
                  placeholder="Nom"
                  class="w-full px-4 py-3 border-b-2 border-blue-300 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all duration-200"
                  name="nom"
                  
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3"
                  >Prénoms *</label
                ><input
                  type="text"
                  
                  placeholder="Prénoms"
                  class="w-full px-4 py-3 border-b-2 border-blue-300 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all duration-200"
                  name="prenoms"
                  bind:value={formdata.prenoms}
                />
              </div>
            </div>
            <div class="grid md:grid-cols-2 gap-8">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3"
                  >Téléphone *</label
                ><input
                  type="tel"
                  
                  placeholder="Téléphone"
                  class="w-full px-4 py-3 border-b-2 border-blue-300 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all duration-200"
                  name="telephone"
                  bind:value={formdata.telephone}
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3"
                  >Boîte Postale *</label
                ><input
                  type="text"
                  
                  placeholder="Boîte Postale"
                  class="w-full px-4 py-3 border-b-2 border-blue-300 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all duration-200"
                  name="boitePostale"
                  bind:value={formdata.bp}
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3"
                >Autre E-mail *</label
              ><input
                type="email"
                
                placeholder="Autre E-mail"
                class="w-full px-4 py-3 border-b-2 border-blue-300 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all duration-200"
                name="email"
                bind:value={formdata.emailAutre}
              />
            </div>
            {:else if formdata.typePersonne == "MORALE"}

<div class="grid md:grid-cols-2 gap-8">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3"
                  >Adresse *</label
                ><input
                  type="text"
                  
                  placeholder="Adresse"
                  class="w-full px-4 py-3 border-b-2 border-blue-300 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all duration-200"
                  name="adresse"
                  bind:value={formdata.adresse}
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3"
                  >Nom Representant *</label
                ><input
                  type="text"
                  
                  placeholder="Nom Representant"
                  class="w-full px-4 py-3 border-b-2 border-blue-300 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all duration-200"
                  name="nomRepresentant"
                  bind:value={formdata.nomRepresentant}
                />
              </div>
            
            </div>
             <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3"
                >Denomination *</label
              ><input
                type="text"
                
                placeholder="Denomination"
                class="w-full px-4 py-3 border-b-2 border-blue-300 bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all duration-200"
                name="denomination"
                bind:value={formdata.denomination}
              />
            </div>
            {/if}
           
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