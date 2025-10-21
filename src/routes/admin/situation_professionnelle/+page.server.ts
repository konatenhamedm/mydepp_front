import type { Cookies } from '@sveltejs/kit';

export function load({ cookies }: { cookies: Cookies }) {
    const authCookie = cookies.get('auth');
    
    if (authCookie) {
        return { user: JSON.parse(authCookie) };
    }

    return { user: null };
}
