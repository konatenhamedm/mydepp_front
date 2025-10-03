<script>
    import { Button, Input, Label, Modal, Textarea } from 'flowbite-svelte';
export let label;
export let field = "";
export let fieldName;
export let rows = 4;
export let placeholder = "";

</script>
<Label class="col-span-6 space-y-2">
    <span>{label}</span>
    <Textarea
        id="{fieldName}" bind:value={field}
        rows="{rows}"
        class="rounded-4 dark:bg-box-dark-up border !border-black text-body dark:text-subtitle-dark focus:ring-primary focus:border-primary min-h-[50px] w-full border border-black px-[20px] py-[12px] text-[15px] outline-none placeholder:text-[#A0A0A0]"
        placeholder="{placeholder}"
    >
        
    </Textarea>
</Label>