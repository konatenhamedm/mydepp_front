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
  export let formData: Record<string, string> = {};
  export let step: any; 

  function validateInput(event: Event) {
    const target = event.target as HTMLInputElement;
    value = target.value;
    onInput(event);

   
    formData[label] = value;
    saveFormState();

    if (type === "email") {
      emailError = validateEmail(value) ? null : "Veuillez entrer un email valide";
    }

    if (type === "tel") {
      phoneError = validatePhone(value) ? null : "Numéro invalide. Il doit commencer par 07, 01 ou 05 et contenir 10 chiffres.";
    }

    if (type === "date") {
      ageError = validateAge(value);
    }
    if (type === "text") {
     error = error ? error : null;
    }
  }

  function saveFormState() {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      localStorage.setItem("formData", JSON.stringify(formData));
      localStorage.setItem("step", step.toString());
    }
  }

  function validateEmail(email: string): boolean {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  }

  function validatePhone(phone: string): boolean {
    const regex = /^(07|01|05)\d{8}$/;
    return regex.test(phone);
  }

  function validateAge(dateString: string): string | null {
    const birthDate = new Date(dateString);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (age < 19 || (age === 19 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))) {
      return "Vous devez avoir au moins 19 ans.";
    }
    return null;
  }

  function updateField(field: any, value: any) {
    formData[field] = value;
    localStorage.setItem("formData", JSON.stringify(formData));
  }
</script>

<div class="form__group">
  <label for="{label}" class="block text-2xl font-medium mb-1">
    {#if label == "Ilot,lot" || label == "Code d’identification"}
    {label}
    {:else}
    {label} *
    {/if}
   </label>
  <input
    id="{label}"
    type={type}
    bind:value
    class="w-full form__input"
    placeholder={placeholder}
    on:input={validateInput}
    disabled={disabled}
    on:input={(e) => {
      saveFormState();
    }}
    on:keypress={(e) => {
      if (type === 'tel' && !/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
    }}
    required={type === 'tel'}
    pattern={type === 'tel' ? "^(07|01|05)[0-9]{8}$" : ""}
  />
  
  {#if error}
    <p class="text-red-500 text-sm">{error}</p>
  {/if}

  {#if type === "email" && emailError}
    <p class="text-red-500 text-sm">{emailError}</p>
  {/if}

  {#if type === "tel" && phoneError}
    <p class="text-red-500 text-sm">{phoneError}</p>
  {/if}

<!--   {#if type === "date" && ageError}
    <p class="text-red-500 text-sm">{ageError}</p>
  {/if} -->
</div>
