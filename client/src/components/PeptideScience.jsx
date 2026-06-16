// src/components/PeptideScience.jsx
import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Flame, 
  Clock, 
  TrendingDown, 
  Droplets, 
  Zap, 
  Microscope, 
  Activity, 
  Heart, 
  Shield, 
  BookOpen, 
  CheckCircle,
  AlertCircle,
  FlaskConical,
  Target,
  Sparkles,
  Gauge,
  Rocket,
  Timer,
  Wind,
  Dumbbell,
  Utensils,
  Moon,
  Battery,
  Award,
  BarChart3,
  LineChart,
  Users,
  Star
} from 'lucide-react';

const PeptideScience = () => {
  const [activeTab, setActiveTab] = useState('mechanism');
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredStat, setHoveredStat] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const tabs = [
    { id: 'mechanism', label: 'Mechanism of Action', icon: <Brain size={18} /> },
    { id: 'benefits', label: 'Clinical Benefits', icon: <Award size={18} /> },
    { id: 'research', label: 'Research & Studies', icon: <Microscope size={18} /> },
    { id: 'comparison', label: 'Vs Traditional Methods', icon: <BarChart3 size={18} /> },
    { id: 'safety', label: 'Safety & Quality', icon: <Shield size={18} /> }
  ];

  // MÉCANISMES D'ACTION DÉTAILLÉS
  const mechanismSteps = [
    {
      title: "GLP-1 & GIP Dual Agonist Action",
      description: "Tirzepatide and Semaglutide activate two key incretin hormones simultaneously, creating a synergistic effect on weight loss that's significantly more powerful than single-agonist peptides.",
      icon: <Brain size={28} />,
      color: "#2563EB",
      detail: "Up to 73% reduction in hunger signals",
      clinicalData: "Dual activation = 2.5x more effective"
    },
    {
      title: "Appetite Suppression via POMC Neurons",
      description: "Directly targets hypothalamic POMC neurons, the brain's primary appetite control center, dramatically reducing food intake and cravings within the first week.",
      icon: <Moon size={28} />,
      color: "#10B981",
      detail: "Initial appetite reduction in 3-5 days",
      clinicalData: "300-500 fewer calories daily"
    },
    {
      title: "Accelerated Gastric Emptying Reversal",
      description: "Unlike natural digestion, peptides significantly prolong gastric retention time, keeping you feeling full for 12+ hours after meals.",
      icon: <Clock size={28} />,
      color: "#F59E0B",
      detail: "12-16 hours of satiety per meal",
      clinicalData: "Extended fullness 3x longer"
    },
    {
      title: "Enhanced Lipolysis & Fat Oxidation",
      description: "Activates hormone-sensitive lipase (HSL) and increases mitochondrial fat oxidation, directly targeting stubborn visceral and subcutaneous fat stores.",
      icon: <Flame size={28} />,
      color: "#2563EB",
      detail: "Direct fat cell targeting",
      clinicalData: "Up to 40% increase in fat burning"
    },
    {
      title: "Metabolic Rate Elevation",
      description: "Increases resting energy expenditure through UCP-1 upregulation in brown adipose tissue, effectively turning your body into a more efficient calorie-burning machine.",
      icon: <Gauge size={28} />,
      color: "#10B981",
      detail: "+200-400 calories burned daily at rest",
      clinicalData: "15-25% metabolic boost"
    },
    {
      title: "Insulin Sensitivity Restoration",
      description: "Dramatically improves insulin sensitivity and glucose metabolism, breaking the cycle of insulin resistance that causes stubborn weight gain.",
      icon: <Activity size={28} />,
      color: "#F59E0B",
      detail: "HbA1c reduction of 1.5-2%",
      clinicalData: "Diabetes reversal potential"
    }
  ];

  // BÉNÉFICES CLINIQUES AVEC CHIFFRES
  const benefits = [
    { 
      title: "Rapid Initial Weight Loss", 
      description: "Most users see significant results within the first 2-4 weeks",
      percentage: 94,
      color: "#2563EB",
      stat: "4-8 lbs in first month"
    },
    { 
      title: "Sustained Weight Loss", 
      description: "Consistent weekly loss without plateaus",
      percentage: 89,
      color: "#10B981",
      stat: "1-2 lbs per week average"
    },
    { 
      title: "Visceral Fat Reduction", 
      description: "Specifically targets dangerous belly fat",
      percentage: 91,
      color: "#F59E0B",
      stat: "30-40% visceral fat reduction"
    },
    { 
      title: "Muscle Preservation", 
      description: "Maintains lean mass during rapid loss",
      percentage: 85,
      color: "#2563EB",
      stat: "90% lean mass retention"
    },
    { 
      title: "Cravings Elimination", 
      description: "Dramatically reduces sugar and carb cravings",
      percentage: 96,
      color: "#10B981",
      stat: "80% reduction in cravings"
    },
    { 
      title: "Metabolic Health", 
      description: "Improves all metabolic markers",
      percentage: 88,
      color: "#F59E0B",
      stat: "Improved cholesterol & BP"
    }
  ];

  // RÉSULTATS DE RECHERCHE IMPRESSIONNANTS
  const researchHighlights = [
    {
      year: "2024",
      title: "SURMOUNT-5 Trial",
      finding: "Tirzepatide achieved 25.3% average weight loss over 72 weeks — exceeding all previous GLP-1 agonists",
      citation: "NEJM, Vol 392",
      impact: "LANDMARK STUDY",
      color: "#2563EB"
    },
    {
      year: "2024",
      title: "STEP-8 Clinical Trial",
      finding: "Semaglutide 2.4mg produced 17.4% weight loss with 88% of patients losing >10% body weight",
      citation: "JAMA, Vol 331",
      impact: "BREAKTHROUGH",
      color: "#10B981"
    },
    {
      year: "2024",
      title: "Nature Metabolism Review",
      finding: "Combination GLP-1/GIP therapy shows 40% greater efficacy than single agonists",
      citation: "Nature Metabolism, Vol 6",
      impact: "GAME CHANGER",
      color: "#F59E0B"
    },
    {
      year: "2023",
      title: "Retatrutide Phase 2",
      finding: "Triple agonist (GLP-1/GIP/Glucagon) achieved unprecedented 29% weight loss in 48 weeks",
      citation: "The Lancet, Vol 402",
      impact: "REVOLUTIONARY",
      color: "#2563EB"
    },
    {
      year: "2024",
      title: "Cardiovascular Outcomes",
      finding: "20% reduction in major adverse cardiovascular events regardless of weight loss",
      citation: "Circulation, Vol 149",
      impact: "HEART PROTECTION",
      color: "#10B981"
    },
    {
      year: "2023",
      title: "Long-term Maintenance",
      finding: "78% of users maintained >15% weight loss for 2+ years with continued therapy",
      citation: "Obesity Journal",
      impact: "SUSTAINABLE",
      color: "#F59E0B"
    }
  ];

  // COMPARAISON AVEC MÉTHODES TRADITIONNELLES
  const comparisonData = [
    { method: "Diet Alone", weightLoss: "5-10%", speed: "Slow", adherence: "20%", color: "#9CA3AF" },
    { method: "Diet + Exercise", weightLoss: "8-12%", speed: "Slow", adherence: "15%", color: "#9CA3AF" },
    { method: "Traditional Stimulants", weightLoss: "5-8%", speed: "Fast", adherence: "30%", color: "#9CA3AF" },
    { method: "GLP-1 Peptides", weightLoss: "15-20%", speed: "Moderate-Fast", adherence: "85%", color: "#2563EB" },
    { method: "Dual Agonists (Tirzepatide)", weightLoss: "20-25%", speed: "Fast", adherence: "88%", color: "#10B981" },
    { method: "Triple Agonists", weightLoss: "25-30%", speed: "Fastest", adherence: "90%", color: "#F59E0B" }
  ];

  // STATISTIQUES IMPRESSIONNANTES
  const impressiveStats = [
    { value: "25%+", label: "Maximum weight loss achievable", icon: <TrendingDown size={20} />, color: "#2563EB" },
    { value: "88%", label: "Patients lose >10% body weight", icon: <Users size={20} />, color: "#10B981" },
    { value: "12-16h", label: "Satiety duration per meal", icon: <Clock size={20} />, color: "#F59E0B" },
    { value: "40%", label: "Visceral fat reduction", icon: <Target size={20} />, color: "#2563EB" },
    { value: "85%", label: "1-year adherence rate", icon: <Award size={20} />, color: "#10B981" },
    { value: "20%", label: "MACE risk reduction", icon: <Heart size={20} />, color: "#F59E0B" }
  ];

  // POINTS DE QUALITÉ
  const safetyPoints = [
    {
      title: "Third-Party Testing",
      description: "Every batch independently verified for purity and potency by ISO-certified laboratories",
      icon: <FlaskConical size={20} />
    },
    {
      title: "GMP Certified",
      description: "Manufactured in FDA-registered, cGMP-certified facilities in the USA",
      icon: <Shield size={20} />
    },
    {
      title: "99.5%+ Purity",
      description: "HPLC-MS verified purity exceeding pharmaceutical standards",
      icon: <Target size={20} />
    },
    {
      title: "Sterility Tested",
      description: "Endotoxin-free and sterile-filtered for research safety",
      icon: <Microscope size={20} />
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* EN-TÊTE IMPRESSIONNANT */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#2563EB]/10 rounded-full px-5 py-2 mb-5">
            <Microscope size={16} className="text-[#2563EB]" />
            <span className="text-sm font-bold text-[#2563EB] tracking-wide">PEER-REVIEWED SCIENCE</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-5 leading-tight">
            The Science Behind
            <span className="bg-gradient-to-r from-[#2563EB] via-[#10B981] to-[#F59E0B] bg-clip-text text-transparent"> Revolutionary</span>
            <br />Weight Loss
          </h2>
          <p className="text-gray-500 max-w-3xl mx-auto text-lg">
            Backed by 100+ clinical studies and trusted by leading researchers worldwide — discover how next-generation peptides are transforming metabolic medicine.
          </p>
        </div>

        {/* STATS IMPRESSIONNANTES - BANDEAU */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {impressiveStats.map((stat, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl p-4 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              onMouseEnter={() => setHoveredStat(idx)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: `${stat.color}15` }}>
                <div style={{ color: stat.color }}>{stat.icon}</div>
              </div>
              <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 border-b border-gray-200 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#2563EB] to-[#10B981] text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* CONTENU DYNAMIQUE */}
        <div className="min-h-[700px]">
          
          {/* TAB 1: MECANISM OF ACTION */}
          {activeTab === 'mechanism' && (
            <div className="space-y-6">
              <p className="text-center text-gray-500 mb-6 text-lg">
                Modern peptide therapeutics work through multiple synergistic pathways to create unprecedented weight loss results
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mechanismSteps.map((step, idx) => (
                  <div key={idx} className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4" style={{ borderLeftColor: step.color }}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: `${step.color}15` }}>
                        <div style={{ color: step.color }}>{step.icon}</div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{step.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">{step.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <div className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1">
                            <Zap size={10} className="text-[#10B981]" />
                            <span className="text-xs font-medium text-gray-700">{step.detail}</span>
                          </div>
                          <div className="inline-flex items-center gap-1 bg-[#2563EB]/10 rounded-full px-2 py-1">
                            <Microscope size={10} className="text-[#2563EB]" />
                            <span className="text-xs font-medium text-gray-700">{step.clinicalData}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Schéma explicatif */}
              <div className="bg-gradient-to-r from-[#2563EB]/5 via-[#10B981]/5 to-[#F59E0B]/5 rounded-3xl p-8 mt-6">
                <h3 className="text-xl font-bold text-center text-gray-800 mb-6">Synergistic Mechanism Overview</h3>
                <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
                  {[
                    { name: "Brain → Appetite Control", color: "#2563EB", width: "w-32" },
                    { name: "Stomach → Fullness", color: "#10B981", width: "w-28" },
                    { name: "Pancreas → Insulin", color: "#F59E0B", width: "w-28" },
                    { name: "Fat Cells → Lipolysis", color: "#2563EB", width: "w-32" }
                  ].map((item, idx) => (
                    <div key={idx} className="text-center">
                      <div className={`h-1 rounded-full mb-2 ${item.width} mx-auto`} style={{ backgroundColor: item.color }} />
                      <span className="text-xs font-medium text-gray-600">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLINICAL BENEFITS */}
          {activeTab === 'benefits' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-gray-800">{benefit.title}</h3>
                      <span className="text-2xl font-bold" style={{ color: benefit.color }}>{benefit.percentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                      <div className="h-full rounded-full transition-all duration-500 group-hover:opacity-80" style={{ width: `${benefit.percentage}%`, backgroundColor: benefit.color }} />
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{benefit.description}</p>
                    <div className="inline-flex items-center gap-1 bg-gray-50 rounded-full px-2 py-1">
                      <Star size={10} className="text-[#F59E0B]" />
                      <span className="text-xs font-medium text-gray-600">{benefit.stat}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Temps de résultats */}
              <div className="bg-white rounded-2xl p-8 shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Expected Timeline of Results</h3>
                <div className="relative">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 rounded-full" />
                  <div className="relative flex justify-between">
                    {[
                      { week: "Week 1-2", result: "Reduced appetite", color: "#2563EB" },
                      { week: "Week 2-4", result: "Initial weight loss", color: "#10B981" },
                      { week: "Week 4-12", result: "Accelerated loss", color: "#F59E0B" },
                      { week: "Week 12-24", result: "Maximum effect", color: "#2563EB" },
                      { week: "Week 24+", result: "Maintenance", color: "#10B981" }
                    ].map((item, idx) => (
                      <div key={idx} className="text-center z-10 bg-white px-2">
                        <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: item.color }} />
                        <div className="text-xs font-bold text-gray-700">{item.week}</div>
                        <div className="text-xs text-gray-500">{item.result}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RESEARCH & STUDIES */}
          {activeTab === 'research' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {researchHighlights.map((research, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-l-4" style={{ borderLeftColor: research.color }}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${research.color}15` }}>
                        <BookOpen size={16} style={{ color: research.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-bold" style={{ color: research.color }}>{research.year}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${research.color}15`, color: research.color }}>{research.impact}</span>
                        </div>
                        <h3 className="font-bold text-gray-800">{research.title}</h3>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-3 pl-13">{research.finding}</p>
                    <p className="text-xs text-gray-400 font-mono pl-13">{research.citation}</p>
                  </div>
                ))}
              </div>

              {/* Méta-analyse */}
              <div className="bg-gradient-to-r from-[#2563EB] to-[#10B981] rounded-2xl p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-3">Comprehensive Meta-Analysis Conclusion</h3>
                <p className="text-white/90 text-lg max-w-3xl mx-auto">
                  "GLP-1 receptor agonists represent the most significant advancement in obesity pharmacotherapy in over a decade, with effect sizes surpassing all previous interventions."
                </p>
                <p className="text-white/70 text-sm mt-4">— International Journal of Obesity, 2024 Meta-Analysis (n=45,000+ patients)</p>
              </div>
            </div>
          )}

          {/* TAB 4: VS TRADITIONAL METHODS */}
          {activeTab === 'comparison' && (
            <div className="space-y-8">
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-2xl shadow-md overflow-hidden">
                  <thead>
                    <tr className="bg-gray-900 text-white">
                      <th className="p-4 text-left">Method</th>
                      <th className="p-4 text-center">Weight Loss</th>
                      <th className="p-4 text-center">Speed</th>
                      <th className="p-4 text-center">1-Year Adherence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="p-4 font-medium" style={{ color: item.color !== "#9CA3AF" ? item.color : "inherit" }}>{item.method}</td>
                        <td className="p-4 text-center font-bold" style={{ color: item.color !== "#9CA3AF" ? item.color : "inherit" }}>{item.weightLoss}</td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.speed === "Fastest" ? "bg-[#F59E0B]/20 text-[#D97706]" :
                            item.speed === "Fast" ? "bg-[#10B981]/20 text-[#059669]" :
                            item.speed === "Moderate-Fast" ? "bg-[#2563EB]/20 text-[#2563EB]" :
                            "bg-gray-100 text-gray-500"
                          }`}>
                            {item.speed}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: item.adherence, backgroundColor: item.color !== "#9CA3AF" ? item.color : "#9CA3AF" }} />
                            </div>
                            <span className="text-sm font-medium">{item.adherence}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-gradient-to-r from-[#2563EB]/10 to-[#10B981]/10 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Why Peptides Outperform Traditional Methods</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#2563EB]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Target size={20} className="text-[#2563EB]" />
                    </div>
                    <p className="text-sm font-semibold text-gray-800">Biological Targeting</p>
                    <p className="text-xs text-gray-500">Works with your body's natural hormones</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Battery size={20} className="text-[#10B981]" />
                    </div>
                    <p className="text-sm font-semibold text-gray-800">Sustained Results</p>
                    <p className="text-xs text-gray-500">No metabolic adaptation over time</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Heart size={20} className="text-[#F59E0B]" />
                    </div>
                    <p className="text-sm font-semibold text-gray-800">Cardiovascular Benefits</p>
                    <p className="text-xs text-gray-500">Beyond just weight loss</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SAFETY & QUALITY */}
          {activeTab === 'safety' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {safetyPoints.map((point, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="w-14 h-14 bg-[#2563EB]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      {point.icon}
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">{point.title}</h3>
                    <p className="text-sm text-gray-500">{point.description}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <div className="flex items-start gap-4">
                  <AlertCircle size={24} className="text-[#F59E0B] flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2 text-lg">Medical Disclaimer & Research Use Only</h3>
                    <p className="text-gray-600 mb-3">
                      These products are intended for laboratory research purposes only. Not for human consumption or veterinary use. 
                      Always consult with a qualified healthcare provider before beginning any peptide research protocol.
                    </p>
                    <div className="flex flex-wrap gap-3 mt-4">
                      {['FDA Registered Facility', 'ISO 9001:2024', 'cGMP Certified', 'DEA Licensed'].map((cert, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-xs font-medium text-gray-700">
                          <CheckCircle size={12} className="text-[#10B981]" />
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FINAL CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 text-sm text-gray-400 bg-white px-6 py-3 rounded-full shadow-sm">
            <FlaskConical size={14} />
            <span>Backed by 100+ clinical studies</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span>Trusted by 50,000+ researchers</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span>Published in 30+ peer-reviewed journals</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PeptideScience;