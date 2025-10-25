import { ShareIcon } from "../icons/ShareIcon";
import { useState } from "react";

interface CardProps {
    title: string;
    link: string;
    type: "twitter" | "youtube";
}

// Enhanced YouTube video ID extraction with Shorts support
function getYouTubeVideoId(url: string): { videoId: string | null; isShort: boolean } {
    const regexPatterns = [
        { pattern: /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/, isShort: false },
        { pattern: /youtube\.com\/embed\/([^&\n?#]+)/, isShort: false },
        { pattern: /youtube\.com\/v\/([^&\n?#]+)/, isShort: false },
        { pattern: /youtube\.com\/shorts\/([^&\n?#]+)/, isShort: true },
        { pattern: /youtu\.be\/([^&\n?#]+)/, isShort: false }
    ];
    
    for (const { pattern, isShort } of regexPatterns) {
        const match = url.match(pattern);
        if (match) {
            return { videoId: match[1], isShort };
        }
    }
    return { videoId: null, isShort: false };
}

// Get optimal thumbnail URL with multiple fallbacks
function getYouTubeThumbnailUrl(videoId: string, isShort: boolean): string[] {
    const baseUrl = `https://img.youtube.com/vi/${videoId}`;
    
    if (isShort) {
        // For Shorts, prioritize vertical-friendly thumbnails
        return [
            `${baseUrl}/maxresdefault.jpg`,
            `${baseUrl}/hqdefault.jpg`,
            `${baseUrl}/mqdefault.jpg`,
            `${baseUrl}/default.jpg`
        ];
    } else {
        // For regular videos
        return [
            `${baseUrl}/maxresdefault.jpg`,
            `${baseUrl}/sddefault.jpg`,
            `${baseUrl}/hqdefault.jpg`,
            `${baseUrl}/mqdefault.jpg`,
            `${baseUrl}/default.jpg`
        ];
    }
}

function getTwitterEmbedUrl(url: string): string {
    const twitterUrl = url.replace('x.com', 'twitter.com');
    return `https://platform.twitter.com/embed/Tweet.html?url=${encodeURIComponent(twitterUrl)}`;
}

export function Card({ title, link, type }: CardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [currentThumbnailIndex, setCurrentThumbnailIndex] = useState(0);
    
    const renderYouTubeContent = () => {
        const { videoId, isShort } = getYouTubeVideoId(link);
        
        if (!videoId) {
            return (
                <div className="bg-red-100 p-4 rounded text-red-700 text-sm min-h-[100px] flex items-center justify-center">
                    Invalid YouTube URL format
                </div>
            );
        }

        const thumbnailUrls = getYouTubeThumbnailUrl(videoId, isShort);
        const currentThumbnailUrl = thumbnailUrls[currentThumbnailIndex];

        const handleImageError = () => {
            if (currentThumbnailIndex < thumbnailUrls.length - 1) {
                setCurrentThumbnailIndex(currentThumbnailIndex + 1);
            }
        };

        return (
            <div className={`relative cursor-pointer group ${isShort ? 'aspect-[9/16] max-h-[400px]' : 'aspect-video'}`}>
                {/* Loading placeholder */}
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse rounded flex items-center justify-center">
                        <div className="text-gray-500 text-sm">Loading...</div>
                    </div>
                )}
                
                {/* YouTube Thumbnail */}
                <img
                    src={currentThumbnailUrl}
                    alt={title}
                    className={`w-full h-full object-cover rounded transition-all duration-300 group-hover:opacity-90 ${
                        imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    onError={handleImageError}
                    onClick={() => window.open(link, '_blank')}
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-red-600 rounded-full p-3 shadow-lg transform scale-100 group-hover:scale-110 transition-transform duration-200">
                        <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                        </svg>
                    </div>
                </div>
                
                {/* Content Type Badge */}
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                    {isShort ? '🩳 Short' : '📹 Video'}
                </div>
                
                {/* Gradient overlay for better text readability */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent h-16 rounded-b"></div>
            </div>
        );
    };

    const renderTwitterContent = () => {
        return (
            <div className="w-full min-h-[200px] max-h-[600px] relative">
                <iframe
                    src={getTwitterEmbedUrl(link)}
                    className="w-full h-full border-0 rounded"
                    sandbox="allow-scripts allow-same-origin allow-popups"
                    loading="lazy"
                    title={`Twitter post: ${title}`}
                    style={{ minHeight: '200px' }}
                />
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 w-full max-w-sm">
            {/* Content Area - Dynamic Height */}
            <div className="relative">
                {type === "youtube" && renderYouTubeContent()}
                {type === "twitter" && renderTwitterContent()}
            </div>
            
            {/* Card Footer - Fixed Height */}
            <div className="p-4 bg-white">
                <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-gray-900 line-clamp-2 leading-tight">
                            {title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                            {type === "youtube" ? "YouTube" : "Twitter"} • {new Date().toLocaleDateString()}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                            onClick={() => window.open(link, '_blank')}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                            title="Open in new tab"
                        >
                            <ShareIcon />
                        </button>
                        
                        <button
                            onClick={() => {/* Handle share/copy functionality */}}
                            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-all duration-200"
                            title="Share"
                        >
                            <ShareIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}