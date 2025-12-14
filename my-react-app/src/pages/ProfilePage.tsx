import React, { useState } from 'react';
import { User, Lock, Target, Settings, Bell, Shield, LogOut } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'goals' | 'settings'>('profile');
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    age: 28,
    gender: 'male',
    height: 175,
    currentWeight: 75,
    targetWeight: 70,
    activityLevel: 'moderate',
  });

  const [goals] = useState([
    {
      id: '1',
      type: 'Weight Loss',
      target: '70 kg',
      current: '75 kg',
      deadline: '2026-03-01',
      status: 'in-progress',
    },
    {
      id: '2',
      type: 'Muscle Gain',
      target: '5 kg',
      current: '2 kg',
      deadline: '2026-06-01',
      status: 'in-progress',
    },
  ]);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReport: true,
    darkMode: false,
  });

  const handleProfileUpdate = () => {
    console.log('Profile updated:', profileData);
    // Add API call here
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'goals' as const, label: 'Goals', icon: Target },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-white pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-6 animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profileData.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{profileData.name}</h1>
              <p className="text-gray-600">{profileData.email}</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-2 animate-fade-in-up">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:bg-white/50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            <Card className="lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({ ...profileData, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <Input
                      type="number"
                      value={profileData.age}
                      onChange={(e) =>
                        setProfileData({ ...profileData, age: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={profileData.gender}
                      onChange={(e) =>
                        setProfileData({ ...profileData, gender: e.target.value })
                      }
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height (cm)
                    </label>
                    <Input
                      type="number"
                      value={profileData.height}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          height: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Weight (kg)
                    </label>
                    <Input
                      type="number"
                      value={profileData.currentWeight}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          currentWeight: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Weight (kg)
                    </label>
                    <Input
                      type="number"
                      value={profileData.targetWeight}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          targetWeight: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activity Level
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={profileData.activityLevel}
                    onChange={(e) =>
                      setProfileData({ ...profileData, activityLevel: e.target.value })
                    }
                  >
                    <option value="sedentary">Sedentary (little or no exercise)</option>
                    <option value="light">Light (exercise 1-3 days/week)</option>
                    <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                    <option value="active">Active (exercise 6-7 days/week)</option>
                    <option value="very-active">Very Active (intense exercise daily)</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="secondary">Cancel</Button>
                  <Button onClick={handleProfileUpdate}>Save Changes</Button>
                </div>
              </div>
            </Card>

            {/* Stats Card */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">BMI</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(
                      profileData.currentWeight /
                      Math.pow(profileData.height / 100, 2)
                    ).toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Normal range: 18.5 - 24.9</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Goal Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.abs(profileData.currentWeight - profileData.targetWeight).toFixed(1)} kg
                  </p>
                  <p className="text-xs text-gray-500 mt-1">to reach target weight</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Daily Calories</p>
                  <p className="text-2xl font-bold text-gray-900">2,000</p>
                  <p className="text-xs text-gray-500 mt-1">Recommended intake</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Account Security</span>
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <Button variant="secondary" className="w-full mb-2">
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button variant="danger" className="w-full">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Fitness Goals</h2>
              <Button>
                <Target className="w-5 h-5 mr-2" />
                Add New Goal
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map((goal, index) => (
                <Card
                  key={goal.id}
                  className="hover-lift animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{goal.type}</h3>
                      <p className="text-sm text-gray-600">
                        Deadline: {new Date(goal.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={
                        goal.status === 'completed'
                          ? 'success'
                          : goal.status === 'in-progress'
                          ? 'warning'
                          : 'secondary'
                      }
                    >
                      {goal.status}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Current</span>
                      <span className="text-lg font-bold text-gray-900">{goal.current}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Target</span>
                      <span className="text-lg font-bold text-blue-600">{goal.target}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Button variant="secondary" className="w-full">
                      Update Progress
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="mt-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Goal Templates</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Lose 5kg', icon: '🎯', description: 'Weight loss goal' },
                  { name: 'Run 5K', icon: '🏃', description: 'Running milestone' },
                  { name: 'Build Muscle', icon: '💪', description: 'Strength training' },
                ].map((template, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="text-3xl mb-2">{template.icon}</div>
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="animate-fade-in max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Application Settings</h2>

            <Card className="mb-6">
              <div className="flex items-center mb-4">
                <Bell className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
              </div>
              <div className="space-y-4">
                {[
                  {
                    key: 'emailNotifications',
                    label: 'Email Notifications',
                    description: 'Receive workout reminders and updates via email',
                  },
                  {
                    key: 'pushNotifications',
                    label: 'Push Notifications',
                    description: 'Get real-time notifications in your browser',
                  },
                  {
                    key: 'weeklyReport',
                    label: 'Weekly Report',
                    description: 'Receive a summary of your weekly progress',
                  },
                ].map((setting) => (
                  <div
                    key={setting.key}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{setting.label}</p>
                      <p className="text-sm text-gray-600">{setting.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings[setting.key as keyof typeof settings] as boolean}
                        onChange={(e) =>
                          setSettings({ ...settings, [setting.key]: e.target.checked })
                        }
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="mb-6">
              <div className="flex items-center mb-4">
                <Settings className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="text-lg font-bold text-gray-900">Preferences</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Dark Mode</p>
                    <p className="text-sm text-gray-600">Switch to dark theme</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.darkMode}
                      onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900 mb-2">Units</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Weight</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option>Kilograms (kg)</option>
                        <option>Pounds (lb)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Distance</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option>Kilometers (km)</option>
                        <option>Miles (mi)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center mb-4">
                <Shield className="w-5 h-5 text-red-600 mr-2" />
                <h3 className="text-lg font-bold text-gray-900">Danger Zone</h3>
              </div>
              <div className="space-y-3">
                <Button variant="secondary" className="w-full justify-start">
                  Export Data
                </Button>
                <Button variant="danger" className="w-full justify-start">
                  Delete Account
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
