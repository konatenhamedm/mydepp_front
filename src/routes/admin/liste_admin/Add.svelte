<script lang="ts">
  import {onMount} from 'svelte';
  import InputSimple from '$components/inputse/InputSimple.svelte';
  import Notification from '$components/_includes/Notification.svelte';
  import InputSelect from '$components/inputse/InputSelect.svelte';
  import {apiFetch, BASE_URL} from '$lib/api';

  export let open: boolean = false; // modal control
  let isLoad = false;

  let showNotification = false;
  let notificationMessage = '';
  let notificationType: 'info' | 'success' | 'error' = 'info';

  // Formulaire admin
  let admin = {
    nom: '',
    prenoms: '',
    email: '',
    tel: '',
    password: '',
    role_id: 0,
  };


  let roles: any[] = [];

  async function loadRoles() {
    try {
      const res = await apiFetch(true, '/roles/admin/all');

      console.log(res);
      if (res) {
        roles = res.data; 
      }
    } catch (error) {
      console.error('Erreur chargement rôles:', error);
    }
  }

  async function saveAdmin() {
    isLoad = true;
    try {
      const res = await apiFetch(true, '/admins/create', 'POST', admin);

      if (res.ok) {
        const result = await res.json();
        notificationMessage = 'Admin créé avec succès ✅';
        notificationType = 'success';
        showNotification = true;
        open = false;
      } else {
        const err = await res.json();
        notificationMessage = err.message || 'Erreur lors de la création ❌';
        notificationType = 'error';
        showNotification = true;
      }
    } catch (error) {
      console.error('Erreur saveAdmin:', error);
      notificationMessage = 'Impossible de sauvegarder ❌';
      notificationType = 'error';
      showNotification = true;
    } finally {
      isLoad = false;
    }
  }

  onMount(async () => {
    loadRoles();
  });
</script>

<!-- Modal Content -->
<div class="space-y-4 rounded-lg bg-white p-6 shadow-md">
  <!--  <h2 class="text-lg font-semibold text-gray-800 border-b pb-2">➕ Créer un administrateur</h2>
 -->
  <!-- Form -->
  <form class="space-y-6">
    <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
      <InputSimple
        fieldName="nom"
        label="Nom"
        bind:field={admin.nom}
        placeholder="Nom"
      />
      <InputSimple
        fieldName="prenoms"
        label="Prénoms"
        bind:field={admin.prenoms}
        placeholder="Prénoms"
      />
      <InputSimple
        fieldName="email"
        label="Email"
        type="email"
        bind:field={admin.email}
        placeholder="Adresse email"
      />
      <InputSimple
        fieldName="tel"
        label="Téléphone"
        bind:field={admin.tel}
        placeholder="Téléphone"
      />
      <InputSimple
        fieldName="password"
        label="Mot de passe"
        type="password"
        bind:field={admin.password}
        placeholder="Mot de passe"
      />

      <InputSelect
        label="Type mission"
        bind:selectedId={admin.role_id}
        datas={roles}
        id="role_idion_id"
      />
    </div>
  </form>

  <!-- Footer -->
  <div class="flex justify-end border-t border-gray-200 pt-4">
    {#if isLoad}
      <button
        disabled
        class="cursor-not-allowed rounded bg-blue-500 px-4 py-2 text-white opacity-50 flex items-center gap-2"
      >
        <div
          class="h-4 w-4 animate-spin rounded-full border-b-2 border-white"
        ></div>
        Chargement...
      </button>
    {:else}
      <button
        on:click|preventDefault={saveAdmin}
        class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Enregistrer
      </button>
    {/if}
  </div>
</div>

<!-- Notifications -->
{#if showNotification}
  <Notification
    message={notificationMessage}
    type={notificationType}
    duration={5000}
  />
{/if}
