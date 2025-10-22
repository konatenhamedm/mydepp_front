<!-- src/routes/inscription/professionnel/RecapSteps.svelte -->
<script>
  export let formdata;
  export let values;
</script>

<div class="space-y-6">
  <h2 class="text-xl font-bold text-gray-900 mb-4">Récapitulatif de votre inscription</h2>
  <ul class="grid md:grid-cols-2 gap-4">
      <li><b>Nom:</b> {formdata.nom}</li>
      <li><b>Prénoms:</b> {formdata.prenoms}</li>
      <li><b>Numero:</b> {formdata.numero}</li>
      <li><b>Email:</b> {formdata.email}</li>
      <li><b>Autre Email:</b> {formdata.emailAutre}</li>
      <li><b>Date de naissance:</b> {formdata.dateNaissance}</li>
    <li><b>Nationalité:</b> {formdata.nationalite}</li>
    <li><b>Profession:</b> {formdata.profession}</li>
    <li><b>Situation professionnelle:</b> {formdata.situationPro}</li>
    <li><b>Situation matrimoniale:</b> {formdata.situation}</li>
    
  </ul>
</div>