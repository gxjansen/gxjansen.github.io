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
  // Leadership & Team Building
  {
    id: "manuel-costa",
    name: "Manuel Da Costa",
    role: "Founder & CEO",
    company: "Efestra",
    workRelationship: "Former technology partner",
    quote: "Guido is one of the most knowledgeable CROs I know. His understanding of building scalable experimentation teams as well as dealing with stakeholders is exemplary.",
    category: "Leadership & Team Building",
    priority: 5
  },
  {
    id: "riccardo-sozzi",
    name: "Riccardo Sozzi",
    role: "Head of Digital Data",
    company: "Randstad",
    workRelationship: "Former colleague",
    quote: "He has organizational and resource management skills with lots of enthusiasm.",
    category: "Leadership & Team Building",
    priority: 3
  },
  {
    id: "henrik-feld-jakobsen",
    name: "Henrik Feld-Jakobsen",
    role: "Chief Strategy Officer",
    company: "Vaimo",
    workRelationship: "Former manager",
    quote: "Guido knows his area of expertise and wants to create long-term and meaningful optimization teams and culture in organizations.",
    category: "Leadership & Team Building",
    priority: 4
  },
  {
    id: "nadine-peeters",
    name: "Nadine Peeters",
    role: "CRO Specialist",
    company: "Decathlon",
    workRelationship: "Direct report",
    quote: "While working in his team I was impressed by his skills to enable a culture of freedom, responsibility and learning from each other.",
    category: "Leadership & Team Building",
    priority: 4
  },
  {
    id: "sophie-smallwood-1",
    name: "Sophie Smallwood",
    role: "Director, Customer Success",
    company: "Spryker",
    workRelationship: "Fellow member of the leadership team",
    quote: "What stands out most is his ability to balance strong opinions with genuine psychological safety.",
    category: "Leadership & Team Building",
    priority: 5
  },
  {
    id: "james-hooper-1",
    name: "James Hooper",
    role: "Senior Knowledge Manager",
    company: "Spryker",
    workRelationship: "Direct report",
    quote: "Guido has the ability to inspire and motivate, creating an environment where everyone feels heard and empowered to contribute. He is very easy to approach and happy to give you his time when needed to help support you.",
    category: "Leadership & Team Building",
    priority: 4
  },

  // Community & Collaboration
  {
    id: "lauren-kulwicki",
    name: "Lauren Kulwicki",
    role: "Senior Community Manager",
    company: "Independent",
    workRelationship: "Direct report",
    quote: "From the very first moment, he welcomed me with his enthusiasm and passion for e-commerce, community, and the Spryker product.",
    category: "Community & Collaboration",
    priority: 4
  },
  {
    id: "sophie-smallwood-2",
    name: "Sophie Smallwood",
    role: "Director, Customer Success",
    company: "Spryker",
    workRelationship: "Fellow member of the leadership team",
    quote: "He brings a rare mix of energy, positivity, and technical acumen. He rolls up his sleeves to get things done, while also experimenting with new ideas.",
    category: "Community & Collaboration",
    priority: 4
  },
  {
    id: "andreas-lummerzheim-1",
    name: "Andreas Lummerzheim",
    role: "Head of Learning Experience",
    company: "Spryker",
    workRelationship: "Colleague in the same division, but different team",
    quote: "Guido consistently brought energy and openness, making it easy to connect on both professional topics and personal interests like AI and podcasting. He also excelled at connecting people across business and technology, turning community exchanges into actionable collaboration. Guido showed real leadership without ever being my manager, creating alignment and momentum simply by bringing people together.",
    category: "Community & Collaboration",
    priority: 4
  },
  {
    id: "michael-tuerk-1",
    name: "Michael Türk",
    role: "VP Strategic Projects",
    company: "Spryker",
    workRelationship: "Colleague from a different division",
    quote: "At Spryker, Guido became one of the key figures driving our community's success. [...] his events not only highlighted Spryker's architectural strengths but also created an atmosphere of energy, fun, and inspiration.",
    category: "Community & Collaboration",
    priority: 4
  },

  // Business Impact & Innovation
  {
    id: "manuel-costa-2",
    name: "Manuel Da Costa",
    role: "Founder & CEO",
    company: "Efestra",
    workRelationship: "Former technology partner",
    quote: "He has had a pivotal role in helping shape our CRO success platform Effective Experiments through detailed actionable feedback.",
    category: "Business Impact & Innovation",
    priority: 4
  },
  {
    id: "nadine-peeters-2",
    name: "Nadine Peeters",
    role: "CRO Specialist",
    company: "Decathlon",
    workRelationship: "Direct report",
    quote: "From the start I got a lot of responsibilities and freedom, which made it a valuable time learning about growth hacking, UX and conversion optimization.",
    category: "Business Impact & Innovation",
    priority: 3
  },
  {
    id: "svitlana-1",
    name: "Svitlana Kulynych",
    role: "Head of Learning Experience",
    company: "Spryker",
    workRelationship: "Fellow member of the leadership team",
    quote: "I saw first-hand how the initiatives of his team not only strengthened customer and partner engagement but also directly shaped product direction and organizational growth. Guido has a rare ability to translate community insights into tangible business intelligence and vice versa bring business closer to the community.",
    category: "Business Impact & Innovation",
    priority: 4
  },
  {
    id: "chris-rauch-1",
    name: "Chris Rauch",
    role: "Chief Customer Officer",
    company: "Spryker",
    workRelationship: "Second level manager",
    quote: "His strategic thinking impressed me. Guido understood that communities need sustainable business value, not just engagement metrics. The hackathon projects directly influenced what we built next, including some AI features.",
    category: "Business Impact & Innovation",
    priority: 4
  },
  {
    id: "chris-rauch-2",
    name: "Chris Rauch",
    role: "Chief Customer Officer",
    company: "Spryker",
    workRelationship: "Second level manager",
    quote: "He delivered results that mattered: developer feedback shaped our product roadmap, engineering teams connected directly with external developers, and our community became stronger after each challenge.",
    category: "Business Impact & Innovation",
    priority: 4
  },

  // Expertise & Communication
  {
    id: "erin-weigel-1",
    name: "Erin Weigel",
    role: "Principal Designer",
    company: "Freelancer",
    workRelationship: "Conference attendee",
    quote: "Conversion rate optimization, psychology, leadership, and business are just a few of the topics he's spoken to at the highest level.",
    category: "Expertise & Communication",
    priority: 4
  },
  {
    id: "erin-weigel-2",
    name: "Erin Weigel",
    role: "Principal Designer",
    company: "Freelancer",
    workRelationship: "Conference attendee",
    quote: "Guido is an excellent public speaker who gives his audience practical tips on how to create a company culture that embraces evidence-based decision making.",
    category: "Expertise & Communication",
    priority: 4
  },
  {
    id: "michael-tuerk-2",
    name: "Michael Türk",
    role: "VP Strategic Projects",
    company: "Spryker",
    workRelationship: "Colleague from a different division",
    quote: "He is a brilliant presenter, a natural connector, and a trusted advisor who understands both the human and business dimensions of digital commerce. His empathy, humor, and communication skills make him uniquely effective at engaging with people on every level, from developers to executives.",
    category: "Expertise & Communication",
    priority: 4
  },

  // Cross-functional Impact & Technical Versatility
  {
    id: "mark-1",
    name: "Mark",
    role: "Senior Director of Academy",
    company: "Spryker",
    workRelationship: "Leadership peer",
    quote: "He understands every aspect of business and how he can help support other areas of the business through community, experimentation, just plain figuring stuff out. His psychology background has also helped him understand people and he always works with empathy and superb Emotional Intelligence.",
    category: "Leadership & Team Building",
    priority: 5
  },
  {
    id: "christian-1",
    name: "Christian",
    role: "Senior Director, Partner Success",
    company: "Spryker",
    workRelationship: "Leadership peer",
    quote: "I'm amazed at how quickly he adopts new technologies. For example, he rapidly mastered cutting-edge topics like Agentic Development, Vibe Coding, and workflow automation. Bringing this to Spryker resulted in higher efficiency and quicker improvements, lowering our TCO.",
    category: "Business Impact & Innovation",
    priority: 5
  },
  {
    id: "mark-2",
    name: "Mark",
    role: "Senior Director of Academy",
    company: "Spryker",
    workRelationship: "Leadership peer",
    quote: "He can lead from the front, and he can let others lead. He will always give credit to his colleagues and team.",
    category: "Leadership & Team Building",
    priority: 4
  }
];

/**
 * Get a strategic selection of testimonials (deprecated - deterministic)
 * @deprecated Use getRandomTestimonials for dynamic client-side selection
 */
export function getSelectedTestimonials(count: number = 4): ColleagueTestimonial[] {
  // Simplified version without preferredId bias - just get highest priority from each category
  const selected: ColleagueTestimonial[] = [];
  const usedPeople = new Set<string>();

  const categories = Array.from(new Set(colleagueTestimonials.map(t => t.category)));

  // Select highest priority testimonial from each category
  for (const category of categories) {
    if (selected.length >= count) break;

    const categoryTestimonials = colleagueTestimonials
      .filter(t => t.category === category && !usedPeople.has(t.name))
      .sort((a, b) => b.priority - a.priority);

    if (categoryTestimonials.length > 0) {
      selected.push(categoryTestimonials[0]);
      usedPeople.add(categoryTestimonials[0].name);
    }
  }

  // Fill remaining slots
  while (selected.length < count) {
    const remainingTestimonials = colleagueTestimonials
      .filter(t => !usedPeople.has(t.name))
      .sort((a, b) => b.priority - a.priority);

    if (remainingTestimonials.length > 0) {
      selected.push(remainingTestimonials[0]);
      usedPeople.add(remainingTestimonials[0].name);
    } else {
      break;
    }
  }

  return selected.slice(0, count);
}

/**
 * Fisher-Yates shuffle algorithm for array randomization
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get a random selection of testimonials with balanced variety
 * Ensures diversity across categories and people (no duplicates)
 * Uses weighted random selection based on priority scores
 * No preferredId bias - all testimonials have equal opportunity within their priority tier
 */
export function getRandomTestimonials(count: number = 4): ColleagueTestimonial[] {
  const selected: ColleagueTestimonial[] = [];
  const usedPeople = new Set<string>();

  // Get all unique categories and shuffle them for randomness
  const categories = Array.from(new Set(colleagueTestimonials.map(t => t.category)));
  const shuffledCategories = shuffleArray(categories);

  // First pass: Try to get one testimonial from different categories
  for (const category of shuffledCategories) {
    if (selected.length >= count) break;

    // Get testimonials from this category, excluding used people
    const categoryTestimonials = colleagueTestimonials.filter(t =>
      t.category === category && !usedPeople.has(t.name)
    );

    if (categoryTestimonials.length === 0) continue;

    // Weighted random selection based on priority
    // Create weighted pool: priority 5 appears 5 times, priority 4 appears 4 times, etc.
    const weightedPool: ColleagueTestimonial[] = [];
    categoryTestimonials.forEach(testimonial => {
      for (let i = 0; i < testimonial.priority; i++) {
        weightedPool.push(testimonial);
      }
    });

    // Select random testimonial from weighted pool
    const randomIndex = Math.floor(Math.random() * weightedPool.length);
    const selectedTestimonial = weightedPool[randomIndex];

    selected.push(selectedTestimonial);
    usedPeople.add(selectedTestimonial.name);
  }

  // Second pass: Fill remaining slots with any high-priority testimonials
  while (selected.length < count) {
    const remainingTestimonials = colleagueTestimonials.filter(t =>
      !usedPeople.has(t.name)
    );

    if (remainingTestimonials.length === 0) break;

    // Create weighted pool from remaining testimonials
    const weightedPool: ColleagueTestimonial[] = [];
    remainingTestimonials.forEach(testimonial => {
      for (let i = 0; i < testimonial.priority; i++) {
        weightedPool.push(testimonial);
      }
    });

    // Select random testimonial from weighted pool
    const randomIndex = Math.floor(Math.random() * weightedPool.length);
    const selectedTestimonial = weightedPool[randomIndex];

    selected.push(selectedTestimonial);
    usedPeople.add(selectedTestimonial.name);
  }

  // Final shuffle to randomize the order
  return shuffleArray(selected);
}
