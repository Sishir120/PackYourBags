import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calculator, DollarSign, Share2 } from 'lucide-react';
import SEO from '../../components/SEO';
import Newsletter from '../../components/Newsletter';

const GroupTripCostSplitter = () => {
    return (
        <div className="bg-white">
            <SEO />

            {/* Hero */}
            <section className="bg-primary-600 text-white py-20 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Group Trip Cost Splitter</h1>
                    <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                        The easiest way to track expenses and split costs for your group trip. No more math headaches—just fair and transparent sharing.
                    </p>
                    <button className="btn bg-white text-primary-600 hover:bg-primary-50 btn-lg font-bold">
                        Start Splitting Costs
                    </button>
                </div>
            </section>

            {/* Tool Placeholder (Interactive part would go here) */}
            <section className="py-16 px-4 -mt-10">
                <div className="container mx-auto max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-neutral-200 text-center">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calculator className="w-8 h-8 text-primary-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Interactive Tool Coming Soon</h2>
                        <p className="text-neutral-600 mb-6">
                            We are building a powerful calculator that lets you add friends, log expenses, and see exactly who owes what. Stay tuned!
                        </p>
                        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-100 inline-block text-left">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">A</div>
                                <div>
                                    <p className="font-bold text-sm">Alice paid $100 for Dinner</p>
                                    <p className="text-xs text-neutral-500">Split equally among 4</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-600">B</div>
                                <div>
                                    <p className="font-bold text-sm">Bob owes Alice $25</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-3xl font-bold text-center mb-12">How to Split Travel Costs Fairly</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-6 h-6 text-primary-600" />
                            </div>
                            <h3 className="font-bold text-xl mb-2">1. Add Your Group</h3>
                            <p className="text-neutral-600">Enter the names of everyone on the trip.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <DollarSign className="w-6 h-6 text-primary-600" />
                            </div>
                            <h3 className="font-bold text-xl mb-2">2. Log Expenses</h3>
                            <p className="text-neutral-600">Record who paid for what (hotels, meals, transport).</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Share2 className="w-6 h-6 text-primary-600" />
                            </div>
                            <h3 className="font-bold text-xl mb-2">3. Settle Up</h3>
                            <p className="text-neutral-600">See the simplest way for everyone to get paid back.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 bg-neutral-50 px-4">
                <div className="container mx-auto max-w-3xl">
                    <h2 className="text-3xl font-bold text-center mb-12">Common Questions</h2>
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="font-bold text-lg mb-2">How do I handle different currencies?</h3>
                            <p className="text-neutral-600">Our tool allows you to log expenses in any currency, and we'll convert everything to your group's base currency using real-time rates.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="font-bold text-lg mb-2">Can I split expenses unevenly?</h3>
                            <p className="text-neutral-600">Yes! You can split by percentage, shares, or exact amounts if someone ordered more expensive food or had a larger room.</p>
                        </div>
                    </div>
                </div>
            </section>

            <Newsletter />
        </div>
    );
};

export default GroupTripCostSplitter;
