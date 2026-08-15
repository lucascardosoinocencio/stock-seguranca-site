# Relatório de Auditoria do Site

URL testada: http://localhost:8080

Gerado em: 2026-08-15T02:36:53.652Z

## Resumo de notas (0-100)

| Categoria | Mobile | Desktop |
|---|---|---|
| Performance | 86 | 94 |
| Acessibilidade | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |

## Principais problemas — Mobile

- **Forced reflow** — A forced reflow occurs when JavaScript queries geometric properties (such as offsetWidth) after styles have been invalidated by a change to the DOM state.
- **LCP request discovery** — [Optimize LCP](https://developer.chrome.com/docs/performance/insights/lcp-discovery) by making the LCP image discoverable from the HTML immediately, and avoiding lazy-loading.
- **Network dependency tree** — [Avoid chaining critical requests](https://developer.chrome.com/docs/performance/insights/network-dependency-tree) by reducing the length of chains, reducing the download size of resources, or deferring the download of unnecessary resources to improve page load..
- **Render-blocking requests** — Requests are blocking the page's initial render, which may delay LCP.
- **First Contentful Paint** — First Contentful Paint marks the time at which the first text or image is painted.
- **Minimize main-thread work** — Consider reducing the time spent parsing, compiling and executing JS.

## Principais problemas — Desktop

- **Avoid large layout shifts** — These are the largest layout shifts observed on the page.
- **Layout shift culprits** — Layout shifts occur when elements move absent any user interaction.
- **Forced reflow** — A forced reflow occurs when JavaScript queries geometric properties (such as offsetWidth) after styles have been invalidated by a change to the DOM state.
- **LCP request discovery** — [Optimize LCP](https://developer.chrome.com/docs/performance/insights/lcp-discovery) by making the LCP image discoverable from the HTML immediately, and avoiding lazy-loading.
- **Network dependency tree** — [Avoid chaining critical requests](https://developer.chrome.com/docs/performance/insights/network-dependency-tree) by reducing the length of chains, reducing the download size of resources, or deferring the download of unnecessary resources to improve page load..
- **Render-blocking requests** — Requests are blocking the page's initial render, which may delay LCP.

## Checklist manual de responsividade

O Lighthouse audita performance/SEO/acessibilidade, mas não substitui olhar a página de verdade. Abra o site nesses larguras (redimensionando a janela ou pelo DevTools do navegador) e confira menu, imagens, texto cortado e botões clicáveis:

- [ ] 320px
- [ ] 375px
- [ ] 768px
- [ ] 1024px
- [ ] 1280px
- [ ] 1440px
