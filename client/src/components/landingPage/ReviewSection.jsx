import React from "react";
import e from '../../assets/image/Group 7.png';

const ReviewSection = () => {
  return (
    <section className="reviews-section py-10 bg-white text-center">
      <h2 className="text-3xl font-bold mb-6">Reviews from the community</h2>
      <div className="review-card mx-auto max-w-md">
        <img src={e} alt="Reviewer Image" className="w-20 h-20 rounded-full mb-2 mx-auto" />
        <div className="stars text-2xl text-yellow-500 mb-2">★★★★★</div>
        <p className="text-lg mb-2">Zuum is the perfect platform for artists to share their music with the world.</p>
        <p className="text-xl font-bold"><strong>- Micheal Jay</strong></p>
      </div>
    </section>
  );
};

export default ReviewSection;
