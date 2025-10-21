<script lang="ts">
	export let item;
	export let actions: any = [];
	export let onAction: (a: any, i: any) => void;

	const colorMap: Record<string, string> = {
	primary: 'bg-primary hover:bg-primary/80 border border-primary text-white',
	secondary: 'bg-secondary hover:bg-secondary/80 border border-secondary text-foreground',
	success: 'bg-info hover:bg-info/80 border border-info text-white',
	info: 'bg-info hover:bg-info/80 border border-info text-white',
	warning: 'bg-warning hover:bg-warning/80 border border-warning text-white',
	danger: 'bg-danger hover:bg-danger/80 border border-danger text-white',
	muted: 'bg-muted hover:bg-muted/80 border border-muted text-foreground',
	accent: 'bg-accent hover:bg-accent/80 border border-accent text-foreground',
};

</script>

<div class="inline-flex gap-1">
	{#each actions as action}
		<button
			on:click={() => onAction(action.action, item)}
			class={`inline-flex h-[30px] items-center  gap-[6px] rounded-[4px] px-[10px] text-[20px] font-semibold capitalize transition duration-300 ease-in-out ${colorMap[action.color] || 'bg-gray-500 border-gray-500 text-white'}`}
			title={action.title}
		>
			<i class={`uil uil-${action.icon}`}></i>
		</button>
	{/each}
</div>
