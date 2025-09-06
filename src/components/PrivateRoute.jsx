import { Navigate, Outlet } from "react-router-dom";
import { useAuthState } from "../hooks/useAuthState";
import SpinnerOverlay from "./spiner";

export default function PrivateRoute() {
  const  { isLogged , checkingState} = useAuthState();

  if (checkingState) {
    return <SpinnerOverlay/>
  }
  return isLogged ? <Outlet /> : <Navigate to="/sign-in" />;
}
