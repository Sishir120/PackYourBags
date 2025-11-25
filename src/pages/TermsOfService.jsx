import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, FileText } from 'lucide-react'
import SEO from '../components/SEO'

const TermsOfService = () => {
  return (
    <>
      <SEO 
        title="Terms of Service | PackYourBags"
        description="Read our terms of service and conditions for using PackYourBags travel discovery platform."
      />
      
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
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
            </div>
            <p className="text-gray-600">Last updated: November 2024</p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                By accessing and using PackYourBags ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                PackYourBags is an AI-powered travel discovery platform that helps users explore destinations, plan trips, and access travel recommendations. We reserve the right to update these terms at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use of Service</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Eligibility</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You must be at least 13 years old to use this Service. By using PackYourBags, you represent and warrant that you meet this age requirement.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Account Registration</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                To access certain features, you may need to create an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. AI-Generated Content</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                PackYourBags uses artificial intelligence to generate travel recommendations, itineraries, and blog content. While we strive for accuracy:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>AI-generated content is provided for informational purposes only</li>
                <li>We do not guarantee the accuracy or completeness of AI recommendations</li>
                <li>Users should verify all travel information independently</li>
                <li>Travel decisions are your sole responsibility</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Subscription Services</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                PackYourBags offers premium subscription plans with enhanced features:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Subscriptions are billed on a recurring basis</li>
                <li>You may cancel your subscription at any time</li>
                <li>Refunds are provided according to our refund policy</li>
                <li>Prices are subject to change with 30 days notice</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. User Content</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You retain ownership of content you submit (reviews, photos, itineraries). By submitting content, you grant PackYourBags:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>A worldwide, non-exclusive license to use your content</li>
                <li>The right to display, modify, and distribute your content on our platform</li>
                <li>The ability to use your content for marketing purposes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Prohibited Activities</h2>
              <p className="text-gray-700 leading-relaxed mb-4">You agree not to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Use the Service for any illegal purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Submit false or misleading information</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Scrape or collect data without permission</li>
                <li>Distribute viruses or malicious code</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Third-Party Links</h2>
              <p className="text-gray-700 leading-relaxed">
                Our Service may contain links to third-party websites (hotels, airlines, tour operators). We are not responsible for the content, privacy practices, or terms of these external sites. Use them at your own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimer of Warranties</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Uninterrupted or error-free service</li>
                <li>Accuracy of travel information</li>
                <li>Availability of destinations or services</li>
                <li>Results from using our recommendations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                PackYourBags shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service, including but not limited to travel disruptions, financial losses, or personal injury.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to terminate or suspend your account immediately, without prior notice, for conduct that violates these Terms or is harmful to other users, us, or third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms shall be governed by and construed in accordance with applicable international laws, without regard to conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                For questions about these Terms, please contact us at:
              </p>
              <div className="mt-4 p-6 bg-gray-50 rounded-xl">
                <p className="text-gray-700"><strong>Email:</strong> legal@packyourbags.com</p>
                <p className="text-gray-700"><strong>Address:</strong> PackYourBags Inc., Global Travel Hub</p>
              </div>
            </section>
          </div>

          {/* Footer Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-6">
              <Link to="/privacy" className="text-pink-600 hover:text-pink-700 font-medium">
                Privacy Policy
              </Link>
              <Link to="/about" className="text-pink-600 hover:text-pink-700 font-medium">
                About Us
              </Link>
              <Link to="/#subscribe" className="text-pink-600 hover:text-pink-700 font-medium">
                Subscribe
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TermsOfService
