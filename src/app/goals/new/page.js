'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGoals } from '@/hooks/useGoals';
import { ArrowLeft, Target, Calendar, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';

export default function NewGoalPage() {
  const router = useRouter();
  const { createGoal } = useGoals();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_date: '',
    estimated_duration_weeks: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    try {
      const newGoal = await createGoal({
        ...formData,
        estimated_duration_weeks: formData.estimated_duration_weeks 
          ? parseInt(formData.estimated_duration_weeks) 
          : null
      });
      
      if (newGoal) {
        router.push(`/goals/${newGoal.id}`);
      }
    } catch (error) {
      console.error('Error creating goal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            onClick={() => router.back()} 
            variant="ghost" 
            size="sm"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create New Goal</h1>
            <p className="text-gray-400">Define what you want to achieve</p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Goal Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Target size={16} className="inline mr-2" />
                Goal Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g., Senior Software Engineer Role"
                required
                className="w-full"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe what achieving this goal means to you..."
                rows={4}
                className="w-full"
              />
            </div>

            {/* Target Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Calendar size={16} className="inline mr-2" />
                Target Date
              </label>
              <Input
                type="date"
                value={formData.target_date}
                onChange={(e) => handleChange('target_date', e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                When do you want to achieve this goal?
              </p>
            </div>

            {/* Estimated Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Clock size={16} className="inline mr-2" />
                Estimated Duration (weeks)
              </label>
              <Input
                type="number"
                value={formData.estimated_duration_weeks}
                onChange={(e) => handleChange('estimated_duration_weeks', e.target.value)}
                placeholder="e.g., 16"
                min="1"
                max="104"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                How many weeks do you think it will take to achieve this goal?
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!formData.title.trim() || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Creating...' : 'Create Goal'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Tips */}
        <Card className="mt-6 bg-gray-800/50">
          <h3 className="font-medium text-white mb-3">💡 Tips for Great Goals</h3>
          <ul className="text-sm text-gray-400 space-y-2">
            <li>• Be specific about what you want to achieve</li>
            <li>• Set a realistic timeline that motivates you</li>
            <li>• Think about why this goal matters to you</li>
            <li>• Break it down into learnable skills later</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}