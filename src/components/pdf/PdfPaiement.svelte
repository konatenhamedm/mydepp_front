<script>
  import jsPDF from 'jspdf';
  import autoTable from 'jspdf-autotable';

  export let title = '';
  export let headers = [];
  export let data = [];
  export let typeUser = ''; // 'INSTRUCTEUR' | 'PROFESSIONNEL' | 'PRO'
  export let type = 'professionnel'; // 'professionnel' | 'etablissement' | 'pro'

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

  function addFooter(doc, pageNumber) {
    doc.setFontSize(8);
    doc.line(10, 190, 280, 190);
    doc.text(`Page ${pageNumber}`, 148, 200, null, null, 'center');
  }

  function getImageFromLocalPath(path, callback) {
    let img = new Image();
    img.src = path;
    img.onload = function () {
      let canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      let ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      callback(canvas.toDataURL('image/png'));
    };
  }

  function getStatus(status) {
    switch (status) {
      case 1:
        return 'Paiement effectué';
      case 0:
        return 'Paiement échoué';
      default:
        return 'Inconnu';
    }
  }

  function formatMontantPerso(montant) {
    return montant.toLocaleString('fr-FR') + ' FCFA';
  }

  function formatDatePaiement(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  }

  function exportToPDF() {
    console.log('Exporting to PDF...',data);
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    getImageFromLocalPath('/_files/depps.png', (logoImage) => {
      addHeader(doc, logoImage);

      const head = [headers];

      const body = data.map((item) => {
        if (type === 'paiement') {
          return [
            item.user?.nom ?item.user?.nom + " " + item.user?.prenoms  : item.user.denomination,
            item.user.data?.no_transation || 'N/A',
            item.user?.typePersonne || 'N/A',
            item.reference || 'N/A',
            item.type || 'N/A',
            item.email || 'N/A',
            getStatus(item.state),
            formatMontantPerso(item.montant),
            formatDatePaiement(item.createdAt),
          ];
        }
        return [];
      });

      autoTable(doc, {
        head: head,
        body: body,
        startY: 35,
        styles: {
          fontSize: 7,
          cellPadding: 1,
          overflow: 'linebreak',
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 25 },
          2: { cellWidth: 35 },
          3: { cellWidth: 30 },
          4: { cellWidth: 25 },
          5: { cellWidth: 35 },
          6: { cellWidth: 30 },
          7: { cellWidth: 30 },
          8: { cellWidth: 25 },
        },
        horizontalPageBreak: true,
      });

      addFooter(doc, 1);
      doc.save(`${title}.pdf`);
    });
  }
</script>

<!-- Bouton -->
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
