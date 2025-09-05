/**
 * Colleague testimonials data
 * Organized by thematic categories for strategic rotation
 */

export interface ColleagueTestimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  workRelationship: string;
  quote: string;
  category: string;
  priority: number; // 1-5, higher is more likely to be selected
}

export const colleagueTestimonials: ColleagueTestimonial[] = [
  // Strategic Leadership & Stakeholder Management
  {
    id: "manuel-costa",
    name: "Manuel Da Costa",
    role: "Founder & CEO",
    company: "Efestra",
    workRelationship: "Former technology partner at Euroflorist",
    quote: "Guido is one of the most knowledgeable CROs I know. His understanding of building scalable experimentation teams as well as dealing with stakeholders is exemplary.",
    category: "Strategic Leadership",
    priority: 5
  },
  {
    id: "riccardo-sozzi",
    name: "Riccardo Sozzi",
    role: "Head of Digital Data",
    company: "n8n AI Automation",
    workRelationship: "Former colleague at Randstad",
    quote: "He has organizational and resource management skills with lots of enthusiasm.",
    category: "Strategic Leadership",
    priority: 3
  },
  
  // Long-term Value Creation & Culture Building
  {
    id: "henrik-feld-jakobsen",
    name: "Henrik Feld-Jakobsen",
    role: "Chief Strategy Officer",
    company: "Vaimo",
    workRelationship: "Former manager at Vaimo",
    quote: "Guido knows his area of expertise and wants to create long-term and meaningful optimization teams and culture in organizations.",
    category: "Culture Building",
    priority: 4
  },
  {
    id: "nadine-peeters",
    name: "Nadine Peeters",
    role: "CRO Specialist",
    company: "Decathlon",
    workRelationship: "Direct report at Euroflorist",
    quote: "While working in his team I was impressed by his skills to enable a culture of freedom, responsibility and learning from each other.",
    category: "Culture Building",
    priority: 4
  },

  // Psychology Expertise & Human-Centered Approach
  {
    id: "sophie-smallwood-1",
    name: "Sophie Smallwood",
    role: "Director, Customer Success",
    company: "Spryker",
    workRelationship: "Fellow member of the leadership team at Spryker",
    quote: "What stands out most is his ability to balance strong opinions with genuine psychological safety.",
    category: "Psychology Expertise",
    priority: 5
  },
  {
    id: "erin-weigel-1",
    name: "Erin Weigel",
    role: "Principal Designer",
    company: "Freelancer",
    workRelationship: "Conference attendee",
    quote: "Conversion rate optimization, psychology, leadership, and business are just a few of the topics he's spoken to at the highest level.",
    category: "Psychology Expertise",
    priority: 3
  },

  // Community Building & Ecosystem Development
  {
    id: "lauren-kulwicki",
    name: "Lauren Kulwicki",
    role: "Senior Community Manager",
    company: "Independent",
    workRelationship: "Direct report at Spryker",
    quote: "From the very first moment, he welcomed me with his enthusiasm and passion for e-commerce, community, and the Spryker product.",
    category: "Community Building",
    priority: 4
  },
  {
    id: "sophie-smallwood-2",
    name: "Sophie Smallwood",
    role: "Director, Customer Success",
    company: "Spryker",
    workRelationship: "Fellow member of the leadership team at Spryker",
    quote: "He brings a rare mix of energy, positivity, and technical acumen. He rolls up his sleeves to get things done, while also experimenting with new ideas.",
    category: "Community Building",
    priority: 4
  },

  // Results-Driven Impact & Innovation
  {
    id: "manuel-costa-2",
    name: "Manuel Da Costa",
    role: "Founder & CEO",
    company: "Efestra",
    workRelationship: "Former technology partner at Euroflorist",
    quote: "He has had a pivotal role in helping shape our CRO success platform Effective Experiments through detailed actionable feedback.",
    category: "Results & Innovation",
    priority: 4
  },
  {
    id: "nadine-peeters-2",
    name: "Nadine Peeters",
    role: "CRO Specialist",
    company: "Decathlon",
    workRelationship: "Direct report at Euroflorist",
    quote: "From the start I got a lot of responsibilities and freedom, which made it a valuable time learning about growth hacking, UX and conversion optimization.",
    category: "Results & Innovation",
    priority: 3
  },

  // Speaking & Thought Leadership
  {
    id: "erin-weigel-2",
    name: "Erin Weigel",
    role: "Principal Designer",
    company: "Freelancer",
    workRelationship: "Conference attendee",
    quote: "Guido is an excellent public speaker who gives his audience practical tips on how to create a company culture that embraces evidence-based decision making.",
    category: "Speaking & Leadership",
    priority: 3
  }
];

/**
 * Get a strategic selection of testimonials
 * Ensures variety across categories and people (no duplicates)
 */
export function getSelectedTestimonials(count: number = 4): ColleagueTestimonial[] {
  // Define required categories (one from each for variety)
  const requiredCategories = [
    "Strategic Leadership",
    "Results & Innovation", 
    "Psychology Expertise",
    "Culture Building"
  ];
  
  const selected: ColleagueTestimonial[] = [];
  const usedPeople = new Set<string>();
  
  // First pass: select one high-priority testimonial from each required category
  // ensuring no duplicate people
  requiredCategories.forEach(category => {
    const categoryTestimonials = colleagueTestimonials
      .filter(t => t.category === category && t.priority >= 4 && !usedPeople.has(t.name))
      .sort((a, b) => b.priority - a.priority);
    
    if (categoryTestimonials.length > 0) {
      // Use Math.random with build-time seed for consistency within a build
      const randomIndex = Math.floor(Math.random() * Math.min(2, categoryTestimonials.length));
      const selectedTestimonial = categoryTestimonials[randomIndex];
      selected.push(selectedTestimonial);
      usedPeople.add(selectedTestimonial.name);
    }
  });
  
  // Second pass: fill remaining slots with highest priority testimonials
  // ensuring no duplicate people
  while (selected.length < count) {
    const remainingTestimonials = colleagueTestimonials
      .filter(t => !selected.find(s => s.id === t.id) && !usedPeople.has(t.name))
      .sort((a, b) => b.priority - a.priority);
    
    if (remainingTestimonials.length > 0) {
      const selectedTestimonial = remainingTestimonials[0];
      selected.push(selectedTestimonial);
      usedPeople.add(selectedTestimonial.name);
    } else {
      break;
    }
  }
  
  return selected.slice(0, count);
}