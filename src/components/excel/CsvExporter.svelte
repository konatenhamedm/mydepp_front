<script lang="ts">
  import * as XLSX from 'xlsx';

  export let title = '';
  export let headers: any = [];
  export let data: any = [];
  export let typeUser = '';
  export let type = 'professionnel';

  let dataP: any;

  function getStatus(status:any) {
    switch (status) {
      case 1:
        return 'Paiement effectué';
      case 0:
        return 'Paiement échoué';
      default:
        return 'Paiement effectué';
    }
  }

  function formatMontantPerso(montant: any) {
    return montant?.toLocaleString('fr-FR') + ' FCFA';
  }

  function formatDatePaiement(dateString: any) {
    const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  }

function formatDateFR(dateString:any) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}



  function exportToCSV() {
    let rows = [];

    // Ajouter les en-têtes comme première ligne
    rows.push(headers);
    /* 'Reference',
                'Type',
                'Email',
                'Etat',
                'Montant',
                'Date', */
    if (type === 'paiement') {
      dataP = data.map((item: any) => ({
        nom: item.user?.nom ?item.user?.nom + " " + item.user?.prenoms  : item.user.denomination,
        contact: item.user.data?.no_transation || 'N/A',
        profession: item.user?.typePersonne || 'N/A',
        reference: item.reference,
        email: item.email,
        type: item.type,
        etat: item.state,
        montant: item.montant,
        createdAt: item.createdAt,
      }));
    } 
    else if (type === 'professionnel' || type === 'pro') {
      dataP = data.map((item: any) => ({
        nom: item.nom,
        prenom: item.prenoms,
        email: item.email,
        telephone: item.number,
        profession: item.profession ? item.profession.libelle : ''
      }));
    }
    
    else {

      dataP = data.map((item: any) => ({
     entity:item.user?.typeuser?.libelle || "N/A",
     Email: item.email || "N/A",
     Imputation: item.user?.imputationData?.username  || "N/A",
     cree: item.user?.createdAt ? formatDatePaiement(item.user?.createdAt) : "N/A",
      }));
    }

    // Ajouter les lignes de données formatées
    dataP.forEach((item: any) => {
      if (type === 'paiement') {
        if (!['INSTRUCTEUR', 'SOUS-DIRECTEUR'].includes(typeUser)) {
          rows.push([
            item.nom || 'N/A',
            item.contact || 'N/A',
            item.profession || 'N/A',
            item.reference || 'N/A',
            item.type || 'N/A',
            item.email || 'N/A',
            getStatus(item.state),
            formatMontantPerso(item.montant),
            formatDatePaiement(item.createdAt),
          ]);
        } else {
          rows.push([
            item.nom || 'N/A',
            item.contact || 'N/A',
            item.profession || 'N/A',
            item.reference || 'N/A',
            item.type || 'N/A',
            item.email || 'N/A',
            getStatus(item.state),
            item.channel || 'N/A',
            formatDatePaiement(item.createdAt),
          ]);
        }
      } else if (type === 'professionnel' || type === 'pro') {
        rows.push([
          item.nom || 'N/A',
          item.prenom || 'N/A',
          item.email || 'N/A',
          item.telephone || 'N/A',
          item.profession || 'N/A' 
        ]);
      } else {
        console.log("dans csv",item)
        rows.push([
           item.entity || 'N/A',
           item.Email || 'N/A',
           item.Imputation || 'N/A',
           item.cree || 'N/A',
        ]);
      }
    });

    // Créer une feuille de calcul à partir des données formatées
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Export');

    // Exporter en .csv (ou .xlsx si souhaité)
    //XLSX.writeFile(workbook, `${title}.csv`);
    // Pour un export en .xlsx, utilisez cette ligne à la place :
    XLSX.writeFile(workbook, `${title}.xlsx`);
  }
</script>

<!-- Bouton d'export CSV -->
<button
  on:click={exportToCSV}
  class="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
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
  Télécharger CSV
</button>
