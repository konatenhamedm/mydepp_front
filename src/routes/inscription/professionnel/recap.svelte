<script lang="ts">
  export let formdata: any;
  export let values: any;
  export let isValidated: boolean;
  let allValuesAsTables : any[] = Object.values(values);
  function displayValue(value: any): string {
    if (!value) return "Non renseigné";
    if (typeof value === "string") return value;
    return String(value);
  }

  let recapRef: HTMLDivElement;
  async function printRecapPDF() {
    const jsPDF = (await import('jspdf')).jsPDF;
    const html2canvas = (await import('html2canvas')).default;
    const element = recapRef;
    const canvas = await html2canvas(element, { backgroundColor: "#fff" });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 40;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
    pdf.save('recapitulatif_inscription.pdf');
  }
</script>

<div style="background:#fff; padding:0; margin:0; display:flex; flex-direction:column; gap:1.5rem;" bind:this={recapRef}>
  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
    <h2 style="font-size:2rem; font-weight:bold; color:#1f2937; margin:0;">
      Récapitulatif de votre inscription
    </h2>
    <button style="background:#2563eb; color:#fff; padding:0.5rem 1rem; border-radius:0.5rem; font-weight:500; border:none; cursor:pointer; transition:background 0.2s;" on:click={printRecapPDF}>
      Imprimer en PDF
    </button>
  </div>
  <div style="padding:1rem; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:0.5rem; margin-bottom:1.5rem;">
    <p style="font-size:0.875rem; color:#166534; margin:0;">
      <strong>✓ Vérification finale :</strong> Veuillez vérifier attentivement toutes les informations avant de procéder au paiement.
    </p>
  </div>

  <!-- Section 1: Informations de compte -->
  <div style="background:#fff; border:1px solid #e5e7eb; border-radius:0.5rem; padding:1.5rem; box-shadow:0 1px 2px rgba(0,0,0,0.03);">
    <h3 style="font-size:1.25rem; font-weight:600; color:#1f2937; margin-bottom:1rem; display:flex; align-items:center;">
      <span style="background:#dbeafe; color:#2563eb; border-radius:9999px; width:2rem; height:2rem; display:flex; align-items:center; justify-content:center; margin-right:0.75rem;">1</span>
      Compte
    </h3>
    <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:1rem; padding-left:2.75rem;">
      <div>
        <p style="font-size:0.875rem; color:#4b5563;">Email</p>
        <p style="font-weight:500; color:#1f2937;">{displayValue(formdata?.email)}</p>
      </div>
    </div>
  </div>

  <!-- Section 2: Informations personnelles -->
  <div style="background:#fff; border:1px solid #e5e7eb; border-radius:0.5rem; padding:1.5rem; box-shadow:0 1px 2px rgba(0,0,0,0.03);">
    <h3 style="font-size:1.25rem; font-weight:600; color:#1f2937; margin-bottom:1rem; display:flex; align-items:center;">
      <span style="background:#f3e8ff; color:#9333ea; border-radius:9999px; width:2rem; height:2rem; display:flex; align-items:center; justify-content:center; margin-right:0.75rem;">2</span>
      Informations personnelles
    </h3>
    <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:1rem; padding-left:2.75rem;">
      <div>
        <p style="font-size:0.875rem; color:#4b5563;">Civilité</p>
        <p style="font-weight:500; color:#1f2937;">{displayValue(formdata?.civilite) ? allValuesAsTables[0][parseInt(formdata.civilite)-1].libelle : "Non renseigné"}</p>
      </div>
      <div>
        <p style="font-size:0.875rem; color:#4b5563;">Nom</p>
        <p style="font-weight:500; color:#1f2937;">{displayValue(formdata?.nom)}</p>
      </div>
      <div>
        <p style="font-size:0.875rem; color:#4b5563;">Prénoms</p>
        <p style="font-weight:500; color:#1f2937;">{displayValue(formdata?.prenoms)}</p>
      </div>
      <div>
        <p style="font-size:0.875rem; color:#4b5563;">Nationalité</p>
        <p style="font-weight:500; color:#1f2937;">{displayValue(formdata?.nationalite) ? allValuesAsTables[3][parseInt(formdata.nationalite)-1].libelle : "Non renseigné"}</p>
      </div>
      <div>
        <p style="font-size:0.875rem; color:#4b5563;">Date de naissance</p>
        <p style="font-weight:500; color:#1f2937;">{displayValue(formdata?.dateNaissance)}</p>
      </div>
      <div>
        <p style="font-size:0.875rem; color:#4b5563;">Numéro de téléphone</p>
        <p style="font-weight:500; color:#1f2937;">{displayValue(formdata?.numero)}</p>
      </div>
      <div>
        <p style="font-size:0.875rem; color:#4b5563;">Situation matrimoniale</p>
        <p style="font-weight:500; color:#1f2937;">{displayValue(formdata?.situation)}</p>
      </div>
      {#if formdata?.emailAutre}
        <div>
          <p style="font-size:0.875rem; color:#4b5563;">Email alternatif</p>
          <p style="font-weight:500; color:#1f2937;">{displayValue(formdata?.emailAutre)}</p>
        </div>
      {/if}
    </div>
  </div>
  {#if isValidated == false}
  <!-- Section 3: Informations professionnelles -->
  <div style="background:#fff; border:1px solid #e5e7eb; border-radius:0.5rem; padding:1.5rem; box-shadow:0 1px 2px rgba(0,0,0,0.03);">
    <h3 style="font-size:1.25rem; font-weight:600; color:#1f2937; margin-bottom:1rem; display:flex; align-items:center;">
      <span style="background:#bbf7d0; color:#16a34a; border-radius:9999px; width:2rem; height:2rem; display:flex; align-items:center; justify-content:center; margin-right:0.75rem;">3</span>
      Informations professionnelles
    </h3>
    <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:1rem; padding-left:2.75rem;">
      <div>
        <p style="font-size:0.875rem; color:#4b5563;">Profession</p>
        <p style="font-weight:500; color:#1f2937;">{displayValue(formdata?.profession)}</p>
      </div>
      <div>
        <p style="font-size:0.875rem; color:#4b5563;">Diplôme</p>
        <p style="font-weight:500; color:#1f2937;">{displayValue(formdata?.diplome)}</p>
      </div>
      <div>
        <p style="font-size:0.875rem; color:#4b5563;">Type de diplôme</p>
        <p style="font-weight:500; color:#1f2937;">{displayValue(formdata?.typeDiplome) ? allValuesAsTables[2][parseInt(formdata.typeDiplome)-1].libelle : "Non renseigné"}</p>
      </div>
      <div>
        <p style="font-size:0.875rem; color:#4b5563;">Date du diplôme</p>
        <p style="font-weight:500; color:#1f2937;">{displayValue(formdata?.dateDiplome)}</p>
      </div>
      <div>
        <p style="font-size:0.875rem; color:#4b5563;">Lieu d'obtention du diplôme</p>
        <p style="font-weight:500; color:#1f2937;">{displayValue(formdata?.lieuObtentionDiplome) ? allValuesAsTables[5][parseInt(formdata.lieuObtentionDiplome)-1].libelle : "Non renseigné"}</p>
      </div>
      <div>
        <p style="font-size:0.875rem; color:#4b5563;">Situation professionnelle</p>
        <p style="font-weight:500; color:#1f2937;">{displayValue(formdata?.situationPro) ? allValuesAsTables[4][parseInt(formdata.situationPro)-1].libelle : "Non renseigné"}</p>
      </div>
      {#if formdata?.emailPro}
        <div>
          <p style="font-size:0.875rem; color:#4b5563;">Email professionnel</p>
          <p style="font-weight:500; color:#1f2937;">{displayValue(formdata?.emailPro)}</p>
        </div>
      {/if}
    </div>
  </div>

  <!-- Section 4: Lieu d'exercice -->
  <div style="background:#fff; border:1px solid #e5e7eb; border-radius:0.5rem; padding:1.5rem; box-shadow:0 1px 2px rgba(0,0,0,0.03);">
    <h3 style="font-size:1.25rem; font-weight:600; color:#1f2937; margin-bottom:1rem; display:flex; align-items:center;">
      <span style="background:#fef9c3; color:#ca8a04; border-radius:9999px; width:2rem; height:2rem; display:flex; align-items:center; justify-content:center; margin-right:0.75rem;">4</span>
      Lieu d'exercice
    </h3>
    <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:1rem; padding-left:2.75rem;">
      <div>
        <p style="font-size:0.875rem; color:#4b5563;">Région</p>
        <p style="font-weight:500; color:#1f2937;">{displayValue(formdata?.region) ? allValuesAsTables[6][parseInt(formdata?.region)-1].libelle : "Non renseigné"}</p>
      </div>
      <div>
        <p style="font-size:0.875rem; color:#4b5563;">District</p>
        <p style="font-weight:500; color:#1f2937;">{displayValue(formdata?.district) ? allValuesAsTables[8][parseInt(formdata?.district)-1].libelle : "Non renseigné"}</p>
      </div>
      <div>
        <p style="font-size:0.875rem; color:#4b5563;">Ville</p>
        <p style="font-weight:500; color:#1f2937;">{displayValue(formdata?.ville) ? allValuesAsTables[7][parseInt(formdata?.ville)-1].libelle : "Non renseigné"}</p>
      </div>
      <div>
        <p style="font-size:0.875rem; color:#4b5563;">Commune</p>
        <p style="font-weight:500; color:#1f2937;">{displayValue(formdata?.commune) ? allValuesAsTables[9][parseInt(formdata?.commune)-1].libelle : "Non renseigné"}</p>
      </div>
      <div>
        <p style="font-size:0.875rem; color:#4b5563;">Quartier</p>
        <p style="font-weight:500; color:#1f2937;">{displayValue(formdata?.quartier)}</p>
      </div>
      {#if formdata?.lieuExercicePro}
        <div>
          <p style="font-size:0.875rem; color:#4b5563;">Lieu d'exercice</p>
          <p style="font-weight:500; color:#1f2937;">{displayValue(formdata?.lieuExercicePro)}</p>
        </div>
      {/if}
    </div>
  </div>

  <!-- Section 5: Documents -->
  <div style="background:#fff; border:1px solid #e5e7eb; border-radius:0.5rem; padding:1.5rem; box-shadow:0 1px 2px rgba(0,0,0,0.03);">
    <h3 style="font-size:1.25rem; font-weight:600; color:#1f2937; margin-bottom:1rem; display:flex; align-items:center;">
      <span style="background:#fee2e2; color:#dc2626; border-radius:9999px; width:2rem; height:2rem; display:flex; align-items:center; justify-content:center; margin-right:0.75rem;">5</span>
      Documents
    </h3>
    <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:1rem; padding-left:2.75rem;">
      <div>
        <p style="font-size:0.875rem; color:#4b5563;">Photo d'identité</p>
        <p style="font-weight:500; color:#1f2937;">{formdata?.photo ? "✓ Fichier téléchargé" : "Non renseigné"}</p>
      </div>
      <div>
        <p style="font-size:0.875rem; color:#4b5563;">CNI</p>
        <p style="font-weight:500; color:#1f2937;">{formdata?.cni ? "✓ Fichier téléchargé" : "Non renseigné"}</p>
      </div>
      <div>
        <p style="font-size:0.875rem; color:#4b5563;">Diplôme</p>
        <p style="font-weight:500; color:#1f2937;">{formdata?.diplomeFile ? "✓ Fichier téléchargé" : "Non renseigné"}</p>
      </div>
      <div>
        <p style="font-size:0.875rem; color:#4b5563;">Casier judiciaire</p>
        <p style="font-weight:500; color:#1f2937;">{formdata?.casier ? "✓ Fichier téléchargé" : "Non renseigné"}</p>
      </div>
      {#if formdata?.certificat}
        <div>
          <p style="font-size:0.875rem; color:#4b5563;">Certificat</p>
          <p style="font-weight:500; color:#1f2937;">✓ Fichier téléchargé</p>
        </div>
      {/if}
      {#if formdata?.cv}
        <div>
          <p style="font-size:0.875rem; color:#4b5563;">CV</p>
          <p style="font-weight:500; color:#1f2937;">✓ Fichier téléchargé</p>
        </div>
      {/if}
    </div>
  </div>

  <!-- Section 6: Organisations (si applicable) -->
  {#if formdata.appartenirOrganisation === "oui" || formdata.appartenirOrdre === "oui"}
    <div style="background:#fff; border:1px solid #e5e7eb; border-radius:0.5rem; padding:1.5rem; box-shadow:0 1px 2px rgba(0,0,0,0.03);">
      <h3 style="font-size:1.25rem; font-weight:600; color:#1f2937; margin-bottom:1rem; display:flex; align-items:center;">
        <span style="background:#c7d2fe; color:#4f46e5; border-radius:9999px; width:2rem; height:2rem; display:flex; align-items:center; justify-content:center; margin-right:0.75rem;">6</span>
        Organisations professionnelles
      </h3>
      <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:1rem; padding-left:2.75rem;">
        {#if formdata.appartenirOrganisation === "oui"}
          <div>
            <p style="font-size:0.875rem; color:#4b5563;">Organisation professionnelle</p>
            <p style="font-weight:500; color:#1f2937;">{displayValue(formdata.organisationNom)}</p>
          </div>
        {/if}
        {#if formdata.appartenirOrdre === "oui"}
          <div>
            <p style="font-size:0.875rem; color:#4b5563;">Ordre professionnel</p>
            <p style="font-weight:500; color:#1f2937;">{displayValue(formdata?.ordre) ? allValuesAsTables[10][parseInt(formdata.ordre)-1].libelle : "Non renseigné"}</p>
          </div>
          <div>
            <p style="font-size:0.875rem; color:#4b5563;">Numéro d'inscription à l'ordre</p>
            <p style="font-weight:500; color:#1f2937;">{displayValue(formdata.numeroInscription)}</p>
          </div>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Avertissement final -->
  <div style="padding:1rem; background:#fef9c3; border:1px solid #fde68a; border-radius:0.5rem;">
    <p style="font-size:0.875rem; color:#92400e; margin:0;">
      <strong>⚠️ Important :</strong> Une fois le paiement effectué, vous ne pourrez plus modifier ces informations. Assurez-vous que tout est correct.
    </p>
  </div>
{/if}
</div>