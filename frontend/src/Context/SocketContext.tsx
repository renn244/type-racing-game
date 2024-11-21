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

    useEffect(() => {
        // you don't get notified when you are not logged in
        if(!user) return;

        const socket = io('http://localhost:5000', {
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            transports: ['websocket', 'polling'],
            query: {
                userId: user?.id
            }
        })
        setSocket(socket);
        
        socket.on('connect', () => {
            // maybe do somethign??
            console.log('connected')
        })

        socket.on('disconnect', () => {
            toast.error('Disconnected from server')
        })
        
        return () => {
            socket.close();
        }
    }, [user])

    return (
        <SocketContext.Provider value={{ socket: socket }}>
            {children}
        </SocketContext.Provider>
    )
}