'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useGoals } from '@/hooks/useGoals';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { 
  Plus, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen,
  Sparkles,
  Calendar,
  ChevronRight
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import CreateGoalModal from '@/components/CreateGoalModal';

export default function Dashboard() {
  const { goals, loading: goalsLoading, createGoal } = useGoals();
  const { user } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const [isCreateGoalModalOpen, setIsCreateGoalModalOpen] = useState(false);

  const handleCreateGoal = async (goalData) => {
    await createGoal(goalData);
  };

  // Get active goals (not completed)
  const activeGoals = goals.filter(g => !g.is_achieved);
  const completedGoals = goals.filter(g => g.is_achieved);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.02
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 8 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  if (goalsLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="animate-pulse space-y-4">
            <div className={`h-8 rounded-lg w-64 mx-auto ${
              theme === 'light' ? 'bg-neutral-200' : 'bg-neutral-800'
            }`}></div>
            <div className={`h-4 rounded w-48 mx-auto ${
              theme === 'light' ? 'bg-neutral-200' : 'bg-neutral-800'
            }`}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12"
    >
      {/* Welcome Section */}
      <motion.div variants={item} className="text-center space-y-4">
        <h1 className={`text-3xl font-semibold transition-colors ${
          theme === 'light' ? 'text-neutral-900' : 'text-white'
        }`}>
          Your Learning Journey
        </h1>
        <p className={`text-lg max-w-2xl mx-auto transition-colors ${
          theme === 'light' ? 'text-neutral-600' : 'text-neutral-400'
        }`}>
          Focus on what matters. Set meaningful goals, build skills that count, and track your progress along the way.
        </p>
      </motion.div>

      {/* Quick Actions */}
      {activeGoals.length === 0 && (
        <motion.div variants={item}>
          <Card className="text-center py-16 px-8">
            <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center ${
              theme === 'light' ? 'bg-indigo-50' : 'bg-indigo-900/30'
            }`}>
              <Sparkles className="text-indigo-500" size={24} />
            </div>
            <h2 className={`text-xl font-semibold mb-3 transition-colors ${
              theme === 'light' ? 'text-neutral-900' : 'text-white'
            }`}>
              Ready to start learning?
            </h2>
            <p className={`mb-8 max-w-md mx-auto transition-colors ${
              theme === 'light' ? 'text-neutral-600' : 'text-neutral-400'
            }`}>
              Create your first learning goal and begin building the skills that will take you where you want to go.
            </p>
            <Button 
              onClick={() => setIsCreateGoalModalOpen(true)}
              className="flex items-center gap-2 mx-auto"
            >
              <Plus size={16} />
              Create Your First Goal
            </Button>
          </Card>
        </motion.div>
      )}

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <motion.div variants={item} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-semibold transition-colors ${
              theme === 'light' ? 'text-neutral-900' : 'text-white'
            }`}>
              Active Goals
            </h2>
            <Button 
              onClick={() => setIsCreateGoalModalOpen(true)}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus size={14} />
              New Goal
            </Button>
          </div>
          
          <div className="grid gap-4">
            {activeGoals.slice(0, 3).map((goal) => (
              <motion.div
                key={goal.id}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Card 
                  variant="interactive"
                  className="p-6 cursor-pointer"
                  onClick={() => router.push(`/goals/${goal.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-3 h-3 rounded-full ${
                          theme === 'light' ? 'bg-indigo-500' : 'bg-indigo-400'
                        }`}></div>
                        <h3 className={`font-semibold transition-colors ${
                          theme === 'light' ? 'text-neutral-900' : 'text-white'
                        }`}>
                          {goal.title}
                        </h3>
                      </div>
                      {goal.description && (
                        <p className={`mb-4 transition-colors ${
                          theme === 'light' ? 'text-neutral-600' : 'text-neutral-400'
                        }`}>
                          {goal.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm">
                        {goal.target_date && (
                          <div className={`flex items-center gap-1 ${
                            theme === 'light' ? 'text-neutral-500' : 'text-neutral-500'
                          }`}>
                            <Calendar size={14} />
                            <span>Target: {new Date(goal.target_date).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <ChevronRight className={`transition-colors ${
                      theme === 'light' ? 'text-neutral-400' : 'text-neutral-600'
                    }`} size={20} />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {activeGoals.length > 3 && (
            <div className="text-center">
              <Button 
                onClick={() => router.push('/goals')} 
                variant="ghost"
                className="flex items-center gap-2 mx-auto"
              >
                View All Goals <ArrowRight size={14} />
              </Button>
            </div>
          )}
        </motion.div>
      )}

      {/* Completed Goals Section */}
      {completedGoals.length > 0 && (
        <motion.div variants={item} className="space-y-6">
          <h2 className={`text-xl font-semibold transition-colors ${
            theme === 'light' ? 'text-neutral-900' : 'text-white'
          }`}>
            Completed Goals
          </h2>
          
          <div className="grid gap-3">
            {completedGoals.slice(0, 2).map((goal) => (
              <motion.div
                key={goal.id}
                whileHover={{ y: -1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Card 
                  variant="interactive"
                  className="p-4 cursor-pointer opacity-75 hover:opacity-100"
                  onClick={() => router.push(`/goals/${goal.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-emerald-500" size={20} />
                    <div className="flex-1">
                      <h4 className={`font-medium transition-colors ${
                        theme === 'light' ? 'text-neutral-900' : 'text-white'
                      }`}>
                        {goal.title}
                      </h4>
                    </div>
                    <Badge variant="green" size="xs">Completed</Badge>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Create Goal Modal */}
      <CreateGoalModal
        isOpen={isCreateGoalModalOpen}
        onClose={() => setIsCreateGoalModalOpen(false)}
        onGoalCreated={handleCreateGoal}
      />
    </motion.div>
  );
}