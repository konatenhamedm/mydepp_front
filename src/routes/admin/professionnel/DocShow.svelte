<script lang="ts">
  import InputSimple from "$components/inputs/InputSimple.svelte";
  import { BASE_URL_API_UPLOAD } from "$lib/api";
  import { Button, Input, Label, Modal, Textarea } from "flowbite-svelte";
  export let open: boolean = false;
  export let sizeModal: any = "lg";
  export let data: Record<string, string> = {};
  let code = "";
  let libelle = "";
  let pdfUrl: any = "";

  function init(form: HTMLFormElement) {
    pdfUrl = data || "";

    console.log(pdfUrl);
  }
  //let pdfUrl = ;
</script>

<div
  class="m-4 modale_general"
>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
    integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
    crossorigin="anonymous"
  />
  <div class="space-y-6 p-0">
    <form action="#" use:init>
      {#if pdfUrl != null }
   {#if pdfUrl.includes(".pdf")}
        <div class="pdf-viewer">
          <!-- Afficher le PDF avec un iframe -->
          <iframe
            src={pdfUrl}
            width="100%"
            height="700px"
            type="application/pdf"
          >
            Ce navigateur ne prend pas en charge l'affichage de PDF.
          </iframe>
        </div>
      {:else}
        <div class="flex items-center justify-center min-h-[50rem]">
          <img src={pdfUrl} alt="Image" class="max-w-full max-h-[50rem]" />
        </div>
      {/if}
    <!--   {:else} -->
      {/if}
   
    </form>
  </div>

  <!-- Modal footer -->
  <div  class="w-full">
    <div class="w-full grid grid-cols-3">
      <div class="col-span-2"></div>
      <div class="flex justify-end">
        <Button
          color="alternative"
          style="background-color: gray !important; color: white;"
          onclick={() => (open = false)}
          type="submit">{"Fermer"}</Button
        >
      </div>
    </div>
  </div>
</div>

<style>
  .pdf-viewer {
    margin-top: 20px;
  }
</style>
