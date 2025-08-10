import React, { useState } from 'react';
import { Copy, Download, Edit, Check, Hash, MessageSquare, Subtitles, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ResultsPanel = ({ results, onRegenerateContent }) => {
  const [copiedItem, setCopiedItem] = useState('');
  const [editingDescription, setEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(results?.description || '');

  const copyToClipboard = async (text, itemName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(itemName);
      setTimeout(() => setCopiedItem(''), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const downloadSubtitles = () => {
    if (!results?.subtitles) return;
    
    // Converter para formato SRT
    let srtContent = '';
    results.subtitles.forEach((subtitle, index) => {
      const startTime = formatTime(subtitle.start);
      const endTime = formatTime(subtitle.end);
      srtContent += `${index + 1}\n${startTime} --> ${endTime}\n${subtitle.text}\n\n`;
    });

    const blob = new Blob([srtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'legendas.srt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
  };

  const handleDescriptionSave = () => {
    setEditingDescription(false);
    // Aqui você pode adicionar lógica para salvar a descrição editada
  };

  if (!results) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Descrição
          </TabsTrigger>
          <TabsTrigger value="subtitles" className="flex items-center gap-2">
            <Subtitles className="w-4 h-4" />
            Legendas
          </TabsTrigger>
          <TabsTrigger value="keywords" className="flex items-center gap-2">
            <Hash className="w-4 h-4" />
            Palavras-chave
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Descrição Otimizada
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingDescription(!editingDescription)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {editingDescription ? 'Cancelar' : 'Editar'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRegenerateContent?.('description')}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Regenerar
                </Button>
              </div>
            </div>

            {editingDescription ? (
              <div className="space-y-4">
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite sua descrição..."
                />
                <div className="flex gap-2">
                  <Button onClick={handleDescriptionSave}>
                    <Check className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                  <Button variant="outline" onClick={() => setEditingDescription(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-wrap">{editedDescription}</p>
                </div>
                
                {results.hashtags && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Hashtags:</h4>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-blue-800">{results.hashtags}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => copyToClipboard(`${editedDescription}\n\n${results.hashtags || ''}`, 'description')}
                    className="flex-1"
                  >
                    {copiedItem === 'description' ? (
                      <Check className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copiedItem === 'description' ? 'Copiado!' : 'Copiar Descrição'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="subtitles" className="mt-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Subtitles className="w-5 h-5" />
                Legendas
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadSubtitles}
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar .SRT
              </Button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {results.subtitles?.map((subtitle, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 font-mono min-w-[80px]">
                    {formatTime(subtitle.start)}
                  </div>
                  <div className="flex-1 text-gray-800">
                    {subtitle.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="keywords" className="mt-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Palavras-chave e Dicas
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRegenerateContent?.('keywords')}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Regenerar
              </Button>
            </div>

            <div className="space-y-6">
              {results.keywords?.palavras_chave && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Palavras-chave:</h4>
                  <div className="flex flex-wrap gap-2">
                    {results.keywords.palavras_chave.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm cursor-pointer hover:bg-blue-200 transition-colors"
                        onClick={() => copyToClipboard(keyword, `keyword-${index}`)}
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => copyToClipboard(results.keywords.palavras_chave.join(', '), 'all-keywords')}
                  >
                    {copiedItem === 'all-keywords' ? (
                      <Check className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copiedItem === 'all-keywords' ? 'Copiado!' : 'Copiar Todas'}
                  </Button>
                </div>
              )}

              {results.keywords?.dicas_postagem && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Dicas de Postagem:</h4>
                  <ul className="space-y-2">
                    {results.keywords.dicas_postagem.map((dica, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{dica}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {results.keywords?.melhor_horario && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Melhor Horário:</h4>
                  <p className="text-gray-600 bg-green-50 p-3 rounded-lg">
                    {results.keywords.melhor_horario}
                  </p>
                </div>
              )}

              {results.keywords?.tendencias && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Tendências Atuais:</h4>
                  <div className="flex flex-wrap gap-2">
                    {results.keywords.tendencias.map((tendencia, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {tendencia}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResultsPanel;

