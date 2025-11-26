import React from 'react';
import { AnalysisResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Search } from 'lucide-react';

interface AnalysisResultViewProps {
  result: AnalysisResult;
  imagePreview: string;
}

const COLORS = ['#ef4444', '#3b82f6']; // Red for AI, Blue for Human

const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({ result, imagePreview }) => {
  const chartData = [
    { name: 'AI Probability', value: result.aiLikelihood },
    { name: 'Human Probability', value: result.humanLikelihood },
  ];

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'LIKELY_AI': return 'text-red-500';
      case 'LIKELY_HUMAN': return 'text-blue-500';
      default: return 'text-yellow-500';
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'LIKELY_AI': return <ShieldAlert className="w-12 h-12 text-red-500" />;
      case 'LIKELY_HUMAN': return <ShieldCheck className="w-12 h-12 text-blue-500" />;
      default: return <AlertTriangle className="w-12 h-12 text-yellow-500" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      {/* Left Column: Image & Verdict Card */}
      <div className="space-y-6">
        <div className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-800">
           <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white border border-white/10">
              Source Image
           </div>
           <img 
             src={imagePreview} 
             alt="Analyzed content" 
             className="w-full h-auto object-cover max-h-[500px]"
           />
           {/* Overlay showing verdict badge */}
           <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-6 pt-20">
              <div className="flex items-center gap-4">
                {getVerdictIcon(result.verdict)}
                <div>
                  <p className="text-slate-300 text-sm font-medium uppercase tracking-widest">Detection Result</p>
                  <h2 className={`text-3xl font-bold ${getVerdictColor(result.verdict)}`}>
                    {result.verdict.replace('_', ' ')}
                  </h2>
                </div>
              </div>
           </div>
        </div>

        {/* Confidence Card */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
           <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
             <Search className="w-5 h-5 text-blue-400" />
             Confidence Analysis
           </h3>
           <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={chartData}
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={80}
                   fill="#8884d8"
                   paddingAngle={5}
                   dataKey="value"
                   stroke="none"
                 >
                   {chartData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                 />
                 <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-white text-2xl font-bold">
                    {result.aiLikelihood}%
                 </text>
                 <text x="50%" y="62%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-400 text-xs font-medium uppercase tracking-wider">
                    AI Score
                 </text>
               </PieChart>
             </ResponsiveContainer>
           </div>
           <div className="flex justify-center gap-8 mt-2">
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-red-500"></div>
               <span className="text-sm text-slate-300">AI Generated</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-blue-500"></div>
               <span className="text-sm text-slate-300">Human Made</span>
             </div>
           </div>
        </div>
      </div>

      {/* Right Column: Detailed Analysis */}
      <div className="space-y-6">
        {/* Analysis Text */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Detailed Analysis</h3>
          <p className="text-slate-300 leading-relaxed">
            {result.analysis}
          </p>
        </div>

        {/* Key Indicators */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Key Visual Indicators</h3>
          <div className="space-y-3">
            {result.indicators.map((indicator, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                {result.verdict === 'LIKELY_AI' ? (
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                ) : (
                   <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                )}
                <span className="text-slate-300 text-sm">{indicator}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Breakdown */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Technical Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
               <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Lighting</span>
               <p className="text-sm text-slate-200">{result.technicalDetails.lighting}</p>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
               <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Texture</span>
               <p className="text-sm text-slate-200">{result.technicalDetails.texture}</p>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
               <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Composition</span>
               <p className="text-sm text-slate-200">{result.technicalDetails.composition}</p>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
               <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Artifacts</span>
               <p className="text-sm text-slate-200">{result.technicalDetails.artifacts}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResultView;
