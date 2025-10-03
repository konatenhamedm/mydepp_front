<script lang="ts">
	export let item: any;
	export let type: any;
	export let actions: any = [];
	export let onAction: (a: string, i: any) => void;
</script>

<div class="inline-flex gap-1">
	<!-- {#if ()} -->


	{#if type == 'immo'}
		<button
			on:click={() => onAction(`edit`, item)}
			class={`hover:bg-warning border-primary text-primary inline-flex h-[30px] items-center justify-center gap-[6px] rounded-[4px] border-1 border-solid px-[10px] text-[6px] leading-[22px] font-semibold capitalize transition duration-300 ease-in-out hover:text-white`}
			title={`inventaire immobilisation`}
		>
			<i class={`uil uil-book`}></i>
		</button>

	

	{:else}	
	<button
			on:click={() => onAction(`view`, item)}
			class={`hover:bg-warning border-primary text-primary inline-flex h-[30px] items-center justify-center gap-[6px] rounded-[4px] border-1 border-solid px-[10px] text-[6px] leading-[22px] font-semibold capitalize transition duration-300 ease-in-out hover:text-white`}
			title={`inventaire stock`}
		>
			<i class={`uil uil-book`}></i>
		</button>
	{/if}	
	
	<button
	on:click={() => onAction(`send`, item)}
	class={`hover:bg-primary border-primary text-primary inline-flex h-[30px] items-center justify-center gap-[6px] rounded-[4px] border-1 border-solid px-[10px] text-[6px] leading-[22px] font-semibold capitalize transition duration-300 ease-in-out hover:text-white`}
	title={`inventaire stock`}
>
	<i class={`uil uil-message`}></i>
</button>
</div>
