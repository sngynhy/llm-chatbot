import { useContext } from "react";
import { LoadingContext } from "context/LoadingContext";

// 📍 3. custom hook 생성
function useLoading () {
    const context = useContext(LoadingContext)
    // if (!context) throw new Error("useLoading must be used within a LoadingProvider");
    
    return context
}

export default useLoading