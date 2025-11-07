<script lang="ts">
  import Spinner from "$components/_skeletons/Spinner.svelte";
  import InputSimple from "$components/inputs/InputSimple.svelte";
  import { apiFetch, BASE_URL_API } from "$lib/api";
  import { Button, Input, Label, Modal, Textarea } from "flowbite-svelte";
  import InputTextArea from "$components/inputs/InputTextArea.svelte";
  import { formatDate } from '$lib/dateUtils';
  import jsPDF from 'jspdf';
  import { onMount } from "svelte";

  export let open: boolean = false;
  export let sizeModal: any = "lg";
  export let userUpdateId: any;
  export let data: Record<string, string> = {};

  export let titre :any;
  let isLoad = false;
  let pdfUrlAffiche = "";
  let isLoading = false;

  function init(form: HTMLFormElement) {
   
  }

  let receiptData = {
    logo: 'https://mydepps.pages.dev/_files/logo-depps.png',
    title: '',
    date: '',
    name: '',
    paymentMethod: '',
    residence: '',
    phone: '',
    receiptNumber: '',
    amount: '',
    footerText: 'Ce document ne tient pas lieu d’autorisation d’exercice',
    profession: '',
  };

  // Mise à jour réactive du titre dès que `titre` change
  $: receiptData.title = 'Reçu de Paiement - ' + titre;

  function generatePDF() {
    const doc = new jsPDF();

    // Centrer le logo
    const imgWidth = 30;
    const imgHeight = 30;
    const pageWidth = 210;
    const logoX = (pageWidth - imgWidth) / 2;
    doc.addImage(receiptData.logo, 'PNG', logoX, 10, imgWidth, imgHeight);

    // Ajouter le titre
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(receiptData.title, 105, 50, { align: 'center' });

    // Infos
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');

    const startX = 10;
    const startY = 60;
    const lineHeight = 10;

    const fields = [
      { label: "Date d'édition:", value: formatDate(data.createdAt) },
      {
        label: "Nom complet:",
        value: data.typeUser == "PROFESSIONNEL"
          ? `${data.user?.nom} ${data.user?.prenoms}`
          : data.user?.nomEntreprise
      },
      { label: "Mode de paiement:", value: data.channel },
      {
        label: "Numéro de téléphone:",
        value: data.typeUser == "PROFESSIONNEL"
          ? data.user?.number
          : data.user?.contactEntreprise
      },
      { label: "Réference paiement:", value: `N° ${data.reference}` },
      { label: "Paiement:", value: `${data.montant}` },
      { label: "Profession:", value: `${data.user?.profession?.libelle}` }
    ];

    let yPos = startY;
    fields.forEach(({ label, value }) => {
      doc.text(label, startX, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(value ?? '', startX + 50, yPos);
      doc.setFont('helvetica', 'bold');
      doc.line(startX, yPos + 2, 200, yPos + 2);
      yPos += lineHeight;
    });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(receiptData.footerText, 105, yPos + 10, { align: 'center' });

    const pdfBlob = doc.output('blob');
    pdfUrlAffiche = URL.createObjectURL(pdfBlob);
  }

  $: if (open &&   !isLoading) {

  generatePDF();
}

  function handleModalClose(event: Event) {
    if (isLoad) {
      event.preventDefault();
    }
  }
</script>

<Modal
  bind:open
  title="Reçu de Paiement"
  size={sizeModal}
  class="m-4 modale_general"
  on:close={handleModalClose}
>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
    integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
    crossorigin="anonymous"
  />

  <div class="space-y-6 p-0">
    <form action="#" use:init>
      <div class="pdf-viewer">
        {#if isLoading}
          <p>Chargement en cours...</p>
        {:else if pdfUrlAffiche}
          <iframe src={pdfUrlAffiche} title="Aperçu du PDF" width="100%" height="700px" type="application/pdf"></iframe>
        {/if}
      </div>
    </form>
  </div>

  <div slot="footer" class="w-full">
    <div class="flex justify-end">
      <Button
        color="alternative"
        style="background-color: gray !important; color: white;"
        on:click={() => (open = false)}
        type="submit"
      >
        Fermer
      </Button>
    </div>
  </div>
</Modal>
