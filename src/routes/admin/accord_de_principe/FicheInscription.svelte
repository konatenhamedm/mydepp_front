<script lang="ts">
    import { BASE_URL_API, BASE_URL_API_UPLOAD } from "$lib/api";
    import { Button, Modal } from "flowbite-svelte";
    import { format } from "date-fns";
    import jsPDF from 'jspdf';
    import { onMount } from "svelte";

    export let open: boolean = false;
    export let sizeModal: any = "xl";
    export const userUpdateId: any = null;
    export let data: any;

    let isLoading = false;
    let pdfUrl = "";
    const url_image = "https://depps.leadagro.net/uploads/";

    // Formatage des données
    let formattedData = {
        numero : data.personne.number || "",
        code : data.personne.code || "",
    nom : data.personne.nom || "",
    status : data.personne.status || "",
    professionLibelle : data.personne.profession.libelle || "",
    prenoms : data.personne.prenoms || "",
    reason : data.personne.reason || "",
    professionnel : data.personne.professionnel || "",
    civilite : data.personne.civilite || "",
    nationalite : data.personne.nationate || "",
    region : data.personne.region || "",
    district : data.personne.district || "",
    ville : data.personne.ville || "",
    commune : data.personne.commune || "",
    quartier : data.personne.quartier || "",
    dateNaissance : data.personne.dateNaissance || "",
    dateDiplome : data.personne.dateDiplome || "",
    diplome : data.personne.diplome || "",
    poleSanitaire : data.personne.poleSanitaire || "",
    organisationNom : data.personne.organisationNom || "",
    poleSanitairePro : data.personne.poleSanitairePro || "",
    lieuExercicePro : data.personne.lieuExercicePro || "",
    datePremierDiplome : data.personne.datePremierDiplome || "",
    situationPro : data.personne.situationPro || "",
    situation : data.personne.situation || "",
    typeUser : data?.typeUser || "",
    userEmail : data.personne.email || "",
    appartenirOrganisation : data.personne.appartenirOrganisation || "",
    photo : data.personne.photo || "",
    cni : data.personne.cni || "",
    CVpath : data.personne.cv.path || "",
    CValt : data.personne.cv.alt || "",
    Photopath : data.personne.photo.path || "",
    Photoalt : data.personne.photo.alt || "",
    diplomeFilePath : data.personne.diplomeFile.path || "",
    diplomeFileAlt : data.personne.diplomeFile.alt || "",
    cniPath : data.personne.cni.path || "",
    cniAlt : data.personne.cni.alt || "",
    casierPath : data.personne.casier.path || "",
    casierAlt : data.personne.casier.alt || "",
    certificatPath : data.personne.certificat.path || "",
    certificatAlt : data.personne.certificat.alt || "",
    lieuDiplome : data.personne.lieuDiplome || "",
    persionneId : data.personne.id,
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
        doc.addImage('https://mydepps.pages.dev/_files/logo-depps.png', 'PNG', logoX, yPos, logoWidth, logoHeight);
        yPos += logoHeight + 10;

        // Titre principal sous le logo
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('FICHE D\'INSCRIPTION', pageWidth / 2, yPos, { align: 'center' });
        yPos += 10;

        // Sous-titre
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Ministère de la Santé et de l\'Hygiène Publique', pageWidth / 2, yPos, { align: 'center' });
        doc.text('Direction des Etudes, des Effectifs et de la Planification des Professionnels de Santé', pageWidth / 2, yPos + 5, { align: 'center' });

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
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(59, 130, 246);
        doc.text('INFORMATIONS PERSONNELLES', margin, yPos);
        yPos += 10;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);

        // Colonnes pour les informations
        const col1 = margin;
        const col2 = pageWidth / 2;

   

        // Première colonne
        doc.text(`Nom et Prénoms: ${formattedData.nom} ${formattedData.prenoms}`, col1, yPos);
        doc.text(`Nationalité: ${formattedData.nationalite.libelle}`, col1, yPos + lineHeight);
        doc.text(`Email: ${formattedData.userEmail}`, col1, yPos + (lineHeight * 2));
       // doc.text(`Contact: ${formattedData.numero}`,  col1, yPos + lineHeight);
        /* doc.text(`Nom: ${formattedData.nom}`, col1, yPos + lineHeight);
        doc.text(`Civilité: ${formattedData.civilite.libelle}`, col1, yPos + (lineHeight * 3));
        doc.text(`Prénoms: ${formattedData.prenoms}`, col1, yPos + (lineHeight * 2)); */

        // Deuxième colonne
        doc.text(`Date de naissance: ${formattedData.dateNaissance}`, col2, yPos);
        doc.text(`Contact: ${formattedData.numero}`, col2, yPos + lineHeight);
       // doc.text(`Email: ${formattedData.userEmail}`, col2, yPos + (lineHeight * 2));
        doc.text(`Situation matrimoniale: ${formattedData.situation}`,  col2, yPos + (lineHeight * 2));
       // doc.text(`Situation matrimoniale: ${formattedData.situation}`, col2, yPos + (lineHeight * 3));

        yPos += (lineHeight * 4) + 10;

        // Section Informations Professionnelles
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(59, 130, 246);
        doc.text('INFORMATIONS PROFESSIONNELLES', margin, yPos);
        yPos += 10;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);

        // Première colonne
        doc.text(`Profession: ${formattedData.professionLibelle}`, col1, yPos);
        doc.text(`Date du diplôme: ${formattedData.dateDiplome}`, col1, yPos + lineHeight);
        doc.text(`Diplôme: ${formattedData.diplome}`, col1, yPos + (lineHeight * 2));
        doc.text(`Region sanitaire: ${formattedData.region.libelle}`, col1, yPos + (lineHeight * 3));
        doc.text(`Ville: ${formattedData.ville.libelle}`, col1, yPos + (lineHeight * 4));
        doc.text(`Ilot,lot: ${formattedData.poleSanitaire}`, col1, yPos + (lineHeight * 5));
        doc.text(`Situation professionnelle: ${formattedData.situationPro.libelle}`, col1, yPos + (lineHeight * 6));
        doc.text(`Code membre: ${formattedData.code}`, col1, yPos + (lineHeight * 7));

        // Deuxième colonne
        doc.text(`Lieu d'obtention: ${formattedData.lieuDiplome}`, col2, yPos);
        doc.text(`Date d'obtention premier emploi: ${formattedData.datePremierDiplome}`, col2, yPos + lineHeight);
        doc.text(`Lieu d'exercice: ${formattedData.lieuExercicePro}`, col2, yPos + (lineHeight * 2));
        doc.text(`District sanitaire: ${formattedData.district.libelle}`, col2, yPos + (lineHeight * 3));
        doc.text(`Commune: ${formattedData.commune.libelle}`, col2, yPos + (lineHeight * 4));
        doc.text(`Quartier: ${formattedData.quartier}`, col2, yPos + (lineHeight * 5));
        doc.text(`Structure d'exercice professionnel: ${formattedData.professionnel}`, col2, yPos + (lineHeight * 6));
       
        yPos += (lineHeight * 4) + 35;
     

        // Section Informations Professionnelles
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(59, 130, 246);
        doc.text('INFORMATIONS ORGANISATION', margin, yPos);
        yPos += 8;
        

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        yPos += (lineHeight * 1) ;
        doc.text(`Appartient à une organisation: ${formattedData.appartenirOrganisation}`, col1, yPos);

        if (formattedData.appartenirOrganisation === "oui") {
            doc.text(`Nom de l'organisation: ${formattedData.organisationNom}`, col1, yPos + lineHeight);
            yPos += lineHeight;
        }

        yPos += 15;

        // Pied de page
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Fiche générée le ${format(new Date(), "dd/MM/yyyy à HH:mm:ss")}`, pageWidth / 2, 280, { align: 'center' });
        doc.text('DEPS - Ministère de la Santé et de l\'Hygiène Publique', pageWidth / 2, 285, { align: 'center' });

        // Convertir en URL pour affichage
        const pdfBlob = doc.output('blob');
        pdfUrl = URL.createObjectURL(pdfBlob);
    }

    onMount(() => {
        if (open) {
            generatePDF();
        }
    });

    // Fermer la modal parente quand celle-ci s'ouvre
  /*   $: if (open) {
        const parentModal = document.querySelector('.modale_general');
        if (parentModal) {
            parentModal.style.display = 'none';
        }
    }*/

    function handleClose() {
       
        open = false;
    } 

    function handleModalClose(event: Event) {
    if (isLoading) {
      event.preventDefault();
    }
  }
</script>

<Modal
        bind:open
        title=""
        size={sizeModal}
        class="m-4 "
        on:close={handleModalClose}
>
    <div class="space-y-6 p-4">
        {#if isLoading}
            <div class="flex justify-center items-center h-64">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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

    <div slot="footer" class="w-full flex justify-end">
        <Button
                color="alternative"
                style="background-color: gray !important; color: white;"
                on:click={handleClose}
        >
            Fermer
        </Button>
    </div>
</Modal>

<!-- <style>
    /* Masquer la modal parente quand celle-ci est ouverte */
    .modal-backdrop {
        z-index: 9999 !important;
    }
    .modal-container {
        z-index: 10000 !important;
    }
</style> -->