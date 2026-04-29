/**
 * Refresh the access token using the refresh_token stored in localStorage.
 * Returns the new access token if successful, null otherwise.
 */
export async function refreshAccessToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return null;

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (res.ok) {
            const data = await res.json();
            const newToken = data.access;
            localStorage.setItem('access_token', newToken);
            return newToken;
        }
    } catch {
        // silent
    }
    return null;
}

/**
 * Make a fetch call to the AI backend. If it returns 401, try to refresh
 * the access token once and retry.
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    let token = localStorage.getItem('access_token');

    const makeRequest = (t: string | null) =>
        fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(t ? { 'Authorization': `Bearer ${t}` } : {}),
                ...(options.headers || {}),
            },
        });

    let res = await makeRequest(token);

    // If 401, try to refresh token and retry once
    if (res.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
            res = await makeRequest(newToken);
        }
    }

    return res;
}
