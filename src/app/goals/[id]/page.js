"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGoals } from "@/hooks/useGoals";
import { useSkills } from "@/hooks/useSkills";
import { useTheme } from "@/hooks/useTheme";
import {
  ArrowLeft,
  Plus,
  Target,
  Calendar,
  Clock,
  CheckCircle2,
  Edit3,
  Flag,
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
      <div className="p-8 space-y-8">
        <div className="animate-pulse">
          <div
            className={`h-8 rounded w-32 mb-6 ${
              theme === "light" ? "bg-gray-200" : "bg-gray-700"
            }`}
          ></div>
          <div
            className={`rounded-lg p-6 mb-6 h-48 ${
              theme === "light" ? "bg-gray-200" : "bg-gray-800"
            }`}
          ></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`rounded-lg p-4 h-24 ${
                  theme === "light" ? "bg-gray-200" : "bg-gray-800"
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
      <div className="p-8 space-y-8">
        <Button
          onClick={() => router.push("/goals")}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Goals
        </Button>
        <Card className="text-center py-12">
          <h2
            className={`text-xl font-semibold mb-2 ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}
          >
            Goal not found
          </h2>
          <p
            className={`mb-6 ${
              theme === "light" ? "text-gray-600" : "text-gray-400"
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
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button onClick={() => router.push("/goals")} variant="ghost">
          <ArrowLeft size={16} className="mr-2" />
          Back to Goals
        </Button>
        <Button
          onClick={() => router.push(`/goals/${goal.id}/edit`)}
          variant="outline"
          size="sm"
        >
          <Edit3 size={16} className="mr-2" />
          Edit Goal
        </Button>
      </div>

      {/* Goal Header */}
      <Card className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {goal.is_achieved ? (
              <CheckCircle2
                className="text-green-400 flex-shrink-0"
                size={24}
              />
            ) : (
              <Target className="text-blue-400 flex-shrink-0" size={24} />
            )}
            <div>
              <h1
                className={`text-2xl font-bold ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}
              >
                {goal.title}
              </h1>
              {goal.description && (
                <p
                  className={`mt-1 ${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
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
                  ? "text-red-400"
                  : theme === "light"
                  ? "text-gray-600"
                  : "text-gray-400"
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
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              <Clock size={16} />
              <span>{goal.estimated_duration_weeks} weeks estimated</span>
            </div>
          )}

          <div
            className={`flex items-center gap-2 ${
              theme === "light" ? "text-gray-600" : "text-gray-400"
            }`}
          >
            <Target size={16} />
            <span>{goalSkills.length} skills in roadmap</span>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className={`font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}>Overall Progress</span>
            <span className={`text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
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
            <Card className="bg-green-900/20 border-green-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-green-300 mb-1">
                    All skills completed! 🎉
                  </h3>
                  <p className="text-sm text-green-400">
                    Ready to mark this goal as achieved?
                  </p>
                </div>
                <Button
                  onClick={handleMarkGoalAchieved}
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Flag size={16} className="mr-2" />
                  Mark as Achieved
                </Button>
              </div>
            </Card>
          )}
      </Card>

      {/* Roadmap Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>Learning Roadmap</h2>
          <p className={`${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>Skills needed to achieve your goal</p>
        </div>
        <Button onClick={handleAddSkill} className="flex items-center gap-2">
          <Plus size={16} />
          Add Skill
        </Button>
      </div>

      {/* Linear Roadmap */}
      {goalSkills.length === 0 ? (
        <Card className="text-center py-12">
          <div className={`mb-4 ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
            <Target className="mx-auto h-12 w-12 mb-4" />
          </div>
          <h3 className={`text-lg font-medium mb-2 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
            No skills in roadmap yet
          </h3>
          <p className={`mb-6 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
            Start building your learning path by adding the skills you need to
            achieve this goal.
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
        <div className="space-y-4">
          {goalSkills.map((skill, index) => (
            <div key={skill.id} className="relative">
              {/* Connection Line */}
              {index < goalSkills.length - 1 && (
                <div className={`absolute left-8 top-16 w-0.5 h-8 ${theme === "light" ? "bg-gray-300" : "bg-gray-700"}`}></div>
              )}

              <div
                className="flex gap-4 cursor-pointer group"
                onClick={() => router.push(`/skills/${skill.id}`)}
              >
                {/* Step Number */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium group-hover:border-blue-500 transition-colors ${
                  theme === "light" 
                    ? "bg-gray-100 border-gray-300" 
                    : "bg-gray-800 border-gray-600"
                }`}>
                  {skill.status === "done" ? (
                    <CheckCircle2 className="text-green-400" size={16} />
                  ) : (
                    <span className={theme === "light" ? "text-gray-600" : "text-gray-300"}>{index + 1}</span>
                  )}
                </div>

                {/* Skill Card */}
                <Card variant="interactive" className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`font-semibold group-hover:text-blue-400 transition-colors ${
                      theme === "light" ? "text-gray-900" : "text-white"
                    }`}>
                      {skill.title}
                    </h3>
                    <Badge variant={getStatusColor(skill.status)}>
                      {getStatusLabel(skill.status)}
                    </Badge>
                  </div>

                  {skill.description && (
                    <p className={`text-sm mb-3 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                      {skill.description}
                    </p>
                  )}

                  <ProgressBar
                    value={getProgressValue(skill.status)}
                    className="mb-3"
                  />

                  <div className={`flex items-center justify-between text-xs ${theme === "light" ? "text-gray-500" : "text-gray-500"}`}>
                    <div className="flex items-center gap-4">
                      {skill.target_date && (
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{formatDate(skill.target_date)}</span>
                        </div>
                      )}
                      {skill.estimated_duration_days && (
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{skill.estimated_duration_days} days</span>
                        </div>
                      )}
                    </div>
                    <span className={theme === "light" ? "text-gray-500" : "text-gray-500"}>Click to edit</span>
                  </div>
                </Card>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
