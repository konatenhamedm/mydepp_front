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

    let receiptData = {
        logo: "https://mydepps.pages.dev/_files/logo-depps.png", // URL du logo
        title: "Reçu de Paiement - Renouvellement",
        date: "04 novembre 2024 à 16:39:59",
        name: "Kra Rita",
        paymentMethod: "OMCIV2",
        residence: "XX",
        phone: "0564924282",
        receiptNumber: "1730738267",
        profession: "profession",
        amount: "10000 XOF",
        footerText: "Ce document ne tient pas lieu d’autorisation d’exercice",
    };

    function generatePDF() {
        const doc = new jsPDF();

        // Centrer le logo
        const imgWidth = 30;
        const imgHeight = 30;
        const pageWidth = 210;
        const logoX = (pageWidth - imgWidth) / 2; // Position X centrée
        doc.addImage(receiptData.logo, "PNG", logoX, 10, imgWidth, imgHeight);

        // Ajouter le titre centré sous le logo
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(receiptData.title, 105, 50, { align: "center" });

        // Ajouter les informations du reçu
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");

        const startX = 10;
        const startY = 60;
        const lineHeight = 10;

        const fields = [
            { label: "Date d'édition:", value: receiptData.date },
            { label: "Nom complet:", value: receiptData.name },
            { label: "Mode de paiement:", value: receiptData.paymentMethod },
            /*  { label: "Lieu de résidence:", value: receiptData.residence }, */
            { label: "Numéro de téléphone:", value: receiptData.phone },
            {
                label: "Réference paiement:",
                value: `N° ${receiptData.receiptNumber}`,
            },
            { label: "Paiement:", value: `${receiptData.amount}` },
            { label: "Profession:", value: `${receiptData.profession}` },
        ];

        let yPos = startY;
        fields.forEach(({ label, value }) => {
            doc.text(label, startX, yPos);
            doc.setFont("helvetica", "normal");
            doc.text(value, startX + 50, yPos);
            doc.setFont("helvetica", "bold");
            doc.line(startX, yPos + 2, 200, yPos + 2); // Ligne de séparation
            yPos += lineHeight;
        });

        // Ajouter le texte en bas du reçu
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text(receiptData.footerText, 105, yPos + 10, { align: "center" });

        // Convertir en URL pour affichage
        const pdfBlob = doc.output("blob");
        pdfUrlAffiche = URL.createObjectURL(pdfBlob);
    }

    let isLoading = false;

    async function getTransactionInfos() {
        isLoading = true;
        try {
            if (data.id) {
                await apiFetch(
                    true,
                    "/paiement/info/transaction/last/transaction/formatter/" +
                        data.id,
                ).then((response) => {
                    console.log(response);
                    if (response.code === 200) {
                        receiptData.title =
                            "Reçu de Paiement - " + response.data.type;
                        receiptData.amount = response.data.montant;
                        receiptData.paymentMethod = response.data.channel;
                        receiptData.profession =
                            response.data.user.personne?.profession?.libelle;
                        receiptData.receiptNumber = response.data.reference;
                        receiptData.name =
                            response.data.user.typeUser == "PROFESSIONNEL"
                                ? response.data.user.personne.nom +
                                  " " +
                                  response.data.user.personne.prenoms
                                : response.data.user.personne.nomEntreprise;
                        receiptData.phone =
                            response.data.user.typeUser == "PROFESSIONNEL"
                                ? response.data.user.personne.number
                                : response.data.user.personne.contactEntreprise;
                        receiptData.date = formatDate(response.data.createdAt);
                    }
                });
            }
        } catch (error) {
            console.error(
                "Erreur lors de la récupération des infos de transaction",
                error,
            );
        } finally {
            isLoading = false;
        }
    }

    $: if (open == true && !isLoading) {
        generatePDF();
    }

    onMount(async () => {
        getTransactionInfos();
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
