import { motion } from "framer-motion";

const StreamingPlatforms = ({ data }) => {
  return (
    <div className="rounded-2xl shadow-lg p-6 mb-8 border border-white/10 backdrop-blur-sm bg-white/80">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Streaming Platforms</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {data.spotify && (
          <motion.a 
            whileHover={{ y: -2 }}
            href={data.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-50 hover:bg-gray-100 border border-gray-200/70 rounded-xl p-3 flex items-center justify-center transition-all"
          >
            <span className="text-sm font-medium">Spotify</span>
          </motion.a>
        )}
        {data.apple_music && (
          <motion.a 
            whileHover={{ y: -2 }}
            href={data.apple_music}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-50 hover:bg-gray-100 border border-gray-200/70 rounded-xl p-3 flex items-center justify-center transition-all"
          >
            <span className="text-sm font-medium">Apple Music</span>
          </motion.a>
        )}
        {data.youtube_music && (
          <motion.a 
            whileHover={{ y: -2 }}
            href={data.youtube_music}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-50 hover:bg-gray-100 border border-gray-200/70 rounded-xl p-3 flex items-center justify-center transition-all"
          >
            <span className="text-sm font-medium">YouTube Music</span>
          </motion.a>
        )}
      </div>
    </div>
  );
};

export default StreamingPlatforms;