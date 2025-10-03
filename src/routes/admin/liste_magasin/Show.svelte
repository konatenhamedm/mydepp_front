<script lang="ts">
  import { onMount } from 'svelte';
  import Notification from '$components/_includes/Notification.svelte';

  export let open: boolean = false;
  export let data: any = {}; // ta data JSON

  let isLoad = false;
  let showNotification = false;
  let notificationMessage = '';
  let notificationType = 'info';

  function cancelDelete() {
    open = false;
  }

  function handleModalClose(event: Event) {
    if (isLoad) {
      event.preventDefault();
    }
  }
</script>

<!-- Wrapper -->
<div class="bg-white rounded-lg shadow p-4 space-y-6 max-h-[80vh] overflow-y-auto">

  <!-- Détails Marchand -->
  <h2 class="text-lg font-bold text-gray-800 border-b pb-2">📋 Détails du Marchand</h2>

  <div class="space-y-3 grid grid-cols-2 gap-4">
    <div>
      <label class="font-semibold text-gray-700">Libellé</label>
      <div class="border px-3 py-2 rounded-md bg-gray-50">
        {data.libelle || "Non spécifié"}
      </div>
    </div>

    <div>
      <label class="font-semibold text-gray-700">Téléphone</label>
      <div class="border px-3 py-2 rounded-md bg-gray-50">
        {data.tel ?? "Non spécifié"}
      </div>
    </div>

    <div>
      <label class="font-semibold text-gray-700">Email</label>
      <div class="border px-3 py-2 rounded-md bg-gray-50">
        {data.email ?? "Non spécifié"}
      </div>
    </div>

    <div>
      <label class="font-semibold text-gray-700">Date de création</label>
      <div class="border px-3 py-2 rounded-md bg-gray-50">
        {new Date(data.created_at).toLocaleString()}
      </div>
    </div>
  </div>

  <!-- Détails Owner -->
  {#if data.owner}
    <h2 class="text-lg font-bold text-gray-800 border-b pb-2 mt-4">👤 Propriétaire</h2>
    <div class="space-y-3 grid grid-cols-2 gap-4">
      <div>
        <label class="font-semibold text-gray-700">Nom complet</label>
        <div class="border px-3 py-2 rounded-md bg-gray-50">
          {data.owner.nom} {data.owner.prenoms}
        </div>
      </div>
      <div>
        <label class="font-semibold text-gray-700">Email</label>
        <div class="border px-3 py-2 rounded-md bg-gray-50">
          {data.owner.email}
        </div>
      </div>
      <div>
        <label class="font-semibold text-gray-700">Téléphone</label>
        <div class="border px-3 py-2 rounded-md bg-gray-50">
          {data.owner.tel}
        </div>
      </div>
      <div>
        <label class="font-semibold text-gray-700">Dernière connexion</label>
        <div class="border px-3 py-2 rounded-md bg-gray-50">
          {data.owner.last_connection}
        </div>
      </div>
    </div>
  {/if}

  <!-- Détails Pays & Devise -->
  {#if data.pays_devise}
    <h2 class="text-lg font-bold text-gray-800 border-b pb-2 mt-4">🌍 Pays & Devise</h2>
    <div class="space-y-3 grid grid-cols-2 gap-4">
      <div>
        <label class="font-semibold text-gray-700">Pays</label>
        <div class="border px-3 py-2 rounded-md bg-gray-50">
          {data.pays_devise.pays.libelle} (+{data.pays_devise.pays.code})
        </div>
      </div>
      <div>
        <label class="font-semibold text-gray-700">Devise</label>
        <div class="border px-3 py-2 rounded-md bg-gray-50">
          {data.pays_devise.devise.code} ({data.pays_devise.devise.symbole})
        </div>
      </div>
    </div>
  {/if}

  <!-- Footer -->
  <div class="flex justify-end pt-4 border-t border-gray-200">
    <button
      on:click={cancelDelete}
      disabled={isLoad}
      class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
    >
      Fermer
    </button>
  </div>
</div>

{#if showNotification}
  <Notification message={notificationMessage} type={notificationType} duration={5000} />
{/if}
