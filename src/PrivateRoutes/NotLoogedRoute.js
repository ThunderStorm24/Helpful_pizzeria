import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { SessionContext } from "../SessionContext/Session";

function NotLoggedRoute( { element } ){
    const userSession = useContext(SessionContext).userSession;

    if(!userSession?.Rola){
        return element;
    }else if(userSession?.Rola){
        return <Navigate to="/Profil" replace />;
    }
    return element;
} 

export default NotLoggedRoute;


