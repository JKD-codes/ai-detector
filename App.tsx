import React, { useState } from 'react';
import { AnalysisResult, AnalysisState, UploadedImage } from './types';
import { analyzeImage } from './geminiService';
import ImageUploader from './ImageUploader';
import AnalysisResultView from './AnalysisResultView';
import { ScanEye, AlertOctagon, RefreshCw, Github, Aperture, Activity, Search } from 'lucide-react';

const App: React.FC = () => {
  const [analysisState, setAnalysisState] = useState<AnalysisState>(AnalysisState.IDLE);
  const [currentImage, setCurrentImage] = useState<UploadedImage | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = async (file: File, base64: string, preview: string) => {
    setCurrentImage({ file, base64, previewUrl: preview, mimeType: file.type });
    setAnalysisState(AnalysisState.ANALYZING);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeImage(base64, file.type);
      setResult(data);
      setAnalysisState(AnalysisState.COMPLETE);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze the image. Please ensure the API key is valid or try a different image.");
      setAnalysisState(AnalysisState.ERROR);
    }
  };

  const handleReset = () => {
    setAnalysisState(AnalysisState.IDLE);
    setCurrentImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-500">
            <ScanEye className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight text-white">Veritas<span className="text-blue-500">AI</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">How it works</a>
            <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">About</a>
            <div className="h-4 w-px bg-slate-700"></div>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center">
        
        {/* Hero Section (only visible when idle) */}
        {analysisState === AnalysisState.IDLE && (
          <div className="text-center mb-12 max-w-3xl animate-fade-in-up">
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold tracking-wide uppercase">
              Powered by Gemini 2.5
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-200 tracking-tight">
              Is it Real or AI?
            </h1>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-2xl mx-auto">
              Detect deepfakes and AI-generated imagery instantly with professional-grade forensics analysis. 
              Our advanced model scans for diffusion artifacts, lighting inconsistencies, and anatomical errors.
            </p>
          </div>
        )}

        {/* Upload Section */}
        {analysisState !== AnalysisState.COMPLETE && (
           <div className="w-full">
              <ImageUploader 
                onImageSelected={handleImageSelected} 
                analysisState={analysisState} 
              />
           </div>
        )}

        {/* Sophisticated Scanning Animation */}
        {analysisState === AnalysisState.ANALYZING && currentImage && (
          <div className="mt-12 relative w-full max-w-2xl rounded-xl overflow-hidden border-2 border-slate-700 shadow-2xl mx-auto bg-slate-900 group">
             {/* Source Image - Darkened */}
             <div className="relative aspect-video w-full overflow-hidden">
                <img 
                  src={currentImage.previewUrl} 
                  className="w-full h-full object-cover opacity-30 filter grayscale contrast-125" 
                  alt="Scanning" 
                />
                
                {/* Grid Overlay */}
                <div className="absolute inset-0 scanner-grid opacity-50 z-10"></div>
                
                {/* Moving Scanner Bar */}
                <div className="scanner-bar"></div>

                {/* HUD Elements */}
                <div className="absolute inset-0 z-20 p-6 flex flex-col justify-between">
                   {/* Top HUD */}
                   <div className="flex justify-between items-start">
                      <div className="bg-slate-900/80 backdrop-blur border border-blue-500/30 p-2 rounded text-xs font-mono text-blue-400 flex items-center gap-2">
                         <Activity className="w-4 h-4 animate-pulse" />
                         SCANNING_SECTORS...
                      </div>
                      <div className="text-xs font-mono text-slate-500">
                        {new Date().toISOString().split('T')[0]} <span className="text-blue-500">REL_01</span>
                      </div>
                   </div>

                   {/* Center Reticle */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-blue-500/20 rounded-full flex items-center justify-center">
                      <div className="w-28 h-28 border border-blue-500/40 rounded-full border-dashed animate-spin-slow"></div>
                      <div className="absolute w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                   </div>

                   {/* Bottom HUD */}
                   <div className="flex justify-between items-end">
                      <div className="space-y-1">
                         <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                            <Aperture className="w-3 h-3" />
                            <span>NOISE_PATTERN_ANALYSIS</span>
                         </div>
                         <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                            <Search className="w-3 h-3" />
                            <span>DIFFUSION_ARTIFACTS</span>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="text-3xl font-bold text-blue-500 crt-flicker">PROCESSING</div>
                         <div className="text-xs font-mono text-blue-300">NEURAL_ENGINE_ACTIVE</div>
                      </div>
                   </div>
                </div>
                
                {/* Corner Brackets */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-blue-500 z-20"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-blue-500 z-20"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-blue-500 z-20"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-blue-500 z-20"></div>
             </div>
          </div>
        )}

        {/* Results Section */}
        {analysisState === AnalysisState.COMPLETE && result && currentImage && (
          <div className="w-full space-y-8">
             <div className="flex justify-between items-center max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-white">Analysis Report</h2>
                <button 
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-all border border-slate-700"
                >
                  <RefreshCw className="w-4 h-4" />
                  Analyze New Image
                </button>
             </div>
             <AnalysisResultView result={result} imagePreview={currentImage.previewUrl} />
          </div>
        )}

        {/* Error State */}
        {analysisState === AnalysisState.ERROR && (
          <div className="mt-8 p-6 bg-red-500/10 border border-red-500/20 rounded-xl max-w-md text-center">
             <AlertOctagon className="w-12 h-12 text-red-500 mx-auto mb-4" />
             <h3 className="text-xl font-bold text-red-400 mb-2">Analysis Failed</h3>
             <p className="text-red-200/80 mb-6">{error}</p>
             <button 
                onClick={handleReset}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
             >
               Try Again
             </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 mt-12 bg-[#0f172a]">
         <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Veritas AI Detector. All rights reserved.</p>
            <p className="mt-2">
              Disclaimer: AI detection is probabilistic. Results should be used as indicators, not definitive proof.
            </p>
         </div>
      </footer>
    </div>
  );
};

export default App;
