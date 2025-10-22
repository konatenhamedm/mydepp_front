<script>
  export let formData;
</script>

<div class="space-y-6">
  <h2 class="text-xl font-bold text-gray-900 mb-4">
    Récapitulatif - Informations établissement
  </h2>
  <ul class="grid md:grid-cols-2 gap-4 mx-auto items-center align-middle justify-center text-center">
    <li><b>Email:</b> {formData.email}</li>
    <li><b>Type de personne:</b> {formData.typePersonne}</li>
    <li><b>Niveau d'intervention:</b> {formData.niveauIntervention}</li>
      {#if formData.nom}
        <li><b>Nom:</b> {formData.nom}</li>
      {/if}
      {#if formData.prenoms}
        <li><b>Prénoms:</b> {formData.prenoms}</li>
      {/if}
      {#if formData.telephone}
        <li><b>Téléphone:</b> {formData.telephone}</li>
      {/if}
      {#if formData.bp}
        <li><b>Boîte postale:</b> {formData.bp}</li>
      {/if}
      {#if formData.emailAutre}
        <li><b>Email secondaire:</b> {formData.emailAutre}</li>
      {/if}
      {#if formData.adresse}
        <li><b>Adresse:</b> {formData.adresse}</li>
      {/if}
      {#if formData.nomRepresentant}
        <li><b>Nom du représentant:</b> {formData.nomRepresentant}</li>
      {/if}
      {#if formData.denomination}
        <li><b>Dénomination:</b> {formData.denomination}</li>
      {/if}
  </ul>
</div>
