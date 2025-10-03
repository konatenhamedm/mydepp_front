<script lang="ts">
  export let open: boolean = false;
  export let data: any = {}; // ton JSON passé en prop

  function close() {
    open = false;
  }
</script>

<div class="bg-white rounded-xl shadow p-6 max-h-[80vh] overflow-y-auto">
  <!-- Header -->
  <h2 class="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
    👤 Détails de l'utilisateur
  </h2>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Bloc Identité -->
    <div class="space-y-2">
      <h3 class="font-semibold text-gray-700 mb-2">Identité</h3>
      <div><span class="font-medium">Nom :</span> {data.nom}</div>
      <div><span class="font-medium">Prénoms :</span> {data.prenoms}</div>
      <div><span class="font-medium">Téléphone :</span> {data.tel ?? 'Non spécifié'}</div>
      <div><span class="font-medium">Email :</span> {data.email}</div>
      <div><span class="font-medium">Login :</span> {data.login}</div>
    </div>

    <!-- Bloc Appareil -->
    <div class="space-y-2">
      <h3 class="font-semibold text-gray-700 mb-2">Appareil</h3>
      <div><span class="font-medium">Version App :</span> {data.app_version}</div>
      <div><span class="font-medium">Build :</span> {data.build_version}</div>
      <div><span class="font-medium">Type :</span> {data.device_type}</div>
      <div><span class="font-medium">Dernière connexion :</span> {data.last_connection}</div>
    </div>
  </div>

  <!-- Bloc Sécurité -->
  <div class="mt-6 space-y-2">
    <h3 class="font-semibold text-gray-700 mb-2">Sécurité</h3>
    <div><span class="font-medium">Email vérifié :</span> {data.email_verified_at ? 'Oui ✅' : 'Non ❌'}</div>
    <div><span class="font-medium">Code de vérification :</span> {data.verification_code}</div>
    <div><span class="font-medium">Expiration :</span> {data.verification_code_expiration}</div>
  </div>

  <!-- Bloc Rôle -->
  {#if data.role}
    <div class="mt-6 space-y-2">
      <h3 class="font-semibold text-gray-700 mb-2">Rôle</h3>
      <div><span class="font-medium">Libellé :</span> {data.role.libelle}</div>
      <div><span class="font-medium">Code :</span> {data.role.code}</div>
    </div>
  {/if}

  <!-- Footer -->
  <div class="flex justify-end mt-6 border-t pt-4">
    <button
      on:click={close}
      class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
    >
      Fermer
    </button>
  </div>
</div>
