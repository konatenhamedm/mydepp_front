<script>
  import FooterNew from "$components/_includes/FooterNew.svelte";
  import HeaderNew from "$components/_includes/HeaderNew.svelte";
  import { CookieManager } from "$lib/auth";
  import axios from "axios";
  import { onMount } from "svelte";
  let notification = [];
  let isAuth = false;
  let userData = null;
  const checkLogin = () => {
    const token = CookieManager.get("auth");
    userData = token;
    console.log("User data:", token);
    isAuth = !!token;
  };

  const getAllNotifications = async () => {
   await axios.get("https://backend.leadagro.net/api/notification/by/" + userData.id)
     .then(response => {
       notification = response.data.data;
       console.log("Notifications:", notification);
     })
     .catch(error => {
       console.error("Error fetching notifications:", error);
     });  
  };

  onMount(() => {
    checkLogin();
    if (isAuth) {
      getAllNotifications();
    }
  });
</script>

<main>
    <!-- <HeaderNew /> -->
    <div
      class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 "
    >
      <div class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <a
                class="text-blue-600 hover:text-blue-800 transition-colors"
                href="/dashboard"
                ><i class="ri-arrow-left-line text-xl"></i
              ></a>
              <div>
                <h1 class="text-2xl font-bold text-gray-900">Alertes</h1>
                <p class="text-gray-600">
                  Notifications importantes et mises à jour
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span
                class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                >{notification.length}
                reçues</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="space-y-4">
          {#if notification.length>0}
          {#each notification as note }
          <div
            class="bg-white rounded-xl shadow-sm border-l-4 p-6 hover:shadow-md transition-shadow border-l-blue-500"
          >
            <div class="flex items-start space-x-4">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center text-red-600 bg-red-50 border-red-200"
              >
                <i class="ri-error-warning-line text-lg"></i>
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-semibold text-gray-900">{note.libelle}</h3>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm text-gray-500">{note.createdAt}</span>
                    <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
                <p class="text-gray-600 leading-relaxed">
                  Votre certificat d'assurance expire dans 7 jours. Veuillez le
                  renouveler.
                </p>
                <div class="mt-4 flex space-x-3">
                  <button
                    class="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    Voir détails</button
                  ><button
                    class="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    Marquer comme lu
                  </button>
                </div>
              </div>
            </div>
          
          </div>
          {/each}
            <div class="mt-8 text-center">
          <button
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Marquer tout comme lu
          </button>
        </div>
          {:else}
          <div class="bg-white rounded-xl shadow-sm border-l-4 p-6 hover:shadow-md transition-shadow border-l-gray-300">
            <div class="flex items-start space-x-4">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 bg-gray-50 border-gray-200">
                <i class="ri-information-line text-lg"></i>
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-center mb-2">
                  <h1 class="font-semibold text-gray-700 text-xl">Aucune alerte</h1>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm text-gray-500">--</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/if}
          <!-- <div
            class="bg-white rounded-xl shadow-sm border-l-4 p-6 hover:shadow-md transition-shadow border-l-blue-500"
          >
            <div class="flex items-start space-x-4">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center text-blue-600 bg-blue-50 border-blue-200"
              >
                <i class="ri-information-line text-lg"></i>
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-semibold text-gray-900">
                    Mise à jour réglementaire
                  </h3>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm text-gray-500">2024-01-14</span>
                    <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
                <p class="text-gray-600 leading-relaxed">
                  Nouvelles directives concernant les protocoles de sécurité
                  sanitaire.
                </p>
                <div class="mt-4 flex space-x-3">
                  <button
                    class="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    Voir détails</button
                  ><button
                    class="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    Marquer comme lu
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            class="bg-white rounded-xl shadow-sm border-l-4 p-6 hover:shadow-md transition-shadow border-l-gray-300"
          >
            <div class="flex items-start space-x-4">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center text-yellow-600 bg-yellow-50 border-yellow-200"
              >
                <i class="ri-alert-line text-lg"></i>
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-semibold text-gray-700">
                    Paiement en attente
                  </h3>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm text-gray-500">2024-01-13</span>
                  </div>
                </div>
                <p class="text-gray-600 leading-relaxed">
                  Votre facture de janvier est en attente de règlement.
                </p>
                <div class="mt-4 flex space-x-3">
                  <button
                    class="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    Voir détails
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            class="bg-white rounded-xl shadow-sm border-l-4 p-6 hover:shadow-md transition-shadow border-l-gray-300"
          >
            <div class="flex items-start space-x-4">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center text-green-600 bg-green-50 border-green-200"
              >
                <i class="ri-check-line text-lg"></i>
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-semibold text-gray-700">
                    Validation effectuée
                  </h3>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm text-gray-500">2024-01-12</span>
                  </div>
                </div>
                <p class="text-gray-600 leading-relaxed">
                  Votre dossier de conformité a été validé avec succès.
                </p>
                <div class="mt-4 flex space-x-3">
                  <button
                    class="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    Voir détails
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            class="bg-white rounded-xl shadow-sm border-l-4 p-6 hover:shadow-md transition-shadow border-l-gray-300"
          >
            <div class="flex items-start space-x-4">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center text-blue-600 bg-blue-50 border-blue-200"
              >
                <i class="ri-information-line text-lg"></i>
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-semibold text-gray-700">
                    Formation disponible
                  </h3>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm text-gray-500">2024-01-11</span>
                  </div>
                </div>
                <p class="text-gray-600 leading-relaxed">
                  Nouvelle formation sur les protocoles d'urgence disponible.
                </p>
                <div class="mt-4 flex space-x-3">
                  <button
                    class="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    Voir détails
                  </button>
                </div>
              </div>
            </div>
          </div> -->
        </div>
      
      </div>
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
.pointer-events-none {
  pointer-events: none;
}
.absolute {
  position: absolute;
}
.relative {
  position: relative;
}
.inset-0 {
  inset: 0;
}
.inset-y-0 {
  top: 0;
  bottom: 0;
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
.left-0 {
  left: 0;
}
.left-3 {
  left: 0.75rem;
}
.right-0 {
  right: 0;
}
.top-1\/2 {
  top: 50%;
}
.z-50 {
  z-index: 50;
}
.mx-4 {
  margin-left: 1rem;
  margin-right: 1rem;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
.my-6 {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
.mb-1 {
  margin-bottom: 0.25rem;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.mb-3 {
  margin-bottom: 0.75rem;
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
.ml-2 {
  margin-left: 0.5rem;
}
.ml-4 {
  margin-left: 1rem;
}
.mr-1 {
  margin-right: 0.25rem;
}
.mr-2 {
  margin-right: 0.5rem;
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
.line-clamp-2 {
  -webkit-line-clamp: 2;
}
.line-clamp-2,
.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
.line-clamp-3 {
  -webkit-line-clamp: 3;
}
.block {
  display: block;
}
.flex {
  display: flex;
}
.table {
  display: table;
}
.grid {
  display: grid;
}
.hidden {
  display: none;
}
.h-1 {
  height: 0.25rem;
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
.h-2 {
  height: 0.5rem;
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
.h-full {
  height: 100%;
}
.h-screen {
  height: 100vh;
}
.max-h-64 {
  max-height: 16rem;
}
.min-h-\[calc\(100vh-4rem\)\] {
  min-height: calc(100vh - 4rem);
}
.min-h-screen {
  min-height: 100vh;
}
.w-0\.5 {
  width: 0.125rem;
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
.w-2 {
  width: 0.5rem;
}
.w-24 {
  width: 6rem;
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
.max-w-4xl {
  max-width: 56rem;
}
.max-w-6xl {
  max-width: 72rem;
}
.max-w-7xl {
  max-width: 80rem;
}
.max-w-md {
  max-width: 28rem;
}
.flex-1 {
  flex: 1 1 0%;
}
.flex-shrink-0 {
  flex-shrink: 0;
}
.-translate-y-1\/2 {
  --tw-translate-y: -50%;
}
.-translate-y-1\/2,
.transform {
  transform: translate(var(--tw-translate-x), var(--tw-translate-y))
    rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y))
    scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
@keyframes spin {
  to {
    transform: rotate(1turn);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
.cursor-pointer {
  cursor: pointer;
}
.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.flex-col {
  flex-direction: column;
}
.flex-wrap {
  flex-wrap: wrap;
}
.items-start {
  align-items: flex-start;
}
.items-center {
  align-items: center;
}
.justify-end {
  justify-content: flex-end;
}
.justify-center {
  justify-content: center;
}
.justify-between {
  justify-content: space-between;
}
.gap-2 {
  gap: 0.5rem;
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
.space-x-1 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(0.25rem * var(--tw-space-x-reverse));
  margin-left: calc(0.25rem * calc(1 - var(--tw-space-x-reverse)));
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
.space-y-1 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.25rem * var(--tw-space-y-reverse));
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
.space-y-6 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(1.5rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1.5rem * var(--tw-space-y-reverse));
}
.space-y-8 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(2rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(2rem * var(--tw-space-y-reverse));
}
.divide-y > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-y-reverse: 0;
  border-top-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));
  border-bottom-width: calc(1px * var(--tw-divide-y-reverse));
}
.divide-gray-100 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-opacity: 1;
  border-color: rgb(243 244 246 / var(--tw-divide-opacity, 1));
}
.overflow-hidden {
  overflow: hidden;
}
.overflow-x-auto {
  overflow-x: auto;
}
.overflow-y-auto {
  overflow-y: auto;
}
.whitespace-nowrap {
  white-space: nowrap;
}
.rounded {
  border-radius: 0.25rem;
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
.border-b-2 {
  border-bottom-width: 2px;
}
.border-l-4 {
  border-left-width: 4px;
}
.border-t {
  border-top-width: 1px;
}
.border-blue-100 {
  --tw-border-opacity: 1;
  border-color: rgb(219 234 254 / var(--tw-border-opacity, 1));
}
.border-blue-200 {
  --tw-border-opacity: 1;
  border-color: rgb(191 219 254 / var(--tw-border-opacity, 1));
}
.border-blue-500 {
  --tw-border-opacity: 1;
  border-color: rgb(59 130 246 / var(--tw-border-opacity, 1));
}
.border-gray-100 {
  --tw-border-opacity: 1;
  border-color: rgb(243 244 246 / var(--tw-border-opacity, 1));
}
.border-gray-200 {
  --tw-border-opacity: 1;
  border-color: rgb(229 231 235 / var(--tw-border-opacity, 1));
}
.border-gray-300 {
  --tw-border-opacity: 1;
  border-color: rgb(209 213 219 / var(--tw-border-opacity, 1));
}
.border-green-100 {
  --tw-border-opacity: 1;
  border-color: rgb(220 252 231 / var(--tw-border-opacity, 1));
}
.border-green-200 {
  --tw-border-opacity: 1;
  border-color: rgb(187 247 208 / var(--tw-border-opacity, 1));
}
.border-red-200 {
  --tw-border-opacity: 1;
  border-color: rgb(254 202 202 / var(--tw-border-opacity, 1));
}
.border-transparent {
  border-color: transparent;
}
.border-white {
  --tw-border-opacity: 1;
  border-color: rgb(255 255 255 / var(--tw-border-opacity, 1));
}
.border-yellow-100 {
  --tw-border-opacity: 1;
  border-color: rgb(254 249 195 / var(--tw-border-opacity, 1));
}
.border-yellow-200 {
  --tw-border-opacity: 1;
  border-color: rgb(254 240 138 / var(--tw-border-opacity, 1));
}
.border-l-blue-500 {
  --tw-border-opacity: 1;
  border-left-color: rgb(59 130 246 / var(--tw-border-opacity, 1));
}
.border-l-gray-300 {
  --tw-border-opacity: 1;
  border-left-color: rgb(209 213 219 / var(--tw-border-opacity, 1));
}
.border-t-transparent {
  border-top-color: transparent;
}
.bg-black\/20 {
  background-color: rgb(0 0 0/0.2);
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
.bg-gray-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(243 244 246 / var(--tw-bg-opacity, 1));
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
.bg-gray-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(75 85 99 / var(--tw-bg-opacity, 1));
}
.bg-green-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(220 252 231 / var(--tw-bg-opacity, 1));
}
.bg-green-300 {
  --tw-bg-opacity: 1;
  background-color: rgb(134 239 172 / var(--tw-bg-opacity, 1));
}
.bg-green-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(240 253 244 / var(--tw-bg-opacity, 1));
}
.bg-green-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(34 197 94 / var(--tw-bg-opacity, 1));
}
.bg-green-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(22 163 74 / var(--tw-bg-opacity, 1));
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
.bg-white\/10 {
  background-color: rgb(255 255 255/0.1);
}
.bg-white\/20 {
  background-color: rgb(255 255 255/0.2);
}
.bg-yellow-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 249 195 / var(--tw-bg-opacity, 1));
}
.bg-yellow-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 252 232 / var(--tw-bg-opacity, 1));
}
.bg-yellow-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(202 138 4 / var(--tw-bg-opacity, 1));
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
.from-blue-600 {
  --tw-gradient-from: #2563eb var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(37 99 235/0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
.via-white {
  --tw-gradient-to: rgb(255 255 255/0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from),
    #fff var(--tw-gradient-via-position), var(--tw-gradient-to);
}
.to-blue-50 {
  --tw-gradient-to: #eff6ff var(--tw-gradient-to-position);
}
.to-blue-800 {
  --tw-gradient-to: #1e40af var(--tw-gradient-to-position);
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
.object-cover {
  -o-object-fit: cover;
  object-fit: cover;
}
.object-center {
  -o-object-position: center;
  object-position: center;
}
.p-12 {
  padding: 3rem;
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
.px-1 {
  padding-left: 0.25rem;
  padding-right: 0.25rem;
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
.px-8 {
  padding-left: 2rem;
  padding-right: 2rem;
}
.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
.py-12 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}
.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}
.pl-10 {
  padding-left: 2.5rem;
}
.pl-3 {
  padding-left: 0.75rem;
}
.pr-12 {
  padding-right: 3rem;
}
.pr-3 {
  padding-right: 0.75rem;
}
.pr-4 {
  padding-right: 1rem;
}
.pr-8 {
  padding-right: 2rem;
}
.pt-4 {
  padding-top: 1rem;
}
.pt-6 {
  padding-top: 1.5rem;
}
.text-left {
  text-align: left;
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
.text-6xl {
  font-size: 3.75rem;
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
.text-blue-100 {
  --tw-text-opacity: 1;
  color: rgb(219 234 254 / var(--tw-text-opacity, 1));
}
.text-blue-500 {
  --tw-text-opacity: 1;
  color: rgb(59 130 246 / var(--tw-text-opacity, 1));
}
.text-blue-600 {
  --tw-text-opacity: 1;
  color: rgb(37 99 235 / var(--tw-text-opacity, 1));
}
.text-blue-700 {
  --tw-text-opacity: 1;
  color: rgb(29 78 216 / var(--tw-text-opacity, 1));
}
.text-blue-800 {
  --tw-text-opacity: 1;
  color: rgb(30 64 175 / var(--tw-text-opacity, 1));
}
.text-blue-900 {
  --tw-text-opacity: 1;
  color: rgb(30 58 138 / var(--tw-text-opacity, 1));
}
.text-gray-100 {
  --tw-text-opacity: 1;
  color: rgb(243 244 246 / var(--tw-text-opacity, 1));
}
.text-gray-300 {
  --tw-text-opacity: 1;
  color: rgb(209 213 219 / var(--tw-text-opacity, 1));
}
.text-gray-400 {
  --tw-text-opacity: 1;
  color: rgb(156 163 175 / var(--tw-text-opacity, 1));
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
.text-green-500 {
  --tw-text-opacity: 1;
  color: rgb(34 197 94 / var(--tw-text-opacity, 1));
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
.text-red-500 {
  --tw-text-opacity: 1;
  color: rgb(239 68 68 / var(--tw-text-opacity, 1));
}
.text-red-600 {
  --tw-text-opacity: 1;
  color: rgb(220 38 38 / var(--tw-text-opacity, 1));
}
.text-red-800 {
  --tw-text-opacity: 1;
  color: rgb(153 27 27 / var(--tw-text-opacity, 1));
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
.filter {
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast)
    var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate)
    var(--tw-sepia) var(--tw-drop-shadow);
}
.backdrop-blur-sm {
  --tw-backdrop-blur: blur(4px);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
    var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale)
    var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert)
    var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
    var(--tw-backdrop-sepia);
  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
    var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale)
    var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert)
    var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
    var(--tw-backdrop-sepia);
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
.hover\:border-gray-300:hover {
  --tw-border-opacity: 1;
  border-color: rgb(209 213 219 / var(--tw-border-opacity, 1));
}
.hover\:bg-blue-50:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(239 246 255 / var(--tw-bg-opacity, 1));
}
.hover\:bg-blue-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(29 78 216 / var(--tw-bg-opacity, 1));
}
.hover\:bg-gray-200:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(229 231 235 / var(--tw-bg-opacity, 1));
}
.hover\:bg-gray-300:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(209 213 219 / var(--tw-bg-opacity, 1));
}
.hover\:bg-gray-50:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(249 250 251 / var(--tw-bg-opacity, 1));
}
.hover\:bg-gray-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(55 65 81 / var(--tw-bg-opacity, 1));
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
.hover\:text-blue-800:hover {
  --tw-text-opacity: 1;
  color: rgb(30 64 175 / var(--tw-text-opacity, 1));
}
.hover\:text-gray-600:hover {
  --tw-text-opacity: 1;
  color: rgb(75 85 99 / var(--tw-text-opacity, 1));
}
.hover\:text-gray-700:hover {
  --tw-text-opacity: 1;
  color: rgb(55 65 81 / var(--tw-text-opacity, 1));
}
.hover\:text-green-800:hover {
  --tw-text-opacity: 1;
  color: rgb(22 101 52 / var(--tw-text-opacity, 1));
}
.hover\:text-orange-800:hover {
  --tw-text-opacity: 1;
  color: rgb(154 52 18 / var(--tw-text-opacity, 1));
}
.hover\:text-red-800:hover {
  --tw-text-opacity: 1;
  color: rgb(153 27 27 / var(--tw-text-opacity, 1));
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
.focus\:border-transparent:focus {
  border-color: transparent;
}
.focus\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
    var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
    calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
}
.focus\:ring-2:focus,
.focus\:ring-4:focus {
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
    var(--tw-shadow, 0 0 #0000);
}
.focus\:ring-4:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
    var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
    calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);
}
.focus\:ring-blue-200:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(191 219 254 / var(--tw-ring-opacity, 1));
}
.focus\:ring-blue-500:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity, 1));
}
.disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}
.disabled\:opacity-50:disabled {
  opacity: 0.5;
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
  .md\:col-span-2 {
    grid-column: span 2 / span 2;
  }
  .md\:flex {
    display: flex;
  }
  .md\:w-80 {
    width: 20rem;
  }
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .md\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .md\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .md\:flex-row {
    flex-direction: row;
  }
  .md\:items-center {
    align-items: center;
  }
  .md\:justify-between {
    justify-content: space-between;
  }
  .md\:space-y-0 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-y-reverse: 0;
    margin-top: calc(0px * calc(1 - var(--tw-space-y-reverse)));
    margin-bottom: calc(0px * var(--tw-space-y-reverse));
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
  .lg\:flex {
    display: flex;
  }
  .lg\:w-1\/2 {
    width: 50%;
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
.__className_4bc638 {
  font-family: Pacifico, Pacifico Fallback;
  font-weight: 400;
  font-style: normal;
}
.__variable_4bc638 {
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
.__className_1ea6cb {
  font-family: Geist, Geist Fallback;
  font-style: normal;
}
.__variable_1ea6cb {
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
.__className_0caaa8 {
  font-family: Geist Mono, Geist Mono Fallback;
  font-style: normal;
}
.__variable_0caaa8 {
  --font-geist-mono: "Geist Mono", "Geist Mono Fallback";
}

</style>