import React from 'react';
import { Link } from 'react-router-dom';
import { Construction, ArrowLeft } from 'lucide-react';

const ComingSoon = ({ title = "Coming Soon" }) => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Construction className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
            <p className="text-xl text-gray-600 max-w-md mb-8">
                We're working hard to bring you this feature. Stay tuned for updates!
            </p>
            <Link
                to="/"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
            </Link>
        </div>
    );
};

export default ComingSoon;
