<script lang="ts">
  export let titre: string = 'Inbox';
  export let parent: string = 'Inbox';
  export let current: any = [];
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-3">
  <!-- Breadcrumb Section -->
  <div class="flex items-center justify-between">
    <!-- Title à gauche -->
    <h2 class="text-2xl font-semibold text-gray-800 dark:text-white ">
      {titre}
    </h2>
    
    <!-- Breadcrumb Navigation à droite -->
    <nav class="flex items-center text-sm">
      <ol class="flex items-center space-x-2">
        <!-- Parent Link -->
        <li class="flex items-center">
          <a
            href="/admin"
            class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center"
          >
            <i class="uil uil-estate text-[14px] mr-1"></i>
            {parent}
          </a>
        </li>
        
        <!-- Separator -->
        <li class="text-gray-400 text-xs">›</li>
        
        <!-- Current Page -->
        <li class="text-gray-800 dark:text-gray-200 font-medium">
          {current}
        </li>
      </ol>
    </nav>
  </div>
</div>