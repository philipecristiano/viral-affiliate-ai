# 🎯 ViralAffiliateAI - Frontend

Aplicativo web minimalista e eficaz para marketing de afiliados que processa vídeos e gera automaticamente legendas otimizadas com descrições persuasivas e palavras-chave para aumentar o engajamento e conversões.

## 🚀 Funcionalidades

- ✅ **Upload de Vídeos:** Suporte para MP4, MOV, AVI (até 100MB)
- ✅ **Campo de Tema:** Análise personalizada baseada no tema do produto
- ✅ **Link do Produto:** Integração com Shopee, Mercado Livre, Amazon, etc.
- ✅ **Geração de Conteúdo:** Descrições virais, hashtags e palavras-chave
- ✅ **Legendas Automáticas:** Download em formato .SRT
- ✅ **Autenticação:** Sistema de login com senha
- ✅ **Interface Responsiva:** Compatível com desktop e mobile

## 🛠️ Tecnologias

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **Icons:** Lucide React
- **Deploy:** Vercel
- **Backend:** Flask (hospedado separadamente)

## 🔧 Instalação Local

```bash
# Clonar repositório
git clone <repository-url>
cd viral-affiliate-frontend

# Instalar dependências
pnpm install

# Executar em desenvolvimento
pnpm run dev

# Build para produção
pnpm run build
```

## 🌐 Deploy no Vercel

1. Conecte este repositório ao Vercel
2. Configure as variáveis de ambiente se necessário
3. Deploy automático a cada push

## 📱 Como Usar

1. **Acesse a aplicação**
2. **Faça login** com a senha fornecida
3. **Informe o tema** do seu vídeo
4. **Adicione o link** do produto (opcional)
5. **Faça upload** do vídeo
6. **Clique em processar** e aguarde
7. **Copie o conteúdo** gerado para suas redes sociais

## 🎯 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/              # Componentes base (shadcn/ui)
│   ├── LoginForm.jsx    # Formulário de login
│   ├── VideoUploadFinal.jsx  # Upload de vídeo com melhorias
│   ├── ResultsPanel.jsx # Painel de resultados
│   └── ProcessingProgress.jsx # Indicador de progresso
├── App.jsx              # Componente principal
└── main.jsx            # Ponto de entrada
```

## 🔐 Autenticação

O sistema utiliza autenticação baseada em sessão com cookies. A senha padrão é configurada no backend.

## 🎨 Design System

- **Cores:** Azul primário (#3B82F6), tons de cinza
- **Tipografia:** Inter (sistema)
- **Componentes:** shadcn/ui + customizações
- **Layout:** Mobile-first, responsivo

## 📊 Funcionalidades Principais

### 🎬 Processamento de Vídeo
- Upload com drag & drop
- Validação de formato e tamanho
- Barra de progresso
- Preview do arquivo selecionado

### 🎯 Personalização
- Campo obrigatório de tema
- Descrição adicional opcional
- Link do produto com detecção de plataforma
- Análise contextual baseada nos dados

### 📝 Geração de Conteúdo
- Descrições virais otimizadas
- Hashtags específicas do nicho
- Palavras-chave para SEO
- Call-to-action direcionados
- Dicas de postagem personalizadas

### 📋 Resultados
- Interface organizada em abas
- Botões de copiar texto
- Download de legendas .SRT
- Feedback visual de ações

## 🔄 Integração com Backend

O frontend se comunica com o backend Flask através de:
- `/api/auth/*` - Autenticação
- `/api/video/*` - Processamento de vídeo
- `/api/content/*` - Geração de conteúdo

## 🎯 Próximas Melhorias

- [ ] Histórico de vídeos processados
- [ ] Templates de descrição personalizáveis
- [ ] Integração direta com redes sociais
- [ ] Analytics de performance
- [ ] Múltiplos usuários

---

**Desenvolvido com ❤️ por Manus AI**

