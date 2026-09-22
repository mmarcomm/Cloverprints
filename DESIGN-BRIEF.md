# Brief de design — Cloverprints

Documento para colar num assistente de design (Claude Design ou equivalente).
Tudo abaixo foi extraído do código real, não de memória. Onde há incerteza,
está assinalada.

---

## 1. O que te peço

És diretor de arte a fazer uma auditoria e proposta para um site que **já
existe e já está online**. Não estás a desenhar do zero: estás a decidir o que
manter, o que corrigir e o que elevar.

O site funciona e é coerente. O problema não é feiura — é que foi construído
por acumulação, e há decisões que nunca foram tomadas conscientemente. Quero
que as tomes, ou que me digas porque não devem ser mexidas.

**Antes de propores seja o que for, lê a secção 8.** Há decisões já fechadas
que não quero reabrir, e problemas conhecidos que não precisas de descobrir.

---

## 2. O negócio

**Cloverprints** — estúdio criativo em Faro, Algarve. Fundado em 2023.
Intencionalmente pequeno: poucos clientes de cada vez.

Faz três coisas, e a página "Sobre" agora anuncia-as assim:

| Registo | O que é |
|---|---|
| **Branding** | Identidade visual, editorial, ilustração, consultoria de marca |
| **Produtos** | T-shirts de edição limitada com ilustração de autor, loja própria |
| **Fotografia** | Eventos, casamentos, retrato — série de rua de autor |

Assinatura da marca: **"Impressos com proveniência"** / *"Prints with
provenance"*. A ideia central é **autoria**: cada objeto tem autor, data e
intenção, ao contrário da produção em série anónima.

Trabalho de impacto social é parte deliberada do estúdio — o projeto **Lugar
Seguro** (seis murais para a CPCJ de Olhão) é o exemplo mais completo.

**Público:** clientes de branding em Portugal (pequenas empresas que valorizam
ofício), e compradores de peças de edição limitada. Tom desejado:
**profissional e sóbrio**, sem publicidade fácil. Isto foi pedido
explicitamente e já foi aplicado às páginas de apoio.

**Língua:** pt-PT em todo o lado. Inglês está planeado mas não existe.

---

## 3. Realidade técnica — restrições duras

Isto não é negociável e limita o que podes propor.

| | |
|---|---|
| Stack | HTML + CSS + JS puros. **Sem framework.** |
| Build | **Nenhum.** Sem `package.json`, sem `node_modules`, sem bundler, sem pré-processador. Os ficheiros são servidos como estão. |
| CSS | Ficheiros à mão. `styles.css` global + um por página em `/css/`. Sem Sass, sem Tailwind, sem CSS-in-JS. |
| Alojamento | GitHub Pages, domínio próprio `cloverprints.com`. Deploy em ~90s por push a `main`. |
| Fontes | **Adobe Typekit** (`use.typekit.net`, kits `uhg8sos` e `yiz2qnq`). Halyard Text. Google Fonts não é usado. |
| Checkout | **Snipcart** — a interface de carrinho e checkout é deles. Só se pode temar dentro do que o Snipcart permite. |
| Formulário | Formspree, num `<form>` inline no `about.html` sob `#conectar`. |
| Partials | `header.html`, `footer.html` e `form.html` são **injetados em runtime** por `fetch()` no `main.js`. Não existem no DOM inicial. |

**Consequência prática:** qualquer coisa que proponhas tem de ser escrita à mão
em CSS puro, sem tokens compilados, sem variantes geradas, sem utilitários.
Uma proposta que assuma um design system compilado é inútil aqui.

---

## 4. Tokens atuais — verbatim de `styles.css`

```css
:root {
    --st: #00BFFF;   /* Primary color   */
    --se: #00BFFF;   /* Secondary color */
    --th: #5ed7ff;   /* Accent color    */
    --fo: #212427;   /* black           */
    --fi: #f4f4f4;   /* white           */
    --si: #fdfdfd;   /* off-white       */
}
```

Os comentários estão errados: `--fi` é cinzento claro, não branco; `--st` e
`--se` são a mesma cor com nomes diferentes. **Isto é sintomático** — é uma
paleta que nunca foi nomeada com intenção.

**Cinzentos usados fora dos tokens** (literais espalhados pelo CSS):

```
#374151   corpo de texto        10.13:1 sobre --si   AA ✓
#4b5563   lead                   7.43:1              AA ✓
#6b7280   corpo de card          4.83:1              AA ✓
#9ca3af   etiquetas, notas       2.50:1              AA ✗
#d1d5db   bordas de input
#e5e7eb   réguas e divisores
#f0f0f0   bordas de card
```

**Contraste do cyan:**

```
#00BFFF sobre branco   2.12:1   falha AA normal (4.5) e AA grande (3.0)
#5ed7ff sobre branco   1.66:1   falha
```

---

## 5. Escala tipográfica atual

Documentada no cabeçalho de `css/legal-pages.css` e verificada no código:

| Papel | Tamanho | Peso | Entrelinha | Cor |
|---|---|---|---|---|
| Banner heading | `clamp(2.5rem, 8vw, 4.5rem)` | 300 | 1.08 | `#fff` |
| Banner heading (legal) | `clamp(2rem, 5vw, 3.25rem)` | 300 | — | `#fff` |
| Banner eyebrow | `0.6875rem` | 500 | — | `rgba(255,255,255,0.45)`, `0.18em` |
| Banner sub | `1rem` | 300 | 1.65 | `rgba(255,255,255,0.55)` |
| Section title | `clamp(1.75rem, 4vw, 2.75rem)` | 300 | 1.12 | `#212427` |
| Section title (legal) | `clamp(1.5rem, 3.2vw, 2rem)` | 300 | 1.15 | `#212427` |
| Section eyebrow | `0.6875rem` | 600 | — | `var(--se)`, `0.16em`, maiúsculas |
| Lead | `1.0625rem` | — | 1.7 | `#4b5563` |
| Corpo | `0.9375rem` | — | 1.85 | `#374151` |
| Card tag | `0.625rem` | 500 | — | `#9ca3af`, `0.12em` |
| Card body | `0.875rem` | — | 1.75 | `#6b7280` |
| Nota | `0.8125rem` | — | 1.7 | `#9ca3af` |

Pesos em uso: **200, 300, 400, 500, 600**. O 200 aparece só em dois sítios.

Medida de leitura: `max-width: 52rem` nas páginas legais (~75 caracteres).
Containers gerais: `max-width: 80rem`. Goteiras: `1.5rem`.

---

## 6. Inventário de componentes

Todos existem e estão em uso. Não inventes nomes novos sem justificação.

**Cabeçalhos de página**
- `.banner` — bloco escuro `#212427`, texto alinhado à esquerda
- `.banner--legal` — variante com heading mais pequeno (títulos de política são longos)
- `.banner--photo` — variante com fotografia + `.banner__media` + `.banner__scrim` (gradiente duplo: escuro à esquerda onde assenta o texto)
- `.home-hero` — hero de altura total só na página inicial, `min-height: 88vh`

**Cabeçalhos de secção**
- `.section-header` / `.home-head-row` — flex baseline, régua por baixo, título + badge + link opcional
- `.legal-section__head` — eyebrow numerado (`01 — Âmbito`) + título, régua por baixo

**Listas e dados**
- `.legal-list` — marcador em travessão `—`
- `.legal-list--numbered` — contador `decimal-leading-zero` em cyan
- `.legal-grid` / `.legal-item` — cartões brancos, borda `#f0f0f0`, raio `0.75rem`
- `.legal-facts` / `.legal-fact` — pares etiqueta/valor
- `.legal-table` — grelha de 4 colunas que colapsa em linhas etiquetadas no telemóvel
- `.legal-contact` — bloco de contacto sobre `var(--fi)`

**Interativos**
- `.faq-item` — `<details>`/`<summary>` nativo, marcador `+`/`−` próprio
- `.home-btn` / `.banner-btn` — pílulas `border-radius: 2rem`, variantes `--primary` (branco) e `--ghost` (contorno)
- `.legal-nav` — navegação cruzada no fim das páginas de apoio
- `.product-nav` — anterior/seguinte nas páginas de produto

**Cartões**
- `.proj-card` — visual com `aspect-ratio: 4/3`, ano sobreposto, scrim por baixo
- `.product-card` — cartão de produto na grelha da loja
- `.home-pillar` — cartão com borda cyan à esquerda
- `.studio-service` — cartão de serviço numerado
- `.event-item` — grelha de 3 colunas (data / conteúdo / badge)

---

## 7. Inventário de páginas

| Página | Trabalho que faz |
|---|---|
| `index.html` | Hero com foto, produtos em destaque, projetos, pilares, valores, contacto |
| `store.html` | Grelha de produtos, alimentada por `products.json` |
| `product-*.html` (3) | Galeria, tamanhos, cores, acordeão de detalhes, add-to-cart Snipcart |
| `projects.html` | Projeto em destaque, todos os projetos, fotografia, eventos |
| `lugar-seguro.html` | Caso de estudo — murais CPCJ |
| `nuno-santos-landscaping.html` | Caso de estudo — identidade + site |
| `about.html` | Banner CTA, história, valores, 5 serviços, pessoa, formulário |
| `faq.html` | 6 secções numeradas, acordeão |
| `privacy` `terms` `returns` `shipping` | Políticas, secções numeradas |
| `404.html` | Erro, construída sobre o sistema das páginas de apoio |

---

## 8. Decisões já tomadas e problemas conhecidos

### Fechado — não reabrir

- **O cyan `#00BFFF` fica como está.** Foi-lhe apresentada uma variante mais
  escura (`#007AA3`, 4.79:1, mesmo matiz e saturação) e a resposta foi que
  gosta do azul atual. Falha AA como cor de texto e isso é sabido e aceite.
  **Não voltes a propor mudar a cor da marca.** Podes propor onde ela é usada.
- **Sem build step.** Não proponhas Sass, Tailwind, tokens compilados.
- **pt-PT apenas**, por agora. Inglês está no plano, sem data.
- **Tipografia Halyard Text** via Typekit.

### Problemas reais já identificados (não precisas de os encontrar)

- **Breakpoints incoerentes.** Em uso: 480, 540, 560, 640, 700, 768, 800, 900,
  1024, 1400, 1401 — misturando `min-width` e `max-width`. Nunca houve escala.
- **Raios incoerentes.** Em uso: `0.4rem`, `0.5rem`, `0.75rem`, `1rem`, `2rem`,
  `4px`, `8px`, `10px`, `25px`, `999px`, `50%`. Mistura rem e px.
- **Sombras incoerentes.** Oito valores distintos, sem escala.
- **`#9ca3af` a 2.50:1** — cinzento de etiquetas e notas, falha AA. Ao
  contrário do cyan, **este está aberto a mudança**.
- **`css/product.css` tem dois layouts sobrepostos** — sete seletores
  redefinidos mais abaixo no mesmo ficheiro, o segundo a ganhar em silêncio.
- **Sem estados de foco consistentes.** Alguns componentes têm
  `:focus-visible`, outros nada.
- **Duas fontes de verdade para o mesmo componente** — `.section-header`
  (global) e `.home-head-row` (home) são visualmente idênticos.

### Placeholders — não os trates como decisões de design

- **Identidade legal inventada** nas páginas de política (NIF, morada, nome).
- **Fotografias de produto** — os três produtos partilham as mesmas imagens.
- **Retrato em `about.html`** — quadrado cinzento a dizer "Foto".
- **Banner do `projects.html`** — imagem de arquivo, explicitamente provisória.

### Ativo do qual se pode tirar mais partido

O estúdio tem uma **série fotográfica de rua própria** (`Website_Imgs/1.jpg` a
`10.jpg`): uma cadeira vermelha encostada a um muro, um horário de autocarros
rasgado numa paragem, ervas a nascer em fendas de passeio, um marco de
incêndio enferrujado, paredes a desfazer-se. Sul de Portugal, olhar
consistente, e é obra de autor — o que a torna coerente com a ideia de
proveniência em vez de a contradizer com banco de imagens.

Três destas já são usadas como fundo de banner. **Há mais partido a tirar
daqui do que está a ser tirado.**

---

## 9. O que quero de ti

Por esta ordem:

**A. Diagnóstico.** O que está a funcionar e porquê. O que não está. Sê
específico: nomeia componentes e ficheiros, não impressões gerais.

**B. Sistema.** Propõe escalas explícitas para o que hoje é acidental:
- escala de espaçamento (hoje não existe)
- escala de raios (hoje são onze valores)
- escala de sombras (hoje são oito)
- conjunto de breakpoints (hoje são onze)
- nomes de tokens que digam o que a cor faz, não a ordem por que foi escrita

Dá-me valores concretos em CSS puro, prontos a colar num `:root`.

**C. Hierarquia.** A escala tipográfica atual é razoável mas nunca foi
auditada. Confirma-a ou substitui-a, e mostra a razão em termos de rácio.

**D. Três direções visuais.** Não variações da mesma ideia — três leituras
diferentes do que uma marca com esta assinatura pode parecer. Para cada uma:
paleta, tratamento tipográfico, princípio de layout, e o que **perde** face às
outras. Diz qual recomendas.

**E. Onde o cyan deve viver.** Fica como está, mas hoje é usado para tudo:
texto, bordas, contornos de foco, fundos, numeração. Uma cor que faz tudo não
significa nada. Diz-me onde deve aparecer e onde não deve.

**F. Aproveitamento da fotografia.** Como é que a série de rua entra no sistema
de forma sistemática, e não só como fundo ocasional de banner.

---

## 10. Regras

- **Escreve CSS puro**, com valores reais. Nada de pseudo-código.
- **Reutiliza os nomes de classe existentes** onde o componente já existe.
  Nomes novos só com justificação.
- **Toda a cópia em pt-PT**, registo profissional e sóbrio. Nada de linguagem
  de campanha.
- **Nada de tendências genéricas** — sem gradientes roxo-azul, sem cartões com
  barra de acento, sem emoji como marcadores de secção, sem cream `#F4F1EA` com
  serifa display e acento terracota.
- **Assume telemóvel primeiro.** A maior parte do tráfego é Android, e o site
  já teve bugs de layout que só aparecem com o tamanho de letra do sistema
  aumentado — testa mentalmente a 360px com texto a 130%.
- **`@media (hover: hover)`** em todos os `:hover`. Já houve o bug de estados
  presos depois do toque.
- **Não proponhas nada que exija JavaScript novo** sem dizer explicitamente que
  o exige e porquê.

---

## 11. Como responder

Começa pelo diagnóstico em prosa — o que vês, sem lista. Depois as escalas em
blocos de CSS. Depois as três direções, cada uma com um exemplo aplicado a um
componente real desta lista (sugiro o `.legal-section__head` ou o `.proj-card`,
que são os que mais se repetem).

Termina com o que farias primeiro se só pudesses mudar três coisas.

Se alguma coisa neste brief te parecer errada ou contraditória, diz. Foi
escrito a partir do código, mas o código também tem enganos.
