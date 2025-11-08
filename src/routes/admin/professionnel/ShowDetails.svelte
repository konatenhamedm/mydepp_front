<script lang="ts">
	import InputCheck from "$components/inputs/InputCheck.svelte";
	import InputSimple from "$components/inputs/InputSimple.svelte";
	import { apiFetch, BASE_URL_API, BASE_URL_API_UPLOAD } from "$lib/api";

	import { Button, Modal } from "flowbite-svelte";
	import { TrashBinSolid } from "flowbite-svelte-icons";
	import { createEventDispatcher, onMount } from "svelte";
	import DocShow from "./DocShow.svelte";
	import { format } from "date-fns";
	import RecuPaiement from "./RecuPaiement.svelte";
	import FicheInscription from "./FicheInscription.svelte";
	import Modale from "$components/Modales/Modale.svelte";

	let isLoad = false;

	export let userUpdateId: any;
	export let data: Record<string, string> = {};
	function cancelDelete() {
		open = false;
	}
	export let open: boolean = false;
	export let sizeModal: any = "lg";
	const dispatch = createEventDispatcher();

	let professionLibelle: string = "";

	const url_image = BASE_URL_API_UPLOAD;
	let persionneId: any;
	let numero: any;
	let nom: any;
	let status: any;
	let prenoms: any;
	let professionnel: any;
	let datePremierDiplome: any;
	let poleSanitaire: any;
	let poleSanitairePro: any;
	let organisationNom: any;
	let lieuExercicePro: any;
	let profession: any;
	let civilite: any;
	let dateNaissance: any;
	let nationalite: any;
	let situation: any;
	let dateDiplome: any;
	let diplome: any;
	let situationPro: any;
	let userEmail: any;
	let typeUser: any;
	let appartenirOrganisation: any;
	let appartenirOrdre: any;
	let numeroInscription: any;
	let photo: any;
	let cni: any;
	let cv: any;
	let CVpath: any;
	let CValt: any;
	let reason: any;

	let Photopath: any;
	let Photoalt: any;
	let diplomeFilePath: any;
	let diplomeFileAlt: any;
	let cniPath: any;
	let cniAlt: any;
	let casierPath: any;
	let casierAlt: any;
	let certificatPath: any;
	let certificatAlt: any;
	let lieuDiplome: any;

	function init(form: HTMLFormElement) {
		console.log(`je suis la data `, data);
		numero = data.personne.number || "";
		nom = data.personne.nom || "";
		status = data.personne.status || "";
		professionLibelle = data.personne.profession
			? data.personne.profession.libelle
			: "";
		prenoms = data.personne.prenoms || "";
		reason = data.personne.reason || "";
		professionnel = data.personne.professionnel || "";
		civilite = data.personne.civilite ? data.personne.civilite.libelle : "";
		nationalite = data.personne.nationate
			? data.personne.nationate.libelle
			: "";
		dateNaissance = data.personne.dateNaissance || "";
		dateDiplome = data.personne.dateDiplome || "";
		diplome = data.personne.diplome || "";
		poleSanitaire = data.personne.poleSanitaire || "";
		organisationNom = data.personne.organisationNom || "";
		poleSanitairePro = data.personne.poleSanitairePro || "";
		lieuExercicePro = data.personne.lieuExercicePro || "";
		datePremierDiplome = data.personne.datePremierDiplome || "";
		situationPro = data.personne.situationPro.libelle || "";
		situation = data.personne.situation || "";
		typeUser = data?.typeUser || "";
		userEmail = data.email || "";
		appartenirOrganisation = data.personne.appartenirOrganisation || "";
		appartenirOrdre = data.personne.appartenirOrdre || "";
		numeroInscription = data.personne.numeroInscription || "";
		photo = data.personne.photo || "";
		cni = data.personne.cni || "";
		CVpath = data.personne.cv ? data.personne.cv.path : "";
		CValt = data.personne.cv ? data.personne.cv.alt : "";
		Photopath = data.personne.photo ? data.personne.photo.path : "";
		Photoalt = photo ? data.personne.photo.alt : "";
		diplomeFilePath = data.personne.diplomeFile
			? data.personne.diplomeFile.path
			: "";
		diplomeFileAlt = data.personne.diplomeFile
			? data.personne.diplomeFile.alt
			: "";
		cniPath = data.personne.cni ? data.personne.cni.path : "";
		cniAlt = data.personne.cni ? data.personne.cni.alt : "";
		casierPath = data.personne.casier ? data.personne.casier.path : "";
		casierAlt = data.personne.casier ? data.personne.casier.alt : "";
		certificatPath = data.personne.certificat
			? data.personne.certificat.path
			: "";
		certificatAlt = data.personne.certificat
			? data.personne.certificat.alt
			: "";
		lieuDiplome = data.personne.lieuDiplome || "";
		persionneId = data.personne.id;
		// Récupérer la profession
		/*profession =  data.personne.professionLibelle || ""; await getProfessionLibelle(data.personne.profession);
    if (profession) {
      console.log("Profession récupérée:", profession);
    } else {
      console.error("Impossible de récupérer la profession");
    }*/

		console.log("uuu", persionneId);
	}
	let valid_endUser = {
		raison: "",
		status: status == "accepte" ? "validation" : "acceptation",
	};

	let openShow: boolean = false;
	let openShowDoc: boolean = false;
	let current_data: any = {};
	let pdfUrl: any;
	let showNotification = false;
	let notificationMessage = "";
	let notificationType = "info";

	/*   let openShow: boolean = false; */

	function handleModalClose(event: Event) {
		if (isLoad) {
			event.preventDefault();
		}
	}

	let isDialogOpen = false;

	let currentImage = "";

	function openDialog(imageUrl: string) {
		currentImage = imageUrl;
		isDialogOpen = true;
	}
	/* ddd */
	function closeDialog() {
		isDialogOpen = false;
	}
	async function SaveFunction() {
		console.log("Email", userEmail);
		console.log("Email", valid_endUser.status);
		console.log("Email", valid_endUser.raison);
		console.log("Email", data.personne);

		isLoad = true;
		try {
			const res = await apiFetch(
				true,
				"/professionnel/active/" + data.personne?.id,
				"PUT",
				{
					status: valid_endUser.status,
					raison: valid_endUser.raison,
					userUpdate: userUpdateId,
					email: userEmail,
				},
			);

			if (res.code == 200) {
				isLoad = false;
				open = false;
				notificationMessage = "Traitement effectué  avec succès!";
				notificationType = "success";
				showNotification = true;
				open = false;
				dispatch("changeStatus");
			}
		} catch (error) {
			console.error("Error saving:", error);
		}
	}
	async function SaveFunctionSingleMethode(etat: string) {
		console.log("EmailTTT", userEmail);
		console.log("Email", valid_endUser.status);
		console.log("Email", valid_endUser.raison);
		console.log("Email", userUpdateId);
		console.log("TTGDFDFDFD", etat);
		isLoad = true;
		try {
			const res = await fetch(
				BASE_URL_API + "/professionnel/active/" + data.personne?.id,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						status: etat,
						raison: "",
						userUpdate: userUpdateId,
						email: userEmail,
					}),
				},
			);

			if (res.ok) {
				isLoad = false;
				open = false;
				notificationMessage = "Traitement effectué  avec succès!";
				notificationType = "success";
				showNotification = true;
				dispatch("changeStatus");
			}
		} catch (error) {
			console.error("Error saving:", error);
		}
	}
	function formatDateForInput(dateString: string) {
		if (!dateString) return "";
		try {
			const date = new Date(dateString);
			return format(date, "yyyy-MM-dd"); // Formater en YYYY-MM-DD
		} catch (e) {
			console.error("Erreur de formatage de date:", e);
			return "";
		}
	}

	async function getProfessionLibelle(code: any) {
		console.log("Code profession:", code);
		try {
			const res = await fetch(
				BASE_URL_API + "/profession/get/by/code/" + code,
			);

			if (res.ok) {
				const data = await res.json();
				if (data && data.data) {
					console.log("Data récupérée:", data.data);
					return data.data;
				} else {
					console.error("Erreur: data.data est undefined", data);
					return null;
				}
			} else {
				console.error("Erreur HTTP:", res.status, res.statusText);
				return null;
			}
		} catch (error) {
			console.error("Erreur lors de la récupération des données:", error);
			return null;
		}
	}

	/*  onMount(async () => {
    await getProfessionLibelle(profession);
  }) */

	let isModalOpen = false;
	let isModalOpenRegister = false;

	function openModal(url: any) {
		pdfUrl = url; // ✅ Met à jour la variable réactive
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
	}
</script>

<div class="bg-white rounded-lg p-1 space-y-4">
	<!-- Card Body -->
	<div class="space-y-6">
		<form action="#" use:init>
			<div class="grid grid-cols-3 gap-6">
				<div>
					<InputSimple
						type="text"
						fieldName="nom"
						label="Nom"
						field={nom}
						disabled={true}
					/>
				</div>
				<div>
					<InputSimple
						type="text"
						fieldName="prenoms"
						label="Prénom(s)"
						field={prenoms}
						disabled={true}
					/>
				</div>
				<div>
					<InputSimple
						type="text"
						fieldName="dateNaissance"
						label="Date de naissance"
						field={dateNaissance}
						disabled={true}
					/>
				</div>
			</div>

			<div class="grid grid-cols-3 gap-6">
				<!-- <div>
                <InputSimple
      type="text"
                  fieldName="civilite"
                  label="Civilité"
                  field={civilite}
                  disabled={true}
                />
              </div> -->

				<div class="space-y-6">
					<InputSimple
						type="text"
						fieldName="lieuExercicePro"
						label="Lieu d’exercice professionnel"
						field={lieuExercicePro}
						disabled={true}
					/>
				</div>
				<div>
					<InputSimple
						type="text"
						fieldName="lieuResidence"
						label="Nationnalité"
						field={nationalite}
						disabled={true}
					/>
				</div>
				<div>
					<InputSimple
						type="text"
						fieldName="userEmail"
						label="Email utilisateur"
						field={userEmail}
						disabled={true}
					/>
				</div>
			</div>
			<div class="grid grid-cols-3 gap-6">
				<div>
					<InputSimple
						type="text"
						fieldName="userPhone"
						label="Téléphone utilisateur"
						field={numero}
						disabled={true}
					/>
				</div>
				<div>
					<InputSimple
						type="text"
						fieldName="typeUser"
						label="Type utilisateur"
						field={typeUser}
						disabled={true}
					/>
				</div>
				<div class="space-y-6">
					<InputSimple
						type="text"
						fieldName="profession"
						label="Spécialité"
						field={professionLibelle}
						disabled={true}
					/>
				</div>
			</div>

			<!-- Deuxième section : Informations professionnelles -->
			<div class="grid grid-cols-3 gap-6 mt-6">
				<div class="space-y-6">
					<InputSimple
						type="text"
						fieldName="datePremierDiplome"
						label="Date d'obtention premier emploi"
						field={datePremierDiplome}
						disabled={true}
					/>
				</div>
				<div class="space-y-6">
					<InputSimple
						type="text"
						fieldName="professionnel"
						label="Structure d’exercice professionnel"
						field={professionnel}
						disabled={true}
					/>
				</div>
				<div class="space-y-6">
					<InputSimple
						type="text"
						fieldName="situationPro"
						label="Situation professionnelle"
						field={situationPro}
						disabled={true}
					/>
				</div>
			</div>

			<div class="grid grid-cols-3 gap-6 mt-6 mb-6">
				<div class="space-y-6">
					<InputSimple
						type="text"
						fieldName="diplome"
						label="Diplôme"
						field={diplome}
						disabled={true}
					/>
				</div>
				<div class="space-y-6">
					<InputSimple
						type="text"
						fieldName="situation"
						label="Situation"
						field={situation}
						disabled={true}
					/>
				</div>
				<div class="space-y-6">
					<InputSimple
						type="text"
						fieldName="dateDiplome"
						label="Date du diplôme"
						field={dateDiplome}
						disabled={true}
					/>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-6">
				<!-- <div>
                <InputSimple
      type="text"
                  fieldName="poleSanitaire"
                  label="lot,ilot *"
                  field={poleSanitaire}
                  disabled={true}
                />
              </div> -->
			</div>
			<div class="grid grid-cols-4 gap-6 mt-6">
				<!-- <div class="space-y-6"> -->
				<button
					type="button"
					on:click={() => (
						console.log("CVpath", url_image + CVpath + "/" + CValt),
						(current_data = url_image + CVpath + "/" + CValt),
						(openShow = true)
					)}
					class="w-full h-9 flex justify-center bg-gray-700 hover:bg-gray-700 text-white font-bold py-2 pb-[1.9rem] px-4 border border-white rounded cursor-pointer"
					aria-label="Voir le CV"
				>
					VOIR LE CV
				</button>
				<button
					type="button"
					on:click={() => (
						(current_data =
							url_image + diplomeFilePath + "/" + diplomeFileAlt),
						(openShow = true)
					)}
					class="w-full h-9 flex justify-center bg-gray-700 hover:bg-gray-700 text-white font-bold py-2 pb-[1.9rem] px-4 border border-white rounded cursor-pointer"
					aria-label="Voir le diplôme"
				>
					VOIR LE DIPLOME
				</button>

				<button
					type="button"
					on:click={() => (
						(current_data =
							url_image + casierPath + "/" + casierAlt),
						(openShow = true)
					)}
					class="w-full h-9 flex justify-center bg-gray-700 hover:bg-gray-700 text-white font-bold py-2 pb-[1.9rem] px-4 border border-white rounded cursor-pointer"
					aria-label="Voir le casier"
				>
					VOIR LE CASIER
				</button>
				<!--  </div>
              <div class="space-y-6"> -->
				<button
					type="button"
					on:click={() => (
						(current_data =
							url_image + certificatPath + "/" + certificatAlt),
						(openShow = true)
					)}
					class="w-full h-9 flex justify-center bg-gray-700 hover:bg-gray-700 text-white font-bold py-2 pb-[1.9rem] px-4 border border-white rounded cursor-pointer"
					aria-label="Voir le certificat"
				>
					VOIR LE CERTIFICAT
				</button>
				<button
					type="button"
					on:click={() => (
						(current_data = url_image + Photopath + "/" + Photoalt),
						(openShow = true)
					)}
					class="w-full h-9 flex justify-center bg-gray-700 hover:bg-gray-700 text-white font-bold py-2 pb-[1.9rem] px-4 border border-white rounded cursor-pointer"
					aria-label="Voir la photo"
				>
					VOIR LA PHOTO
				</button>

				<button
					type="button"
					on:click={() => (
						(current_data = url_image + cniPath + "/" + cniAlt),
						(openShow = true)
					)}
					class="w-full h-9 flex justify-center bg-gray-700 hover:bg-gray-700 text-white font-bold py-2 pb-[1.9rem] px-4 border border-white rounded cursor-pointer"
					aria-label="Voir la CNI"
				>
					VOIR LA CNI
				</button>

				<div
					on:click={() => (
						(current_data = data),
						(isModalOpenRegister = true)
					)}
					style="background-color: green;"
					class="w-full h-9 flex justify-center bg-green hover:bg-green text-white font-bold py-2 pb-[1.9rem] px-4 border border-white rounded cursor-pointer"
				>
					FICHE D'INSCRIPTION
				</div>
				{#if data.personne.profession.montantRenouvellement != "" || data.personne.profession.montantNouvelleDemande != ""}
					<div
						on:click={() => (
							(current_data = data),
							(isModalOpen = true)
						)}
						style="background-color: green;"
						class="w-full h-9 flex justify-center bg-green hover:bg-green text-white font-bold py-2 pb-[1.9rem] px-4 border border-white rounded cursor-pointer"
						aria-label="Voir le reçu de paiement"
						role="button"
					>
						REÇU DE PAIEMENT
					</div>
				{/if}
			</div>

			<div class="grid grid-cols-2 gap-6 mt-6 mb-2">
				<div class="space-y-6">
					<div class="flex items-center justify-between space-x-2">
						<fieldset>
							<legend style="color: black;"
								>Appartenez-vous à une organisation?</legend
							>
							<div class="flex items-center">
								<div class="mr-2">
									<InputCheck
										isChecked={appartenirOrganisation ===
										"non"
											? true
											: false}
										label="Non"
										disabled={true}
									/>
								</div>
								<div>
									<InputCheck
										isChecked={appartenirOrganisation ===
										"oui"
											? true
											: false}
										label="Oui"
										disabled={true}
									/>
								</div>
							</div>
						</fieldset>
					</div>
				</div>
				{#if appartenirOrganisation === "oui"}
					<!-- <div class="grid grid-cols-1 gap-6 mt-6"> -->
					<!-- <div class="space-y-6">
                  <InputSimple
      type="text"
                    fieldName="organisation"
                    label="Nom de l'organisation"
                    field={organisationNom}
                    disabled={true}
                  />
                </div> -->
					<!-- </div> -->
				{/if}
			</div>

			<div class="grid grid-cols-2 gap-6 mt-6 mb-2">
				<div class="space-y-6">
					<div class="flex items-center justify-between space-x-2">
						<fieldset>
							<legend style="color: black;"
								>Appartenez-vous à un ordre ?</legend
							>
							<div class="flex items-center">
								<div class="mr-2">
									<InputCheck
										isChecked={appartenirOrdre === "non"
											? true
											: false}
										label="Non"
										disabled={true}
									/>
								</div>
								<div>
									<InputCheck
										isChecked={appartenirOrdre === "oui"
											? true
											: false}
										label="Oui"
										disabled={true}
									/>
								</div>
							</div>
						</fieldset>
					</div>
				</div>
				<!-- {#if appartenirOrdre === "oui"}
                <div class="grid grid-cols-1 gap-6 mt-6">
                <div class="space-y-6">
                  <InputSimple
      type="text"
                    fieldName="numeroInscription"
                    label="Numéro d'inscription"
                    field={numeroInscription}
                    disabled={true}
                  />
                </div>
                </div> 
              {/if} -->
			</div>

			<br />

			{#if status === "attente"}
				<fieldset class="border border-gray-300 rounded-md p-4">
					<legend class="text-lg font-semibold text-blue-500"
						>Décision</legend
					>
					<div class="space-y-4">
						<div class="flex items-center space-x-2">
							<input
								type="radio"
								id="conforme"
								name="profil"
								value="acceptation"
								bind:group={valid_endUser.status}
							/>
							<label
								for="conforme"
								class="text-black mt-2 text-3xl">Accepter</label
							>
						</div>
						<div class="flex items-center space-x-2">
							<input
								type="radio"
								id="unverified"
								name="profil"
								value="rejet"
								bind:group={valid_endUser.status}
							/>
							<label
								for="unverified"
								class="text-black text-3xl mt-2">Rejeter</label
							>
						</div>
						{#if valid_endUser.status === "rejet"}
							<textarea
								bind:value={valid_endUser.raison}
								placeholder="Observation"
								class="w-full border border-gray-300 rounded-md p-2"
							></textarea>
						{/if}
					</div>
				</fieldset>
			{/if}
			{#if status === "accepte"}
				<fieldset class="border border-gray-300 rounded-md p-4">
					<legend class="text-lg font-semibold text-blue-500"
						>Décision</legend
					>
					<div class="space-y-4">
						<div class="flex items-center space-x-2">
							<input
								type="radio"
								id="conforme"
								name="profil"
								value="validation"
								bind:group={valid_endUser.status}
							/>
							<label
								for="conforme"
								class="text-black mt-2 text-3xl">Valider</label
							>
						</div>
						<div class="flex items-center space-x-2">
							<input
								type="radio"
								id="unverified"
								name="profil"
								value="refuse"
								bind:group={valid_endUser.status}
							/>
							<label
								for="unverified"
								class="text-black text-3xl mt-2">Refuser</label
							>
						</div>
						{#if valid_endUser.status === "refuse"}
							<textarea
								bind:value={valid_endUser.raison}
								placeholder="Observation"
								class="w-full border border-gray-300 rounded-md p-2"
							></textarea>
						{/if}
					</div>
				</fieldset>
			{/if}

			{#if status === "refuse" || status === "rejete"}
				<fieldset class="border border-gray-300 rounded-md p-4">
					<legend class="text-lg font-semibold text-blue-500"
						>Traitement</legend
					>
					<div class="space-y-4">
						<div
							class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
							role="alert"
						>
							<strong class="font-bold">Oups erreur!</strong>
							<span class="block sm:inline">{reason}</span>
						</div>
					</div>
				</fieldset>
			{/if}
		</form>
	</div>
	<!--   <div  class="w-full"> -->
	<div class="flex justify-end pt-4 border-t border-gray-200">
		<button
			style="margin-right: 9px;"
			on:click={cancelDelete}
			disabled={isLoad}
			class="px-4 py-2 mr-[9px] text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
		>
			Annuler
		</button>
	</div>
</div>
<Modale bind:open={isModalOpen} size="2xl" title="Recu de paiement">
	<RecuPaiement bind:open={isModalOpen} data={current_data} />
</Modale>
<Modale bind:open={isModalOpenRegister} size="2xl" title="Fiche d'inscription">
	<FicheInscription bind:open={isModalOpenRegister} data={current_data} />
</Modale>

<Modale
	bind:open={openShow}
	size="2xl"
	title="Détails du dossier professionnel"
>
	<DocShow bind:open={openShow} data={current_data} />
</Modale>
