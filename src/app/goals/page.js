'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGoals } from '@/hooks/useGoals';
import { Plus, Target, Calendar, Clock, CheckCircle2, Circle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import UserMenu from '@/components/UserMenu';
import AuthStatus from '@/components/AuthStatus';
import CreateGoalModal from '@/components/CreateGoalModal';
import { formatDate } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export default function GoalsPage() {
  const router = useRouter();
  const { goals, loading, createGoal } = useGoals();
  const [filter, setFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredGoals = goals.filter(goal => {
    if (filter === 'all') return true;
    if (filter === 'active') return !goal.is_achieved;
    if (filter === 'completed') return goal.is_achieved;
    return true;
  });

  const handleCreateGoal = async (goalData) => {
    await createGoal(goalData);
  };

  const getProgressPercentage = (goal) => {
    if (goal.skills_count === 0) return 0;
    return Math.round((goal.completed_skills / goal.skills_count) * 100);
  };

  const isOverdue = (goal) => {
    return goal.target_date && new Date(goal.target_date) < new Date() && !goal.is_achieved;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-6 h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Learning Goals</h1>
              <p className="text-gray-400">
                Define your objectives and create roadmaps to achieve them
              </p>
            </div>
            <div className="flex items-center gap-4">
              <AuthStatus />
              <UserMenu />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-6 border-b border-gray-700 pb-4">
            <button
              onClick={() => router.push('/')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Dashboard
            </button>
            <span className="text-blue-400 font-medium">Goals</span>
          </div>
        </header>

        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All Goals' },
              { value: 'active', label: 'Active' },
              { value: 'completed', label: 'Completed' }
            ].map((option) => (
              <Button
                key={option.value}
                variant={filter === option.value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
          
          <div className="flex-1"></div>
          
          <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
            <Plus size={16} />
            New Goal
          </Button>
        </div>

        {/* Goals Grid */}
        {filteredGoals.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Target className="mx-auto h-12 w-12 mb-4" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No goals yet</h3>
            <p className="text-gray-400 mb-6">
              Start by creating your first learning goal and build a roadmap to achieve it.
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 mx-auto">
              <Plus size={16} />
              Create Your First Goal
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGoals.map((goal) => (
              <div
                key={goal.id}
                className="group cursor-pointer"
                onClick={() => router.push(`/goals/${goal.id}`)}
              >
                <Card className="h-full hover:border-gray-600 transition-colors">
                  {/* Goal Status Icon */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {goal.is_achieved ? (
                        <CheckCircle2 className="text-green-400 flex-shrink-0" size={20} />
                      ) : (
                        <Circle className="text-gray-400 flex-shrink-0" size={20} />
                      )}
                      <h3 className="font-semibold text-lg text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                        {goal.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  {goal.description && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {goal.description}
                    </p>
                  )}

                  {/* Progress */}
                  {goal.skills_count > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">Progress</span>
                        <span className="text-xs text-gray-400">
                          {goal.completed_skills}/{goal.skills_count} skills
                        </span>
                      </div>
                      <ProgressBar 
                        value={getProgressPercentage(goal)} 
                        className="h-2"
                      />
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="space-y-2 text-xs text-gray-500">
                    {goal.target_date && (
                      <div className={`flex items-center gap-2 ${isOverdue(goal) ? 'text-red-400' : ''}`}>
                        <Calendar size={12} />
                        <span>Target: {formatDate(goal.target_date)}</span>
                        {isOverdue(goal) && (
                          <span className="text-red-400 font-medium">Overdue</span>
                        )}
                      </div>
                    )}
                    
                    {goal.estimated_duration_weeks && (
                      <div className="flex items-center gap-2">
                        <Clock size={12} />
                        <span>{goal.estimated_duration_weeks} weeks estimated</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Target size={12} />
                      <span>Created {formatDistanceToNow(new Date(goal.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {goals.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-white mb-1">
                {goals.length}
              </div>
              <div className="text-sm text-gray-400">Total Goals</div>
            </Card>
            
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {goals.filter(g => g.is_achieved).length}
              </div>
              <div className="text-sm text-gray-400">Completed</div>
            </Card>
            
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {goals.filter(g => !g.is_achieved).length}
              </div>
              <div className="text-sm text-gray-400">In Progress</div>
            </Card>
          </div>
        )}

        {/* Create Goal Modal */}
        <CreateGoalModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onGoalCreated={handleCreateGoal}
        />
      </div>
    </div>
  );
}