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

  let isLoad = false;

  export let userUpdateId: any;

  export let open: boolean = false;
  export let sizeModal: any = "lg";
  export let data: Record<string, string> = {};
  const dispatch = createEventDispatcher();
  let status: string = "";
  let professionLibelle: string = "";
  let raison: string = "";
  let dateSisite: string = "";
  let rapportExamen: string = "";
  const url_image = "https://prodmydepps.leadagro.net/uploads/";

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

  function init(form: HTMLFormElement) {
    console.log(`je suis la data `, data);
  }
  let valid_endUser = {
    raison: "",
    status: status == "accepte" ? "validation" : "",
  };

  onMount(() => {
    console.log("Data on mount:", data);
  });
  let errorMessage: string = "";
  let openShow: boolean = false;
  let openShowDoc: boolean = false;
  let showErrorMessage = false;
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

  async function SaveFunctionSingleMethode(etat: string) {
    isLoad = true;
    const formdata = new FormData();

    formdata.append("status", etat);
    formdata.append("email", data?.email);
    formdata.append("userUpdate", userUpdateId);
    formdata.append("raison", raison ? raison : "");
    formdata.append("dateVisite", dateSisite ? dateSisite : "");
    formdata.append("rapportExamen", rapportExamen ? rapportExamen : "");
    try {
      if (
        data.personne.status == "oep_dossier_imputer" ||
        data.personne.status ==
          "oep_visite_effectue_attente_validation_directrice"
      ) {
        if (!dateSisite || !raison) {
          showErrorMessage = true;
          errorMessage =
            "Veuillez remplir la date de la visite et le rapport de l'examen.";

          isLoad = false;
          return;
        }
      } else if (
        data.personne.status == "acp_dossier_attente_validation_directrice"
      ) {
        if (!raison) {
          showErrorMessage = true;
          errorMessage = "Veuillez remplir l'observation svp.";

          isLoad = false;
          return;
        }
      }
      const res = await fetch(
        `${BASE_URL_API}/etablissement/active/${data.personne?.id}`,
        {
          method: "POST",
          body: formdata,
        },
      );

      if (res.ok) {
        console.log("Save successful", res);
        isLoad = false;
        open = false;
        notificationMessage = "Traitement effectué  avec succès!";
        notificationType = "success";
        showNotification = true;
        dispatch("changeStatus");
      } else {
        const errorData = await res.json();

        showErrorMessage = true;
        // alert("Erreur lors du traitement: " + errorData.errors[0]);
        if (
          errorData.errors &&
          Array.isArray(errorData.errors) &&
          errorData.errors.length > 0
        ) {
          console.error("Error response:", errorData);
          errorMessage = "Merci de bien vouloir verifier les champs saisis";
        } else {
          console.error("Error secondaire:", errorData);

          isLoad = false;
          open = false;
        }
      }
    } catch (error) {
      showErrorMessage = true;
      errorMessage =
        "Erreur lors du traitement. Veuillez signaler l'erreur a un administrateur.";
      console.error("Error saving:", error);
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

  function validateState(status) {}
</script>

<div class="space-y-4 rounded-lg bg-white p-1">
  <!-- Card Body -->
  <div class="space-y-6">
    <form action="#" use:init>
      <label
        style="color: black; font-weight: bold; font-size: x-large; margin-bottom: 15px;"
        >Informations sur l'établissement</label
      >
      {#if data.rapportExamen}
        <div
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-5"
          role="alert"
        >
          <!-- <strong class="font-bold">OOUPS</strong> -->
          <span class="block sm:inline">{data.rapportExamen}</span>
          <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg
              class="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              ><title>Close</title><path
                d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
              /></svg
            >
          </span>
        </div>
      {/if}
      <!-- Première section : Informations personnelles -->
      <div class="grid grid-cols-3 gap-6">
        <div>
          <InputSimple
            type="text"
            fieldName="Email"
            label="Email"
            field={data.email}
            disabled={true}
          />
        </div>
        <div>
          <InputSimple
            type="text"
            fieldName="Entité Juridique"
            label="Entité Juridique"
            field={data.personne.typePersonne.libelle}
            disabled={true}
          />
        </div>
        <div>
          <InputSimple
            type="text"
            fieldName="Niveau d'Intervention"
            label="Niveau d'Intervention"
            field={data.personne.niveauIntervention.libelle}
            disabled={true}
          />
        </div>
        {#if data.personne.typePersonne.libelle == "PHYSIQUE"}
          <div>
            <InputSimple
              type="text"
              fieldName="Nom"
              label="Nom"
              field={data.personne.nom}
              disabled={true}
            />
          </div>
          <div>
            <InputSimple
              type="text"
              fieldName="Prenoms"
              label="Prénom(s)"
              field={data.personne.prenoms}
              disabled={true}
            />
          </div>
          <div>
            <InputSimple
              type="text"
              fieldName="Telephone"
              label="Téléphone"
              field={data.personne.telephone}
              disabled={true}
            />
          </div>
          <div>
            <InputSimple
              type="text"
              fieldName="Boite Postale"
              label="Boite Postale"
              field={data.personne.bp}
              disabled={true}
            />
          </div>
          <div>
            <InputSimple
              type="text"
              fieldName="Autre E-mail"
              label="Autre E-mail"
              field={data.personne.emailAutre}
              disabled={true}
            />
          </div>
        {/if}
        {#if data.personne.typePersonne.libelle == "MORALE"}
          <div>
            <InputSimple
              type="text"
              fieldName="Adresse"
              label="Adresse"
              field={data.personne.adresse}
              disabled={true}
            />
          </div>
          <div>
            <InputSimple
              type="text"
              fieldName="Nom du Representant"
              label="Nom du Representant"
              field={data.personne.nomRepresentant}
              disabled={true}
            />
          </div>
          <div>
            <InputSimple
              type="text"
              fieldName="Denomination"
              label="Denomination"
              field={data.personne.denomination}
              disabled={true}
            />
          </div>
        {/if}
      </div>
      <label
        style="color: black; font-weight: bold; margin-top: 15px;font-size: x-large;"
        >Documents</label
      >
      <div class="grid grid-cols-4 gap-6 mt-6">
        {#each data.personne.documents as doc}
          <div
            on:click={() => (
              (current_data = BASE_URL_API_UPLOAD + doc.path.url),
              (openShow = true)
            )}
            class="w-full h-9 flex justify-center bg-gray-700 hover:bg-gray-700 text-white font-bold py-2 pb-[1.9rem] p-4 border border-white rounded cursor-pointer"
          >
            VOIR {doc.libelle.toUpperCase()}
          </div>
        {/each}
      </div>
      {#if showErrorMessage}
        <div
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-5"
          role="alert"
        >
          <strong class="font-bold">OOUPS</strong>
          <span class="block sm:inline">{errorMessage}</span>
          <!-- <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg
              class="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              ><title>Fer</title><path
                d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
              /></svg
            >
          </span> -->
        </div>
      {/if}
      <label
        style="color: black; font-weight: bold; margin-top: 15px;font-size: x-large;"
        >Observation</label
      >
      <textarea
        bind:value={raison}
        placeholder="Observation"
        class="w-full border border-gray-300 rounded-md p-2 text-black"
      ></textarea>
      {#if data.personne.status == "oep_dossier_imputer" || data.personne.status == "oep_visite_effectue_attente_validation_directrice"}
        <label
          style="color: black; font-weight: bold; margin-top: 15px;font-size: x-large;"
          >Date de la visite</label
        >
        <input
          type="date"
          bind:value={dateSisite}
          class="w-full border border-gray-300 rounded-md p-2"
        />
        <label
          style="color: black; font-weight: bold; margin-top: 15px;font-size: x-large;"
          >Rapport de l'examen</label
        >
        <textarea
          bind:value={rapportExamen}
          placeholder="Rapport de l'examen"
          class="w-full border border-gray-300 rounded-md p-2 text-black"
        ></textarea>
        =
      {/if}
    </form>
  </div>
  <div class="w-full">
    <div class="w-full grid grid-cols-3">
      <div class="col-span-2">
        {#if data.personne.status == "acp_attente_dossier_depot_service_courrier"}
          <Button
            color="alternative"
            style="background-color: green !important; color: white;"
            onclick={() => SaveFunctionSingleMethode("soumission_validation")}
            type="submit"
            >Valider Depôt
          </Button>
        {:else if data.personne.status == "acp_dossier_attente_validation_directrice"}
          <Button
            color="alternative"
            style="background-color: green !important; color: white;"
            onclick={() => SaveFunctionSingleMethode("validation_directrice")}
            type="submit">Validation directeur/rice</Button
          >

          <Button
            color="alternative"
            style="background-color: red !important; color: white;"
            onclick={() => SaveFunctionSingleMethode("rejet_directrice")}
            type="submit">Rejet directeur/rice</Button
          >
        {:else if data.personne.status == "acp_dossier_valide_directrice"}
          <!-- <Button
            color="alternative"
            style="background-color: green !important; color: white;"
            on:click={() =>
              SaveFunctionSingleMethode("initiation_demande_exploitation")}
            type="submit">Initier OEP</Button
          > -->
        {:else if data.personne.status == "oep_demande_initie"}
          <Button
            color="alternative"
            style="background-color: green !important; color: white;"
            onclick={() => SaveFunctionSingleMethode("imputation_dossier")}
            type="submit">Initier OEP</Button
          >
        {:else if data.personne.status == "oep_dossier_imputer"}
          <Button
            color="alternative"
            style="background-color: green !important; color: white;"
            onclick={() => SaveFunctionSingleMethode("imputation_non_conforme")}
            type="submit">Imputation Non Conforme</Button
          >
        {:else if data.personne.status == "oep_dossier_imputer_conforme_attente_planification_visite"}
          <Button
            color="alternative"
            style="background-color: green !important; color: white;"
            onclick={() => SaveFunctionSingleMethode("programmation_visite")}
            type="submit">Programmation Visite</Button
          >
        {:else if data.personne.status == "oep_dossier_visite_programme"}
          <Button
            color="alternative"
            style="background-color: green !important; color: white;"
            onclick={() => SaveFunctionSingleMethode("visite_effectuee")}
            type="submit">Visite Effectuée</Button
          >
        {:else if data.personne.status == "oep_visite_effectue_attente_validation_directrice"}
          <Button
            color="alternative"
            style="background-color: green !important; color: white;"
            onclick={() => SaveFunctionSingleMethode("validation_finale")}
            type="submit">Validation Finale</Button
          >
          <Button
            color="alternative"
            style="background-color: green !important; color: white;"
            onclick={() => SaveFunctionSingleMethode("rejet_final")}
            type="submit">Rejet complet</Button
          >
        {/if}
      </div>

      <div class="flex justify-end item-end">
        <Button
          color="alternative"
          style="background-color: gray !important; color: white;"
          onclick={() => (open = false)}
          type="submit"
          >{"Fermer"}
        </Button>
      </div>
    </div>
  </div>
</div>

{#if isModalOpen == true}
  <RecuPaiement
    bind:open={isModalOpen}
    data={current_data}
    sizeModal="xl"
    {userUpdateId}
  />
{/if}

{#if isModalOpenRegister == true}
  <FicheInscription
    bind:open={isModalOpenRegister}
    data={current_data}
    sizeModal="xl"
    {userUpdateId}
  />
{/if}

<DocShow bind:open={openShow} data={current_data} sizeModal="xl" />
