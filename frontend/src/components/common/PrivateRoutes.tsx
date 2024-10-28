import { useAuthContext } from "@/Context/AuthContext";
import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";


const PrivateRoute = ({ children }: PropsWithChildren) => {
    const { user } = useAuthContext() 

    if(!user) {
        return <Navigate to='/login' />
    }

    return children
}

export default PrivateRoute