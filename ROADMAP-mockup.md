# Roadmap / Notas — Página de Produto (Mockup)

Lista viva de coisas a implementar, decidir ou pensar mais tarde.
Branch: `claude/snipcart-tshirt-research-W2bnj`

---

## ✅ Feito
- Preço **45 €** (formato pt-PT: símbolo depois, sem decimais em valor redondo)
- Botão CTA limpo (`Adicionar ao Carrinho`); preço fica na price row (sticky mobile mantém preço ao lado)
- Custom fields Snipcart **Tamanho / Cor** via definição crawlable escondida
- Trust row com ícones (`shipping.svg` / `troca.svg`) — "Envio gratuito" / "Retoma gratuita"
- Hierarquia do cabeçalho agrupada; acordeão fechado com borda superior
- Breadcrumb com seta (alinhada + hover)
- Empty state de reviews ("ainda sem avaliações", sem reviews falsas)
- Removidos cursores `not-allowed` (botão review e tamanhos esgotados)
- **GitHub Pages ligado ao domínio próprio** ✅

---

## 🔜 A implementar / decidir

### 🏦 Snipcart — conta e configuração inicial (bloqueia tudo o resto)
- Preencher dados de negócio: contribuinte (NIF), morada, nome legal
- Ligar cartão de débito/crédito (para receber pagamentos via Stripe)
- Verificar número de telemóvel
- Escolher moeda EUR + locale pt-PT (para mostrar `45,00 €` no checkout)
- Activar modo live (sair do modo teste)

### ✉️ Emails (próximo a trabalhar)
- **Email de confirmação de encomenda** — template HTML personalizado no dashboard Snipcart
- **Email de pedido de review** — 10 dias pós-compra via webhook Snipcart + Brevo (grátis)
  - Precisa de: conta Brevo + Make/Zapier (automação) + Google Forms (receber reviews)
- **[FUTURO] Aliases de reencaminhamento** — hoje só existe `info@cloverprints.com`; páginas de apoio usam subject prefills (`?subject=...`) para simular routing por assunto num único inbox. Mais tarde criar aliases dedicados (ex: `privacidade@`, `devolucoes@`, `envios@`) a reencaminhar para a caixa principal, sem custo extra de mailbox.

### 💶 Preços
- **Locale pt-PT no Snipcart** — para o checkout mostrar `45,00 €`
- **Preço comparativo riscado** — só usar em campanhas reais (lei PT: o "antes" tem de ser o preço mais baixo dos últimos 30 dias)
- **Ancoragem alternativa** ao riscado — edição numerada (X/100), parcelamento, ou destaque de valor (algodão orgânico)

### ⭐ Reviews
- **[EM CURSO] Opção 1** — recolha manual via email + cards no HTML
- **[PARA DEPOIS] Opção 2** — Google Business Reviews (SEO grátis, criar conta + link de review)
- **[FUTURO] Opção 4** — Judge.me / Okendo via webhooks quando passar de ~20 encomendas/mês

### 🛍️ Produto e catálogo
- Aplicar melhorias do mockup ao `Product.html` real
- Fotografias/assets reais dos 3 produtos (Wanderer Vessel, Urban Explorer, Minimal Essence)
- Preencher `products.json` com dados reais (materiais, descrição, preços finais)
- Actualizar preços na `index.html` (ainda em €25/€28/€22 placeholder)
- Apontar `data-item-url` dos produtos para o domínio real em produção

### ↔️ Navegação produto-a-produto (setas laterais)
- Corrigir posição vertical (está hardcoded a `435px` no `cSS.css`)
- Hover preview (miniatura + nome + preço), labels/aria, teclas ←/→, esconder em mobile
- **[FUTURO]** Faixa de "Produtos relacionados" no fundo

### 🖼️ Imagens e banners
- **[PROVISÓRIO] Banner do `projects.html`** — está com a `Website_Imgs/4.jpg`
  (canas contra parede), escolhida só para a página deixar de parecer vazia.
  Substituir por uma imagem pensada para a página. Trocar é uma linha:
  o `src` do `.banner__media` no `projects.html`.
- **Rever o banner do `about.html`** — usa a `10.jpg` (horário de autocarros
  rasgado). Foi escolha deliberada, mas confirmar se serve.
- **Vídeo em vez de foto** — o `.banner--photo` não assume que o media é uma
  imagem; trocar `<img class="banner__media">` por `<video class="banner__media"
  autoplay muted loop playsinline poster="...">` funciona sem tocar no CSS.
- **Fotografias reais dos produtos** — os três produtos partilham as mesmas
  imagens, e dois partilham o mesmo `cardImage`.
- **Foto do retrato em `about.html`** — a secção "pessoa" tem um placeholder.

### 🔍 SEO + Legal (obrigatório para lançar)
- Meta tags + OG tags (partilha no Instagram/WhatsApp)
- Política de privacidade (RGPD — obrigatório em PT)
- Política de devoluções (referenciada na trust row)
- Sitemap.xml

### 🔧 Snipcart / técnico
- Confirmar custom fields no **preview público** (o crawler precisa de URL acessível pela net)
- Validar preço/custom fields quando for para **produção** (apontar `url` para o domínio real)
