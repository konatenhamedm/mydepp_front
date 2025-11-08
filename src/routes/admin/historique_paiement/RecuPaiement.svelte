<script lang="ts">
    import InputSimple from "$components/inputs/InputSimple.svelte";
    import { apiFetch, BASE_URL_API } from "$lib/api";
    import { Button, Modal, Select } from "flowbite-svelte";
    import Notification from "$components/_includes/Notification.svelte";
    import InputSelect from "$components/inputs/InputSelect.svelte";
    import { onMount } from "svelte";
    import Spinner from "$components/_skeletons/Spinner.svelte";
    import InputTextArea from "$components/inputs/InputTextArea.svelte";
    import { formatDate } from "$lib/dateUtils";
    import jsPDF from "jspdf";

    function cancelDelete() {
        open = false;
    }
    let pdfUrlAffiche = "";
    export let open: boolean = false; // modal control
    let isLoad = false;

    let showNotification = false;
    let notificationMessage = "";
    let notificationType = "info";

    // Initializing the user object with only email and status
    let item: any = {
        libelle: "",
    };

    export let data: Record<string, string> = {};

    function init(form: HTMLFormElement) {}

  let isLoading = false;



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
  $: receiptData.title = 'Reçu de Paiement - ' + data.type;

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
    doc.text(receiptData.title, 105, 50, {align: 'center'});

    // Infos
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');

    const startX = 10;
    const startY = 60;
    const lineHeight = 10;

    const fields = [
      {label: "Date d'édition:", value: formatDate(data.createdAt)},
      {
        label: 'Nom complet:',
        value:
          data.typeUser == 'PROFESSIONNEL'
            ? `${data.user?.nom} ${data.user?.prenoms}`
            : data.user?.nomEntreprise,
      },
      {label: 'Mode de paiement:', value: data.channel},
      {
        label: 'Numéro de téléphone:',
        value:
          data.typeUser == 'PROFESSIONNEL'
            ? data.user?.number
            : data.user?.contactEntreprise,
      },
      {label: 'Réference paiement:', value: `N° ${data.reference}`},
      {label: 'Paiement:', value: `${data.montant}`},
      {label: 'Profession:', value: `${data.user?.profession?.libelle}`},
    ];

    let yPos = startY;
    fields.forEach(({label, value}) => {
      doc.text(label, startX, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(value ?? '', startX + 50, yPos);
      doc.setFont('helvetica', 'bold');
      doc.line(startX, yPos + 2, 200, yPos + 2);
      yPos += lineHeight;
    });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(receiptData.footerText, 105, yPos + 10, {align: 'center'});

    const pdfBlob = doc.output('blob');
    pdfUrlAffiche = URL.createObjectURL(pdfBlob);
  }

    $: if (open == true && !isLoading) {
        generatePDF();
    }

    onMount(async () => {
       // getTransactionInfos();
    });

    function handleModalClose(event: Event) {
        if (isLoad) {
            event.preventDefault();
        }
    }
</script>

<!-- Modal Content Wrapper -->
<div class="bg-white rounded-lg p-1 space-y-4">
    <!-- Card Body -->
    <div class="space-y-6">
        <form action="#" use:init>
            <div class="pdf-viewer">
                {#if isLoading}
                    <p>Chargement en cours...</p>
                {:else if pdfUrlAffiche}
                    <iframe
                        src={pdfUrlAffiche}
                        title="Aperçu du PDF"
                        width="100%"
                        height="700px"
                        type="application/pdf"
                    ></iframe>
                {/if}
            </div>
        </form>
    </div>

    <!-- Card Footer -->
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

<!-- Notification Component -->
{#if showNotification}
    <Notification
        message={notificationMessage}
        type={notificationType}
        duration={5000}
    />
{/if}
