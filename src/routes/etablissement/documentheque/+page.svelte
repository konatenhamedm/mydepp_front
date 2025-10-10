
<script>
  import FooterNew from "$components/_includes/FooterNew.svelte";
  import HeaderNew from "$components/_includes/HeaderNew.svelte";

</script>

<main>
    <HeaderNew /> 
    <div
      class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
    >
      <div class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <a
                class="text-blue-600 hover:text-blue-800 transition-colors"
                href="/preview/9742213d-fe1d-4d27-aba4-f4ac9a2c4158/3063058/dashboard-v2"
                ><i class="ri-arrow-left-line text-xl"></i
              ></a>
              <div>
                <h1 class="text-2xl font-bold text-gray-900">Documenthèque</h1>
                <p class="text-gray-600">
                  Accédez à tous vos documents et ressources
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span
                class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                >1<!-- -->
                nouveaux</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center space-x-3">
              <div
                class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
              >
                <i class="ri-file-list-line text-blue-600 text-xl"></i>
              </div>
              <div>
                <p class="text-sm text-gray-600">Total documents</p>
                <p class="text-2xl font-bold text-gray-900">6</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center space-x-3">
              <div
                class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
              >
                <i class="ri-download-line text-green-600 text-xl"></i>
              </div>
              <div>
                <p class="text-sm text-gray-600">Téléchargements</p>
                <p class="text-2xl font-bold text-gray-900">417</p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center space-x-3">
              <div
                class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center"
              >
                <i class="ri-star-line text-red-600 text-xl"></i>
              </div>
              <div>
                <p class="text-sm text-gray-600">Nouveaux</p>
                <p class="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div
            class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0"
          >
            <div class="flex flex-wrap gap-2">
              <button
                class="px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap bg-blue-600 text-white"
              >
                Toutes</button
              ><button
                class="px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Réglementation</button
              ><button
                class="px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Procédures</button
              ><button
                class="px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Formulaires</button
              ><button
                class="px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Certifications</button
              ><button
                class="px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Rapports
              </button>
            </div>
            <div class="relative">
              <i
                class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              ></i
              ><input
                type="text"
                placeholder="Rechercher un document..."
                class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-80"
                value=""
              />
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 flex items-center justify-center">
                  <i class="ri-file-pdf-line text-red-500 text-2xl"></i>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 line-clamp-2">
                    Guide de conformité 2024
                  </h3>
                  <span class="text-xs text-gray-500"
                    >PDF<!-- -->
                    •
                    <!-- -->2.5 MB</span
                  >
                </div>
              </div>
              <span
                class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium"
                >Nouveau</span
              >
            </div>
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">
              Guide complet des nouvelles réglementations sanitaires pour 2024
            </p>
            <div
              class="flex items-center justify-between text-sm text-gray-500 mb-4"
            >
              <span class="px-2 py-1 bg-gray-100 rounded-full"
                >Réglementation</span
              ><span>2024-01-15</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-1 text-sm text-gray-500">
                <i class="ri-download-line"></i><span>45</span>
              </div>
              <div class="flex space-x-2">
                <button
                  class="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Aperçu</button
                ><button
                  class="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Télécharger
                </button>
              </div>
            </div>
          </div>
          <div
            class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 flex items-center justify-center">
                  <i class="ri-file-pdf-line text-red-500 text-2xl"></i>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 line-clamp-2">
                    Protocole d'urgence
                  </h3>
                  <span class="text-xs text-gray-500"
                    >PDF<!-- -->
                    •
                    <!-- -->1.8 MB</span
                  >
                </div>
              </div>
            </div>
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">
              Procédures d'urgence et contacts essentiels
            </p>
            <div
              class="flex items-center justify-between text-sm text-gray-500 mb-4"
            >
              <span class="px-2 py-1 bg-gray-100 rounded-full">Procédures</span
              ><span>2024-01-12</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-1 text-sm text-gray-500">
                <i class="ri-download-line"></i><span>32</span>
              </div>
              <div class="flex space-x-2">
                <button
                  class="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Aperçu</button
                ><button
                  class="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Télécharger
                </button>
              </div>
            </div>
          </div>
          <div
            class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 flex items-center justify-center">
                  <i class="ri-file-word-line text-blue-500 text-2xl"></i>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 line-clamp-2">
                    Formulaire de déclaration
                  </h3>
                  <span class="text-xs text-gray-500"
                    >DOCX<!-- -->
                    •
                    <!-- -->0.5 MB</span
                  >
                </div>
              </div>
            </div>
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">
              Formulaire de déclaration d'incident
            </p>
            <div
              class="flex items-center justify-between text-sm text-gray-500 mb-4"
            >
              <span class="px-2 py-1 bg-gray-100 rounded-full">Formulaires</span
              ><span>2024-01-10</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-1 text-sm text-gray-500">
                <i class="ri-download-line"></i><span>28</span>
              </div>
              <div class="flex space-x-2">
                <button
                  class="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Aperçu</button
                ><button
                  class="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Télécharger
                </button>
              </div>
            </div>
          </div>
          <div
            class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 flex items-center justify-center">
                  <i class="ri-file-pdf-line text-red-500 text-2xl"></i>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 line-clamp-2">
                    Certificat de formation
                  </h3>
                  <span class="text-xs text-gray-500"
                    >PDF<!-- -->
                    •
                    <!-- -->1.2 MB</span
                  >
                </div>
              </div>
            </div>
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">
              Modèle de certificat de formation du personnel
            </p>
            <div
              class="flex items-center justify-between text-sm text-gray-500 mb-4"
            >
              <span class="px-2 py-1 bg-gray-100 rounded-full"
                >Certifications</span
              ><span>2024-01-08</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-1 text-sm text-gray-500">
                <i class="ri-download-line"></i><span>67</span>
              </div>
              <div class="flex space-x-2">
                <button
                  class="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Aperçu</button
                ><button
                  class="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Télécharger
                </button>
              </div>
            </div>
          </div>
          <div
            class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 flex items-center justify-center">
                  <i class="ri-file-pdf-line text-red-500 text-2xl"></i>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 line-clamp-2">
                    Rapport d'audit 2023
                  </h3>
                  <span class="text-xs text-gray-500"
                    >PDF<!-- -->
                    •
                    <!-- -->3.2 MB</span
                  >
                </div>
              </div>
            </div>
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">
              Rapport complet de l'audit annuel 2023
            </p>
            <div
              class="flex items-center justify-between text-sm text-gray-500 mb-4"
            >
              <span class="px-2 py-1 bg-gray-100 rounded-full">Rapports</span
              ><span>2024-01-05</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-1 text-sm text-gray-500">
                <i class="ri-download-line"></i><span>89</span>
              </div>
              <div class="flex space-x-2">
                <button
                  class="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Aperçu</button
                ><button
                  class="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Télécharger
                </button>
              </div>
            </div>
          </div>
          <div
            class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 flex items-center justify-center">
                  <i class="ri-file-excel-line text-green-500 text-2xl"></i>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 line-clamp-2">
                    Checklist hygiène
                  </h3>
                  <span class="text-xs text-gray-500"
                    >XLSX<!-- -->
                    •
                    <!-- -->0.8 MB</span
                  >
                </div>
              </div>
            </div>
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">
              Liste de contrôle pour les procédures d'hygiène
            </p>
            <div
              class="flex items-center justify-between text-sm text-gray-500 mb-4"
            >
              <span class="px-2 py-1 bg-gray-100 rounded-full">Procédures</span
              ><span>2024-01-03</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-1 text-sm text-gray-500">
                <i class="ri-download-line"></i><span>156</span>
              </div>
              <div class="flex space-x-2">
                <button
                  class="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Aperçu</button
                ><button
                  class="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Télécharger
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  <FooterNew />
</main>

<style></style>