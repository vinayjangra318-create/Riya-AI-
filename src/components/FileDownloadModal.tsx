import React, { useState } from 'react';
import { 
  Download, 
  FileCode, 
  Copy, 
  Check, 
  FolderArchive, 
  X, 
  FileText, 
  Layers, 
  ChevronRight, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { PROJECT_FILES, ProjectSourceFile } from '../data/projectFiles';
import { soundEngine } from '../utils/audio';

interface FileDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled?: boolean;
}

export const FileDownloadModal: React.FC<FileDownloadModalProps> = ({
  isOpen,
  onClose,
  soundEnabled = true,
}) => {
  const [selectedFile, setSelectedFile] = useState<ProjectSourceFile>(PROJECT_FILES[0]);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [downloadingAll, setDownloadingAll] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopyCode = (file: ProjectSourceFile) => {
    if (soundEnabled) soundEngine.playSparkleSound();
    navigator.clipboard.writeText(file.content);
    setCopiedFile(file.filename);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handleDownloadSingleFile = (file: ProjectSourceFile) => {
    if (soundEnabled) soundEngine.triggerHaptic();
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllIndividualFiles = () => {
    if (soundEnabled) soundEngine.playSparkleSound();
    setDownloadingAll(true);
    PROJECT_FILES.forEach((file, index) => {
      setTimeout(() => {
        const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        if (index === PROJECT_FILES.length - 1) {
          setDownloadingAll(false);
        }
      }, index * 250);
    });
  };

  return (
    <div
      id="file-download-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-3 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl h-[90vh] bg-[#0A0A0A] border border-[#E27A7A]/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#050505] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#E27A7A]/10 border border-[#E27A7A]/30 text-[#E27A7A]">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white flex items-center gap-2">
                <span>Riya AI Project Source Files</span>
                <span className="text-[10px] uppercase font-sans font-bold px-2 py-0.5 rounded-full bg-[#E27A7A] text-black">
                  {PROJECT_FILES.length} Files
                </span>
              </h3>
              <p className="text-[11px] text-white/50">
                Action History ki sabhi फाइल्स को 1-क्लिक में कॉपी या डाउनलोड करें
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadAllIndividualFiles}
              disabled={downloadingAll}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E27A7A] hover:bg-[#eb8c8c] text-black font-semibold text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#E27A7A]/20"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{downloadingAll ? 'Downloading...' : 'Download All Files (8)'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Two-column layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Column: File Explorer List */}
          <div className="w-full md:w-72 bg-[#080808] border-r border-white/10 p-3 overflow-y-auto shrink-0 space-y-1.5 custom-scrollbar">
            <div className="text-[10px] font-bold text-[#E27A7A] uppercase tracking-widest px-2 py-1">
              Codebase Files ({PROJECT_FILES.length})
            </div>

            {PROJECT_FILES.map((file, idx) => {
              const isSelected = selectedFile.filename === file.filename;
              return (
                <div
                  key={file.filename}
                  onClick={() => {
                    if (soundEnabled) soundEngine.triggerHaptic();
                    setSelectedFile(file);
                  }}
                  className={`p-2.5 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-[#141414] border-[#E27A7A] text-white shadow-md'
                      : 'bg-white/5 border-transparent text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#E27A7A]' : 'text-white/40'}`} />
                      <span className="font-mono text-xs font-medium truncate">{file.filename}</span>
                    </div>
                    <span className="text-[8px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-black/50 text-white/40 border border-white/5">
                      {idx + 1}
                    </span>
                  </div>
                  <div className="text-[10px] text-white/40 truncate mt-1 pl-6">
                    {file.description}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Code Viewer & Actions */}
          <div className="flex-1 bg-[#050505] flex flex-col overflow-hidden">
            {/* Viewer Toolbar */}
            <div className="px-5 py-3 bg-[#0A0A0A] border-b border-white/10 flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-white font-bold">{selectedFile.filename}</span>
                  <span className="text-[9px] uppercase tracking-widest px-2 py-0.2 rounded-full bg-white/10 text-white/70 font-mono">
                    {selectedFile.path}
                  </span>
                </div>
                <p className="text-[11px] text-[#E27A7A] font-medium mt-0.5">
                  {selectedFile.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyCode(selectedFile)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white transition-colors"
                >
                  {copiedFile === selectedFile.filename ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#E27A7A]" />
                      <span className="text-[#E27A7A] font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDownloadSingleFile(selectedFile)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E27A7A]/20 hover:bg-[#E27A7A]/30 border border-[#E27A7A]/40 text-xs text-[#E27A7A] font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .ts/.json</span>
                </button>
              </div>
            </div>

            {/* Code Body */}
            <div className="flex-1 p-4 overflow-auto custom-scrollbar font-mono text-xs text-white/90 bg-[#060606] leading-relaxed select-text">
              <pre className="whitespace-pre">{selectedFile.content}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
