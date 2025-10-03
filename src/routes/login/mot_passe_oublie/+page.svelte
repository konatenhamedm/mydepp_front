<script lang="ts">
	import Spinner from "../../../components/_skeletons/Spinner.svelte";
	import MetaTag from "$lib/utils/MetaTag.svelte";
	import { login, verfication, motPasseOublie } from "$lib/auth";

	let email = "";
	let newPassword = "";
	let message = "";
	let authenticating = false;
	let showPassword = false;
	let passwordWarning = "";
	let isPasswordValid = false;

	$: {
		if (newPassword.length > 0 && newPassword.length < 8) {
			passwordWarning = "Le mot de passe doit comporter au moins 8 caractères.";
			isPasswordValid = false;
		} else {
			passwordWarning = "";
			isPasswordValid = true;
		}
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		authenticating = true;
		message = "";

		try {
			const verif = await verfication(email);
			if (verif.existe && verif.confirmed) {
				const status = await motPasseOublie(email, newPassword);
				if (status) {
					const success = await login(email, newPassword);
					if (success) window.location.href = "/admin";
					else message = "Veuillez réessayer plus tard, un problème est survenu.";
				} else {
					message = status.message;
				}
			} else if (verif.existe && !verif.confirmed) {
				window.location.href = "/login/confirmation";
			} else {
				message = "Aucun compte n'est associé à cet email.";
			}
		} catch (err) {
			message = "Une erreur est survenue.";
		} finally {
			authenticating = false;
		}
	}

	const path = "/login/mot_passe_oublie";
	const description = "Mot de passe oublié lebedoo";
	const title = "Admin | mot de passe oublié";
	const subtitle = "Mot de passe oublié";
</script>

<MetaTag {path} {description} {title} {subtitle} />

<div class="flex justify-center items-center min-h-screen bg-gray-100 px-4 bg-[url('images/admin/bg1.png')] bg-top bg-no-repeat bg-full">
	<div class="w-full max-w-md">
		

		<div class="bg-white rounded-lg shadow p-6">
            <div class="flex justify-center mb-6">
                <img src="/lebedoo_inline_logod.png" alt="Logo" class="h-10" width="250" height="250" />
            </div>
			<h2 class="text-xl font-semibold text-gray-800 mb-4 mt-3">Mot de passe oublié ?</h2>
			<p class="text-gray-600 text-sm mb-6">
				Entrez l’adresse email associée à votre compte. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
			</p>

			<form on:submit={handleSubmit}>
				<div class="mb-4">
					<label for="email" class="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						placeholder="email@exemple.com"
						required
						class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
					/>
				</div>

				<div class="mb-4">
					<label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
					<div class="relative">
						<input
							id="newPassword"
							type={showPassword ? "text" : "password"}
							bind:value={newPassword}
							placeholder="Entrez votre nouveau mot de passe"
							required
							class="w-full px-3 py-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
						/>
						<button
							type="button"
							class="absolute inset-y-0 right-2 flex items-center text-gray-600"
							on:click={() => (showPassword = !showPassword)}
							tabindex="-1"
						>
							{#if showPassword}
								👁️‍🗨️
							{:else}
								👁️
							{/if}
						</button>
					</div>
					{#if passwordWarning}
						<p class="text-xs text-red-500 mt-1">{passwordWarning}</p>
					{/if}
				</div>

				{#if message && !authenticating}
					<div class="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
						{message}
					</div>
				{/if}

				<button
					type="submit"
					class="w-full flex justify-center items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 px-4 rounded disabled:opacity-50"
					disabled={!isPasswordValid || authenticating}
                    style="background-color: #54a0fe !important;"
				>
					{#if authenticating}
						<Spinner size_height="18px" />
						<span>Connexion...</span>
					{:else}
						Confirmer la modification
					{/if}
				</button>

				<div class="mt-4 text-center">
					<a href="/" class="text-sm text-sky-500 hover:underline">Retour à la connexion</a>
				</div>
			</form>
		</div>
	</div>
</div>
