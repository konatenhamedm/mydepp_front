<script lang="ts">
	import Imputation from './Imputation.svelte';
  import Spinner from "$components/_skeletons/Spinner.svelte";
  import InputSimple from "$components/inputs/InputSimple.svelte";
  import { BASE_URL_API } from "$lib/api";
  import { Button, Input, Label, Modal, Textarea } from "flowbite-svelte";
  import InputTextArea from "$components/inputs/InputTextArea.svelte";
  import InputSelect from "$components/inputs/InputSelect.svelte";
  import { onMount } from "svelte";
  import InputMultiSelectUser from '$components/inputs/InputMultiSelectUser.svelte';
  import InputSelect2 from '$components/inputs/InputSelect2.svelte';
  

  export let open: boolean = false; // modal control
  let isLoad = false;
  let imputation: any = "";
  let imputations: any = [];

  export let sizeModal: any = "lg";
  export let userUpdateId: any;

  export let data: Record<string, string> = {};

  // Initialize form data with the provided record
  function init(form: HTMLFormElement) {
    imputation = data?.personne?.imputation;
   
  }

  async function SaveFunction() {
    isLoad = true;

    try {
      const res = await fetch(BASE_URL_API + "/professionnel/update/imputation/" + data?.personne?.id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          imputation: imputation,
          userUpdate: userUpdateId
        })
      });

      if (res.ok) {
        isLoad = false;
        open = false; // Close the modal
      }
    } catch (error) {
      console.error("Error saving:", error);
    }
  }

  function handleModalClose(event: Event) {
    if (isLoad) {
      event.preventDefault();
    }
  }


  async function getData() {
    try {
      const res = await fetch(BASE_URL_API + "/user/liste/instructeur");
      const data = await res.json();
      imputations = data.data;

      console.log("Imputations fetched:", imputations);
    } catch (error) {
      console.error("Error fetching villes:", error);
    }
  }

  onMount(async () => {
   await getData();
  });
</script>


    <form action="#" use:init>
      <div class="grid grid-cols-1">
        <div class="grid grid-cols-1">
          <InputSelect2
          label="instructeur"
          bind:selectedId={imputation}
          datas={imputations}
          id="imputation"
        
        ></InputSelect2>
        </div>
      </div>
    </form>
 

  <!-- Modal footer -->
  <div  class="w-full">
    <div class="flex justify-end">
      {#if isLoad}
        <Button
          disabled={true}
          color="blue"
          style="background-color: #55a1ff;"
          type="submit"
        >
          <div class="flex flex-row gap-2">
            <div
              class="w-3 h-3 rounded-full bg-white animate-bounce [animation-delay:.7s]"
            ></div>
            <div
              class="w-3 h-3 rounded-full bg-white animate-bounce [animation-delay:.3s]"
            ></div>
            <div
              class="w-3 h-3 rounded-full bg-white animate-bounce [animation-delay:.7s]"
            ></div>
          </div>
        </Button>
      {:else}
        <button
          type="button"
          style="background-color: #55a1ff;"
          class="bg-[#55a1ff] text-white px-4 py-2 rounded-md shadow-sm hover:bg-[#008020]"
          on:click={SaveFunction}
        >
          Modifier
        </button>
      {/if}
    </div>
  </div>

