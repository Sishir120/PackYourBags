import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Shield } from 'lucide-react'

const PrivacyPolicy = () => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
            </div>
            <p className="text-gray-600">Last updated: November 2024</p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                At PackYourBags, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered travel discovery platform.
              </p>
              <p className="text-gray-700 leading-relaxed">
                By using PackYourBags, you consent to the data practices described in this policy. If you do not agree with this policy, please discontinue use of our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Personal Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We collect information that you voluntarily provide:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li><strong>Account Information:</strong> Name, email address, password</li>
                <li><strong>Profile Data:</strong> Travel preferences, interests, budget preferences</li>
                <li><strong>Subscription Information:</strong> Payment details (processed securely by third-party providers)</li>
                <li><strong>Communication Data:</strong> Messages, feedback, customer support inquiries</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Automatically Collected Information</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li><strong>Usage Data:</strong> Pages viewed, features used, time spent on platform</li>
                <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
                <li><strong>Location Data:</strong> Approximate location based on IP (if permitted)</li>
                <li><strong>Cookies:</strong> Session data, preferences, analytics</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 AI Interaction Data</h3>
              <p className="text-gray-700 leading-relaxed">
                We collect conversations with our AI assistant to improve service quality and personalization. This includes travel questions, destination queries, and itinerary preferences.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">We use collected information to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Provide Services:</strong> Generate personalized travel recommendations and itineraries</li>
                <li><strong>Improve Platform:</strong> Enhance AI algorithms and user experience</li>
                <li><strong>Communication:</strong> Send newsletters, travel offers, and service updates</li>
                <li><strong>Analytics:</strong> Understand usage patterns and optimize features</li>
                <li><strong>Security:</strong> Prevent fraud, abuse, and unauthorized access</li>
                <li><strong>Legal Compliance:</strong> Comply with applicable laws and regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Third-Party Service Providers</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We share data with trusted partners who help us operate:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li><strong>AI Providers:</strong> OpenAI for content generation (anonymized)</li>
                <li><strong>Payment Processors:</strong> Secure payment gateways for subscriptions</li>
                <li><strong>Analytics Services:</strong> Usage tracking and performance monitoring</li>
                <li><strong>Cloud Hosting:</strong> Data storage and platform infrastructure</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Legal Requirements</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may disclose your information if required by law or to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Comply with legal obligations or court orders</li>
                <li>Protect our rights, property, or safety</li>
                <li>Prevent fraud or security threats</li>
                <li>Enforce our Terms of Service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Encryption of data in transit (SSL/TLS)</li>
                <li>Secure password hashing (bcrypt)</li>
                <li>Regular security audits and updates</li>
                <li>Limited employee access to personal data</li>
                <li>Secure cloud infrastructure</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Privacy Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Portability:</strong> Export your data in a readable format</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Object:</strong> Object to certain data processing activities</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                To exercise these rights, contact us at <strong>privacy@packyourbags.com</strong>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Remember your preferences and settings</li>
                <li>Analyze site traffic and user behavior</li>
                <li>Personalize content and recommendations</li>
                <li>Provide social media features</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                You can control cookies through your browser settings. Note that disabling cookies may limit platform functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                PackYourBags is not intended for children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
              <p className="text-gray-700 leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for cross-border data transfers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed">
                We retain your personal data only as long as necessary to provide services and comply with legal obligations. Account data is deleted within 30 days of account closure, unless retention is required by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy periodically. We will notify you of significant changes via email or platform notification. Continued use after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                For privacy-related questions or concerns:
              </p>
              <div className="p-6 bg-gray-50 rounded-xl">
                <p className="text-gray-700"><strong>Email:</strong> privacy@packyourbags.com</p>
                <p className="text-gray-700"><strong>Data Protection Officer:</strong> dpo@packyourbags.com</p>
                <p className="text-gray-700"><strong>Address:</strong> PackYourBags Inc., Global Travel Hub</p>
              </div>
            </section>
          </div>

          {/* Footer Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-6">
              <Link to="/terms" className="text-purple-600 hover:text-purple-700 font-medium">
                Terms of Service
              </Link>
              <Link to="/about" className="text-purple-600 hover:text-purple-700 font-medium">
                About Us
              </Link>
              <Link to="/#subscribe" className="text-purple-600 hover:text-purple-700 font-medium">
                Subscribe
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PrivacyPolicy