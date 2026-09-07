# Stock Segurança

Landing page institucional da **Stock Segurança**, empresa de segurança eletrônica
(CFTV, controle de acesso, alarme, cerca elétrica, motorização de portões, fechaduras
digitais, vídeo porteiro e concertina) atuando em **Americana/SP e região** (Santa
Bárbara d'Oeste, Nova Odessa, Sumaré e Piracicaba).

Site estático, sem framework, feito pra carregar rápido em qualquer hospedagem — com
um "sistema de identidade visual" próprio inspirado no universo de monitoramento/CFTV
(feeds de câmera, crachá de acesso, radar de área de cobertura) em vez do visual
genérico de "SaaS dark mode".

## Índice

- [Stack](#stack)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Como rodar localmente](#como-rodar-localmente)
- [Seções do site](#seções-do-site)
- [Pipeline de otimização de assets](#pipeline-de-otimização-de-assets)
- [Qualidade — Lighthouse](#qualidade--lighthouse)
- [Deploy](#deploy)
- [Créditos](#créditos)
- [Licença](#licença)

## Stack

O site em produção é **100% HTML/CSS/JS puro**, sem build step e sem dependência de
runtime — qualquer servidor de arquivos estáticos serve o projeto.

| Camada | Tecnologia |
|---|---|
| Marcação | HTML5 semântico |
| Estilo | CSS3 (custom properties, Grid/Flexbox, sem framework/preprocessador) |
| Interatividade | JavaScript vanilla (sem dependências de runtime) |
| Tipografia | [Big Shoulders](https://fonts.google.com/specimen/Big+Shoulders) (display), [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) (rótulos técnicos), [Manrope](https://fonts.google.com/specimen/Manrope) (corpo) — via Google Fonts |
| Sensor de radar / vídeo | `<canvas>` 2D nativo (sem lib de gráficos) |

A pasta `tools/` tem scripts **Node.js de uso interno** (não vão pro site publicado)
pra otimizar imagens/vídeos e rodar testes visuais — detalhes mais abaixo.

## Estrutura do projeto

```
.
├── index.html                  # página única do site
├── css/
│   └── style.css               # todo o CSS (tokens, componentes, responsivo)
├── js/
│   └── main.js                 # menu mobile, scroll reveal, tilt 3D, radar (canvas),
│                                # filtro de catálogo, lightbox, player de vídeo
├── assets/
│   └── optimized/
│       ├── images/             # imagens já otimizadas (WebP/PNG), usadas pelo site
│       └── video/               # vídeos recomprimidos (H.264) + posters
├── assents/                     # arquivos ORIGINAIS enviados pelo cliente (brutos,
│                                 # não usados diretamente pelo site — ficam aqui como
│                                 # fonte pra reprocessar se precisar reotimizar algo)
├── tools/                       # scripts de build/otimização (dev only, não sobe
│   │                             # pro servidor de produção)
│   ├── optimize-images.js       # gera os WebP responsivos em assets/optimized/images
│   ├── optimize-videos.js       # recomprime vídeos + gera posters
│   ├── remove-white-bg.js       # remove fundo branco de logo via chroma-key
│   ├── screenshot.js            # screenshots automatizados (Playwright) pra QA visual
│   ├── generate-charset.js      # extrai os caracteres usados no site (p/ subset de fontes)
│   ├── fetch-fonts.js           # baixa fontes do Google Fonts já subsetadas
│   ├── build-artifact.js        # empacota o site inteiro num único HTML autocontido
│   │                             # (usado só pra gerar previews de revisão)
│   └── package.json
└── site-audit-report.md         # último relatório de auditoria (Lighthouse)
```

## Como rodar localmente

O site não precisa de build. Qualquer servidor estático funciona:

```bash
# com Node instalado
npx serve .

# ou com Python
python -m http.server 8080
```

Depois é só abrir `http://localhost:8080` (ou a porta que o servidor indicar).

## Seções do site

| Seção | O que tem |
|---|---|
| **Hero** | Chamada principal com CTA de orçamento pelo WhatsApp |
| **Serviços** | Visão geral rápida das 4 categorias (CFTV, acesso, alarme/cerca, portão/fechadura) |
| **Marcas parceiras** | Intelbras, Hikvision e Nice em placas com efeito 3D + brilho no hover |
| **Perfil do responsável** | Crachá de acesso (ID badge) com efeito 3D, no lugar de uma foto genérica |
| **Trabalhos em campo** | 3 vídeos reais de instalação (não estoque) + galeria de fotos |
| **Catálogo por marca** | 17 produtos filtráveis por marca (Intelbras, Hikvision, Nice, outras) |
| **Área de atendimento** | Radar (canvas) mostrando Americana e as 4 cidades vizinhas atendidas |
| **Depoimentos** | Capturas reais de avaliações do Google (nome, nota, comentário) + nota geral |
| **CTA + rodapé** | Reforço do WhatsApp, links rápidos, crédito do desenvolvedor |

O botão de WhatsApp aparece fixo (flutuante) durante toda a navegação, além de estar no
hero e no CTA final.

## Pipeline de otimização de assets

Os scripts em `tools/` cuidam de comprimir o material bruto do cliente (fotos de
produto, vídeos de celular das instalações) antes de virar `assets/optimized/`.

```bash
cd tools
npm install               # instala sharp, ffmpeg-static e playwright localmente

node optimize-images.js   # gera os WebP responsivos (edite a lista `jobs` no arquivo
                           # pra apontar pros arquivos novos em assents/)
node optimize-videos.js   # recomprime vídeos verticais + gera posters em WebP
node remove-white-bg.js   # chroma-key pra remover fundo sólido de um logo específico
node screenshot.js        # sobe um servidor local e tira prints em mobile/tablet/desktop
```

`ffmpeg-static` baixa um binário do ffmpeg pronto — não precisa instalar nada no
sistema. Os scripts são idempotentes: rodar de novo só regenera os arquivos de saída.

## Qualidade — Lighthouse

Última auditoria (`site-audit-report.md`), mobile e desktop:

| Categoria | Mobile | Desktop |
|---|---|---|
| Performance | 86 | 94 |
| Acessibilidade | 100 | 100 |
| Boas práticas | 100 | 100 |
| SEO | 100 | 100 |

## Deploy

O projeto ainda não está publicado numa URL final — hospedagem a ser decidida (GitHub
Pages, Netlify, Vercel, ou hospedagem própria do cliente). Como é um site 100%
estático, funciona em qualquer uma dessas opções sem nenhuma configuração de servidor
além de servir a pasta raiz.

## Créditos

- **Desenvolvimento**: [Lucas Cardoso Inocêncio](https://www.linkedin.com/in/lucasc-inocencio/)
- **Cliente**: Marcelo Stock — Stock Segurança

## Licença

Projeto comissionado para uso exclusivo da Stock Segurança. Todos os direitos
reservados — não é um projeto open source.
