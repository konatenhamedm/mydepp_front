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
	() => import('./nodes/24'),
	() => import('./nodes/25'),
	() => import('./nodes/26'),
	() => import('./nodes/27'),
	() => import('./nodes/28'),
	() => import('./nodes/29'),
	() => import('./nodes/30'),
	() => import('./nodes/31'),
	() => import('./nodes/32'),
	() => import('./nodes/33'),
	() => import('./nodes/34'),
	() => import('./nodes/35'),
	() => import('./nodes/36'),
	() => import('./nodes/37'),
	() => import('./nodes/38'),
	() => import('./nodes/39'),
	() => import('./nodes/40'),
	() => import('./nodes/41'),
	() => import('./nodes/42'),
	() => import('./nodes/43'),
	() => import('./nodes/44'),
	() => import('./nodes/45'),
	() => import('./nodes/46')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/admin": [3],
		"/admin/administrateur": [~4],
		"/admin/civilite": [5],
		"/admin/commune": [6],
		"/admin/comptable-dashboard": [7],
		"/admin/dashboard/user": [8],
		"/admin/directeur-dashboard": [9],
		"/admin/direction": [10],
		"/admin/district": [11],
		"/admin/genre": [12],
		"/admin/inspecteur-dashboard": [13],
		"/admin/instructeur-dashboard": [14],
		"/admin/instructeur-second-dashboard": [15],
		"/admin/lieu_diplome": [16],
		"/admin/ouverture_exploitation_instructeur": [18],
		"/admin/ouverture_exploitation": [17],
		"/admin/pays": [19],
		"/admin/professionnel_accepte": [21],
		"/admin/professionnel_ajour": [22],
		"/admin/professionnel_attente": [23],
		"/admin/professionnel_instructeur_second": [25],
		"/admin/professionnel_instructeur": [24],
		"/admin/professionnel_refuse": [26],
		"/admin/professionnel_renouvellement": [27],
		"/admin/professionnel_valide": [28],
		"/admin/professionnel": [20],
		"/admin/racine_sequence": [29],
		"/admin/region": [30],
		"/admin/situation_professionnelle": [~31],
		"/admin/sous-directeur-etab-dashboard": [32],
		"/admin/sous-directeur-prof-dashboard": [33],
		"/admin/statistique/general": [34],
		"/admin/status_pro": [35],
		"/admin/type_diplome": [36],
		"/admin/utilisateur_externe": [~37],
		"/admin/ville": [38],
		"/connexion": [39],
		"/contact": [40],
		"/inscription": [41],
		"/inscription/etablissement": [42],
		"/inscription/professionnel": [43],
		"/login": [44],
		"/login/mot_passe_oublie": [45],
		"/login/nouveau_mot_de_passe/[id]": [46]
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