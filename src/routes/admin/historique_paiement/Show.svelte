<script lang="ts">
	import InputSimple from '$components/inputs/InputSimple.svelte';
	import { BASE_URL_API } from '$lib/api';
	import { Button, Modal, Select } from 'flowbite-svelte';
	import Notification from '$components/_includes/Notification.svelte';
	import InputSelect from '$components/inputs/InputSelect.svelte';
	import { onMount } from 'svelte';
  import { formatDate } from "$lib/dateUtils";

    function cancelDelete() {
        open = false;
    }
	export let open: boolean = false; // modal control
	let isLoad = false;

	let showNotification = false;
	let notificationMessage = '';
	let notificationType = 'info';

	// Initializing the user object with only email and status

    let montant = "";
    let reference = "";
    let channel = "";
    let state = "";
    let type = "";
    let user = {
        username: "",
        typeUser: "",

        typePersonne: "",
        nom: "",
        prenoms: "",
        denomination: "",
  
        email: "",
             data : []
    };
    let createdAt = "";
	export let data: Record<string, string> = {};

	function init(form: HTMLFormElement) {


        montant = data?.montant || "";
        reference = data?.reference || "";
        channel = data?.channel || "";
        state = data?.state || "";
        type = data?.type || "";
        user = data?.user || {};``
        user.username = data?.user?.username || "";
        user.typePersonne = data?.user?.typePersonne || "";
        user.nom = data?.user?.nom || "";
        user.prenoms = data?.user?.prenoms || "";
        user.denomination = data?.personne?.denomination || "";
        user.typeUser = data?.user?.typeUser || "";
        user.email = data?.user?.email || "";
       
        createdAt = data?.createdAt || "";
        user.data = data?.user?.data || [];
		

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
				       <div class="grid grid-cols-2 gap-6">
                <div class="space-y-6">
                    {#if user.typeUser == "PROFESSIONNEL"}

                    <InputSimple type="text" fieldName="username" label="Nom et prénoms utilisateur" field={user.nom + " " + user.prenoms} disabled={true} />
                    {:else}
                    <InputSimple type="text" fieldName="username" label="Nom utilisateur" field={user.username} disabled={true} />

                    {/if}
                    <InputSimple type="text" fieldName="email" label="Email" field={user.email} disabled={true} />
                    <InputSimple type="text" fieldName="typeUser" label="Type d'utilisateur" field={user.typeUser} disabled={true} />
                    <InputSimple  type="text" fieldName="createdAt" label="Date de création" field={formatDate(createdAt)} disabled={true} />
                </div>
                <div class="space-y-6">
                    <InputSimple type="text" fieldName="montant" label="Montant" field={montant} disabled={true} />
                    <InputSimple type="text" fieldName="reference" label="Référence" field={reference} disabled={true} />
                    <InputSimple type="text" fieldName="channel" label="Canal" field={channel} disabled={true} />
                    <InputSimple type="text" fieldName="state" label="État" field={state == "1" ? "Paiement éffectué" : "Paiement échoué"} disabled={true} />
                    
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

