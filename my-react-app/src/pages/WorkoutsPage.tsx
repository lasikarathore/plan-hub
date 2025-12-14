import React, { useState } from 'react';
import { Plus, Search, Dumbbell, Calendar, Clock, TrendingUp } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { formatDate } from '../utils/helpers';

interface Exercise {
  id: string;
  name: string;
  category: string;
  muscleGroup: string;
  equipment: string;
}

interface WorkoutExercise {
  exercise: Exercise;
  sets: number;
  reps: number;
  weight: number;
}

interface Workout {
  id: string;
  name: string;
  date: Date;
  duration: number;
  exercises: WorkoutExercise[];
  caloriesBurned: number;
  notes?: string;
}

const EXERCISE_LIBRARY: Exercise[] = [
  { id: '1', name: 'Bench Press', category: 'Strength', muscleGroup: 'Chest', equipment: 'Barbell' },
  { id: '2', name: 'Squats', category: 'Strength', muscleGroup: 'Legs', equipment: 'Barbell' },
  { id: '3', name: 'Deadlift', category: 'Strength', muscleGroup: 'Back', equipment: 'Barbell' },
  { id: '4', name: 'Pull-ups', category: 'Strength', muscleGroup: 'Back', equipment: 'Bodyweight' },
  { id: '5', name: 'Shoulder Press', category: 'Strength', muscleGroup: 'Shoulders', equipment: 'Dumbbell' },
  { id: '6', name: 'Bicep Curls', category: 'Strength', muscleGroup: 'Arms', equipment: 'Dumbbell' },
  { id: '7', name: 'Tricep Dips', category: 'Strength', muscleGroup: 'Arms', equipment: 'Bodyweight' },
  { id: '8', name: 'Lunges', category: 'Strength', muscleGroup: 'Legs', equipment: 'Bodyweight' },
  { id: '9', name: 'Plank', category: 'Core', muscleGroup: 'Abs', equipment: 'Bodyweight' },
  { id: '10', name: 'Running', category: 'Cardio', muscleGroup: 'Full Body', equipment: 'None' },
];

const WorkoutsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [workouts, setWorkouts] = useState<Workout[]>([
    {
      id: '1',
      name: 'Upper Body Strength',
      date: new Date(2025, 11, 12),
      duration: 65,
      caloriesBurned: 320,
      exercises: [
        { exercise: EXERCISE_LIBRARY[0], sets: 4, reps: 8, weight: 80 },
        { exercise: EXERCISE_LIBRARY[4], sets: 3, reps: 10, weight: 25 },
      ],
    },
    {
      id: '2',
      name: 'Leg Day',
      date: new Date(2025, 11, 10),
      duration: 75,
      caloriesBurned: 410,
      exercises: [
        { exercise: EXERCISE_LIBRARY[1], sets: 5, reps: 5, weight: 120 },
        { exercise: EXERCISE_LIBRARY[7], sets: 3, reps: 12, weight: 0 },
      ],
    },
  ]);

  const [newWorkout, setNewWorkout] = useState({
    name: '',
    exercises: [] as WorkoutExercise[],
    notes: '',
  });

  const categories = ['All', 'Strength', 'Cardio', 'Core', 'Flexibility'];

  const filteredExercises = EXERCISE_LIBRARY.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateWorkout = () => {
    if (newWorkout.name && newWorkout.exercises.length > 0) {
      const workout: Workout = {
        id: Date.now().toString(),
        name: newWorkout.name,
        date: new Date(),
        duration: 0,
        caloriesBurned: 0,
        exercises: newWorkout.exercises,
        notes: newWorkout.notes,
      };
      setWorkouts([workout, ...workouts]);
      setNewWorkout({ name: '', exercises: [], notes: '' });
      setIsCreateModalOpen(false);
    }
  };

  const addExerciseToWorkout = (exercise: Exercise) => {
    const exists = newWorkout.exercises.find((e) => e.exercise.id === exercise.id);
    if (!exists) {
      setNewWorkout({
        ...newWorkout,
        exercises: [...newWorkout.exercises, { exercise, sets: 3, reps: 10, weight: 0 }],
      });
    }
  };

  const updateExerciseDetails = (index: number, field: keyof WorkoutExercise, value: number) => {
    const updated = [...newWorkout.exercises];
    updated[index] = { ...updated[index], [field]: value };
    setNewWorkout({ ...newWorkout, exercises: updated });
  };

  const removeExercise = (index: number) => {
    setNewWorkout({
      ...newWorkout,
      exercises: newWorkout.exercises.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="min-h-screen bg-white pb-8">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 animate-fade-in">
                My Workouts
              </h1>
              <p className="text-gray-600">Track and manage your workout routines</p>
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="animate-slide-up hover:scale-105 transition-transform"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Workout
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up">
            <Card className="hover-lift">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Dumbbell className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Workouts</p>
                  <p className="text-2xl font-bold text-gray-900">{workouts.length}</p>
                </div>
              </div>
            </Card>

            <Card className="hover-lift">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {workouts.filter((w) => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return w.date >= weekAgo;
                    }).length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="hover-lift">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Calories Burned</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {workouts.reduce((sum, w) => sum + w.caloriesBurned, 0)}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Workouts List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {workouts.map((workout, index) => (
            <Card
              key={workout.id}
              className="hover-lift animate-fade-in-up cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{workout.name}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(workout.date)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {workout.duration} min
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {workout.caloriesBurned} cal
                    </div>
                  </div>
                </div>
                <Badge variant="primary">{workout.exercises.length} exercises</Badge>
              </div>

              <div className="space-y-2">
                {workout.exercises.map((ex, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Dumbbell className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{ex.exercise.name}</p>
                        <p className="text-sm text-gray-600">{ex.exercise.muscleGroup}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {ex.sets} × {ex.reps}
                      </p>
                      {ex.weight > 0 && (
                        <p className="text-sm text-gray-600">{ex.weight} kg</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Workout Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Workout"
      >
        <div className="space-y-6">
          {/* Workout Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workout Name
            </label>
            <Input
              type="text"
              placeholder="e.g., Upper Body Strength"
              value={newWorkout.name}
              onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
            />
          </div>

          {/* Exercise Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Exercises
            </label>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Exercise List */}
            <div className="max-h-48 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-2">
              {filteredExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  onClick={() => addExerciseToWorkout(exercise)}
                  className="flex items-center justify-between p-2 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{exercise.name}</p>
                    <p className="text-sm text-gray-600">
                      {exercise.muscleGroup} • {exercise.equipment}
                    </p>
                  </div>
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
              ))}
            </div>
          </div>

          {/* Selected Exercises */}
          {newWorkout.exercises.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workout Plan ({newWorkout.exercises.length} exercises)
              </label>
              <div className="space-y-3">
                {newWorkout.exercises.map((ex, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg space-y-2 animate-fade-in"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{ex.exercise.name}</p>
                      <button
                        onClick={() => removeExercise(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Sets</label>
                        <Input
                          type="number"
                          value={ex.sets}
                          onChange={(e) =>
                            updateExerciseDetails(index, 'sets', parseInt(e.target.value) || 0)
                          }
                          min="1"
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Reps</label>
                        <Input
                          type="number"
                          value={ex.reps}
                          onChange={(e) =>
                            updateExerciseDetails(index, 'reps', parseInt(e.target.value) || 0)
                          }
                          min="1"
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Weight (kg)</label>
                        <Input
                          type="number"
                          value={ex.weight}
                          onChange={(e) =>
                            updateExerciseDetails(index, 'weight', parseInt(e.target.value) || 0)
                          }
                          min="0"
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Add any notes about this workout..."
              value={newWorkout.notes}
              onChange={(e) => setNewWorkout({ ...newWorkout, notes: e.target.value })}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateWorkout}
              disabled={!newWorkout.name || newWorkout.exercises.length === 0}
            >
              Create Workout
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WorkoutsPage;
