'use client';
import { motion } from 'framer-motion';
import { Calendar, Clock, Target } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import { getProgressValue, getStatusColor, getStatusLabel } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export default function SkillCard({ skill }) {
  const progress = getProgressValue(skill.status);
  const statusColor = getStatusColor(skill.status);
  const statusLabel = getStatusLabel(skill.status);
  const isOverdue = skill.target_date && new Date(skill.target_date) < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/skills/${skill.id}`}>
        <Card className="h-full hover:border-gray-600 transition-colors cursor-pointer">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-lg text-white truncate flex-1 mr-2">
              {skill.title}
            </h3>
            <Badge variant={statusColor}>{statusLabel}</Badge>
          </div>

          {skill.description && (
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {skill.description}
            </p>
          )}

          <ProgressBar value={progress} className="mb-4" />

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              {skill.target_date && (
                <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-400' : ''}`}>
                  <Target size={12} />
                  <span>{new Date(skill.target_date).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>
                  {formatDistanceToNow(new Date(skill.last_reviewed_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}