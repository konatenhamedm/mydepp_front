<script lang="ts">
  
export let titre: string = 'Inbox';
export let parent: string = 'Inbox';
export let current: any = [];
</script>

<div class="max-w-6xl mx-auto">
    <!-- Carte principale -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-md">
        
        <!-- En-tête de la carte -->
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <div class="flex items-center justify-between">
                <!-- Titre principal -->
                <h2 class="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
                    {titre}
                </h2>
                
                <!-- Badge d'état optionnel -->
                <div class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                    Admin Panel
                </div>
            </div>
        </div>

        <!-- Contenu de la carte -->
        <div class="p-6">
            <!-- Section Breadcrumb -->
            <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <!-- Titre section -->
                    <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                        <svg class="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                        </svg>
                        Navigation
                    </h3>

                    <!-- Fil d'Ariane -->
                    <nav class="flex items-center space-x-2 text-sm">
                        <!-- Lien parent -->
                        <a href="/admin" class="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 font-medium group">
                            <svg class="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                            </svg>
                            {parent}
                        </a>
                        
                        <!-- Séparateur -->
                        <span class="text-gray-400 dark:text-gray-500">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </span>

                        <!-- Page actuelle -->
                        <span class="text-gray-600 dark:text-gray-400 font-medium flex items-center">
                            {current}
                            <svg class="w-4 h-4 ml-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                            </svg>
                        </span>
                    </nav>
                </div>
            </div>

            <!-- Contenu supplémentaire (placeholder) -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Exemple de contenu métier -->
                <div class="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="font-semibold text-gray-800 dark:text-gray-200">Messages</h4>
                        <span class="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">12</span>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Nouveaux messages non lus</p>
                </div>

                <div class="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="font-semibold text-gray-800 dark:text-gray-200">Tâches</h4>
                        <span class="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">5</span>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Tâches en attente</p>
                </div>

                <div class="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="font-semibold text-gray-800 dark:text-gray-200">Notifications</h4>
                        <span class="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">3</span>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Alertes importantes</p>
                </div>
            </div>
        </div>

        <!-- Pied de carte -->
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700">
            <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Dernière mise à jour: {new Date().toLocaleDateString()}</span>
                <div class="flex items-center space-x-4">
                    <button class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200">
                        Actualiser
                    </button>
                    <button class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors duration-200">
                        Exporter
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
