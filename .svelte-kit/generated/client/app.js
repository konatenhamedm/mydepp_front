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
		"/admin/administrateur": [~4],
		"/admin/civilite": [5],
		"/admin/commune": [6],
		"/admin/dashboard/user": [7],
		"/admin/direction": [8],
		"/admin/district": [9],
		"/admin/genre": [10],
		"/admin/pays": [11],
		"/admin/racine_sequence": [12],
		"/admin/region": [13],
		"/admin/situation_professionnelle": [~14],
		"/admin/utilisateur_externe": [~15],
		"/admin/ville": [16],
		"/connexion": [17],
		"/contact": [18],
		"/inscription": [19],
		"/inscription/etablissement": [20],
		"/inscription/professionnel": [21],
		"/login": [22],
		"/login/mot_passe_oublie": [23],
		"/login/nouveau_mot_de_passe/[id]": [24]
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