# Emails — Autenticação de domínio e envio próprio

Runbook para pôr os emails transacionais a sair de `@cloverprints.com`
devidamente assinados, em vez de dependerem da reputação partilhada do Snipcart.

Branch: `claude/snipcart-tshirt-research-W2bnj`

---

## Contexto — a arquitetura

O Snipcart **não aceita SMTP genérico**. Não se aponta ao Brevo, ao Postmark nem
a um SMTP qualquer. Entrega tudo via **SendGrid**, e a única escolha é: usar a
conta SendGrid partilhada deles, ou ligar uma conta SendGrid própria por API key.

Daí a separação:

| O quê | Por onde |
|---|---|
| Emails transacionais do Snipcart | SendGrid (obrigatório) |
| Pedido de review, newsletter | Brevo ou outro, sistema separado |

São dois remetentes no mesmo domínio. Convivem sem conflito — cada um assina com
o seu próprio seletor DKIM.

> Isto é um **upgrade, não um bloqueador**. A conta partilhada do Snipcart
> funciona sem nada disto. Dá para lançar primeiro e autenticar depois.

---

## Pré-requisitos

- [ ] Saber **onde está alojado o DNS** do `cloverprints.com` (registrador? Cloudflare?).
      É lá que se colam os registos — não no GitHub.
- [ ] Saber que serviço entrega hoje o `info@cloverprints.com`.
      Não se mexe nele, mas é preciso saber que existe (ver Armadilhas).

---

## Bloco 1 — SendGrid

- [ ] Criar conta SendGrid (plano gratuito serve; limite ronda os 100 emails/dia)
- [ ] **Settings → Sender Authentication → Authenticate Your Domain**
- [ ] Indicar o fornecedor de DNS e o domínio `cloverprints.com`
- [ ] Recolher os **3 registos CNAME** devolvidos:
      - subdomínio de envio (tipo `em1234`)
      - `s1._domainkey`
      - `s2._domainkey`

## Bloco 2 — DNS

- [ ] Colar os 3 CNAME no painel de DNS, exactamente como aparecem
- [ ] Voltar ao SendGrid → **Verify**

Propagação anunciada: 24–72h. Na prática costuma resolver-se em minutos.

> Com autenticação por CNAME o SendGrid trata do DKIM e do return path.
> **Não é preciso acrescentar `include:sendgrid.net` ao SPF** — é exactamente
> o que este método evita.

## Bloco 3 — Snipcart

- [ ] SendGrid: **Settings → API Keys → Create API Key**, acesso restrito a
      **Mail Send** apenas
- [ ] Copiar a chave (**só aparece uma vez**)
- [ ] Snipcart: **Account → Email settings** → definições SendGrid → colar a API key
- [ ] Adicionar o domínio no mesmo painel de definições SendGrid do Snipcart
- [ ] Testar: abrir um template → **"Send me a test email"**

---

## Armadilhas

**A chave é específica do modo.** O Snipcart trata Test e Live como ambientes
distintos. Configurar só o teste significa que, no dia do lançamento, os emails
saem pela conta partilhada — ou não saem de todo.

**Só pode existir um registo SPF por domínio.** Se um dia for preciso acrescentar
um `include:`, tem de ir dentro do registo que já lá está. Dois registos SPF é
pior que nenhum — os validadores rejeitam ambos.

**Não tocar nos MX.** Enviar e receber são independentes. O que entrega o
`info@cloverprints.com` hoje continua igual.

**DMARC com `p=reject` demasiado cedo parte tudo.** Começar em `p=none` e só
apertar quando o SendGrid *e* o sistema das reviews estiverem ambos autenticados
e verificados.

**A API key só se vê uma vez.** Guardar antes de fechar o separador.

---

## Emails predefinidos — inventário

Do lado do cliente:

| Email | Estado | Notas |
|---|---|---|
| Confirmação de encomenda | Automático | Traz o nº de encomenda |
| Envio / rastreio | Automático | Disparado ao marcar como expedida |
| Reembolso | Automático | |
| Cancelamento | Automático | |
| Carrinho abandonado | Opcional | Ligar mais tarde |
| Pedido de review | **Não existe** | Precisa de construção |

Do lado do lojista: notificação de nova encomenda (automática) e, mais tarde,
alertas de stock.

**Dois destes já são compromissos escritos.** Os *Termos de Serviço* dizem
"recebe email de confirmação até 2 horas depois" e que o contrato se celebra
com esse envio. A *Política de Devoluções* promete número RMA e etiqueta por
email. Não são opcionais — são promessas publicadas.

---

## Ordem recomendada

1. **Personalizar os templates no Snipcart.** Resolve as promessas dos Termos,
   é trabalho de design com sistema já montado, não depende de mais nada.
2. **Autenticar o domínio e ligar o SendGrid próprio.** Este documento.
3. **Reviews à mão, ao início.** Uma automação para três emails por mês é
   infraestrutura a mais.
4. **Webhooks só quando o volume justificar.** Aí decide-se entre serverless
   (Netlify/Cloudflare/Vercel) e no-code (Make/Zapier), com dados reais.

---

## Notas de verificação

Os nomes exactos dos menus podem estar diferentes na interface actual — a
documentação do Snipcart não estava acessível na altura em que isto foi
escrito (proxy bloqueia `docs.snipcart.com`), pelo que os passos vêm de
resumos de pesquisa. Os conceitos mantêm-se; os rótulos convém confirmar.

### Fontes

- <https://docs.snipcart.com/v3/dashboard/sendgrid-configuration>
- <https://docs.snipcart.com/v3/email-templates/basics>
- <https://docs.snipcart.com/v3/dashboard/store-configuration>
- <https://sendgrid.com/docs/ui/account-and-settings/how-to-set-up-domain-authentication>
- <https://help.brevo.com/hc/en-us/articles/12163873383186-Authenticate-your-domain-with-Brevo-Brevo-code-DKIM-DMARC>
