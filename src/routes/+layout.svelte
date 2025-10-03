<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import Side from '../components/_includes/Side.svelte';
	import Footer from '../components/_includes/Footer.svelte';

	import Header from '../components/_includes/Header.svelte';

	import { getAuthCookie, getPermission } from "$lib/auth";
  import { onMount } from "svelte";




	let { children } = $props();
	let currentYear = new Date().getFullYear();


</script>

<!-- {#if $page.url.pathname.startsWith('/admin')} -->
{#if $page.url.pathname != '/' && $page.url.pathname != '/login/mot_passe_oublie' && $page.url.pathname != '/login/confirmation'  }
	<Side user={"data"} />
	<div
		class="bg-normalBG dark:bg-main-dark relative flex flex-1 flex-col !transition-all delay-[0s] !duration-[0.2s] ease-linear xl:ps-[280px] xl:[&.TopExpanded]:ps-[0px] xl:[&.expanded]:ps-[80px]"
		id="content"
	>
		<Header />
		<main class="bg-normalBG dark:bg-main-dark">
			{@render children()}

			<Footer />
		</main>		
	</div>
{:else}

	{@render children()}


{/if}
