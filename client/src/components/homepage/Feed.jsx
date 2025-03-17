import React from 'react';
import Post from './Post';

const Feed = () => {
  return (
    <section className="feed p-4 mb-10">
      <Post />
      <Post />
    </section>
  );
};

export default Feed;