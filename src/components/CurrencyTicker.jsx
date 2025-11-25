import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Globe, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

const CURRENCIES = [
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
    { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
    { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
];

// Sparkline Component
const Sparkline = ({ data, color, width = 120, height = 40 }) => {
    if (!data || data.length < 2) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1; // Avoid division by zero

    // Create path points
    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        // Invert Y because SVG coordinates go down
        // Add some padding (5px) to avoid cutting off peaks
        const y = height - 5 - ((value - min) / range) * (height - 10);
        return `${x},${y}`;
    });

    const pathD = `M ${points.join(' L ')}`;

    // Create fill area (close the path at the bottom)
    const fillD = `${pathD} L ${width},${height} L 0,${height} Z`;

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
            <defs>
                <linearGradient id={`gradient-${color}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={fillD} fill={`url(#gradient-${color})`} stroke="none" />
            <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

const CurrencyTicker = () => {
    const [rates, setRates] = useState({});
    const [history, setHistory] = useState({});
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [error, setError] = useState(null);

    const fetchRates = async () => {
        setLoading(true);
        setError(null);
        try {
            const endDate = new Date().toISOString().split('T')[0];
            const startDateObj = new Date();
            startDateObj.setDate(startDateObj.getDate() - 7); // Last 7 days
            const startDate = startDateObj.toISOString().split('T')[0];

            const currenciesParam = CURRENCIES.map(c => c.code).join(',');

            // Fetch historical data for sparklines
            const historyResponse = await fetch(`https://api.frankfurter.app/${startDate}..${endDate}?from=USD&to=${currenciesParam}`);
            const historyData = await historyResponse.json();

            if (historyData && historyData.rates) {
                // Process history data
                // historyData.rates is { "2024-01-01": { "EUR": 0.9, ... }, ... }
                // We need { "EUR": [0.9, 0.91, ...], ... }
                const processedHistory = {};
                const latestRates = {};

                // Initialize arrays
                CURRENCIES.forEach(c => processedHistory[c.code] = []);

                // Sort dates to ensure chronological order
                const sortedDates = Object.keys(historyData.rates).sort();

                sortedDates.forEach(date => {
                    const dayRates = historyData.rates[date];
                    CURRENCIES.forEach(c => {
                        if (dayRates[c.code]) {
                            processedHistory[c.code].push(dayRates[c.code]);
                            // Update latest rate
                            latestRates[c.code] = dayRates[c.code];
                        }
                    });
                });

                setHistory(processedHistory);
                setRates(latestRates);
                setLastUpdated(new Date());
            } else {
                throw new Error('Invalid data format');
            }
        } catch (err) {
            console.error('Error fetching rates:', err);
            setError('Failed to load exchange rates');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRates();
        const interval = setInterval(fetchRates, 5 * 60 * 1000); // Refresh every 5 mins
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-lg shadow-blue-500/20">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Market Watch</h2>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                            Base Currency: <span className="font-semibold text-gray-700">USD ($)</span>
                            {lastUpdated && (
                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">
                                    {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            )}
                        </p>
                    </div>
                </div>
                <button
                    onClick={fetchRates}
                    disabled={loading}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-300"
                    title="Refresh Rates"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {error ? (
                <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-100">
                    <p className="text-red-600 font-medium">{error}</p>
                    <button onClick={fetchRates} className="mt-2 text-sm text-red-500 underline hover:text-red-700">Try Again</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {CURRENCIES.map((currency) => {
                        const currencyHistory = history[currency.code] || [];
                        const currentRate = rates[currency.code];

                        // Calculate change
                        let change = 0;
                        let isPositive = false;

                        if (currencyHistory.length >= 2) {
                            const prevRate = currencyHistory[currencyHistory.length - 2];
                            change = ((currentRate - prevRate) / prevRate) * 100;
                            isPositive = change >= 0;
                        }

                        // Determine color based on trend
                        // For currency, usually Green = Stronger against USD (Rate goes DOWN if USD gets weaker? No, Rate is Foreign per 1 USD)
                        // If Rate goes UP (e.g. 0.9 -> 0.95), 1 USD buys MORE Foreign. So USD got stronger, Foreign got weaker.
                        // Usually "Green" implies the ASSET (Foreign Currency) is doing well.
                        // If Rate goes DOWN (0.95 -> 0.9), 1 USD buys LESS. Foreign got stronger.
                        // Let's stick to simple math: Rate UP = Green, Rate DOWN = Red.
                        // Actually, standard forex: Green = Price Up.
                        const trendColor = isPositive ? '#10b981' : '#ef4444'; // Emerald-500 : Red-500
                        const trendIcon = isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />;

                        return (
                            <div
                                key={currency.code}
                                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group relative overflow-hidden"
                            >
                                {/* Background Gradient Effect */}
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${isPositive ? 'from-emerald-500/5' : 'from-red-500/5'} to-transparent rounded-bl-full -mr-10 -mt-10 transition-opacity opacity-50 group-hover:opacity-100`} />

                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl shadow-sm rounded-full bg-gray-50 p-1" role="img" aria-label={currency.name}>{currency.flag}</span>
                                        <div>
                                            <div className="font-bold text-gray-900">{currency.code}</div>
                                            <div className="text-xs text-gray-500 font-medium">{currency.name}</div>
                                        </div>
                                    </div>
                                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                        {trendIcon}
                                        {Math.abs(change).toFixed(2)}%
                                    </div>
                                </div>

                                <div className="flex items-end justify-between relative z-10">
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900 tracking-tight">
                                            {loading ? (
                                                <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
                                            ) : (
                                                currentRate?.toFixed(4)
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">1 USD = {currentRate?.toFixed(2)} {currency.code}</div>
                                    </div>

                                    {/* Sparkline */}
                                    <div className="mb-1">
                                        {!loading && currencyHistory.length > 0 && (
                                            <Sparkline
                                                data={currencyHistory}
                                                color={trendColor}
                                                width={80}
                                                height={40}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CurrencyTicker;
