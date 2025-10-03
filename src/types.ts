export interface TypeMission {
	id: number;
	libelle: string;
	code: string;
}
export interface RoleMarchand {
	id: number;
	libelle: string;
	user_owner_id: any;
}

export interface devise {
	id: number;
	libelle: string;
	code: string;
	symbole:string;
	nb_decimal:any
}

export interface Magasin {
  id: number;
  libelle: string;
  tel: string;
  email: string;
  owner: Owner;
  pays_devise: PaysDevise;
  image_url: string;
}

export interface Owner {
  id: number;
  nom: string;
  prenoms: string;
  tel: string;
  email: string;
  login: string;
  app_version: string;
  build_version: number;
  device_type: string;
  fcm_token: string;
  email_verified_at: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  magasin_id: number | null;
  role_id: number;
  verification_code: string | null;
  verification_code_expiration: string | null;
  pays_id: number;
  role_marchand_id: number | null;
  last_connection: string | null;
}

export interface PaysDevise {
  id: number;
  pays_id: number;
  devise_id: number;
  created_at: string;
  updated_at: string;
  devise: Devise;
  pays: Pays;
}

export interface Devise {
  id: number;
  code: string;
  symbole: string;
  nb_decimal: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
export interface Marchand {
  id: number;
  nom: string;
  prenoms: string;
  tel: string;
  login: string;
  email: string;
  app_version: string;
  build_version: number;
  device_type: string;
  fcm_token: string | null;
  email_verified_at: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  magasin_id: number | null;
  role_id: number;
  verification_code: string | null;
  verification_code_expiration: string | null;
  pays_id: number;
  role_marchand_id: number | null;
  last_connection: string | null;
  magasin: any | null; // tu peux remplacer `any` par une interface Magasin si tu en as une
}

export interface Pays {
  id: number;
  libelle: string;
  code: string;
  taille_phone: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

	