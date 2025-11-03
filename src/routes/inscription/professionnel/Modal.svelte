<script>
  import { apiFetch } from '$lib/api';
  import { formatDate } from '$lib/dateUtils';
  import { faArrowLeftRotate } from '@fortawesome/free-solid-svg-icons';
  import axios from 'axios';
  import jsPDF from 'jspdf';
  import { onMount } from 'svelte';

  export let isOpen = false;
  export let pdfUrl = "";
  let pdfUrlAffiche ="";
  export let onClose = () => {};

  let receiptData = {
    logo: 'https://mydepps.pages.dev/_files/logo-depps.png', // URL du logo
    title: 'Reçu de Paiement - Renouvellement',
    date: '04 novembre 2024 à 16:39:59',
    name: 'Kra Rita',
    paymentMethod: 'OMCIV2',
    phone: '0564924282',
    receiptNumber: '1730738267',
    amount: '10000 XOF',
    footerText: 'Ce document ne tient pas lieu d’autorisation d’exercice',
  };


  let transactionData; // Variable pour stocker les données de la transaction
  function generatePDF() {
    try{
    const doc = new jsPDF();

    // Centrer le logo
    const imgWidth = 30;
    const imgHeight = 30;
    const pageWidth = 210;
    const logoX = (pageWidth - imgWidth) / 2; // Position X centrée
    doc.addImage(receiptData.logo, 'PNG', logoX, 10, imgWidth, imgHeight);

    // Ajouter le titre centré sous le logo
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(receiptData.title, 105, 50, { align: 'center' });

    // Ajouter les informations du reçu
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    
    const startX = 10;
    const startY = 60;
    const lineHeight = 10;

    const fields = [
      { label: "Date d'édition:", value: transactionData.createdAt },
      // { label: "Nom complet:", value: data.name },
      { label: "Mode de paiement:", value: transactionData.channel },
      { label: "Email:", value: transactionData.user.email },
      { label: "Réference paiement:", value: `N° ${transactionData.reference}` },
      { label: "Paiement:", value: `${transactionData.montant}` }
    ];

    let yPos = startY;
    fields.forEach(({ label, value }) => {
      doc.text(label, startX, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(value, startX + 50, yPos);
      doc.setFont('helvetica', 'bold');
      doc.line(startX, yPos + 2, 200, yPos + 2); // Ligne de séparation
      yPos += lineHeight;
    });

    // Ajouter le texte en bas du reçu
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(receiptData.footerText, 105, yPos + 10, { align: 'center' });

    // Convertir en URL pour affichage
    const pdfBlob = doc.output('blob');
    pdfUrlAffiche = URL.createObjectURL(pdfBlob);}
    catch(error){
      console.error("Erreur lors de la génération du PDF:", error);
    }
  }



  let isLoading = false;
  
  async function getTransactionInfos() {
    isLoading = true;
    try {
      await axios.get( "https://backend.leadagro.net/api/paiement/info/transaction/"+pdfUrl).then((response) => {
        console.log("response", response);
        if (response.data.code === 200) {
          console.log("response.data", response.data);
          transactionData = response.data.data;
          receiptData.amount = response.data.data.montant;
          receiptData.paymentMethod = response.data.data.channel;
          receiptData.receiptNumber = response.data.data.reference;
          receiptData.residence = response.data.data.user.personne.quartier;
          receiptData.name = response.data.data.user.typeUser == "PROFESSIONNEL" 
            ? response.data.data.user.personne.nom + " "+ response.data.data.user.personne.prenoms 
            : response.data.data.user.email;
          receiptData.phone = response.data.data.user.typeUser == "PROFESSIONNEL" 
            ? response.data.data.user.personne.number 
            : response.data.data.user.username
          receiptData.date = formatDate(response.data.createdAt);
          isLoading = false;
        }
        
    

      });
      console.log("transactionData", transactionData);
      generatePDF();
    } catch (error) {
      console.error("Erreur lors de la récupération des infos de transaction", error);
    } finally {
      isLoading = false;
    }
  }

 


  onMount(async () => {
    console.log("REFFFFFFFFFFFFFF", pdfUrl);
    await getTransactionInfos();
  });
</script>

{#if isOpen}
  <div class="modal">
    <div class="modal-content">
      <button class="close-btn" on:click={onClose}>Fermer</button>
      
      <div class="pdf-viewer">
        {#if isLoading}
          <p>Chargement en cours...</p>
        {:else if pdfUrlAffiche}
          <iframe src={pdfUrlAffiche} title="Aperçu du PDF" width="100%" height="700px" type="application/pdf"></iframe>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 900px;
    position: relative;
  }
  .close-btn {
    position: absolute;
    top: -13px;
    right: 10px;
    color:black !important;
    background-color: transparent;
    border: none;
    font-size: 18px;
    cursor: pointer;
  }
  .pdf-viewer {
    margin-top: 20px;
  }
</style>