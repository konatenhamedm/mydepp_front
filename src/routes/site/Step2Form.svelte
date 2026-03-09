
<script lang="ts">
    import SelectInput from "./SelectInput.svelte";
    import TextInput from "./TextInput.svelte";

    export let formData: any;
    export let errors: any;
    export let saveFormState: () => void;
    export let values: any;
    export let showTitle: boolean = true;
    export let situationsMatrimoniales: any;
    function saveFormStateComponent() {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      localStorage.setItem("formData", JSON.stringify(formData));
     /*  localStorage.setItem("step", step.toString()); */
    }
  }
  </script>


{#if showTitle}
  <h2 class="text-3xl h2-baslik-anasayfa-ozel font-semibold mb-4 text-center md:text-left">
    Informations personnelles (étape 2/6)
  </h2>
{/if}

  
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
    <TextInput
      type="text"
      label="Nom"
      bind:value={formData.nom}
      placeholder="Entrez votre nom"
      error={errors.nom}
      onInput={saveFormState}
      step={2}
      
    />
  
    <TextInput
      type="text"
      label="Prénoms"
      bind:value={formData.prenoms}
      placeholder="Entrez votre prénom"
      error={errors.prenoms}
      onInput={saveFormState}
      step={2}
    />
  
    <SelectInput
        bind:formData
      label="Nationalité"
      bind:value={formData.nationalite}
      options={values.nationate.map((c:any) => ({
        id: String(c.id),
        libelle: c.libelle
      }))}
      placeholder="Veuillez sélectionner une nationalité"
      error={errors.nationalite}
      onInput={saveFormState}
      step={2}
    />
  
    <SelectInput
    bind:formData
      label="Civilité"
      bind:value={formData.civilite}
      options={values.civilite.map((c:any) => ({
        id: String(c.id),
        libelle: c.libelle
      }))}
      placeholder="Veuillez sélectionner une civilité"
      error={errors.civilite}
      onInput={saveFormState}
      step={2}
    />
  
    <TextInput
    bind:formData
      type="email"
      label="Email"
      bind:value={formData.emailAutre}
      placeholder="Entrez votre email"
      error={errors.emailAutre}
      onInput={saveFormState}
      step={2}
    />
  
    <TextInput
    bind:formData

      type="tel"
      label="Contact"
      bind:value={formData.numero}
      placeholder="07xxxxxxxx"
      error={errors.numero}
      onInput={saveFormState}
      step={2}
    />
  
    <TextInput
    bind:formData

      type="date"
      label="Date de naissance"
      bind:value={formData.dateNaissance}
      placeholder="Entrez votre date de naissance"
      error={errors.dateNaissance}
      onInput={saveFormState}
      step={2}
    />
  
    <SelectInput
    bind:formData
      label="Situation matrimoniale"
      bind:value={formData.situation}
      options={situationsMatrimoniales.map((c:any) => ({
        id: String(c.value),
        libelle: c.label
      }))}
      placeholder="Veuillez sélectionner une situation matrimoniale"
      error={errors.situation}
      onInput={saveFormState}
      step={2}
    />
  </div>
 