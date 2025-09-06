import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export function useAuthState() {
  const [isLogged, setIsLogged] = useState(false);
  const [checkingState, SetCheckingState] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLogged(true);
      }
      SetCheckingState(false);
    });
  }, []);
  return { isLogged, checkingState };
}
