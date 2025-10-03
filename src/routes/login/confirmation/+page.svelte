<script lang="ts">
	import Spinner from '../../../components/_skeletons/Spinner.svelte';
	import Notification from '../../../components/_includes/Notification.svelte';
	import MetaTag from '$lib/utils/MetaTag.svelte';
	import { login, verfication, confirmationCompte } from '$lib/auth';

	let email = '';
	let newPassword = '';
	let showPassword = false;
	let message = '';
	let authenticating = false;
	let passwordWarning = '';
	let isPasswordValid = false;

	let notificationMessage = 'Veuillez confirmer votre compte !';
	let notificationType = 'danger';
	let showNotification = true;

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
		message = '';
		try {
			const verif = await verfication(email);
			if (verif.existe) {
				if (!verif.confirmed) {
					const result = await confirmationCompte(email, newPassword);
					if (result.status) {
						const loggedIn = await login(email, newPassword);
						if (loggedIn) {
							window.location.href = '/admin';
						} else {
							message = "Une erreur est survenue lors de la connexion.";
						}
					} else {
						message = result.message;
					}
				} else {
					window.location.href = '/';
				}
			} else {
				message = "Aucun compte n'est associé à cet email.";
			}
		} catch (error) {
			message = "Une erreur est survenue.";
		} finally {
			authenticating = false;
		}
	}

	const path = '/login/confirmation';
	const description = 'Confirmation du compte Lebedoo';
	const title = 'Admin | Confirmation du compte';
	const subtitle = 'Confirmation du compte';
</script>

<MetaTag {path} {description} {title} {subtitle} />

<div class="min-h-screen bg-gray-50 flex items-center justify-center bg-full bg-[url('../images/admin/bg1.png')] bg-top bg-no-repeat">
	<div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
		<div class="text-center mb-6">
			<img src="/lebedoo_inline_logod.png" alt="Lebedoo" class="mx-auto h-12" />
		</div>

		<h2 class="text-xl font-semibold text-gray-700 text-center mb-4">
			Confirmation du compte
		</h2>

		<form on:submit={handleSubmit} class="space-y-4">
			<p class="text-gray-500 text-sm text-center">
				Entrez votre adresse email et définissez un mot de passe.
			</p>

			<div>
				<label for="email" class="block text-sm font-medium text-gray-700 mb-1">Adresse Email</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
					placeholder="nom@exemple.com"
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
				<div class="relative">
					<input
						id="password"
						type={showPassword ? 'text' : 'password'}
						bind:value={newPassword}
						required
						class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
						placeholder="Entrez votre mot de passe"
					/>
					<button
						type="button"
						class="absolute inset-y-0 right-3 flex items-center text-gray-500"
						on:click={() => (showPassword = !showPassword)}
					>
						{#if showPassword} 👁️‍🗨️ {:else} 👁️ {/if}
					</button>
				</div>
				{#if passwordWarning}
					<p class="text-xs text-red-500 mt-1">{passwordWarning}</p>
				{/if}
			</div>

			<div>
				<button
					type="submit"
					class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
					disabled={!isPasswordValid || authenticating}
                    style="background-color: #54a0fe !important;"
				>
					{#if authenticating}
						<Spinner />
						Confirmation...
					{:else}
						Confirmer
					{/if}
				</button>
			</div>

			{#if message}
				<div class="bg-red-100 text-red-700 text-sm p-3 rounded mt-2">
					{message}
				</div>
			{/if}

			<div class="text-center mt-4">
				<a href="/" class="text-sm text-blue-600 hover:underline">Retour à la connexion</a>
			</div>
		</form>
	</div>
</div>

{#if showNotification}
	<Notification message={notificationMessage} type={notificationType} duration={5000} />
{/if}
