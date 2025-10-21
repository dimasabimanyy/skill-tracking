'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Edit3, Save, X } from 'lucide-react';
import { useSkills } from '@/hooks/useSkills';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import ProgressBar from '@/components/ui/ProgressBar';
import { getProgressValue, getStatusColor, getStatusLabel, formatDate } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export default function SkillDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { skills, updateSkill, loading } = useSkills();
  const [skill, setSkill] = useState(null);
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
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-32 mb-6"></div>
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3 mb-6"></div>
              <div className="h-32 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto p-6">
          <Button onClick={() => router.push('/')} variant="ghost" className="mb-6">
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Button>
          <Card className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Skill not found</h2>
            <p className="text-gray-400 mb-6">The skill you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/')}>
              Return to Dashboard
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const progress = getProgressValue(skill.status);
  const statusColor = getStatusColor(skill.status);
  const statusLabel = getStatusLabel(skill.status);
  const isOverdue = skill.target_date && new Date(skill.target_date) < new Date();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button onClick={() => router.push('/')} variant="ghost">
              <ArrowLeft size={16} className="mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button 
                    onClick={handleCancel} 
                    variant="ghost"
                    disabled={isSaving}
                  >
                    <X size={16} className="mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    <Save size={16} className="mr-2" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit3 size={16} className="mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <Card>
            {/* Title and Status */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div className="flex-1">
                {isEditing ? (
                  <Input
                    value={editForm.title}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    className="text-2xl font-bold bg-gray-700 border-gray-600"
                    placeholder="Skill title"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-white">{skill.title}</h1>
                )}
              </div>
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-sm"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Completed</option>
                  </select>
                ) : (
                  <Badge variant={statusColor}>{statusLabel}</Badge>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <ProgressBar value={progress} showPercentage className="mb-6" />

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              {isEditing ? (
                <Textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Add a description for this skill..."
                  rows={3}
                />
              ) : (
                <p className="text-gray-300">
                  {skill.description || 'No description yet. Click Edit to add one.'}
                </p>
              )}
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
              <div>
                <div className="text-gray-400 mb-1">Target Date</div>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editForm.target_date}
                    onChange={(e) => setEditForm(prev => ({ ...prev, target_date: e.target.value }))}
                    className="text-sm"
                  />
                ) : (
                  <div className={`flex items-center gap-2 ${isOverdue ? 'text-red-400' : 'text-white'}`}>
                    <Calendar size={14} />
                    {skill.target_date ? formatDate(skill.target_date) : 'No target date set'}
                  </div>
                )}
              </div>
              <div>
                <div className="text-gray-400 mb-1">Last Updated</div>
                <div className="flex items-center gap-2 text-white">
                  <Clock size={14} />
                  {formatDistanceToNow(new Date(skill.last_reviewed_at), { addSuffix: true })}
                </div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Created</div>
                <div className="text-white">
                  {formatDate(skill.created_at)}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Notes</h3>
              {isEditing ? (
                <Textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add your learning notes, insights, or progress updates..."
                  rows={8}
                />
              ) : (
                <div className="bg-gray-700/30 rounded-lg p-4 min-h-[200px]">
                  {skill.notes ? (
                    <pre className="whitespace-pre-wrap text-gray-300 font-sans">
                      {skill.notes}
                    </pre>
                  ) : (
                    <p className="text-gray-400 italic">
                      No notes yet. Click Edit to add your learning insights and progress updates.
                    </p>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}