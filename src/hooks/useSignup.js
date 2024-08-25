import { useContext } from "react";
import { SessionContext } from "../context/SessionContext";

function useSignup() {
  const { signup, loading, error } = useContext(SessionContext);

  return { signup, loading, error };
}

export default useSignup;