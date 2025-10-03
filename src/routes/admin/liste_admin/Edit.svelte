<script lang="ts">
  import InputSimple from '$components/inputse/InputSimple.svelte';
  import {apiFetch, BASE_URL} from '$lib/api';
  import {Button, Modal, Select} from 'flowbite-svelte';
  import Notification from '$components/_includes/Notification.svelte';
  import InputSelect from '$components/inputse/InputSelect.svelte';
  import {onMount} from 'svelte';
  import InputTextArea from '$components/inputse/InputTextArea.svelte';
  import InputUserSelect from '$components/inputse/InputUserSelect.svelte';

  export let open: boolean = false;
  let isLoad = false;
  let userdata: any = [];
  let showNotification = false;
  let notificationMessage = '';
  let notificationType = 'info';

  let admin = {
    nom: '',
    prenoms: '',
    email: '',
    tel: '',
    password: '',
    role_id: 0,
  };
  let itemdata: any = [];

  export let data: Record<string, string> = {};

  function init(form: HTMLFormElement) {
    admin = {
      nom: data?.nom || '',
      prenoms: data?.prenoms || '',
      email: data?.email || '',
      tel: data?.tel || '',
      password: data?.password || '',
      role_id: Number(data?.role_id) || 0,
    };
  }

  let roles: any[] = [];

  async function loadRoles() {
    try {
      const res = await apiFetch(true, '/roles/admin/all');

      console.log(res);
      if (res) {
        roles = res.data; // selon ton backend
      }
    } catch (error) {
      console.error('Erreur chargement rôles:', error);
    }
  }

  onMount(async () => {
    loadRoles();
  });
  async function SaveFunction() {
    isLoad = true;

    try {
      const res = await apiFetch(true, '/admins/update/' + data?.id, 'PUT', {
        admin: admin.email,
        nom: admin.nom,
        prenoms: admin.prenoms,
        tel: admin.tel,
        password: admin.password,
        role_id: admin.role_id,
      });

      if (res.ok) {
        isLoad = false;
        open = false; // Close the modal
      }
    } catch (error) {
      console.error('Error saving:', error);
    }
  }

  function handleModalClose(event: Event) {
    if (isLoad) {
      event.preventDefault();
    }
  }
</script>

<!-- Modal Content Wrapper -->
<div class="space-y-4 rounded-lg bg-white p-1 shadow">
  <!-- Card Body -->
  <div class="space-y-6">
    <form action="#" use:init>
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
  </div>

  <!-- Card Footer -->
  <div class="flex justify-end border-t border-gray-200 pt-4">
    {#if isLoad}
      <button
        disabled
        class="cursor-not-allowed rounded bg-blue-500 px-4 py-2 text-white opacity-50"
      >
        <div class="flex items-center space-x-2">
          <div
            class="h-5 w-5 animate-spin rounded-full border-b-2 border-white"
          ></div>
          <span>Chargement...</span>
        </div>
      </button>
    {:else}
      <button
        on:click={SaveFunction}
        class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Enregistrer
      </button>
    {/if}
  </div>
</div>

<!-- Notification Component -->
{#if showNotification}
  <Notification
    message={notificationMessage}
    type={notificationType}
    duration={5000}
  />
{/if}
