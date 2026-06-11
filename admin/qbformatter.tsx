import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Copy, 
  Check, 
  AlertCircle, 
  ClipboardList, 
  Trash2, 
  Moon,
  Zap,
  ZapOff,
  ExternalLink,
  History,
  Info
} from 'lucide-react';

const App = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [output, setOutput] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [autoClear, setAutoClear] = useState(true);
  const [history, setHistory] = useState([]);
  const [copyStatus, setCopyStatus] = useState(null);

  const cleanHtml = (html) => {
    if (!html) return "";
    let text = html;
    text = text.replace(/<br\s*\/?>/gi, '\n');
    text = text.replace(/<\/p>/gi, '\n');
    text = text.replace(/<[^>]*>?/gm, '');
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&quot;/g, '"');
    text = text.replace(/&#39;/g, "'");
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');
    return text.trim();
  };

  const formatChapterName = (rawName) => {
    if (!rawName) return "";
    let name = cleanHtml(rawName);
    const chapterMatch = name.match(/(?:\d+)/); 
    if (chapterMatch) {
      return chapterMatch[0];
    }
    return name;
  };

  const handleConversion = (data) => {
    try {
      setError('');
      const sourceQuestions = data.questions || (Array.isArray(data) ? data : []);
      
      if (sourceQuestions.length === 0) {
        throw new Error("কোন প্রশ্ন পাওয়া যায়নি।");
      }

      const firstItem = sourceQuestions[0];
      const detectedBoard = firstItem?.source?.board || firstItem?.board || firstItem?.board_name || "Unknown";
      const detectedYear = firstItem?.source?.year || firstItem?.year || "";

      const formattedArray = sourceQuestions.map(item => {
        const chapterVal = formatChapterName(item.chapter_name || item.chapter);
        const qMap = {};
        
        if (item.questions && Array.isArray(item.questions)) {
          item.questions.forEach(q => {
            if (q.type) {
              const type = q.type.toLowerCase();
              qMap[type] = {
                q: cleanHtml(q.question),
                a: cleanHtml(q.answer)
              };
            }
          });
        }

        return {
          chapter: chapterVal,
          stimulus: cleanHtml(item.context || item.stimulus),
          case_image: "",
          q_a: qMap['a']?.q || "",
          ans_a: qMap['a']?.a || "",
          q_b: qMap['b']?.q || "",
          ans_b: qMap['b']?.a || "",
          q_c: qMap['c']?.q || "",
          ans_c: qMap['c']?.a || "",
          q_d: qMap['d']?.q || "",
          ans_d: qMap['d']?.a || ""
        };
      });

      setOutput(formattedArray);
      
      const historyItem = {
        id: Date.now(),
        board: detectedBoard + " " + detectedYear,
        data: formattedArray,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setHistory(prev => [historyItem, ...prev]);
      if (autoClear) setJsonInput('');

    } catch (err) {
      setError("ত্রুটি: " + err.message);
    }
  };

  const processText = (text) => {
    if (!text.trim()) return;
    try {
      const rawData = JSON.parse(text);
      handleConversion(rawData);
    } catch (err) {
      setError("ভুল JSON ফরম্যাট।");
    }
  };

  const handleCopy = (data, id = null) => {
    const text = JSON.stringify(data, null, 2);
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      if (id) {
        setCopyStatus(id);
        setTimeout(() => setCopyStatus(null), 1500);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('কপি ব্যর্থ হয়েছে', err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6 font-sans text-slate-200">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6 flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-800 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-900/30 rounded-lg">
              <Moon className="text-indigo-400" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-tight">QB Formatter Pro</h1>
              <p className="text-slate-500 text-xs">Clean JSON Output (Fields Optimized)</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button 
              onClick={() => window.open('https://gemini.google.com/app/57fe854382d970b0', '_blank')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold transition-all bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/20 active:scale-95 uppercase"
            >
              <ExternalLink size={14} />
              Filter
            </button>

            <button 
              onClick={() => setAutoClear(!autoClear)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold transition-all border uppercase ${
                autoClear 
                ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' 
                : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              {autoClear ? <Zap size={14} fill="currentColor" /> : <ZapOff size={14} />}
              Auto-Clear
            </button>

            <div className="flex gap-2">
              <button 
                onClick={() => processText(jsonInput)} 
                className="text-[10px] font-bold bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-all active:scale-95 shadow-lg flex items-center gap-2 uppercase"
              >
                Convert
              </button>
              <button 
                onClick={() => {setJsonInput(''); setOutput(null); setError('');}} 
                className="text-xs font-semibold bg-slate-800 text-slate-400 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </header>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-3 shadow-2xl">
            <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 flex items-center gap-2 mb-2">
              <ClipboardList size={12} className="text-indigo-400" />
              Input JSON
            </label>
            <textarea
              className="w-full h-32 p-3 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-none text-indigo-300 transition-all"
              placeholder='Paste JSON here...'
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-900/50 text-red-400 px-3 py-2 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {output && (
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
              <div className="bg-slate-800/50 px-4 py-2 flex justify-between items-center border-b border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Check size={12} className="text-green-500" /> Current Result ({output.length} items)
                </span>
                <button 
                  onClick={() => handleCopy(output)} 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-bold text-[10px] transition-all uppercase ${
                    copied ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500'
                  }`}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />} 
                  {copied ? 'Copied' : 'Copy Array'}
                </button>
              </div>
              <div className="p-3 bg-slate-950 h-32 overflow-auto custom-scrollbar">
                <pre className="text-indigo-400 text-[10px] font-mono leading-tight">
                  {JSON.stringify(output, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <div className="border-t border-slate-800 pt-6">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
              <History size={14} className="text-amber-500" />
              History
            </h2>

            {history.length === 0 ? (
              <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-xl p-6 text-center">
                <p className="text-slate-600 text-[10px] uppercase font-medium">Empty</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {history.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => handleCopy(item.data, item.id)}
                    className="inline-flex items-center bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-md px-3 py-2 cursor-pointer transition-all active:scale-[0.98] relative group min-w-max"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors leading-none mb-1">
                        {item.board}
                      </span>
                      <span className="text-[8px] font-mono text-slate-600">{item.timestamp}</span>
                    </div>
                    
                    {copyStatus === item.id && (
                      <div className="absolute inset-0 bg-indigo-600 rounded-md flex items-center justify-center animate-in fade-in duration-100 px-2">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #020617; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
      `}</style>
    </div>
  );
};

export default App;
