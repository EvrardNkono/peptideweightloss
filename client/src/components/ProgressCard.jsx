// src/components/ProgressCard.jsx
import React from 'react';

const colorClasses = {
  blue: {
    border: 'border-l-[#2563EB]',
    icon: 'text-[#2563EB]',
  },
  green: {
    border: 'border-l-[#10B981]',
    icon: 'text-[#10B981]',
  },
  yellow: {
    border: 'border-l-[#F59E0B]',
    icon: 'text-[#F59E0B]',
  },
};

const ProgressCard = ({ icon, title, value, change, remaining, subtext, color = 'blue' }) => {
  const colors = colorClasses[color];

  return (
    <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${colors.border} transition-all hover:-translate-y-1 hover:shadow-lg`}>
      <div className={`mb-3 ${colors.icon}`}>{icon}</div>
      <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
        {title}
      </h3>
      <div className="text-3xl font-bold text-gray-800 mb-2">{value}</div>
      {change && <p className="text-sm text-gray-500">{change}</p>}
      {remaining && <p className="text-sm text-gray-500">{remaining}</p>}
      {subtext && <p className="text-sm text-gray-500">{subtext}</p>}
    </div>
  );
};

export default ProgressCard;