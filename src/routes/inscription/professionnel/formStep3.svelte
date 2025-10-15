<script>
  export let formData;
  let fileInputs = [];
</script>

<main>
  <div>
    <div class="text-center mb-8">
      
      <p class="text-gray-600">
        Charger tous les documents requis pour finaliser votre dossier
      </p>
    </div>
    <div>
      <form id="document-upload">
        
          <div class="mb-8">
          
            <div class="grid grid-cols-1 gap-6">
              {#each [{ key: "photo", label: "Photo d'identité", type: "file" }, { key: "cni", label: "Copie CNI(Carte nationale d’identité)", type: "file" }, { key: "casier", label: "Extrait Casier judiciaire(Datant de moins 3 mois)", type: "file" }, { key: "diplomeFile", label: "Diplôme légalisé", type: "file" }, { key: "certificat", label: "Certificat de residence (Datant de moins 3 mois)", type: "file" }, { key: "cv", label: "CV", type: "file" }] as field}
                <div class="border border-gray-200 rounded-lg p-4">
                  <div class="flex items-start gap-4">
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-2">
                        <label class="text-sm font-medium text-gray-700"
                          >{field.label}</label
                        ><span class="text-red-500">*</span>
                      </div>
                      <div
                        onclick={() => {
                          fileInputs[field.key].click();
                        }}
                        class="border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer border-gray-300 hover:border-gray-400"
                      >
                        <div
                          class="w-8 h-8 flex items-center justify-center mx-auto mb-2"
                        >
                          <i class="ri-upload-cloud-line text-gray-400 text-2xl"
                          ></i>
                        </div>
                        <p class="text-sm text-gray-600 mb-1">
                          Cliquez pour sélectionner ou glissez-déposez
                        </p>
                        <p class="text-xs text-gray-400">
                          PDF, DOC, DOCX, JPG, PNG (max. 10MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        class="hidden"
                        bind:this={fileInputs[field.key]}
                        name={field.key}
                        onchange={(e) => {
                          formData[field.key] = e.target.files[0];
                          console.log(
                            "Document changé:",
                            field.label,
                            field.key
                          );
                        }}
                      />
                      <p class="text-xs text-gray-500 mt-1">
                        Parcourir... Aucun fichier sélectionné.
                      </p>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
       
      </form>
    </div>
  </div>
</main>

<style>
  @import url("https://cdn.jsdelivr.net/npm/remixicon@4.6.0/fonts/remixicon.min.css");
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
    font-family:
      ui-sans-serif,
      system-ui,
      sans-serif,
      Apple Color Emoji,
      Segoe UI Emoji,
      Segoe UI Symbol,
      Noto Color Emoji;
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
    font-family:
      ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      Liberation Mono,
      Courier New,
      monospace;
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
  .container {
    width: 100%;
  }
  @media (min-width: 640px) {
    .container {
      max-width: 640px;
    }
  }
  @media (min-width: 768px) {
    .container {
      max-width: 768px;
    }
  }
  @media (min-width: 1024px) {
    .container {
      max-width: 1024px;
    }
  }
  @media (min-width: 1280px) {
    .container {
      max-width: 1280px;
    }
  }
  @media (min-width: 1536px) {
    .container {
      max-width: 1536px;
    }
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
  .mt-1 {
    margin-top: 0.25rem;
  }
  .mt-12 {
    margin-top: 3rem;
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
  .inline-block {
    display: inline-block;
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
  .h-12 {
    height: 3rem;
  }
  .h-16 {
    height: 4rem;
  }
  .h-32 {
    height: 8rem;
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
  .min-h-screen {
    min-height: 100vh;
  }
  .w-12 {
    width: 3rem;
  }
  .w-32 {
    width: 8rem;
  }
  .w-6 {
    width: 1.5rem;
  }
  .w-8 {
    width: 2rem;
  }
  .w-full {
    width: 100%;
  }
  .max-w-4xl {
    max-width: 56rem;
  }
  .max-w-6xl {
    max-width: 72rem;
  }
  .flex-1 {
    flex: 1 1 0%;
  }
  .flex-shrink-0 {
    flex-shrink: 0;
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
  .space-x-4 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-x-reverse: 0;
    margin-right: calc(1rem * var(--tw-space-x-reverse));
    margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));
  }
  .space-x-8 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-x-reverse: 0;
    margin-right: calc(2rem * var(--tw-space-x-reverse));
    margin-left: calc(2rem * calc(1 - var(--tw-space-x-reverse)));
  }
  .space-y-2 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-y-reverse: 0;
    margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));
    margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));
  }
  .overflow-hidden {
    overflow: hidden;
  }
  .whitespace-nowrap {
    white-space: nowrap;
  }
  .rounded {
    border-radius: 0.25rem;
  }
  .rounded-lg {
    border-radius: 0.5rem;
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
  .border-dashed {
    border-style: dashed;
  }
  .border-blue-400 {
    --tw-border-opacity: 1;
    border-color: rgb(96 165 250 / var(--tw-border-opacity, 1));
  }
  .border-gray-200 {
    --tw-border-opacity: 1;
    border-color: rgb(229 231 235 / var(--tw-border-opacity, 1));
  }
  .border-gray-300 {
    --tw-border-opacity: 1;
    border-color: rgb(209 213 219 / var(--tw-border-opacity, 1));
  }
  .border-gray-800 {
    --tw-border-opacity: 1;
    border-color: rgb(31 41 55 / var(--tw-border-opacity, 1));
  }
  .border-green-200 {
    --tw-border-opacity: 1;
    border-color: rgb(187 247 208 / var(--tw-border-opacity, 1));
  }
  .border-green-400 {
    --tw-border-opacity: 1;
    border-color: rgb(74 222 128 / var(--tw-border-opacity, 1));
  }
  .border-red-400 {
    --tw-border-opacity: 1;
    border-color: rgb(248 113 113 / var(--tw-border-opacity, 1));
  }
  .bg-blue-100 {
    --tw-bg-opacity: 1;
    background-color: rgb(219 234 254 / var(--tw-bg-opacity, 1));
  }
  .bg-blue-50 {
    --tw-bg-opacity: 1;
    background-color: rgb(239 246 255 / var(--tw-bg-opacity, 1));
  }
  .bg-blue-600 {
    --tw-bg-opacity: 1;
    background-color: rgb(37 99 235 / var(--tw-bg-opacity, 1));
  }
  .bg-gray-200 {
    --tw-bg-opacity: 1;
    background-color: rgb(229 231 235 / var(--tw-bg-opacity, 1));
  }
  .bg-gray-50 {
    --tw-bg-opacity: 1;
    background-color: rgb(249 250 251 / var(--tw-bg-opacity, 1));
  }
  .bg-gray-900 {
    --tw-bg-opacity: 1;
    background-color: rgb(17 24 39 / var(--tw-bg-opacity, 1));
  }
  .bg-green-100 {
    --tw-bg-opacity: 1;
    background-color: rgb(220 252 231 / var(--tw-bg-opacity, 1));
  }
  .bg-green-50 {
    --tw-bg-opacity: 1;
    background-color: rgb(240 253 244 / var(--tw-bg-opacity, 1));
  }
  .bg-purple-100 {
    --tw-bg-opacity: 1;
    background-color: rgb(243 232 255 / var(--tw-bg-opacity, 1));
  }
  .bg-purple-500 {
    --tw-bg-opacity: 1;
    background-color: rgb(168 85 247 / var(--tw-bg-opacity, 1));
  }
  .bg-red-100 {
    --tw-bg-opacity: 1;
    background-color: rgb(254 226 226 / var(--tw-bg-opacity, 1));
  }
  .bg-white {
    --tw-bg-opacity: 1;
    background-color: rgb(255 255 255 / var(--tw-bg-opacity, 1));
  }
  .object-cover {
    -o-object-fit: cover;
    object-fit: cover;
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
  .px-1 {
    padding-left: 0.25rem;
    padding-right: 0.25rem;
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
  .py-16 {
    padding-top: 4rem;
    padding-bottom: 4rem;
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
  .pb-2 {
    padding-bottom: 0.5rem;
  }
  .pt-8 {
    padding-top: 2rem;
  }
  .text-center {
    text-align: center;
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
  .text-blue-500 {
    --tw-text-opacity: 1;
    color: rgb(59 130 246 / var(--tw-text-opacity, 1));
  }
  .text-blue-600 {
    --tw-text-opacity: 1;
    color: rgb(37 99 235 / var(--tw-text-opacity, 1));
  }
  .text-gray-100 {
    --tw-text-opacity: 1;
    color: rgb(243 244 246 / var(--tw-text-opacity, 1));
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
  .text-purple-600 {
    --tw-text-opacity: 1;
    color: rgb(147 51 234 / var(--tw-text-opacity, 1));
  }
  .text-red-500 {
    --tw-text-opacity: 1;
    color: rgb(239 68 68 / var(--tw-text-opacity, 1));
  }
  .text-red-700 {
    --tw-text-opacity: 1;
    color: rgb(185 28 28 / var(--tw-text-opacity, 1));
  }
  .text-white {
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity, 1));
  }
  .antialiased {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .shadow-lg {
    --tw-shadow: 0 10px 15px -3px rgb(0 0 0/0.1), 0 4px 6px -4px rgb(0 0 0/0.1);
    --tw-shadow-colored:
      0 10px 15px -3px var(--tw-shadow-color),
      0 4px 6px -4px var(--tw-shadow-color);
  }
  .shadow-lg,
  .shadow-sm {
    box-shadow:
      var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
      var(--tw-shadow);
  }
  .shadow-sm {
    --tw-shadow: 0 1px 2px 0 rgb(0 0 0/0.05);
    --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
  }
  .transition-colors {
    transition-property:
      color, background-color, border-color, text-decoration-color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 0.15s;
  }
  .hover\:border-gray-400:hover {
    --tw-border-opacity: 1;
    border-color: rgb(156 163 175 / var(--tw-border-opacity, 1));
  }
  .hover\:bg-blue-700:hover {
    --tw-bg-opacity: 1;
    background-color: rgb(29 78 216 / var(--tw-bg-opacity, 1));
  }
  .hover\:bg-gray-300:hover {
    --tw-bg-opacity: 1;
    background-color: rgb(209 213 219 / var(--tw-bg-opacity, 1));
  }
  .hover\:bg-purple-600:hover {
    --tw-bg-opacity: 1;
    background-color: rgb(147 51 234 / var(--tw-bg-opacity, 1));
  }
  .hover\:bg-red-100:hover {
    --tw-bg-opacity: 1;
    background-color: rgb(254 226 226 / var(--tw-bg-opacity, 1));
  }
  .hover\:text-gray-900:hover {
    --tw-text-opacity: 1;
    color: rgb(17 24 39 / var(--tw-text-opacity, 1));
  }
  .hover\:text-white:hover {
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity, 1));
  }
  .disabled\:cursor-not-allowed:disabled {
    cursor: not-allowed;
  }
  .disabled\:bg-gray-400:disabled {
    --tw-bg-opacity: 1;
    background-color: rgb(156 163 175 / var(--tw-bg-opacity, 1));
  }
  @media (min-width: 768px) {
    .md\:mt-0 {
      margin-top: 0;
    }
    .md\:flex {
      display: flex;
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
    .lg\:grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @font-face {
    font-family: Pacifico;
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    unicode-range:
      u+0460-052f, u+1c80-1c8a, u+20b4, u+2de0-2dff, u+a640-a69f, u+fe2e-fe2f;
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
    unicode-range:
      u+0102-0103, u+0110-0111, u+0128-0129, u+0168-0169, u+01a0-01a1,
      u+01af-01b0, u+0300-0301, u+0303-0304, u+0308-0309, u+0323, u+0329,
      u+1ea0-1ef9, u+20ab;
  }
  @font-face {
    font-family: Pacifico;
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    unicode-range:
      u+0100-02ba, u+02bd-02c5, u+02c7-02cc, u+02ce-02d7, u+02dd-02ff, u+0304,
      u+0308, u+0329, u+1d00-1dbf, u+1e00-1e9f, u+1ef2-1eff, u+2020,
      u+20a0-20ab, u+20ad-20c0, u+2113, u+2c60-2c7f, u+a720-a7ff;
  }
  @font-face {
    font-family: Pacifico;
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    unicode-range:
      u+00??, u+0131, u+0152-0153, u+02bb-02bc, u+02c6, u+02da, u+02dc, u+0304,
      u+0308, u+0329, u+2000-206f, u+20ac, u+2122, u+2191, u+2193, u+2212,
      u+2215, u+feff, u+fffd;
  }
  @font-face {
    font-family: Pacifico Fallback;
    src: local("Arial");
    ascent-override: 137.32%;
    descent-override: 47.74%;
    line-gap-override: 0%;
    size-adjust: 94.89%;
  }
  .__className_259868 {
    font-family:
      Pacifico,
      Pacifico Fallback;
    font-weight: 400;
    font-style: normal;
  }
  .__variable_259868 {
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
    unicode-range:
      u+0100-02ba, u+02bd-02c5, u+02c7-02cc, u+02ce-02d7, u+02dd-02ff, u+0304,
      u+0308, u+0329, u+1d00-1dbf, u+1e00-1e9f, u+1ef2-1eff, u+2020,
      u+20a0-20ab, u+20ad-20c0, u+2113, u+2c60-2c7f, u+a720-a7ff;
  }
  @font-face {
    font-family: Geist;
    font-style: normal;
    font-weight: 100 900;
    font-display: swap;
    unicode-range:
      u+00??, u+0131, u+0152-0153, u+02bb-02bc, u+02c6, u+02da, u+02dc, u+0304,
      u+0308, u+0329, u+2000-206f, u+20ac, u+2122, u+2191, u+2193, u+2212,
      u+2215, u+feff, u+fffd;
  }
  @font-face {
    font-family: Geist Fallback;
    src: local("Arial");
    ascent-override: 95.94%;
    descent-override: 28.16%;
    line-gap-override: 0%;
    size-adjust: 104.76%;
  }
  .__className_31605b {
    font-family:
      Geist,
      Geist Fallback;
    font-style: normal;
  }
  .__variable_31605b {
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
    unicode-range:
      u+0100-02ba, u+02bd-02c5, u+02c7-02cc, u+02ce-02d7, u+02dd-02ff, u+0304,
      u+0308, u+0329, u+1d00-1dbf, u+1e00-1e9f, u+1ef2-1eff, u+2020,
      u+20a0-20ab, u+20ad-20c0, u+2113, u+2c60-2c7f, u+a720-a7ff;
  }
  @font-face {
    font-family: Geist Mono;
    font-style: normal;
    font-weight: 100 900;
    font-display: swap;
    unicode-range:
      u+00??, u+0131, u+0152-0153, u+02bb-02bc, u+02c6, u+02da, u+02dc, u+0304,
      u+0308, u+0329, u+2000-206f, u+20ac, u+2122, u+2191, u+2193, u+2212,
      u+2215, u+feff, u+fffd;
  }
  @font-face {
    font-family: Geist Mono Fallback;
    src: local("Arial");
    ascent-override: 74.67%;
    descent-override: 21.92%;
    line-gap-override: 0%;
    size-adjust: 134.59%;
  }
  .__className_7ae576 {
    font-family:
      Geist Mono,
      Geist Mono Fallback;
    font-style: normal;
  }
  .__variable_7ae576 {
    --font-geist-mono: "Geist Mono", "Geist Mono Fallback";
  }
</style>
