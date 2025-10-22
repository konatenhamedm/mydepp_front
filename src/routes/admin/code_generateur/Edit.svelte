<script lang="ts">
	import InputSimple from '$components/inputs/InputSimple.svelte';
	import { apiFetch, BASE_URL_API } from '$lib/api';
	import { Button, Modal, Select } from 'flowbite-svelte';
	import Notification from '$components/_includes/Notification.svelte';
	import InputSelect from '$components/inputs/InputSelect.svelte';
	import { onMount } from 'svelte';
	import InputTextArea from '$components/inputs/InputTextArea.svelte';
	import InputUserSelect from '$components/inputs/InputUserSelect.svelte';
    import InputDateSimple from '$components/inputs/InputDateSimple.svelte';

	export let open: boolean = false; // modal control
	let isLoad = false;
	let userdata: any = [];
	let showNotification = false;
	let notificationMessage = '';
	let notificationType = 'info';

	// Initializing the item object with only email and status
	let devise: any = {
		civilite: "",
		profession: "",
		dateNaissance: "",
		dateCreation: "",
	};
	let itemdata: any = [];

	export let data: Record<string, string> = {};

	function init(form: HTMLFormElement) {
		devise = {
			civilite: data?.civilite.id || '',
			profession: data?.profession.id || '',
			dateNaissance: data?.dateNaissance || '',
			dateCreation: data?.dateCreation || '',
		};
	}

	onMount(() => {});

	async function SaveFunction() {
		isLoad = true;

		try {
			// Example POST request (replace with your actual API call)
			const res = await apiFetch(true,'/devies/update/' + data?.id, "PUT", {

				code: devise.code, 
					symbole: devise.symbole,
					nb_decimal: devise.nb_decimal
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

/**
   * @type {any[]}
   */
   let objects = [
     { name: "profession", url: "/profession/" },
    { name: "civilites", url: "/civilite/" },
    
  ];

  let values: {
    profession: Civilite[];
    civilites: Civilite[];
    
  } = {
    civilites: [],
    profession: []
  };

  async function getData() {
    try {
      let res = null;
      objects.forEach(async (element) => {
        res = await apiFetch(true, element.url);
        if (res) {
          if (Object.keys(values).includes(element.name)) {
            values[element.name as keyof typeof values] = res.data;
          } else {
            console.error(`Invalid key: ${element.name}`);
          }
        } else {
          console.error(
            "Erreur lors de la récupération des données:",
            res.statusText
          );
        }
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  }


  onMount(async() => {
   await getData();

  });

</script>

<!-- Modal Content Wrapper -->
<div class="space-y-4 rounded-lg bg-white p-1">
	<!-- Card Body -->
	<div class="space-y-6">
		<form action="#" use:init>
			<div class="grid grid-cols-2 gap-4">
				<InputDateSimple
					fieldName="dateNaissance"
					label="Date de création"
					bind:field={devise.dateCreation}
					placeholder="entrez la date de création"
				></InputDateSimple>
				<InputDateSimple
					fieldName="dateNaissance"
					label="Date de naissance"
					bind:field={devise.dateNaissance}
					placeholder="entrez la date de naissance"
				></InputDateSimple>

				<InputSelect
					label="Civilite"
					bind:selectedId={devise.civilite}
					datas={values.civilites}
					id="civilite"
				></InputSelect>
				<InputSelect
					label="Profession"
					bind:selectedId={devise.profession}
					datas={values.profession}
					id="profession"
				></InputSelect>
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
					<div class="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
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
	<Notification message={notificationMessage} type={notificationType} duration={5000} />
{/if}
