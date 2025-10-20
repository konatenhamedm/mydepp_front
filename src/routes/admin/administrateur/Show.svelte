<script lang="ts">
	import InputSimple from '$components/inputs/InputSimple.svelte';
	import { BASE_URL_API } from '$lib/api';
	import { Button, Modal, Select } from 'flowbite-svelte';
	import Notification from '$components/_includes/Notification.svelte';
	import InputSelect from '$components/inputs/InputSelect.svelte';
	import { onMount } from 'svelte';
    function cancelDelete() {
        open = false;
    }
	export let open: boolean = false; // modal control
	let isLoad = false;

	let showNotification = false;
	let notificationMessage = '';
	let notificationType = 'info';

	// Initializing the user object with only email and status
	let item: any = {
		   

    email: "",
    nom: "",
    prenoms: "",
    typeUser: ""

	};

    let typeUser: any = [
    {
      id: "ADMINISTRATEUR",
      libelle: "ADMINISTRATEUR"
    },
    {
     id: "DIRECTEUR",
     libelle: "DIRECTEUR"
    },
    {
      id: "SOUS-DIRECTEUR-PROF",
      libelle: "SOUS-DIRECTEUR-PROF"
    },
    {
      id: "SOUS-DIRECTEUR-ETAB",
      libelle: "SOUS-DIRECTEUR-ETAB"
    },
    {
      id: "INSTRUCTEUR-ETAB",
      libelle: "INSTRUCTEUR-ETAB"
    },
    {
      id: "INSTRUCTEUR-SECOND-ETAB",
      libelle: "INSTRUCTEUR-SECOND-ETAB"
    },
    {
      id: "INSTRUCTEUR-PROF",
      libelle: "INSTRUCTEUR-PROF"
    },
    {
      id: "INSTRUCTEUR-SECOND-PROF",
      libelle: "INSTRUCTEUR-SECOND-PROF"
    },
    {
      id: "COMPTABLE",
      libelle: "COMPTABLE"
    },
    {
      id: "INSPECTEUR-ETAB",
      libelle: "INSPECTEUR-ETAB"
    }
  ];

	export let data: Record<string, string> = {};

	function init(form: HTMLFormElement) {

    
 
      
       item.email = data?.email
       item.nom = data?.personne?.nom
       item.prenoms = data?.personne?.prenoms
       item.typeUser = data?.typeUser

    }

	onMount(() => {});

	

	function handleModalClose(event: Event) {
		if (isLoad) {
			event.preventDefault();
		}
	}
</script>




<!-- Modal Content Wrapper -->
<div class="bg-white rounded-lg  p-1 space-y-4">

    <!-- Card Body -->
    <div class="space-y-6">
        <form action="#" use:init>
			<div class="grid grid-cols-1 gap-1 mb-1">
				<div class="flex flex-col items-start mb-3">
					<label class="font-semibold text-gray-700">Nom</label>
					<div class="bg-white px-3 py-2 w-full border border-gray-300 rounded-md text-gray-700">
						{item.nom || "Non spécifié"}
					</div>
				</div>
				<div class="flex flex-col items-start mb-3">
					<label class="font-semibold text-gray-700">Prenoms</label>
					<div class="bg-white px-3 py-2 w-full border border-gray-300 rounded-md text-gray-700">
						{item.prenoms || "Non spécifié"}
					</div>
				</div>
				<div class="flex flex-col items-start mb-3">
					<label class="font-semibold text-gray-700">Email</label>
					<div class="bg-white px-3 py-2 w-full border border-gray-300 rounded-md text-gray-700">
						{item.email || "Non spécifié"}
					</div>
				</div>
                <div class="flex flex-col items-start mb-3">
                    <label class="font-semibold text-gray-700">Type utilisateur</label>
                    <div class="bg-white px-3 py-2 w-full border border-gray-300 rounded-md text-gray-700">
                        {item.typeUser || "Non spécifié"}
                    </div>
                </div>
			</div>
            
			

		</form>
    </div>

    <!-- Card Footer -->
    <div class="flex justify-end pt-4 border-t border-gray-200">
        <button style="margin-right: 9px;"
        on:click={cancelDelete}
        disabled={isLoad}
        class="px-4 py-2  mr-[9px] text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
    >
        Annuler
    </button>
    </div>

</div>

<!-- Notification Component -->
{#if showNotification}
    <Notification message={notificationMessage} type={notificationType} duration={5000} />
{/if}

