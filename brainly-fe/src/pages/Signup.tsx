import { useRef, useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";


export function Signup(){

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
    
    if (username.length < 3) {
      setError("Username must be at least 3 characters long");
      return false;
    }
    
    if (!password.trim()) {
      setError("Password is required");
      return false;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    
    return true;
  };

  async function signup() {
    setError("");
    
    const username = usernameRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    
    if (!validateInputs(username, password)) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await axios.post(`${BACKEND_URL}/api/v1/signup`, {
        username: username.trim(),
        password: password.trim()
      });
      
      alert("Account created successfully! Please sign in.");
      navigate("/signin");
      
    } catch (error: any) {
      console.error("Signup error:", error);
      
      if (error.response) {
        setError(error.response.data.message || "Signup failed");
      } else if (error.request) {
        setError("Network error. Please check your connection.");
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
          Sign Up
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
            onClick={signup} 
            variant="primary" 
            text={isLoading ? "Creating Account..." : "Signup"}
            startIcon={<></>}
            loading={isLoading}
            fullWidth={true}
          />
        </div>
      </div>
      
      <div className="pt-4 text-center">
        <span className="text-sm text-gray-600">
          Already have an account? 
          <button 
            onClick={() => navigate("/signin")}
            className="text-blue-600 hover:text-blue-800 ml-1"
          >
            Sign in
          </button>
        </span>
      </div>
    </div>
  </div>
}