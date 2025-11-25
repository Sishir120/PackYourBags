import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Award, TrendingUp } from 'lucide-react';

const ProfessionalLiftChecklist = () => {
  const [completedItems, setCompletedItems] = useState([]);

  const checklistItems = [
    {
      id: 'visual_hierarchy',
      title: 'Visual Hierarchy & Spacing',
      items: [
        'Introduced 0–1–2–4–8 spacing scale (rem)',
        'Elevated hero section with subtle #F7F9FC background',
        'Used only two shadows: "flat" and "elevated"'
      ]
    },
    {
      id: 'typography',
      title: 'Typography',
      items: [
        'Imported Inter font',
        'Locked to 3 weights: Regular 400, Medium 500, SemiBold 600',
        'Body 16px / 1.6 line-height; H1 48px / 1.2'
      ]
    },
    {
      id: 'color_system',
      title: 'Color System',
      items: [
        'Darkened foreground to #111322 (rich slate)',
        'Produced 10-step teal palette',
        'Added traffic-light tokens: Green, Amber, Red with 4.5:1 a11y ratio'
      ]
    },
    {
      id: 'component_polish',
      title: 'Component Polish',
      items: [
        'Border-radius: 12px for softer, more expensive feel',
        '1px #E5E7EB border + 8px inset padding for cards',
        'Subtle gradient overlay on images for readable text'
      ]
    },
    {
      id: 'buttons',
      title: 'Buttons',
      items: [
        'Primary: 40px high, 24px horizontal padding',
        '200ms ease-out transition',
        '4px focus ring (teal-300)'
      ]
    },
    {
      id: 'inputs',
      title: 'Inputs',
      items: [
        '44px min height',
        '14px inner shadow inset for "sunken" look',
        'Teal right-border on focus'
      ]
    },
    {
      id: 'photography',
      title: 'Photography & Illustration',
      items: [
        'Generated every card with prompt template',
        'Saved as WebP 800px wide, < 90kB',
        'Used loading="lazy" + decoding="async" + blur-up placeholder',
        'Added SVG scrim mask for branded look'
      ]
    },
    {
      id: 'micro_interactions',
      title: 'Micro-interactions',
      items: [
        'Roulette wheel: 1.2-sec cubic-bezier spin',
        'Button hover: scale(1.02) + shadow step-up',
        'Testimonial carousel: cross-fade 400ms'
      ]
    },
    {
      id: 'trust_compliance',
      title: 'Trust & Compliance',
      items: [
        'Added "AS SEEN IN" row (TechCrunch, The Guardian)',
        'SSL badge + "GDPR-safe" line beside email form',
        'Footer: physical address, VAT ID, Terms, Privacy, Refund'
      ]
    },
    {
      id: 'accessibility',
      title: 'Accessibility Quick-wins',
      items: [
        'All interactive elements ≥ 44 × 44 px',
        'Color contrast ≥ 4.5:1',
        'aria-label on icon-only buttons'
      ]
    },
    {
      id: 'performance',
      title: 'Performance Budget',
      items: [
        'First Contentful Paint < 1.8s on 4G',
        'Largest Contentful Paint < 2.5s',
        'Total JS < 150kB gzipped'
      ]
    },
    {
      id: 'brand_voice',
      title: 'Brand Voice Consistency',
      items: [
        'Swapped every "Al" typo to "AI"',
        'Killed Latin filler ("lorem ipsum")',
        'Replaced with on-brand helper text'
      ]
    }
  ];

  // Load completed items from localStorage on component mount
  useEffect(() => {
    const savedCompleted = localStorage.getItem('professionalLiftChecklist');
    if (savedCompleted) {
      setCompletedItems(JSON.parse(savedCompleted));
    }
  }, []);

  // Save completed items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('professionalLiftChecklist', JSON.stringify(completedItems));
  }, [completedItems]);

  const toggleItem = (categoryId, itemIndex) => {
    const itemKey = `${categoryId}-${itemIndex}`;
    if (completedItems.includes(itemKey)) {
      setCompletedItems(completedItems.filter(item => item !== itemKey));
    } else {
      setCompletedItems([...completedItems, itemKey]);
    }
  };

  const isItemCompleted = (categoryId, itemIndex) => {
    return completedItems.includes(`${categoryId}-${itemIndex}`);
  };

  const getCompletionPercentage = () => {
    const totalItems = checklistItems.reduce((total, category) => total + category.items.length, 0);
    return Math.round((completedItems.length / totalItems) * 100);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-elevated p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-foreground">Professional Lift Checklist</h2>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            <span className="text-2xl font-bold text-foreground">{getCompletionPercentage()}% Complete</span>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
          <div 
            className="bg-teal-500 h-4 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${getCompletionPercentage()}%` }}
          ></div>
        </div>
        
        <p className="text-gray-600 mb-8">
          Track your progress as you implement the professional UI/UX enhancements for PackYourBags.
        </p>
        
        <div className="space-y-8">
          {checklistItems.map((category) => (
            <div key={category.id} className="border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-500" />
                {category.title}
              </h3>
              
              <ul className="space-y-3">
                {category.items.map((item, index) => (
                  <li key={index}>
                    <button
                      onClick={() => toggleItem(category.id, index)}
                      className={`flex items-start gap-3 w-full text-left p-3 rounded-lg transition-colors ${
                        isItemCompleted(category.id, index)
                          ? 'bg-teal-50 hover:bg-teal-100'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {isItemCompleted(category.id, index) ? (
                        <CheckCircle className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      )}
                      <span className={`${
                        isItemCompleted(category.id, index)
                          ? 'text-teal-700 line-through'
                          : 'text-foreground'
                      }`}>
                        {item}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-gray-500 text-sm">
          Once all items are completed, PackYourBags will look (and feel) like the kind of site people 
          happily hand their passport details to.
        </p>
      </div>
    </div>
  );
};

export default ProfessionalLiftChecklist;