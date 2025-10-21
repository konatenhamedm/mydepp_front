<script lang="ts">
  import HeaderNew from "$components/_includes/HeaderNew.svelte";
  import FooterNew from "$components/_includes/FooterNew.svelte";

  const cards = [
    {
      title: "Mise à jour du dossier",
      icon: "ri-folder-line",
      color: "from-blue-100 to-blue-50",
      badge: "À jour",
      badgeColor: "bg-green-100 text-green-700",
      link: "/dashboard/mon_dossier",
      description: "Mettre à jour vos informations"
    },
    {
      title: "Alertes",
      icon: "ri-notification-line",
      color: "from-orange-100 to-orange-50",
      badge: "3",
      badgeColor: "bg-red-500 text-white",
      link: "/dashboard/alerts",
      description: "Notifications importantes"
    },
    {
      title: "Suivi de mon dossier",
      icon: "ri-file-list-line",
      color: "from-green-100 to-green-50",
      badge: "En cours",
      badgeColor: "bg-green-100 text-green-700",
      link: "/dashboard/suivi_dossier",
      description: "État d'avancement du dossier"
    },
    {
      title: "Historique paiements",
      icon: "ri-bank-card-line",
      color: "from-indigo-100 to-indigo-50",
      link: "/dashboard/historique_payment",
      description: "Consulter vos paiements"
    },
    {
      title: "Documenthèque",
      icon: "ri-file-pdf-line",
      color: "from-red-100 to-red-50",
      badge: "12",
      badgeColor: "bg-red-500 text-white",
      link: "/dashboard/documentheque",
      description: "Accéder aux documents"
    },
    {
      title: "Forum",
      icon: "ri-group-line",
      color: "from-purple-100 to-purple-50",
      badge: "5",
      badgeColor: "bg-red-500 text-white",
      link: "/dashboard/forum",
      description: "Échanger avec la communauté"
    }
  ];
</script>

<main class="bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen flex flex-col">
  <HeaderNew />

  <!-- Conteneur principal plus large -->
  <section class="container max-w-7xl mx-auto px-6 lg:px-10 py-12  animate-fadeIn pt-20">
    <!-- Header de bienvenue -->
    <div class="bg-white shadow-md border border-blue-100 rounded-3xl p-8 mb-10 flex flex-col md:flex-row justify-between items-center">
      <div>
        <h1 class="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight mb-2">
          Bienvenue sur <span class="text-blue-600">MYDEPPS</span>
        </h1>
        <p class="text-gray-600 mb-4">
          Gérez vos démarches administratives et suivez l’évolution de vos dossiers.
        </p>
        <div class="flex flex-wrap gap-4 text-sm text-gray-500">
          <span class="flex items-center gap-2"><i class="ri-building-line"></i> Clinique de la Santé</span>
          <span class="flex items-center gap-2"><i class="ri-map-pin-line"></i> Toulouse</span>
          <span class="flex items-center gap-2"><i class="ri-calendar-line"></i> Inscrit depuis 10/01/2024</span>
        </div>
      </div>

      <div class="mt-6 md:mt-0 flex items-center justify-center">
        <div class="relative w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-xl">
          <i class="ri-hospital-line text-white text-5xl"></i>
          <div class="absolute -bottom-2 -right-2 bg-white text-blue-600 rounded-full shadow p-2">
            <i class="ri-building-2-line"></i>
          </div>
        </div>
      </div>
    </div>

    
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
      {#each cards as card, i}
        <div
          on:click={() => window.location.href = card.link}
          class="cursor-pointer bg-gradient-to-br {card.color} rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 p-6 group animate-fadeIn"
          style="animation-delay: {i * 0.08}s"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center group-hover:scale-110 transition-transform">
              <i class="{card.icon} text-2xl text-blue-600"></i>
            </div>
            {#if card.badge}
              <span class="text-xs px-3 py-1 rounded-full font-medium {card.badgeColor}">
                {card.badge}
              </span>
            {/if}
          </div>
          <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
            {card.title}
          </h3>
          <p class="text-sm text-gray-600">{card.description}</p>
        </div>
      {/each}
    </section>

    <!-- Section Synthèse -->
    <section class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
      <div class="bg-white rounded-2xl p-6 shadow-sm flex justify-between items-center border border-gray-100">
        <div>
          <p class="text-sm text-gray-500">Documents validés</p>
          <p class="text-2xl font-bold text-green-600">8</p>
        </div>
        <i class="ri-check-line text-green-600 text-2xl"></i>
      </div>
      <div class="bg-white rounded-2xl p-6 shadow-sm flex justify-between items-center border border-gray-100">
        <div>
          <p class="text-sm text-gray-500">En attente</p>
          <p class="text-2xl font-bold text-yellow-600">2</p>
        </div>
        <i class="ri-time-line text-yellow-600 text-2xl"></i>
      </div>
      <div class="bg-white rounded-2xl p-6 shadow-sm flex justify-between items-center border border-gray-100">
        <div>
          <p class="text-sm text-gray-500">Paiements</p>
          <p class="text-2xl font-bold text-blue-600">3</p>
        </div>
        <i class="ri-bank-card-line text-blue-600 text-2xl"></i>
      </div>
      <div class="bg-white rounded-2xl p-6 shadow-sm flex justify-between items-center border border-gray-100">
        <div>
          <p class="text-sm text-gray-500">Messages</p>
          <p class="text-2xl font-bold text-purple-600">5</p>
        </div>
        <i class="ri-message-line text-purple-600 text-2xl"></i>
      </div>
    </section>

    <!-- Activité récente -->
    <section class="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 animate-fadeIn">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-semibold text-gray-900">Activité récente</h3>
        <a href="#" class="text-sm font-medium text-blue-600 hover:underline">Voir tout</a>
      </div>

      <div class="space-y-5">
        <div class="flex items-start gap-3 border-l-4 border-green-400 pl-3">
          <i class="ri-check-line text-green-500 mt-1"></i>
          <div>
            <p class="font-medium text-gray-800">Document validé</p>
            <p class="text-sm text-gray-600">Certificat d’assurance approuvé</p>
            <p class="text-xs text-gray-400 mt-1">Il y a 2h</p>
          </div>
        </div>
        <div class="flex items-start gap-3 border-l-4 border-blue-400 pl-3">
          <i class="ri-upload-line text-blue-500 mt-1"></i>
          <div>
            <p class="font-medium text-gray-800">Nouveau document ajouté</p>
            <p class="text-sm text-gray-600">Justificatif de domicile téléchargé</p>
            <p class="text-xs text-gray-400 mt-1">Il y a 1 jour</p>
          </div>
        </div>
        <div class="flex items-start gap-3 border-l-4 border-yellow-400 pl-3">
          <i class="ri-alert-line text-yellow-500 mt-1"></i>
          <div>
            <p class="font-medium text-gray-800">Action requise</p>
            <p class="text-sm text-gray-600">Mettre à jour vos informations de contact</p>
            <p class="text-xs text-gray-400 mt-1">Il y a 3 jours</p>
          </div>
        </div>
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