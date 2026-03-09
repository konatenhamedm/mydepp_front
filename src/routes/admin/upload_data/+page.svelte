<script lang="ts">
  import { apiFetch, BASE_URL_API, BASE_URL_API_V2 } from "$lib/api";

  import { onMount } from "svelte";

  // Liste d'exemple de spécialités, à remplacer par tes vraies données si besoin
  let specialites: Array<any> = [];
  let selectedSpecialite = "";
  let files: FileList | null = null;

  async function getSpecialites() {
    try {
      const res = await apiFetch(true, `/profession/`);
      console.log(res);
      if (res) {
        specialites = res.data;
      } else {
        console.error("Structure inattendue:", res);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des spécialités:", error);
    }
  }

  onMount(() => {
    getSpecialites();
  });

  function handleFileChange(event: Event) {
    files = (event.target as HTMLInputElement).files;
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    if (!selectedSpecialite || !files?.length) {
      alert(
        "Veuillez choisir une spécialité et sélectionner au moins un fichier."
      );
      return;
    }
    const formData = new FormData();
    formData.append("path", files[0]);
    console.log("Fichiers sélectionnés :", files);
    await fetch(BASE_URL_API + "/upload/upload-excel/files", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Succès :", data);
        alert(
          `Spécialité : ${specialites.find(s => s.id === selectedSpecialite)?.libelle}\nFichiers : ${files ? files[0].name : 'Votre fichier'}\nUpload réussi !`
        );
      });
  }
</script>

<main class="upload-container">
  <h1 class="upload-title">Upload de fichiers par spécialité</h1>
  <form class="upload-form" on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
      <label for="specialite" class="form-label">Choisir une spécialité</label>
      <select
        id="specialite"
        bind:value={selectedSpecialite}
        class="form-select"
      >
        <option value="" disabled selected>-- Sélectionner --</option>
        {#each specialites as s}
          <option value={s.id}>{s.libelle}</option>
        {/each}
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Uploader des fichiers</label>
      <div
        class="upload-dropzone"
        on:click={() => document.getElementById("fichiers")?.click()}
        tabindex="0"
        on:keydown={(e) => {
          if (e.key === "Enter" || e.key === " ")
            document.getElementById("fichiers")?.click();
        }}
      >
        <span class="upload-instruction"
          >Veuillez <b>cliquer ici</b> pour charger vos fichiers</span
        >
        <input
          id="fichiers"
          type="file"
          multiple
          accept=".xls,.xlsx,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
          on:change={handleFileChange}
          class="hidden-input"
        />
      </div>
    </div>
    <button type="submit" class="submit-btn">Envoyer</button>
  </form>
  {#if files?.length}
    <div class="selected-files">
      <h2 class="selected-title">Fichiers sélectionnés :</h2>
      <ul class="selected-list">
        {#each Array.from(files) as file}
          <li class="selected-item">{file.name}</li>
        {/each}
      </ul>
    </div>
  {/if}
</main>

<!-- <style>
	main {
		background: #f9f9f9;
	}
</style> -->

<style>
  .upload-dropzone {
    border: 2.5px dashed #4075d7;
    border-radius: 1rem;
    background: #f8fafc;
    padding: 2.2rem 1rem;
    text-align: center;
    color: #4075d7;
    font-size: 1.08rem;
    cursor: pointer;
    margin-top: 0.2rem;
    margin-bottom: 0.2rem;
    transition:
      background 0.2s,
      border-color 0.2s;
    outline: none;
    position: relative;
    min-height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .upload-dropzone:hover,
  .upload-dropzone:focus {
    background: #e0e7ff;
    border-color: #5e60ce;
  }
  .upload-instruction {
    color: #4075d7;
    font-size: 1.08rem;
    user-select: none;
  }
  .upload-instruction b {
    color: #2d3a4a;
    font-weight: 600;
    text-decoration: underline dotted;
  }
  .hidden-input {
    display: none;
  }
  .upload-container {
    max-width: 430px;
    margin: 3rem auto 0 auto;
    padding: 2.5rem 2rem 2rem 2rem;
    background: linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%);
    border-radius: 1.5rem;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
    min-height: 70vh;
    overflow-y: auto;
    border: 1px solid #e0e7ef;
    position: relative;
  }
  .upload-title {
    font-size: 2.1rem;
    font-weight: 700;
    margin-bottom: 2.2rem;
    text-align: center;
    color: #2d3a4a;
    letter-spacing: 0.01em;
  }
  .upload-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .form-label {
    font-weight: 500;
    color: #3b4252;
    margin-bottom: 0.2rem;
  }
  .form-select {
    padding: 0.7rem 1rem;
    border-radius: 0.7rem;
    border: 1.5px solid #bfc9d9;
    background: #f1f5fa;
    font-size: 1rem;
    outline: none;
    transition: border 0.2s;
  }
  .form-select:focus {
    border-color: #4075d7;
    background: #e0e7ff;
  }
  .form-input-file {
    padding: 0.5rem 0.2rem;
    border-radius: 0.7rem;
    border: 1.5px solid #bfc9d9;
    background: #f1f5fa;
    font-size: 1rem;
    outline: none;
    transition: border 0.2s;
  }
  .form-input-file:focus {
    border-color: #4075d7;
    background: #e0e7ff;
  }
  .submit-btn {
    background: linear-gradient(90deg, #4075d7 60%, #5e60ce 100%);
    color: #fff;
    font-weight: 600;
    padding: 0.8rem 0;
    border: none;
    border-radius: 0.7rem;
    font-size: 1.1rem;
    cursor: pointer;
    box-shadow: 0 2px 8px 0 rgba(64, 117, 215, 0.08);
    transition:
      background 0.2s,
      box-shadow 0.2s;
  }
  .submit-btn:hover {
    background: linear-gradient(90deg, #5e60ce 60%, #4075d7 100%);
    box-shadow: 0 4px 16px 0 rgba(64, 117, 215, 0.13);
  }
  .selected-files {
    margin-top: 2.2rem;
    background: #f1f5fa;
    border-radius: 1rem;
    padding: 1.2rem 1rem 1rem 1rem;
    box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.06);
  }
  .selected-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.7rem;
    color: #2d3a4a;
  }
  .selected-list {
    list-style: disc inside;
    color: #3b4252;
    font-size: 1rem;
    padding-left: 0.5rem;
  }
  .selected-item {
    margin-bottom: 0.2rem;
    padding-left: 0.2rem;
  }
</style>
