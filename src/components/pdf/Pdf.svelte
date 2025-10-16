<!-- PdfExporter.svelte -->
<script>
  import jsPDF from "jspdf";
  import autoTable from "jspdf-autotable";

  export let title = "";
  export let headers = [];
  export let data = [];
  export let type = "professionnel"; // 'professionnel' | 'etablissement' | 'pro'


  function addHeader(doc, logoImage) {
    
    doc.addImage(logoImage, 'PNG', 10, 6, 20, 14);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('VOTRE ENTREPRISE', 148, 15, null, null, 'center');
    doc.setFontSize(10);
    doc.text('Adresse, Téléphone', 148, 20, null, null, 'center');
    doc.line(10, 25, 280, 25);
    doc.text("République de COTE D'IVOIRE", 280, 15, null, null, 'right');
    doc.text(`Date : ${new Date().toLocaleDateString()}`, 280, 20, null, null, 'right');
  }

  function getStatus(status) {
    return status === 1 ? "Paiement effectué" : "Paiement échoué";
  }
//dddd
  function addFooter(doc, pageNumber) {
    doc.setFontSize(8);
    doc.line(10, 280, 200, 280);
    doc.text(`Page ${pageNumber}`, 105, 290, null, null, "center");
  }

  function getImageFromLocalPath(path, callback) {
    let img = new Image();
    img.src = path;
    img.onload = function () {
      let canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      let ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      callback(canvas.toDataURL("image/png"));
    };
  }
 
  function formatDatePaiement(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  }
  function formatMontantPerso(montant) {
  return montant.toLocaleString('fr-FR') + ' FCFA';
}

function formatDateFR(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}


  function exportToPDF() {
    const doc = new jsPDF();
    console.log('type selected', type);
    getImageFromLocalPath("/_files/depps.png", (logoImage) => {
      addHeader(doc, logoImage);

      const head = [headers];

      const body = data.map((item) => {
        if (type === "paiement") {
         
          return [
            item.personne.nom || "N/A",
            item.personne.prenoms || "N/A",
            item.email || "N/A",
            item.personne.number || "N/A",
            item.personne.profession ? item.personne.profession.libelle : "N/A",
           
          ];
        } else if (type === "professionnel" || type === "pro") {
          return [
            item.personne.nom || "N/A",
            item.personne.prenoms || "N/A",
            item.email || "N/A",
            item.personne.number || "N/A",
            item.personne.profession ? item.personne.profession.libelle : "N/A",
           
          ];
        } else {
            return [
            item.personne?.typePersonne?.libelle || "N/A",
            item.email || "N/A",
            item.personne?.imputationData?.username  || "N/A",
            item.personne.createdAt ? formatDateFR(item.personne.createdAt) : "N/A",
           
          ];
        }
      });

      autoTable(doc, {
        head: head,
        body: body,
        startY: 35,
        tableWidth: "auto",
        styles: {
          fontSize: 8,
          cellPadding: 2,
          overflow: 'linebreak'
        },
        columnStyles: type === "paiement" ? {
          0: { cellWidth: 30 },
          1: { cellWidth: 25 },
          2: { cellWidth: 40 },
          3: { cellWidth: 30 },
          4: { cellWidth: 25 },
          5: { cellWidth: 25 }
        } : undefined
      });

      addFooter(doc, 1);
      doc.save(`${title}.pdf`);
    });
  }
</script>

<button
  on:click={exportToPDF}
  class="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-5 w-5 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
  Télécharger PDF
</button>
