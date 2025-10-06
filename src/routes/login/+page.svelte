<script lang="ts">
	import Notification from '$components/_includes/Notification.svelte';
	import Spinner from '$components/_skeletons/Spinner.svelte';
	import { login } from '$lib/auth';

	let showNotification = false;
	let notificationMessage = '';
	let notificationType = 'info';

	let username = 'konatenhamed@gmail.com';
	let password = '1234';
	$: authenticating = false;
	let showPassword = false; // To toggle password visibility
	$: message = '';
	let error = '';

	let passwordWarning = '';
	let isPasswordValid = false;

	async function handleSubmit(event: any) {
		authenticating = true;
		event.preventDefault();
		try {
			const success = await login(username, password);
			console.log('Résultat du login:', success);
			if (success.token != null) {
				window.location.href = '/admin';
			} else {
				message = 'Veuillez vérifier vos identifiants';
				authenticating = false;
				setTimeout(() => {
					message = ''; // Efface le message après 3 secondes
				}, 3000);
			}
			authenticating = false;
		} catch (error) {
			authenticating = false;
			message = 'Une erreur est survenue';
		}
	}
</script>

<main
	class="bg-full bg-normalBG relative bg-[#4075d7]" style="background-color: #4075d7;"
>
<!-- <main
	class="bg-full bg-normalBG relative bg-[url('time-4099971.jpg')] bg-top bg-no-repeat dark:bg-[#1e2836] dark:bg-[url('/admin-bg-dark.png')]"
> -->
	<!-- Main content container with responsive design -->
	<div class="scrollbar h-[calc(var(--vh,1vh)_*_100)] w-full overflow-y-auto">
		<!-- Login form container -->
		<div class="mx-auto my-[150px] flex w-full max-w-[516px] flex-col justify-center px-[30px]">
			<!-- Login form background -->
			<div class="rounded-6 shadow-regular mt-[25px] bg-white dark:bg-[#111726] dark:shadow-xl">
				<div class="border-regular top border-b p-[25px] text-center dark:border-white/[.05]">
					<a href="index.html" class="text-center">
						<!-- Logo for the light theme -->
						<img
							src="/logo-dark.png"
							alt="image"
							class="inline dark:hidden"
							width="250"
							height="250"
						/>
						<!-- Logo for the dark theme -->
						<img
							src="/logo-dark.png"
							alt="image"
							class="hidden dark:inline"
							width="250"
							height="250"
						/>
					</a>
					<!-- Heading for the login form -->
					<h2 class="text-18 text-dark dark:text-title-dark mt-6 mb-0 leading-[1] font-semibold">
						Connectez-vous ici
					</h2>
				</div>

				<!-- Login form inputs and elements -->
				<div class="px-[40px] py-[30px]">
					<form id="admin-formxx" on:submit|preventDefault={handleSubmit}>
						<!-- Email Address input -->
						<div class="mb-6">
							<label
								for="email-username"
								class="text-dark mb-[8px] inline-block w-full text-[14px] leading-[1.4285714286] font-medium capitalize dark:text-gray-300"
								>Username</label
							>
							<input
								bind:value={username}
								type="text"
								id="email-username"
								class="border-regular rounded-4 focus:ring-primary focus:border-primary flex h-[48px] w-full items-center border-1 px-[20px] py-[10px] text-[14px] leading-[1.5] font-normal shadow-none placeholder:text-[#A0A0A0]"
								placeholder="Entrez votre pseudo"
								autocomplete="off"
								required
							/>
						</div>

						<!-- Password input -->
						<div class="mb-6">
							<label
								for="password"
								class="text-dark mb-[8px] inline-block w-full text-[14px] leading-[1.4285714286] font-medium capitalize dark:text-gray-300"
							>
								Mot de passe</label
							>
							<div class="relative w-full">
								<div class="absolute inset-y-0 end-0 flex items-center px-[15px]">
									<input class="js-password-toggle hidden" id="toggle" type="checkbox" />
									<label
										class=" text-light js-password-label dark:text-subtitle-dark cursor-pointer rounded text-[15px]"
										for="toggle"><i class="uil uil-eye-slash"></i></label
									>
								</div>
								<input
									bind:value={password}
									class="border-regular rounded-4 focus:ring-primary focus:border-primary js-password flex h-[48px] w-full items-center border-1 px-[20px] py-[10px] text-[14px] leading-[1.5] font-normal shadow-none placeholder:text-[#A0A0A0]"
									id="password"
									type="password"
									autocomplete="off"
									placeholder="Entrez votre mot de passe"
								/>
							</div>
						</div>

						<!-- Remember me and forgot password options -->
						<div
							class="mt-[23px] mb-[19px] flex items-center justify-center gap-[15px] capitalize max-sm:flex-wrap sm:justify-between"
						>
							<div class="flex"></div>
							<a
								class="text-13 hover:text-dark dark:hover:text-title-dark text-[#00baff]"
								href="/login/mot_passe_oublie">Mot de passe oublié?</a
							>
						</div>

						<!-- Submit button for the login form -->
						<button
							type="submit"
							class="text-14 rounded-6 bg-primary hover:bg-primary-hbr border-primary inline-flex h-[48px] w-full cursor-pointer items-center justify-center font-medium text-white transition duration-300"
							value="submit"
							style="background-color: #54a0fe !important;"
						>
							{#if authenticating}
								<div class="grid w-full grid-cols-3">
									<div>
										<Spinner />
									</div>
									<div class="col-span-1 flex flex-col justify-items-start">Se connecter</div>
								</div>
							{:else}
								Se connecter
							{/if}
						</button>
					</form>

					{#if !authenticating && message !== ''}
						<div
							class="relative mt-2 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
							role="alert"
						>
							<strong class="font-bold">Oups erreur!</strong>
							<span class="block sm:inline">{message}</span>
						</div>
					{/if}
				</div>

				<!-- Footer with signup link -->
				<!--  <div class="text-center p-[25px] rounded-b-6 bg-deepBG dark:bg-gray-600">
                <p class="text-[14px] font-medium text-body dark:text-title-dark inline-flex items-center gap-[6px] mb-0">
                    Vous n'avez pas de compte ?
                    S'inscrire <a class="transition duration-300 text-primary hover:text-dark dark:text-dark dark:hover:text-subtitle-dark" href="sign-up.html">Sign up</a>
                </p>
             </div> -->
			</div>
		</div>
	</div>

	<!-- End of the content block -->
</main>
