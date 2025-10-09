import * as cookie from 'cookie';

export const BASE_URL_API = "https://prodmydepps.leadagro.net/api"; // Remplacez par l'URL de votre API
export const BASE_URL_API_V2 = "http://127.0.0.1:8000/api"; // Remplacez par l'URL de votre API
export const BASE_URL_API_UPLOAD = "https://prodmydepps.leadagro.net/uploads/"; // Remplacez par l'URL de votre API

import { getAuthCookie } from '$lib/auth';



export async function apiFetch(
	provenance: boolean,
	url: string,
	method: string = 'GET',
	data: any = null,
	options: RequestInit = {}
): Promise<any> {
	let token: string | undefined;

	if (typeof window !== 'undefined') {
		const cookies = cookie.parse(document.cookie);
		const auth = JSON.parse(cookies.auth);
		token = auth.token;
	}

	const headers: Record<string, string> = {
		...(method !== 'GET' ? { 'Content-Type': 'application/json', Accept: 'application/json' } : {}),
		...(token ? { Authorization: `Bearer ${token}` } : {})
	};

	const requestOptions: RequestInit = {
		...options,
		method,
		headers,
		...(data ? { body: JSON.stringify(data) } : {})
	};

	try {
		const response = await fetch(
			 provenance ? BASE_URL_API + url : BASE_URL_API_V2 + url,
			requestOptions
		);

		if (!response.ok) {
			throw new Error(`Error ${response.status}: ${response.statusText}`);
		}

		const contentType = response.headers.get('content-type');
		if (contentType?.includes('application/json')) {
			return response.json();
		}

		return response.text();
	} catch (error) {
		console.error('API Fetch Error:', error);
		throw error;
	}
}

export async function apiFetchPaginated(
  provenance: boolean,
  url: string,
  method: string = 'GET',
  data: any = null,
  options: RequestInit = {},
  paginate: boolean = true
): Promise<any> {
  let token: string | undefined;

  if (typeof window !== 'undefined') {
    const cookies = cookie.parse(document.cookie);
    const auth = JSON.parse(cookies.auth);
    token = auth.token;
  }

  const headers: Record<string, string> = {
    ...(method !== 'GET'
      ? { 'Content-Type': 'application/json', Accept: 'application/json' }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const requestOptions: RequestInit = {
    ...options,
    method,
    headers,
    ...(data ? { body: JSON.stringify(data) } : {})
  };

  try {
    const response = await fetch(
       provenance ? BASE_URL_API + url : BASE_URL_API_V2 + url,
      requestOptions
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    const result =
      contentType?.includes('application/json')
        ? await response.json()
        : await response.text();

    // 🚀 Si la pagination est activée et que l’API renvoie ce format (Laravel style)
    if (paginate && typeof result === 'object' && result.data) {
      return {
        items: result.data,
        currentPage: result.current_page,
        totalPages: result.last_page,
        totalItems: result.total,
        perPage: result.per_page,
        startRange: result.from ?? 0,
        endRange: result.to ?? 0
      };
    }

    return result;
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
}
