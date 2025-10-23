'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSkills } from '@/hooks/useSkills';
import { useGoals } from '@/hooks/useGoals';
import { useAuth } from '@/hooks/useAuth';
import { 
  Plus, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen,
  TrendingUp,
  Clock,
  Zap,
  Calendar,
  Award
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import CreateSkillModal from '@/components/CreateSkillModal';
import CreateGoalModal from '@/components/CreateGoalModal';

export default function Dashboard() {
  const { skills, loading } = useSkills();
  const { goals, loading: goalsLoading, createGoal } = useGoals();
  const { user } = useAuth();
  const router = useRouter();
  const [isCreateGoalModalOpen, setIsCreateGoalModalOpen] = useState(false);

  // Calculate statistics
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.is_achieved).length;
  const totalSkills = skills.length;
  const completedSkills = skills.filter(s => s.status === 'done').length;
  const inProgressSkills = skills.filter(s => s.status === 'in_progress').length;

  const handleCreateGoal = async (goalData) => {
    await createGoal(goalData);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-8 space-y-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Hero Section */}
        <motion.div variants={item} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back{user?.user_metadata?.name ? `, ${user.user_metadata.name}` : ''}
              </h1>
              <p className="text-gray-400 text-lg">
                Track your learning journey and achieve your goals
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => setIsCreateGoalModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                New Goal
              </Button>
              <Button 
                onClick={() => router.push('/goals')}
                variant="secondary"
              >
                View All Goals
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Target className="text-blue-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Goals</p>
                <p className="text-2xl font-bold text-white">{totalGoals}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="blue" size="xs">{completedGoals} completed</Badge>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <BookOpen className="text-green-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Skills</p>
                <p className="text-2xl font-bold text-white">{totalSkills}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="green" size="xs">{completedSkills} done</Badge>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <Clock className="text-amber-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-white">{inProgressSkills}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="yellow" size="xs">Active learning</Badge>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <TrendingUp className="text-purple-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Completion Rate</p>
                <p className="text-2xl font-bold text-white">
                  {totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0}%
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="blue" size="xs">Overall progress</Badge>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Active Goals */}
        <motion.div variants={item} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Active Goals</h2>
            <Button 
              onClick={() => router.push('/goals')} 
              variant="ghost"
              className="flex items-center gap-2"
            >
              View All
              <ArrowRight size={16} />
            </Button>
          </div>
          
          {goalsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-[#111111] rounded-2xl p-6 h-48 animate-pulse"></div>
              ))}
            </div>
          ) : goals.length === 0 ? (
            <Card variant="glass" className="text-center py-12">
              <div className="p-4 bg-blue-500/10 rounded-2xl w-fit mx-auto mb-4">
                <Target className="text-blue-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No goals yet</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Start your learning journey by creating your first goal. We'll help you break it down into manageable skills.
              </p>
              <Button onClick={() => setIsCreateGoalModalOpen(true)}>
                <Plus size={16} className="mr-2" />
                Create Your First Goal
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.slice(0, 6).map((goal) => (
                <Card 
                  key={goal.id} 
                  variant="interactive"
                  onClick={() => router.push(`/goals/${goal.id}`)}
                  className="p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {goal.is_achieved ? (
                        <div className="p-2 bg-green-500/10 rounded-lg">
                          <CheckCircle2 className="text-green-400" size={20} />
                        </div>
                      ) : (
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <Target className="text-blue-400" size={20} />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-lg line-clamp-1">{goal.title}</h3>
                      </div>
                    </div>
                    {goal.is_achieved && (
                      <Badge variant="green" size="xs">Completed</Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {goal.description || 'No description'}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-gray-300">
                        {goal.completed_skills || 0}/{goal.skills_count || 0} skills
                      </span>
                    </div>
                    
                    <div className="w-full bg-white/[0.05] rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: goal.skills_count > 0 
                            ? `${((goal.completed_skills || 0) / goal.skills_count) * 100}%` 
                            : '0%' 
                        }}
                      />
                    </div>
                    
                    {goal.target_date && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar size={12} />
                        <span>Target: {new Date(goal.target_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Skills */}
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Skills</h2>
            <Button 
              onClick={() => router.push('/skills')} 
              variant="ghost"
              className="flex items-center gap-2"
            >
              View All
              <ArrowRight size={16} />
            </Button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-[#111111] rounded-2xl p-4 h-24 animate-pulse"></div>
              ))}
            </div>
          ) : skills.length === 0 ? (
            <Card variant="glass" className="text-center py-8">
              <div className="p-3 bg-purple-500/10 rounded-xl w-fit mx-auto mb-3">
                <BookOpen className="text-purple-400" size={24} />
              </div>
              <h3 className="font-medium text-white mb-1">No skills yet</h3>
              <p className="text-gray-400 text-sm">
                Skills will appear here once you create goals with learning roadmaps.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.slice(0, 4).map((skill) => (
                <Card 
                  key={skill.id} 
                  variant="interactive"
                  onClick={() => router.push(`/skills/${skill.id}`)}
                  className="p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-white line-clamp-1">{skill.title}</h3>
                    <Badge 
                      variant={skill.status === 'done' ? 'green' : skill.status === 'in_progress' ? 'yellow' : 'gray'}
                      size="xs"
                    >
                      {skill.status === 'done' ? 'Done' : skill.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-1 mb-3">
                    {skill.description || 'No description'}
                  </p>
                  <div className="w-full bg-white/[0.05] rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        skill.status === 'done' ? 'bg-green-500' 
                        : skill.status === 'in_progress' ? 'bg-yellow-500' 
                        : 'bg-gray-600'
                      }`}
                      style={{ 
                        width: skill.status === 'done' ? '100%' 
                               : skill.status === 'in_progress' ? '50%' 
                               : '0%' 
                      }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Create Goal Modal */}
      <CreateGoalModal
        isOpen={isCreateGoalModalOpen}
        onClose={() => setIsCreateGoalModalOpen(false)}
        onGoalCreated={handleCreateGoal}
      />
    </div>
  );
}