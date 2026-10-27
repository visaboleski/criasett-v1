# Criasett Image Delivery Audit

Audit date: 2026-10-27

Scope: the nine approved public routes, measured against the Cloudflare staging
site at 1440 × 900 and 390 × 844 before optimization. File sizes below are the
original source assets. Desktop and mobile columns show their approximate
rendered CSS dimensions. `same` means the original oversized file was sent to
both layouts before this work.

## Browser-requested image inventory

| Use | Source | Original bytes | Intrinsic | Format | Desktop render | 390 px render | Loading | Same oversized source | Alpha required |
| --- | --- | ---: | ---: | --- | ---: | ---: | --- | --- | --- |
| Global header | `Criasett_logo_Horizontal.png` | 177,143 | 5906×1355 | PNG | 216×50 | 180×41 | eager | yes | yes |
| Global footer | `Criasett_logo_Branco.png` | 84,552 | 2144×1772 | PNG | 216×179 | 205×169 | lazy | yes | yes |
| Home hero | `CRIASETT HERO.png` | 2,111,554 | 1672×941 | PNG | 1425×810 | 375×320 | eager/high | yes | no |
| Home institutional art | `CMYK Printing Press Blueprint Ribbons.png` | 1,907,133 | 2172×724 | PNG | 1425×596 | 375×550 | lazy | yes | no |
| Home/products packaging gateway | `EMBALAGENS.png` | 2,305,963 | 1448×1086 | PNG | 627×350 / 645×484 | 333×240 / 335×251 | lazy | yes | no |
| Home/products promotional gateway | `PROMOCIONAIS.png` | 2,241,829 | 1672×941 | PNG | 627×350 / 550×412 | 333×240 / 335×251 | lazy | yes | no |
| A Criasett video cover | `Criasett Industrial Printing Showcase.png` | 2,093,816 | 1254×1254 | PNG | 548×548 | 335×335 | eager/high | yes | no |
| A Criasett desktop background | `Minimal Background.png` | 1,322,902 | 1672×941 | PNG | 1425×791 | not requested | CSS background | desktop only | no |
| A Criasett quality | `Vibrant Color Proofs in a Modern Print Shop.png` | 1,891,875 | 1190×1322 | PNG | 673×520 | 335×340 | lazy | yes | no |
| A Criasett sustainability | `sustentabilidade.png` | 2,028,639 | 1983×793 | PNG | 661×540 | 335×320 | lazy | yes | no |
| A Criasett awards | `premios.png` | 1,983,350 | 1672×941 | PNG | 795×447 | 335×251 | lazy | yes | no |
| Estrutura hero | `HERO DARK ESTRUTURA.png` | 1,779,186 | 1672×941 | PNG | 1425×648 | 375×450 | eager/high | yes | no |
| Estrutura printing | `estrutura-impressao.png` | 1,164,200 | 2172×724 | PNG | 656×219 | 335×112 | lazy | yes | yes |
| Estrutura finishing | `novo acabamento.png` | 2,139,754 | 1536×1024 | PNG | 679×453 | 335×223 | lazy | yes | no |
| Produtos hero | `Minimal CMYK Packaging Wave Scene.png` | 1,650,349 | 1672×941 | PNG | 1425×619 | 375×345 | eager/high | yes | no |
| Embalagens hero | `hero embalagens.png` | 2,121,285 | 1983×793 | PNG | 1425×619 | 375×390 | eager/high | yes | no |
| Embalagens cartucho | `cartucho-transparente.png` | 1,406,407 | 1254×1254 | PNG | 509×509 | 319×319 | lazy | yes | yes |
| Embalagens expositora | `embalagem-expositora-transparente.png` | 1,015,317 | 1254×1254 | PNG | 581×581 | 319×319 | lazy | yes | yes |
| Embalagens display | `display-transparente.png` | 1,660,344 | 1254×1254 | PNG | 509×509 | 319×319 | lazy | yes | yes |
| Embalagens sacola | `sacola-transparente.png` | 2,014,599 | 1122×1402 | PNG | 494×557 | 268×295 | lazy | yes | yes |
| Embalagens sacola recortada | `sacola-boca-palhaco-transparente.png` | 1,115,584 | 1254×1254 | PNG | 298×298 | 168×168 | lazy | yes | yes |
| Embalagens holográfica | `embalagem-holografica-transparente.png` | 1,310,028 | 1254×1254 | PNG | 509×509 | 319×319 | lazy | yes | yes |
| Promocionais hero | `PROMOCIONAIS hero.png` | 2,202,456 | 1672×941 | PNG | 1425×619 | 375×390 | eager/high | yes | no |
| Promocionais cubo | `CUBO-PET.png` | 2,250,129 | 1254×1254 | PNG | 410×410 | 333×333 | lazy | yes | no |
| Promocionais totem | `TOTEM-COSMETICOS.png` | 2,029,701 | 1254×1254 | PNG | 410×410 | 333×333 | lazy | yes | no |
| Promocionais wobbler | `WOBBLER-ALIMENTOS.png` | 1,909,717 | 1254×1254 | PNG | 410×410 | 333×333 | lazy | yes | no |
| Promocionais stopper | `STOPPER-VITAMINAS.png` | 1,794,106 | 1254×1254 | PNG | 410×410 | 333×333 | lazy | yes | no |
| Promocionais gargaleira | `GARGALEIRA-BEBIDAS.png` | 2,085,567 | 1254×1254 | PNG | 410×410 | 333×333 | lazy | yes | no |
| Promocionais catálogo | `Luxury Cruise Catalog Mockup.png` | 2,212,752 | 1254×1254 | PNG | 410×410 | 333×333 | lazy | yes | no |
| Certificações hero | `HERO CERTIFICACOES.png` | 1,828,813 | 1672×941 | PNG | 1425×650 | 375×660 | eager/high | yes | no |
| ISO logo | `Certificado ISO 9001_PT_2.png` | 39,428 | 1454×679 | PNG | 430×175 | 285×128 | lazy | yes, but already small | yes |
| FSC logo | `FSC_C084646_Promotional_with_text_Landscape_WhiteOnGreen_r_xC1Fc5.png` | 65,854 | 1024×487 | PNG | 460×175 | 285×128 | lazy | yes, but already small | yes |
| SMETA logo | `smeta-certification-logo-png_seeklogo-615209.png` | 7,042 | 600×600 | PNG | 330×175 | 270×128 | lazy | no material issue | no |
| eureciclo logo | `eu reciclo.png` | 8,910 | 270×266 | PNG | 190×175 | 150×~148 | lazy | no | yes |
| Políticas hero | `HERO POLITICAS.png` | 1,921,148 | 1672×941 | PNG | 1425×620 | 375×410 | eager/high | yes | no |
| Contato hero | `HERO CONTATOS IMAGE.png` | 1,638,388 | 1672×941 | PNG | 1425×610 | 375×430 | eager/high | yes | no |

The original PNG certification marks remain in place because their transfer
cost is already modest and preserving exact brand/certification artwork is more
valuable than adding another format layer.

## Optimization implemented

- Opaque photographic/illustrative assets: AVIF primary source and WebP
  fallback at usage-driven widths from 480 through 1440/maximum source width.
- Transparent product cutouts and logos: WebP with alpha at responsive widths.
- Original assets remain as the final `<img>` fallback.
- All responsive images now include intrinsic dimensions, `srcset`, `sizes`,
  async decoding, and explicit eager/lazy behavior.
- Each page hero is eager with `fetchpriority="high"`; only one primary visual
  per route receives high priority.
- Below-the-fold content remains lazy-loaded.
- The institutional MP4 remains `preload="metadata"` inside the modal and is
  not downloaded as page imagery.

## Homepage mobile before/after

The initial 390 px viewport requested the header logo, Home hero, and the next
institutional visual (native lazy-load proximity): three image requests both
before and after.

| Measurement | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| 390 px test viewport, DPR 1 | 4,195,830 bytes | 29,307 bytes | 99.3% |
| 390 px iPhone-class selection, DPR 3 | 4,195,830 bytes | 122,733 bytes | 97.1% |
| Largest request | 2,111,554 bytes | 68,366 bytes (DPR 3 Hero) | 96.8% |
| Request count | 3 | 3 | unchanged |

The likely Home LCP asset remains `CRIASETT HERO.png`, now delivered from the
responsive AVIF set. Internal-page LCP candidates are their single page hero,
except `/criasett`, where the approved video cover is the likely image LCP.
