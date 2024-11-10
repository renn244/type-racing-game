import { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosFetch from '@/lib/axiosFetch';
import { StoragesetItem } from '@/lib/LocalStorage';
import { User } from '@/types/User.type';

type AuthContextState = {
    user: User | undefined,
    loading: boolean,
}

const initialState = {
    user: undefined,
    loading: false,
}

const AuthContext = createContext<AuthContextState>(initialState);

export const useAuthContext = () => {
    const context = useContext(AuthContext);

    return context
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const { data: user, isLoading} = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            if(!localStorage.getItem('access_token') || !localStorage.getItem("refresh_token")) return

            const response = await axiosFetch.get('/auth/check').catch((error) => {
                if (error.status === 401) {
                    return 
                }
                return 
            })
            
            if (!response) return 

            if (response.data.preferences) {
                StoragesetItem('preference', JSON.stringify(response.data.preferences))
            }

            return response.data as User
        },
        refetchOnWindowFocus: false
    })

    const value = {
        user,
        loading: isLoading
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider