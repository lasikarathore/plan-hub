import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Dumbbell,
  Flame,
  Target,
  TrendingUp,
  Calendar,
  Award,
  Plus,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import { fadeInUp, staggerContainer } from '../utils/animations';
import { formatDate } from '../utils/helpers';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  // Mock data - will be replaced with actual data from API
  const stats = [
    {
      label: 'Workouts This Week',
      value: '12',
      change: '+3 from last week',
      icon: Dumbbell,
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
    },
    {
      label: 'Calories Burned',
      value: '3,240',
      change: '↑ 15% this month',
      icon: Flame,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      label: 'Current Streak',
      value: '7 days',
      change: 'Personal best!',
      icon: Target,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      label: 'Weight Progress',
      value: '-3.5 kg',
      change: '5.2kg to goal',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  const recentWorkouts = [
    {
      id: '1',
      name: 'Upper Body Strength',
      date: new Date(),
      duration: 45,
      exercises: 8,
      calories: 320,
    },
    {
      id: '2',
      name: 'Cardio & Core',
      date: new Date(Date.now() - 86400000),
      duration: 30,
      exercises: 6,
      calories: 280,
    },
    {
      id: '3',
      name: 'Leg Day',
      date: new Date(Date.now() - 172800000),
      duration: 60,
      exercises: 10,
      calories: 450,
    },
  ];

  const goals = [
    {
      id: '1',
      title: 'Lose 10kg',
      current: 3.5,
      target: 10,
      unit: 'kg',
      progress: 35,
    },
    {
      id: '2',
      title: 'Workout 5x per week',
      current: 3,
      target: 5,
      unit: 'days',
      progress: 60,
    },
    {
      id: '3',
      title: 'Run 5km',
      current: 3.2,
      target: 5,
      unit: 'km',
      progress: 64,
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Section */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Let's crush your fitness goals today
          </p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-5 h-5" />}>
          New Workout
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div key={stat.label} variants={fadeInUp}>
            <Card hover className="p-6 relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -mr-16 -mt-16`}></div>
              
              <div className="relative">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-xs text-green-600 font-medium">{stat.change}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Workouts */}
        <motion.div variants={fadeInUp} className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Workouts</h2>
              <Link to="/workouts" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
                View all
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {recentWorkouts.map((workout, index) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Dumbbell className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{workout.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(workout.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {workout.duration} min
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="secondary" size="sm">
                      {workout.exercises} exercises
                    </Badge>
                    <span className="text-xs text-orange-600 font-medium">
                      {workout.calories} cal
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button variant="ghost" className="w-full mt-4" rightIcon={<Plus className="w-4 h-4" />}>
              Log New Workout
            </Button>
          </Card>
        </motion.div>

        {/* Active Goals */}
        <motion.div variants={fadeInUp}>
          <Card className="p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Active Goals</h2>
              <Link to="/progress" className="text-primary-600 hover:text-primary-700">
                <Award className="w-5 h-5" />
              </Link>
            </div>

            <div className="space-y-6">
              {goals.map((goal, index) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                      <p className="text-sm text-gray-500">
                        {goal.current} / {goal.target} {goal.unit}
                      </p>
                    </div>
                    <Badge variant={goal.progress >= 50 ? 'success' : 'warning'} size="sm">
                      {goal.progress}%
                    </Badge>
                  </div>
                  <ProgressBar 
                    value={goal.progress} 
                    color={goal.progress >= 50 ? 'success' : 'warning'}
                    size="md"
                  />
                </motion.div>
              ))}
            </div>

            <Button variant="secondary" className="w-full mt-6" leftIcon={<Target className="w-4 h-4" />}>
              Set New Goal
            </Button>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={fadeInUp}>
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Log Workout', icon: Dumbbell, path: '/workouts' },
              { label: 'Add Meal', icon: Calendar, path: '/nutrition' },
              { label: 'Track Weight', icon: TrendingUp, path: '/progress' },
              { label: 'Browse Exercises', icon: Target, path: '/exercises' },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.path}
                className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all hover:scale-105"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <action.icon className="w-6 h-6 text-primary-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 text-center">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;
