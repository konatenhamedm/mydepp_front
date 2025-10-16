<script>
  import { apiFetch } from "$lib/api";
  import axios from "axios";
  import { onMount } from "svelte";

  export let formdata;
  let professions = [];

  async function getAllProfessions() {
    await axios.get( "https://prodmydepps.leadagro.net/api/typeProfession").then((response) => {
      professions = response.data.data;
      console.log("YYYYYY", professions);
    }).catch((error) => {
      console.error("Erreur lors de la récupération des professions", error);
      professions = [];
    });
  }

  onMount(async () => {
    await getAllProfessions();
    console.log("formdata dans formStep2", professions);
  });
</script>

<main>
  <form>
    <div class=" p-6 rounded-lg shadow-m mb-4">
      <!-- Radios: Profession -->
      <div
        class="grid grid-cols-1 md:grid-cols-2  gap-6 mb-4"
      >
        {#each professions as professionGP}
          <div class="form__group mb-4">
            <label
              class="form_label font-bold block mb-2"
              for="profession-{professionGP.libelle}"
            >
              <big>{professionGP.libelle}</big>
            </label>

            {#each professionGP.professions as profession}
              <div class="flex items-center space-x-2">
                <input
                  type="radio"
                  id={profession.code}
                  name="rd_profession"
                  class="cursor-pointer"
                  value={profession.code}
                  checked={formdata.profession === profession.code}
                  on:change={() => (formdata.profession = profession.code)}
                />
                <label for={profession.code} class="cursor-pointer"
                  >{profession.libelle}</label
                >
              </div>
            {/each}
          </div>
        {/each}
      </div>
    </div>
  </form>
</main>

<style>
  .grid {
    display: grid;
  }
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .gap-8 {
    gap: 2rem;
  }

  /* Label */
  .block {
    display: block;
  }
  .text-sm {
    font-size: 0.875rem;
  }
  .font-semibold {
    font-weight: 600;
  }
  .text-gray-700 {
    color: #374151;
  }
  .mb-3 {
    margin-bottom: 0.75rem;
  }

  /* Input et select */
  .w-full {
    width: 100%;
  }
  .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .py-3 {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }
  .border-b-2 {
    border-bottom-width: 2px;
  }
  .border-blue-300 {
    border-color: #93c5fd;
  }
  .bg-gray-50 {
    background-color: #f9fafb;
  }
  .focus\:bg-white:focus {
    background-color: #fff;
  }
  .focus\:border-blue-500:focus {
    border-color: #3b82f6;
  }
  .focus\:outline-none:focus {
    outline: none;
  }
  .transition-all {
    transition-property: all;
    transition-duration: 0.2s;
  }
  .duration-200 {
    transition-duration: 0.2s;
  }
  .pr-8 {
    padding-right: 2rem;
  }

  /* Pour l'icône de flèche */
  .absolute {
    position: absolute;
  }
  .right-3 {
    right: 0.75rem;
  }
  .top-1\/2 {
    top: 50%;
  }
  .transform {
    transform: translateY(-50%);
  }
  .w-5 {
    width: 1.25rem;
  }
  .h-5 {
    height: 1.25rem;
  }
  .flex {
    display: flex;
  }
  .items-center {
    align-items: center;
  }
  .justify-center {
    justify-content: center;
  }
  .text-gray-400 {
    color: #9ca3af;
  }
</style>
