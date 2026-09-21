# Como usar o Claude Design com este projeto

Companheiro do `DESIGN-BRIEF.md`. O brief é o contexto completo; isto diz o que
fazer com ele dentro da ferramenta.

---

## 1. Primeiro: monta o Design System

O botão diz **None**. Preenche-o antes de gerares seja o que for — sem isso,
cada geração inventa uma paleta nova e nada é comparável.

### Cores

```
Primária        #00BFFF   cyan da marca — acentos, bordas, foco, fundos
Tinta           #212427   títulos, texto forte, fundos escuros
Corpo           #374151   texto de leitura
Lead            #4B5563   parágrafos de entrada
Secundário      #6B7280   texto de card
Subtil          #9CA3AF   etiquetas, notas, maiúsculas pequenas
Borda           #E5E7EB   réguas e divisores
Borda clara     #F0F0F0   contorno de cards
Fundo claro     #FDFDFD   fundo principal
Fundo cinza     #F4F4F4   secções alternadas
Branco          #FFFFFF   superfície de card
```

**Nota para pôr no campo de descrição, se existir:** o cyan `#00BFFF` dá 2.12:1
sobre branco e falha WCAG AA como cor de texto. É decisão assumida do cliente e
mantém-se. Usar preferencialmente em superfícies, bordas e acentos.

### Tipografia

A fonte real é **Halyard Text** (Adobe Typekit). Se a ferramenta não a tiver,
o substituto mais próximo é **Hanken Grotesk**, ou em alternativa **Figtree**
— humanistas geométricas, mesma temperatura. Não uses Inter nem Space Grotesk.

```
Display     clamp(2.5rem, 8vw, 4.5rem)     peso 300   entrelinha 1.08
Título 1    clamp(1.75rem, 4vw, 2.75rem)   peso 300   entrelinha 1.12
Título 2    clamp(1.5rem, 3.2vw, 2rem)     peso 300   entrelinha 1.15
Título 3    1.0625rem                      peso 500   entrelinha 1.3
Lead        1.0625rem                      peso 400   entrelinha 1.7
Corpo       0.9375rem                      peso 400   entrelinha 1.85
Card        0.875rem                       peso 400   entrelinha 1.75
Nota        0.8125rem                      peso 400   entrelinha 1.7
Eyebrow     0.6875rem                      peso 600   espaçamento 0.16em, maiúsculas
Tag         0.625rem                       peso 500   espaçamento 0.12em, maiúsculas
```

Pesos disponíveis: 300, 400, 500, 600.

### Espaçamento, raios, sombras

O site **não tem escalas destas** — os valores atuais são acidentais. Propõe
tu, mas parte destes, que são os mais repetidos:

```
Raio     0.5rem (controlos) · 0.75rem (cards) · 2rem (pílulas)
Sombra   0 1px 3px rgba(0,0,0,0.1)  ·  0 12px 32px rgba(0,0,0,0.08)
Largura  80rem (containers) · 52rem (medida de leitura) · 1.5rem (goteiras)
```

---

## 2. Que template escolher

| Objetivo | Template |
|---|---|
| Explorar paleta e tipografia | **Color + type pairing** |
| Redesenhar páginas concretas | **UI mockups** |
| Ver estrutura antes do acabamento | **Wireframe** |
| Propostas soltas, sem moldura | **Blank** |

Para o que interessa aqui, **UI mockups** é o principal. O **Color + type
pairing** vale para a primeira corrida, antes de comprometeres com layouts.

---

## 3. Os prompts, por ordem

Corre-os **separadamente**, não todos de uma vez. Anexa sempre o
`DESIGN-BRIEF.md`.

### Corrida 1 — direções visuais · template *Color + type pairing*

```
Lê o brief anexo. É um site que já existe e está online.

Dá-me TRÊS direções visuais para a Cloverprints — não três variações da mesma
ideia, três leituras diferentes do que uma marca com a assinatura "impressos
com proveniência" pode parecer.

Para cada direção:
- paleta completa, partindo do cyan #00BFFF, que é fixo e não muda
- emparelhamento tipográfico (display + texto), com pesos e espaçamento
- o princípio de layout numa frase
- o que esta direção PERDE face às outras duas

Aplica cada uma ao mesmo componente, para poderem ser comparadas: o cabeçalho
de secção das páginas de apoio — eyebrow em maiúsculas pequenas ("03 —
DEVOLUÇÕES"), título leve por baixo, régua fina a fechar.

No fim diz qual recomendas e porquê. Registo profissional e sóbrio, cópia em
português de Portugal.
```

### Corrida 2 — onde o cyan vive · template *Blank*

```
Lê o brief anexo.

O cyan #00BFFF é usado hoje para tudo: texto de links, eyebrows de secção,
numeração de listas, bordas de acento, contornos de foco e fundos cheios. Uma
cor que faz tudo deixa de significar alguma coisa.

O cyan não muda — essa decisão está fechada. O que quero é um sistema de uso:
onde deve aparecer, onde não deve, e o que ocupa o lugar dele onde sair.

Mostra-me uma folha de espécimes com os dois estados lado a lado — uso atual
contra uso proposto — nestes elementos reais: link em prosa, eyebrow de secção,
numeração de passos, borda de acento em card, anel de foco, etiqueta de fundo
cheio.

Nota: o cyan dá 2.12:1 sobre branco e falha AA como texto. O cliente sabe e
mantém. A tua proposta tem de conviver com isso, não de o resolver mudando a cor.
```

### Corrida 3 — as páginas · template *UI mockups*

Uma página de cada vez. Começa pela loja, que é a que gera receita.

```
Lê o brief anexo. Redesenha a página de loja (store.html).

Conteúdo real: três t-shirts de edição limitada, 45€, 60€ e 25€, com
ilustração de autor. Cabeçalho de secção "Produtos" com badge "Edição
Limitada". Grelha de cartões: imagem 4:3, categoria, nome, preço, badge "Novo"
opcional.

Restrições: CSS puro sem framework, mobile-first, 360px a 1440px. Todo o
:hover embrulhado em @media (hover: hover). Tipografia Halyard Text.

Mostra telemóvel a 390px e desktop a 1280px.
```

Repete com: `index.html` (hero + destaques), `about.html` (banner CTA +
serviços), `projects.html` (grelha de casos).

### Corrida 4 — a fotografia · template *Blank*

```
Lê o brief anexo, secção 8, "Ativo do qual se pode tirar mais partido".

O estúdio tem uma série fotográfica de rua própria — cadeira vermelha encostada
a um muro, horário de autocarros rasgado numa paragem, ervas em fendas de
passeio, marco de incêndio enferrujado, paredes a desfazer-se. Sul de Portugal,
olhar consistente, obra de autor.

Hoje três destas aparecem como fundo de banner e mais nada.

Propõe como é que esta série entra no sistema de forma sistemática: onde
aparece, em que proporções, com que tratamento, e que regra decide qual
fotografia vai para que página. Quero um sistema, não uma escolha de imagens.
```

---

## 4. O que NÃO levar para lá

O brief pede seis coisas. Estas três não são para esta ferramenta:

- **Diagnóstico do código** — que CSS está a ser ignorado, que seletores
  colidem. Isso é leitura de ficheiros.
- **Escalas de espaçamento, raios e breakpoints** — precisam de auditar os
  valores reais espalhados por doze ficheiros CSS.
- **Auditoria de contraste** — é cálculo, e já está feito.

Traz essas de volta para a sessão de código.

---

## 5. Depois

O que sair de lá são imagens e intenções, não CSS pronto a colar. O caminho é:
escolhes uma direção, e a implementação — tokens, componentes, media queries,
verificação em 360/390/430/768/1024/1280 e nas escalas de texto 1.0/1.15/1.3 —
faz-se no código, contra o `TROUBLESHOOTING.md`.
