import { useRef, useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";
import { BACKEND_URL } from "../config";
import axios from "axios";

enum ContentType {
    Youtube = "youtube",
    Twitter = "twitter"
}

interface CreateContentModalProps {
    open: boolean;
    onClose: () => void;
    onContentAdded?: () => void; // Callback to refresh content list
}

// controlled component
export function CreateContentModal({ open, onClose, onContentAdded }: CreateContentModalProps) {
    const titleRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);
    const [type, setType] = useState(ContentType.Youtube);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const validateInputs = (title: string, link: string): boolean => {
        if (!title.trim()) {
            setError("Title is required");
            return false;
        }
        
        if (!link.trim()) {
            setError("Link is required");
            return false;
        }
        
        // Basic URL validation
        try {
            new URL(link);
        } catch {
            setError("Please enter a valid URL");
            return false;
        }
        
        // YouTube URL validation
        if (type === ContentType.Youtube && !link.includes('youtube.com') && !link.includes('youtu.be')) {
            setError("Please enter a valid YouTube URL");
            return false;
        }
        
        // Twitter URL validation  
        if (type === ContentType.Twitter && !link.includes('twitter.com') && !link.includes('x.com')) {
            setError("Please enter a valid Twitter/X URL");
            return false;
        }
        
        return true;
    };

    async function addContent() {
        console.log("Submit button clicked"); // Debug log
        setError("");
        
        const title = titleRef.current?.value || "";
        const link = linkRef.current?.value || "";
        
        if (!validateInputs(title, link)) {
            return;
        }
        
        setIsLoading(true);
        
        try {
            const token = localStorage.getItem("token");
            console.log("Token found:", !!token); // Debug log
            
            if (!token) {
                setError("Please log in to add content");
                return;
            }
            
            console.log("Sending data:", { title, link, type }); // Debug log
            
            const response = await axios.post(`${BACKEND_URL}/api/v1/content`, {
                link: link.trim(),
                title: title.trim(),
                type
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`, // FIXED: Added Bearer prefix
                    "Content-Type": "application/json"
                }
            });
            
            console.log("Success:", response.data); // Debug log
            
            // Clear form
            if (titleRef.current) titleRef.current.value = "";
            if (linkRef.current) linkRef.current.value = "";
            
            // Refresh content list
            if (onContentAdded) {
                onContentAdded();
            }
            
            alert("Content added successfully!");
            onClose();
            
        } catch (error: any) {
            console.error("Error adding content:", error); // Debug log
            
            if (error.response) {
                setError(error.response.data.message || 'Server error occurred');
            } else if (error.request) {
                setError("Network error - check if backend is running on port 3000");
            } else {
                setError("Unexpected error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    if (!open) return null;

    return (
        <div className="w-screen h-screen bg-slate-500 bg-opacity-60 fixed top-0 left-0 flex justify-center">
            <div className="flex flex-col justify-center">
                <span className="bg-white opacity-100 p-4 rounded">
                    <div className="flex justify-end">
                        <div onClick={onClose} className="cursor-pointer">
                            <CrossIcon />
                        </div>
                    </div>
                    
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                            {error}
                        </div>
                    )}
                    
                    <div>
                        <Input ref={titleRef} placeholder={"Title"} />
                        <Input ref={linkRef} placeholder={"Link"} />
                    </div>
                    
                    <div>
                        <h1>Type</h1>
                        <div className="flex gap-1 justify-center pb-2">
                            <Button 
                                text="Youtube" 
                                variant={type === ContentType.Youtube ? "primary" : "secondary"} 
                                startIcon={<></>}
                                onClick={() => setType(ContentType.Youtube)}
                            />
                            <Button 
                                text="Twitter" 
                                variant={type === ContentType.Twitter ? "primary" : "secondary"} 
                                startIcon={<></>}
                                onClick={() => setType(ContentType.Twitter)}
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-center">
                        <Button 
                            onClick={addContent} 
                            variant="primary" 
                            text={isLoading ? "Adding..." : "Submit"}
                            startIcon={<></>}
                            loading={isLoading}
                        />
                    </div>
                </span>
            </div>
        </div>
    );

}