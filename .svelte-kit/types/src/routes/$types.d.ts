import type * as Kit from '@sveltejs/kit';

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
// @ts-ignore
type MatcherParam<M> = M extends (param : string) => param is infer U ? U extends string ? U : string : string;
type RouteParams = {  };
type RouteId = '/';
type MaybeWithVoid<T> = {} extends T ? T | void : T;
export type RequiredKeys<T> = { [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K; }[keyof T];
type OutputDataShape<T> = MaybeWithVoid<Omit<App.PageData, RequiredKeys<T>> & Partial<Pick<App.PageData, keyof T & keyof App.PageData>> & Record<string, any>>
type EnsureDefined<T> = T extends null | undefined ? {} : T;
type OptionalUnion<U extends Record<string, any>, A extends keyof U = U extends U ? keyof U : never> = U extends unknown ? { [P in Exclude<A, keyof U>]?: never } & U : never;
export type Snapshot<T = any> = Kit.Snapshot<T>;
type PageParentData = EnsureDefined<LayoutData>;
type LayoutRouteId = RouteId | "/" | "/admin" | "/admin/administrateur" | "/admin/civilite" | "/admin/commune" | "/admin/comptable-dashboard" | "/admin/dashboard/user" | "/admin/directeur-dashboard" | "/admin/direction" | "/admin/district" | "/admin/genre" | "/admin/inspecteur-dashboard" | "/admin/instructeur-dashboard" | "/admin/instructeur-second-dashboard" | "/admin/lieu_diplome" | "/admin/ouverture_exploitation" | "/admin/ouverture_exploitation_instructeur" | "/admin/pays" | "/admin/professionnel" | "/admin/professionnel_accepte" | "/admin/professionnel_ajour" | "/admin/professionnel_attente" | "/admin/professionnel_instructeur" | "/admin/professionnel_instructeur_second" | "/admin/professionnel_refuse" | "/admin/professionnel_renouvellement" | "/admin/professionnel_valide" | "/admin/racine_sequence" | "/admin/region" | "/admin/situation_professionnelle" | "/admin/sous-directeur-etab-dashboard" | "/admin/sous-directeur-prof-dashboard" | "/admin/statistique/general" | "/admin/status_pro" | "/admin/type_diplome" | "/admin/utilisateur_externe" | "/admin/ville" | "/connexion" | "/contact" | "/inscription" | "/inscription/etablissement" | "/inscription/professionnel" | "/login" | "/login/mot_passe_oublie" | "/login/nouveau_mot_de_passe/[id]" | null
type LayoutParams = RouteParams & { id?: string }
type LayoutParentData = EnsureDefined<{}>;

export type PageServerData = null;
export type PageData = Expand<PageParentData>;
export type PageProps = { params: RouteParams; data: PageData }
export type LayoutServerData = null;
export type LayoutData = Expand<LayoutParentData>;
export type LayoutProps = { params: LayoutParams; data: LayoutData; children: import("svelte").Snippet }