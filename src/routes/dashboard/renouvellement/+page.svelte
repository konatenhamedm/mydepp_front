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
          
        } else {
            console.error("Erreur de récupération:");
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
 function clickValidation() {

    isValiding = true;
    try {
      //apiFetch(provenance: boolean, url: string, method?: string, data?: any, options?: RequestInit)


// console.log("formdata",JSON.stringify({
//         nom: formData.nom,
//         prenoms: formData.prenoms,
//         numero: formData.numero,
//         email: user?.username,
//         type: user?.type,
//         user: user?.id,
//       }))
      fetch( BASE_URL_API +"/paiement/renouvellement", {
      method: "POST",
      body: JSON.stringify({
        nom: formData.nom,
        prenoms: formData.prenoms,
        numero: formData.numero,
        email: user?.username,
        type: user?.type,
        user: user?.id,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        
        console.log("TTFDGFDTD", result);

        if (result.data.url) {
          localStorage.setItem("reference", result.data.reference);
          window.location.href = result.data.url + "?return=1";
        }
        isValiding = false;

      })
      
    } catch (error) {
        console.error("Erreur API:", error);
        isValiding = false;
    } 
}



function navigateToDashboard() {
    goto("/site/dashboard");
}
</script>

<!-- <Slide {user} /> <br /><br /><br /><br /><br /><br /> -->


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
    .renew-ariane {
      position: absolute;
      width: 100%;
      top: 96px;
      background: #4292cecc;
      padding: 22px;
      color: white;
      font-size: 14px;
      justify-content: center;
      align-items: center;
      z-index: 10;
    }
    .renew-ariane span {
      color: white;
      margin: 0 5px;
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
        <div class="mb-4">
          <span class="renew-label">Numéro de téléphone :</span>
          <span class="renew-value">{formData.numero}</span>
        </div>
        <div class="mt-6 flex justify-center">
          <button
            type="button"
            on:click={clickValidation}
            class="renew-btn"
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
