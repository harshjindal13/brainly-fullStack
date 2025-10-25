import { ShareIcon } from "../icons/ShareIcon";
import { useEffect } from "react";

interface CardProps {
    title: string;
    link: string;
    type: "twitter" | "youtube";
}

// Utility function to extract YouTube video ID from various URL formats
function getYouTubeVideoId(url: string): string | null {
    const regexPatterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
        /youtube\.com\/embed\/([^&\n?#]+)/,
        /youtube\.com\/v\/([^&\n?#]+)/
    ];
    
    for (const pattern of regexPatterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

// Utility function to get Twitter embed URL  
function getTwitterEmbedUrl(url: string): string {
    const twitterUrl = url.replace('x.com', 'twitter.com');
    return `https://platform.twitter.com/embed/Tweet.html?url=${encodeURIComponent(twitterUrl)}`;
}

export function Card({ title, link, type }: CardProps) {
    // Initialize Twitter widgets when component mounts
    useEffect(() => {
        if (type === "twitter" && (window as any).twttr) {
            (window as any).twttr.widgets.load();
        }
    }, [type]);

    const renderYouTubeContent = () => {
        const videoId = getYouTubeVideoId(link);
        
        if (!videoId) {
            return (
                <div className="bg-red-100 p-4 rounded text-red-700 text-sm">
                    Invalid YouTube URL format
                </div>
            );
        }

        return (
            <div className="relative cursor-pointer group" onClick={() => window.open(link, '_blank')}>
                {/* YouTube Thumbnail Image */}
                <img
                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                    alt={title}
                    className="w-full h-48 object-cover rounded transition-opacity group-hover:opacity-90"
                    onError={(e) => {
                        // Fallback to standard definition if maxres not available
                        const target = e.target as HTMLImageElement;
                        if (target.src.includes('maxresdefault')) {
                            target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                        } else if (target.src.includes('hqdefault')) {
                            target.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                        }
                    }}
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-red-600 rounded-full p-3 opacity-80 group-hover:opacity-100 transition-opacity shadow-lg">
                        <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                        </svg>
                    </div>
                </div>
                
                {/* Video Duration Badge (Optional) */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                    YouTube
                </div>
            </div>
        );
    };

    const renderTwitterContent = () => {
        return (
            <div className="w-full">
                <blockquote className="twitter-tweet" data-theme="light">
                    <a href={link.replace('x.com', 'twitter.com')} target="_blank" rel="noopener noreferrer">
                        {title}
                    </a>
                </blockquote>
                <div className="text-sm text-gray-500 mt-2">
                    <a 
                        href={link.replace('x.com', 'twitter.com')} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                    >
                        View on Twitter →
                    </a>
                </div>
            </div>
        );
    };

    return (
        <div className="p-4 bg-white rounded-md border-gray-200 max-w-96 border">
            <div className="flex justify-between">
                <div className="flex items-center">
                    <div className="text-gray-500 pr-2">
                        <ShareIcon />
                    </div>
                    <div className="font-medium text-sm">
                        {title}
                    </div>
                </div>
                
                <div className="flex items-center">
                    <div className="pr-2 text-gray-500">
                        <a 
                            href={link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-blue-600"
                        >
                            <ShareIcon />
                        </a>
                    </div>
                    <div className="text-gray-500 cursor-pointer hover:text-gray-700">
                        <ShareIcon />
                    </div>
                </div>
            </div>
            
            <div className="pt-4">
                {type === "youtube" && renderYouTubeContent()}
                {type === "twitter" && renderTwitterContent()}
            </div>
        </div>
    );
}