import React, { useState } from 'react';
import a from "../../assets/icons/Mask group1.svg";
import b from "../../assets/icons/dots-icon.svg";
import c from "../../assets/image/11429433 1.svg";
import d from "../../assets/icons/Vector2.png";
import e from "../../assets/icons/stream-icon.svg";

const Post = () => {
  const [likes, setLikes] = useState(15000);
  const [comments, setComments] = useState(5000);
  const [reposts, setReposts] = useState(1000);

  const updateCount = (type) => {
    switch (type) {
      case 'like':
        setLikes(likes + 1);
        break;
      case 'comment':
        setComments(comments + 1);
        break;
      case 'repost':
        setReposts(reposts + 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className="post bg-white rounded-lg shadow-lg p-4 mb-5">
      <div className="user-info flex items-center gap-3 justify-between mb-3">
        <div>
        <img src={a} alt="Profile" className="profile-pic w-10 h-10 rounded-full" />
        <div>
          <h4 className="font-bold">Olusteve</h4>
          <p className="text-gray-500">Artist</p>
        </div>
        </div>
        
        <img src={b} className="menu-icon w-6 h-6 cursor-pointer" alt="Options" />
      </div>
      <div className="post-media relative mb-3">
        <img src={c} alt="Music Cover" className="w-full rounded-lg" />
        <div className="play-overlay absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img src={d} alt="Play" className="w-10 h-10" />
        </div>
      </div>
      <div className="post-caption mb-3">
        <p className="text-sm">
          🎵 <strong>My African Reggae</strong> by Olusteve
        </p>
        <p className="text-sm">
          Hi everyone. I'm excited to <strong>share my first...</strong>
        </p>
      </div>
      <div className="post-actions flex items-center gap-5 mb-3">
        <span
          className="action flex items-center gap-1 cursor-pointer"
          onClick={() => updateCount('like')}
        >
          ❤️ <span>{likes.toLocaleString()}</span>
        </span>
        <span
          className="action flex items-center gap-1 cursor-pointer"
          onClick={() => updateCount('comment')}
        >
          💬 <span>{comments.toLocaleString()}</span>
        </span>
        <span
          className="action flex items-center gap-1 cursor-pointer"
          onClick={() => updateCount('repost')}
        >
          🔄 <span>{reposts.toLocaleString()}</span>
        </span>
      </div>
      <div className="post-buttons flex flex-col items-end gap-2">
        <a href="../PromotionAddCardSubcription/index.html" className="promote bg-white border border-gray-300 text-green-500 px-4 py-2 rounded-lg flex items-center gap-1">
          Promote
        </a>
        <a href="#" className="stream bg-white text-green-500 px-4 py-2 rounded-lg flex items-center gap-1">
          <img src={e} alt="Stream" className="w-4 h-4" /> Stream Music
        </a>
      </div>
    </div>
  );
};

export default Post;