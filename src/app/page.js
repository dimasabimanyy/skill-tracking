'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSkills } from '@/hooks/useSkills';
import SkillList from '@/components/SkillList';
import SearchBar from '@/components/SearchBar';
import StatusFilter from '@/components/StatusFilter';
import { Plus, Target, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import UserMenu from '@/components/UserMenu';
import AuthStatus from '@/components/AuthStatus';
import { useGoals } from '@/hooks/useGoals';
import Card from '@/components/ui/Card';
import CreateSkillModal from '@/components/CreateSkillModal';
import CreateGoalModal from '@/components/CreateGoalModal';

export default function Dashboard() {
  const { skills, loading, createSkill } = useSkills();
  const { goals, loading: goalsLoading, createGoal } = useGoals();
  const router = useRouter();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateGoalModalOpen, setIsCreateGoalModalOpen] = useState(false);

  const filteredSkills = skills.filter(skill => {
    const matchesFilter = filter === 'all' || skill.status === filter;
    const matchesSearch = skill.title.toLowerCase().includes(search.toLowerCase()) ||
                         (skill.description && skill.description.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleCreateSkill = async (skillData) => {
    await createSkill(skillData);
  };

  const handleCreateGoal = async (goalData) => {
    await createGoal(goalData);
  };

  const getFilteredCount = () => {
    if (filter === 'all') return skills.length;
    return skills.filter(skill => skill.status === filter).length;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Learning Dashboard</h1>
              <p className="text-gray-400">
                Track your goals and skills • {goals.length} goals • {skills.length} skills
              </p>
            </div>
            <div className="flex items-center gap-4">
              <AuthStatus />
              <UserMenu />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-6 border-b border-gray-700 pb-4">
            <span className="text-blue-400 font-medium">Dashboard</span>
            <button
              onClick={() => router.push('/goals')}
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <Target size={16} />
              Goals
            </button>
          </div>
        </header>

        {/* Goals Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Your Goals</h2>
            <Button 
              onClick={() => router.push('/goals')} 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-2"
            >
              View All
              <ArrowRight size={14} />
            </Button>
          </div>
          
          {goalsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-4 h-32 animate-pulse"></div>
              ))}
            </div>
          ) : goals.length === 0 ? (
            <Card className="text-center py-8">
              <Target className="mx-auto h-8 w-8 text-gray-400 mb-3" />
              <h3 className="font-medium text-white mb-1">No goals yet</h3>
              <p className="text-gray-400 text-sm mb-4">Create your first learning goal</p>
              <Button onClick={() => setIsCreateGoalModalOpen(true)} size="sm">
                <Plus size={14} className="mr-2" />
                Create Goal
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {goals.slice(0, 3).map((goal) => (
                <Card 
                  key={goal.id} 
                  className="cursor-pointer hover:border-gray-600 transition-colors"
                  onClick={() => router.push(`/goals/${goal.id}`)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {goal.is_achieved ? (
                      <CheckCircle2 className="text-green-400" size={16} />
                    ) : (
                      <Target className="text-blue-400" size={16} />
                    )}
                    <h3 className="font-medium text-white truncate">{goal.title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{goal.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{goal.completed_skills || 0}/{goal.skills_count || 0} skills</span>
                    {goal.target_date && (
                      <span>{new Date(goal.target_date).toLocaleDateString()}</span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Skills Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Recent Skills</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <SearchBar value={search} onChange={setSearch} />
          <StatusFilter value={filter} onChange={setFilter} />
          <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 shrink-0">
            <Plus size={16} />
            Add Skill
          </Button>
        </div>

        {search || filter !== 'all' ? (
          <div className="mb-4">
            <p className="text-sm text-gray-400">
              Showing {filteredSkills.length} of {skills.length} skills
              {search && ` matching "${search}"`}
              {filter !== 'all' && ` with status "${filter.replace('_', ' ')}"`}
            </p>
          </div>
        ) : null}

        <SkillList skills={filteredSkills} loading={loading} />

        {/* Create Skill Modal */}
        <CreateSkillModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSkillCreated={handleCreateSkill}
        />

        {/* Create Goal Modal */}
        <CreateGoalModal
          isOpen={isCreateGoalModalOpen}
          onClose={() => setIsCreateGoalModalOpen(false)}
          onGoalCreated={handleCreateGoal}
        />
      </div>
    </div>
  );
}