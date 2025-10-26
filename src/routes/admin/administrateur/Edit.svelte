<script lang="ts">
    import InputSimple from "$components/inputs/InputSimple.svelte";
    import { apiFetch, BASE_URL_API } from "$lib/api";
    import { A, Button, Modal, Select } from "flowbite-svelte";
    import Notification from "$components/_includes/Notification.svelte";
    import InputSelect from "$components/inputs/InputSelect.svelte";
    import { onMount } from "svelte";
    import InputTextArea from "$components/inputs/InputTextArea.svelte";
    import InputUserSelect from "$components/inputs/InputUserSelect.svelte";
    import InputSimplePassword from "$components/inputs/InputSimplePassword.svelte";
    import { getAuthCookie } from "$lib/auth";

    export let open: boolean = false; // modal control
    let isLoad = false;
    let userdata: any = [];
    let showNotification = false;
    let notificationMessage = "";
    let notificationType = "info";
    let user: any = [];

    let errors: any = {
        nom: "",
        prenoms: "",
        typeUser: "",
    };

    let typeUser: any = [
        {
            id: "ADMINISTRATEUR",
            libelle: "ADMINISTRATEUR",
        },
        {
            id: "DIRECTEUR",
            libelle: "DIRECTEUR",
        },
        {
            id: "SOUS-DIRECTEUR-PROF",
            libelle: "SOUS-DIRECTEUR-PROF",
        },
        {
            id: "SOUS-DIRECTEUR-ETAB",
            libelle: "SOUS-DIRECTEUR-ETAB",
        },
        {
            id: "INSTRUCTEUR-ETAB",
            libelle: "INSTRUCTEUR-ETAB",
        },
        {
            id: "INSTRUCTEUR-SECOND-ETAB",
            libelle: "INSTRUCTEUR-SECOND-ETAB",
        },
        {
            id: "INSTRUCTEUR-PROF",
            libelle: "INSTRUCTEUR-PROF",
        },
        {
            id: "INSTRUCTEUR-SECOND-PROF",
            libelle: "INSTRUCTEUR-SECOND-PROF",
        },
        {
            id: "COMPTABLE",
            libelle: "COMPTABLE",
        },
        {
            id: "INSPECTEUR-ETAB",
            libelle: "INSPECTEUR-ETAB",
        },
    ];

    // Initializing the item object with only email and status
    let devise: any = {
        nom: "",
        prenoms: "",
        email: "",
        password: "",
        typeUser: "",
    };
    let itemdata: any = [];

    export let data: Record<string, string> = {};

    function init(form: HTMLFormElement) {
        devise = {
            email: data?.email,
            nom: data?.personne?.nom,
            prenoms: data?.personne?.prenoms,
            typeUser: data?.typeUser,
            password: "",
        };
    }

    onMount(() => {
        user = getAuthCookie();
    });

    function validateForm() {
        let isValid = true;
        errors = {
            nom: "",
            prenoms: "",
            typeUser: "",
        };

        if (!devise.nom.trim()) {
            errors.nom = "Le nom est requis";
            isValid = false;
        }

        if (!devise.prenoms.trim()) {
            errors.prenoms = "Les prénoms sont requis";
            isValid = false;
        }

        if (!devise.typeUser.trim()) {
            errors.typeUser = "Le type utilisateur est requis";
            isValid = false;
        }

        return isValid;
    }

    async function SaveFunction() {
      /*   if (!validateForm()) {
            notificationMessage =
                "Veuillez renseigner les champs requis du formulaire";
            notificationType = "error";
            showNotification = true;
            return;
        }
 */
        isLoad = true;

        try {
        
            const token = user?.token;

           
            const formData = new FormData();
            formData.append("nom", devise.nom);
            formData.append("prenoms", devise.prenoms);
            formData.append("password", "");
            formData.append("typeUser", devise.typeUser);

        
            const headers: Record<string, string> = {};
            if (token) headers["Authorization"] = `Bearer ${token}`;

            const res = await fetch(
                `${BASE_URL_API}/user/admin/update/${data?.id}`,
                {
                    method: "POST",
                    headers,
                    body: formData,
                },
            );

            if (res) {
                isLoad = false;
                open = false;
                notificationMessage = "Utilisateur modifié avec succès 🎉";
                notificationType = "success";
                showNotification = true;
            } else {
                
                notificationMessage = "Erreur lors de la modification";
                notificationType = "error";
                showNotification = true;
                isLoad = false;
            }
        } catch (error) {
            console.error("Erreur lors de l’enregistrement :", error);
            notificationMessage =
                "Une erreur est survenue lors de l'enregistrement";
            notificationType = "error";
            showNotification = true;
            isLoad = false;
        }
    }

    function handleModalClose(event: Event) {
        if (isLoad) {
            event.preventDefault();
        }
    }

    // Gérer l'upload de l'image
    let imageUrl: string | null = null;

    function handleImageUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            devise.flag = input.files[0];
            imageUrl = URL.createObjectURL(devise.flag); // Créer une URL pour l'aperçu de l'image
        }
    }
</script>

<!-- Modal Content Wrapper -->
<div class="space-y-4 rounded-lg bg-white p-1">
    <!-- Card Body -->
    <div class="space-y-6">
        <form action="#" use:init>
            <div class="grid grid-cols-2 gap-6 md:grid-cols-2">
                <InputSimple
                    type="text"
                    fieldName="nom"
                    label="Nom"
                    bind:field={devise.nom}
                    placeholder="entrez le nom"
                    required={true}
                    error={errors.nom}
                />

                <InputSimple
                    type="text"
                    fieldName="prenoms"
                    label="Prenoms"
                    bind:field={devise.prenoms}
                    placeholder="entrez le prénoms"
                    required={true}
                    error={errors.prenoms}
                ></InputSimple>
            </div>
            <div class="grid grid-cols-2 gap-6 mb-4">
                <InputSimple
                    type="email"
                    fieldName="email"
                    label="Email"
                    bind:field={devise.email}
                    placeholder="entrez email"
                    required={true}
                    disabled={true}
                ></InputSimple>
                  <InputSelect
                    label="Type utilisateur"
                    bind:selectedId={devise.typeUser}
                    datas={typeUser}
                    id="typeUser"
                    required={true}
                    error={errors.typeUser}
                />
            </div>

           
        </form>
    </div>

    <!-- Card Footer -->
    <div class="flex justify-end border-t border-gray-200 pt-4">
        {#if isLoad}
            <button
                disabled
                class="cursor-not-allowed rounded bg-blue-500 px-4 py-2 text-white opacity-50"
            >
                <div class="flex items-center space-x-2">
                    <div
                        class="h-5 w-5 animate-spin rounded-full border-b-2 border-white"
                    ></div>
                    <span>Chargement...</span>
                </div>
            </button>
        {:else}
            <button
                on:click={SaveFunction}
                class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
                Enregistrer
            </button>
        {/if}
    </div>
</div>

<!-- Notification Component -->
{#if showNotification}
    <Notification
        message={notificationMessage}
        type={notificationType}
        duration={5000}
    />
{/if}
