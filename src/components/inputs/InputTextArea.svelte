<script lang="ts">
    import { Button, Input, Label, Modal, Textarea } from 'flowbite-svelte';
    
    export let label: string = '';
    export let field: string = "";
    export let fieldName: string = '';
    export let rows: number = 4;
    export let placeholder: string = '';
    export let required: boolean = false;
    export let error: string = '';
</script>

<div class="col-span-6 space-y-2">
    {#if label}
        <Label for="{fieldName}">
            {label}
            {#if required}
                <span class="text-red-500">*</span>
            {/if}
        </Label>
    {/if}
    
    <Textarea
        id="{fieldName}" 
        bind:value={field}
        rows="{rows}"
        class={`rounded-4 min-h-[50px] w-full px-[20px] py-[12px] text-[15px] outline-none
            ${error ?  'border-red-500 focus:border-red-500 focus:ring-red-500' : 'dark:bg-box-dark-up border !border-black text-body dark:text-subtitle-dark focus:ring-primary focus:border-primary placeholder:text-[#A0A0A0]'
        }`}
        placeholder="{placeholder}"
        {required}
    />
    
    {#if error}
        <p class="mt-1 text-sm text-red-500">{error}</p>
    {/if}
</div>