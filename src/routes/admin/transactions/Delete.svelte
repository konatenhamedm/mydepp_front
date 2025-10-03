<script lang="ts">
    import { apiFetch, BASE_URL } from '$lib/api';
    import { Button, Modal } from 'flowbite-svelte';
    import Notification from '$components/_includes/Notification.svelte';
    import { onMount } from 'svelte';

    export let open: boolean = false; // modal control
    let isLoad = false;
  
    let showNotification = false;
    let notificationMessage = '';
    let notificationType = 'info'; 
    
    export let data: Record<string, string> = {};

    function init(form: HTMLFormElement) {
        // Initialisation si nécessaire
    }

    async function confirmDelete() {
        isLoad = true;
        try {
            const res = await apiFetch(true , '/role/delete/' + data?.id,'DELETE');
            
            if (res) {
                notificationMessage = 'Utilisateur supprimé avec succès!';
                notificationType = 'success';
                open = false;
            } else {
                notificationMessage = (res.message);
                notificationType = 'error';
            }
            showNotification = true;
        } catch (error) {
            notificationMessage = error?.message || 'Une erreur est survenue';
            notificationType = 'error';
            showNotification = true;
            console.error("Error deleting:", error);
        } finally {
            isLoad = false;
        }
    }

    function cancelDelete() {
        open = false;
    }

    function handleModalClose(event: Event) {
        if (isLoad) {
            event.preventDefault(); 
        }
    }
</script>

<!-- Modal Content Wrapper -->
<div class="bg-white rounded-lg shadow p-1 space-y-4">
    <!-- Message d'alerte -->
    <div class="text-center">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Confirmer la suppression</h3>
        <p class="text-gray-500">Êtes-vous sûr de vouloir supprimer cet enregistrement ({data?.libelle}) ? Cette action est irréversible.</p>
    </div>

    <!-- Boutons d'action -->
    <div class="flex justify-end pt-4 border-t border-gray-200 space-x-3">
        <button style="margin-right: 9px;"
            on:click={cancelDelete}
            disabled={isLoad}
            class="px-4 py-2  mr-[9px] text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
            Annuler
        </button>
        {#if isLoad}
            <button disabled class="bg-red-500 text-white px-4 py-2 rounded opacity-50 cursor-not-allowed">
                <div class="flex items-center space-x-2">
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Suppression...</span>
                </div>
            </button>
        {:else}
            <button
                on:click={confirmDelete}
                class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
                Confirmer la suppression
            </button>
        {/if}
    </div>
</div>

<!-- Notification Component -->
{#if showNotification}
    <Notification message={notificationMessage} type={notificationType} duration={5000} />
{/if}