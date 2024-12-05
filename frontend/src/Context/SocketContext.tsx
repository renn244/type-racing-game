import { createContext, useState, useEffect, useContext, PropsWithChildren } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthContext } from './AuthContext';
import toast from 'react-hot-toast';

type SocketContextType = {
    socket: Socket | undefined;
};

const SocketContext = createContext<SocketContextType>({ socket: undefined });

export const useSocketContext = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ({ 
    children
}: PropsWithChildren) => {
    const [socket, setSocket] = useState<Socket | undefined>(undefined);
    const { user } = useAuthContext();

    // maybe make it a singleton?? like not closing the socket

    useEffect(() => {
        if(!user) return;

        const isProduction = import.meta.env.VITE_SOFTWARE_ENVIRONMENT === 'production';
        const socketConnection = isProduction ? '' : 'http://localhost:5000';

        const currentSocket = io(socketConnection, {
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            transports: ['websocket', 'polling'],
            query: {
                userId: user?.id
            }
        })
        setSocket(currentSocket);
        
        currentSocket.on('connect', () => {
            // maybe do somethign??
            console.log('connected')
        })

        // for development purposes
        // currentSocket.on('disconnect', () => {
        //     toast.error('Disconnected from server')
        // })
        
        return () => {
            currentSocket.close();
        }
    }, [user])

    return (
        <SocketContext.Provider value={{ socket: socket }}>
            {children}
        </SocketContext.Provider>
    )
}