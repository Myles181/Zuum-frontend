import React, { useRef } from 'react';
import { FaTimes } from 'react-icons/fa';

const VideoEditor = ({
  isEditing,
  closeEditor,
  isCropMode,
  toggleCropMode,
  isTrimMode,
  toggleTrimMode,
  applyChanges,
  handleDragStart,
  cropRect,
}) => {
  const editorVideoRef = useRef(null);
  const timelineRef = useRef(null);

  return (
    <div className="editor-overlay fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-90 flex justify-center items-center z-50">
      <div className="editor-container bg-gray-200 p-6 rounded-lg shadow-lg w-full max-w-800">
        <div className="editor-header flex justify-between items-center mb-4">
          <div className="editor-title text-center text-gray-800 font-medium">Edit Video</div>
          <button className="editor-close bg-transparent border-none text-white text-2xl cursor-pointer" onClick={closeEditor}>
            <FaTimes />
          </button>
        </div>
        <div className="editor-video-container relative w-full aspect-video bg-gray-900">
          <video id="editor-video" ref={editorVideoRef} className="editor-video w-full h-full object-contain"></video>
          {isCropMode && (
            <div className="crop-overlay absolute top-0 left-0 w-full h-full border-2 border-dashed border-white pointer-events-none" style={cropRect}>
              <div className="crop-handle crop-handle-tl absolute top-0 left-0 w-5 h-5 bg-white rounded-full cursor-move pointer-events-auto"></div>
              <div className="crop-handle crop-handle-tr absolute top-0 right-0 w-5 h-5 bg-white rounded-full cursor-move pointer-events-auto"></div>
              <div className="crop-handle crop-handle-bl absolute bottom-0 left-0 w-5 h-5 bg-white rounded-full cursor-move pointer-events-auto"></div>
              <div className="crop-handle crop-handle-br absolute bottom-0 right-0 w-5 h-5 bg-white rounded-full cursor-move pointer-events-auto"></div>
            </div>
          )}
        </div>
        <div className="timeline-container mt-4">
          <div className="timeline bg-gray-700 rounded-lg h-6 relative">
            <div className="timeline-selected absolute top-0 left-0 h-full bg-green-500 opacity-50"></div>
            <div className="timeline-slider absolute top-0 left-0 h-full flex items-center">
              <div className="timeline-handle timeline-handle-start absolute top-0 left-0 w-2 h-12 bg-white rounded-lg cursor-ew-resize" onClick={(e) => handleDragStart(e, e.target)}></div>
              <div className="timeline-handle timeline-handle-end absolute top-0 right-0 w-2 h-12 bg-white rounded-lg cursor-ew-resize" onClick={(e) => handleDragStart(e, e.target)}></div>
            </div>
          </div>
        </div>
        <div className="editor-controls flex justify-center mt-6">
          <button className="editor-btn bg-green-500 text-white px-6 py-3 rounded-full font-medium hover:bg-green-600 transition-colors duration-200" onClick={toggleCropMode}>
            {isCropMode ? 'Cancel Crop' : 'Crop Video'}
          </button>
          <button className="editor-btn bg-green-500 text-white px-6 py-3 rounded-full font-medium hover:bg-green-600 transition-colors duration-200" onClick={toggleTrimMode}>
            {isTrimMode ? 'Cancel Trim' : 'Trim Length'}
          </button>
          <button className="editor-btn bg-gray-700 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors duration-200" onClick={closeEditor}>
            Cancel
          </button>
          <button className="editor-btn bg-green-800 text-white px-6 py-3 rounded-full font-medium hover:bg-green-800 transition-colors duration-200" onClick={applyChanges}>
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoEditor;