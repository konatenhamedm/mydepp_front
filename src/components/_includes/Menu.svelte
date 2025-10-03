<script lang="ts">
	export let item: any;
	export let actions: any = [];
	export let onAction: (a: any, i: any) => void;
</script>

<div class="inline-flex gap-1">
	<!-- {#if ()} -->

	{#each actions as action}
		<button
			on:click={() => onAction(`${action.action}`, item)}
			class={`hover:bg-${action.color} border-[${action.color}] text-primary  inline-flex h-[30px] items-center justify-center gap-[6px] rounded-[4px] border-1 border-solid px-[10px] text-[6px] leading-[22px] font-semibold capitalize transition duration-300 ease-in-out hover:text-white`}
			title={`${action.title}`}
		>
			<i class={`uil uil-${action.icon}`}></i>
		</button>
	{/each}
</div>
