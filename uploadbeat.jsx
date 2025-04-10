import { useState, useRef, useEffect } from 'react';

export default function MusicUploadInterface() {
  const [musicFile, setMusicFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [currentTool, setCurrentTool] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [cropMode, setCropMode] = useState(false);
  const [cropStart, setCropStart] = useState({ x: 0, y: 0 });
  const [cropEnd, setCropEnd] = useState({ x: 0, y: 0 });
  const [brushColor, setBrushColor] = useState('#000000');

  const musicFileRef = useRef(null);
  const coverFileRef = useRef(null);
  const canvasRef = useRef(null);
  const originalImageRef = useRef(new Image());

  const handleMusicUpload = () => {
    musicFileRef.current.click();
  };

  const handleMusicFileChange = (e) => {
    if (e.target.files.length > 0) {
      setMusicFile(e.target.files[0]);
    }
  };

  const handleCoverUpload = (e) => {
    // Don't trigger if clicking edit button or image
    if (e.target.closest('.edit-btn') || e.target.tagName === 'IMG') {
      return;
    }
    coverFileRef.current.click();
  };

  const handleCoverFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        setCoverImage(event.target.result);
        setupCanvas(event.target.result);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const setupCanvas = (imageSrc) => {
    const img = new Image();
    img.src = imageSrc;
    originalImageRef.current = img;
    
    img.onload = function() {
      if (!canvasRef.current) return;
      
      const ctx = canvasRef.current.getContext('2d');
      const maxWidth = window.innerWidth * 0.8;
      const maxHeight = window.innerHeight * 0.5;
      
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height = height * ratio;
      }
      
      if (height > maxHeight) {
        const ratio = maxHeight / height;
        height = maxHeight;
        width = width * ratio;
      }
      
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
    };
  };

  const resetTools = () => {
    setCurrentTool(null);
    setCropMode(false);
    setRotation(0);
    
    if (originalImageRef.current.src && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(originalImageRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handleCancelEdit = () => {
    setShowEditor(false);
    resetTools();
  };

  const handleSaveEdit = () => {
    if (!canvasRef.current) return;
    
    const editedImageData = canvasRef.current.toDataURL('image/png');
    setCoverImage(editedImageData);
    setShowEditor(false);
    resetTools();
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setShowEditor(true);
  };

  const handleToolClick = (tool) => {
    setCurrentTool(tool);
    if (tool === 'crop') {
      setCropMode(true);
      
      if (canvasRef.current && originalImageRef.current.src) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(originalImageRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    } else {
      setCropMode(false);
    }
  };

  const handleRotate = () => {
    if (!canvasRef.current) return;
    
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    
    // Rotate the canvas
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    if (newRotation === 90 || newRotation === 270) {
      tempCanvas.width = canvasRef.current.height;
      tempCanvas.height = canvasRef.current.width;
    } else {
      tempCanvas.width = canvasRef.current.width;
      tempCanvas.height = canvasRef.current.height;
    }
    
    tempCtx.save();
    tempCtx.translate(tempCanvas.width/2, tempCanvas.height/2);
    tempCtx.rotate(newRotation * Math.PI / 180);
    
    if (newRotation === 90 || newRotation === 270) {
      tempCtx.drawImage(canvasRef.current, -canvasRef.current.height/2, -canvasRef.current.width/2);
    } else {
      tempCtx.drawImage(canvasRef.current, -canvasRef.current.width/2, -canvasRef.current.height/2);
    }
    
    tempCtx.restore();
    
    // Swap canvas dimensions if needed
    if (newRotation === 90 || newRotation === 270) {
      const temp = canvasRef.current.width;
      canvasRef.current.width = canvasRef.current.height;
      canvasRef.current.height = temp;
    }
    
    // Update the main canvas
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.drawImage(tempCanvas, 0, 0);
  };

  const handleMouseDown = (e) => {
    if (currentTool === 'paint' || currentTool === 'eraser') {
      setIsDrawing(true);
      setLastPosition({
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY
      });
    } else if (currentTool === 'crop') {
      setCropStart({
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY
      });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing && currentTool !== 'crop') return;
    
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    
    if (currentTool === 'paint') {
      draw(x, y);
    } else if (currentTool === 'eraser') {
      erase(x, y);
    } else if (currentTool === 'crop' && cropMode) {
      setCropEnd({
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY
      });
      
      // Redraw the image with crop rectangle
      if (canvasRef.current && originalImageRef.current.src) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(originalImageRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // Draw the crop rectangle
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(
          cropStart.x, 
          cropStart.y, 
          cropEnd.x - cropStart.x, 
          cropEnd.y - cropStart.y
        );
      }
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    
    if (currentTool === 'crop' && cropMode) {
      // Apply crop
      applyCrop();
      setCropMode(false);
    }
  };

  const applyCrop = () => {
    if (!canvasRef.current) return;
    
    const width = Math.abs(cropEnd.x - cropStart.x);
    const height = Math.abs(cropEnd.y - cropStart.y);
    
    if (width > 10 && height > 10) {
      const startX = Math.min(cropStart.x, cropEnd.x);
      const startY = Math.min(cropStart.y, cropEnd.y);
      
      const ctx = canvasRef.current.getContext('2d');
      const imageData = ctx.getImageData(startX, startY, width, height);
      
      // Resize canvas to the cropped area
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      
      // Draw the cropped image
      ctx.putImageData(imageData, 0, 0);
      
      // Update the original image for future operations
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.putImageData(imageData, 0, 0);
      
      const newImage = new Image();
      newImage.src = tempCanvas.toDataURL();
      originalImageRef.current = newImage;
    }
  };

  const draw = (x, y) => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(lastPosition.x, lastPosition.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    setLastPosition({ x, y });
  };

  const erase = (x, y) => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(lastPosition.x, lastPosition.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    setLastPosition({ x, y });
  };

  const handleColorChange = (e) => {
    setBrushColor(e.target.value);
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    
    const mouseEvent = {
      nativeEvent: {
        offsetX,
        offsetY
      }
    };
    
    handleMouseDown(mouseEvent);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    
    const mouseEvent = {
      nativeEvent: {
        offsetX,
        offsetY
      }
    };
    
    handleMouseMove(mouseEvent);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    handleMouseUp();
  };

  return (
    <div className="bg-gray-100 p-5 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b border-gray-200">
        <img src="./icons/menu-icon.png" alt="" className="w-6 cursor-pointer" />
        <button className="bg-green-600 text-white border-none py-2 px-5 rounded-full font-medium cursor-pointer">
          Upload
        </button>
        <div className="flex gap-4">
          <img src="./icons/search-icon.png" alt="" className="w-6 cursor-pointer" />
          <img src="./icons/settings-icon.png" alt="" className="w-6 cursor-pointer" />
        </div>
      </div>
      
      {/* Caption */}
      <input 
        type="text" 
        className="w-full border-none py-2.5 px-0 text-base mb-5 bg-transparent border-b border-gray-200 outline-none" 
        placeholder="Write a Caption..." 
      />
      
      {/* Music Upload */}
      <div 
        className="border-2 border-dashed border-green-600 rounded-lg p-6 text-center mb-5 relative cursor-pointer"
        onClick={handleMusicUpload}
      >
        {musicFile ? (
          <p className="text-green-600 font-medium">Selected: {musicFile.name}</p>
        ) : (
          <>
            <p className="text-green-600 font-medium mb-1">Choose music file to upload</p>
            <small className="text-gray-500 block mt-1">Select MP3, WAV, FLAC or AAC</small>
          </>
        )}
        <input 
          type="file" 
          ref={musicFileRef}
          accept=".mp3,.wav,.flac,.aac" 
          className="hidden"
          onChange={handleMusicFileChange}
        />
      </div>
      
      {/* Music Info */}
      <div className="flex items-center bg-white p-4 rounded-lg mb-5 shadow-sm">
        <div className="mr-4 text-2xl">🎵</div>
        <div>
          <div>Music</div>
          <small>Min: 5seconds</small>
        </div>
      </div>
      
      {/* Cover Upload */}
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-5 relative"
        onClick={handleCoverUpload}
      >
        {!coverImage ? (
          <div>
            <p>Choose a cover photo</p>
          </div>
        ) : (
          <div className="relative inline-block">
            <img src={coverImage} alt="Cover" className="max-w-full max-h-48" />
            <div 
              className="absolute top-2.5 right-2.5 bg-white bg-opacity-80 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-md edit-btn"
              onClick={handleEditClick}
            >
              ✏️
            </div>
          </div>
        )}
        <input 
          type="file" 
          ref={coverFileRef}
          accept="image/*" 
          className="hidden"
          onChange={handleCoverFileChange}
        />
      </div>
      
      {/* Platform Links */}
      <div className="bg-white p-5 rounded-lg">
        <h4 className="mb-4 text-gray-700">Streaming Platform Links</h4>
        
        <label className="block mb-1 text-gray-600">Apple Music</label>
        <input type="url" className="w-full p-3 border border-gray-300 rounded-lg mb-4 outline-none" />
        
        <label className="block mb-1 text-gray-600">Spotify</label>
        <input type="url" className="w-full p-3 border border-gray-300 rounded-lg mb-4 outline-none" />
        
        <label className="block mb-1 text-gray-600">Audiomack</label>
        <input type="url" className="w-full p-3 border border-gray-300 rounded-lg mb-4 outline-none" />
        
        <label className="block mb-1 text-gray-600">Youtube Music</label>
        <input type="url" className="w-full p-3 border border-gray-300 rounded-lg mb-4 outline-none" />
        
        <label className="block mb-1 text-gray-600">Boomplay Music</label>
        <input type="url" className="w-full p-3 border border-gray-300 rounded-lg mb-4 outline-none" />
        
        <div className="flex justify-center">
          <button className="text-center border border-green-500 bg-white text-green-500 rounded-full py-2.5 px-5 cursor-pointer">
            Save
          </button>
        </div>
      </div>
      
      {/* Upload Options */}
      <div className="mt-6">
        <div className="flex justify-around">
          <button className="bg-transparent border border-green-500 text-green-500 text-sm cursor-pointer py-2.5 px-5">
            Cancel
          </button>
          <button className="bg-green-500 text-white border-none rounded py-2.5 px-6 text-sm cursor-pointer">
            Upload
          </button>
        </div>
      </div>
      
      {/* Bottom Nav */}
      <div className="flex justify-around pt-4 mt-8 border-t border-gray-200">
        <div className="flex flex-col items-center text-xs">
          <div className="mb-1">
            <img src="./icons/home.svg" alt="" className="w-6" />
          </div>
          <div>Home</div>
        </div>
        <div className="flex flex-col items-center text-xs">
          <div className="mb-1">
            <img src="./icons/message.svg" alt="" className="w-6" />
          </div>
          <div>Messages</div>
        </div>
        <div className="flex flex-col items-center text-xs text-green-500">
          <div className="mb-1">
            <img src="./icons/upload.svg" alt="" className="w-6" />
          </div>
          <div>Upload</div>
        </div>
        <div className="flex flex-col items-center text-xs">
          <div className="mb-1">
            <img src="./icons/activities.svg" alt="" className="w-6" />
          </div>
          <div>Activities</div>
        </div>
        <div className="flex flex-col items-center text-xs">
          <div className="mb-1">
            <img src="./icons/profile.svg" alt="" className="w-6" />
          </div>
          <div>Profile</div>
        </div>
      </div>
      
      {/* Editor Overlay */}
      {showEditor && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-white w-11/12 max-w-lg rounded-lg p-5 relative">
            <div className="text-center mb-5 text-lg">Edit Cover Photo</div>
            <div className="text-center">
              <canvas 
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="border border-gray-300 max-w-full"
              />
            </div>
            <div className="flex justify-center my-5 flex-wrap">
              <button 
                className={`m-1 py-2 px-4 ${currentTool === 'crop' ? 'bg-gray-300' : 'bg-gray-100'} border-none rounded-full cursor-pointer`}
                onClick={() => handleToolClick('crop')}
              >
                Crop
              </button>
              <button 
                className="m-1 py-2 px-4 bg-gray-100 border-none rounded-full cursor-pointer"
                onClick={handleRotate}
              >
                Rotate
              </button>
              <button 
                className={`m-1 py-2 px-4 ${currentTool === 'paint' ? 'bg-gray-300' : 'bg-gray-100'} border-none rounded-full cursor-pointer`}
                onClick={() => handleToolClick('paint')}
              >
                Paint
              </button>
              <input 
                type="color" 
                value={brushColor}
                onChange={handleColorChange}
                className="w-10 h-8 border-none p-0 m-1"
              />
              <button 
                className={`m-1 py-2 px-4 ${currentTool === 'eraser' ? 'bg-gray-300' : 'bg-gray-100'} border-none rounded-full cursor-pointer`}
                onClick={() => handleToolClick('eraser')}
              >
                Eraser
              </button>
            </div>
            <div className="flex justify-between mt-5">
              <button 
                className="py-2.5 px-5 bg-gray-100 border-none rounded cursor-pointer"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
              <button 
                className="py-2.5 px-5 bg-green-600 text-white border-none rounded cursor-pointer"
                onClick={handleSaveEdit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}