# ⚡ MCP OS [DEMO] — Liquid Glass Web OS Dashboard

> **Interactive Portfolio Demonstration Edition**  
> Plataforma de alta fidelidade e performance para organização centralizada de marcadores, telemetria e atalhos operacionais com design **Apple Liquid Glassmorphism**, 34 Shaders WebGL procedurais e sincronização Supabase Realtime.
> 
> 🌐 **Live Demo Oficial**: [https://mcpos-demo.vercel.app](https://mcpos-demo.vercel.app)  
> 🔗 **Espelho Alternativo**: [https://m-c-p-os-demo.vercel.app](https://m-c-p-os-demo.vercel.app)

---

## 🌟 Visão Geral

O **MCP OS** é um painel operacional web desenvolvido sob medida para máxima produtividade, foco e estética visual premium. Esta versão de **Demonstração (DEMO)** foi construída especificamente para exibição de portfólio de engenharia de software, apresentando uma experiência de abertura fluida e animações de cascata cinematográficas.

### 💎 Principais Funcionalidades da Demonstração

1. **Abertura Suave & Revelação Animada (Demo Boot Experience)**:
   - Tela base imersiva com frosted glass badge e barra de inicialização ultra suave.
   - Transição coreografada em cascata para sidebar de widgets, dock de atalhos e cartões de aplicação.
2. **Interface Apple Liquid Glassmorphism**:
   - Efeitos multicamada de `backdrop-filter: blur`, realces especulares e sombras volumétricas a 60fps.
3. **Engine Visual com 34 Shaders WebGL**:
   - Shaders procedurais renderizados via engine leve OGL (Soft Aurora, 3D Particles, Ferrofluid, Liquid Chrome, Antigravity, Plasma Waves e muito mais).
4. **Dock Unificada com Super Atalhos & Menus Líquidos**:
   - Navegação por categorias (*Developer Tools*, *Cloud & Infrastructure*, *Discord Space*, *Privacy & Security*, *Social & Growth*).
   - Menus suspensos táteis e expansíveis para Google Ecosystem, YouTube e Central 3D.
5. **Painel Administrativo Studio**:
   - Gestão interativa de marcadores, sub-atalhos e galeria de wallpapers customizados.
   - Modo Demonstração com acesso root direto para testes imediatos sem atrito.
6. **Dados Higienizados & Privacidade**:
   - Estrutura de dados mock profissionais, preservando total sigilo e privacidade institucional.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
| :--- | :--- |
| **Interface & Apresentação** | Vanilla HTML5, CSS3 Modern Glassmorphism, CSS Custom Properties |
| **Engine Gráfica** | WebGL 2.0 com biblioteca OGL |
| **Lógica de Aplicação** | JavaScript ES2024 Modern Vanilla (zero dependências pesadas) |
| **Backend / Serverless** | Vercel Serverless Function (`/api/auth`) com mitigação anti-bruteforce |
| **Banco de Dados & Realtime** | Supabase Database & Realtime Channels (com fallback local resiliente) |

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Python 3.8+ (ou qualquer servidor HTTP estático)
- Navegador moderno com suporte a WebGL e CSS Backdrop Filter

### Passo a Passo

```bash
# 1. Clone o repositório demo
git clone https://github.com/MateusCelestinoProX/m-c-p-os-demo.git

# 2. Acesse a pasta do projeto
cd m-c-p-os-demo

# 3. Inicie o servidor local otimizado
python3 server.py
```

Acesse em seu navegador: `http://localhost:5000/index.html`

---

## 📂 Estrutura do Projeto

```
m-c-p-os-demo/
├── api/
│   └── auth.js                  # Gateway serverless de autenticação demo
├── css/
│   └── style.css                # Engine completo Liquid Glassmorphism
├── js/
│   ├── app.js                   # Orquestrador central e lógica de demo
│   ├── ogl.js                   # WebGL mini-engine
│   ├── webgl-backgrounds.js     # 34 Shaders procedurais
│   ├── media-cache-manager.js   # Cache de mídias em IndexedDB
│   └── media-compressor.js      # Otimização de backgrounds
├── images/                      # Galerias de papéis de parede categorizados
├── supabase/                    # Schemas e regras de segurança SQL
├── index.html                   # Estrutura principal do Web OS
├── server.py                    # Servidor local multithread
├── vercel.json                  # Roteamento e headers para Vercel
└── README.md                    # Documentação do projeto
```

---

## 👤 Autor

**Mateus Celestino Pro X**  
GitHub: [@MateusCelestinoProX](https://github.com/MateusCelestinoProX)
