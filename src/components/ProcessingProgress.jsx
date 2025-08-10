import React from 'react';
import { Loader2, Check, FileVideo, Mic, Sparkles } from 'lucide-react';

const ProcessingProgress = ({ currentStep, steps }) => {
  const defaultSteps = [
    { id: 'upload', label: 'Enviando vídeo', icon: FileVideo },
    { id: 'extract', label: 'Extraindo áudio', icon: Mic },
    { id: 'transcribe', label: 'Transcrevendo áudio', icon: Mic },
    { id: 'generate', label: 'Gerando conteúdo', icon: Sparkles },
  ];

  const processSteps = steps || defaultSteps;
  const currentStepIndex = processSteps.findIndex(step => step.id === currentStep);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-center mb-6">
          Processando seu vídeo...
        </h3>
        
        <div className="space-y-4">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isPending = index > currentStepIndex;
            
            return (
              <div key={step.id} className="flex items-center gap-4">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                  ${isCompleted 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : isCurrent 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                  }
                `}>
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                
                <div className="flex-1">
                  <p className={`
                    font-medium transition-colors duration-300
                    ${isCompleted 
                      ? 'text-green-700' 
                      : isCurrent 
                        ? 'text-blue-700' 
                        : 'text-gray-500'
                    }
                  `}>
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p className="text-sm text-gray-600">
                      Em andamento...
                    </p>
                  )}
                  {isCompleted && (
                    <p className="text-sm text-green-600">
                      Concluído ✓
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Barra de progresso geral */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progresso</span>
            <span>{Math.round(((currentStepIndex + 1) / processSteps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${((currentStepIndex + 1) / processSteps.length) * 100}%` 
              }}
            />
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Isso pode levar alguns minutos dependendo do tamanho do vídeo
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProcessingProgress;

