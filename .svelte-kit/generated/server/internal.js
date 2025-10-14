
import root from '../root.js';
import { set_building, set_prerendering } from '__sveltekit/environment';
import { set_assets } from '__sveltekit/paths';
import { set_manifest, set_read_implementation } from '__sveltekit/server';
import { set_private_env, set_public_env, set_safe_public_env } from '../../../node_modules/.pnpm/@sveltejs+kit@2.25.1_@sveltejs+vite-plugin-svelte@6.1.0_svelte@5.36.10_vite@7.0.6_jiti@_44549b5617bfbfae4b6770d1f3c57e5c/node_modules/@sveltejs/kit/src/runtime/shared-server.js';

export const options = {
	app_template_contains_nonce: false,
	csp: {"mode":"auto","directives":{"upgrade-insecure-requests":false,"block-all-mixed-content":false},"reportOnly":{"upgrade-insecure-requests":false,"block-all-mixed-content":false}},
	csrf_check_origin: true,
	embedded: false,
	env_public_prefix: 'PUBLIC_',
	env_private_prefix: '',
	hash_routing: false,
	hooks: null, // added lazily, via `get_hooks`
	preload_strategy: "modulepreload",
	root,
	service_worker: false,
	templates: {
		app: ({ head, body, assets, nonce, env }) => "<!doctype html>\n<html lang=\"en\" dir=\"ltr\" class=\"scroll-smooth focus:scroll-auto\">\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<link rel=\"icon\" href=\"" + assets + "/favicon.ico\" />\n\t\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n\n\t\t<link rel=\"stylesheet\" href=\"" + assets + "/assets/vendor_assets/css/apexcharts.min.css\">\n\t\t<link rel=\"stylesheet\" href=\"" + assets + "/assets/vendor_assets/css/datepicker.min.css\">\n\t\t<link rel=\"stylesheet\" href=\"" + assets + "/assets/vendor_assets/css/line-awesome.min.css\">\n\t\t<link rel=\"stylesheet\" href=\"" + assets + "/assets/vendor_assets/css/nouislider.min.css\">\n\t\t<link rel=\"stylesheet\" href=\"" + assets + "/assets/vendor_assets/css/quill.snow.css\">\n\t\t<link rel=\"stylesheet\" href=\"" + assets + "/assets/vendor_assets/css/svgMap.min.css\">\n\t\t<link rel=\"stylesheet\" href=\"" + assets + "/tailwind.css\">\n\n\t\t\n\t\t\n\t\t   <!-- Fonts -->\n\t\t   <link href=\"https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&display=swap\" rel=\"stylesheet\">\n\t\t   <!-- Icons -->\n\t\t   <link rel=\"stylesheet\" href=\"https://unicons.iconscout.com/release/v4.0.8/css/line.css\">\n\t\t" + head + "\n\t</head>\n\t<body data-sveltekit-preload-data=\"hover\" class=\" bg-white [&.dark]:bg-main-dark font-jost relative text-[15px] font-normal leading-[1.5] m-0 p-0\">\n\t\t\n\n\t\t\n\t\t<div class=\"preloader fixed w-full h-full z-[9999] flex items-center justify-center top-0 bg-white dark:bg-black\">\n\t\t\t<div class=\"animate-spin inline-block w-[50px] h-[50px] border-[3px] border-current border-t-transparent text-primary rounded-full\" role=\"status\" aria-label=\"loading\">\n\t\t\t   <span class=\"sr-only\">Loading...</span>\n\t\t\t</div>\n\t\t </div>\n\t  \n\t\t <!-- End: Preloader -->\n\t\t <div style=\"display: contents\">" + body + "</div>\n\t\t\n   <!-- inject:js-->\n   <script src=\"" + assets + "/assets/vendor_assets/js/apexcharts.min.js\"></script>\n   <script src=\"" + assets + "/assets/vendor_assets/js/datepicker-full.min.js\"></script>\n   <script src=\"" + assets + "/assets/vendor_assets/js/fslightbox.js\"></script>\n   <script src=\"" + assets + "/assets/vendor_assets/js/index.global.min.js\"></script>\n   <script src=\"" + assets + "/assets/vendor_assets/js/mixitup.min.js\"></script>\n   <script src=\"" + assets + "/assets/vendor_assets/js/moment.min.js\"></script>\n   <script src=\"" + assets + "/assets/vendor_assets/js/nouislider.min.js\"></script>\n   <script src=\"" + assets + "/assets/vendor_assets/js/quill.js\"></script>\n   <script src=\"" + assets + "/assets/vendor_assets/js/svg-pan-zoom.min.js\"></script>\n   <script src=\"" + assets + "/assets/vendor_assets/js/svgMap.min.js\"></script>\n   <script src=\"" + assets + "/assets/vendor_assets/js/tw-elements.umd.min.js\"></script>\n   <script src=\"" + assets + "/assets/vendor_assets/js/yscountdown.min.js\"></script>\n   <script src=\"" + assets + "/assets/theme_assets/js/apex-custom.js\"></script>\n   <script src=\"" + assets + "/assets/theme_assets/js/full-calendar.js\"></script>\n   <script src=\"" + assets + "/assets/theme_assets/js/googlemap-init.js\"></script>\n   <script src=\"" + assets + "/assets/theme_assets/js/main.js\"></script>\n   <script src=\"" + assets + "/assets/theme_assets/js/svgMapData.js\"></script>\n\n   \n\t</body>\n</html>\n",
		error: ({ status, message }) => "<!doctype html>\n<html lang=\"en\">\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<title>" + message + "</title>\n\n\t\t<style>\n\t\t\tbody {\n\t\t\t\t--bg: white;\n\t\t\t\t--fg: #222;\n\t\t\t\t--divider: #ccc;\n\t\t\t\tbackground: var(--bg);\n\t\t\t\tcolor: var(--fg);\n\t\t\t\tfont-family:\n\t\t\t\t\tsystem-ui,\n\t\t\t\t\t-apple-system,\n\t\t\t\t\tBlinkMacSystemFont,\n\t\t\t\t\t'Segoe UI',\n\t\t\t\t\tRoboto,\n\t\t\t\t\tOxygen,\n\t\t\t\t\tUbuntu,\n\t\t\t\t\tCantarell,\n\t\t\t\t\t'Open Sans',\n\t\t\t\t\t'Helvetica Neue',\n\t\t\t\t\tsans-serif;\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t\tjustify-content: center;\n\t\t\t\theight: 100vh;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\n\t\t\t.error {\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t\tmax-width: 32rem;\n\t\t\t\tmargin: 0 1rem;\n\t\t\t}\n\n\t\t\t.status {\n\t\t\t\tfont-weight: 200;\n\t\t\t\tfont-size: 3rem;\n\t\t\t\tline-height: 1;\n\t\t\t\tposition: relative;\n\t\t\t\ttop: -0.05rem;\n\t\t\t}\n\n\t\t\t.message {\n\t\t\t\tborder-left: 1px solid var(--divider);\n\t\t\t\tpadding: 0 0 0 1rem;\n\t\t\t\tmargin: 0 0 0 1rem;\n\t\t\t\tmin-height: 2.5rem;\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t}\n\n\t\t\t.message h1 {\n\t\t\t\tfont-weight: 400;\n\t\t\t\tfont-size: 1em;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\n\t\t\t@media (prefers-color-scheme: dark) {\n\t\t\t\tbody {\n\t\t\t\t\t--bg: #222;\n\t\t\t\t\t--fg: #ddd;\n\t\t\t\t\t--divider: #666;\n\t\t\t\t}\n\t\t\t}\n\t\t</style>\n\t</head>\n\t<body>\n\t\t<div class=\"error\">\n\t\t\t<span class=\"status\">" + status + "</span>\n\t\t\t<div class=\"message\">\n\t\t\t\t<h1>" + message + "</h1>\n\t\t\t</div>\n\t\t</div>\n\t</body>\n</html>\n"
	},
	version_hash: "5blucc"
};

export async function get_hooks() {
	let handle;
	let handleFetch;
	let handleError;
	let init;
	({ handle, handleFetch, handleError, init } = await import("../../../src/hooks.server.js"));

	let reroute;
	let transport;
	

	return {
		handle,
		handleFetch,
		handleError,
		init,
		reroute,
		transport
	};
}

export { set_assets, set_building, set_manifest, set_prerendering, set_private_env, set_public_env, set_read_implementation, set_safe_public_env };
