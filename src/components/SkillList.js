'use client';
// import { motion } from 'framer-motion';
import SkillCard from './SkillCard';

export default function SkillList({ skills, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 h-48">
              <div className="flex justify-between items-start mb-3">
                <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                <div className="h-6 bg-gray-700 rounded w-20"></div>
              </div>
              <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3 mb-4"></div>
              <div className="h-2 bg-gray-700 rounded w-full mb-4"></div>
              <div className="flex justify-between">
                <div className="h-3 bg-gray-700 rounded w-24"></div>
                <div className="h-3 bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        {/* Empty state content */}
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No skills yet</h3>
        <p className="text-gray-400 mb-6">Start tracking your learning journey by adding your first skill.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {skills.map((skill) => (
        <SkillCard key={skill.id} skill={skill} />
      ))}
    </div>
  );
}