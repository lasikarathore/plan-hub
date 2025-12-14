import React, { useState } from 'react';
import { Plus, Apple, TrendingUp, Target, Flame, Calendar } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import { formatDate } from '../utils/helpers';

interface NutritionLog {
  id: string;
  date: Date;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  servingSize: string;
}

const NutritionPage: React.FC = () => {
  const [selectedDate] = useState(new Date());
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [nutritionLogs, setNutritionLogs] = useState<NutritionLog[]>([
    {
      id: '1',
      date: new Date(),
      mealType: 'Breakfast',
      foodName: 'Oatmeal with Berries',
      calories: 320,
      protein: 12,
      carbs: 54,
      fats: 7,
      servingSize: '1 bowl',
    },
    {
      id: '2',
      date: new Date(),
      mealType: 'Lunch',
      foodName: 'Grilled Chicken Salad',
      calories: 450,
      protein: 38,
      carbs: 25,
      fats: 18,
      servingSize: '1 plate',
    },
    {
      id: '3',
      date: new Date(),
      mealType: 'Snack',
      foodName: 'Protein Shake',
      calories: 180,
      protein: 25,
      carbs: 12,
      fats: 3,
      servingSize: '1 serving',
    },
  ]);

  const [newMeal, setNewMeal] = useState({
    mealType: 'Breakfast' as NutritionLog['mealType'],
    foodName: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    servingSize: '',
  });

  // Daily goals
  const dailyGoals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fats: 65,
  };

  // Calculate today's totals
  const todaysLogs = nutritionLogs.filter(
    (log) => log.date.toDateString() === selectedDate.toDateString()
  );

  const totals = todaysLogs.reduce(
    (acc, log) => ({
      calories: acc.calories + log.calories,
      protein: acc.protein + log.protein,
      carbs: acc.carbs + log.carbs,
      fats: acc.fats + log.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const handleAddMeal = () => {
    if (newMeal.foodName && newMeal.calories > 0) {
      const meal: NutritionLog = {
        id: Date.now().toString(),
        date: selectedDate,
        ...newMeal,
      };
      setNutritionLogs([...nutritionLogs, meal]);
      setNewMeal({
        mealType: 'Breakfast',
        foodName: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        servingSize: '',
      });
      setIsAddMealOpen(false);
    }
  };

  const mealTypes: NutritionLog['mealType'][] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  const getMealIcon = (_type: string) => {
    return <Apple className="w-5 h-5" />;
  };

  const getMealColor = (type: string) => {
    const colors = {
      Breakfast: 'bg-yellow-100 text-yellow-600',
      Lunch: 'bg-green-100 text-green-600',
      Dinner: 'bg-blue-100 text-blue-600',
      Snack: 'bg-purple-100 text-purple-600',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="min-h-screen bg-white pb-8">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-green-50 via-white to-blue-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 animate-fade-in">
                Nutrition Tracker
              </h1>
              <p className="text-gray-600">Monitor your daily calories and macros</p>
            </div>
            <Button
              onClick={() => setIsAddMealOpen(true)}
              className="animate-slide-up hover:scale-105 transition-transform"
            >
              <Plus className="w-5 h-5 mr-2" />
              Log Meal
            </Button>
          </div>

          {/* Daily Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up">
            <Card className="hover-lift">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Flame className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Calories</span>
                </div>
                <Badge variant={totals.calories > dailyGoals.calories ? 'danger' : 'success'}>
                  {Math.round((totals.calories / dailyGoals.calories) * 100)}%
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-900">
                  {totals.calories} / {dailyGoals.calories}
                </p>
                <ProgressBar
                  progress={(totals.calories / dailyGoals.calories) * 100}
                  color="warning"
                />
              </div>
            </Card>

            <Card className="hover-lift">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Protein</span>
                </div>
                <Badge variant={totals.protein >= dailyGoals.protein ? 'success' : 'warning'}>
                  {Math.round((totals.protein / dailyGoals.protein) * 100)}%
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-900">
                  {totals.protein}g / {dailyGoals.protein}g
                </p>
                <ProgressBar
                  progress={(totals.protein / dailyGoals.protein) * 100}
                  color="danger"
                />
              </div>
            </Card>

            <Card className="hover-lift">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Carbs</span>
                </div>
                <Badge variant={totals.carbs > dailyGoals.carbs ? 'warning' : 'success'}>
                  {Math.round((totals.carbs / dailyGoals.carbs) * 100)}%
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-900">
                  {totals.carbs}g / {dailyGoals.carbs}g
                </p>
                <ProgressBar progress={(totals.carbs / dailyGoals.carbs) * 100} color="primary" />
              </div>
            </Card>

            <Card className="hover-lift">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Apple className="w-5 h-5 text-yellow-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Fats</span>
                </div>
                <Badge variant={totals.fats > dailyGoals.fats ? 'warning' : 'success'}>
                  {Math.round((totals.fats / dailyGoals.fats) * 100)}%
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-900">
                  {totals.fats}g / {dailyGoals.fats}g
                </p>
                <ProgressBar progress={(totals.fats / dailyGoals.fats) * 100} color="warning" />
              </div>
            </Card>
          </div>

          {/* Macro Breakdown Chart */}
          <Card className="mt-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Macro Distribution</h3>
            <div className="flex items-center space-x-2">
              <div className="flex-1 h-8 bg-gray-200 rounded-full overflow-hidden flex">
                <div
                  className="bg-red-500 transition-all duration-500"
                  style={{
                    width: `${(totals.protein / (totals.protein + totals.carbs + totals.fats)) * 100}%`,
                  }}
                />
                <div
                  className="bg-blue-500 transition-all duration-500"
                  style={{
                    width: `${(totals.carbs / (totals.protein + totals.carbs + totals.fats)) * 100}%`,
                  }}
                />
                <div
                  className="bg-yellow-500 transition-all duration-500"
                  style={{
                    width: `${(totals.fats / (totals.protein + totals.carbs + totals.fats)) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                <span className="text-gray-700">Protein: {totals.protein}g</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
                <span className="text-gray-700">Carbs: {totals.carbs}g</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
                <span className="text-gray-700">Fats: {totals.fats}g</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Meals Log */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Today's Meals</h2>
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span>{formatDate(selectedDate)}</span>
          </div>
        </div>

        <div className="space-y-4">
          {mealTypes.map((mealType) => {
            const meals = todaysLogs.filter((log) => log.mealType === mealType);
            const mealTotals = meals.reduce(
              (acc, meal) => ({
                calories: acc.calories + meal.calories,
                protein: acc.protein + meal.protein,
                carbs: acc.carbs + meal.carbs,
                fats: acc.fats + meal.fats,
              }),
              { calories: 0, protein: 0, carbs: 0, fats: 0 }
            );

            return (
              <Card key={mealType} className="hover-lift animate-fade-in-up">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${getMealColor(mealType)}`}>
                      {getMealIcon(mealType)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{mealType}</h3>
                      {meals.length > 0 && (
                        <p className="text-sm text-gray-600">
                          {mealTotals.calories} cal • {mealTotals.protein}g protein
                        </p>
                      )}
                    </div>
                  </div>
                  {meals.length === 0 && (
                    <span className="text-sm text-gray-500 italic">No meals logged</span>
                  )}
                </div>

                {meals.length > 0 && (
                  <div className="space-y-3">
                    {meals.map((meal) => (
                      <div
                        key={meal.id}
                        className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900">{meal.foodName}</p>
                            <p className="text-sm text-gray-600">{meal.servingSize}</p>
                          </div>
                          <Badge variant="primary">{meal.calories} cal</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Protein:</span>
                            <span className="ml-1 font-medium text-gray-900">
                              {meal.protein}g
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Carbs:</span>
                            <span className="ml-1 font-medium text-gray-900">{meal.carbs}g</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Fats:</span>
                            <span className="ml-1 font-medium text-gray-900">{meal.fats}g</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Add Meal Modal */}
      <Modal
        isOpen={isAddMealOpen}
        onClose={() => setIsAddMealOpen(false)}
        title="Log a Meal"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Meal Type</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newMeal.mealType}
              onChange={(e) =>
                setNewMeal({ ...newMeal, mealType: e.target.value as NutritionLog['mealType'] })
              }
            >
              {mealTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Food Name</label>
            <Input
              type="text"
              placeholder="e.g., Grilled Chicken Breast"
              value={newMeal.foodName}
              onChange={(e) => setNewMeal({ ...newMeal, foodName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Serving Size</label>
            <Input
              type="text"
              placeholder="e.g., 1 cup, 100g"
              value={newMeal.servingSize}
              onChange={(e) => setNewMeal({ ...newMeal, servingSize: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calories
              </label>
              <Input
                type="number"
                placeholder="0"
                value={newMeal.calories || ''}
                onChange={(e) =>
                  setNewMeal({ ...newMeal, calories: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Protein (g)
              </label>
              <Input
                type="number"
                placeholder="0"
                value={newMeal.protein || ''}
                onChange={(e) =>
                  setNewMeal({ ...newMeal, protein: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Carbs (g)</label>
              <Input
                type="number"
                placeholder="0"
                value={newMeal.carbs || ''}
                onChange={(e) => setNewMeal({ ...newMeal, carbs: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fats (g)</label>
              <Input
                type="number"
                placeholder="0"
                value={newMeal.fats || ''}
                onChange={(e) => setNewMeal({ ...newMeal, fats: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsAddMealOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddMeal}
              disabled={!newMeal.foodName || newMeal.calories === 0}
            >
              Log Meal
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NutritionPage;
