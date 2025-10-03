import axios from 'axios';
import cookie from 'cookie';
import type { User } from '../types';
import { BASE_URL } from './api';

export async function login(login: string, password: string) {
  try {
    const response = await axios.post(`${BASE_URL}/admins/login`, {
      login,
      password,
    });
console.log(response.data);
    // ✅nt { user: {...}, token: "..." } La réponse contie
    const { user, token } = response.data;

    // On choisit les infos qu’on veut stocker dans le cookie
    const cookieValue = encodeURIComponent(
      JSON.stringify({
        id: user.id,
        nom: user.nom,
        prenoms: user.prenoms,
        email: user.email,
        tel: user.tel,
        login: user.login,
        role: parseInt(user.role_id),
        magasinId: user.magasin_id,
        paysId: user.pays_id,
        roleMarchandId: user.role_marchand_id,
        lastConnection: user.last_connection,
        appVersion: user.app_version,
        buildVersion: user.build_version,
        deviceType: user.device_type,
        fcmToken: user.fcm_token,
        token, // JWT
      })
    );

    // Création du cookie valable 1 jour
    document.cookie = `auth=${cookieValue}; path=/; max-age=${60 * 60 * 24}`;

    return { token, user };
  } catch (error) {
    console.error("Erreur lors de la connexion", error);
    return null;
  }
}


export async function getPermission(featureUrl: string) {

   const cookies = parseCookies();

  if (!cookies.auth) {
    console.warn("No auth cookie found");
    return null;
  }

  const auth = JSON.parse(cookies.auth);
  const user = { id: auth.id,email:auth.email, role: auth.role,token:auth.token };


  
  const response = await axios.post(`${BASE_URL}/access/permission/${user.role}`,JSON.stringify({ featureUrl }) );
  const responseData = response.data;
  
  return responseData.permissionCode;
}

export async function verfication(email: string) {
  try {
    const response = await axios.post(`${BASE_URL}/user/verification/${email}`, {});
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

    return responseJson; // Renvoie l'objet correctement construit
  } catch (error) {
    console.error('Erreur lors de la connexion', error);
    return {
      existe: false,
      confirmed: null,
      message: 'Erreur lors de la connexion',
    }; // Retourne un objet avec un message d'erreur en cas d'échec
  }
}

export async function confirmationCompte(email:string,newPassword:string){
  try {
    const response = await axios.post(`${BASE_URL}/change-password`, JSON.stringify({email, newPassword }));
    const responseData = response.data;

    let responseJson;
  
    if(responseData.message === "Password changed successfully"){
      responseJson  = {
        status: true,
        message: responseData.message,
      };
    }else{
      responseJson  = {
        status: false,
        message: responseData.message,
      };

    }
  return responseJson;
  } catch (error) {
    return {
      status: false,
      message: "Veillez réessayer plus tard un probleme est survenu",
    };
  }


}
export async function motPasseOublie(email:string,newPassword:string){
  try {
    const response = await axios.put(`${BASE_URL}update-password`, JSON.stringify({email, newPassword }));
    const responseData = response.data;
  return true;
  } catch (error) {
    return {
      status: false,
      message: "Veillez réessayer plus tard un probleme est survenu",
    };
  }
}



function parseCookies(): Record<string, string> {
  return document.cookie.split(';').reduce((cookies, cookieStr) => {
    const [name, ...valueParts] = cookieStr.split('=');
    const value = valueParts.join('=').trim(); 
    
    try {
     
      cookies[name.trim()] = decodeURIComponent(value);
    } catch (e) {
      
      cookies[name.trim()] = value;
    }
    
    return cookies;
  }, {} as Record<string, string>);
}

export function getAuthCookie(): User | null {
  const cookies = parseCookies();

  if (!cookies.auth) {
    console.warn("No auth cookie found");
    return null;
  }

  try {
   
    const authData = JSON.parse(cookies.auth);

    if (authData && authData.id && authData.email && authData.role && authData.token && authData.nom && authData.prenoms) {
      return {
        id: authData.id,
        email: authData.email,
        role: authData.role,
        token: authData.token,
        nom: authData.nom,
        prenoms: authData.prenoms

      };
    } else {
      console.error("Auth cookie missing required fields");
      }
  } catch (e) {
 
    try {
      const cleanedValue = cookies.auth.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
      const authData = JSON.parse(cleanedValue);
      return {
        id: authData.id,
        email: authData.email,
        role: authData.role,
        token: authData.token,
        nom: authData.nom,
        prenoms: authData.prenoms 
      };
    } catch (cleanError) {
      console.error("Even after cleaning, parsing failed:", cleanError);
    }
  }
  

  return null;
}