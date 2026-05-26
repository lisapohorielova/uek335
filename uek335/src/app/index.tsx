import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { getToken } from '@/services/SecureStore';


export default function Index() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        getToken()
            .then((token) => setIsAuthenticated(!!token))
            .catch(() => setIsAuthenticated(false));
    }, []);

    if (isAuthenticated === null) return null;

    return <Redirect href={isAuthenticated ? '/home' : '/login'} />;
}
