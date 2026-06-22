import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function ProtectedAdminRoute({ children }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkAccess() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { window.location.href = '/auth'; return; }

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (profile?.role === 'admin') {
                setIsAdmin(true);
            } else {
                alert("Access Denied: Admin only.");
                window.location.href = '/';
            }
            setLoading(false);
        }
        checkAccess();
    }, []);

    if (loading) return <div>Loading Secure Gateway...</div>;
    return isAdmin ? children : null;
}