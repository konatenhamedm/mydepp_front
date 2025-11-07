<script lang="ts">
  import { BASE_URL_API } from "$lib/api";
  import { Button, CloseButton, Heading, Modal } from "flowbite-svelte";
  import { ExclamationCircleOutline } from "flowbite-svelte-icons";
  export let open: boolean = false; // modal control
  let isLoad = false;
  export let data: Record<string, string> = {};

  async function SaveFunction() {
    isLoad = true;

    try {
      // Example POST request (replace with your actual API call)
      const res = await fetch(BASE_URL_API + `/civilite/delete/` + data?.id, {
        method: "DELETE"
        /*  headers: {
                    'Content-Type': 'application/json'
                }, */
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
      event.preventDefault(); // Prevent modal from closing if loading
    }
  }
</script>

<Modal bind:open on:close={handleModalClose} size="sm">
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
    integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
    crossorigin="anonymous"
  />
  <ExclamationCircleOutline class="mx-auto mb-4 mt-8 h-10 w-10 text-red-600" />

  <h3 class="mb-6 text-center text-lg text-gray-500 dark:text-gray-400">
    Êtes vous sûr de vouloir supprimer cette donnée?
  </h3>

  <div class="flex items-center justify-center">
    <!-- <div class="flex justify-end"> -->
    {#if isLoad}
      <Button
        disabled={true}
        color="blue"
        style="background-color: blue;"
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
      <!-- <button 
             type="button" 
             class="bg-[#55a1ff] text-white px-4 py-2 rounded-md shadow-sm hover:bg-[#008020]" 
             on:click={SaveFunction}
           >
           Enregistrer
           </button> -->
      <Button
        type="submit"
        color="red"
        style="background-color: red;"
        on:click={SaveFunction}
        class="mr-2">Supprimer</Button
      >
    {/if}
    <!--  </div> -->
    <Button
      color="dark"
      style="background-color: black;"
      on:click={() => (open = false)}>Annuler</Button
    >
  </div>
</Modal>
