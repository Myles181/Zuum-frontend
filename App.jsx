import React, { useState, useRef, useEffect } from 'react';

const UploadBeat = () => {
  // State for file uploads
  const [musicFile, setMusicFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  
  // Refs for file inputs and canvas
  const musicFileInputRef = useRef(null);
  const coverFileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const originalImageRef = useRef(new Image());
  
  // Editor state
  const [editorOpen, setEditorOpen] = useState(false);
  const [currentTool, setCurrentTool] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [cropMode, setCropMode] = useState(false);
  const [cropStart, setCropStart] = useState({ x: 0, y: 0 });
  const [cropEnd, setCropEnd] = useState({ x: 0, y: 0 });
  const [color, setColor] = useState('#000000');
  
  // Platform links state
  const [platformLinks, setPlatformLinks] = useState({
    apple: '',
    spotify: '',
    audiomack: '',
    youtube: '',
    boomplay: ''
  });
  
  // Caption state
  const [caption, setCaption] = useState('');

  // Handle music file selection
  const handleMusicUpload = () => {
    musicFileInputRef.current.click();
  };

  const handleMusicFileChange = (e) => {
    if (e.target.files.length > 0) {
      setMusicFile(e.target.files[0]);
    }
  };

  // Handle cover image selection
  const handleCoverUpload = (e) => {
    // Don't trigger if clicking the edit button or the image itself
    if (e.target === document.getElementById('editCoverBtn') || 
        e.target === document.getElementById('coverImage')) {
      return;
    }
    coverFileInputRef.current.click();
  };

  const handleCoverFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setCoverImage(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setCoverImageUrl(event.target.result);
        setupCanvas(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Editor functions
  const setupCanvas = (imageSrc) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    originalImageRef.current = new Image();
    originalImageRef.current.src = imageSrc;
    
    originalImageRef.current.onload = function() {
      // Set canvas dimensions based on the image
      const maxWidth = window.innerWidth * 0.8;
      const maxHeight = window.innerHeight * 0.5;
      
      let width = originalImageRef.current.width;
      let height = originalImageRef.current.height;
      
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
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw the image on the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(originalImageRef.current, 0, 0, width, height);
    };
  };

  const openEditor = () => {
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    resetTools();
  };

  const saveEditedImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Get the edited image data
    const editedImageData = canvas.toDataURL('image/png');
    setCoverImageUrl(editedImageData);
    
    // Close the editor
    setEditorOpen(false);
    resetTools();
  };

  const resetTools = () => {
    setCurrentTool(null);
    setCropMode(false);
    setRotation(0);
    
    // Reset the canvas
    const canvas = canvasRef.current;
    if (canvas && originalImageRef.current.src) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(originalImageRef.current, 0, 0, canvas.width, canvas.height);
    }
  };

  const handleCropTool = () => {
    setCurrentTool('crop');
    setCropMode(true);
    
    // Reset the canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(originalImageRef.current, 0, 0, canvas.width, canvas.height);
    }
  };

  const handleRotateTool = () => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Rotate the canvas
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    if (newRotation === 90 || newRotation === 270) {
      tempCanvas.width = canvas.height;
      tempCanvas.height = canvas.width;
    } else {
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
    }
    
    tempCtx.save();
    tempCtx.translate(tempCanvas.width/2, tempCanvas.height/2);
    tempCtx.rotate(newRotation * Math.PI / 180);
    
    if (newRotation === 90 || newRotation === 270) {
      tempCtx.drawImage(canvas, -canvas.height/2, -canvas.width/2);
    } else {
      tempCtx.drawImage(canvas, -canvas.width/2, -canvas.height/2);
    }
    
    tempCtx.restore();
    
    // Swap canvas dimensions if needed
    if (newRotation === 90 || newRotation === 270) {
      const temp = canvas.width;
      canvas.width = canvas.height;
      canvas.height = temp;
    }
    
    // Update the main canvas
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);
  };

  const handlePaintTool = () => {
    setCurrentTool('paint');
    setCropMode(false);
  };

  const handleEraseTool = () => {
    setCurrentTool('eraser');
    setCropMode(false);
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (currentTool === 'paint' || currentTool === 'eraser') {
      setIsDrawing(true);
      setLastPos({ x, y });
    } else if (currentTool === 'crop') {
      setCropStart({ x, y });
    }
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (!isDrawing && currentTool !== 'crop') return;
    
    const ctx = canvas.getContext('2d');
    
    if (currentTool === 'paint' && isDrawing) {
      draw(x, y, ctx);
    } else if (currentTool === 'eraser' && isDrawing) {
      erase(x, y, ctx);
    } else if (currentTool === 'crop' && cropMode) {
      // Draw crop rectangle
      setCropEnd({ x, y });
      
      // Redraw the image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(originalImageRef.current, 0, 0, canvas.width, canvas.height);
      
      // Draw the crop rectangle
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        cropStart.x, 
        cropStart.y, 
        x - cropStart.x, 
        y - cropStart.y
      );
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    
    if (currentTool === 'crop' && cropMode) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      
      // Apply crop
      const width = Math.abs(cropEnd.x - cropStart.x);
      const height = Math.abs(cropEnd.y - cropStart.y);
      
      if (width > 10 && height > 10) {
        const startX = Math.min(cropStart.x, cropEnd.x);
        const startY = Math.min(cropStart.y, cropEnd.y);
        
        const imageData = ctx.getImageData(startX, startY, width, height);
        
        // Resize canvas to the cropped area
        canvas.width = width;
        canvas.height = height;
        
        // Draw the cropped image
        ctx.putImageData(imageData, 0, 0);
        
        // Update the original image for future operations
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.putImageData(imageData, 0, 0);
        
        originalImageRef.current = new Image();
        originalImageRef.current.src = tempCanvas.toDataURL();
      }
      
      setCropMode(false);
    }
  };

  const draw = (x, y, ctx) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    setLastPos({ x, y });
  };

  const erase = (x, y, ctx) => {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    setLastPos({ x, y });
  };

  // Handle touch events
  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvasRef.current.dispatchEvent(mouseEvent);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvasRef.current.dispatchEvent(mouseEvent);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup');
    canvasRef.current.dispatchEvent(mouseEvent);
  };

  // Handle platform links input
  const handlePlatformLinkChange = (platform, value) => {
    setPlatformLinks({
      ...platformLinks,
      [platform]: value
    });
  };

  // Handle form submission
  const handleUpload = () => {
    // Here you would typically send the data to a server
    console.log('Uploading music:', {
      caption,
      musicFile,
      coverImage,
      platformLinks
    });
    
    // Clear form or redirect after upload
    alert('Upload successful!');
  };

  return (
    <div style={{ 
      margin: 0, 
      padding: 0, 
      boxSizing: 'border-box', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
      backgroundColor: '#f5f5f5',
      padding: '20px',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      <div className="header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: '1px solid #eee'
      }}>
        <img src="./icons/menu-icon.png" alt="Menu" />
        
        <button className="upload-btn" style={{
          backgroundColor: '#3a9f7e',
          color: 'white',
          border: 'none',
          padding: '8px 20px',
          borderRadius: '20px',
          fontWeight: 500,
          cursor: 'pointer'
        }}>Upload</button>
        
        <div className="search-settings" style={{
          display: 'flex',
          gap: '16px'
        }}>
          <img src="./icons/search-icon.png" alt="Search" />
          <img src="./icons/settings-icon.png" alt="Settings" />
        </div>
      </div>
      
      <input 
        type="text" 
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="caption-input" 
        placeholder="Write a Caption..." 
        style={{
          width: '100%',
          border: 'none',
          padding: '10px 0',
          fontSize: '16px',
          marginBottom: '20px',
          backgroundColor: 'transparent',
          borderBottom: '1px solid #e0e0e0',
          outline: 'none'
        }}
      />
      
      <div 
        className="upload-section" 
        onClick={handleMusicUpload} 
        style={{
          border: '2px dashed #3a9f7e',
          borderRadius: '10px',
          padding: '25px',
          textAlign: 'center',
          marginBottom: '20px',
          position: 'relative',
          cursor: 'pointer'
        }}
      >
        {musicFile ? (
          <p style={{ color: '#3a9f7e', fontWeight: 500 }}>Selected: {musicFile.name}</p>
        ) : (
          <>
            <p style={{ color: '#3a9f7e', fontWeight: 500, marginBottom: '5px' }}>Choose music file to upload</p>
            <small style={{ color: '#777', display: 'block', marginTop: '5px' }}>Select MP3, WAV, FLAC or AAC</small>
          </>
        )}
        <input 
          type="file" 
          ref={musicFileInputRef}
          onChange={handleMusicFileChange}
          accept=".mp3,.wav,.flac,.aac" 
          style={{display: 'none'}} 
        />
      </div>
      
      <div className="music-info" style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div className="music-icon" style={{ marginRight: '15px', fontSize: '24px' }}>🎵</div>
        <div>
          <div>Music</div>
          <small>Min: 5seconds</small>
        </div>
      </div>
      
      <div 
        className="cover-section" 
        onClick={handleCoverUpload} 
        style={{
          border: '2px dashed #ccc',
          borderRadius: '10px',
          padding: '25px',
          textAlign: 'center',
          marginBottom: '20px',
          position: 'relative'
        }}
      >
        {!coverImageUrl ? (
          <div id="coverPlaceholder">
            <p>Choose a cover photo</p>
          </div>
        ) : (
          <div className="cover-preview" style={{ position: 'relative', display: 'inline-block' }}>
            <img 
              id="coverImage" 
              src={coverImageUrl} 
              alt="Cover" 
              style={{ maxWidth: '100%', maxHeight: '200px', display: 'block' }}
            />
            <div 
              id="editCoverBtn" 
              onClick={(e) => {
                e.stopPropagation();
                openEditor();
              }}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: 'rgba(255,255,255,0.8)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}
            >
              ✏️
            </div>
          </div>
        )}
        <input 
          type="file" 
          ref={coverFileInputRef}
          onChange={handleCoverFileChange}
          accept="image/*" 
          style={{display: 'none'}} 
        />
      </div>
      
      <div className="platform-links" style={{
        background: 'white',
        padding: '20px',
        borderRadius: '10px'
      }}>
        <h4 style={{ marginBottom: '15px', color: '#444' }}>Streaming Platform Links</h4>
        
        <label className="platform-label" style={{ display: 'block', marginBottom: '5px', color: '#555' }}>
          Apple Music
        </label>
        <input 
          type="url" 
          className="platform-input" 
          value={platformLinks.apple}
          onChange={(e) => handlePlatformLinkChange('apple', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            marginBottom: '15px',
            outline: 'none'
          }}
        />
        
        <label className="platform-label" style={{ display: 'block', marginBottom: '5px', color: '#555' }}>
          Spotify
        </label>
        <input 
          type="url" 
          className="platform-input" 
          value={platformLinks.spotify}
          onChange={(e) => handlePlatformLinkChange('spotify', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            marginBottom: '15px',
            outline: 'none'
          }}
        />
        
        <label className="platform-label" style={{ display: 'block', marginBottom: '5px', color: '#555' }}>
          Audiomack
        </label>
        <input 
          type="url" 
          className="platform-input" 
          value={platformLinks.audiomack}
          onChange={(e) => handlePlatformLinkChange('audiomack', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            marginBottom: '15px',
            outline: 'none'
          }}
        />
        
        <label className="platform-label" style={{ display: 'block', marginBottom: '5px', color: '#555' }}>
          Youtube Music
        </label>
        <input 
          type="url" 
          className="platform-input" 
          value={platformLinks.youtube}
          onChange={(e) => handlePlatformLinkChange('youtube', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            marginBottom: '15px',
            outline: 'none'
          }}
        />
        
        <label className="platform-label" style={{ display: 'block', marginBottom: '5px', color: '#555' }}>
          Boomplay Music
        </label>
        <input 
          type="url" 
          className="platform-input" 
          value={platformLinks.boomplay}
          onChange={(e) => handlePlatformLinkChange('boomplay', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            marginBottom: '15px',
            outline: 'none'
          }}
        />

        <div className="save-button" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <button className="save-info" style={{
            textAlign: 'center',
            border: 'green 1px solid',
            backgroundColor: 'white',
            color: 'green',
            borderRadius: '20px',
            padding: '10px 20px',
            cursor: 'pointer'
          }}>Save</button>
        </div>
      </div>
      
      <div className="upload-options">
        <div className="button-container" style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginTop: '30px'
        }}>
          <button className="cancel-btn" style={{
            background: 'transparent',
            border: 'green 1px solid',
            color: '#06f04c',
            fontSize: '14px',
            cursor: 'pointer',
            padding: '10px 20px'
          }}>Cancel</button>
          
          <button 
            className="submit-btn" 
            id="upload-btn"
            onClick={handleUpload}
            style={{
              backgroundColor: '#2ecc71',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '10px 25px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Upload
          </button>
        </div>
      </div>
      
      <div className="bottom-nav" style={{
        borderRadius: '10px',
        paddingTop: '1em',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '8px 0',
        borderTop: '1px solid #eaeaea'
      }}>
        <div className="nav-item" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontSize: '12px'
        }}>
          <div className="nav-icon" style={{ marginBottom: '-6px', fontSize: '24px' }}>
            <img src="./icons/home.svg" alt="Home" />
          </div>
          <div className="nav-text" style={{ fontSize: '12px' }}>Home</div>
        </div>
        
        <div className="nav-item" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontSize: '12px'
        }}>
          <div className="nav-icon" style={{ marginBottom: '-6px', fontSize: '24px' }}>
            <img src="./icons/message.svg" alt="Messages" />
          </div>
          <div className="nav-text" style={{ fontSize: '12px' }}>Messages</div>
        </div>
        
        <div className="nav-item active" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontSize: '12px',
          color: '#22c55e'
        }}>
          <div className="nav-icon" style={{ marginBottom: '-6px', fontSize: '24px' }}>
            <img src="./icons/upload.svg" alt="Upload" />
          </div>
          <div className="nav-text active" style={{ fontSize: '12px' }}>Upload</div>
        </div>
        
        <div className="nav-item" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontSize: '12px'
        }}>
          <div className="nav-icon" style={{ marginBottom: '-6px', fontSize: '24px' }}>
            <img src="./icons/activities.svg" alt="Activities" />
          </div>
          <div className="nav-text" style={{ fontSize: '12px' }}>Activities</div>
        </div>
        
        <div className="nav-item" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontSize: '12px'
        }}>
          <div className="nav-icon" style={{ marginBottom: '-6px', fontSize: '24px' }}>
            <img src="./icons/profile.svg" alt="Profile" />
          </div>
          <div className="nav-text" style={{ fontSize: '12px' }}>Profile</div>
        </div>
      </div>
      
      {/* Editor overlay */}
      {editorOpen && (
        <div 
          className="editor-overlay" 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
        >
          <div className="editor-container" style={{
            backgroundColor: 'white',
            width: '90%',
            maxWidth: '500px',
            borderRadius: '10px',
            padding: '20px',
            position: 'relative'
          }}>
            <div className="editor-title" style={{
              textAlign: 'center',
              marginBottom: '20px',
              fontSize: '18px'
            }}>Edit Cover Photo</div>
            
            <div className="editor-canvas-container" style={{
              margin: '0 auto',
              textAlign: 'center'
            }}>
              <canvas 
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ border: '1px solid #ccc', maxWidth: '100%' }}
              />
            </div>
            
            <div className="editor-tools" style={{
              display: 'flex',
              justifyContent: 'center',
              margin: '20px 0',
              flexWrap: 'wrap'
            }}>
              <button 
                className="editor-tool" 
                onClick={handleCropTool}
                style={{
                  margin: '5px',
                  padding: '8px 15px',
                  backgroundColor: currentTool === 'crop' ? '#e0e0e0' : '#f0f0f0',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer'
                }}
              >
                Crop
              </button>
              
              <button 
                className="editor-tool" 
                onClick={handleRotateTool}
                style={{
                  margin: '5px',
                  padding: '8px 15px',
                  backgroundColor: '#f0f0f0',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer'
                }}
              >
                Rotate
              </button>
              
              <button 
                className="editor-tool" 
                onClick={handlePaintTool}
                style={{
                  margin: '5px',
                  padding: '8px 15px',
                  backgroundColor: currentTool === 'paint' ? '#e0e0e0' : '#f0f0f0',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer'
                }}
              >
                Paint
              </button>
              
              <input 
                type="color" 
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{
                  width: '40px',
                  height: '30px',
                  border: 'none',
                  padding: 0,
                  margin: '5px'
                }}
              />
              
              <button 
                className="editor-tool" 
                onClick={handleEraseTool}
                style={{
                  margin: '5px',
                  padding: '8px 15px',
                  backgroundColor: currentTool === 'eraser' ? '#e0e0e0' : '#f0f0f0',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer'
                }}
              >
                Eraser
              </button>
            </div>
            
            <div className="editor-buttons" style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '20px'
            }}>
              <button 
                className="editor-btn cancel-btn" 
                onClick={closeEditor}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  backgroundColor: '#f0f0f0'
                }}
              >
                Cancel
              </button>
              
              <button 
                className="editor-btn save-btn" 
                onClick={saveEditedImage}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  backgroundColor: '#3a9f7e',
                  color: 'white',
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadBeat;