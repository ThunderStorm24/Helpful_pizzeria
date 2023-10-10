import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { SessionContext } from "../SessionContext/Session";

function UserPrivateRoute( { element } ){
    const userSession = useContext(SessionContext).userSession;

    if(!userSession?.Rola){
        return <Navigate to="/" replace />;
    } else if (!userSession?.Rola || userSession?.Rola === 'admin'){
        return <Navigate to="/" replace />;
    }
    return element;
}

export default UserPrivateRoute;

