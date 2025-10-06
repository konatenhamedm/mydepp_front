export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/admin": [3],
		"/admin/dashboard/user": [4],
		"/admin/devise": [5],
		"/admin/features": [6],
		"/admin/liste_abonnement": [7],
		"/admin/liste_admin": [8],
		"/admin/liste_client": [9],
		"/admin/liste_magasin": [10],
		"/admin/liste_marchand": [11],
		"/admin/liste_vente": [12],
		"/admin/pays": [13],
		"/admin/role_admin": [14],
		"/admin/role_marchand": [15],
		"/admin/transactions": [16],
		"/connexion": [17],
		"/contact": [18],
		"/inscription": [19],
		"/inscription/etablissement": [20],
		"/inscription/professionnel": [21],
		"/login": [22],
		"/login/confirmation": [23],
		"/login/mot_passe_oublie": [24]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';