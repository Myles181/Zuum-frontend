import React, { useState, useEffect } from 'react';
import { X, Megaphone, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAnnouncements } from '../admin/hooks/useAnnouncements';

const AnnouncementPopup = ({ trigger }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [latestAnnouncement, setLatestAnnouncement] = useState(null);
    const navigate = useNavigate();
    const { fetchAnnouncements } = useAnnouncements();

    useEffect(() => {
        const checkAnnouncements = async () => {
            try {
                // Fetch only the latest one
                const data = await fetchAnnouncements({ limit: 1 });
                if (data && data.length > 0) {
                    const latest = data[0];
                    const lastSeenId = localStorage.getItem('lastSeenAnnouncementId');
                    console.log('Announcement check:', { latest: latest.id, lastSeen: lastSeenId, trigger });

                    // Show popup if the user hasn't seen this announcement yet OR if triggered manually
                    if (trigger || !lastSeenId || String(lastSeenId) !== String(latest.id)) {
                        setLatestAnnouncement(latest);
                        // Slight delay for better UX
                        setTimeout(() => setIsOpen(true), trigger ? 0 : 2000);
                    }
                }
            } catch (error) {
                console.error('Failed to check for announcements', error);
            }
        };

        checkAnnouncements();
    }, [fetchAnnouncements, trigger]);

    const handleClose = () => {
        setIsOpen(false);
        if (latestAnnouncement) {
            localStorage.setItem('lastSeenAnnouncementId', String(latestAnnouncement.id));
        }
    };

    const handleViewAll = () => {
        handleClose();
        navigate('/announcements');
    };

    if (!isOpen || !latestAnnouncement) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden scale-in-95 animate-in duration-200">

                {/* Header */}
                <div className="bg-[#2D8C72] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                        <Megaphone className="w-5 h-5 fill-white/20" />
                        <h3 className="font-bold">New Announcement</h3>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                            {latestAnnouncement.content}
                        </p>
                    </div>

                    <button
                        onClick={handleViewAll}
                        className="w-full py-3 px-4 bg-[#2D8C72] hover:bg-[#34a085] active:bg-[#257a63] text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors group"
                    >
                        <span>View All Announcements</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementPopup;
