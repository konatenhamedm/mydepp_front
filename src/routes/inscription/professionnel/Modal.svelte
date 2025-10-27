<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let pdfUrl: string;
  
  const dispatch = createEventDispatcher();
  
  function close() {
    dispatch('close');
  }
  
  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      close();
    }
  }
</script>

<!-- Backdrop -->
<div 
  class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
  on:click={handleBackdropClick}
  role="button"
  tabindex="-1"
  on:keydown={(e) => e.key === 'Escape' && close()}
>
  <!-- Modal -->
  <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
    
    <!-- Header -->
    <div class="flex items-center justify-between p-6 border-b border-gray-200">
      <h2 class="text-2xl font-bold text-gray-900">
        ✅ Paiement réussi !
      </h2>
      <button
        on:click={close}
        class="text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Fermer"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <!-- Body -->
    <div class="p-6 overflow-y-auto max-h-[60vh]">
      <div class="text-center space-y-4">
        
        <!-- Icône de succès -->
        <div class="flex justify-center">
          <div class="bg-green-100 rounded-full p-4">
            <svg class="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <!-- Message -->
        <div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            Votre inscription a été validée !
          </h3>
          <p class="text-gray-600">
            Votre paiement a été effectué avec succès. Vous recevrez un email de confirmation sous peu.
          </p>
        </div>
        
        <!-- Référence -->
        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p class="text-sm text-gray-600 mb-1">Référence de transaction :</p>
          <p class="text-lg font-mono font-semibold text-gray-900">{pdfUrl}</p>
        </div>
        
        <!-- Information -->
        <div class="text-left bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p class="text-sm text-blue-800">
            <strong>📧 Prochaines étapes :</strong><br>
            • Vous recevrez un email de confirmation<br>
            • Votre dossier sera traité dans les 48h<br>
            • Conservez votre référence de transaction
          </p>
        </div>
        
      </div>
    </div>
    
    <!-- Footer -->
    <div class="flex items-center justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50">
      <button
        on:click={close}
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Fermer
      </button>
    </div>
    
  </div>
</div>

<style>
  /* Empêche le scroll du body quand la modal est ouverte */
  :global(body:has(.fixed)) {
    overflow: hidden;
  }
</style>