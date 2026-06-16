// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import WeightChart from '../components/WeightChart';
import ProgressCard from '../components/ProgressCard';
import { weightData } from '../data/weightData';
import { TrendingDown, Target, Calendar, Award } from 'lucide-react';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('week');

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          <span className="text-[#2563EB]">Peptide</span>
          <span className="text-[#10B981]">Weight</span>
          <span className="text-[#F59E0B]">Loss</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Track your progress with our advanced peptide weight loss solution
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <ProgressCard
          icon={<TrendingDown size={32} />}
          title="Total Lost"
          value="12.5 kg"
          change="📉 -2.3 kg this week"
          color="blue"
        />
        <ProgressCard
          icon={<Target size={32} />}
          title="Goal"
          value="72 kg"
          remaining="🎯 8 kg remaining"
          color="green"
        />
        <ProgressCard
          icon={<Calendar size={32} />}
          title="Estimated Time"
          value="8 weeks"
          subtext="⏱️ Until goal"
          color="yellow"
        />
        <ProgressCard
          icon={<Award size={32} />}
          title="Progress"
          value="64%"
          subtext="✨ +12% this week"
          color="blue"
        />
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <WeightChart data={weightData[timeRange]} />
        
        <div className="flex justify-center gap-3 mt-6">
          {['week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeRange === range
                  ? 'bg-[#2563EB] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range === 'week' && '📅 Week'}
              {range === 'month' && '📆 Month'}
              {range === 'year' && '📈 Year'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;