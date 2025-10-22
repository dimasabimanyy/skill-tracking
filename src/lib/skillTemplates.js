// Pre-defined skill templates for common goals
export const skillTemplates = {
  // Tech Career Goals
  'senior software engineer': [
    {
      title: 'Advanced React Patterns',
      description: 'Master hooks, context, performance optimization, and component design patterns',
      estimated_duration_days: 21,
      order_in_roadmap: 0
    },
    {
      title: 'System Design Fundamentals',
      description: 'Learn scalability, load balancing, databases, caching, and microservices',
      estimated_duration_days: 28,
      order_in_roadmap: 1
    },
    {
      title: 'Data Structures & Algorithms',
      description: 'Practice common interview questions, time/space complexity, and problem-solving',
      estimated_duration_days: 42,
      order_in_roadmap: 2
    },
    {
      title: 'Leadership & Communication',
      description: 'Develop mentoring skills, technical communication, and project leadership',
      estimated_duration_days: 14,
      order_in_roadmap: 3
    }
  ],
  
  'full stack developer': [
    {
      title: 'Frontend Framework Mastery',
      description: 'Deep dive into React/Vue/Angular with state management and routing',
      estimated_duration_days: 30,
      order_in_roadmap: 0
    },
    {
      title: 'Backend API Development',
      description: 'Build RESTful APIs and GraphQL endpoints with Node.js/Python/Java',
      estimated_duration_days: 25,
      order_in_roadmap: 1
    },
    {
      title: 'Database Design & Management',
      description: 'Learn SQL, NoSQL, database optimization, and data modeling',
      estimated_duration_days: 20,
      order_in_roadmap: 2
    },
    {
      title: 'DevOps & Deployment',
      description: 'Master CI/CD, containerization, cloud services, and monitoring',
      estimated_duration_days: 18,
      order_in_roadmap: 3
    }
  ],

  'frontend developer': [
    {
      title: 'Modern JavaScript/TypeScript',
      description: 'ES6+, async/await, modules, and TypeScript fundamentals',
      estimated_duration_days: 14,
      order_in_roadmap: 0
    },
    {
      title: 'React Ecosystem',
      description: 'React, Next.js, state management (Redux/Zustand), and testing',
      estimated_duration_days: 28,
      order_in_roadmap: 1
    },
    {
      title: 'CSS Architecture & Design',
      description: 'Tailwind/Styled Components, responsive design, and animations',
      estimated_duration_days: 14,
      order_in_roadmap: 2
    },
    {
      title: 'Performance & Accessibility',
      description: 'Web vitals, SEO, WCAG guidelines, and optimization techniques',
      estimated_duration_days: 10,
      order_in_roadmap: 3
    }
  ],

  // Generic templates
  'default': [
    {
      title: 'Foundation Knowledge',
      description: 'Build the core understanding needed for your goal',
      estimated_duration_days: 14,
      order_in_roadmap: 0
    },
    {
      title: 'Practical Application',
      description: 'Apply knowledge through hands-on projects and practice',
      estimated_duration_days: 21,
      order_in_roadmap: 1
    },
    {
      title: 'Advanced Concepts',
      description: 'Master complex topics and edge cases',
      estimated_duration_days: 18,
      order_in_roadmap: 2
    },
    {
      title: 'Real-World Implementation',
      description: 'Implement solutions in production-like environments',
      estimated_duration_days: 14,
      order_in_roadmap: 3
    }
  ]
};

export function getSkillTemplatesForGoal(goalTitle) {
  const title = goalTitle.toLowerCase();
  
  // Check for keyword matches
  if (title.includes('senior') && (title.includes('software') || title.includes('engineer'))) {
    return skillTemplates['senior software engineer'];
  }
  
  if (title.includes('full stack') || title.includes('fullstack')) {
    return skillTemplates['full stack developer'];
  }
  
  if (title.includes('frontend') || title.includes('front-end') || title.includes('react')) {
    return skillTemplates['frontend developer'];
  }
  
  // Add more patterns as needed
  
  return skillTemplates['default'];
}

export function generateSkillsForGoal(goalTitle, goalId, userId) {
  const templates = getSkillTemplatesForGoal(goalTitle);
  
  return templates.map((template, index) => ({
    ...template,
    goal_id: goalId,
    user_id: userId,
    status: 'not_started',
    id: `temp-${Date.now()}-${index}`, // Temporary ID for local state
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_reviewed_at: new Date().toISOString()
  }));
}