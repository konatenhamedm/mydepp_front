<script>
    export let isLoading = true;
    export let activeTab = 'step2';
</script>

<!-- Skeleton Loader Component -->
{#if isLoading}
    <div class="w-full mx-auto p-4 content-sec">
        <!-- Tabs Navigation Skeleton -->
        <div class="mb-4 border-b border-gray-200">
            <ul class="flex flex-wrap -mb-px text-sm font-medium text-center">
                {#each ['Informations de Base', 'Informations Professionnelles', 'Documents', 'Organisation'] as tab, i}
                    <li class="mr-2">
                        <div class="inline-block p-4 animate-pulse bg-gray-200 text-transparent rounded-t-lg w-48">
                            {tab}
                        </div>
                    </li>
                {/each}
            </ul>
        </div>

        <!-- Tab Contents Skeleton -->
        <div class="mt-6">
            <!-- Step 2: Informations Personnelles Skeleton -->
            {#if activeTab === 'step2'}
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {#each Array(12) as _, i}
                            <div class="space-y-2">
                                <div class="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                                <div class="h-10 w-full bg-gray-100 rounded animate-pulse"></div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}

            <!-- Step 3: Informations Professionnelles Skeleton -->
            {#if activeTab === 'step3'}
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {#each Array(8) as _, i}
                            <div class="space-y-2">
                                <div class="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                                <div class="h-10 w-full bg-gray-100 rounded animate-pulse"></div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}

            <!-- Step 4: Documents Skeleton -->
            {#if activeTab === 'step4'}
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {#each Array(6) as _, i}
                            <div class="space-y-2">
                                <div class="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                                <div class="h-16 w-full bg-gray-100 rounded animate-pulse"></div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}

            <!-- Step 5: Organisation Skeleton -->
            {#if activeTab === 'step5'}
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="col-span-2 space-y-2">
                            <div class="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                            <div class="flex space-x-4">
                                <div class="h-6 w-16 bg-gray-100 rounded animate-pulse"></div>
                                <div class="h-6 w-16 bg-gray-100 rounded animate-pulse"></div>
                            </div>
                        </div>
                        {#each Array(3) as _, i}
                            <div class="space-y-2">
                                <div class="h-4 w-36 bg-gray-200 rounded animate-pulse"></div>
                                <div class="h-10 w-full bg-gray-100 rounded animate-pulse"></div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>

        <!-- Submit Button Skeleton -->
        <div class="mt-6 flex justify-end">
            <div class="px-4 py-2 w-24 h-10 bg-gray-300 rounded-md animate-pulse"></div>
        </div>
    </div>
{/if}

<style>
    .content-sec {
        margin-top: 160px;
    }

    @keyframes pulse {
        0%, 100% {
            opacity: 0.5;
        }
        50% {
            opacity: 0.8;
        }
    }

    .animate-pulse {
        animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
</style>