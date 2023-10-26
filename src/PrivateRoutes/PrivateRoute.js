import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { SessionContext } from "../SessionContext/Session";

function PrivateRoute({ element }) {
  const userSession = useContext(SessionContext).userSession;

  if(!userSession?.Rola){
    console.log("XD?")
    return <Navigate to="/" replace />;
} else if (!userSession?.Rola === 'user'){
    return <Navigate to="/" replace />;
}
return element;
}      
export default  PrivateRoute;