<script lang="ts">
  export let formdata: any;

  // Fonction pour afficher les valeurs de manière lisible
  function displayValue(value: any): string {
    if (!value) return "Non renseigné";
    if (typeof value === "string") return value;
    return String(value);
  }
</script>

<div class="space-y-6">
  <h2 class="text-2xl font-bold text-gray-900 mb-6">
    Récapitulatif de votre inscription
  </h2>

  <!-- Message d'information -->
  <div class="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
    <p class="text-sm text-green-800">
      <strong>✓ Vérification finale :</strong> Veuillez vérifier attentivement toutes les informations avant de procéder au paiement.
    </p>
  </div>

  <!-- Section 1: Informations de compte -->
  <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
    <h3 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
      <span class="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">1</span>
      Compte
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pl-11">
      <div>
        <p class="text-sm text-gray-600">Email</p>
        <p class="font-medium text-gray-900">{displayValue(formdata.email)}</p>
      </div>
    </div>
  </div>

  <!-- Section 2: Informations personnelles -->
  <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
    <h3 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
      <span class="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">2</span>
      Informations personnelles
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pl-11">
      <div>
        <p class="text-sm text-gray-600">Civilité</p>
        <p class="font-medium text-gray-900">{displayValue(formdata.civilite)}</p>
      </div>
      <div>
        <p class="text-sm text-gray-600">Nom</p>
        <p class="font-medium text-gray-900">{displayValue(formdata.nom)}</p>
      </div>
      <div>
        <p class="text-sm text-gray-600">Prénoms</p>
        <p class="font-medium text-gray-900">{displayValue(formdata.prenoms)}</p>
      </div>
      <div>
        <p class="text-sm text-gray-600">Nationalité</p>
        <p class="font-medium text-gray-900">{displayValue(formdata.nationalite)}</p>
      </div>
      <div>
        <p class="text-sm text-gray-600">Date de naissance</p>
        <p class="font-medium text-gray-900">{displayValue(formdata.dateNaissance)}</p>
      </div>
      <div>
        <p class="text-sm text-gray-600">Numéro de téléphone</p>
        <p class="font-medium text-gray-900">{displayValue(formdata.numero)}</p>
      </div>
      <div>
        <p class="text-sm text-gray-600">Situation matrimoniale</p>
        <p class="font-medium text-gray-900">{displayValue(formdata.situation)}</p>
      </div>
      {#if formdata.emailAutre}
        <div>
          <p class="text-sm text-gray-600">Email alternatif</p>
          <p class="font-medium text-gray-900">{displayValue(formdata.emailAutre)}</p>
        </div>
      {/if}
    </div>
  </div>

  <!-- Section 3: Informations professionnelles -->
  <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
    <h3 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
      <span class="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">3</span>
      Informations professionnelles
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pl-11">
      <div>
        <p class="text-sm text-gray-600">Profession</p>
        <p class="font-medium text-gray-900">{displayValue(formdata.profession)}</p>
      </div>
      <div>
        <p class="text-sm text-gray-600">Diplôme</p>
        <p class="font-medium text-gray-900">{displayValue(formdata.diplome)}</p>
      </div>
      <div>
        <p class="text-sm text-gray-600">Type de diplôme</p>
        <p class="font-medium text-gray-900">{displayValue(formdata.typeDiplome)}</p>
      </div>
      <div>
        <p class="text-sm text-gray-600">Date du diplôme</p>
        <p class="font-medium text-gray-900">{displayValue(formdata.dateDiplome)}</p>
      </div>
      <div>
        <p class="text-sm text-gray-600">Lieu d'obtention</p>
        <p class="font-medium text-gray-900">{displayValue(formdata.lieuObtentionDiplome)}</p>
      </div>
      <div>
        <p class="text-sm text-gray-600">Situation professionnelle</p>
        <p class="font-medium text-gray-900">{displayValue(formdata.situationPro)}</p>
      </div>
      {#if formdata.emailPro}
        <div>
          <p class="text-sm text-gray-600">Email professionnel</p>
          <p class="font-medium text-gray-900">{displayValue(formdata.emailPro)}</p>
        </div>
      {/if}
    </div>
  </div>

  <!-- Section 4: Lieu d'exercice -->
  <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
    <h3 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
      <span class="bg-yellow-100 text-yellow-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">4</span>
      Lieu d'exercice
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pl-11">
      <div>
        <p class="text-sm text-gray-600">Région</p>
        <p class="font-medium text-gray-900">{displayValue(formdata.region)}</p>
      </div>
      <div>
        <p class="text-sm text-gray-600">District</p>
        <p class="font-medium text-gray-900">{displayValue(formdata.district)}</p>
      </div>
      <div>
        <p class="text-sm text-gray-600">Ville</p>
        <p class="font-medium text-gray-900">{displayValue(formdata.ville)}</p>
      </div>
      <div>
        <p class="text-sm text-gray-600">Commune</p>
        <p class="font-medium text-gray-900">{displayValue(formdata.commune)}</p>
      </div>
      <div>
        <p class="text-sm text-gray-600">Quartier</p>
        <p class="font-medium text-gray-900">{displayValue(formdata.quartier)}</p>
      </div>
      {#if formdata.lieuExercicePro}
        <div>
          <p class="text-sm text-gray-600">Lieu d'exercice</p>
          <p class="font-medium text-gray-900">{displayValue(formdata.lieuExercicePro)}</p>
        </div>
      {/if}
    </div>
  </div>

  <!-- Section 5: Documents -->
  <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
    <h3 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
      <span class="bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">5</span>
      Documents
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pl-11">
      <div>
        <p class="text-sm text-gray-600">Photo d'identité</p>
        <p class="font-medium text-gray-900">
          {formdata.photo ? "✓ Fichier téléchargé" : "Non renseigné"}
        </p>
      </div>
      <div>
        <p class="text-sm text-gray-600">CNI</p>
        <p class="font-medium text-gray-900">
          {formdata.cni ? "✓ Fichier téléchargé" : "Non renseigné"}
        </p>
      </div>
      <div>
        <p class="text-sm text-gray-600">Diplôme</p>
        <p class="font-medium text-gray-900">
          {formdata.diplomeFile ? "✓ Fichier téléchargé" : "Non renseigné"}
        </p>
      </div>
      <div>
        <p class="text-sm text-gray-600">Casier judiciaire</p>
        <p class="font-medium text-gray-900">
          {formdata.casier ? "✓ Fichier téléchargé" : "Non renseigné"}
        </p>
      </div>
      {#if formdata.certificat}
        <div>
          <p class="text-sm text-gray-600">Certificat</p>
          <p class="font-medium text-gray-900">✓ Fichier téléchargé</p>
        </div>
      {/if}
      {#if formdata.cv}
        <div>
          <p class="text-sm text-gray-600">CV</p>
          <p class="font-medium text-gray-900">✓ Fichier téléchargé</p>
        </div>
      {/if}
    </div>
  </div>

  <!-- Section 6: Organisations (si applicable) -->
  {#if formdata.appartenirOrganisation === "oui" || formdata.appartenirOrdre === "oui"}
    <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <span class="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">6</span>
        Organisations professionnelles
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pl-11">
        {#if formdata.appartenirOrganisation === "oui"}
          <div>
            <p class="text-sm text-gray-600">Organisation professionnelle</p>
            <p class="font-medium text-gray-900">{displayValue(formdata.organisationNom)}</p>
          </div>
        {/if}
        {#if formdata.appartenirOrdre === "oui"}
          <div>
            <p class="text-sm text-gray-600">Numéro d'inscription à l'ordre</p>
            <p class="font-medium text-gray-900">{displayValue(formdata.numeroInscription)}</p>
          </div>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Avertissement final -->
  <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
    <p class="text-sm text-yellow-800">
      <strong>⚠️ Important :</strong> Une fois le paiement effectué, vous ne pourrez plus modifier ces informations. Assurez-vous que tout est correct.
    </p>
  </div>

</div>