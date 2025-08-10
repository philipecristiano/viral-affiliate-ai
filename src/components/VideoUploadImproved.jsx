import React, { useState, useRef } from 'react';
import { Upload, FileVideo, AlertCircle, Sparkles, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const VideoUploadImproved = ({ onUploadComplete, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoTheme, setVideoTheme] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
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

    setVideoFile(file);
  };

  const handleUpload = async () => {
    if (!videoFile) {
      setError('Selecione um vídeo primeiro.');
      return;
    }

    if (!videoTheme.trim()) {
      setError('Digite o tema do vídeo para melhor análise.');
      return;
    }

    // Upload do arquivo
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('theme', videoTheme);
    formData.append('description', videoDescription);

    try {
      setUploadProgress(0);
      setError('');
      
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
        onUploadComplete({
          ...result,
          theme: videoTheme,
          userDescription: videoDescription
        });
      }
    } catch (err) {
      setError(err.message);
      setUploadProgress(0);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Informações do Processo */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">
              Como funciona o processamento
            </h3>
            <p className="text-sm text-blue-700">
              1. Faça upload do seu vídeo e informe o tema<br/>
              2. Nossa IA analisa o conteúdo automaticamente<br/>
              3. Receba legendas, descrições otimizadas e palavras-chave<br/>
              4. Copie e use o conteúdo nas suas redes sociais
            </p>
          </div>
        </div>
      </div>

      {/* Campo de Tema */}
      <div className="space-y-2">
        <Label htmlFor="theme" className="flex items-center gap-2">
          <Target className="w-4 h-4" />
          Tema do Vídeo *
        </Label>
        <Input
          id="theme"
          placeholder="Ex: Produto de emagrecimento, Curso de marketing digital, App de investimentos..."
          value={videoTheme}
          onChange={(e) => setVideoTheme(e.target.value)}
          className="w-full"
        />
        <p className="text-xs text-gray-600">
          Informe o tema para uma análise mais precisa e conteúdo otimizado
        </p>
      </div>

      {/* Campo de Descrição Opcional */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Descrição Adicional (Opcional)
        </Label>
        <Textarea
          id="description"
          placeholder="Adicione informações extras sobre o produto, público-alvo, benefícios principais..."
          value={videoDescription}
          onChange={(e) => setVideoDescription(e.target.value)}
          className="w-full h-20 resize-none"
        />
      </div>

      {/* Área de Upload */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
          ${dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }
          ${videoFile ? 'border-green-500 bg-green-50' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/mov,video/avi,video/quicktime"
          onChange={handleChange}
          className="hidden"
        />

        {videoFile ? (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <FileVideo className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-green-700">
                Vídeo selecionado!
              </p>
              <p className="text-sm text-green-600">
                {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(1)} MB)
              </p>
            </div>
            <Button
              onClick={onButtonClick}
              variant="outline"
              size="sm"
            >
              Escolher outro vídeo
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                Arraste seu vídeo aqui
              </p>
              <p className="text-sm text-gray-500">
                ou clique para selecionar um arquivo
              </p>
            </div>
            <p className="text-xs text-gray-500">
              Formatos: MP4, MOV, AVI • Tamanho máx: 100MB
            </p>
            <Button
              onClick={onButtonClick}
              variant="outline"
              className="mt-4"
            >
              <Upload className="w-4 h-4 mr-2" />
              Selecionar Vídeo
            </Button>
          </div>
        )}

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Enviando... {uploadProgress}%
            </p>
          </div>
        )}
      </div>

      {/* Mensagem de Erro */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Botão de Processar */}
      <Button
        onClick={handleUpload}
        disabled={!videoFile || !videoTheme.trim() || isProcessing}
        className="w-full h-12 text-base"
        size="lg"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processando...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Processar Vídeo e Gerar Conteúdo
          </div>
        )}
      </Button>

      {/* Informações sobre o que será gerado */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">
          O que você receberá:
        </h4>
        <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            Legendas formatadas (.SRT)
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            Descrição otimizada
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
            Palavras-chave relevantes
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
            Dicas de postagem
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUploadImproved;

