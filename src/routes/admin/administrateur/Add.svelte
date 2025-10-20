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

    export let open: boolean = false; // modal control
    let isLoad = false;

    let showNotification = false;
    let notificationMessage = "";
    let notificationType = "info";

    let userdata: any = [];
    let errors: any = {
        nom: "",
        prenoms: "",
        email: "",
        password: "",
        confirmPassword: "",
        typeUser: "",
    };
    // Initializing the user object with only email and status
    let devise: any = {
        confirmPassword: "",
        password: "",
        email: "",
        nom: "",
        prenoms: "",
        typeUser: "",
    };

    let typeUser: any = [
        {
            id: "deviseISTRATEUR",
            libelle: "deviseISTRATEUR",
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

    export let data: Record<string, string> = {};

    function init(form: HTMLFormElement) {}

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    function validateForm() {
        let isValid = true;
        errors = {
            nom: "",
            prenoms: "",
            email: "",
            password: "",
            confirmPassword: "",
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

        if (!devise.email.trim()) {
            errors.email = "L'email est requis";
            isValid = false;
        } else if (!emailRegex.test(devise.email)) {
            errors.email = "L'email n'est pas valide";
            isValid = false;
        }

        if (!devise.password.trim()) {
            errors.password = "Le mot de passe est requis";
            isValid = false;
        }

        if (!devise.confirmPassword.trim()) {
            errors.confirmPassword =
                "La confirmation du mot de passe est requise";
            isValid = false;
        }

        if (!devise.typeUser.trim()) {
            errors.typeUser = "Le type utilisateur est requis";
            isValid = false;
        }

        return isValid;
    }

    async function SaveFunction() {
        if (!validateForm()) {
            notificationMessage =
                "Veuillez renseigner  les champs requis du formulaire";
            notificationType = "error";
            showNotification = true;
            return;
        }
        isLoad = true;
        try {
            // Créer un objet FormData
            const formData = new FormData();
            formData.append("nom", devise.nom);
            formData.append("prenoms", devise.prenoms);
            formData.append("password", devise.password);
            formData.append("confirmPassword", devise.confirmPassword);
            formData.append("email", devise.email);
            formData.append("typeUser", devise.typeUser);

            const res = await fetch(BASE_URL_API + "/user/admin/create", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                isLoad = false;
                open = false;
                notificationMessage = "utilisateur créé avec succès!";
                notificationType = "success";
                showNotification = true;
            } else {
                // Gérer les erreurs de réponse HTTP
                const errorData = await res.json();
                notificationMessage =
                    errorData.message || "Erreur lors de l'enregistrement";
                notificationType = "error";
                showNotification = true;
                isLoad = false;
            }
        } catch (error) {
            notificationMessage =
                "Une erreur est survenue lors de l'enregistrement";
            notificationType = "error";
            showNotification = true;
            isLoad = false;
            console.error("Error saving:", error);
        }
    }

    function handleFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            devise.flag = input.files[0];
        }
    }

    function handleModalClose(event: Event) {
        if (isLoad) {
            event.preventDefault();
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
            <div class="grid grid-cols-1 gap-6 mb-4">
                <InputSimple
                    type="email"
                    fieldName="email"
                    label="Email"
                    bind:field={devise.email}
                    placeholder="entrez email"
                    required={true}
                    error={errors.email}
                ></InputSimple>
            </div>

            <div class="grid grid-cols-2 gap-6 mb-4">
                <InputSimplePassword
                    id="password"
                    label="Mot de passe"
                    bind:value={devise.password}
                    placeholder="entrez le mot de passe"
                    required={true}
                    error={errors.password}
                />
                <InputSimplePassword
                    id="confirmPassword"
                    label="Confirmez le mot de passe"
                    bind:value={devise.confirmPassword}
                    placeholder="entrez le mot de passe confirme"
                    required
                    error={errors.confirmPassword}
                />
            </div>
            <div class="grid grid-cols-1 gap-6">
                <InputSelect
                    label="Type utilisateur"
                    bind:selectedId={devise.typeUser}
                    datas={typeUser}
                    id="typeUser"
                    required={true}
                    error={errors.typeUser}
                />
                <!--  <span>valeur-{devise.typeUser}</span> -->
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
