<script lang="ts">
    export let count: number = 5;
</script>

<div class="skeleton-container">
    {#each Array(count) as _, i}
        <div class="skeleton-item" key={i}></div>
    {/each}
</div>

<style>
    .skeleton-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 20px;
    }

    .skeleton-item {
        width: 100%;
        height: 40px;
        background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
        background-size: 200% 100%;
        border-radius: 5px;
        animation: loading 1.5s infinite linear;
    }

    @keyframes loading {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }
</style>
