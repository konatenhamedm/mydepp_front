<script lang="ts">
    import { onMount, afterUpdate } from 'svelte';
    
    export let message = '';
    export let type = 'info'; // 'info', 'success', 'error'
    export let duration = 5000;

    let isVisible = false;
    let timeoutId: any;

    function showNotification() {
        isVisible = true;
        clearTimeout(timeoutId); // Nettoie un ancien timer
        timeoutId = setTimeout(() => {
            isVisible = false;
        }, duration);
    }

    // Détecte les changements de message
    $: if (message) {
        showNotification();
    }

    onMount(() => {
        if (message) {
            showNotification();
        }
    });
</script>

<style>
   .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    left: auto;
    margin: 0;
    padding: 15px 25px;
    border-radius: 8px;
    color: white;
    z-index: 9999; /* assure que ça soit au-dessus du reste */
    font-size: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: opacity 0.5s ease-in-out;
}


    .success {
        background-color: #4caf50;
    }

    .error {
        background-color: #f44336;
    }

    .info {
        background-color: #2196f3;
    }

    .hide {
        opacity: 0;
        pointer-events: none;
    }
</style>

{#if isVisible}
    <div class="notification {type}">
        {message}
    </div>
{/if}
