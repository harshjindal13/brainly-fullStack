import { useRef, useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export function Signin(){

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const validateInputs = (username: string, password: string): boolean => {
    if (!username.trim()) {
      setError("Username is required");
      return false;
    }
    
    if (!password.trim()) {
      setError("Password is required");
      return false;
    }
    
    return true;
  };

  async function signin() {
    setError("");
    
    const username = usernameRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    
    if (!validateInputs(username, password)) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
        username: username.trim(),
        password: password.trim()
      });
      
      const jwt = response.data.token;
      
      if (!jwt) {
        setError("Authentication failed - no token received");
        return;
      }
      
      localStorage.setItem("token", jwt);
      navigate("/dashboard");
      
    } catch (error: any) {
      console.error("Signin error:", error);
      
      if (error.response) {
        if (error.response.status === 403) {
          setError("Invalid username or password");
        } else {
          setError(error.response.data.message || "Signin failed");
        }
      } else if (error.request) {
        setError("Network error. Please check your connection and ensure backend is running.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
    <div className="bg-white rounded-xl border min-w-48 p-8">
      <div className="px-10">
        <div className="text-3xl font-extrabold">
          Sign In
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 mt-4">
          {error}
        </div>
      )}
      
      <div className="pt-2">
        <Input ref={usernameRef} placeholder="Username" />
        <Input ref={passwordRef} placeholder="Password" type="password" />
        <div className="flex justify-center pt-4">
          <Button 
            onClick={signin} 
            variant="primary" 
            text={isLoading ? "Signing In..." : "Signin"}
            startIcon={<></>}
            loading={isLoading}
            fullWidth={true}
          />
        </div>
      </div>
      
      <div className="pt-4 text-center">
        <span className="text-sm text-gray-600">
          Don't have an account? 
          <button 
            onClick={() => navigate("/signup")}
            className="text-blue-600 hover:text-blue-800 ml-1"
          >
            Sign up
          </button>
        </span>
      </div>
    </div>
  </div>
}