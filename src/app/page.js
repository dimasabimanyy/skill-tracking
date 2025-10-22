'use client';
import { useState } from 'react';
import { useSkills } from '@/hooks/useSkills';
import SkillList from '@/components/SkillList';
import SearchBar from '@/components/SearchBar';
import StatusFilter from '@/components/StatusFilter';
import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import UserMenu from '@/components/UserMenu';
import AuthStatus from '@/components/AuthStatus';

export default function Dashboard() {
  const { skills, loading, createSkill } = useSkills();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredSkills = skills.filter(skill => {
    const matchesFilter = filter === 'all' || skill.status === filter;
    const matchesSearch = skill.title.toLowerCase().includes(search.toLowerCase()) ||
                         (skill.description && skill.description.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleCreateSkill = () => {
    createSkill({
      title: 'New Skill',
      description: 'Click to edit and add details'
    });
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
                Track your skills and knowledge growth • {skills.length} total skills
              </p>
            </div>
            <div className="flex items-center gap-4">
              <AuthStatus />
              <UserMenu />
            </div>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <SearchBar value={search} onChange={setSearch} />
          <StatusFilter value={filter} onChange={setFilter} />
          <Button onClick={handleCreateSkill} className="flex items-center gap-2 shrink-0">
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
      </div>
    </div>
  );
}