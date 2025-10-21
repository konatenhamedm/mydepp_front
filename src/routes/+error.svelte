<script>
    export let error;
    export let status;
</script>

<svelte:head>
    <title>{status === 404 ? "Page introuvable" : "Erreur serveur"}</title>
</svelte:head>

<div
    class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#EAEAEA] to-[#D4EDEB] text-gray-800 relative overflow-hidden font-[Montserrat] px-6"
>
    <div
        class="absolute w-[400px] h-[400px] bg-[#53B0B7]/20 rounded-full blur-3xl -top-24 -left-24 animate-pulse"
    ></div>
    <div
        class="absolute w-[300px] h-[300px] bg-[#EFDCC5]/30 rounded-full blur-3xl bottom-10 right-10 animate-pulse"
    ></div>

    <div class="text-center relative z-10  mt-8">
        <h1 class="text-[7rem] font-bold text-[#53B0B7] drop-shadow-md">
            {status}
        </h1>

        {#if status === 404}
            <p class="text-2xl mt-4 text-gray-700 font-medium">
                Oups 😅 Cette page semble s’être échappée dans une autre
                dimension...
            </p>
            <p class="text-gray-500 mt-2">
                Pas de panique, vous pouvez toujours retourner à l’accueil.
            </p>
        {:else}
            <p class="text-xl mt-4 text-gray-700 font-medium">
                Une erreur est survenue : {error?.message ??
                    "Quelque chose s’est mal passé."}
            </p>
        {/if}

       <!-- save -->
    </div>

    <!-- Pied -->
    <div class="absolute bottom-4 text-sm text-gray-500">
        © {new Date().getFullYear()} MyDepp — Tous droits réservés
    </div>
</div>
