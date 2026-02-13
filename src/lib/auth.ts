import axios from 'axios';
import cookie from 'cookie';
import type { User } from '../types';
import { BASE_URL_API } from './api';

// Gestionnaire de cookies utilitaire
export const CookieManager = {
  set(name: string, value: any, days: number = 1): boolean {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      const encodedValue = encodeURIComponent(stringValue);
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      const expires = `expires=${date.toUTCString()}`;
      
      const cookieString = `${name}=${encodedValue}; ${expires}; path=/; samesite=lax${window.location.protocol === 'https:' ? '; secure' : ''}`;
      
      document.cookie = cookieString;
      
      // Vérification que le cookie a bien été créé
      const stored = this.get(name);
      // console.log(`Cookie ${name} créé:`, stored !== null);
      return stored !== null;
    } catch (error) {
      console.error('Erreur lors de la création du cookie:', error);
      return false;
    }
  },

  get(name: string): any {
    try {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
          const value = decodeURIComponent(c.substring(nameEQ.length, c.length));
          try {
            return JSON.parse(value);
          } catch {
            return value;
          }
        }
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la lecture du cookie:', error);
      return null;
    }
  },

  remove(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
};

export async function login(login: string, password: string, plateforme: string) {
  try {
    // console.log('Tentative de connexion pour:', login);
    
    const response = await axios.post(`${BASE_URL_API}/login`, {
      email: login,
      password,
      plateforme: plateforme
    });

    // console.log('Réponse API login:', response.data);

    if (!response.data) {
      console.error("Token manquant dans la réponse");
      return null;
    }

    const { token, data } = response.data.data;

    if (!token) {
      // console.error("Token invalide");
      return null;
    }

    // Préparer les données pour le cookie
    const authData = {
      id: data?.id,
      role: data?.role,
      username: data?.username,
      type: data.type,
      status: data?.status,
      payement: data.payement,
      avatar: data.avatar,
      personneId: data.personneId,
      nom: data.nom,
      finRenouvellement: data.finRenouvellement,
      expire: data.expire,
      typePersonne: data.typePersonne,
      token,
    };

    // console.log('Données d\'auth à stocker:', authData);

    // Utiliser le gestionnaire de cookies
    const cookieSuccess = CookieManager.set('auth', authData, 1);
    
    if (!cookieSuccess) {
      console.error('Échec de la création du cookie auth');
      return null;
    }

    // console.log('Connexion réussie et cookie stocké');
    return { token, data };

  } catch (error: any) {
    console.error("Erreur lors de la connexion", error);
    
    if (error.response) {
      console.error('Erreur serveur:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Aucune réponse du serveur');
    }
    
    return null;
  }
}

export async function loginUserFront(username_field: string, password: string) {
  try {
    console.log('Tentative de connexion front pour:', username_field);
    
    const response = await fetch(`${BASE_URL_API}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: username_field, password, plateforme: 'front' })
    });

    const jsonData = await response.json();
    console.log('Réponse API loginUserFront:', jsonData);

    if (!response.ok) {
      throw new Error(jsonData.message || 'Erreur lors de la connexion');
    }

    const { token, data: { id, username, role, type, status, payement, avatar, personneId, nom, finRenouvellement, expire, typePersonne } } = jsonData;

    // Préparer les données pour le cookie
    const authData = {
      id,
      username,
      role,
      token,
      type,
      status,
      payement,
      avatar,
      personneId,
      nom,
      finRenouvellement,
      expire,
      typePersonne
    };

    // Utiliser le gestionnaire de cookies
    const cookieSuccess = CookieManager.set('auth', authData, 1);
    
    if (!cookieSuccess) {
      console.error('Échec de la création du cookie auth dans loginUserFront');
      return { token: null };
    }

    console.log('Connexion front réussie et cookie stocké');
    return jsonData;
  } catch (error: any) {
    console.error('Erreur de connexion front:', error);
    return { token: null };
  }
}

export async function motPasseOublie(email: string, newPassword: string) {
  try {
    const response = await axios.put(`${BASE_URL_API}/update-password`, 
      { email, newPassword },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    return true;
  } catch (error: any) {
    console.error('Erreur mot de passe oublié:', error);
    return {
      status: false,
      message: "Veuillez réessayer plus tard, un problème est survenu",
    };
  }
}

export async function getPermission(featureUrl: string) {
  try {
    const auth = getAuthCookie();

    if (!auth) {
      console.warn("No auth cookie found for permission check");
      return null;
    }

    const response = await axios.post(
      `${BASE_URL_API}/access/permission/${auth.role}`,
      { featureUrl },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        }
      }
    );
    
    return response.data.permissionCode;
  } catch (error: any) {
    console.error('Erreur lors de la vérification des permissions:', error);
    return null;
  }
}

function parseCookies(): Record<string, string> {
  try {
    return document.cookie.split(';').reduce((cookies, cookieStr) => {
      const [name, ...valueParts] = cookieStr.split('=');
      const value = valueParts.join('=').trim();

      if (!name.trim()) return cookies;

      try {
        cookies[name.trim()] = decodeURIComponent(value);
      } catch (e) {
        // Si le décodage échoue, utiliser la valeur brute
        cookies[name.trim()] = value;
      }

      return cookies;
    }, {} as Record<string, string>);
  } catch (error) {
    console.error('Erreur lors du parsing des cookies:', error);
    return {};
  }
}

export async function verfication(email: string) {
  try {
    const response = await axios.post(`${BASE_URL_API}/user/verification/${email}`, {});
    const responseData = response.data;

    let responseJson;

    if (responseData.isConfirmed !== undefined) {
      responseJson = {
        existe: true,
        confirmed: responseData.isConfirmed,
        message: '',
      };
    } else {
      responseJson = {
        existe: false,
        confirmed: null,
        message: responseData.message,
      };
    }

    return responseJson;
  } catch (error: any) {
    console.error('Erreur lors de la vérification:', error);
    return {
      existe: false,
      confirmed: null,
      message: 'Erreur lors de la connexion',
    };
  }
}

export function getAuthCookie(): User | null {
  try {
    // Essayer d'abord avec le gestionnaire de cookies
    const authData = CookieManager.get('auth');
    
    if (authData) {
      // console.log('Auth data from CookieManager:', authData);
      
      if (authData.id && authData.role && authData.token) {
        return {
          id: authData.id,
          role: authData.role || "",
          token: authData.token || "",
          username: authData.username || "",
          type: authData.type || "",
          status: authData.status || "",
          payement: authData.payement || "",
          avatar: authData.avatar || "",
          personneId: authData.personneId || "",
          nom: authData.nom || "",
          typePersonne: authData.typePersonne || "",
          finRenouvellement: authData.finRenouvellement || null,
          expire: authData.expire || null,
        };
      }
    }

    // Fallback: parser manuellement les cookies
    const cookies = parseCookies();
    
    if (!cookies.auth) {
      console.warn("No auth cookie found");
      return null;
    }

    console.log('Raw auth cookie:', cookies.auth);

    try {
      const parsedAuth = JSON.parse(cookies.auth);
      
      if (parsedAuth.id && parsedAuth.role && parsedAuth.token) {
        return {
          id: parsedAuth.id,
          role: parsedAuth.role || "",
          token: parsedAuth.token || "",
          username: parsedAuth.username || "",
          type: parsedAuth.type || "",
          status: parsedAuth.status || "",
          payement: parsedAuth.payement || "",
          avatar: parsedAuth.avatar || "",
          personneId: parsedAuth.personneId || "",
          nom: parsedAuth.nom || "",
          typePersonne: parsedAuth.typePersonne || "",
          finRenouvellement: parsedAuth.finRenouvellement || null,
          expire: parsedAuth.expire || null,
        };
      }
    } catch (parseError) {
      console.error("Erreur de parsing du cookie auth:", parseError);
      
      // Tentative de nettoyage
      try {
        const cleanedValue = cookies.auth.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
        const cleanedAuth = JSON.parse(cleanedValue);
        
        if (cleanedAuth.id && cleanedAuth.role && cleanedAuth.token) {
          return {
            id: cleanedAuth.id,
            role: cleanedAuth.role || "",
            token: cleanedAuth.token || "",
            username: cleanedAuth.username || "",
            type: cleanedAuth.type || "",
            status: cleanedAuth.status || "",
            payement: cleanedAuth.payement || "",
            avatar: cleanedAuth.avatar || "",
            personneId: cleanedAuth.personneId || "",
            nom: cleanedAuth.nom || "",
            typePersonne: cleanedAuth.typePersonne || "",
            finRenouvellement: cleanedAuth.finRenouvellement || null,
            expire: cleanedAuth.expire || null,
          };
        }
      } catch (cleanError) {
        console.error("Même après nettoyage, parsing échoué:", cleanError);
      }
    }

    console.error("Auth cookie missing required fields");
    return null;
    
  } catch (error) {
    console.error("Erreur générale dans getAuthCookie:", error);
    return null;
  }
}

// Fonction utilitaire pour déconnecter l'utilisateur
export function logout(): void {
  CookieManager.remove('auth');
  console.log('Utilisateur déconnecté');
}

// Fonction pour vérifier si l'utilisateur est connecté
export function isLoggedIn(): boolean {
  return getAuthCookie() !== null;
}

// Fonction pour obtenir le token JWT
export function getToken(): string | null {
  const auth = getAuthCookie();
  return auth?.token || null;
}