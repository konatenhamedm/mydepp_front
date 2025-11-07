<script lang="ts">
    import InputCheck from "$components/inputs/InputCheck.svelte";
    import InputSimple from "$components/inputs/InputSimple.svelte";
    import { Button, Modal } from "flowbite-svelte";
 
  import { formatDate } from "$lib/dateUtils";

    export let open: boolean = false;
    export let sizeModal: string = "lg";
    export let data: Record<string, any> = {};
    
    const url_image = "https://depps.leadagro.net/uploads/";

    let montant = "";
    let reference = "";
    let channel = "";
    let state = "";
    let type = "";
    let user = {
        username: "",
        typeUser: "",
        typePersonne: "",
        nom: "",
        prenoms: "",
        denomination: "",
  
        email: "",
             data : []
    };
    let createdAt = "";

    function init() {
        console.log("Données reçues :", data);

        montant = data?.montant || "";
        reference = data?.reference || "";
        channel = data?.channel || "";
        state = data?.state || "";
        type = data?.type || "";
        user = data?.user || {};``
        user.username = data?.user?.username || "";
        user.typePersonne = data?.user?.typePersonne || "";
        user.nom = data?.user?.nom || "";
        user.prenoms = data?.user?.prenoms || "";
        user.denomination = data?.personne?.denomination || "";
        user.typeUser = data?.user?.typeUser || "";
        user.email = data?.user?.email || "";
       
        createdAt = data?.createdAt || "";
        user.data = data?.user?.data || [];
    }
</script>

<Modal bind:open title="Détails" size={sizeModal} class="m-4 modale_general" on:open={init}>
    <div class="space-y-6 p-4">
        <form>
            <div class="grid grid-cols-2 gap-6">
                <div class="space-y-6">
                    {#if user.typeUser == "PROFESSIONNEL"}

                    <InputSimple fieldName="username" label="Nom et prénoms utilisateur" field={user.nom + " " + user.prenoms} disabled={true} />
                    {:else}
                    <InputSimple fieldName="username" label="Nom utilisateur" field={user.username} disabled={true} />

                    {/if}
                    <InputSimple fieldName="email" label="Email" field={user.email} disabled={true} />
                    <InputSimple fieldName="typeUser" label="Type d'utilisateur" field={user.typeUser} disabled={true} />
                    <InputSimple fieldName="createdAt" label="Date de création" field={formatDate(createdAt)} disabled={true} />
                </div>
                <div class="space-y-6">
                    <InputSimple fieldName="montant" label="Montant" field={montant} disabled={true} />
                    <InputSimple fieldName="reference" label="Référence" field={reference} disabled={true} />
                    <InputSimple fieldName="channel" label="Canal" field={channel} disabled={true} />
                    <InputSimple fieldName="state" label="État" field={state == "1" ? "Paiement éffectué" : "Paiement échoué"} disabled={true} />
                    
                </div>
            </div>
        </form>
    </div>
    <div slot="footer" class="w-full grid grid-cols-3">
  <!-- Place le bouton dans la troisième colonne -->
  <div class="col-start-3 flex justify-end">
    <Button
    color="alternative"
    style="background-color: gray !important; color: white;"
    on:click={() => (open = false)}
    type="submit">{"Fermer"}</Button
  >

   <!--  <Button
    color="dark"
    style="background-color: black;"
    on:click={() => (open = false)}>Annuler</Button
  > -->
  </div>
</div>

</Modal>
