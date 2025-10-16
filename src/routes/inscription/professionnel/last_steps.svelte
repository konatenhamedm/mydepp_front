<script>
    export let formdata;
</script>

<main>
    <div
        class="grid grid-cols-1 md:grid-cols-2  gap-6 mb-4"
      >
        
          <div class="form__group mb-4">
            <label
              class="form_label font-bold block mb-2"
              for="appartenance"
            >
              <big>Appartenez-vous à une organisation ? </big>
            </label>

         
              <div class="flex items-center space-x-2">
                <input
                  type="radio"
                  id={"appartenance_oui"}
                  name="rd_profession"
                  class="cursor-pointer"
                  value={"oui"}
                  checked={formdata.appartenirOrganisation === "oui"}
                  on:change={() => (formdata.appartenirOrganisation = "oui")}
                />
                <label for={"appartenance_oui"} class="cursor-pointer"
                  >Oui</label
                >
              </div>
               <div class="flex items-center space-x-2">
                <input
                  type="radio"
                  id={"appartenance_non"}
                  name="rd_profession"
                  class="cursor-pointer"
                  value={"non"}
                  checked={formdata.appartenirOrganisation === "non"}
                  on:change={() => (formdata.appartenirOrganisation = "non")}
                />
                <label for={"appartenance_non"} class="cursor-pointer"
                  >Non</label
                >
              </div>
           
          </div>
      

           <div class="form__group mb-4">
            <label
              class="form_label font-bold block mb-2"
              for="ordre"
            >
              <big>Appartenez-vous à un ordre ? </big>
            </label>

         
              <div class="flex items-center space-x-2">
                <input
                  type="radio"
                  id={"ordre_oui"}
                  name="rd_ordre"
                  class="cursor-pointer"
                  value={"oui"}
                  checked={formdata.appartenirOrdre === "oui"}
                  on:change={() => (formdata.appartenirOrdre = "oui")}
                />
                <label for={"ordre_oui"} class="cursor-pointer"
                  >Oui</label
                >
              </div>
               <div class="flex items-center space-x-2">
                <input
                  type="radio"
                  id={"ordre_non"}
                  name="rd_ordre"
                  class="cursor-pointer"
                  value={"non"}
                  checked={formdata.appartenirOrdre === "non"}
                  on:change={() => (formdata.appartenirOrdre = "non")}
                />
                <label for={"ordre_non"} class="cursor-pointer"
                  >Non</label
                >
              </div>
           
          </div>
      </div>
</main>

<style></style>