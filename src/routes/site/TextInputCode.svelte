<script lang="ts">
  export let label: string;
  export let type: "text" | "date" | "email" | "tel" = "text";
  export let value: string = "";
  export let placeholder: string = "";
  export let error: string | null = null;
  export let onInput: (event: Event) => void = () => {};
  export let disabled: boolean = false;

  let emailError: string | null = null;
  let phoneError: string | null = null;
  let ageError: string | null = null;
  let formData: Record<string, string> = {};
  export let step: any; 

  function validateInput(event: Event) {
    const target = event.target as HTMLInputElement;
    value = target.value;
    onInput(event);

    
    formData[label] = value;
    saveFormState();

   
    validateCode(value).then((isValid) => {
        error = isValid ? null : "Votre code existe deja ou est invalide";
      });
    

   
  }

  function saveFormState() {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      localStorage.setItem("formData", JSON.stringify(formData));
      localStorage.setItem("step", step.toString());
    }
  }

  async function validateCode(code: string): Promise<boolean> {

    try {
      const res = await fetch(
        `https://depps.leadagro.net/api/professionnel/existe/code/${code}`
      );
      const data = await res.json();
       return data.data;
      
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de la transaction :",
        error
      );
      return false;
    }

  }




</script>

<div class="form__group">
  <label for="{label}" class="block text-2xl font-medium mb-1">{label} *</label>
  <input
    id="{label}"
    type={type}
    bind:value
    class="w-full form__input"
    placeholder={placeholder}
    on:input={validateInput}
    disabled={disabled}
  />
  
  {#if error}
    <p class="text-red-500 text-sm">{error}</p>
  {/if}

</div>
