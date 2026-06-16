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

---

## 🔜 A implementar / decidir

### 💶 Preços
- **Locale pt-PT no Snipcart** — para o checkout mostrar `45,00 €` (vírgula, símbolo depois) em vez do default
- **Preço comparativo riscado** — só usar em campanhas reais (lei PT: o "antes" tem de ser o preço mais baixo dos últimos 30 dias)
- **Ancoragem alternativa** ao riscado — edição numerada (X/100), parcelamento, ou destaque de valor (algodão orgânico)

### ⭐ Reviews
- **[EM CURSO] Opção 1** — recolha manual + email de follow-up + cards no HTML
- **[PARA DEPOIS] Opção 2** — Google Business Reviews (SEO grátis, criar conta + link de review)
- **[FUTURO] Opção 4** — Judge.me / Okendo via webhooks quando passar de ~20 encomendas/mês

### ✉️ Emails automáticos
- Personalizar template de **confirmação de encomenda** (nativo do Snipcart)
- **Email de pedido de review** 7–14 dias pós-compra (precisa webhook Snipcart + automação)

### ↔️ Navegação produto-a-produto (setas laterais)
- Corrigir posição vertical (está hardcoded a `435px` no `cSS.css`)
- Hover preview (miniatura + nome + preço), labels/aria, teclas ←/→, esconder em mobile
- **[FUTURO]** Faixa de "Produtos relacionados" no fundo

### 🔧 Snipcart / técnico
- Confirmar custom fields no **preview público** (o crawler precisa de URL acessível pela net; não funciona em localhost)
- Validar preço/custom fields quando for para **produção** (apontar `url` para o domínio real)
