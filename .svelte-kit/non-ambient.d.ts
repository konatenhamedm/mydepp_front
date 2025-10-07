
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/admin" | "/admin/dashboard" | "/admin/dashboard/user" | "/admin/devise" | "/admin/features" | "/admin/liste_abonnement" | "/admin/liste_admin" | "/admin/liste_client" | "/admin/liste_magasin" | "/admin/liste_marchand" | "/admin/liste_vente" | "/admin/pays" | "/admin/role_admin" | "/admin/role_marchand" | "/admin/transactions" | "/connexion" | "/contact" | "/data" | "/inscription" | "/inscription/etablissement" | "/inscription/professionnel" | "/login" | "/login/confirmation" | "/login/mot_passe_oublie";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/admin": Record<string, never>;
			"/admin/dashboard": Record<string, never>;
			"/admin/dashboard/user": Record<string, never>;
			"/admin/devise": Record<string, never>;
			"/admin/features": Record<string, never>;
			"/admin/liste_abonnement": Record<string, never>;
			"/admin/liste_admin": Record<string, never>;
			"/admin/liste_client": Record<string, never>;
			"/admin/liste_magasin": Record<string, never>;
			"/admin/liste_marchand": Record<string, never>;
			"/admin/liste_vente": Record<string, never>;
			"/admin/pays": Record<string, never>;
			"/admin/role_admin": Record<string, never>;
			"/admin/role_marchand": Record<string, never>;
			"/admin/transactions": Record<string, never>;
			"/connexion": Record<string, never>;
			"/contact": Record<string, never>;
			"/data": Record<string, never>;
			"/inscription": Record<string, never>;
			"/inscription/etablissement": Record<string, never>;
			"/inscription/professionnel": Record<string, never>;
			"/login": Record<string, never>;
			"/login/confirmation": Record<string, never>;
			"/login/mot_passe_oublie": Record<string, never>
		};
		Pathname(): "/" | "/admin" | "/admin/" | "/admin/dashboard" | "/admin/dashboard/" | "/admin/dashboard/user" | "/admin/dashboard/user/" | "/admin/devise" | "/admin/devise/" | "/admin/features" | "/admin/features/" | "/admin/liste_abonnement" | "/admin/liste_abonnement/" | "/admin/liste_admin" | "/admin/liste_admin/" | "/admin/liste_client" | "/admin/liste_client/" | "/admin/liste_magasin" | "/admin/liste_magasin/" | "/admin/liste_marchand" | "/admin/liste_marchand/" | "/admin/liste_vente" | "/admin/liste_vente/" | "/admin/pays" | "/admin/pays/" | "/admin/role_admin" | "/admin/role_admin/" | "/admin/role_marchand" | "/admin/role_marchand/" | "/admin/transactions" | "/admin/transactions/" | "/connexion" | "/connexion/" | "/contact" | "/contact/" | "/data" | "/data/" | "/inscription" | "/inscription/" | "/inscription/etablissement" | "/inscription/etablissement/" | "/inscription/professionnel" | "/inscription/professionnel/" | "/login" | "/login/" | "/login/confirmation" | "/login/confirmation/" | "/login/mot_passe_oublie" | "/login/mot_passe_oublie/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/.DS_Store" | "/assets/.DS_Store" | "/assets/theme_assets/js/apex-custom.js" | "/assets/theme_assets/js/full-calendar.js" | "/assets/theme_assets/js/googlemap-init.js" | "/assets/theme_assets/js/main.js" | "/assets/theme_assets/js/svgMapData.js" | "/assets/theme_assets/tailwind/tailwind.css" | "/assets/vendor_assets/css/apexcharts.min.css" | "/assets/vendor_assets/css/datepicker.min.css" | "/assets/vendor_assets/css/line-awesome.min.css" | "/assets/vendor_assets/css/nouislider.min.css" | "/assets/vendor_assets/css/quill.snow.css" | "/assets/vendor_assets/css/svgMap.min.css" | "/assets/vendor_assets/fonts/Jost-Bold.ttf" | "/assets/vendor_assets/fonts/Jost-Medium.ttf" | "/assets/vendor_assets/fonts/Jost-Regular.ttf" | "/assets/vendor_assets/fonts/Jost-SemiBold.ttf" | "/assets/vendor_assets/fonts/la-brands-400.eot" | "/assets/vendor_assets/fonts/la-brands-400.svg" | "/assets/vendor_assets/fonts/la-brands-400.ttf" | "/assets/vendor_assets/fonts/la-brands-400.woff" | "/assets/vendor_assets/fonts/la-brands-400.woff2" | "/assets/vendor_assets/fonts/la-regular-400.eot" | "/assets/vendor_assets/fonts/la-regular-400.svg" | "/assets/vendor_assets/fonts/la-regular-400.ttf" | "/assets/vendor_assets/fonts/la-regular-400.woff" | "/assets/vendor_assets/fonts/la-regular-400.woff2" | "/assets/vendor_assets/fonts/la-solid-900.eot" | "/assets/vendor_assets/fonts/la-solid-900.svg" | "/assets/vendor_assets/fonts/la-solid-900.ttf" | "/assets/vendor_assets/fonts/la-solid-900.woff" | "/assets/vendor_assets/fonts/la-solid-900.woff2" | "/assets/vendor_assets/js/apexcharts.min.js" | "/assets/vendor_assets/js/datepicker-full.min.js" | "/assets/vendor_assets/js/fslightbox.js" | "/assets/vendor_assets/js/index.global.min.js" | "/assets/vendor_assets/js/mixitup.min.js" | "/assets/vendor_assets/js/moment.min.js" | "/assets/vendor_assets/js/nouislider.min.js" | "/assets/vendor_assets/js/quill.js" | "/assets/vendor_assets/js/svg-pan-zoom.min.js" | "/assets/vendor_assets/js/svgMap.min.js" | "/assets/vendor_assets/js/tw-elements.umd.min.js" | "/assets/vendor_assets/js/yscountdown.min.js" | "/bg1.avif" | "/bg1.png" | "/data/icons.json" | "/favicon.ico" | "/favicon.svg" | "/icon-assistance-moovci_Plan-de-travail-1-1.png" | "/images/.DS_Store" | "/images/admin/admin-bg-dark.png" | "/images/admin/admin-bg-light.png" | "/images/admin/admin-preview.png" | "/images/admin/bg1.png" | "/images/avatars/avatar.svg" | "/images/avatars/placeholder-image.png" | "/images/avatars/t1.jpg" | "/images/avatars/t10.png" | "/images/avatars/t11.png" | "/images/avatars/t12.png" | "/images/avatars/t2.jpg" | "/images/avatars/t3.jpg" | "/images/avatars/t4.jpg" | "/images/avatars/t5.png" | "/images/avatars/t6.png" | "/images/avatars/t7.png" | "/images/avatars/t8.png" | "/images/avatars/t9.png" | "/images/avatars/thumbs-2.png" | "/images/avatars/thumbs-3.png" | "/images/avatars/thumbs-4.png" | "/images/avatars/thumbs-5.png" | "/images/avatars/thumbs-6.png" | "/images/avatars/thumbs.png" | "/images/blogs/1.png" | "/images/blogs/10.png" | "/images/blogs/11.png" | "/images/blogs/12.png" | "/images/blogs/13.png" | "/images/blogs/14.png" | "/images/blogs/15.png" | "/images/blogs/16.png" | "/images/blogs/17.png" | "/images/blogs/18.png" | "/images/blogs/19.png" | "/images/blogs/2.png" | "/images/blogs/20.png" | "/images/blogs/3.png" | "/images/blogs/4.png" | "/images/blogs/5.png" | "/images/blogs/6.png" | "/images/blogs/7.png" | "/images/blogs/8.png" | "/images/blogs/9.png" | "/images/blogs/blog-thumbnail.png" | "/images/campaign/adidas.svg" | "/images/campaign/adobe.svg" | "/images/campaign/microsoft.svg" | "/images/campaign/slack.svg" | "/images/campaign/wordpress.svg" | "/images/electronics/1.png" | "/images/electronics/2.png" | "/images/electronics/3.png" | "/images/electronics/4.png" | "/images/electronics/5.png" | "/images/electronics/6.png" | "/images/electronics/7.png" | "/images/electronics/8.png" | "/images/electronics/9.png" | "/images/emoji/cool.png" | "/images/emoji/happy.png" | "/images/emoji/happy2.png" | "/images/emoji/heart.png" | "/images/emoji/like.png" | "/images/emoji/shocked.png" | "/images/empty/empty-1.png" | "/images/empty/empty-2.png" | "/images/empty/empty-3.svg" | "/images/empty/empty-4.png" | "/images/faq/faq.svg" | "/images/favicon.ico" | "/images/file/cinema.png" | "/images/file/code.png" | "/images/file/doc.png" | "/images/file/jpg.png" | "/images/file/mp3.png" | "/images/file/pdf.png" | "/images/file/ppt.png" | "/images/file/psd.png" | "/images/file/xlsx.png" | "/images/file/zip.png" | "/images/flags/arabic.png" | "/images/flags/english.png" | "/images/flags/spanish.png" | "/images/gallery/g1.png" | "/images/gallery/g10.png" | "/images/gallery/g11.png" | "/images/gallery/g12.png" | "/images/gallery/g2.png" | "/images/gallery/g3.png" | "/images/gallery/g4.png" | "/images/gallery/g5.png" | "/images/gallery/g6.png" | "/images/gallery/g7.png" | "/images/gallery/g8.png" | "/images/gallery/g9.png" | "/images/logos/.DS_Store" | "/images/logos/logo-dark.png" | "/images/logos/logo-fold.png" | "/images/logos/logo-white.png" | "/images/logos/logo.png" | "/images/markar-icon.png" | "/images/messages/app-developer.png" | "/images/messages/app.png" | "/images/messages/firecircle-icon-graphic-branding-graphic-design-large-white.png" | "/images/messages/product.png" | "/images/messages/ui-ux-design.png" | "/images/messages/web-design-software-engineering.png" | "/images/new_Image/2150796734-removebg-preview.png" | "/images/new_Image/awards1.png" | "/images/new_Image/awards2.png" | "/images/new_Image/awards3.png" | "/images/new_Image/awards4.png" | "/images/new_Image/awards5.png" | "/images/new_Image/logo-depps.png" | "/images/posts/gallery-1.png" | "/images/posts/gallery-2.png" | "/images/posts/gallery-3.png" | "/images/posts/gallery-4.png" | "/images/posts/gallery-5.png" | "/images/posts/post-1.png" | "/images/profile/active-danial.png" | "/images/profile/cover-img.png" | "/images/profile/demo10-img.png" | "/images/profile/profile-author.png" | "/images/profile/profile-card.png" | "/images/progress/1.png" | "/images/progress/2.png" | "/images/progress/3.png" | "/images/sellers/1.png" | "/images/sellers/10.png" | "/images/sellers/11.png" | "/images/sellers/12.png" | "/images/sellers/13.png" | "/images/sellers/14.png" | "/images/sellers/2.png" | "/images/sellers/3.png" | "/images/sellers/4.png" | "/images/sellers/5.png" | "/images/sellers/6.png" | "/images/sellers/7.png" | "/images/sellers/8.png" | "/images/sellers/9.png" | "/images/settings/audio.png" | "/images/settings/design.png" | "/images/settings/feature.png" | "/images/settings/file.png" | "/images/settings/payment.png" | "/images/settings/theme.png" | "/images/shop/boss-chair.png" | "/images/shop/chair.png" | "/images/shop/chair2.png" | "/images/shop/chair3.png" | "/images/shop/coffe-glass.png" | "/images/shop/digital-chair.png" | "/images/shop/flip-chair.png" | "/images/shop/glass-cup.png" | "/images/shop/haley-truong.jpg" | "/images/shop/juse.png" | "/images/shop/kari-shea.jpg" | "/images/shop/plate.png" | "/images/shop/qr.png" | "/images/shop/rosy-k.jpg" | "/images/shop/ruslan-bardas.jpg" | "/images/svg/404.svg" | "/images/svg/blockquote-left.svg" | "/images/svg/blockquote-right.svg" | "/images/svg/circle-progress-10.svg" | "/images/svg/circle-progress-100.svg" | "/images/svg/circle-progress-20.svg" | "/images/svg/circle-progress-30.svg" | "/images/svg/circle-progress-40.svg" | "/images/svg/circle-progress-50.svg" | "/images/svg/circle-progress-60.svg" | "/images/svg/circle-progress-70.svg" | "/images/svg/circle-progress-80.svg" | "/images/svg/circle-progress-90.svg" | "/images/svg/edit.svg" | "/images/svg/maintenance.svg" | "/images/svg/move.svg" | "/images/svg/settings.svg" | "/images/svg/trash-2.svg" | "/images/svg/x-twitter.svg" | "/images/svg/x.svg" | "/images/timeline/layers-basic.svg" | "/images/timeline/notification-basic.svg" | "/images/timeline/paper-plane.svg" | "/images/timeline/pen.svg" | "/images/timeline/surface1.svg" | "/images/timeline/user-basic.svg" | "/login-hidden-removebg-preview.jpg" | "/login-hidden.jpeg" | "/logo-dark.png" | "/logo-light.png" | "/moov.png" | "/MTN_Logo.svg.png" | "/Orange_logo.svg" | "/tailwind.css" | "/wave-1024x1024.png" | string & {};
	}
}