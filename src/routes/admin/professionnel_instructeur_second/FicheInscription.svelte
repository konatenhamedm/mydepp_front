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
    import { format } from "date-fns";

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

    export let data: Record<string, string> = {};

    function init(form: HTMLFormElement) {}
    let isLoading = false;
    let pdfUrl = "";
    const url_image = "https://depps.leadagro.net/uploads/";

    // Formatage des données
    let formattedData = {
        numero: data.personne.number || "",
        code: data.personne.code || "",
        nom: data.personne.nom || "",
        status: data.personne.status || "",
        professionLibelle: data.personne.profession.libelle || "",
        prenoms: data.personne.prenoms || "",
        reason: data.personne.reason || "",
        professionnel: data.personne.professionnel || "",
        civilite: data.personne.civilite || "",
        nationalite: data.personne.nationate || "",
        region: data.personne.region || "",
        district: data.personne.district || "",
        ville: data.personne.ville || "",
        commune: data.personne.commune || "",
        quartier: data.personne.quartier || "",
        dateNaissance: data.personne.dateNaissance || "",
        dateDiplome: data.personne.dateDiplome || "",
        diplome: data.personne.diplome || "",
        poleSanitaire: data.personne.poleSanitaire || "",
        organisationNom: data.personne.organisationNom || "",
        poleSanitairePro: data.personne.poleSanitairePro || "",
        lieuExercicePro: data.personne.lieuExercicePro || "",
        datePremierDiplome: data.personne.datePremierDiplome || "",
        situationPro: data.personne.situationPro || "",
        situation: data.personne.situation || "",
        typeUser: data?.typeUser || "",
        userEmail: data.personne.email || "",
        appartenirOrganisation: data.personne.appartenirOrganisation || "",
        photo: data.personne.photo || "",
        cni: data.personne.cni || "",
        CVpath: data.personne.cv.path || "",
        CValt: data.personne.cv.alt || "",
        Photopath: data.personne.photo.path || "",
        Photoalt: data.personne.photo.alt || "",
        diplomeFilePath: data.personne.diplomeFile.path || "",
        diplomeFileAlt: data.personne.diplomeFile.alt || "",
        cniPath: data.personne.cni.path || "",
        cniAlt: data.personne.cni.alt || "",
        casierPath: data.personne.casier.path || "",
        casierAlt: data.personne.casier.alt || "",
        certificatPath: data.personne.certificat.path || "",
        certificatAlt: data.personne.certificat.alt || "",
        lieuDiplome: data.personne.lieuDiplome || "",
        persionneId: data.personne.id,
        /*  appartenirOrganisation: data?.personne?.appartenirOrganisation === "oui" ? "Oui" : "Non", */
    };

    function generatePDF() {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 15;
        const lineHeight = 7;
        let yPos = margin;
        let yPos2 = margin;

        // Logo centré en haut
        const logoWidth = 30;
        const logoHeight = 30;
        const logoX = (pageWidth - logoWidth) / 2;
        doc.addImage(
            "https://mydepps.pages.dev/_files/logo-depps.png",
            "PNG",
            logoX,
            yPos,
            logoWidth,
            logoHeight,
        );
        yPos += logoHeight + 10;

        // Titre principal sous le logo
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("FICHE D'INSCRIPTION", pageWidth / 2, yPos, {
            align: "center",
        });
        yPos += 10;

        // Sous-titre
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(
            "Ministère de la Santé et de l'Hygiène Publique",
            pageWidth / 2,
            yPos,
            { align: "center" },
        );
        doc.text(
            "Direction des Etudes, des Effectifs et de la Planification des Professionnels de Santé",
            pageWidth / 2,
            yPos + 5,
            { align: "center" },
        );

        // Ligne de séparation
        yPos += 15;
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        /*    yPos += 10;
        const validFormats = ['JPEG', 'JPG', 'PNG', 'WEBP'];
        const imageUrl = `${BASE_URL_API_UPLOAD + formattedData.photo.path + '/' + formattedData.photo.alt }`;
        const extension = (imageUrl?.split('.').pop() ?? '').toUpperCase();
        const logoWidth2 = 30;
        const logoHeight2 = 30;
        const logoX2 = (pageWidth - logoWidth) / 15;
        const imageFormat = validFormats.includes(extension) ? extension : 'PNG';

// Ajouter l'image
doc.addImage(imageUrl, imageFormat, logoX2, yPos, logoWidth2, logoHeight2);
        */
        yPos += logoHeight + 10;

        // Section Informations Personnelles
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(59, 130, 246);
        doc.text("INFORMATIONS PERSONNELLES", margin, yPos);
        yPos += 10;

        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);

        // Colonnes pour les informations
        const col1 = margin;
        const col2 = pageWidth / 2;

        // Première colonne
        doc.text(
            `Nom et Prénoms: ${formattedData.nom} ${formattedData.prenoms}`,
            col1,
            yPos,
        );
        doc.text(
            `Nationalité: ${formattedData.nationalite.libelle}`,
            col1,
            yPos + lineHeight,
        );
        doc.text(
            `Email: ${formattedData.userEmail}`,
            col1,
            yPos + lineHeight * 2,
        );
        // doc.text(`Contact: ${formattedData.numero}`,  col1, yPos + lineHeight);
        /* doc.text(`Nom: ${formattedData.nom}`, col1, yPos + lineHeight);
        doc.text(`Civilité: ${formattedData.civilite.libelle}`, col1, yPos + (lineHeight * 3));
        doc.text(`Prénoms: ${formattedData.prenoms}`, col1, yPos + (lineHeight * 2)); */

        // Deuxième colonne
        doc.text(
            `Date de naissance: ${formattedData.dateNaissance}`,
            col2,
            yPos,
        );
        doc.text(`Contact: ${formattedData.numero}`, col2, yPos + lineHeight);
        // doc.text(`Email: ${formattedData.userEmail}`, col2, yPos + (lineHeight * 2));
        doc.text(
            `Situation matrimoniale: ${formattedData.situation}`,
            col2,
            yPos + lineHeight * 2,
        );
        // doc.text(`Situation matrimoniale: ${formattedData.situation}`, col2, yPos + (lineHeight * 3));

        yPos += lineHeight * 4 + 10;

        // Section Informations Professionnelles
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(59, 130, 246);
        doc.text("INFORMATIONS PROFESSIONNELLES", margin, yPos);
        yPos += 10;

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);

        // Première colonne
        doc.text(`Profession: ${formattedData.professionLibelle}`, col1, yPos);
        doc.text(
            `Date du diplôme: ${formattedData.dateDiplome}`,
            col1,
            yPos + lineHeight,
        );
        doc.text(
            `Diplôme: ${formattedData.diplome}`,
            col1,
            yPos + lineHeight * 2,
        );
        doc.text(
            `Region sanitaire: ${formattedData.region.libelle}`,
            col1,
            yPos + lineHeight * 3,
        );
        doc.text(
            `Ville: ${formattedData.ville.libelle}`,
            col1,
            yPos + lineHeight * 4,
        );
        doc.text(
            `Ilot,lot: ${formattedData.poleSanitaire}`,
            col1,
            yPos + lineHeight * 5,
        );
        doc.text(
            `Situation professionnelle: ${formattedData.situationPro.libelle}`,
            col1,
            yPos + lineHeight * 6,
        );
        doc.text(
            `Code membre: ${formattedData.code}`,
            col1,
            yPos + lineHeight * 7,
        );

        // Deuxième colonne
        doc.text(`Lieu d'obtention: ${formattedData.lieuDiplome}`, col2, yPos);
        doc.text(
            `Date d'obtention premier emploi: ${formattedData.datePremierDiplome}`,
            col2,
            yPos + lineHeight,
        );
        doc.text(
            `Lieu d'exercice: ${formattedData.lieuExercicePro}`,
            col2,
            yPos + lineHeight * 2,
        );
        doc.text(
            `District sanitaire: ${formattedData.district.libelle}`,
            col2,
            yPos + lineHeight * 3,
        );
        doc.text(
            `Commune: ${formattedData.commune.libelle}`,
            col2,
            yPos + lineHeight * 4,
        );
        doc.text(
            `Quartier: ${formattedData.quartier}`,
            col2,
            yPos + lineHeight * 5,
        );
        doc.text(
            `Structure d'exercice professionnel: ${formattedData.professionnel}`,
            col2,
            yPos + lineHeight * 6,
        );

        yPos += lineHeight * 4 + 35;

        // Section Informations Professionnelles
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(59, 130, 246);
        doc.text("INFORMATIONS ORGANISATION", margin, yPos);
        yPos += 8;

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        yPos += lineHeight * 1;
        doc.text(
            `Appartient à une organisation: ${formattedData.appartenirOrganisation}`,
            col1,
            yPos,
        );

        if (formattedData.appartenirOrganisation === "oui") {
            doc.text(
                `Nom de l'organisation: ${formattedData.organisationNom}`,
                col1,
                yPos + lineHeight,
            );
            yPos += lineHeight;
        }

        yPos += 15;

        // Pied de page
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(
            `Fiche générée le ${format(new Date(), "dd/MM/yyyy à HH:mm:ss")}`,
            pageWidth / 2,
            280,
            { align: "center" },
        );
        doc.text(
            "DEPS - Ministère de la Santé et de l'Hygiène Publique",
            pageWidth / 2,
            285,
            { align: "center" },
        );

        // Convertir en URL pour affichage
        const pdfBlob = doc.output("blob");
        pdfUrl = URL.createObjectURL(pdfBlob);
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
                    <div class="flex justify-center items-center h-64">
                        <div
                            class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
                        ></div>
                    </div>
                {:else if pdfUrl}
                    <iframe
                        src={pdfUrl}
                        title="Fiche d'inscription"
                        width="100%"
                        height="600px"
                        class="border rounded-lg shadow-sm"
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
