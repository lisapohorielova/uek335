import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { getToken } from '@/services/SecureStore';


/**
 * App entry route. Acts as an auth guard: while the stored token is being
 * checked it renders nothing, then redirects to `/home` if a token exists or
 * `/login` if not.
 *
 * @returns Nothing while loading, otherwise a `<Redirect>`.
 */
export default function Index() {
    // Auth guard: send the user to the app if a token exists, otherwise to login.
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        getToken()
            .then((token) => setIsAuthenticated(!!token))
            .catch(() => setIsAuthenticated(false));
    }, []);

    // null = still checking the token; render nothing to avoid a flash.
    if (isAuthenticated === null) return null;

    return <Redirect href={isAuthenticated ? '/home' : '/login'} />;
}
