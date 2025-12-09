import React, { useEffect } from 'react';
import { useAnnouncements } from '../admin/hooks/useAnnouncements';
import Navbar from '../components/homepage/Navbar';
import Sidebar from '../components/homepage/Sidebar';
import BottomNav from '../components/homepage/BottomNav';
import { Megaphone, Calendar, Loader2, AlertTriangle, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';

const Announcements = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useDarkMode();
    const {
        announcements,
        isLoading,
        error,
        fetchAnnouncements,
    } = useAnnouncements();

    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Consistent dark mode styles (Premium theme)
    const darkModeStyles = {
        '--color-bg-primary': '#1a1a1a',
        '--color-bg-secondary': '#2d2d2d',
        '--color-text-primary': '#ffffff',
        '--color-text-secondary': '#9ca3af',
        '--color-primary': '#2D8C72',
        '--color-primary-light': '#34A085',
        '--color-text-on-primary': '#ffffff',
        '--color-border': '#374151'
    };

    return (
        <div
            className="min-h-screen flex flex-col font-sans"
            style={{
                ...darkModeStyles,
                backgroundColor: 'var(--color-bg-primary)',
                color: 'var(--color-text-primary)'
            }}
        >
            <div
                className="fixed top-0 w-full z-50 bg-inherit border-b backdrop-blur-md bg-opacity-95"
                style={{
                    borderColor: 'var(--color-border)',
                    backgroundColor: 'var(--color-bg-primary)'
                }}
            >
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100/10 rounded-full">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold">Announcements</h1>
                </div>
            </div>

            <div className="flex-1 pt-20 pb-20 px-4">
                <div className="max-w-2xl mx-auto space-y-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
                            <p className="mt-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>Loading updates...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 rounded-xl border border-red-500/20 bg-red-500/10 p-6">
                            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                            <h3 className="text-lg font-semibold text-red-500 mb-2">Unable to load announcements</h3>
                            <p className="text-sm opacity-80 mb-4">{error}</p>
                            <button
                                onClick={() => fetchAnnouncements()}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : announcements.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(45, 140, 114, 0.1)' }}>
                                <Megaphone className="w-8 h-8 text-[var(--color-primary)]" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No Announcements</h3>
                            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                Stay tuned! We'll post updates and news here.
                            </p>
                        </div>
                    ) : (
                        announcements.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-2xl p-5 border shadow-sm transition-all hover:shadow-md"
                                style={{
                                    backgroundColor: 'var(--color-bg-secondary)',
                                    borderColor: 'var(--color-border)'
                                }}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-1" style={{ backgroundColor: 'rgba(45, 140, 114, 0.1)' }}>
                                        <Megaphone className="w-5 h-5 text-[var(--color-primary)]" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                                            {formatDate(item.createdAt || item.created_at)}
                                        </p>
                                        <div className="prose prose-sm max-w-none dark:prose-invert">
                                            <p className="whitespace-pre-wrap text-base leading-relaxed">
                                                {item.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <BottomNav />
        </div>
    );
};

export default Announcements;
