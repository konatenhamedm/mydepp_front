<script>
  import FooterNew from "$components/_includes/FooterNew.svelte";
  import HeaderNew from "$components/_includes/HeaderNew.svelte";
  import { CookieManager } from "$lib/auth";
  import axios from "axios";
  import { onMount } from "svelte";

  let isAuth = false;
  let totalNotif = 0;
  let userData = null;
  const checkLogin = () => {
    const token = CookieManager.get("auth");
    userData = token;
    isAuth = !!token;
  };

  const countNotif =async () => {
    await axios.get("http://backend.leadagro.net/api/notification/by/" + userData.id)
     .then(response => {
       response.data.data.forEach(element => {
        if(!element.isRead){
          totalNotif +=1;
        }
       });
       
     })
     .catch(error => {
       console.error("Error fetching notifications:", error);
     });  
  };

onMount(() => {
    checkLogin();
    if (isAuth) {
      countNotif();
    }
  });
</script>
<main>
    <HeaderNew />
    <div
      class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16"
      style="background-image: linear-gradient(to bottom right, #eff6ff, #fff, #faf5ff); min-height: 100vh;"
    >
    <!-- Header apres connexion, a reprendre -->
      <!-- <div class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center space-x-4">
              <a
                class="flex items-center space-x-2"
                href="/preview/9742213d-fe1d-4d27-aba4-f4ac9a2c4158/3062495"
                ><div
                  class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"
                >
                  <div class="w-4 h-4 flex items-center justify-center">
                    <i class="ri-hospital-line text-white text-sm"></i>
                  </div>
                </div>
                <span class="font-['Pacifico'] text-xl text-blue-600"
                  >E-DEPPS</span
                ></a
              >
            </div>
            <div class="flex items-center space-x-6">
              <div class="flex items-center space-x-2">
                <div
                  class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <div class="w-4 h-4 flex items-center justify-center">
                    <i class="ri-building-line text-blue-600"></i>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900">
                    Clinique de la Santé
                  </p>
                  <p class="text-xs text-gray-500">ÉTABLISSEMENT DE SANTÉ</p>
                </div>
              </div>
              <div
                class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer"
              >
                <div class="w-5 h-5 flex items-center justify-center">
                  <i class="ri-user-line text-gray-600"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> -->
      <main>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="mb-8">
            <div
              class="bg-white rounded-2xl shadow-lg p-8 border border-blue-100"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h1 class="text-3xl font-bold text-gray-900 mb-2">
                    Bienvenue sur la plateforme MYDEPPS
                  </h1>
                  <p class="text-lg text-gray-600 mb-4">
                    Gérez facilement vos démarches administratives et suivez
                    l'état de vos dossiers
                  </p>
                  <div
                    class="flex items-center space-x-6 text-sm text-gray-500"
                  >
                    <div class="flex items-center space-x-2">
                      <div class="w-4 h-4 flex items-center justify-center">
                        <i class="ri-building-line"></i>
                      </div>
                      <span>{(userData?.type).toLowerCase()} de  Santé</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="w-4 h-4 flex items-center justify-center">
                        <i class="ri-map-pin-line"></i>
                      </div>
                      <span>Côte d'Ivoire</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="w-4 h-4 flex items-center justify-center">
                        <i class="ri-calendar-line"></i>
                      </div>
                      <span>Inscrit depuis N/A</span>
                    </div>
                  </div>
                </div>
                <div class="hidden lg:block">
                  <div
                    class="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center"
                  >
                    <div class="w-16 h-16 flex items-center justify-center">
                      <i class="ri-dashboard-line text-white text-4xl"></i>
                      
                      <h1>Avatar</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            <div
            onclick="{() => window.location.href = '/dashboard/mon_dossier'}"
              class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
            >
              <div class="flex items-start justify-between mb-4">
                <div
                  class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                >
                  <div class="w-6 h-6 flex items-center justify-center">
                    <i class="ri-folder-line text-blue-600 text-xl"></i>
                  </div>
                </div>
                <span
                  class="text-xs px-3 py-1 rounded-full font-medium bg-green-100 text-green-800 border-green-200"
                  >À jour</span
                >
              </div>
              <h3
                class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors"
              >
                Mise à jour du dossier
              </h3>
              <p class="text-gray-600 text-sm leading-relaxed">
                Mettre à jour vos informations
              </p>
              <div
                class="mt-4 flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <span>Accéder</span>
                <div class="w-4 h-4 flex items-center justify-center ml-1">
                  <i class="ri-arrow-right-line"></i>
                </div>
              </div>
            </div>
            <div
             onclick="{() => window.location.href = '/dashboard/alerts'}"
              class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
            >
              <div class="flex items-start justify-between mb-4">
                <div
                  class="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                >
                  <div class="w-6 h-6 flex items-center justify-center">
                    <i class="ri-notification-line text-orange-600 text-xl"></i>
                  </div>
                </div>
                <span
                  class="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium"
                  >{totalNotif}</span
                >
              </div>
              <h3
                class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors"
              >
                Alertes
              </h3>
              <p class="text-gray-600 text-sm leading-relaxed">
                Notifications importantes
              </p>
              <div
                class="mt-4 flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <span>Accéder</span>
                <div class="w-4 h-4 flex items-center justify-center ml-1">
                  <i class="ri-arrow-right-line"></i>
                </div>
              </div>
            </div>
            <div
             onclick="{() => window.location.href = '/dashboard/suivi_dossier'}"
              class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
            >
              <div class="flex items-start justify-between mb-4">
                <div
                  class="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                >
                  <div class="w-6 h-6 flex items-center justify-center">
                    <i class="ri-file-list-line text-green-600 text-xl"></i>
                  </div>
                </div>
                <span
                  class="text-xs px-3 py-1 rounded-full font-medium bg-green-100 text-green-800 border-green-200"
                  >En cours</span
                >
              </div>
              <h3
                class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors"
              >
                Suivi de mon dossier
              </h3>
              <p class="text-gray-600 text-sm leading-relaxed">
                État d'avancement du dossier
              </p>
              <div
                class="mt-4 flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <span>Accéder</span>
                <div class="w-4 h-4 flex items-center justify-center ml-1">
                  <i class="ri-arrow-right-line"></i>
                </div>
              </div>
            </div>
            <div
             onclick="{() => window.location.href = '/dashboard/historique_payment'}"
              class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
            >
              <div class="flex items-start justify-between mb-4">
                <div
                  class="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                >
                  <div class="w-6 h-6 flex items-center justify-center">
                    <i class="ri-file-text-line text-purple-600 text-xl"></i>
                  </div>
                </div>
              </div>
              <h3
                class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors"
              >
                Historique paiements
              </h3>
              <p class="text-gray-600 text-sm leading-relaxed">
                Consulter vos paiements
              </p>
              <div
                class="mt-4 flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <span>Accéder</span>
                <div class="w-4 h-4 flex items-center justify-center ml-1">
                  <i class="ri-arrow-right-line"></i>
                </div>
              </div>
            </div>
            <div
             onclick="{() => window.location.href = '/dashboard/documentheque'}"
              class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
            >
              <div class="flex items-start justify-between mb-4">
                <div
                  class="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                >
                  <div class="w-6 h-6 flex items-center justify-center">
                    <i class="ri-file-pdf-line text-red-600 text-xl"></i>
                  </div>
                </div>
                <span
                  class="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium"
                  >12</span
                >
              </div>
              <h3
                class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors"
              >
                Documenthèque
              </h3>
              <p class="text-gray-600 text-sm leading-relaxed">
                Accéder aux documents
              </p>
              <div
                class="mt-4 flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <span>Accéder</span>
                <div class="w-4 h-4 flex items-center justify-center ml-1">
                  <i class="ri-arrow-right-line"></i>
                </div>
              </div>
            </div>
            <div
             onclick="{() => window.location.href = '/dashboard/forum'}"
              class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
            >
              <div class="flex items-start justify-between mb-4">
                <div
                  class="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                >
                  <div class="w-6 h-6 flex items-center justify-center">
                    <i class="ri-group-line text-indigo-600 text-xl"></i>
                  </div>
                </div>
                <span
                  class="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium"
                  >5</span
                >
              </div>
              <h3
                class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors"
              >
                Forum
              </h3>
              <p class="text-gray-600 text-sm leading-relaxed">
                Échanger avec la communauté
              </p>
              <div
                class="mt-4 flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <span>Accéder</span>
                <div class="w-4 h-4 flex items-center justify-center ml-1">
                  <i class="ri-arrow-right-line"></i>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div
              class="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">
                    Documents validés
                  </p>
                  <p class="text-2xl font-bold text-green-600">8</p>
                </div>
                <div
                  class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                >
                  <div class="w-5 h-5 flex items-center justify-center">
                    <i class="ri-check-circle-line text-green-600"></i>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">En attente</p>
                  <p class="text-2xl font-bold text-yellow-600">2</p>
                </div>
                <div
                  class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center"
                >
                  <div class="w-5 h-5 flex items-center justify-center">
                    <i class="ri-time-line text-yellow-600"></i>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Paiements</p>
                  <p class="text-2xl font-bold text-blue-600">3</p>
                </div>
                <div
                  class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                >
                  <div class="w-5 h-5 flex items-center justify-center">
                    <i class="ri-bank-card-line text-blue-600"></i>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Messages</p>
                  <p class="text-2xl font-bold text-purple-600">5</p>
                </div>
                <div
                  class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
                >
                  <div class="w-5 h-5 flex items-center justify-center">
                    <i class="ri-message-line text-purple-600"></i>
                  </div>
                </div>
              </div>
            </div>
          </div> -->
          <!-- <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-semibold text-gray-900">
                Activité récente
              </h3>
              <a
                class="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
                href="/dashboard"
                >Voir tout</a
              >
            </div>
            <div class="space-y-4">
              <div
                class="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border border-green-100"
              >
                <div
                  class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-0.5"
                >
                  <div class="w-4 h-4 flex items-center justify-center">
                    <i class="ri-check-line text-green-600"></i>
                  </div>
                </div>
                <div class="flex-1">
                  <p class="font-medium text-green-900">Document validé</p>
                  <p class="text-green-700 text-sm">
                    Votre certificat d'assurance a été approuvé
                  </p>
                  <p class="text-green-600 text-xs mt-1">Il y a 2 heures</p>
                </div>
              </div>
              <div
                class="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-100"
              >
                <div
                  class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-0.5"
                >
                  <div class="w-4 h-4 flex items-center justify-center">
                    <i class="ri-upload-line text-blue-600"></i>
                  </div>
                </div>
                <div class="flex-1">
                  <p class="font-medium text-blue-900">
                    Nouveau document ajouté
                  </p>
                  <p class="text-blue-700 text-sm">
                    Justificatif de domicile téléchargé
                  </p>
                  <p class="text-blue-600 text-xs mt-1">Il y a 1 jour</p>
                </div>
              </div>
              <div
                class="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100"
              >
                <div
                  class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mt-0.5"
                >
                  <div class="w-4 h-4 flex items-center justify-center">
                    <i class="ri-alert-line text-yellow-600"></i>
                  </div>
                </div>
                <div class="flex-1">
                  <p class="font-medium text-yellow-900">Action requise</p>
                  <p class="text-yellow-700 text-sm">
                    Veuillez mettre à jour vos informations de contact
                  </p>
                  <p class="text-yellow-600 text-xs mt-1">Il y a 3 jours</p>
                </div>
              </div>
            </div>
          </div> -->
        </div>
      </main>
    </div>
    <FooterNew />

</main>

<style>

    @import url("https://cdn.jsdelivr.net/npm/remixicon@4.6.0/fonts/remixicon.css");
*,
:after,
:before {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x: ;
  --tw-pan-y: ;
  --tw-pinch-zoom: ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position: ;
  --tw-gradient-via-position: ;
  --tw-gradient-to-position: ;
  --tw-ordinal: ;
  --tw-slashed-zero: ;
  --tw-numeric-figure: ;
  --tw-numeric-spacing: ;
  --tw-numeric-fraction: ;
  --tw-ring-inset: ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246/0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur: ;
  --tw-brightness: ;
  --tw-contrast: ;
  --tw-grayscale: ;
  --tw-hue-rotate: ;
  --tw-invert: ;
  --tw-saturate: ;
  --tw-sepia: ;
  --tw-drop-shadow: ;
  --tw-backdrop-blur: ;
  --tw-backdrop-brightness: ;
  --tw-backdrop-contrast: ;
  --tw-backdrop-grayscale: ;
  --tw-backdrop-hue-rotate: ;
  --tw-backdrop-invert: ;
  --tw-backdrop-opacity: ;
  --tw-backdrop-saturate: ;
  --tw-backdrop-sepia: ;
  --tw-contain-size: ;
  --tw-contain-layout: ;
  --tw-contain-paint: ;
  --tw-contain-style: ;
}
::backdrop {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x: ;
  --tw-pan-y: ;
  --tw-pinch-zoom: ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position: ;
  --tw-gradient-via-position: ;
  --tw-gradient-to-position: ;
  --tw-ordinal: ;
  --tw-slashed-zero: ;
  --tw-numeric-figure: ;
  --tw-numeric-spacing: ;
  --tw-numeric-fraction: ;
  --tw-ring-inset: ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246/0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur: ;
  --tw-brightness: ;
  --tw-contrast: ;
  --tw-grayscale: ;
  --tw-hue-rotate: ;
  --tw-invert: ;
  --tw-saturate: ;
  --tw-sepia: ;
  --tw-drop-shadow: ;
  --tw-backdrop-blur: ;
  --tw-backdrop-brightness: ;
  --tw-backdrop-contrast: ;
  --tw-backdrop-grayscale: ;
  --tw-backdrop-hue-rotate: ;
  --tw-backdrop-invert: ;
  --tw-backdrop-opacity: ;
  --tw-backdrop-saturate: ;
  --tw-backdrop-sepia: ;
  --tw-contain-size: ;
  --tw-contain-layout: ;
  --tw-contain-paint: ;
  --tw-contain-style: ;
}
/*
! tailwindcss v3.4.17 | MIT License | https://tailwindcss.com
*/
*,
:after,
:before {
  box-sizing: border-box;
  border: 0 solid #e5e7eb;
}
:after,
:before {
  --tw-content: "";
}
:host,
html {
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  -moz-tab-size: 4;
  -o-tab-size: 4;
  tab-size: 4;
  font-family: ui-sans-serif, system-ui, sans-serif, Apple Color Emoji,
    Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  font-feature-settings: normal;
  font-variation-settings: normal;
  -webkit-tap-highlight-color: transparent;
}
body {
  margin: 0;
  line-height: inherit;
}
hr {
  height: 0;
  color: inherit;
  border-top-width: 1px;
}
abbr:where([title]) {
  -webkit-text-decoration: underline dotted;
  text-decoration: underline dotted;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: inherit;
  font-weight: inherit;
}
a {
  color: inherit;
  text-decoration: inherit;
}
b,
strong {
  font-weight: bolder;
}
code,
kbd,
pre,
samp {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    Liberation Mono, Courier New, monospace;
  font-feature-settings: normal;
  font-variation-settings: normal;
  font-size: 1em;
}
small {
  font-size: 80%;
}
sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}
sub {
  bottom: -0.25em;
}
sup {
  top: -0.5em;
}
table {
  text-indent: 0;
  border-color: inherit;
  border-collapse: collapse;
}
button,
input,
optgroup,
select,
textarea {
  font-family: inherit;
  font-feature-settings: inherit;
  font-variation-settings: inherit;
  font-size: 100%;
  font-weight: inherit;
  line-height: inherit;
  letter-spacing: inherit;
  color: inherit;
  margin: 0;
  padding: 0;
}
button,
select {
  text-transform: none;
}
button,
input:where([type="button"]),
input:where([type="reset"]),
input:where([type="submit"]) {
  -webkit-appearance: button;
  background-color: transparent;
  background-image: none;
}
:-moz-focusring {
  outline: auto;
}
:-moz-ui-invalid {
  box-shadow: none;
}
progress {
  vertical-align: baseline;
}
::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
  height: auto;
}
[type="search"] {
  -webkit-appearance: textfield;
  outline-offset: -2px;
}
::-webkit-search-decoration {
  -webkit-appearance: none;
}
::-webkit-file-upload-button {
  -webkit-appearance: button;
  font: inherit;
}
summary {
  display: list-item;
}
blockquote,
dd,
dl,
figure,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
p,
pre {
  margin: 0;
}
fieldset {
  margin: 0;
}
fieldset,
legend {
  padding: 0;
}
menu,
ol,
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
dialog {
  padding: 0;
}
textarea {
  resize: vertical;
}
input::-moz-placeholder,
textarea::-moz-placeholder {
  opacity: 1;
  color: #9ca3af;
}
input::placeholder,
textarea::placeholder {
  opacity: 1;
  color: #9ca3af;
}
[role="button"],
button {
  cursor: pointer;
}
:disabled {
  cursor: default;
}
audio,
canvas,
embed,
iframe,
img,
object,
svg,
video {
  display: block;
  vertical-align: middle;
}
img,
video {
  max-width: 100%;
  height: auto;
}
[hidden]:where(:not([hidden="until-found"])) {
  display: none;
}
.absolute {
  position: absolute;
}
.relative {
  position: relative;
}
.-right-1 {
  right: -0.25rem;
}
.-right-2 {
  right: -0.5rem;
}
.-top-1 {
  top: -0.25rem;
}
.-top-2 {
  top: -0.5rem;
}
.right-0 {
  right: 0;
}
.z-50 {
  z-index: 50;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
.mb-1 {
  margin-bottom: 0.25rem;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
.mb-6 {
  margin-bottom: 1.5rem;
}
.mb-8 {
  margin-bottom: 2rem;
}
.ml-1 {
  margin-left: 0.25rem;
}
.mt-0\.5 {
  margin-top: 0.125rem;
}
.mt-1 {
  margin-top: 0.25rem;
}
.mt-2 {
  margin-top: 0.5rem;
}
.mt-4 {
  margin-top: 1rem;
}
.mt-6 {
  margin-top: 1.5rem;
}
.mt-8 {
  margin-top: 2rem;
}
.flex {
  display: flex;
}
.grid {
  display: grid;
}
.hidden {
  display: none;
}
.h-10 {
  height: 2.5rem;
}
.h-12 {
  height: 3rem;
}
.h-16 {
  height: 4rem;
}
.h-32 {
  height: 8rem;
}
.h-4 {
  height: 1rem;
}
.h-5 {
  height: 1.25rem;
}
.h-6 {
  height: 1.5rem;
}
.h-8 {
  height: 2rem;
}
.h-screen {
  height: 100vh;
}
.max-h-64 {
  max-height: 16rem;
}
.min-h-screen {
  min-height: 100vh;
}
.w-10 {
  width: 2.5rem;
}
.w-12 {
  width: 3rem;
}
.w-16 {
  width: 4rem;
}
.w-32 {
  width: 8rem;
}
.w-4 {
  width: 1rem;
}
.w-5 {
  width: 1.25rem;
}
.w-6 {
  width: 1.5rem;
}
.w-8 {
  width: 2rem;
}
.w-80 {
  width: 20rem;
}
.w-full {
  width: 100%;
}
.min-w-0 {
  min-width: 0;
}
.max-w-7xl {
  max-width: 80rem;
}
.flex-1 {
  flex: 1 1 0%;
}
.cursor-pointer {
  cursor: pointer;
}
.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
.flex-col {
  flex-direction: column;
}
.items-start {
  align-items: flex-start;
}
.items-center {
  align-items: center;
}
.justify-center {
  justify-content: center;
}
.justify-between {
  justify-content: space-between;
}
.gap-4 {
  gap: 1rem;
}
.gap-6 {
  gap: 1.5rem;
}
.gap-8 {
  gap: 2rem;
}
.space-x-2 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(0.5rem * var(--tw-space-x-reverse));
  margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));
}
.space-x-3 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(0.75rem * var(--tw-space-x-reverse));
  margin-left: calc(0.75rem * calc(1 - var(--tw-space-x-reverse)));
}
.space-x-4 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(1rem * var(--tw-space-x-reverse));
  margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));
}
.space-x-6 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(1.5rem * var(--tw-space-x-reverse));
  margin-left: calc(1.5rem * calc(1 - var(--tw-space-x-reverse)));
}
.space-x-8 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(2rem * var(--tw-space-x-reverse));
  margin-left: calc(2rem * calc(1 - var(--tw-space-x-reverse)));
}
.space-y-3 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.75rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.75rem * var(--tw-space-y-reverse));
}
.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1rem * var(--tw-space-y-reverse));
}
.overflow-y-auto {
  overflow-y: auto;
}
.rounded-2xl {
  border-radius: 1rem;
}
.rounded-full {
  border-radius: 9999px;
}
.rounded-lg {
  border-radius: 0.5rem;
}
.rounded-xl {
  border-radius: 0.75rem;
}
.border {
  border-width: 1px;
}
.border-2 {
  border-width: 2px;
}
.border-b {
  border-bottom-width: 1px;
}
.border-t {
  border-top-width: 1px;
}
.border-blue-100 {
  --tw-border-opacity: 1;
  border-color: rgb(219 234 254 / var(--tw-border-opacity, 1));
}
.border-gray-100 {
  --tw-border-opacity: 1;
  border-color: rgb(243 244 246 / var(--tw-border-opacity, 1));
}
.border-gray-200 {
  --tw-border-opacity: 1;
  border-color: rgb(229 231 235 / var(--tw-border-opacity, 1));
}
.border-green-100 {
  --tw-border-opacity: 1;
  border-color: rgb(220 252 231 / var(--tw-border-opacity, 1));
}
.border-green-200 {
  --tw-border-opacity: 1;
  border-color: rgb(187 247 208 / var(--tw-border-opacity, 1));
}
.border-yellow-100 {
  --tw-border-opacity: 1;
  border-color: rgb(254 249 195 / var(--tw-border-opacity, 1));
}
.bg-blue-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(219 234 254 / var(--tw-bg-opacity, 1));
}
.bg-blue-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(239 246 255 / var(--tw-bg-opacity, 1));
}
.bg-blue-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(59 130 246 / var(--tw-bg-opacity, 1));
}
.bg-blue-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(37 99 235 / var(--tw-bg-opacity, 1));
}
.bg-gray-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(229 231 235 / var(--tw-bg-opacity, 1));
}
.bg-gray-300 {
  --tw-bg-opacity: 1;
  background-color: rgb(209 213 219 / var(--tw-bg-opacity, 1));
}
.bg-gray-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(249 250 251 / var(--tw-bg-opacity, 1));
}
.bg-green-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(220 252 231 / var(--tw-bg-opacity, 1));
}
.bg-green-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(240 253 244 / var(--tw-bg-opacity, 1));
}
.bg-green-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(34 197 94 / var(--tw-bg-opacity, 1));
}
.bg-indigo-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(238 242 255 / var(--tw-bg-opacity, 1));
}
.bg-indigo-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(99 102 241 / var(--tw-bg-opacity, 1));
}
.bg-orange-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(255 237 213 / var(--tw-bg-opacity, 1));
}
.bg-orange-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(255 247 237 / var(--tw-bg-opacity, 1));
}
.bg-orange-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(249 115 22 / var(--tw-bg-opacity, 1));
}
.bg-purple-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(243 232 255 / var(--tw-bg-opacity, 1));
}
.bg-purple-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(250 245 255 / var(--tw-bg-opacity, 1));
}
.bg-purple-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(168 85 247 / var(--tw-bg-opacity, 1));
}
.bg-red-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 226 226 / var(--tw-bg-opacity, 1));
}
.bg-red-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 242 242 / var(--tw-bg-opacity, 1));
}
.bg-red-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(239 68 68 / var(--tw-bg-opacity, 1));
}
.bg-white {
  --tw-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity, 1));
}
.bg-yellow-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 249 195 / var(--tw-bg-opacity, 1));
}
.bg-yellow-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 252 232 / var(--tw-bg-opacity, 1));
}
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}
.from-blue-400 {
  --tw-gradient-from: #60a5fa var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(96 165 250/0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
.from-blue-50 {
  --tw-gradient-from: #eff6ff var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(239 246 255/0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
.via-white {
  --tw-gradient-to: rgb(255 255 255/0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from),
    #fff var(--tw-gradient-via-position), var(--tw-gradient-to);
}
.to-indigo-100 {
  --tw-gradient-to: #e0e7ff var(--tw-gradient-to-position);
}
.to-purple-50 {
  --tw-gradient-to: #faf5ff var(--tw-gradient-to-position);
}
.to-purple-500 {
  --tw-gradient-to: #a855f7 var(--tw-gradient-to-position);
}
.p-2 {
  padding: 0.5rem;
}
.p-3 {
  padding: 0.75rem;
}
.p-4 {
  padding: 1rem;
}
.p-6 {
  padding: 1.5rem;
}
.p-8 {
  padding: 2rem;
}
.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}
.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}
.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}
.pt-4 {
  padding-top: 1rem;
}
.text-center {
  text-align: center;
}
.text-right {
  text-align: right;
}
.font-\[\'Pacifico\'\] {
  font-family: Pacifico;
}
.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}
.text-3xl {
  font-size: 1.875rem;
  line-height: 2.25rem;
}
.text-4xl {
  font-size: 2.25rem;
  line-height: 2.5rem;
}
.text-5xl {
  font-size: 3rem;
  line-height: 1;
}
.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}
.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}
.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}
.font-bold {
  font-weight: 700;
}
.font-medium {
  font-weight: 500;
}
.font-semibold {
  font-weight: 600;
}
.leading-relaxed {
  line-height: 1.625;
}
.text-blue-600 {
  --tw-text-opacity: 1;
  color: rgb(37 99 235 / var(--tw-text-opacity, 1));
}
.text-blue-700 {
  --tw-text-opacity: 1;
  color: rgb(29 78 216 / var(--tw-text-opacity, 1));
}
.text-blue-900 {
  --tw-text-opacity: 1;
  color: rgb(30 58 138 / var(--tw-text-opacity, 1));
}
.text-gray-100 {
  --tw-text-opacity: 1;
  color: rgb(243 244 246 / var(--tw-text-opacity, 1));
}
.text-gray-500 {
  --tw-text-opacity: 1;
  color: rgb(107 114 128 / var(--tw-text-opacity, 1));
}
.text-gray-600 {
  --tw-text-opacity: 1;
  color: rgb(75 85 99 / var(--tw-text-opacity, 1));
}
.text-gray-700 {
  --tw-text-opacity: 1;
  color: rgb(55 65 81 / var(--tw-text-opacity, 1));
}
.text-gray-900 {
  --tw-text-opacity: 1;
  color: rgb(17 24 39 / var(--tw-text-opacity, 1));
}
.text-green-600 {
  --tw-text-opacity: 1;
  color: rgb(22 163 74 / var(--tw-text-opacity, 1));
}
.text-green-700 {
  --tw-text-opacity: 1;
  color: rgb(21 128 61 / var(--tw-text-opacity, 1));
}
.text-green-800 {
  --tw-text-opacity: 1;
  color: rgb(22 101 52 / var(--tw-text-opacity, 1));
}
.text-green-900 {
  --tw-text-opacity: 1;
  color: rgb(20 83 45 / var(--tw-text-opacity, 1));
}
.text-indigo-600 {
  --tw-text-opacity: 1;
  color: rgb(79 70 229 / var(--tw-text-opacity, 1));
}
.text-orange-600 {
  --tw-text-opacity: 1;
  color: rgb(234 88 12 / var(--tw-text-opacity, 1));
}
.text-purple-600 {
  --tw-text-opacity: 1;
  color: rgb(147 51 234 / var(--tw-text-opacity, 1));
}
.text-red-600 {
  --tw-text-opacity: 1;
  color: rgb(220 38 38 / var(--tw-text-opacity, 1));
}
.text-white {
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity, 1));
}
.text-yellow-600 {
  --tw-text-opacity: 1;
  color: rgb(202 138 4 / var(--tw-text-opacity, 1));
}
.text-yellow-700 {
  --tw-text-opacity: 1;
  color: rgb(161 98 7 / var(--tw-text-opacity, 1));
}
.text-yellow-900 {
  --tw-text-opacity: 1;
  color: rgb(113 63 18 / var(--tw-text-opacity, 1));
}
.antialiased {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.opacity-0 {
  opacity: 0;
}
.shadow-lg {
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0/0.1), 0 4px 6px -4px rgb(0 0 0/0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color),
    0 4px 6px -4px var(--tw-shadow-color);
}
.shadow-lg,
.shadow-sm {
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
    var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-sm {
  --tw-shadow: 0 1px 2px 0 rgb(0 0 0/0.05);
  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
}
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 0.15s;
}
.transition-colors {
  transition-property: color, background-color, border-color,
    text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 0.15s;
}
.transition-opacity {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 0.15s;
}
.transition-shadow {
  transition-property: box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 0.15s;
}
.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 0.15s;
}
.duration-200 {
  transition-duration: 0.2s;
}
.duration-300 {
  transition-duration: 0.3s;
}
.hover\:-translate-y-1:hover {
  --tw-translate-y: -0.25rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y))
    rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y))
    scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.hover\:border-blue-300:hover {
  --tw-border-opacity: 1;
  border-color: rgb(147 197 253 / var(--tw-border-opacity, 1));
}
.hover\:bg-blue-50:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(239 246 255 / var(--tw-bg-opacity, 1));
}
.hover\:bg-gray-50:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(249 250 251 / var(--tw-bg-opacity, 1));
}
.hover\:bg-white:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity, 1));
}
.hover\:text-blue-600:hover {
  --tw-text-opacity: 1;
  color: rgb(37 99 235 / var(--tw-text-opacity, 1));
}
.hover\:text-blue-700:hover {
  --tw-text-opacity: 1;
  color: rgb(29 78 216 / var(--tw-text-opacity, 1));
}
.hover\:shadow-md:hover {
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0/0.1), 0 2px 4px -2px rgb(0 0 0/0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color),
    0 2px 4px -2px var(--tw-shadow-color);
}
.hover\:shadow-md:hover,
.hover\:shadow-xl:hover {
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
    var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.hover\:shadow-xl:hover {
  --tw-shadow: 0 20px 25px -5px rgb(0 0 0/0.1), 0 8px 10px -6px rgb(0 0 0/0.1);
  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color),
    0 8px 10px -6px var(--tw-shadow-color);
}
.group:hover .group-hover\:scale-110 {
  --tw-scale-x: 1.1;
  --tw-scale-y: 1.1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y))
    rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y))
    scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.group:hover .group-hover\:text-blue-600 {
  --tw-text-opacity: 1;
  color: rgb(37 99 235 / var(--tw-text-opacity, 1));
}
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
@media (min-width: 640px) {
  .sm\:px-6 {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}
@media (min-width: 768px) {
  .md\:flex {
    display: flex;
  }
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .md\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .md\:text-2xl {
    font-size: 1.5rem;
    line-height: 2rem;
  }
  .md\:text-3xl {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }
  .md\:text-5xl {
    font-size: 3rem;
    line-height: 1;
  }
}
@media (min-width: 1024px) {
  .lg\:col-span-1 {
    grid-column: span 1 / span 1;
  }
  .lg\:col-span-2 {
    grid-column: span 2 / span 2;
  }
  .lg\:block {
    display: block;
  }
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .lg\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .lg\:px-8 {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}
@font-face {
  font-family: Pacifico;
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  unicode-range: u+0460-052f, u+1c80-1c8a, u+20b4, u+2de0-2dff, u+a640-a69f,
    u+fe2e-fe2f;
}
@font-face {
  font-family: Pacifico;
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  unicode-range: u+0301, u+0400-045f, u+0490-0491, u+04b0-04b1, u+2116;
}
@font-face {
  font-family: Pacifico;
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  unicode-range: u+0102-0103, u+0110-0111, u+0128-0129, u+0168-0169, u+01a0-01a1,
    u+01af-01b0, u+0300-0301, u+0303-0304, u+0308-0309, u+0323, u+0329,
    u+1ea0-1ef9, u+20ab;
}
@font-face {
  font-family: Pacifico;
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  unicode-range: u+0100-02ba, u+02bd-02c5, u+02c7-02cc, u+02ce-02d7, u+02dd-02ff,
    u+0304, u+0308, u+0329, u+1d00-1dbf, u+1e00-1e9f, u+1ef2-1eff, u+2020,
    u+20a0-20ab, u+20ad-20c0, u+2113, u+2c60-2c7f, u+a720-a7ff;
}
@font-face {
  font-family: Pacifico;
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  unicode-range: u+00??, u+0131, u+0152-0153, u+02bb-02bc, u+02c6, u+02da,
    u+02dc, u+0304, u+0308, u+0329, u+2000-206f, u+20ac, u+2122, u+2191, u+2193,
    u+2212, u+2215, u+feff, u+fffd;
}
@font-face {
  font-family: Pacifico Fallback;
  src: local("Arial");
  ascent-override: 137.32%;
  descent-override: 47.74%;
  line-gap-override: 0%;
  size-adjust: 94.89%;
}
.__className_9b37a1 {
  font-family: Pacifico, Pacifico Fallback;
  font-weight: 400;
  font-style: normal;
}
.__variable_9b37a1 {
  --font-pacifico: "Pacifico", "Pacifico Fallback";
}
@font-face {
  font-family: Geist;
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  unicode-range: u+0301, u+0400-045f, u+0490-0491, u+04b0-04b1, u+2116;
}
@font-face {
  font-family: Geist;
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  unicode-range: u+0100-02ba, u+02bd-02c5, u+02c7-02cc, u+02ce-02d7, u+02dd-02ff,
    u+0304, u+0308, u+0329, u+1d00-1dbf, u+1e00-1e9f, u+1ef2-1eff, u+2020,
    u+20a0-20ab, u+20ad-20c0, u+2113, u+2c60-2c7f, u+a720-a7ff;
}
@font-face {
  font-family: Geist;
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  unicode-range: u+00??, u+0131, u+0152-0153, u+02bb-02bc, u+02c6, u+02da,
    u+02dc, u+0304, u+0308, u+0329, u+2000-206f, u+20ac, u+2122, u+2191, u+2193,
    u+2212, u+2215, u+feff, u+fffd;
}
@font-face {
  font-family: Geist Fallback;
  src: local("Arial");
  ascent-override: 95.94%;
  descent-override: 28.16%;
  line-gap-override: 0%;
  size-adjust: 104.76%;
}
.__className_5bace4 {
  font-family: Geist, Geist Fallback;
  font-style: normal;
}
.__variable_5bace4 {
  --font-geist-sans: "Geist", "Geist Fallback";
}
@font-face {
  font-family: Geist Mono;
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  unicode-range: u+0301, u+0400-045f, u+0490-0491, u+04b0-04b1, u+2116;
}
@font-face {
  font-family: Geist Mono;
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  unicode-range: u+0100-02ba, u+02bd-02c5, u+02c7-02cc, u+02ce-02d7, u+02dd-02ff,
    u+0304, u+0308, u+0329, u+1d00-1dbf, u+1e00-1e9f, u+1ef2-1eff, u+2020,
    u+20a0-20ab, u+20ad-20c0, u+2113, u+2c60-2c7f, u+a720-a7ff;
}
@font-face {
  font-family: Geist Mono;
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  unicode-range: u+00??, u+0131, u+0152-0153, u+02bb-02bc, u+02c6, u+02da,
    u+02dc, u+0304, u+0308, u+0329, u+2000-206f, u+20ac, u+2122, u+2191, u+2193,
    u+2212, u+2215, u+feff, u+fffd;
}
@font-face {
  font-family: Geist Mono Fallback;
  src: local("Arial");
  ascent-override: 74.67%;
  descent-override: 21.92%;
  line-gap-override: 0%;
  size-adjust: 134.59%;
}
.__className_04d8b1 {
  font-family: Geist Mono, Geist Mono Fallback;
  font-style: normal;
}
.__variable_04d8b1 {
  --font-geist-mono: "Geist Mono", "Geist Mono Fallback";
}

</style>