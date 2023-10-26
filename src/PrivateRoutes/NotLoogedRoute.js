import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { SessionContext } from "../SessionContext/Session";

function NotLoggedRoute( { element } ){
    const userSession = useContext(SessionContext).userSession;

    if(userSession?.Rola === 'admin' || userSession?.Rola === 'user'){
        return <Navigate to="/Profil" replace />;
    } else if (userSession?.Rola === undefined) {
        return <Navigate to='/Login' replace />;
    }
    return element;
} 

export default NotLoggedRoute;


