import React, { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, Calendar, Camera, Activity, Target } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { formatDate } from '../utils/helpers';

interface BodyMeasurement {
  id: string;
  date: Date;
  weight: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
}

const ProgressPage: React.FC = () => {
  const [isAddMeasurementOpen, setIsAddMeasurementOpen] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([
    {
      id: '1',
      date: new Date(2025, 11, 14),
      weight: 75,
      bodyFat: 18,
      chest: 102,
      waist: 85,
      hips: 98,
      arms: 36,
      thighs: 58,
    },
    {
      id: '2',
      date: new Date(2025, 11, 7),
      weight: 76.5,
      bodyFat: 19,
      chest: 101,
      waist: 87,
      hips: 99,
      arms: 35.5,
      thighs: 59,
    },
    {
      id: '3',
      date: new Date(2025, 10, 30),
      weight: 78,
      bodyFat: 20,
      chest: 100,
      waist: 89,
      hips: 100,
      arms: 35,
      thighs: 60,
    },
  ]);

  const [newMeasurement, setNewMeasurement] = useState<Partial<BodyMeasurement>>({
    weight: 0,
    bodyFat: 0,
    chest: 0,
    waist: 0,
    hips: 0,
    arms: 0,
    thighs: 0,
  });

  const latestMeasurement = measurements[0];
  const previousMeasurement = measurements[1];

  const getChange = (current?: number, previous?: number) => {
    if (!current || !previous) return null;
    const change = current - previous;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change > 0,
      percentage: ((change / previous) * 100).toFixed(1),
    };
  };

  const weightChange = getChange(latestMeasurement?.weight, previousMeasurement?.weight);
  const bodyFatChange = getChange(latestMeasurement?.bodyFat, previousMeasurement?.bodyFat);

  const handleAddMeasurement = () => {
    if (newMeasurement.weight && newMeasurement.weight > 0) {
      const measurement: BodyMeasurement = {
        id: Date.now().toString(),
        date: new Date(),
        weight: newMeasurement.weight!,
        bodyFat: newMeasurement.bodyFat,
        chest: newMeasurement.chest,
        waist: newMeasurement.waist,
        hips: newMeasurement.hips,
        arms: newMeasurement.arms,
        thighs: newMeasurement.thighs,
      };
      setMeasurements([measurement, ...measurements]);
      setNewMeasurement({
        weight: 0,
        bodyFat: 0,
        chest: 0,
        waist: 0,
        hips: 0,
        arms: 0,
        thighs: 0,
      });
      setIsAddMeasurementOpen(false);
    }
  };

  // Simple line chart data
  const chartData = measurements
    .slice()
    .reverse()
    .map((m) => ({ date: m.date, weight: m.weight }));

  const minWeight = Math.min(...chartData.map((d) => d.weight)) - 2;
  const maxWeight = Math.max(...chartData.map((d) => d.weight)) + 2;

  return (
    <div className="min-h-screen bg-white pb-8">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 animate-fade-in">
                Progress Tracker
              </h1>
              <p className="text-gray-600">Monitor your body measurements and progress</p>
            </div>
            <Button
              onClick={() => setIsAddMeasurementOpen(true)}
              className="animate-slide-up hover:scale-105 transition-transform"
            >
              <Plus className="w-5 h-5 mr-2" />
              Log Measurement
            </Button>
          </div>

          {/* Current Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up">
            <Card className="hover-lift">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Current Weight</span>
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <p className="text-3xl font-bold text-gray-900">{latestMeasurement?.weight}</p>
                <span className="text-sm text-gray-600">kg</span>
              </div>
              {weightChange && (
                <div className="flex items-center mt-2">
                  {weightChange.isPositive ? (
                    <TrendingUp className="w-4 h-4 text-red-600 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-green-600 mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      weightChange.isPositive ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {weightChange.isPositive ? '+' : '-'}
                    {weightChange.value} kg
                  </span>
                  <span className="text-sm text-gray-500 ml-2">from last week</span>
                </div>
              )}
            </Card>

            <Card className="hover-lift">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Body Fat</span>
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <p className="text-3xl font-bold text-gray-900">{latestMeasurement?.bodyFat}</p>
                <span className="text-sm text-gray-600">%</span>
              </div>
              {bodyFatChange && (
                <div className="flex items-center mt-2">
                  {bodyFatChange.isPositive ? (
                    <TrendingUp className="w-4 h-4 text-red-600 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-green-600 mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      bodyFatChange.isPositive ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {bodyFatChange.isPositive ? '+' : '-'}
                    {bodyFatChange.value}%
                  </span>
                  <span className="text-sm text-gray-500 ml-2">from last week</span>
                </div>
              )}
            </Card>

            <Card className="hover-lift">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Total Progress</span>
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <p className="text-3xl font-bold text-gray-900">
                  {measurements.length > 0
                    ? (measurements[measurements.length - 1].weight - latestMeasurement.weight).toFixed(
                        1
                      )
                    : 0}
                </p>
                <span className="text-sm text-gray-600">kg</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Since you started</p>
            </Card>

            <Card className="hover-lift">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Tracking Days</span>
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <p className="text-3xl font-bold text-gray-900">{measurements.length}</p>
                <span className="text-sm text-gray-600">entries</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Last: {latestMeasurement && formatDate(latestMeasurement.date)}
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Charts and Progress */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weight Chart */}
          <Card className="lg:col-span-2 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Weight Progress</h2>
              <div className="flex space-x-2">
                {(['week', 'month', 'year'] as const).map((timeframe) => (
                  <button
                    key={timeframe}
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      selectedTimeframe === timeframe
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Simple SVG Line Chart */}
            <div className="relative h-64">
              <svg className="w-full h-full" viewBox="0 0 800 250">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={i}
                    x1="50"
                    y1={40 + i * 50}
                    x2="750"
                    y2={40 + i * 50}
                    stroke="#f0f0f0"
                    strokeWidth="1"
                  />
                ))}

                {/* Y-axis labels */}
                {[0, 1, 2, 3, 4].map((i) => {
                  const value = maxWeight - ((maxWeight - minWeight) / 4) * i;
                  return (
                    <text
                      key={i}
                      x="30"
                      y={45 + i * 50}
                      fill="#6b7280"
                      fontSize="12"
                      textAnchor="end"
                    >
                      {value.toFixed(1)}
                    </text>
                  );
                })}

                {/* Line chart */}
                <polyline
                  points={chartData
                    .map((d, i) => {
                      const x = 50 + (i * 700) / (chartData.length - 1 || 1);
                      const y =
                        240 - ((d.weight - minWeight) / (maxWeight - minWeight)) * 200;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  className="animate-draw-line"
                />

                {/* Data points */}
                {chartData.map((d, i) => {
                  const x = 50 + (i * 700) / (chartData.length - 1 || 1);
                  const y = 240 - ((d.weight - minWeight) / (maxWeight - minWeight)) * 200;
                  return (
                    <g key={i}>
                      <circle
                        cx={x}
                        cy={y}
                        r="6"
                        fill="#3b82f6"
                        className="animate-fade-in"
                        style={{ animationDelay: `${i * 200}ms` }}
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r="3"
                        fill="white"
                        className="animate-fade-in"
                        style={{ animationDelay: `${i * 200}ms` }}
                      />
                    </g>
                  );
                })}

                {/* X-axis labels */}
                {chartData.map((d, i) => {
                  const x = 50 + (i * 700) / (chartData.length - 1 || 1);
                  return (
                    <text
                      key={i}
                      x={x}
                      y="260"
                      fill="#6b7280"
                      fontSize="10"
                      textAnchor="middle"
                    >
                      {d.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </text>
                  );
                })}
              </svg>
            </div>
          </Card>

          {/* Body Measurements */}
          <Card className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Body Measurements</h2>
            <div className="space-y-4">
              {[
                { label: 'Chest', value: latestMeasurement?.chest, unit: 'cm', color: 'blue' },
                { label: 'Waist', value: latestMeasurement?.waist, unit: 'cm', color: 'purple' },
                { label: 'Hips', value: latestMeasurement?.hips, unit: 'cm', color: 'pink' },
                { label: 'Arms', value: latestMeasurement?.arms, unit: 'cm', color: 'green' },
                { label: 'Thighs', value: latestMeasurement?.thighs, unit: 'cm', color: 'orange' },
              ].map((measurement) => (
                <div key={measurement.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 bg-${measurement.color}-500 rounded-full`} />
                    <span className="text-sm font-medium text-gray-700">{measurement.label}</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {measurement.value || '-'} {measurement.value ? measurement.unit : ''}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Camera className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium text-gray-900">Progress Photos</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Take photos to track visual changes
              </p>
              <Button variant="secondary" className="w-full">
                <Camera className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
            </div>
          </Card>
        </div>

        {/* Measurement History */}
        <Card className="mt-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Measurement History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Weight</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Body Fat
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Chest</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Waist</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Hips</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Change</th>
                </tr>
              </thead>
              <tbody>
                {measurements.map((measurement, index) => {
                  const prevMeasurement = measurements[index + 1];
                  const change = prevMeasurement
                    ? measurement.weight - prevMeasurement.weight
                    : 0;

                  return (
                    <tr
                      key={measurement.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {formatDate(measurement.date)}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {measurement.weight} kg
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {measurement.bodyFat ? `${measurement.bodyFat}%` : '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {measurement.chest ? `${measurement.chest} cm` : '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {measurement.waist ? `${measurement.waist} cm` : '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {measurement.hips ? `${measurement.hips} cm` : '-'}
                      </td>
                      <td className="py-3 px-4">
                        {prevMeasurement && (
                          <Badge variant={change < 0 ? 'success' : change > 0 ? 'danger' : 'secondary'}>
                            {change > 0 ? '+' : ''}
                            {change.toFixed(1)} kg
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Add Measurement Modal */}
      <Modal
        isOpen={isAddMeasurementOpen}
        onClose={() => setIsAddMeasurementOpen(false)}
        title="Log Body Measurement"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (kg) *
              </label>
              <Input
                type="number"
                step="0.1"
                placeholder="0.0"
                value={newMeasurement.weight || ''}
                onChange={(e) =>
                  setNewMeasurement({ ...newMeasurement, weight: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Body Fat (%)
              </label>
              <Input
                type="number"
                step="0.1"
                placeholder="0.0"
                value={newMeasurement.bodyFat || ''}
                onChange={(e) =>
                  setNewMeasurement({
                    ...newMeasurement,
                    bodyFat: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chest (cm)</label>
              <Input
                type="number"
                step="0.1"
                placeholder="0.0"
                value={newMeasurement.chest || ''}
                onChange={(e) =>
                  setNewMeasurement({ ...newMeasurement, chest: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Waist (cm)</label>
              <Input
                type="number"
                step="0.1"
                placeholder="0.0"
                value={newMeasurement.waist || ''}
                onChange={(e) =>
                  setNewMeasurement({ ...newMeasurement, waist: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hips (cm)</label>
              <Input
                type="number"
                step="0.1"
                placeholder="0.0"
                value={newMeasurement.hips || ''}
                onChange={(e) =>
                  setNewMeasurement({ ...newMeasurement, hips: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Arms (cm)</label>
              <Input
                type="number"
                step="0.1"
                placeholder="0.0"
                value={newMeasurement.arms || ''}
                onChange={(e) =>
                  setNewMeasurement({ ...newMeasurement, arms: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thighs (cm)</label>
              <Input
                type="number"
                step="0.1"
                placeholder="0.0"
                value={newMeasurement.thighs || ''}
                onChange={(e) =>
                  setNewMeasurement({ ...newMeasurement, thighs: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsAddMeasurementOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddMeasurement}
              disabled={!newMeasurement.weight || newMeasurement.weight === 0}
            >
              Save Measurement
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProgressPage;
