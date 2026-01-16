// ========================================
// IMPACT LIBRARY
// Database of environmental impact insights
// ========================================

export const impactLibrary = {
  "print-lab-report": {
    action: "Paper Assignment (Printing)",
    insight: "A standard ream of paper (500 sheets) requires approximately 475 liters of water to produce—the equivalent of 6 full bathtubs. By opting for a digital workflow, you aren't just 'saving a tree'; you are preserving the water table used in the pulping and bleaching process.",
    citation: "Water Footprint Network (2023)"
  },
  
  "ordered-food": {
    action: "Food Ordering",
    insight: "Single-use food containers are typically made from polystyrene or polypropylene plastics. These materials persist in landfills for 20-30 years, slowly fragmenting into microplastics that enter soil and waterways. Choosing 'for-here' dining eliminates this entire disposal pathway.",
    citation: "Environmental Science & Technology (2022)"
  },
  
  "morning-caffeine": {
    action: "Morning Caffeine (Disposable Cups)",
    insight: "Most 'paper' coffee cups are reinforced with a hidden polyethylene plastic lining to prevent leaking. This makes them nearly impossible to recycle in standard campus bins. Opting for your own vessel prevents this hybrid material from entering the landfill, where it would take roughly 20 years to fragment.",
    citation: "Journal of Cleaner Production (2021)"
  },
  
  "used-mug": {
    action: "Used Personal Mug",
    insight: "Most 'paper' coffee cups are reinforced with a hidden polyethylene plastic lining to prevent leaking. This makes them nearly impossible to recycle in standard campus bins. Opting for your own vessel prevents this hybrid material from entering the landfill, where it would take roughly 20 years to fragment.",
    citation: "Journal of Cleaner Production (2021)"
  },
  
  "refilled-bottle": {
    action: "Hydration Choice (Refilled Bottle)",
    insight: "The energy required to manufacture, transport, and chill a single plastic water bottle is roughly 2,000 times higher than the energy required to produce tap water. The bottle itself is a byproduct of the oil industry—refilling is an act of decoupling from that supply chain.",
    citation: "Pacific Institute Water Research (2023)"
  },
  
  "digital-cleanup": {
    action: "Digital Cleanup",
    insight: "Data is physical. Every gigabyte stored in the cloud requires constant electricity to keep server fans spinning. Deleting 10 unread promotional emails is equivalent to turning off a 60-watt lightbulb for nearly half an hour.",
    citation: "Nature Climate Change (2022)"
  },
  
  "plant-based-meal": {
    action: "Dietary Pivot (Plant-based Choice)",
    insight: "The calorie-to-water ratio of legumes is significantly lower than animal proteins. A plant-based meal on campus typically requires 1/10th of the land use and a fraction of the nitrogen fertilizer, reducing the risk of runoff in local waterways.",
    citation: "Science Journal (2023)"
  },
  
  "printed": {
    action: "Printed Materials",
    insight: "A standard ream of paper (500 sheets) requires approximately 475 liters of water to produce—the equivalent of 6 full bathtubs. Double-sided printing immediately halves this impact, and digital submission eliminates it entirely.",
    citation: "Water Footprint Network (2023)"
  },
  
  "disposed-waste": {
    action: "Waste Disposal",
    insight: "Proper waste sorting is not just about 'being good'—it's about material recovery. When recyclables are contaminated with food waste or non-recyclables, entire batches must be sent to landfills. Your sorting accuracy directly determines whether materials get a second life.",
    citation: "EPA Municipal Solid Waste Report (2023)"
  }
};

// Function to get impact reveal for action
export function getImpactReveal(actionKey) {
  return impactLibrary[actionKey] || {
    action: "Campus Action",
    insight: "Every decision on campus has an environmental footprint. By being mindful of your choices, you contribute to a collective awareness that transforms behaviors across the entire community.",
    citation: "Radish Environmental Research"
  };
}

// Function to display impact reveal
export function showImpactReveal(actionKey) {
  const impact = getImpactReveal(actionKey);
  const overlay = document.getElementById('impact-overlay');
  const titleEl = document.getElementById('impact-title');
  const bodyEl = document.getElementById('impact-body');
  
  if (overlay && titleEl && bodyEl) {
    titleEl.textContent = impact.action;
    bodyEl.innerHTML = `<p>${impact.insight}</p><p style="margin-top: 1rem; font-size: 0.875rem; opacity: 0.8;">— ${impact.citation}</p>`;
    
    overlay.classList.remove('hidden');
    
    // Auto-hide after 12 seconds
    setTimeout(() => {
      overlay.classList.add('hidden');
    }, 12000);
  }
}

// Close impact reveal
export function closeImpactReveal() {
  const overlay = document.getElementById('impact-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
  }
}
