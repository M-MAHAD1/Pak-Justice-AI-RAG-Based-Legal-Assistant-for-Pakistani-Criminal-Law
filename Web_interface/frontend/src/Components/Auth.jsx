import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { setAuth } from "../utils/auth";
import { useState } from "react";

export default function Auth({ onError } = {}) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const handleClick = async() => {
        setLoading(true);
        if (onError) onError("");
        try{
            const provider = new GoogleAuthProvider();
            const gooleAuth = getAuth(app);
            const result = await signInWithPopup(gooleAuth, provider);
           const response = await fetch("http://localhost:3000/api/auth/google", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: result.user.email,
                name: result.user.displayName
            })
              });
                const data = await response.json().catch(() => ({}));
                if (!response.ok) {
                    throw new Error(data?.message || "Google login failed");
                }
                setAuth(data?.token);
                navigate("/");
        }
        catch(err){
            const message = err?.message || "Google Sign-In Error";
            if (onError) onError(message);
            else console.log("Google Sign-In Error:", err);

        }
        finally {
            setLoading(false);
        }
    }
    return (
        <button
        type="button"
        onClick={handleClick}
        disabled={loading}
         className={
            "w-full bg-red-700 hover:bg-red-600 text-white font-medium py-2.5 rounded-md tracking-wide transition-all active:scale-[0.99] shadow-lg shadow-[#e69d12]/15 " +
            (loading ? "opacity-70 cursor-not-allowed" : "")
         }>
            {loading ? "Signing in..." : "Sign In with Google"}
        </button>
    );
}

