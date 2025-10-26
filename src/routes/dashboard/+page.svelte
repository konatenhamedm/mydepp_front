<script lang="ts">
  import HeaderNew from "$components/_includes/HeaderNew.svelte";
  import FooterNew from "$components/_includes/FooterNew.svelte";
  import { onMount } from "svelte";
  import { BASE_URL_API, BASE_URL_API_UPLOAD } from "$lib/api";
  import { getAuthCookie } from "$lib/auth";

  let isLoad = false;
  let notificationCount = 0;
  let nbPayment = 0;
  let nbDocumentValide = 0;
  let nbWaitingDocument = 0;
  let notifications: any = [];
  let user: any = [];

  let expire: boolean = false;
  let info = {
    expire: false,
    finRenouvellement: "",
    montant: "",
  };

  let photoProfile: any | null =
    "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

  function handlePhotoChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validation du type de fichier
    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner une image");
      return;
    }

    // Validation de la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 5MB");
      return;
    }

    // Prévisualisation immédiate
    const reader = new FileReader();
    reader.onload = (e) => {
      photoProfile = e.target.result;
    };
    reader.readAsDataURL(file);

    // Upload au serveur
    uploadPhoto(file);
  }

  async function uploadPhoto(file) {
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await fetch(BASE_URL_API + "/user/upload-photo", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${user?.token || ""}`, // Ajuster selon ton système d'auth
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.code === 200) {
          photoProfile = BASE_URL_API_UPLOAD + data.data.photoUrl;
          console.log("Photo mise à jour avec succès");
          // Ajouter notification de succès si tu as un système de toast
        }
      } else {
        throw new Error("Erreur lors de l'upload");
      }
    } catch (error) {
      console.error("Erreur upload:", error);
      alert("Erreur lors de l'upload de la photo");
    }
  }

  async function fetchData() {
    try {
      const response = await fetch(
        BASE_URL_API + `/notification/by/${user?.id}`
      );
      if (response.ok) {
        const result = await response.json();
        if (result.code === 200 && result.data) {
          notifications = result.data;
          notificationCount = result.data.length;
        } else {
          console.error("Erreur dans la réponse de l'API:", result.message);
        }
      } else {
        console.error("Erreur de récupération:", response.statusText);
      }
    } catch (error) {
      console.error("Erreur API:", error);
    }
  }

  async function fetchDataInfo() {
    try {
      await fetch(
        BASE_URL_API + "/paiement/status/renouvellement/" + (user?.id )
      )
        .then((response) => response.json())
        .then((result) => {
          info.expire = result.data.expire;
          expire = result.data.expire;
          info.finRenouvellement = result.data.date_expiration;
          info.montant = result.data.montant;
          console.log("content main_data", info);
        });
    } catch (error) {
      console.error("Erreur API:", error);
    }
  }
  async function fetchPaymentStats() {
    try {
      await fetch(
        BASE_URL_API + "/paiement/historique/" + (user?.id )
      )
        .then((response) => response.json())
        .then((result) => {
          
          nbPayment = result.data.length;
          
          console.log("payment stats", result.data);
        });
    } catch (error) {
      console.error("Erreur API:", error);
    }
  }
  onMount(async () => {
    user = getAuthCookie();

    console.log("=============user", user);

    // Charger la photo de profil existante si disponible
    if (user?.photo) {
      photoProfile = BASE_URL_API_UPLOAD + user.photo;
    }

    console.log("user", user);
    isLoad = true;
    await fetchData();
    await fetchDataInfo();
    await fetchPaymentStats();
    isLoad = false;
  });

  const cards = [
    {
      title: "Mise à jour du dossier",
      icon: "ri-folder-line",
      color: "from-blue-100 to-blue-50",
      badge: "À jour",
      badgeColor: "bg-green-100 text-green-700",
      link: "/dashboard/mon_dossier",
      description: "Mettre à jour vos informations",
      isProtected: true,
    },
    {
      title: "Alertes",
      icon: "ri-notification-line",
      color: "from-orange-100 to-orange-50",
      badge: notificationCount.toString(),
      badgeColor: "bg-red-500 text-white",
      link: "/dashboard/alerts",
      description: "Notifications importantes",
      isProtected: true,
    },
    {
      title: "Suivi de mon dossier",
      icon: "ri-file-list-line",
      color: "from-green-100 to-green-50",
      badge: "En cours",
      badgeColor: "bg-green-100 text-green-700",
      link: "/dashboard/suivi_dossier",
      description: "État d'avancement du dossier",
      isProtected: true,
    },
    {
      title: "Historique paiements",
      icon: "ri-bank-card-line",
      color: "from-indigo-100 to-indigo-50",
      link: "/dashboard/historique_payment",
      description: "Consulter vos paiements",
      isProtected: false,
    },
    {
      title: "Documenthèque",
      icon: "ri-file-pdf-line",
      color: "from-red-100 to-red-50",
      badge: "0",
      badgeColor: "bg-red-500 text-white",
      link: "#",
      description: "Accéder aux documents",
      isProtected: false,
    },
    {
      title: "Forum",
      icon: "ri-group-line",
      color: "from-purple-100 to-purple-50",
      badge: "0",
      badgeColor: "bg-red-500 text-white",
      link: "#",
      description: "Échanger avec la communauté",
      isProtected: false,
    },
  ];
</script>

<main
  class="bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen flex flex-col"
>
  <HeaderNew />

  <section
    class="container max-w-7xl mx-auto px-6 lg:px-10 py-12 animate-fadeIn pt-20"
  >
    <!-- Header de bienvenue -->
    <div
      class="bg-white shadow-md border border-blue-100 rounded-3xl p-8 mb-10 flex flex-col md:flex-row justify-between items-center"
    >
      <div class="flex-grow">
        <h1
          class="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight mb-2"
        >
          Bienvenue sur <span class="text-blue-600">MYDEPPS</span>
        </h1>
        <p class="text-gray-600 mb-4">
          Gérez vos démarches administratives et suivez l'évolution de vos
          dossiers.
        </p>
        <div class="flex flex-wrap gap-4 text-sm text-gray-500">
          <span class="flex items-center gap-2"
            ><i class="ri-building-line"></i>
            {user?.type ? (user?.type).toLowerCase() + " de Santé" : "Clinique de la Santé"}</span
          >
          <span class="flex items-center gap-2"
            ><i class="ri-map-pin-line"></i> Côte d'Ivoire</span
          >
          <span class="flex items-center gap-2"
            ><i class="ri-calendar-line"></i> Inscrit depuis 10/01/2024</span
          >
        </div>

        <!-- Alerte d'expiration -->
        {#if expire}
          <div
            class="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3"
          >
            <i class="ri-error-warning-line text-red-500 text-2xl animate-pulse"
            ></i>
            <div>
              <p class="font-semibold text-red-800">Abonnement expiré</p>
              <p class="text-sm text-red-600">
                Votre abonnement a expiré le {info.finRenouvellement}. Veuillez
                renouveler pour un montant de {info.montant} pour continuer à utiliser
                tous les services.
              </p>
              <a
                href="/dashboard/historique_payment"
                class="inline-block mt-2 text-sm font-semibold text-red-700 hover:text-red-900 underline"
              >
                Renouveler maintenant →
              </a>
            </div>
          </div>
        {/if}
      </div>

      <!-- Photo de profil (tout le bloc cliquable) -->
      <div class="mt-6 md:mt-0 flex-shrink-0 relative">
        <label for="photo-upload" class="cursor-pointer group relative block">
          <div
            class="relative w-32 h-32 rounded-full overflow-hidden shadow-xl border-4 border-white"
          >
            {#if photoProfile}
              <!-- Photo de profil -->
              <img
                src={photoProfile}
                alt="Photo de profil"
                class="w-full h-full object-cover"
              />
            {:else}
              <!-- Placeholder avec dégradé -->
              <div
                class="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center"
              >
                <i class="ri-user-line text-white text-5xl"></i>
              </div>
            {/if}

            <!-- Overlay au survol -->
            <div
              class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center"
            >
              <div
                class="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-1"
              >
                <i class="ri-camera-line text-white text-3xl"></i>
                <span class="text-white text-xs font-medium">Changer</span>
              </div>
            </div>
          </div>

          <!-- Badge hôpital en bas à droite -->
          <div
            class="absolute -bottom-2 -right-2 bg-white text-blue-600 rounded-full shadow-lg p-2 border-2 border-white"
          >
            <i class="ri-building-2-line text-lg"></i>
          </div>
        </label>

        <!-- Input file caché -->
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          class="hidden"
          on:change={handlePhotoChange}
        />

        <!-- Icône de warning si expiré -->
        {#if expire}
          <div
            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full shadow-lg p-3 animate-bounce z-10"
          >
            <i class="ri-alert-line text-xl"></i>
          </div>
        {/if}
      </div>
    </div>
    {#if user.status == "acp_dossier_valide_directrice"}
      <div
        class="col-lg-12 col-md-12 d-flex mx-[40%] justify-center items-center my-3"
      >
        <button
          
          on:click={() => (window.location.href = "/dashboard/oep_initiate")}
          style="font-size: 1.1rem; padding: 0.75rem 1.5rem; background-color: #2563eb; color: white; border: none; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); transition: background-color 0.3s ease;  "
        >
          Passer à L'initialisation OEP
        </button>
      </div>
    {/if}
    <!-- Section Synthèse -->
    <section class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
      <div
        class="bg-white rounded-2xl p-6 shadow-sm flex justify-between items-center border border-gray-100"
      >
        <div>
          <p class="text-sm text-gray-500">Documents validés</p>
          <p class="text-2xl font-bold text-green-600">{nbDocumentValide}</p>
        </div>
        <i class="ri-check-line text-green-600 text-2xl"></i>
      </div>
      <div
        class="bg-white rounded-2xl p-6 shadow-sm flex justify-between items-center border border-gray-100"
      >
        <div>
          <p class="text-sm text-gray-500">En attente</p>
          <p class="text-2xl font-bold text-yellow-600">{nbWaitingDocument}</p>
        </div>
        <i class="ri-time-line text-yellow-600 text-2xl"></i>
      </div>
      <div
        class="bg-white rounded-2xl p-6 shadow-sm flex justify-between items-center border border-gray-100"
      >
        <div>
          <p class="text-sm text-gray-500">Paiements</p>
          <p class="text-2xl font-bold text-blue-600">{nbPayment}</p>
        </div>
        <i class="ri-bank-card-line text-blue-600 text-2xl"></i>
      </div>
      <div
        class="bg-white rounded-2xl p-6 shadow-sm flex justify-between items-center border border-gray-100"
      >
        <div>
          <p class="text-sm text-gray-500">Messages</p>
          <p class="text-2xl font-bold text-purple-600">{notificationCount}</p>
        </div>
        <i class="ri-message-line text-purple-600 text-2xl"></i>
      </div>
    </section>

    <!-- Section Cards avec gestion expiration -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
      {#if isLoad}
        <!-- Skeleton loader -->
        {#each Array(6) as _, i}
          <div
            class="bg-gray-100 rounded-2xl p-6 animate-pulse"
            style="animation-delay: {i * 0.08}s"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="w-12 h-12 rounded-xl bg-gray-300"></div>
              <div class="w-16 h-6 rounded-full bg-gray-300"></div>
            </div>
            <div class="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-300 rounded w-full"></div>
          </div>
        {/each}
      {:else}
        {#each cards as card, i}
          {#if card.isProtected && expire}
            <!-- Card grisée et verrouillée -->
            <div
              class="relative cursor-not-allowed bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl border border-gray-200 shadow-sm p-6 opacity-60 animate-fadeIn"
              style="animation-delay: {i * 0.08}s"
            >
              <div class="flex items-start justify-between mb-4">
                <div
                  class="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center"
                >
                  <i class="{card.icon} text-2xl text-gray-400"></i>
                </div>
                <div class="flex items-center gap-2">
                  {#if card.badge}
                    <span
                      class="text-xs px-3 py-1 rounded-full font-medium bg-gray-200 text-gray-500"
                    >
                      {card.badge}
                    </span>
                  {/if}
                  <i class="ri-lock-line text-gray-400 text-xl"></i>
                </div>
              </div>
              <h3 class="text-lg font-semibold text-gray-500 mb-1">
                {card.title}
              </h3>
              <p class="text-sm text-gray-400">{card.description}</p>

              <!-- Overlay avec message -->
              <div
                class="absolute inset-0 flex items-center justify-center bg-gray-900/5 rounded-2xl"
              >
                <div class="text-center">
                  <i class="ri-lock-line text-gray-400 text-3xl mb-2"></i>
                  <p class="text-xs text-gray-600 font-medium">
                    Abonnement requis
                  </p>
                </div>
              </div>
            </div>
          {:else}
            <!-- Card normale et accessible -->
            <div
              on:click={() => (window.location.href = card.link)}
              class="cursor-pointer bg-gradient-to-br {card.color} rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 p-6 group animate-fadeIn"
              style="animation-delay: {i * 0.08}s"
            >
              <div class="flex items-start justify-between mb-4">
                <div
                  class="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center group-hover:scale-110 transition-transform"
                >
                  <i class="{card.icon} text-2xl text-blue-600"></i>
                </div>
                {#if card.badge}
                  <span
                    class="text-xs px-3 py-1 rounded-full font-medium {card.badgeColor}"
                  >
                    {card.badge}
                  </span>
                {/if}
              </div>
              <h3
                class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1"
              >
                {card.title}
              </h3>
              <p class="text-sm text-gray-600">{card.description}</p>
            </div>
          {/if}
        {/each}
      {/if}
    </section>

    <!-- Activité récente -->
    <section
      class="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 animate-fadeIn"
    >
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-semibold text-gray-900">Activité récente</h3>
        <a href="#" class="text-sm font-medium text-blue-600 hover:underline"
          >Voir tout</a
        >
      </div>

      <div class="space-y-5">
        {#if notificationCount === 0}
          <p class="text-gray-600 text-center">Aucune activité récente.</p>
        {:else}
          {#each notifications as notification}
            <div
              class="flex items-start gap-3 border-l-4 border-green-400 pl-3"
            >
              <i class="ri-check-line text-green-500 mt-1"></i>
              <div>
                <p class="font-medium text-gray-800">
                  {notification.title || "Note Informative"}
                </p>
                <p class="text-sm text-gray-600">{notification.libelle}</p>
                <p class="text-xs text-gray-400 mt-1">
                  {notification.createdAt}
                </p>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </section>
  </section>

  <FooterNew />
</main>

<style>
  @import url("https://cdn.jsdelivr.net/npm/remixicon@4.6.0/fonts/remixicon.css");

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.6s ease forwards;
  }
</style>
