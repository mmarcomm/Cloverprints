# TROUBLESHOOTING — Cloverprints

Playbook de deteção de erros para **este** repositório. Escrito a partir do que
está aqui, não de boas práticas genéricas.

---

## 0. O que este projeto é (e o que não é)

Descoberto por inspeção, não assumido:

| | |
|---|---|
| Stack | HTML + CSS + JS puros. **Sem framework.** |
| Gestor de pacotes | **Nenhum.** Não existe `package.json`, `package-lock.json` nem `node_modules`. |
| Scripts de build | **Nenhum.** Os ficheiros são servidos como estão. |
| Linters / formatters | **Nenhum instalado.** Sem ESLint, Stylelint, Prettier, `.editorconfig`, `browserslist`. |
| Type checking | Não aplicável — sem TypeScript. |
| Testes | **Nenhum.** Sem runner, sem ficheiros de teste. |
| CI | `.github/workflows/static.yml` — só faz deploy para GitHub Pages no push a `main`. Não corre verificação nenhuma. |
| Deploy | GitHub Pages, domínio próprio via `CNAME` (`cloverprints.com`). ~90 segundos por deploy. |

**Consequência prática:** nada trava um erro antes de chegar a produção. Todas as
verificações abaixo são manuais e correm via `npx`, sem instalar nada no repo.

### Estrutura

```
/                        páginas .html (uma por rota)
/css/                    uma folha por página + header/footer/legal-pages
/styles.css              global: paleta, reset, .section-header, product-*
/main.js                 injeta partials, renderiza a grelha, menu, carrinho
/product-detail.js       galeria, tamanhos, acordeão, add-to-cart
/products.json           fonte de dados dos produtos
/SGVs/, /Website_Imgs/   assets
```

### Duas armadilhas estruturais

**1. Os partials são injetados em runtime.** `main.js` faz `fetch()` de
`header.html`, `footer.html` e `form.html` e insere-os em placeholders. Isto
significa:

- **`file://` não funciona.** Tens de servir por HTTP ou os partials não carregam
  e metade da página não existe. Todo o teste abaixo assume um servidor local.
- O DOM do header/footer **não existe** no `DOMContentLoaded` inicial. Qualquer
  teste ou script que procure `.nav-desktop` tem de esperar.

**2. Três dependências externas por CDN:** Typekit (`use.typekit.net` — a fonte
Halyard Text), PhotoSwipe e Snipcart. Se estiverem bloqueadas, a página carrega
com fontes de fallback e **as métricas de texto mudam** — larguras diferentes,
quebras diferentes. Um teste de layout com as fontes falhadas não é conclusivo.

### Estado bilingue PT/EN — a corrigir na premissa

**O site não é bilingue hoje.** Verificado:

- 19 páginas com `<html lang="pt-PT">`
- 1 página com `lang="en"` — `ryanair-match.html`, ficheiro órfão de outro
  projeto, sem nenhuma ligação a partir do site
- Sem pasta `en/`, sem i18n, sem ficheiros de tradução, **sem uma única tag `hreflang`**

A camada 5 deste playbook está escrita para quando o EN existir. Hoje, só as
verificações de `lang` correto se aplicam.

---

## A. Comandos

Arranca sempre o servidor primeiro. Sem ele, nada disto é válido.

```bash
# Servidor local — deixa a correr numa janela à parte
cd /caminho/para/Cloverprints && python3 -m http.server 8099
# http://127.0.0.1:8099/
```

### Validação de HTML

```bash
npx --yes html-validate@latest --config .htmlvalidate.json *.html
```

Cria `.htmlvalidate.json` na raiz (ainda não existe):

```json
{
  "extends": ["html-validate:recommended", "html-validate:a11y"],
  "rules": {
    "doctype-style": "off",
    "void-style": "off",
    "no-inline-style": "warn"
  }
}
```

> **Nota sobre os partials:** `header.html`, `footer.html` e `form.html` são
> fragmentos, não documentos. O validador vai sempre queixar-se de `<title>` em
> falta e de `<html>` implicitamente fechado nesses três — **são falsos
> positivos, ignora-os.** Erros de estrutura (`close-order`, tags órfãs) nesses
> ficheiros são reais e contam.

### Validação de CSS

```bash
npx --yes stylelint@latest "styles.css" "css/*.css" --config .stylelintrc.json
```

`.stylelintrc.json` mínimo, focado em bugs e não em estilo:

```json
{
  "rules": {
    "declaration-block-no-duplicate-properties": true,
    "declaration-block-no-shorthand-property-overrides": true,
    "no-duplicate-selectors": true,
    "no-descending-specificity": true,
    "block-no-empty": true,
    "property-no-unknown": true,
    "unit-no-unknown": true,
    "function-calc-no-unspaced-operator": true
  }
}
```

As duas regras que mais valem aqui são `declaration-block-no-duplicate-properties`
(CSS que é escrito e silenciosamente ignorado) e `no-duplicate-selectors` (o mesmo
seletor definido duas vezes no mesmo ficheiro, com o segundo a ganhar sem que
ninguém repare).

### Sintaxe de JS

Não há linter configurado. O mínimo, sem instalar nada:

```bash
node --check main.js && node --check product-detail.js
```

Para ir além da sintaxe:

```bash
npx --yes eslint@latest --no-eslintrc --env browser,es2022 \
  --parser-options ecmaVersion:2022 --rule '{"no-undef":"error","no-unused-vars":"warn"}' \
  main.js product-detail.js
```

### JSON

```bash
python3 -m json.tool products.json > /dev/null && echo "products.json OK"
```

### Sitemap

```bash
xmllint --noout sitemap.xml && echo "sitemap OK"
python3 - <<'PY'
import xml.dom.minidom as m, os
for n in m.parse('sitemap.xml').getElementsByTagName('loc'):
    u = n.firstChild.data.replace('https://cloverprints.com/','') or 'index.html'
    print(('OK   ' if os.path.exists(u) else 'FALTA '), u)
PY
```

### Links internos partidos

```bash
grep -rhoE 'href="[a-z0-9._-]+\.html"' *.html | sed 's/href="//;s/"//' | sort -u |
  while read f; do [ -e "$f" ] || echo "PARTIDO -> $f"; done
```

### Acessibilidade e Lighthouse

```bash
# Lighthouse — precisa do servidor a correr
npx --yes lighthouse@latest http://127.0.0.1:8099/index.html \
  --only-categories=performance,accessibility,best-practices,seo \
  --chrome-flags="--headless --no-sandbox" --output=html --output-path=./lh-report.html

# pa11y — WCAG 2.1 AA, por página
npx --yes pa11y@latest --standard WCAG2AA http://127.0.0.1:8099/index.html
```

> `lh-report.html` não deve ser commitado. Acrescenta-o ao `.gitignore`.

### Contraste da paleta

A paleta vive em `styles.css` como custom properties (`--se`, `--fo`, `--fi`,
`--si`, `--th`). Para verificar rácios sem abrir ferramenta nenhuma:

```bash
python3 - <<'PY'
def lum(h):
    h=h.lstrip('#'); c=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    c=[(x/12.92 if x<=0.03928 else ((x+0.055)/1.055)**2.4) for x in c]
    return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]
def ratio(a,b):
    la,lb=lum(a),lum(b); return (max(la,lb)+0.05)/(min(la,lb)+0.05)
for fg,bg,nome in [("#00BFFF","#FFFFFF","cyan --se"),("#9CA3AF","#FDFDFD","cinza nota"),
                   ("#6B7280","#FFFFFF","corpo card"),("#374151","#FDFDFD","corpo")]:
    r=ratio(fg,bg); print(f"{nome:14} {r:5.2f}  {'PASSA' if r>=4.5 else 'FALHA'} AA-normal")
PY
```

### Responsividade e erros de consola (automatizado)

Chromium está pré-instalado neste ambiente em `/opt/pw-browsers`. **Nunca corras
`playwright install`.**

```bash
npm install --no-save playwright-core   # fora do repo, ex. em /tmp
```

Guarda como `scripts/audit.js` e corre com o servidor ligado. O ponto importante
é o **teste de escala de texto**: o bug real que este site já teve não aparecia
à largura por defeito — aparecia com a definição de tamanho de letra do Android
acima do normal.

```js
const { chromium } = require('playwright-core');
const PAGES  = ['index.html','store.html','faq.html','projects.html','shipping-policy.html'];
const WIDTHS = [360, 390, 430, 540, 768, 820, 1024, 1280, 1440];
const SCALES = [1.0, 1.15, 1.3];   // 1.3 ≈ Android "tamanho de letra: grande"

(async () => {
  const b = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox','--disable-dev-shm-usage']
  });
  for (const p of PAGES) {
    const page = await (await b.newContext({viewport:{width:390,height:900}})).newPage();
    page.on('pageerror', e => console.log(`  [JS] ${p}: ${e}`));
    page.on('requestfailed', r => console.log(`  [REQ] ${p}: ${r.url().slice(0,80)}`));
    await page.goto(`http://127.0.0.1:8099/${p}`, {waitUntil:'domcontentloaded'});
    await page.waitForTimeout(900);            // esperar pelos partials injetados
    for (const s of SCALES) {
      await page.addStyleTag({content:`html{font-size:${16*s}px !important}`});
      for (const w of WIDTHS) {
        await page.setViewportSize({width:w, height:900});
        await page.waitForTimeout(180);
        const o = await page.evaluate(() => {
          const d = document.documentElement, over = d.scrollWidth - d.clientWidth;
          const c = over > 0 ? [...document.querySelectorAll('body *')]
            .filter(el => el.getBoundingClientRect().right > d.clientWidth + 1)
            .map(el => el.tagName.toLowerCase()+'.'+String(el.className||'').split(/\s+/)[0])
            : [];
          return {over, c:[...new Set(c)].slice(0,3)};
        });
        if (o.over > 0) console.log(`  OVERFLOW ${p} escala ${s} ${w}px +${o.over}px ${o.c}`);
      }
    }
  }
  await b.close();
})();
```

---

## B. Checklist em cinco camadas

### 1 — Correção do código

- [ ] `html-validate` limpo (ignorando os falsos positivos dos três partials)
- [ ] Nenhuma tag órfã ou mal fechada — em especial nos partials, onde o erro só
      aparece depois da injeção e nunca no ficheiro isolado
- [ ] Sem `pageerror` na consola em nenhuma página
- [ ] **Ignora `ERR_TUNNEL_CONNECTION_FAILED` para `use.typekit.net`,
      `cdn.snipcart.com` e `cdn.jsdelivr.net` quando testares atrás de um proxy** —
      é o sandbox, não o site
- [ ] `stylelint` sem `declaration-block-no-duplicate-properties`: cada ocorrência
      é CSS escrito que nunca se aplica
- [ ] `no-duplicate-selectors` a zero, ou justificado
- [ ] Acesso a DOM protegido. `querySelectorAll(...).forEach` é seguro (devolve
      lista vazia); `getElementById(x).algo` **não é**
- [ ] `fetch()` verifica `response.ok` antes de usar o corpo — sem isso, um 404
      injeta a página de erro dentro do placeholder em vez de falhar
- [ ] Listeners ligados **depois** dos partials existirem, não antes

### 2 — Hierarquia visual e consistência

- [ ] Escala de tipos respeitada. A referência está no cabeçalho de
      `css/legal-pages.css`: eyebrow `0.6875rem/600/0.16em`, corpo
      `0.9375rem/1.85`, lead `1.0625rem/1.7`, títulos `clamp()`
- [ ] Sem `font-size` em `px` fixos para texto de leitura — usar `rem` ou `clamp()`
- [ ] **Contraste AA (4.5:1 texto normal, 3:1 texto grande).** O cyan da marca
      `#00BFFF` dá 2.12:1 sobre branco — cuidado com onde é usado
- [ ] Espaçamento por múltiplos consistentes, sem valores mágicos avulsos
- [ ] Nenhum posicionamento com `margin` em px absolutos para alinhamento vertical
- [ ] Os quatro estados de cada elemento interativo: `:hover`, `:focus-visible`,
      `:active`, `[disabled]`
- [ ] **Todo o `:hover` embrulhado em `@media (hover: hover)`** — sem isso, o
      estado fica preso depois de um toque no telemóvel
- [ ] **Nenhum `outline: none` sem substituto `:focus-visible`** — remove a
      navegação por teclado

### 3 — Responsividade

- [ ] Sem scroll horizontal em **nenhuma** largura testada. Vale `scrollWidth >
      clientWidth`, não a inspeção a olho
- [ ] Telemóvel 360 / 390 / 430 px — o 360 é o que parte
- [ ] Larguras intermédias 540 / 600 / 820 px — onde as media queries se cruzam
      e ninguém testa
- [ ] Tablet 768–1024 px, desktop 1280 px+
- [ ] **Correr tudo outra vez a escala de texto 1.15 e 1.3**
- [ ] `grid-template-columns` com mínimos em `rem` usam `minmax(min(15rem,100%),1fr)`,
      não `minmax(15rem,1fr)` — o segundo transborda quando `rem` cresce
- [ ] Grelhas de colunas fixas colapsam para uma coluna nos ecrãs pequenos
- [ ] Linhas flex que contenham um filho `white-space: nowrap` têm `flex-wrap: wrap`
- [ ] Tabelas e blocos de código dentro de um contentor com `overflow-x: auto`
- [ ] Alvos de toque ≥ 44×44 px

### 4 — Cross-browser

- [ ] Chrome, Firefox, Safari, Edge — e **Firefox e Chrome no Android tratam a
      definição de tamanho de letra do sistema de forma diferente**, que é como
      um bug de layout deste site foi descoberto
- [ ] Safari < 15.4: sem `gap` em flexbox. Se for suportado, usar margens
- [ ] `<details>`/`<summary>` (usado na FAQ) — marcador nativo difere entre
      motores; `.faq-item__q::after` já define um próprio, confirmar que o
      nativo está escondido em todos
- [ ] `clamp()`, `min()`, `max()` — seguros nos browsers atuais, sem fallback
- [ ] `@media (hover: hover)` — sem suporte, tudo se comporta como sem hover;
      degrada bem
- [ ] Testar com as webfonts **carregadas** e **falhadas** — as métricas mudam
- [ ] `-webkit-` só onde ainda é preciso (`-webkit-line-clamp`, `backdrop-filter`)

### 5 — Bilingue PT/EN

Hoje só as três primeiras se aplicam.

- [ ] `<html lang>` correto em cada página — `pt-PT` no site, e nada de `lang="en"`
      em páginas portuguesas
- [ ] Ficheiros órfãos de outro idioma não são servidos sem intenção
- [ ] Textos em atributos (`alt`, `title`, `aria-label`, `placeholder`) no idioma
      da página

Quando o EN existir:

- [ ] `hreflang` recíproco em todas as páginas, mais `x-default`
- [ ] Ambas as versões no `sitemap.xml`
- [ ] **PT é tipicamente 15–30% mais longo que EN.** Verificar botões, itens de
      menu e etiquetas com a string PT, não a EN — "Devoluções e Trocas" contra
      "Returns", "Adicionar ao Carrinho" contra "Add to Cart"
- [ ] Nenhuma largura fixa em elementos que contenham texto traduzido
- [ ] Sem strings concatenadas em JS — impossíveis de traduzir corretamente
- [ ] Datas, moeda e decimais no formato local (`45,00 €` em pt-PT)
- [ ] Nenhuma chave de tradução em falta a cair para texto cru

---

## C. Princípios em cada correção

**Reproduzir primeiro.** Sem passos de reprodução — página, largura, escala de
texto, browser — não há nada para corrigir. Um relato de que "está mal no
telemóvel" não é reprodução.

**Isolar até à unidade mais pequena que falha.** Qual o elemento exato, a que
largura exata. O script de auditoria devolve o seletor e a largura precisamente
para isto.

**Uma alteração de cada vez.** Mudar três propriedades e ver o sintoma
desaparecer não diz qual delas o resolveu — e as outras duas ficam no código
para sempre.

**Corrigir a causa, não o sintoma.** Um `overflow-x: hidden` no `body` esconde
transbordo horizontal em vez de o resolver: o conteúdo continua inacessível,
agora silenciosamente. Encontra o elemento que transborda.

**Em CSS, seguir a especificidade e a cascata.** Antes de acrescentar uma regra,
descobre porque é que a atual não ganha. Nas DevTools, os estilos riscados dizem
tudo. Neste repo há duas fontes recorrentes de surpresa:

- **Propriedades duplicadas no mesmo bloco** — a última ganha e a primeira é
  silenciosamente descartada, sem aviso do browser
- **Seletores globais em ficheiros de âmbito de página** — uma regra `a { }` em
  `css/footer.css` aplica-se ao documento inteiro, não só ao rodapé. Já
  aconteceu neste projeto: `footer.css` impunha `font-size: 18px` a todos os
  links do site

**Nunca `!important` para ganhar uma disputa de especificidade.** Corrige o
seletor.

**Re-verificar em toda a matriz.** A correção passa em 360, 390, 430, 768, 1024,
1280 — e nas escalas 1.0, 1.15 e 1.3. Uma correção que resolve o telemóvel e
parte o tablet não é uma correção.

**Testar sempre por HTTP.** Em `file://` os partials não carregam e estás a
testar meia página.

---

## D. Antes de fazer merge

```bash
python3 -m http.server 8099 &                                    # 1
npx --yes html-validate@latest --config .htmlvalidate.json *.html # 2
npx --yes stylelint@latest "styles.css" "css/*.css" --config .stylelintrc.json
node --check main.js && node --check product-detail.js            # 3
python3 -m json.tool products.json > /dev/null                    # 4
xmllint --noout sitemap.xml                                       # 5
node scripts/audit.js                                             # 6
npx --yes pa11y@latest --standard WCAG2AA http://127.0.0.1:8099/index.html
```

O CI não corre nada disto. Enquanto assim for, é uma lista manual — e o custo de
falhar é uma página partida em produção noventa segundos depois do merge.
