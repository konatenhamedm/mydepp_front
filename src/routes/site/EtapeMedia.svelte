<script lang="ts">
    import { onMount } from "svelte";
  
    export let step;
    export let formData: any;
    export let errors: Record<string, string | undefined>;
    export let handleFileChange: (event: Event, fieldName: string) => void;
  
    let fileNames: { [key: string]: { name: string; url: string | null } } = {};
    let selectedFiles: { [key: string]: { name: string; data: string | null } } = {};
  
   
    function updateFormData(fieldName: string, file: File | null) {
        if (!file) return;
  
        const reader = new FileReader();
        reader.readAsDataURL(file);
  
        reader.onload = () => {
            const result = typeof reader.result === "string" ? reader.result : null;

            selectedFiles = {
                ...selectedFiles,
                [fieldName]: { name: file.name, data: result },
            };
  
            fileNames = {
                ...fileNames,
                [fieldName]: { name: file.name, url: result },
            };
  
           
            formData[fieldName] = file;
  
            
            localStorage.setItem("selectedFiles", JSON.stringify(selectedFiles));
        };
    }
  
 
    function handleFileChange2(event: Event, fieldName: string) {
        const input = event.target as HTMLInputElement;
        const file = input.files ? input.files[0] : null;
        updateFormData(fieldName, file);
    }
  
   
    const mediaFields = [
        { key: "photo", label: "Photo d'identité", type: "file" },
        { key: "cni", label: "Copie CNI (Carte nationale d’identité)", type: "file" },
        { key: "casier", label: "Extrait Casier judiciaire (moins de 3 mois)", type: "file" },
        { key: "diplomeFile", label: "Diplôme légalisé", type: "file" },
        { key: "certificat", label: "Certificat de résidence (moins de 3 mois)", type: "file" },
        { key: "cv", label: "CV", type: "file" },
    ];
  
   
    onMount(() => {
        const storedFiles: { [key: string]: { name: string; data: string | null } } = JSON.parse(localStorage.getItem("selectedFiles") || '{}');
        selectedFiles = storedFiles;
  
    
        fileNames = Object.keys(storedFiles).reduce((acc: { [key: string]: { name: string; url: string | null } }, key) => {
            acc[key] = { name: storedFiles[key].name, url: storedFiles[key].data };
            return acc;
        }, {});
  
       
        Object.keys(storedFiles).forEach((key) => {
            formData[key] = storedFiles[key].data; 
        });
    });
</script>
  
{#if step === 4}
    <h2 class="h2-baslik-anasayfa-ozel h-yazi-margin-kucuk">
        Informations médiatiques (étape 4/6)
    </h2>
  
    <div class="tablo">
        <div class="tablo--1h-ve-2">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {#each mediaFields as field}
                    <div class="form__group">
                        <label class="form_label" for={field.key}>{field.label}</label>
                        <div class="input-container">
                            {#if fileNames[field.key]}
                                <img
                                    src={fileNames[field.key].url || ''}
                                    alt={fileNames[field.key].name}
                                    class="preview-image"
                                />
                            {/if}
                            <input
                                id={field.key}
                                type={field.type}
                                class="form__input"
                                on:change={(e) => handleFileChange(e, field.key)}
                            />
                        </div>
  
                        {#if fileNames[field.key]}
                            <p>
                                {fileNames[field.key].name}
                                <a
                                    href={fileNames[field.key].url || undefined}
                                    download={fileNames[field.key].name}
                                    class="download-link"
                                >
                                    📥 Télécharger
                                </a>
                            </p>
                        {/if}
  
                        {#if errors[field.key]}
                            <p class="text-red-500 text-sm">{errors[field.key]}</p>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
    </div>
{/if}
  
<style>
    .tablo {
        display: flex;
        flex-direction: column;
    }
  
    .form__group {
        flex: 1;
        min-width: 250px;
    }
  
    .download-link {
        margin-left: 10px;
        color: blue;
        text-decoration: underline;
        cursor: pointer;
    }
  
    .input-container {
        display: flex;
        align-items: center;
        gap: 10px;
    }
  
    .preview-image {
        width: 50px;
        height: 50px;
        border-radius: 5px;
        object-fit: cover;
    }
  
    .form__input {
        flex-grow: 1;
    }
  
    .download-link {
        margin-left: 10px;
        color: blue;
        text-decoration: none;
    }
  
    .download-link:hover {
        text-decoration: underline;
    }
  
    .text-red-500 {
        color: red;
    }
</style>
