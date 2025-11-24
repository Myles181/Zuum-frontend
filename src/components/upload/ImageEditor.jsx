import React, { useRef } from 'react';

const ImageEditor = ({ coverPreview, handleMouseDown, handleMouseMove, handleMouseUp, handleToolClick, handleRotate, handleColorChange, handleCancelEdit, handleSaveEdit, editorTool, color }) => {
  const canvasRef = useRef(null);
  const tempCanvasRef = useRef(null);

  return (
    <div className="editor-overlay fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-80 flex justify-center items-center z-50">
      <div className="editor-container bg-white p-6 rounded-lg shadow-lg w-full max-w-500">
        <div className="editor-title text-center text-gray-800 font-medium mb-4">Edit Cover Photo</div>
        <div className="editor-canvas-container">
          <canvas ref={canvasRef} className="border border-gray-300 rounded-lg" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}></canvas>
          <canvas ref={tempCanvasRef} className="hidden"></canvas>
        </div>
        <div className="editor-tools flex justify-center flex-wrap gap-2 mt-4">
          <button className={`editor-tool px-4 py-2 rounded-full ${editorTool === 'paint' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-green-600 hover:text-white transition-colors duration-200`} onClick={() => handleToolClick('paint')}>Paint</button>
          <button className={`editor-tool px-4 py-2 rounded-full ${editorTool === 'eraser' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-green-600 hover:text-white transition-colors duration-200`} onClick={() => handleToolClick('eraser')}>Eraser</button>
          <button className={`editor-tool px-4 py-2 rounded-full ${editorTool === 'crop' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-green-600 hover:text-white transition-colors duration-200`} onClick={() => handleToolClick('crop')}>Crop</button>
          <input type="color" id="colorPicker" value={color} onChange={handleColorChange} className="editor-tool w-10 h-6 rounded-full" />
          <button className={`editor-tool px-4 py-2 rounded-full ${editorTool === 'rotate' ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-green-600 hover:text-white transition-colors duration-200`} onClick={handleRotate}>Rotate</button>
        </div>
      
      </div>
    </div>
  );
};

export default ImageEditor;