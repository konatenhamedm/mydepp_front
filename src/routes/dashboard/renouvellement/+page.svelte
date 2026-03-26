<script lang="ts">

  import { onMount } from "svelte";
  import { apiFetch, BASE_URL_API } from "$lib/api";
  import { EyeOutline } from "flowbite-svelte-icons";
  import { goto } from "$app/navigation";
  import Spinner from "$components/_skeletons/Spinner.svelte";
  import { isValid } from "date-fns";
  import FooterNew from "$components/_includes/FooterNew.svelte";
  import HeaderNew from "$components/_includes/HeaderNew.svelte";

  let paiementData: any[] = [];

export let data;
let user = data?.user;

let formData = {
  nom: "",
  prenoms: "",
  numero : "",
};

let renewalInfo = {
  expire: false,
  yearDue: 0,
  montantUnitaire: 0,
  montantTotal: 0
};
let yearsToPay = 1;

let errorMessagePaiement = "";

let loading = false;

async function fetchData(userId: number) {
    loading = true;
    try {
      const res = await apiFetch(true, `/professionnel/get/one/${userId}`)
      console.log("Response:", res);
        if (res) {
            formData = {
                nom: res.data.personne?.nom || "",
                prenoms: res.data.personne?.prenoms || "",
                numero: res.data.personne?.number || "",
            };
        }

        // Fetch renewal status
        const statusRes = await fetch(`${BASE_URL_API}/paiement2/status/renouvellement/${user?.id}`);
        const statusData = await statusRes.json();
        if (statusData.data) {
          renewalInfo = statusData.data;
          yearsToPay = renewalInfo.yearDue || 1;
          if (yearsToPay < 1) yearsToPay = 1;
        }

    } catch (error) {
        console.error("Erreur API:", error);
    } finally {
        loading = false;
    }
}

onMount(async () => {
    await fetchData(user?.personneId);
});

let isValiding = false;
let isPaiementDone = false;

function clickValidation() {
    if (!formData.numero) {
      errorMessagePaiement = "Veuillez saisir votre numéro MTN MoMo.";
      return;
    }
    errorMessagePaiement = "";
    isValiding = true;
    try {
      fetch( BASE_URL_API + "/paiement2/renouvellement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom: formData.nom,
        prenoms: formData.prenoms,
        numero: formData.numero,
        email: user?.username,
        type: user?.type,
        user: user?.id,
        yearsToPay: yearsToPay
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("TTFDGFDTD", result);

        if (result.data && (result.data.code === 200 || result.data.reference)) {
          alert("Une requête MTN MoMo a été envoyée. Veuillez valider le paiement sur votre téléphone.");
          localStorage.setItem("reference", result.data.reference);

          let attempts = 0;
          const pollInterval = setInterval(async () => {
            attempts++;
            try {
              const res = await fetch(`${BASE_URL_API}/paiement2/info/transaction/${result.data.reference}`);
              const dat = await res.json();
              if (dat.data && dat.data.state == 1) {
                clearInterval(pollInterval);
                isPaiementDone = true;
                isValiding = false;
                errorMessagePaiement = "";
                alert("Renouvellement effectué avec succès !");
                goto("/dashboard");
              } else if (dat.data && dat.data.state == -1) {
                clearInterval(pollInterval);
                errorMessagePaiement = "Le paiement a échoué. Veuillez réessayer.";
                isValiding = false;
              } else if (attempts > 70) {
                clearInterval(pollInterval);
                errorMessagePaiement = "Délai de paiement expiré. Veuillez reprendre.";
                isValiding = false;
              }
            } catch (e) {
              console.error("Erreur polling", e);
            }
          }, 5000);
        } else if (result.data && result.data.url) {
          localStorage.setItem("reference", result.data.reference);
          window.location.href = result.data.url + "?return=1";
        } else {
          errorMessagePaiement = (result.data && result.data.message) || result.error || "Erreur lors de l'initiation du paiement.";
          isValiding = false;
        }
      })
      
    } catch (error) {
        console.error("Erreur API:", error);
        errorMessagePaiement = "Erreur réseau. Veuillez réessayer.";
        isValiding = false;
    } 
}

function navigateToDashboard() {
    goto("/dashboard");
}
</script>

<HeaderNew />

<main class="renew-bg-gradient">
  <style>
    .renew-bg-gradient {
      min-height: 100vh;
      background: linear-gradient(120deg, #eff6ff 0%, #fff 60%, #f3e8ff 100%);
      padding: 0;
    }
    .renew-card {
      background: rgba(255,255,255,0.97);
      box-shadow: 0 8px 32px 0 rgba(60, 60, 120, 0.15);
      border-radius: 24px;
      padding: 40px 32px;
      max-width: 600px;
      width: 100%;
      margin: 0 auto;
      border: 1px solid #e0e7ff;
      transition: box-shadow 0.2s, transform 0.2s;
    }
    .renew-card:hover {
      box-shadow: 0 12px 40px 0 #a5b4fc;
      transform: scale(1.02);
    }
    .renew-title {
      font-size: 2em;
      font-weight: 700;
      color: #6d28d9;
      text-align: center;
      margin-bottom: 24px;
      letter-spacing: 1px;
      text-shadow: 0 2px 8px #e0e7ff;
    }
    .renew-label {
      font-size: 1em;
      color: #374151;
      font-weight: 500;
      margin-bottom: 6px;
    }
    .renew-value {
      font-size: 1.1em;
      color: #6366f1;
      background: #eef2ff;
      padding: 4px 10px;
      border-radius: 6px;
      font-weight: 500;
      margin-bottom: 12px;
      display: inline-block;
    }
    .renew-btn {
      background: linear-gradient(90deg, #6366f1 0%, #7c3aed 100%);
      color: #fff;
      font-size: 1.1em;
      font-weight: 600;
      padding: 12px 32px;
      border-radius: 12px;
      border: none;
      box-shadow: 0 2px 8px #e0e7ff;
      cursor: pointer;
      transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .renew-btn:hover {
      background: linear-gradient(90deg, #7c3aed 0%, #6366f1 100%);
      transform: scale(1.04);
      box-shadow: 0 4px 16px #a5b4fc;
    }
    .renew-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .renew-btn-flex {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .renew-input {
      width: 100%;
      padding: 10px 14px;
      border-radius: 10px;
      border: 1px solid #cbd5e1;
      font-size: 1em;
      margin-top: 4px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .renew-input:focus {
      border-color: #6366f1;
      box-shadow: 0 2px 8px #a5b4fc;
      outline: none;
    }
    .renew-error {
      background: #fee2e2;
      border: 1px solid #fca5a5;
      color: #b91c1c;
      padding: 12px 18px;
      border-radius: 10px;
      margin-top: 10px;
      font-size: 1em;
      text-align: center;
    }
  </style>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
    integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
    crossorigin="anonymous"
  />
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
    integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  />
  <section class="renew-section" style="padding-top:120px">
    <div class="container">
      <div class="renew-card">
        <h2 class="renew-title">Informations de l'utilisateur</h2>
        <div class="mb-3">
          <span class="renew-label">Nom :</span>
          <span class="renew-value">{formData.nom}</span>
        </div>
        <div class="mb-3">
          <span class="renew-label">Prénoms :</span>
          <span class="renew-value">{formData.prenoms}</span>
        </div>
        <div class="mb-3">
          <span class="renew-label">Email :</span>
          <span class="renew-value">{user?.username}</span>
        </div>
        <div class="mb-3">
          <span class="renew-label">Type d'utilisateur :</span>
          <span class="renew-value">{user?.type}</span>
        </div>

        {#if renewalInfo.yearDue > 0}
          <div class="mb-3 bg-purple-50 p-4 rounded-xl border border-purple-100">
            <div class="flex justify-between items-center mb-2">
              <span class="renew-label">Années d'arriérés :</span>
              <span class="font-bold text-purple-700">{renewalInfo.yearDue} an(s)</span>
            </div>
            
            <div class="flex flex-col gap-2">
              <label for="years" class="renew-label font-semibold">Nombre d'années à régulariser :</label>
              <select 
                id="years" 
                bind:value={yearsToPay}
                class="renew-input border-purple-300 focus:border-purple-500"
              >
                {#each Array.from({ length: renewalInfo.yearDue }, (_, i) => i + 1) as year}
                  <option value={year}>{year} an(s)</option>
                {/each}
              </select>
            </div>

            <div class="mt-4 flex justify-between items-center border-t border-purple-200 pt-3">
              <span class="renew-label">Montant à payer :</span>
              <span class="text-xl font-bold text-purple-800">
                {(renewalInfo.montantUnitaire * yearsToPay).toLocaleString()} FCFA
              </span>
            </div>
          </div>
        {/if}
        <div class="mb-4">
          <span class="renew-label">📱 Numéro MTN MoMo pour le paiement :</span>
          <input
            type="tel"
            placeholder="Ex: 05XXXXXXXX"
            bind:value={formData.numero}
            class="renew-input"
          />
          <p style="font-size:13px;color:#6366f1;margin-top:4px;">Un code de validation sera envoyé sur ce numéro via l'application MTN MoMo.</p>
        </div>

        {#if errorMessagePaiement}
          <div class="renew-error">{errorMessagePaiement}</div>
        {/if}

        <div class="mt-6 flex justify-center">
          <button
            type="button"
            on:click={clickValidation}
            class="renew-btn"
            disabled={isValiding}
          >
            {#if isValiding}
              <div class="renew-btn-flex">
                <Spinner />
                <span>Validation...</span>
              </div>
            {:else}
              Soumettre
            {/if}
          </button>
        </div>
      </div>
    </div>
  </section>
</main>

<FooterNew />
