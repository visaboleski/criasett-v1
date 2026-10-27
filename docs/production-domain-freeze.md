# Production Domain Freeze and Step 6A DNS Audit

> Status: **PAUSED**
>
> This document records the authoritative future-production context established
> by the completed Step 6A audit. Production-domain work must not resume until
> the website has explicit stakeholder approval.

## Current approved staging state

- Branch: `feature/cloudflare-static-migration`
- Stakeholder review environment: `https://criasett-site.criasett-site.workers.dev/`
- Fully static Astro site deployed with Cloudflare Workers Static Assets
- Cloudflare R2 supplies the public institutional video and documents
- No Supabase runtime, admin, database, Vercel runtime, Worker application
  backend, or production custom domain
- Public documents: six policy PDFs, ISO PDF, and FSC PDF
- SMETA and eureciclo remain informational only, without PDFs

The `workers.dev` deployment is the canonical staging and acceptance
environment until stakeholder approval is explicit.

## Production freeze

Until that approval, work is limited to website-level changes and QA against
the staging site. Permitted work includes design, copy, images, responsive
behavior, content, video/card/modal refinements, PDF links, accessibility,
internal links, and stakeholder feedback.

Do not perform any of the following:

- change production DNS or nameservers;
- create or change a production Cloudflare zone;
- attach `graficacriasett.com.br`, `www.graficacriasett.com.br`, or
  `media.graficacriasett.com.br`;
- configure an R2 custom domain;
- modify WordPress or its hosting;
- change production email DNS, including MX, SPF, DKIM, or DMARC;
- modify or delete Vercel, Supabase, WordPress, or registrar infrastructure.

## Authoritative DNS snapshot

The authoritative nameservers currently serving `graficacriasett.com.br` are:

- `ns1.san.psi.br`
- `ns2.san.psi.br`
- `ns3.san.psi.br`
- `ns4.san.psi.br`

DNS appears to be operated by SAN Internet / PSI.

Current website records:

- Apex A: `51.222.82.228`
- Apex AAAA: `2607:5300:203:83e4::`
- `www`: CNAME to `graficacriasett.com.br`

Production still points to the legacy WordPress site. Its current canonical
behavior is `www`. At a future approved launch, the intended canonical host is
the apex, with `www.graficacriasett.com.br` redirecting to
`https://graficacriasett.com.br`.

## Email DNS that must be preserved

Microsoft 365 is the primary mail service.

- MX: `graficacriasett-com-br.mail.protection.outlook.com`
- SPF: `v=spf1 ip4:51.222.82.228 include:spf.protection.outlook.com ip4:51.222.203.23 ip4:54.39.16.120 a mx include:_spf.saninternet.com ~all`
- DMARC: `v=DMARC1; p=none;`
- `autodiscover`: `autodiscover.outlook.com`
- `lyncdiscover`: `webdir.online.lync.com`
- `sip`: `sipdir.online.lync.com`
- `enterpriseregistration`: `enterpriseregistration.windows.net`
- `enterpriseenrollment`: `enterpriseenrollment.manage.microsoft.com`
- `_sip._tls`: priority 100, weight 1, port 443,
  `sipdir.online.lync.com`
- `_sipfederationtls._tcp`: priority 100, weight 1, port 5061,
  `sipfed.online.lync.com`

DKIM selectors were not discoverable during the public audit. Before any
future cutover, confirm them in Microsoft 365 / Exchange Admin or in a complete
SAN DNS-zone export. Do not invent DKIM records.

The current SPF additionally authorizes `51.222.82.228`, `51.222.203.23`,
`54.39.16.120`, `_spf.saninternet.com`, `a`, and `mx`. Determine which senders
remain in use before simplifying the policy. Preserve the current SPF exactly
during the initial Cloudflare migration unless a separate change is approved.

## Other DNS items requiring review

`mail.graficacriasett.com.br` currently CNAMEs to the apex. Its use must be
confirmed before cutover because otherwise it would follow the apex to the new
Worker. Do not alter or remove it during staging.

The domain is registered through Registro.br and its publicly reported expiry
date is 18/05/2027. The audit did not determine whether nameserver delegation
is controlled directly in Registro.br or through a delegated provider account.
Confirm that control before cutover.

No active DS or DNSKEY was found, so DNSSEC does not currently appear enabled.
Do not enable it during staging or review.

## Current WordPress hosting

The current production WordPress infrastructure appears to use SAN-managed
hosting on the OVH network with Apache at:

- IPv4: `51.222.82.228`
- IPv6: `2607:5300:203:83e4::`

WordPress remains production and must stay untouched until final approval and
the explicitly authorized cutover.

## Legacy URL findings

The previously assumed `/institucional` and `/portfolio` paths are not primary
live WordPress URLs and currently return 404.

The WordPress sitemap exposes historical routes including:

- `/empresa/`
- `/servicos/`
- `/clientes/`
- `/contato/`
- `/produtos/`
- `/produtos/embalagens/`
- `/produtos/promocionais/`
- `/produtos/sacolas/`
- `/produtos/brindes/`
- `/sacolas-personalizadas/`
- `/project/`
- multiple `/project/<slug>/` routes

The final redirect strategy is incomplete. Do not add production redirects
during staging. Create the redirect matrix only after stakeholder approval and
before production cutover.

## Requirements before a future production cutover

Before creating or migrating the production Cloudflare zone, obtain:

1. a full DNS-zone export from SAN;
2. confirmed Microsoft 365 DKIM selectors;
3. confirmation of the SPF senders and services still in use;
4. confirmation whether `mail.graficacriasett.com.br` is used;
5. a final legacy URL redirect matrix.

Only then should the future Cloudflare production zone be created and compared
record by record. Production-infrastructure work resumes only after an explicit
instruction that the site has received stakeholder approval.
