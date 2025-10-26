'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
import { Calendar, Clock, Edit3, Save, X } from 'lucide-react';
import { useSkills } from '@/hooks/useSkills';
import { useTopics } from '@/hooks/useTopics';
import { useTheme } from '@/hooks/useTheme';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import ProgressBar from '@/components/ui/ProgressBar';
import TopicsList from '@/components/TopicsList';
import { getStatusColor, getStatusLabel, formatDate } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export default function SkillDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { skills, updateSkill, loading } = useSkills();
  const { theme } = useTheme();
  const [skill, setSkill] = useState(null);
  const { topics, loading: topicsLoading, createTopic, updateTopic, deleteTopic } = useTopics(params.id);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (skills.length > 0) {
      const foundSkill = skills.find(s => s.id === params.id);
      if (foundSkill) {
        setSkill(foundSkill);
        setEditForm({
          title: foundSkill.title,
          description: foundSkill.description || '',
          status: foundSkill.status,
          target_date: foundSkill.target_date || '',
          notes: foundSkill.notes || ''
        });
      }
    }
  }, [skills, params.id]);

  const handleSave = async () => {
    if (!skill) return;
    
    setIsSaving(true);
    try {
      await updateSkill(skill.id, editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving skill:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      title: skill.title,
      description: skill.description || '',
      status: skill.status,
      target_date: skill.target_date || '',
      notes: skill.notes || ''
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className={`h-8 rounded w-32 mb-6 ${
            theme === 'light' ? 'bg-neutral-200' : 'bg-neutral-700'
          }`}></div>
          <div className={`rounded-xl p-6 ${
            theme === 'light' ? 'bg-neutral-200' : 'bg-neutral-800'
          }`}>
            <div className={`h-8 rounded w-3/4 mb-4 ${
              theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-700'
            }`}></div>
            <div className={`h-4 rounded w-full mb-2 ${
              theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-700'
            }`}></div>
            <div className={`h-4 rounded w-2/3 mb-6 ${
              theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-700'
            }`}></div>
            <div className={`h-32 rounded ${
              theme === 'light' ? 'bg-neutral-300' : 'bg-neutral-700'
            }`}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="space-y-8">
        <Card className="text-center py-12">
          <h2 className={`text-xl font-semibold mb-2 ${
            theme === 'light' ? 'text-neutral-900' : 'text-white'
          }`}>
            Skill not found
          </h2>
          <p className={`mb-6 ${
            theme === 'light' ? 'text-neutral-600' : 'text-neutral-400'
          }`}>
            The skill you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push('/')}>
            Return to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  // const progress = getProgressValue(skill.status);
  const statusColor = getStatusColor(skill.status);
  const statusLabel = getStatusLabel(skill.status);
  const isOverdue = skill.target_date && new Date(skill.target_date) < new Date();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${
            skill.status === 'done' 
              ? 'bg-emerald-500' 
              : skill.status === 'in_progress' 
              ? 'bg-blue-500' 
              : 'bg-neutral-400'
          }`}></div>
          <Badge variant={statusColor} size="sm">{statusLabel}</Badge>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button 
                onClick={handleCancel} 
                variant="ghost"
                size="sm"
                disabled={isSaving}
              >
                <X size={16} className="mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                size="sm"
                disabled={isSaving}
              >
                <Save size={16} className="mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="ghost" size="sm">
              <Edit3 size={16} className="mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <Card>
        {/* Title */}
        <div className="mb-6">
          {isEditing ? (
            <Input
              value={editForm.title}
              onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
              className="text-2xl font-semibold"
              placeholder="Skill title"
            />
          ) : (
            <h1 className={`text-2xl font-semibold ${
              theme === 'light' ? 'text-neutral-900' : 'text-white'
            }`}>
              {skill.title}
            </h1>
          )}
        </div>

        {/* Status selector when editing */}
        {isEditing && (
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'light' ? 'text-neutral-700' : 'text-neutral-300'
            }`}>
              Status
            </label>
            <select
              value={editForm.status}
              onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
              className={`w-full rounded-lg border px-3 py-2 text-sm ${
                theme === 'light'
                  ? 'bg-white border-neutral-300 text-neutral-900'
                  : 'bg-neutral-800 border-neutral-600 text-white'
              }`}
            >
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Completed</option>
            </select>
          </div>
        )}

        {/* Description */}
        <div className="mb-6">
          <h3 className={`text-lg font-semibold mb-3 ${
            theme === 'light' ? 'text-neutral-900' : 'text-white'
          }`}>
            Description
          </h3>
          {isEditing ? (
            <Textarea
              value={editForm.description}
              onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add a description for this skill..."
              rows={3}
            />
          ) : (
            <p className={`${
              theme === 'light' ? 'text-neutral-600' : 'text-neutral-400'
            }`}>
              {skill.description || 'No description yet. Click Edit to add one.'}
            </p>
          )}
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
          {skill.target_date && (
            <div>
              <div className={`mb-1 ${
                theme === 'light' ? 'text-neutral-500' : 'text-neutral-500'
              }`}>
                Target Date
              </div>
              {isEditing ? (
                <Input
                  type="date"
                  value={editForm.target_date}
                  onChange={(e) => setEditForm(prev => ({ ...prev, target_date: e.target.value }))}
                  className="text-sm"
                />
              ) : (
                <div className={`flex items-center gap-2 ${
                  isOverdue 
                    ? 'text-red-500' 
                    : theme === 'light' 
                    ? 'text-neutral-700' 
                    : 'text-neutral-300'
                }`}>
                  <Calendar size={14} />
                  {formatDate(skill.target_date)}
                </div>
              )}
            </div>
          )}
          <div>
            <div className={`mb-1 ${
              theme === 'light' ? 'text-neutral-500' : 'text-neutral-500'
            }`}>
              Last Updated
            </div>
            <div className={`flex items-center gap-2 ${
              theme === 'light' ? 'text-neutral-700' : 'text-neutral-300'
            }`}>
              <Clock size={14} />
              {formatDistanceToNow(new Date(skill.last_reviewed_at), { addSuffix: true })}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-8">
          <h3 className={`text-lg font-semibold mb-3 ${
            theme === 'light' ? 'text-neutral-900' : 'text-white'
          }`}>
            Notes
          </h3>
          {isEditing ? (
            <Textarea
              value={editForm.notes}
              onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add your learning notes, insights, or progress updates..."
              rows={8}
            />
          ) : (
            <div className={`rounded-lg p-4 min-h-[200px] ${
              theme === 'light' ? 'bg-neutral-50' : 'bg-neutral-800/30'
            }`}>
              {skill.notes ? (
                <pre className={`whitespace-pre-wrap font-sans ${
                  theme === 'light' ? 'text-neutral-700' : 'text-neutral-300'
                }`}>
                  {skill.notes}
                </pre>
              ) : (
                <p className={`italic ${
                  theme === 'light' ? 'text-neutral-500' : 'text-neutral-500'
                }`}>
                  No notes yet. Click Edit to add your learning insights and progress updates.
                </p>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Topics Section */}
      <Card>
        <TopicsList
          topics={topics}
          loading={topicsLoading}
          onCreateTopic={createTopic}
          onUpdateTopic={updateTopic}
          onDeleteTopic={deleteTopic}
        />
      </Card>
    </div>
  );
}