import { useCallback, useEffect, useRef, useState } from "react";
import "tailwindcss";
function App() {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelect = useCallback((file) => {
    if (!file) return;
    
    if (file.type.startsWith('video/')) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      alert('Please select a valid video file (MP4, MOV, AVI, etc.)');
    }
  }, [previewUrl]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleClear = () => {
    fileInputRef.current.value = '';
    setPreviewUrl(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div 
        className={`border-2 border-dashed rounded-xl p-4 transition-all
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${previewUrl ? 'aspect-video' : 'min-h-[200px]'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="video/*"
          onChange={handleInputChange}
          ref={fileInputRef}
          className="hidden"
          id="videoInput"
        />
        
        {!previewUrl ? (
          <label
            htmlFor="videoInput"
            className="cursor-pointer w-full h-full flex flex-col items-center justify-center gap-4"
          >
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <div className="text-center">
              <p className="text-gray-600">
                Drag and drop video or{' '}
                <span className="text-blue-600 font-medium">browse files</span>
              </p>
              <p className="text-sm text-gray-400 mt-1">
                MP4, AVI, MOV, WMV (Max 500MB)
              </p>
            </div>
          </label>
        ) : (
          <div className="relative w-full h-full">
            <video
              controls
              className="w-full h-full rounded-lg object-contain"
              src={previewUrl}
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={handleClear}
                className="px-3 py-1 bg-white/90 rounded-md text-gray-700 shadow-sm hover:bg-white transition-colors"
              >
                Change
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Button */}
      {previewUrl && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {/* Add your upload logic here */}}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload Video
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
