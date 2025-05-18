import { useState } from 'react';
import { Music, Share2, ChevronRight, CheckCircle } from 'lucide-react';
import Navbar from '../components/profile/NavBar';
import BottomNav from '../components/homepage/BottomNav';
import { useNavigate } from 'react-router-dom';

export const  Jet = () => {
  const [selectedOption, setSelectedOption] = useState(null);
    const navigate = useNavigate();
  
 const handleOptionSelect = (option) => {
    if (option === 'promotion') {
      navigate('/promotion');
    } else {
      navigate('/distribution');
    }
    setSelectedOption(option);
  };
  
  return (
    <div className="min-h-screen bg-white my-13">
       <Navbar name="Creator Hub"  />
      <header className="pt-12 pb-10 px-4 text-center">
        <div className="inline-block mb-4">
          <div className="h-16 w-16 bg-[#1c6350] rounded-full flex items-center justify-center mx-auto">
            <Music size={32} className="text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-3 text-[#1c6350]">
          Music Creator Hub
        </h1>
        <p className="text-lg text-gray-600 max-w-lg mx-auto">
          Take your music to the next level - choose how you want to share your sound with the world
        </p>
      </header>
      
      <main className="container mx-auto px-4 pt-4 pb-16 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Promotion Option */}
          <div 
            className="bg-white rounded-xl p-8 border-2 border-[#1c6350] shadow-lg shadow-[#1c6350]/10 hover:shadow-xl hover:shadow-[#1c6350]/20 transition-all cursor-pointer transform hover:-translate-y-1"
            onClick={() => handleOptionSelect('promotion')}
          >
            <div className="flex justify-between items-start mb-8">
              <div className="p-4 bg-[#1c6350] rounded-xl text-white">
                <Music size={32} />
              </div>
              <ChevronRight className="text-[#1c6350]" size={28} />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-[#1c6350]">In-App Promotion</h2>
            <p className="text-gray-600 mb-6 text-lg">
              Amplify your music within our platform. Get featured in playlists, gain exposure to our community of listeners, and build your audience.
            </p>
            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <CheckCircle size={18} className="text-[#1c6350] mr-3" />
                <span className="text-base">Featured in app playlists</span>
              </div>
              <div className="flex items-center text-gray-700">
                <CheckCircle size={18} className="text-[#1c6350] mr-3" />
                <span className="text-base">Spotlight on discover page</span>
              </div>
              <div className="flex items-center text-gray-700">
                <CheckCircle size={18} className="text-[#1c6350] mr-3" />
                <span className="text-base">Targeted user recommendations</span>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button className="w-full py-3 px-4 bg-[#1c6350] text-white rounded-lg font-medium text-lg flex items-center justify-center">
                <span>Promote Your Music</span>
                <ChevronRight size={20} className="ml-2" />
              </button>
            </div>
          </div>
          
          {/* Distribution Option */}
          <div 
            className="bg-white rounded-xl p-8 border-2 border-[#1c6350] shadow-lg shadow-[#1c6350]/10 hover:shadow-xl hover:shadow-[#1c6350]/20 transition-all cursor-pointer transform hover:-translate-y-1"
            onClick={() => handleOptionSelect('distribution')}
          >
            <div className="flex justify-between items-start mb-8">
              <div className="p-4 bg-[#1c6350] rounded-xl text-white">
                <Share2 size={32} />
              </div>
              <ChevronRight className="text-[#1c6350]" size={28} />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-[#1c6350]">Global Distribution</h2>
            <p className="text-gray-600 mb-6 text-lg">
              Share your music across all major streaming platforms. Reach millions of potential listeners worldwide and maximize your revenue.
            </p>
            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <CheckCircle size={18} className="text-[#1c6350] mr-3" />
                <span className="text-base">Release to 150+ platforms</span>
              </div>
              <div className="flex items-center text-gray-700">
                <CheckCircle size={18} className="text-[#1c6350] mr-3" />
                <span className="text-base">Royalty collection</span>
              </div>
              <div className="flex items-center text-gray-700">
                <CheckCircle size={18} className="text-[#1c6350] mr-3" />
                <span className="text-base">Release scheduling</span>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button className="w-full py-3 px-4 bg-[#1c6350] text-white rounded-lg font-medium text-lg flex items-center justify-center">
                <span>Distribute Your Music</span>
                <ChevronRight size={20} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center text-gray-500">
          <p>Need help deciding? <a href="#" className="text-[#1c6350] font-medium hover:underline">Contact our support team</a></p>
        </div>
      </main>
      <BottomNav activeTab="home" />
    </div>
  );
}