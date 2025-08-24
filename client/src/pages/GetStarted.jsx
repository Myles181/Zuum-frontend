import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const GetStarted = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profilesVisible, setProfilesVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Staggered profile animations for smooth cascading effect
    const timer = setTimeout(() => {
      setProfilesVisible(true);
    }, 400);
    
    return () => clearTimeout(timer);
  }, []);

  const profileOptions = [
    {
      id: "artist",
      title: "Artist",
      description: "Create and share your music with the world",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=400&q=80&crop=face",
      color: "from-purple-500 to-purple-600",
      direction: "left"
    },
    {
      id: "producer",
      title: "Producer",
      description: "Create beats and collaborate with artists",
      image: "https://i0.wp.com/soundprise.com/wp-content/uploads/2020/11/123-min-scaled.jpg?resize=1080%2C675&ssl=1",
      color: "from-blue-500 to-blue-600",
      direction: "right"
    },
    {
      id: "record_label",
      title: "Record Label",
      description: "Manage artists and distribute music",
      image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=400&q=80&crop=face",
      color: "from-red-500 to-red-600",
      direction: "left"
    },
    {
      id: "fans",
      title: "Fan",
      description: "Discover and support your favorite artists",
      image: "https://bandzoogle.com/files/4739/bzblog-17-ways-to-get-more-music-fans-main.jpg",
      color: "from-green-500 to-green-600",
      direction: "right"
    }
  ];

  return (
    <>
      <style jsx>{`
        .profile-card {
          transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
          transform-origin: center;
        }
        
        .profile-card-from-left {
          transform: translateX(-120px) rotate(-8deg) scale(0.8);
          opacity: 0;
        }
        
        .profile-card-from-right {
          transform: translateX(120px) rotate(8deg) scale(0.8);
          opacity: 0;
        }
        
        .profile-card-visible {
          transform: translateX(0) rotate(0deg) scale(1);
          opacity: 1;
        }
        
        .profile-card:hover {
          transform: translateY(-2px) scale(1.02);
        }
        
        .profile-card.selected {
          transform: translateY(-4px) scale(1.05);
        }
        
        .image-bounce {
          transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .image-bounce:hover {
          transform: scale(1.1) rotate(5deg);
        }
        
        .checkmark-appear {
          animation: checkmarkPop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        @keyframes checkmarkPop {
          0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          70% {
            transform: scale(1.2) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        
        .button-disabled {
          background: linear-gradient(135deg, #e5e7eb, #d1d5db);
        }
        
        .button-enabled {
          background: linear-gradient(135deg, #2D8C72, #34A085);
        }
        
        .button-enabled:hover {
          background: linear-gradient(135deg, #248066, #2D8C72);
          transform: translateY(-1px) scale(1.02);
          box-shadow: 0 8px 25px rgba(45, 140, 114, 0.3);
        }
      `}</style>
      
      <div className="min-h-screen bg-gray-100 flex items-center justify-center ">
        <div className="w-full max-w-sm bg-white shadow-xl overflow-hidden flex flex-col ">
          
          {/* Image Section */}
          <div className="relative h-64 overflow-hidden">
            <div 
              className={`w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
              style={{ 
                backgroundImage: `url(https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=600&fit=crop&auto=format)`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white/80"></div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 px-6 py-6 flex flex-col">
            <div className="flex-grow flex flex-col">
              
              {/* Welcome Text */}
              <div className={`text-center mb-6 transition-all duration-600 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                  Choose Your Profile
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Select your role to begin your musical journey
                </p>
              </div>

              {/* Profile Selection Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {profileOptions.map((option, index) => (
                  <div
                    key={option.id}
                    className={`
                      profile-card relative p-4 bg-white rounded-2xl border-2 cursor-pointer flex flex-col items-center
                      ${selectedProfile === option.id 
                        ? 'border-[#2D8C72] shadow-lg selected' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }
                      ${profilesVisible 
                        ? 'profile-card-visible' 
                        : option.direction === 'left' 
                          ? 'profile-card-from-left' 
                          : 'profile-card-from-right'
                      }
                    `}
                    style={{ 
                      transitionDelay: `${index * 150}ms`
                    }}
                    onClick={() => {
                      setSelectedProfile(option.id);
                    }}
                  >
                    {/* Circular Profile Image */}
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md mb-3 image-bounce">
                      <img 
                        src={option.image} 
                        alt={option.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 text-sm text-center">{option.title}</h3>
                    <p className="text-xs text-gray-600 text-center mt-1 hidden md:block">{option.description}</p>
                    
                    {selectedProfile === option.id && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#2D8C72] rounded-full flex items-center justify-center checkmark-appear shadow-md">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons Section */}
            <div className={`space-y-3 transition-all duration-700 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`} style={{ transitionDelay: '600ms' }}>
              
              <Link
                to={selectedProfile ? `/signup?identity=${selectedProfile}` : "#"}
                className={`w-full py-3 rounded-2xl font-semibold text-base transition-all duration-300 flex items-center justify-center ${
                  selectedProfile 
                    ? 'bg-[#2D8C72] hover:bg-[#248066] text-white transform hover:scale-[1.02] shadow-md hover:shadow-lg' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Already have an account?{" "}
                  <Link 
                    to="/login" 
                    className="text-[#2D8C72] hover:text-[#248066] font-medium transition-colors duration-300 hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GetStarted;