import React, { useState, useCallback } from 'react';
import { Upload, FileVideo, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VideoUpload = ({ onUploadComplete, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    setError('');
    
    // Validar tipo de arquivo
    const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      setError('Formato não suportado. Use MP4, MOV ou AVI.');
      return;
    }

    // Validar tamanho (100MB)
    if (file.size > 100 * 1024 * 1024) {
      setError('Arquivo muito grande. Máximo 100MB.');
      return;
    }

    // Upload do arquivo
    const formData = new FormData();
    formData.append('video', file);

    try {
      setUploadProgress(0);
      
      const response = await fetch('/api/video/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro no upload');
      }

      const result = await response.json();
      setUploadProgress(100);
      
      if (onUploadComplete) {
        onUploadComplete(result);
      }
    } catch (err) {
      setError(err.message);
      setUploadProgress(0);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
          ${dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="video/mp4,video/mov,video/avi,video/quicktime"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />
        
        <div className="space-y-4">
          {isProcessing ? (
            <Loader2 className="w-16 h-16 mx-auto text-blue-500 animate-spin" />
          ) : (
            <FileVideo className="w-16 h-16 mx-auto text-gray-400" />
          )}
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isProcessing ? 'Processando vídeo...' : 'Arraste seu vídeo aqui'}
            </h3>
            <p className="text-gray-600 mb-4">
              ou clique para selecionar um arquivo
            </p>
            <p className="text-sm text-gray-500">
              Formatos: MP4, MOV, AVI • Tamanho máx: 100MB
            </p>
          </div>

          {!isProcessing && (
            <Button className="mt-4">
              <Upload className="w-4 h-4 mr-2" />
              Selecionar Vídeo
            </Button>
          )}
        </div>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">{uploadProgress}% enviado</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoUpload;

