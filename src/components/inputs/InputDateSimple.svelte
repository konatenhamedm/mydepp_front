<script lang="ts">

export let label: string;
export let field: any;
export let fieldName: string;
export let placeholder: string = "";
export let disabled: boolean = false;
</script>




<div class="mb-2">
	<label
		for="email"
		class="dark:text-title-dark mb-2 block text-sm font-medium text-gray-900 capitalize"
	>
		{ label}
	</label>
    <input type="date"  name={fieldName}   disabled={disabled}  class="select2 rounded-4 dark:bg-box-dark-up border !border-black text-body dark:text-subtitle-dark focus:ring-primary focus:border-primary min-h-[50px] w-full border border-black px-[20px] py-[12px] text-[15px] outline-none placeholder:text-[#A0A0A0]" placeholder="{placeholder}"
    id="startDate"
     bind:value={field}
      />
</div>