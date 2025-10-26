"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGoals } from "@/hooks/useGoals";
import { useSkills } from "@/hooks/useSkills";
import { useTheme } from "@/hooks/useTheme";
import {
  Plus,
  Target,
  Calendar,
  Clock,
  CheckCircle2,
  Flag,
  ChevronRight,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import {
  getProgressValue,
  getStatusColor,
  getStatusLabel,
  formatDate,
} from "@/lib/utils";

export default function GoalRoadmapPage() {
  const params = useParams();
  const router = useRouter();
  const { goals, updateGoal, loading: goalsLoading } = useGoals();
  const { skills, createSkill, loading: skillsLoading } = useSkills();
  const { theme } = useTheme();

  const [goal, setGoal] = useState(null);
  const [goalSkills, setGoalSkills] = useState([]);

  useEffect(() => {
    if (goals.length > 0) {
      const foundGoal = goals.find((g) => g.id === params.id);
      setGoal(foundGoal);
    }
  }, [goals, params.id]);

  useEffect(() => {
    if (skills.length > 0 && goal) {
      // Filter skills for this goal and sort by roadmap order
      const filteredSkills = skills
        .filter((skill) => skill.goal_id === goal.id)
        .sort((a, b) => (a.order_in_roadmap || 0) - (b.order_in_roadmap || 0));
      setGoalSkills(filteredSkills);
    }
  }, [skills, goal]);

  const handleAddSkill = async () => {
    if (!goal) return;

    const newSkill = await createSkill({
      goal_id: goal.id,
      title: "New Skill",
      description: "Click to edit and add details",
      order_in_roadmap: goalSkills.length,
    });

    if (newSkill) {
      setGoalSkills((prev) => [...prev, newSkill]);
    }
  };

  const handleMarkGoalAchieved = async () => {
    if (!goal) return;

    await updateGoal(goal.id, {
      is_achieved: true,
      achievement_notes: "Goal marked as achieved!",
    });
  };

  const getOverallProgress = () => {
    if (goalSkills.length === 0) return 0;
    const completedSkills = goalSkills.filter(
      (skill) => skill.status === "done"
    ).length;
    return Math.round((completedSkills / goalSkills.length) * 100);
  };

  const isOverdue =
    goal &&
    goal.target_date &&
    new Date(goal.target_date) < new Date() &&
    !goal.is_achieved;

  if (goalsLoading || skillsLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div
            className={`h-8 rounded w-32 mb-6 ${
              theme === "light" ? "bg-neutral-200" : "bg-neutral-700"
            }`}
          ></div>
          <div
            className={`rounded-xl p-6 mb-6 h-48 ${
              theme === "light" ? "bg-neutral-200" : "bg-neutral-800"
            }`}
          ></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`rounded-xl p-4 h-24 ${
                  theme === "light" ? "bg-neutral-200" : "bg-neutral-800"
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="space-y-8">
        <Card className="text-center py-12">
          <h2
            className={`text-xl font-semibold mb-2 ${
              theme === "light" ? "text-neutral-900" : "text-white"
            }`}
          >
            Goal not found
          </h2>
          <p
            className={`mb-6 ${
              theme === "light" ? "text-neutral-600" : "text-neutral-400"
            }`}
          >
            The goal you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/goals")}>Return to Goals</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Goal Header */}
      <Card>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {goal.is_achieved ? (
              <CheckCircle2
                className="text-emerald-500 flex-shrink-0"
                size={24}
              />
            ) : (
              <Target className="text-indigo-500 flex-shrink-0" size={24} />
            )}
            <div>
              <h1
                className={`text-2xl font-semibold ${
                  theme === "light" ? "text-neutral-900" : "text-white"
                }`}
              >
                {goal.title}
              </h1>
              {goal.description && (
                <p
                  className={`mt-1 ${
                    theme === "light" ? "text-neutral-600" : "text-neutral-400"
                  }`}
                >
                  {goal.description}
                </p>
              )}
            </div>
          </div>
          {goal.is_achieved && <Badge variant="green">Achieved!</Badge>}
        </div>

        {/* Goal Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
          {goal.target_date && (
            <div
              className={`flex items-center gap-2 ${
                isOverdue
                  ? "text-red-500"
                  : theme === "light"
                  ? "text-neutral-600"
                  : "text-neutral-400"
              }`}
            >
              <Calendar size={16} />
              <span>Target: {formatDate(goal.target_date)}</span>
              {isOverdue && (
                <Badge variant="red" className="ml-2">
                  Overdue
                </Badge>
              )}
            </div>
          )}

          {goal.estimated_duration_weeks && (
            <div
              className={`flex items-center gap-2 ${
                theme === "light" ? "text-neutral-600" : "text-neutral-400"
              }`}
            >
              <Clock size={16} />
              <span>{goal.estimated_duration_weeks} weeks estimated</span>
            </div>
          )}

          <div
            className={`flex items-center gap-2 ${
              theme === "light" ? "text-neutral-600" : "text-neutral-400"
            }`}
          >
            <Target size={16} />
            <span>{goalSkills.length} skills in roadmap</span>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className={`font-medium ${theme === "light" ? "text-neutral-900" : "text-white"}`}>Overall Progress</span>
            <span className={`text-sm ${theme === "light" ? "text-neutral-600" : "text-neutral-400"}`}>
              {goalSkills.filter((s) => s.status === "done").length}/
              {goalSkills.length} completed
            </span>
          </div>
          <ProgressBar
            value={getOverallProgress()}
            showPercentage
            className="h-3"
          />
        </div>

        {/* Goal Achievement */}
        {!goal.is_achieved &&
          getOverallProgress() === 100 &&
          goalSkills.length > 0 && (
            <Card className={`p-4 ${
              theme === "light" 
                ? "bg-emerald-50 border-emerald-200" 
                : "bg-emerald-900/20 border-emerald-700"
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-medium mb-1 ${
                    theme === "light" ? "text-emerald-700" : "text-emerald-300"
                  }`}>
                    All skills completed! 🎉
                  </h3>
                  <p className={`text-sm ${
                    theme === "light" ? "text-emerald-600" : "text-emerald-400"
                  }`}>
                    Ready to mark this goal as achieved?
                  </p>
                </div>
                <Button
                  onClick={handleMarkGoalAchieved}
                  className={`${
                    theme === "light" 
                      ? "bg-emerald-600 hover:bg-emerald-700" 
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  <Flag size={16} className="mr-2" />
                  Mark as Achieved
                </Button>
              </div>
            </Card>
          )}
      </Card>

      {/* Learning Path */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className={`text-xl font-semibold ${theme === "light" ? "text-neutral-900" : "text-white"}`}>
            Learning Path
          </h2>
          <Button 
            onClick={handleAddSkill} 
            variant="ghost" 
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus size={14} />
            Add Skill
          </Button>
        </div>

        {goalSkills.length === 0 ? (
          <Card className="text-center py-16 px-8">
            <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center ${
              theme === "light" ? "bg-indigo-50" : "bg-indigo-900/30"
            }`}>
              <Target className="text-indigo-500" size={24} />
            </div>
            <h3 className={`text-lg font-semibold mb-3 ${theme === "light" ? "text-neutral-900" : "text-white"}`}>
              Build your learning path
            </h3>
            <p className={`mb-8 max-w-md mx-auto ${theme === "light" ? "text-neutral-600" : "text-neutral-400"}`}>
              Break down your goal into skills you need to learn. Each skill becomes a step on your journey.
            </p>
            <Button
              onClick={handleAddSkill}
              className="flex items-center gap-2 mx-auto"
            >
              <Plus size={16} />
              Add Your First Skill
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {goalSkills.map((skill, index) => (
              <div 
                key={skill.id} 
                className={`group relative rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer ${
                  theme === "light"
                    ? "bg-white border-neutral-200 hover:border-neutral-300"
                    : "bg-neutral-900/50 border-neutral-700 hover:border-neutral-600"
                }`}
                onClick={() => router.push(`/skills/${skill.id}`)}
              >
                {/* Connection line */}
                {index < goalSkills.length - 1 && (
                  <div className={`absolute left-6 top-12 w-px h-6 ${
                    theme === "light" ? "bg-neutral-200" : "bg-neutral-700"
                  }`}></div>
                )}

                <div className="flex items-center gap-4 p-4">
                  {/* Status indicator */}
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    skill.status === "done"
                      ? "bg-emerald-100 text-emerald-600"
                      : skill.status === "in_progress"
                      ? (theme === "light" ? "bg-blue-100 text-blue-600" : "bg-blue-900/50 text-blue-400")
                      : (theme === "light" ? "bg-neutral-100 text-neutral-400" : "bg-neutral-800 text-neutral-500")
                  }`}>
                    {skill.status === "done" ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <div className={`w-2 h-2 rounded-full ${
                        skill.status === "in_progress" 
                          ? "bg-current" 
                          : "border border-current"
                      }`}></div>
                    )}
                  </div>

                  {/* Skill content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-medium transition-colors ${
                        theme === "light" ? "text-neutral-900" : "text-white"
                      }`}>
                        {skill.title}
                      </h3>
                      <Badge 
                        variant={getStatusColor(skill.status)} 
                        size="xs"
                      >
                        {getStatusLabel(skill.status)}
                      </Badge>
                    </div>
                    
                    {skill.description && (
                      <p className={`text-sm line-clamp-1 ${
                        theme === "light" ? "text-neutral-600" : "text-neutral-400"
                      }`}>
                        {skill.description}
                      </p>
                    )}
                  </div>

                  {/* Arrow indicator */}
                  <div className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                    theme === "light" ? "text-neutral-400" : "text-neutral-600"
                  }`}>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
