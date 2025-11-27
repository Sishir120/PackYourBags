import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, Share2, Plane, MapPin, Calendar, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DreamTicket = ({ destination, user, onClose }) => {
    const ticketRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        if (!ticketRef.current) return;
        setIsGenerating(true);
        try {
            const canvas = await html2canvas(ticketRef.current, {
                scale: 2, // Higher quality
                backgroundColor: null,
                useCORS: true, // Important for external images
            });

            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = `PackYourBags-${destination.name}-DreamTicket.png`;
            link.click();
        } catch (error) {
            console.error('Error generating ticket:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const userName = user?.name || user?.email?.split('@')[0] || 'Future Traveler';
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-2xl"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    {/* Ticket Container (This is what gets captured) */}
                    <div
                        ref={ticketRef}
                        className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
                    >
                        {/* Left Side: Destination Image */}
                        <div className="w-full md:w-1/3 relative h-48 md:h-auto">
                            <img
                                src={destination.image}
                                alt={destination.name}
                                className="absolute inset-0 w-full h-full object-cover"
                                crossOrigin="anonymous"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r" />
                            <div className="absolute bottom-4 left-4 text-white">
                                <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Destination</p>
                                <h2 className="text-2xl font-black">{destination.name}</h2>
                            </div>
                        </div>

                        {/* Right Side: Ticket Details */}
                        <div className="flex-1 p-6 md:p-8 bg-white relative">
                            {/* Watermark/Logo */}
                            <div className="absolute top-6 right-8 opacity-10">
                                <Plane className="w-24 h-24 rotate-45" />
                            </div>

                            {/* Header */}
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Boarding Pass</h3>
                                    <div className="flex items-center gap-2 text-purple-600 font-black text-xl">
                                        <Plane className="w-5 h-5" />
                                        PackYourBags Air
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 font-bold uppercase">Class</p>
                                    <p className="text-lg font-bold text-gray-900">DREAM</p>
                                </div>
                            </div>

                            {/* Passenger Info */}
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">Passenger</p>
                                    <p className="text-lg font-bold text-gray-900 truncate">{userName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">Date</p>
                                    <p className="text-lg font-bold text-gray-900">Someday Soon</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">From</p>
                                    <p className="text-lg font-bold text-gray-900">Reality</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">To</p>
                                    <p className="text-lg font-bold text-purple-600">{destination.name}</p>
                                </div>
                            </div>

                            {/* Barcode / Footer */}
                            <div className="border-t-2 border-dashed border-gray-200 pt-6 flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-mono mb-1">TICKET NUMBER: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                                    <p className="text-xs font-bold text-gray-500">Plan this trip at PackYourBags.app</p>
                                </div>
                                {/* Mock Barcode */}
                                <div className="h-8 flex gap-1">
                                    {[...Array(20)].map((_, i) => (
                                        <div key={i} className={`w-1 bg-gray-800 ${Math.random() > 0.5 ? 'h-full' : 'h-2/3'}`} />
                                    ))}
                                </div>
                            </div>

                            {/* Cutout Circles */}
                            <div className="absolute -left-3 top-1/2 w-6 h-6 bg-black rounded-full" />
                            <div className="absolute -right-3 top-1/2 w-6 h-6 bg-black rounded-full" />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex justify-center gap-4">
                        <button
                            onClick={handleDownload}
                            disabled={isGenerating}
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50"
                        >
                            {isGenerating ? (
                                <span className="animate-spin">⌛</span>
                            ) : (
                                <Download className="w-5 h-5" />
                            )}
                            {isGenerating ? 'Printing Ticket...' : 'Download Ticket'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default DreamTicket;
