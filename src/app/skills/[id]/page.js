'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
import { Calendar, Clock, Edit3, Save, X, Plus } from 'lucide-react';
import { useSkills } from '@/hooks/useSkills';
import { useTopics } from '@/hooks/useTopics';
import { useSkillContent } from '@/hooks/useSkillContent';
import { useTheme } from '@/hooks/useTheme';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import ProgressBar from '@/components/ui/ProgressBar';
import TopicsList from '@/components/TopicsList';
import SkillContentList from '@/components/SkillContentList';
import CreateContentModal from '@/components/CreateContentModal';
import { getStatusColor, getStatusLabel, formatDate } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export default function SkillDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { skills, updateSkill, loading } = useSkills();
  const { theme } = useTheme();
  const [skill, setSkill] = useState(null);
  const { topics, loading: topicsLoading, createTopic, updateTopic, deleteTopic } = useTopics(params.id);
  const { content, loading: contentLoading, createContent, updateContent, deleteContent } = useSkillContent(params.id);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isCreateContentModalOpen, setIsCreateContentModalOpen] = useState(false);

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

  const handleCreateContent = async (contentData) => {
    try {
      if (contentData.type === 'topic') {
        // Create as a topic
        await createTopic({
          title: contentData.title,
          description: contentData.content
        });
      } else {
        // Create as content block
        await createContent(contentData);
      }
    } catch (error) {
      console.error('Error creating content:', error);
    }
  };

  if (loading || contentLoading) {
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

      {/* Documentation-style Content */}
      <div className="max-w-none">
        {/* Header */}
        <header className="pb-8 mb-8 border-b border-neutral-200 dark:border-neutral-800">
          {isEditing ? (
            <div className="space-y-4">
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                className="text-3xl font-bold"
                placeholder="Skill title"
              />
              <select
                value={editForm.status}
                onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                className={`rounded-lg border px-3 py-2 text-sm ${
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
          ) : (
            <div>
              <h1 className={`text-3xl font-bold mb-4 ${
                theme === 'light' ? 'text-neutral-900' : 'text-white'
              }`}>
                {skill.title}
              </h1>
              {skill.description && (
                <p className={`text-lg leading-relaxed ${
                  theme === 'light' ? 'text-neutral-600' : 'text-neutral-400'
                }`}>
                  {skill.description}
                </p>
              )}
            </div>
          )}
        </header>

        {/* Description Section (when editing) */}
        {isEditing && (
          <div className="mb-8">
            <label className={`block text-sm font-medium mb-3 ${
              theme === 'light' ? 'text-neutral-700' : 'text-neutral-300'
            }`}>
              Description
            </label>
            <Textarea
              value={editForm.description}
              onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this skill is about and what you'll learn..."
              rows={4}
            />
          </div>
        )}

        {/* Learning Notes Section */}
        <div className="mb-12">
          <h2 className={`text-xl font-semibold mb-6 ${
            theme === 'light' ? 'text-neutral-900' : 'text-white'
          }`}>
            Learning Notes
          </h2>
          
          {isEditing ? (
            <Textarea
              value={editForm.notes}
              onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Document your learning journey, key insights, resources, and progress..."
              rows={12}
              className="font-mono text-sm"
            />
          ) : (
            <div className={`prose prose-neutral max-w-none ${
              theme === 'dark' ? 'prose-invert' : ''
            }`}>
              {skill.notes ? (
                <div className={`whitespace-pre-wrap leading-relaxed ${
                  theme === 'light' ? 'text-neutral-700' : 'text-neutral-300'
                }`}>
                  {skill.notes}
                </div>
              ) : (
                <div className={`text-center py-16 ${
                  theme === 'light' ? 'text-neutral-500' : 'text-neutral-500'
                }`}>
                  <p className="italic">
                    No learning notes yet. Click Edit to document your journey.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-semibold ${
              theme === 'light' ? 'text-neutral-900' : 'text-white'
            }`}>
              Documentation
            </h2>
            <Button 
              onClick={() => setIsCreateContentModalOpen(true)} 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus size={14} />
              Add Content
            </Button>
          </div>
          
          {/* Content Blocks */}
          {content.length > 0 && (
            <div className="mb-8">
              <SkillContentList
                content={content}
                loading={contentLoading}
                onCreateContent={createContent}
                onUpdateContent={updateContent}
                onDeleteContent={deleteContent}
              />
            </div>
          )}
          
          {/* Topics (Legacy) */}
          {topics.length > 0 && (
            <div>
              <h3 className={`text-lg font-medium mb-4 ${
                theme === 'light' ? 'text-neutral-800' : 'text-neutral-200'
              }`}>
                Topics
              </h3>
              <TopicsList
                topics={topics}
                loading={topicsLoading}
                onCreateTopic={createTopic}
                onUpdateTopic={updateTopic}
                onDeleteTopic={deleteTopic}
              />
            </div>
          )}
          
          {/* Empty State */}
          {content.length === 0 && topics.length === 0 && !contentLoading && !topicsLoading && (
            <div className={`text-center py-16 ${
              theme === 'light' ? 'text-neutral-500' : 'text-neutral-500'
            }`}>
              <p className="italic">
                No documentation yet. Click "Add Content" to start documenting your learning journey.
              </p>
            </div>
          )}
        </div>

        {/* Metadata Footer */}
        {!isEditing && (
          <footer className={`pt-8 mt-12 border-t text-sm ${
            theme === 'light' 
              ? 'border-neutral-200 text-neutral-500' 
              : 'border-neutral-800 text-neutral-500'
          }`}>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>
                  Last updated {formatDistanceToNow(new Date(skill.last_reviewed_at), { addSuffix: true })}
                </span>
              </div>
              {skill.target_date && (
                <div className={`flex items-center gap-2 ${
                  isOverdue ? 'text-red-500' : ''
                }`}>
                  <Calendar size={14} />
                  <span>Target: {formatDate(skill.target_date)}</span>
                </div>
              )}
            </div>
          </footer>
        )}
      </div>

      {/* Create Content Modal */}
      <CreateContentModal
        isOpen={isCreateContentModalOpen}
        onClose={() => setIsCreateContentModalOpen(false)}
        onContentCreated={handleCreateContent}
        skillId={params.id}
      />
    </div>
  );
}