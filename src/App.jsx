import React, { useState, useEffect } from 'react';
import { Sparkles, LogOut, HelpCircle, Mail } from 'lucide-react';
import LoginForm from './components/LoginForm';
import VideoUploadFinal from './components/VideoUploadFinal';
import ResultsPanel from './components/ResultsPanel';
import ProcessingProgress from './components/ProcessingProgress';
import { Button } from '@/components/ui/button';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadResult, setUploadResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status', {
        credentials: 'include'
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setIsAuthenticated(false);
      setUploadResult(null);
      setGeneratedContent(null);
    }
  };

  const handleUploadComplete = async (result) => {
    setUploadResult(result);
    setIsProcessing(true);
    
    try {
      // Gerar todo o conteúdo automaticamente
      const contentResponse = await fetch('/api/content/generate-all', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcription: result.transcription,
          theme: result.theme,
          userDescription: result.userDescription
        }),
      });

      if (contentResponse.ok) {
        const contentData = await contentResponse.json();
        setGeneratedContent(contentData);
      } else {
        console.error('Erro ao gerar conteúdo');
      }
    } catch (error) {
      console.error('Erro no processamento:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetApp = () => {
    setUploadResult(null);
    setGeneratedContent(null);
    setIsProcessing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                ViralAffiliateAI
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <a 
                href="#como-usar" 
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                <HelpCircle className="w-4 h-4" />
                Como Usar
              </a>
              <a 
                href="#contato" 
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                <Mail className="w-4 h-4" />
                Contato
              </a>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!uploadResult ? (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Transforme seus vídeos em conteúdo viral
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Faça upload do seu vídeo de marketing de afiliados e nossa IA gerará 
              automaticamente legendas, descrições otimizadas e palavras-chave para 
              maximizar seu engajamento.
            </p>
            
            <VideoUploadFinal 
              onUploadComplete={handleUploadComplete}
              isProcessing={isProcessing}
            />
          </div>
        ) : (
          <div className="space-y-8">
            {isProcessing ? (
              <ProcessingProgress />
            ) : generatedContent ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Conteúdo Gerado com Sucesso! 🎉
                  </h2>
                  <Button onClick={resetApp} variant="outline">
                    Processar Novo Vídeo
                  </Button>
                </div>
                <ResultsPanel 
                  uploadResult={uploadResult}
                  generatedContent={generatedContent}
                />
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600">Erro ao processar o vídeo. Tente novamente.</p>
                <Button onClick={resetApp} className="mt-4">
                  Tentar Novamente
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Como funciona - sempre visível */}
        <div id="como-usar" className="mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Como funciona
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📹</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">1. Upload do Vídeo</h4>
              <p className="text-gray-600">
                Faça upload do seu vídeo de marketing de afiliados (MP4, MOV, AVI)
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">2. Processamento IA</h4>
              <p className="text-gray-600">
                Nossa IA analisa o conteúdo e gera legendas, descrições e palavras-chave
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">3. Conteúdo Viral</h4>
              <p className="text-gray-600">
                Copie e use o conteúdo otimizado para maximizar seu engajamento
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2025 ViralAffiliateAI. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

