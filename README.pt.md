<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/dsh-clinic-hero-en-dark.webp">
  <img src="docs/assets/dsh-clinic-hero-en-light.webp" width="100%" alt="dsh-clinic: aprove um plugin DSH em uma única execução — estrutura do pacote, contrato cordis, inicialização em sandbox e listagens, com veredicto em seis estados e códigos de saída 0–6">
</picture>

# dsh-clinic

**Aprove um plugin DSH em uma única execução: estrutura do pacote, contratos cordis, inicialização em sandbox e listagens de diretório.**

Um verificador «integridade + saúde em tempo de execução» sem dependências para plugins do DeepSeek Harness: as duas camadas estáticas rodam offline, o smoke dinâmico inicia uma composição em um sandbox descartável e o veredicto é legível no código de saída.

[Instalação](#instalação-em-três-passos) · [Configuração](#configuração) · [FAQ](#faq) · [简体中文](README.md) · [English](README.en.md) · [Español](README.es.md) · [Português](README.pt.md) · [हिन्दी](README.hi.md)

[![License](https://img.shields.io/badge/license-Apache--2.0-3366CC?style=flat-square&labelColor=2B3245)](LICENSE)
[![DSH](https://img.shields.io/badge/DSH-%E2%89%A50.2.1%20%3C0.3.0-4B67B4?style=flat-square&labelColor=2B3245)](#compatibilidade)
[![npm](https://img.shields.io/npm/v/dsh-clinic?style=flat-square&labelColor=2B3245&color=CB3837)](https://www.npmjs.com/package/dsh-clinic)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-clinic/smoke.yml?branch=main&label=CI&style=flat-square&labelColor=2B3245)](https://github.com/PerryLink/dsh-clinic/actions/workflows/smoke.yml)
[![Node](https://img.shields.io/badge/node-%3E%3D24.9-339933?style=flat-square&labelColor=2B3245)](#compatibilidade)

[![Stars](https://img.shields.io/github/stars/PerryLink/dsh-clinic?style=flat-square&labelColor=2B3245)](https://github.com/PerryLink/dsh-clinic/stargazers)
[![npm downloads](https://img.shields.io/npm/dm/dsh-clinic?style=flat-square&labelColor=2B3245&color=CB3837)](https://www.npmjs.com/package/dsh-clinic)
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-clinic?metric=downloads)](https://dshfind.com/plugins/PerryLink/dsh-clinic?ref=badge)

```sh
dsh plugin --profile <name> add dsh-clinic
```

</div>

<sub>Ferramenta da comunidade, sem vínculo com a DeepSeek e não é certificação, auditoria ou aval oficial; o bloco `dsh.standards` é um marcador `not-run`, não um aprovado. Repositório canônico: <https://github.com/PerryLink/dsh-clinic> (antes `@perrylink/dsh-plugin-doctor`; o repo antigo permanece como ponteiro).</sub>

## O que é

O `dsh-clinic` divide «este plugin pode ser instalado, pode iniciar, algum diretório vai rejeitá-lo?» em quatro camadas legíveis: **R estrutura do pacote → K contratos cordis → D smoke em sandbox → CC listagens de diretório**. R e K leem apenas a árvore commitada — sem instalar dependências, sem rede; D realmente roda `npm pack` e inicia um perfil sem credenciais em um sandbox descartável até a requisição ao modelo; CC confronta as restrições reais de cinco diretórios/registros do ecossistema. Uma execução produz um veredicto de seis estados (pass / warn / info / skip / fail / error) e sete códigos de saída, então a CI pode ramificar pelo código.

Os critérios não são improvisados: vêm de três linhas de pesquisa de primeira mão datadas de 2026-09-07 — a documentação e o código do deepseek-harness, os contratos de código do cordiverse/cordis e um inventário de todos os canais de distribuição do workspace (texto completo e cada citação em [`SURVEY.md`](SURVEY.md)). Não substitui testes e não é auditoria de segurança: transforma o que pode ser julgado estaticamente em um portão reproduzível.

**📖 Base de conhecimento do ecossistema** (dados medidos, não marketing): [guia de desenvolvimento · dados de seleção · critérios de manutenção](https://perrylink.github.io/dsh-plugin-guide/).

### Confusão de nomes (importante)

Em 2026-11 este repositório passou de **`@perrylink/dsh-plugin-doctor`** para **`dsh-clinic`**; o pacote npm com escopo antigo e o repo antigo do GitHub permanecem como ponteiros/backups. Existem outros projetos com o mesmo nome: não instale o errado.

- O nome npm simples **`dsh-plugin-doctor`** (0.1.1) pertence a **Xrainsmile/DSH-Plugin-Doctor**, não a este repo. **Nunca execute `npx dsh-plugin-doctor`** — isso executa o pacote de outra pessoa.
- O pacote npm deste repo agora é **`dsh-clinic`**; `npx dsh-clinic@<version>` e `dsh plugin add dsh-clinic` apontam para ele.
- Dez repos do GitHub carregam `dsh-plugin-doctor` no nome (oito exatamente), por exemplo `zoahdev/dsh-plugin-doctor` (somente GitHub, nunca publicado no npm).
- O README do [`dsh-testkit`](https://github.com/PerryLink/dsh-testkit) liga o nome antigo ao repo do zoahdev; isso não tem relação com este.

Em uma linha: **sem dependências, capaz de operar offline (`--only R,K`), e transforma os contratos cordis v4 (K1–K16) e cinco listagens de diretório do ecossistema (CC1–CC5) em um portão de CI cujo veredicto se lê no código de saída.** (Sem afirmações do tipo «o único»: apenas que nada comparável apareceu dentro do conjunto de ferramentas realmente examinado.)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/dsh-clinic-flow-v5-dark.svg">
  <img src="docs/assets/dsh-clinic-flow-v5-light.svg" width="100%" alt="Estrutura do dsh-clinic (um funil): cinco fontes de evidência R/K/D/CC/X entram em um funil, cada verificação cai em um de seis estados, o pior estado define o veredicto e a saída fornece os códigos de saída 0–6">
</picture>

## Instalação em três passos

1. **Instalar** (escolha um canal):

   ```sh
   # canal git (main mais recente; equivale a git+https://github.com/PerryLink/dsh-clinic.git)
   dsh plugin --profile web add github:PerryLink/dsh-clinic
   # canal npm (versões publicadas)
   dsh plugin --profile web add dsh-clinic
   # canal tarball: pnpm pack neste repo e depois
   dsh plugin --profile web add ./dsh-clinic-<version>.tgz
   ```

   O `package.json` declara `dsh.bundle.patch` → `cordis.patch.yml`, então ele instala como bundle do DSH e também funciona como CLI independente (`node doctor.mjs` / `npx dsh-clinic`).

2. **Montar** (a forma bundle insere uma linha; nenhuma chave de configuração é necessária):

   ```yaml
   - insert:
       - id: plugin-doctor
         name: 'dsh-clinic'
   ```

   A linha inserida carrega este pacote sob o contrato padrão de plugins do Cordis: a metade anfitriã é um módulo ESM normal que exporta `apply(ctx)` (seu `inject` declara `tools` e `commands`). O pacote não inclui interface de navegador, então não há declaração `dsh.client`.

3. **Verificar que funciona**:

   ```sh
   node doctor.mjs --repo . --no-smoke --only R,K
   ```

   ```text
   == 静态·包结构 ==
   [PASS] R0 基础字段（name/version/license/README/type）
       基础字段齐全
   [PASS] R1 激活门 dsh.bundle.patch [关键]
       dsh.bundle.patch = ./cordis.patch.yml
   ```

   **Desinstalar**: `dsh plugin --profile web remove dsh-clinic` (ou remova a linha do patch do perfil). O uso da CLI não é afetado.

## Capacidades principais

As mesmas verificações têm duas entradas: a CLI (`doctor.mjs`, com códigos de saída) e a metade anfitriã (ferramenta `plugin_doctor` / comando `/doctor`, que devolve o relatório completo). Quatro grupos centrais:

- **R | estrutura do pacote (R0–R8)** — campos base; o portão de ativação `dsh.bundle.patch` (crítico); se `npm pack --dry-run` inclui entrada e patch; estrutura do `cordis.patch.yml`; exportações `name`/`apply` da entrada; política de dependências rescopadas; alinhamento de `engines`; prebuild + lista branca `files`; peers antigos de rc.
- **K | contratos cordis (K1–K16)** — acesso a serviços vs declaração `inject`; a linha vermelha de serialização de dados vivos do `ctx`; timers/listeners não envolvidos em `ctx.effect`; Schema com função; forma de retorno de `apply` (contrato Effect v4); a costura do nome de serviço `inject`; APIs legadas da v3; Config deve ser um Standard Schema; o caso especial `name==='apply'`; K15 spec de ativação aninhada (o host ≥ 0.2.2-rc.3 a achatou, então um prompt dentro de request deixa de funcionar); K16 temperature/top_p sem reasoningEffort no modo de pensamento (ignorados em silêncio, INFO).
- **D | smoke em sandbox (D0–D3, D9)** — `npm pack` → `dsh plugin --profile headless add <tarball>` → afirmar que os bundles do perfil contêm o nome do pacote → marcador de camada `--dump-config` → execução headless sem credenciais que deve **sair com 1 + `dsh: MISSING_CREDENTIAL`** (a composição iniciou até a requisição ao modelo) → limpeza do sandbox.
- **CC | listagens de diretório (CC1–CC5)** — evidência de cinco dimensões do spec v1 do registro de certificação; campos/enums/descrições do yml do adp-list; restrições de entrada do dsh-catalog (comandos de instalação proibidos, heurísticas de truncamento); os cinco valores de ativação do `dshWorkshop` no omdsh; os três portões do dsh-plugin-kit (license / README em cinco idiomas / os três papéis de costura).
- **X | contratos do anfitrião (evidência complementar)** — corredor de peers, superfície de serviços `inject`, localizabilidade da linha do patch; degrada quando não consegue ler uma instalação do dsh e nunca finge um aprovado.

**GitHub Action**: o repositório inclui `action.yml` na raiz, então um workflow pode chamá-lo sem etapa de instalação: `uses: PerryLink/dsh-clinic@main` (`with: only: R,K`); em produção, fixe uma tag publicada.

### Catálogo de verificações

| Grupo | Verificações | O que os critérios cobrem |
|---|---|---|
| estático · estrutura do pacote | R0–R8 | campos base; **o portão de ativação `dsh.bundle.patch` (crítico)**; o tarball contém entrada e patch; estrutura do `cordis.patch.yml`; exportações `name`/`apply`; política de dependências rescopadas (`cordis` nu proibido); `engines` alinhado à linha oficial; prebuild + lista branca `files`; peers antigos de rc (a lição da base dupla de 2026-09-05) |
| estático · contrato Cordis | K1–K16 | acesso a serviços vs declaração `inject`; linha vermelha de serialização de dados vivos do `ctx`; timers/listeners sem `ctx.effect`; Schema com função; forma de retorno de `apply` (contrato Effect v4); costura do nome de serviço `inject`; **APIs legadas da v3 (lista de remoção 3.x→4.x)**; Config deve ser Standard Schema; o caso especial `name==='apply'`; K15 spec de ativação aninhada (o host ≥ 0.2.2-rc.3 a achatou, então um prompt dentro de request deixa de funcionar); K16 temperature/top_p sem reasoningEffort no modo de pensamento (ignorados em silêncio, INFO) |
| dinâmico · smoke em sandbox | D0–D3, D9 | `npm pack` → `dsh plugin --profile headless add <tarball>` → afirmar que `dsh.profile.bundles` contém o nome → marcador de camada `--dump-config` → execução headless sem credenciais que deve **sair com 1 + `dsh: MISSING_CREDENTIAL`** (NO_ADAPTER / ERR_MODULE_NOT_FOUND / SyntaxError / TypeError excluídos) → limpeza do sandbox |
| ecossistema · listagens de diretório | CC1–CC5 | evidência de cinco dimensões do spec v1; campos/enums/descrições do yml do adp-list; restrições do dsh-catalog (comandos de instalação proibidos, heurísticas de truncamento); os cinco valores de ativação do `dshWorkshop`; os três portões do dsh-plugin-kit (license / README em cinco idiomas / três papéis de costura, preferindo a CLI oficial do kit) |

### Contrato de códigos de saída

| Código | Significado | Introduzido |
|---|---|---|
| `0` | sem fail/error (warn/skip permitidos) e todos os grupos pedidos realmente rodaram | 0.1.x |
| `1` | há fail/error (um defeito do plugin) | 0.1.x |
| `2` | erro de uso, grupo desconhecido, **opção desconhecida** | 0.1.x |
| `3` | erro de infraestrutura (falta npm/pnpm e afins) | **0.2.0** |
| `4` | versão de host não suportada (o host em si falhou ao instalar; **não** é um veredicto do plugin) | **0.2.0** |
| `5` | resultado instável (um passo estourou o tempo ou foi morto por um sinal) | **0.2.0** |
| `6` | **degradado**: um grupo pedido nunca rodou de verdade (por exemplo, não há arquivos-fonte para escanear) | **0.2.0** |

**Proteção contra aprovações silenciosas** (duas camadas):

1. Se um único nome de grupo em `--only` não casar → imediatamente `2`. As versões 0.1.4 e anteriores «não verificavam nada + saíam com 0» quando um nome de grupo era corrompido, o que certa vez transformou os portões de CI de 35 repos em verde falso (medido em 2026-09-09: `checks_run=0`, `exit=0`).
2. A partir de 0.2.0: **um grupo pedido cujas verificações foram todas saltadas → `6`**. A implementação antiga cobria apenas «nem uma verificação rodou», não «rodou mas tudo foi saltado» — este último deixava «grupo K com cobertura zero» contar como aprovado. Para aceitar isso explicitamente, use `--allow-degraded` (o código cai para 0, mas `degraded` continua não vazio no JSON).

> ⚠️ Os portões existentes dos 41 repos da família **não leem o código de saída** (seus workflows usam `set +e` / `out="$(…)"` / `set -e`) e só analisam os prefixos `R0 ` / `K1 ` no stdout e `results[].name` no JSON. Por isso os novos códigos da 0.2.0 **não mudam nada para esses pipelines**; eles servem ao uso interativo e a integradores futuros.

### Metade anfitriã: `plugin_doctor` / `/doctor`

Instalado como bundle, o plugin registra as mesmas verificações R/K/X como ferramenta somente leitura e como comando. Duas coisas diferem da CLI, e ambas são declaradas na resposta porque **a metade anfitriã não tem código de saída**: o relatório devolvido é a mensagem inteira.

- **Execuções degradadas dizem isso.** Quando um grupo pedido não chegou a rodar de verdade, a resposta traz o mesmo aviso de degradação que a CLI imprime, nomeando os grupos, para que uma resposta degradada nunca possa ser lida como aprovado.
- **`workspace` é resolvido a partir do repositório, não da instalação.** A ferramenta sobe a partir do repositório inspecionado até o diretório mais próximo que contenha dois ou mais repos de plugins DSH (`DSH_WORKSPACE` e o parâmetro explícito têm prioridade). Resolvê-lo como `import.meta.dirname/..` — como a 0.7.0 fazia — resulta em `<profile>/node_modules` (ou `…/@perrylink`) quando o pacote está instalado como bundle, o que não é um workspace de jeito nenhum: CC1–CC4 então informam «não existe localmente» para registros que existem, e K14 nunca encontra um repo irmão. Quando nenhum workspace pode ser localizado, a resposta diz isso explicitamente, em vez de deixar aqueles skips parecerem registros ausentes.

Parâmetros e padrões em [Configuração](#configuração).

### Formas de destino e cobertura

`--repo` pode ser uma **árvore de fontes** ou um **diretório de pacote instalado / artefato tarball desempacotado** (este último é comum em `node_modules/<pkg>`). Os critérios mudam com a forma:

| Forma | Grupo K (contrato Cordis) | Notas |
|---|---|---|
| Árvore de fontes com `src/` | escaneia `src/**` mais JS da raiz (`mode: src`) | completo |
| **Sem `src/`, `main` aponta para `lib/`** | **varredura de fallback de `lib/**` (`mode: lib-fallback`)** | corrigido na 0.2.0: a implementação antiga se baseava em «sem script de build», mas pacotes publicados **mantêm** seu script de build → o fallback nunca disparava, as nove verificações K eram saltadas e ainda assim saía com 0 (verde falso) |
| Nem `src/` nem `lib/` | as nove são saltadas (`mode: none`) | **o grupo inteiro nunca rodou → código de saída 6**, fim do verde falso |

A cobertura é gravada em `coverage.K` do JSON (`{filesInspected, mode}`) e resumida em `groups.K`.

### Grupos `--only` e aliases ASCII

| Alias | Nome completo do grupo | Conteúdo |
|---|---|---|
| `R` | estático · estrutura do pacote | R0–R8 |
| `K` | estático · varredura do contrato Cordis | K1–K16 |
| `D` | dinâmico · smoke em sandbox | D0–D3, D9 |
| `CC` | ecossistema · listagens de diretório | CC1–CC5 |

Os aliases não diferenciam maiúsculas de minúsculas, e os nomes completos em chinês continuam funcionando. **Use os aliases nos workflows**: se um editor ou script faz ida e volta de um nome de grupo chinês com a codificação errada, `--only` não casa com grupo nenhum.

### A visão de contrato de três valores (`--format check`)

`--format check` emite o contrato comum de três valores do ecossistema (`PASS`/`WARN`/`FAIL`, saída `0`/`1`/`2`, `checks[]` plano) em vez do envelope mais rico deste projeto, para que outro verificador ou Action consuma o resultado diretamente. É uma *visão*: nunca muda se um projeto aprova, e um `skip` nunca é renderizado como `PASS` (vira `WARN` com `skipped: true`). A semântica completa fica no campo lateral `doctor`. Veja `SPEC.md` §1.1 — essas três propriedades são normativas e `tests/compat.mjs` as afirma.

### Exemplos

**Exemplo detalhado** — comando `node doctor.mjs --repo . --no-smoke --only R,K`, saída:

```text
== 静态·包结构 ==
[PASS] R0 基础字段（name/version/license/README/type）
    基础字段齐全
[PASS] R1 激活门 dsh.bundle.patch [关键]
    dsh.bundle.patch = ./cordis.patch.yml
```

*Observed from `doctor.mjs` (Usage); `lib/framework.mjs:121` (render)*

**Ramo de falha** — entrada:

```text
node doctor.mjs --repo . --only NOPE --no-smoke
```

Saída:

```text
未知分组: NOPE
可用分组: 静态·包结构（R）, 静态·cordis 契约扫描（K）, 动态面·宿主契约（X）, 生态·集合站清单（CC）
```

*Observed from `doctor.mjs:196-206`; `tests/selftest.mjs:95`*

**Exemplos breves**: `--only R,K` · `--json -` · `--format check`

### De onde vêm os critérios

- **lado harness**: `docs/user/develop/basic/publish.md`, `apps/cli/src/plugin.ts` (o portão de ativação é o único interruptor), `packages/bundle/headless/README.md` (o critério MISSING_CREDENTIAL), Releases (as mudanças de 0.1.2-rc.1 / 0.1.3-alpha.1), `@deepseek-ai/dsh-loader-smoke` (o padrão oficial «DSH_HOME temporário + código de saída esperado»).
- **lado Cordis**: o código do cordiverse/cordis v4 (registry/fiber/reflect/events.ts) + os documentos cordis-primer/tutorial do DSH + o diff de d.ts da v3 `@cordisjs/core@3.10.2` (a lista negra 3.x→4.x).
- **lado ecossistema**: o spec v1 do dsh-plugin-certification, `entries.mjs`/`check-submission.mjs` do adp-list, o live smoke de `validate.mjs`/`deploy.yml` do dsh-catalog, build-submission do omdsh, `verify/*` do dsh-plugin-kit.

## Selos verificados

Há **dois caminhos de selo** e eles fazem afirmações diferentes. Escolha o que você realmente consegue respaldar. **[`FOR-ADOPTERS.md`](FOR-ADOPTERS.md) é a versão passo a passo desta seção**: o arquivo exato a copiar, o markdown exato do selo, o que cada veredicto significa e o que esta verificação *não* prova.

### Caminho A — selo de portão auto-serviço (sem permissão, sem participação do autor)

Este selo faz **uma afirmação estreita e verificável**: *o repositório executa o portão estático R+K do dsh-clinic na sua própria CI, e esse workflow está verde no branch padrão do repositório.* É renderizado diretamente do status do seu próprio workflow — o selo nativo do GitHub (mostrado) ou o shields.io —, então não precisa de entrada em registro, nem pull request, nem token de ninguém, e não pode ser quebrado pela infraestrutura deste projeto:

```markdown
[![dsh-doctor R+K](https://github.com/<owner>/<name>/actions/workflows/plugin-doctor.yml/badge.svg)](https://github.com/PerryLink/dsh-clinic/blob/main/SPEC.md)
```

Substitua `<owner>/<name>` (e `branch=` se seu branch padrão não for `main`). O destino do link é `SPEC.md` — os critérios que você afirma cumprir e uma declaração explícita de quem os escreveu.

**Use o Caminho A.** É o padrão inteiro, auto-serviço, e é para isso que esta especificação foi desenhada. Não exige nada deste projeto.

Duas ressalvas honestas sobre o Caminho A: o selo reflete *o seu* workflow, então só é tão confiável quanto a sua configuração de CI — ninguém mais o verifica; e se você usar a forma do shields.io, o shields.io fica sabendo o nome do seu repositório.

### Caminho B — selo auditado emitido pelo autor

Usar este selo significa exatamente uma coisa auditável: **o repo executa o portão estático R+K do dsh-clinic (23 verificações: R0/R1/R3/R5/R6/R7/R8 + K1–K16) na sua própria CI, e esse portão está verde no HEAD atual do branch padrão**, *reverificado pelo auditor deste projeto*. **Não** é um selo de certificação: sem Scorecard, sem procedência, sem smoke de instalação. R2 (integridade do tarball) e R4 (contrato de entrada) leem o `lib/` construído, e construir a maioria dos repos da família precisa de `HARNESS_COMMIT` + `gen-aliases` — esses dois são cobertos pelo `ci.yml` de cada repo (portão de build-drift + pack smoke) e ficam deliberadamente fora deste portão.

```markdown
[![dsh-doctor](https://raw.githubusercontent.com/PerryLink/dsh-clinic/main/badges/PerryLink__dsh-github.svg)](https://github.com/PerryLink/dsh-clinic/blob/main/README.pt.md#selos-verificados)
```

**O Caminho B é um serviço centralizado de um único operador e deve ser tratado como tal.** Precisa de um PAT fine-grained com leitura entre repositórios, guardado como segredo `DOCTOR_AUDIT_TOKEN` do repositório. O `GITHUB_TOKEN` com escopo de workflow **não** pode substituí-lo: não tem permissão de leitura entre repositórios, então o GitHub o trata como chamador anônimo limitado a 60 requisições/hora, enquanto uma auditoria completa dos repos declarados precisa de 200+. Sem o PAT, cada selo é renderizado em cinza `NO DATA` — a falha parece um programa de selos quebrado em vez de um segredo ausente. Isso já aconteceu (primeiro `401`, depois `403 rate limit exceeded`), e é a razão de o Caminho A existir e ser recomendado. O `scripts/verify.mjs` agora para na primeira resposta desse tipo, sai com `3` e escreve um registro cujas razões nomeiam a causa real em vez de emitir a mesma linha de limite de requisições para cada repo.

- O registro `data/verified.json` é a única fonte de verdade do Caminho B, atualizado pelo `scripts/verify.mjs` (originalmente movido por um workflow diário + a cada push; este repo hoje mantém apenas o workflow de smoke, e o script de atualização continua lá). Uma atualização só lê a API do GitHub: analisa a configuração do portão `plugin-doctor.yml` do HEAD de cada repo (deve fixar `dsh-clinic@<version>`, usar um argumento `--only` que funcione e auto-verificar que R0/K1 rodaram de verdade), e então confere a conclusão da execução do workflow `plugin-doctor` daquele HEAD. **A CI deste repo nunca clona, instala ou executa código de terceiros.**
- Aparência do selo: a linguagem visual segue os dois selos mais novos do ecossistema (monoespaçado maiúsculas + espaçamento + marca + degradê do `dsh.directory`, e o bloco de selo do `awesome-dsh-plugin`): **um segmento esquerdo metálico prata/platina, uma marca de tick de escudo e maiúsculas monoespaçadas azul-tinta**, com o segmento direito em uma **cor de status sólida da convenção do GitHub** (verde/laranja/vermelho/cinza) carregando uma palavra de status em maiúsculas monoespaçadas, e o status também expresso por um **ícone desenhado por traçado** (✓ / ! / ✕ / –) para continuar legível com deficiência de visão cromática. Raio de canto de 5px + traço de 1px; **o traço é obrigatório** — sem ele o segmento esquerdo prateado some sobre um fundo de README branco.
- Quatro estados (o texto do valor usa as palavras convencionais do shields / GitHub Actions): `passing` (verde: a execução do HEAD teve sucesso) / `warning` (laranja: o HEAD ainda não rodou, há uma execução na fila ou falta uma pré-condição do portão) / `failing` (vermelho: a execução do HEAD falhou, ou a configuração do portão não se sustenta — incluindo um «portão falso» cujo argumento `--only` está duplamente mal codificado) / `no data` (cinza: a consulta à API falhou). O selo é **dinâmico**: assim que deixa de aprovar, fica vermelho. O escopo preciso de R+K vive nesta seção e no campo `meaning` do registro, não no texto do selo (o selo aponta de volta para cá).
- Para entrar no Caminho B: abra um PR contra `data/verified-repos.json` adicionando `{ "repo": "<owner>/<name>", "package": "<nome do pacote npm>" }`, e adicione `plugin-doctor.yml` ao seu repo; a entrada precisa passar na auditoria acima. **O Caminho A não precisa de nada disso.**
- **O arquivo do portão é distribuído, não copiado à mão.** Copie [`plugin-doctor.yml`](plugin-doctor.yml) — o workflow canônico e pronto para usar — para `.github/workflows/plugin-doctor.yml` do seu repositório e ajuste o pin. Ele também está dentro do tarball npm, então usuários de `npx dsh-clinic` podem ler a cópia distribuída em vez de reconstruir o passo a partir deste README. Os nomes de grupo usam os **aliases ASCII `R,K`** (suportados desde a 0.1.5, mantendo arquivo e linha de comando em ASCII puro), e o final auto-verifica que R0/K1 rodaram de verdade.

> Por que o portão não instala nem constrói nada, e por que este repo não executa o selo: as verificações estáticas R/K só leem a árvore commitada (sem dependências), enquanto `npm run build` falha em um ambiente sem os aliases do harness, e seu prebuild apaga o `lib/` commitado, fabricando um vermelho falso. Concentrar instalações de dependências de terceiros na CI deste repo, por outro lado, seria um risco de cadeia de suprimentos. Por isso o portão roda dentro da CI de cada repo contra a árvore commitada, e este repo apenas audita e emite o selo do Caminho B.

## Dados medidos

Estes números vêm de **execuções reais**, não de gráficos de marketing. A primeira varredura estática R+K de plugins de terceiros (não PerryLink) (2026-09-10, 0.2.0): **60 candidatos → 20 plugins que declaram de verdade `dsh.bundle.patch` → 10 aprovados / 10 reprovados sob o portão de 16 verificações**. Uma nova varredura do mesmo conjunto qualificado em 2026-09-23 com 0.3.0: **20 candidatos reescaneados → 19 qualificados → 6 aprovados / 13 reprovados / 0 degradados / 1 falha de clone**; histograma de falhas com portão `{"R8":9,"R3":5,"R7":3}`. **Nenhum repositório regrediu por causa das correções de R3/R7** — o movimento principal é todo `R8`: a linha mínima de peers avançou e os repos que ainda fixam `0.1.0-rc.6` estão agora mensuravelmente atrasados. Leia `R8` como **obsolescência, não quebra**. O método completo, a tabela por repo, os comandos de reprodução e o canal de correção estão em [`THIRD-PARTY-RK-SCAN.md`](THIRD-PARTY-RK-SCAN.md); a base legível por máquina de 2026-09-10 está em `data/rk-scans.json`.

**Não é certificação, nem avaliação, e não diz nada sobre a segurança de um plugin**: um aprovado significa apenas que «as 23 verificações estáticas não reportaram nenhuma falha naquele commit». Método: clones somente leitura, **execução zero** de código de terceiros, R2/R4 listados à parte e fora do portão; a cobertura `lib-fallback` é real mas não equivalente, e K3–K7 podem subnotificar. Qualquer repositório nomeado no relatório pode abrir uma issue pelo canal de correção e a linha é reexecutada e corrigida no mesmo lugar com a mesma proeminência.

## Configuração

O `dsh-clinic` não tem **nenhum Config schema** próprio: os ajustes são as flags da CLI e os seis parâmetros da metade anfitriã. Os padrões servem para CI; um portão estático offline precisa apenas de `--only R,K --no-smoke`.

Flags comuns da CLI:

| Flag | Padrão | Significado |
|---|---|---|
| `--repo <path>` | obrigatório | caminho do repositório do plugin (árvore de fontes, ou diretório de pacote instalado / artefato tarball desempacotado) |
| `--only <groups>` | todos | executar apenas os grupos indicados: `R`, `K`, `D`, `CC` (aliases ASCII sem diferenciar maiúsculas; os nomes completos em chinês também funcionam) |
| `--no-smoke` | desligado | pular o smoke dinâmico em sandbox; apenas estáticas e listagens (portão estático offline/CI) |
| `--dsh <version>` | piso de peers | versão de host usada pelo smoke; por padrão a linha publicada mais recente no npm |
| `--json <path>` | — | gravar o relatório em arquivo; `-` significa stdout (suprime o relatório legível) |
| `--format check` | doctor | visão de contrato de três valores (PASS/WARN/FAIL + 0/1/2, `checks[]` plano) |
| `--workspace <root>` | automático | workspace familiar com os repos irmãos (para CC1–CC5 e K14) |
| `--allow-degraded` | desligado | aceitar explicitamente «o grupo inteiro nunca rodou»; o padrão é saída 6 |
| `--no-nested-activation` | ativo | desativa K15 (spec de ativação aninhada) |
| `--no-thinking` | ativo | desativa K16 (uso de temperature/top_p no modo de pensamento) |

<details>
<summary>Parâmetros da metade anfitriã (<code>plugin_doctor</code> / <code>/doctor</code>)</summary>

| Parâmetro | Padrão | Significado |
|---|---|---|
| `repo` (obrigatório) | — | caminho do repositório do plugin (precisa de `package.json`) |
| `smoke` | `false` | executar também o smoke de sandbox do grupo D (precisa de rede + pnpm) |
| `host` | `true` | executar o grupo X (contratos do anfitrião); degrada se não houver instalação do dsh legível |
| `workspace` | automático | diretório do workspace familiar (o pai que contém vários repos de plugins `dsh-*`) para CC1–CC5 e K14; resolvido para cima a partir do repositório por padrão, e `DSH_WORKSPACE` também funciona |
| `nestedActivation` | `true` | executa K15; equivale a `--no-nested-activation` na CLI |
| `thinking` | `true` | executa K16; equivale a `--no-thinking` na CLI |

</details>

Superfície completa de comandos (flags de manutenção como `--purge` não estão na tabela acima):

```powershell
node doctor.mjs --repo <caminho-do-repo>       # execução completa (inclui smoke dinâmico; precisa de rede + pnpm)
node doctor.mjs --repo <caminho> --no-smoke     # apenas estáticas + listagens
node doctor.mjs --repo <caminho> --dsh 0.2.2-alpha.3 # versão do host do smoke (padrão: linha publicada mais recente)
node doctor.mjs --repo <caminho> --only R,K     # apenas as duas camadas estáticas (aliases ASCII recomendados)
node doctor.mjs --repo <caminho> --json report.json
node doctor.mjs --repo <caminho> --json -       # JSON para stdout (suprime o relatório legível)
node doctor.mjs --repo <caminho> --format check --json -   # visão de contrato de três valores (PASS/WARN/FAIL + 0/1/2)
node doctor.mjs --repo <caminho> --workspace <raiz-do-workspace>   # workspace com os repos irmãos (usado pelo grupo CC)
node doctor.mjs --repo <caminho> --allow-degraded # aceitar explicitamente «o grupo inteiro nunca rodou» (saída 6 por padrão)
node doctor.mjs --purge <diretório-de-quarentena> # limpar diretórios de quarentena criados por esta ferramenta (somente doctor-quarantine-*)
```

## FAQ

<details>
<summary>Ele mexe no meu repositório ou ambiente?</summary>

Não. R/K/CC estáticos só leem a árvore commitada: sem instalar dependências, sem executar o código sob teste; a varredura de terceiros é um clone somente leitura. O grupo D mantém seu `DSH_HOME`/`DSH_AGENTS_HOME` temporário dentro de um sandbox próprio em `%TEMP%` (prefixo `doctor-`, que **não se sobrepõe** ao template protegido do host `%TEMP%\dsh-*`), e `dsh plugin add` sempre recebe `--ignore-scripts`, então os scripts install/prepare do pacote testado nunca executam no host. No fim a execução **coloca em quarentena em vez de apagar** (renomeia para `%TEMP%\doctor-quarantine-*`), e a remoção fica para `--purge` após confirmação humana. Caminhos absolutos vistos em execução são substituídos por `<path>` antes de chegar ao JSON ou ao texto renderizado.

</details>

<details>
<summary>Um PASS é certificação ou avaliação de segurança?</summary>

Não. Um aprovado significa apenas que «as verificações estáticas pedidas não reportaram falhas naquele commit». O grupo K é uma **varredura estática heurística**: wrappers complexos podem escapar e falsos alarmes são possíveis; D3 só prova que a composição inicia até uma requisição ao modelo, não que os schemas de ferramentas sejam válidos ou a lógica de negócio correta; uma falha de `R8` é lida como «linha de peers obsoleta», não «plugin quebrado». Esta ferramenta não faz auditoria de segurança, e o bloco `dsh.standards` é um marcador `not-run`, não um aprovado.

</details>

<details>
<summary>Como rodo na CI? Precisa de rede?</summary>

O portão estático não precisa de rede: `npx --yes dsh-clinic@0.8.1 --repo . --no-smoke --only "R,K"`, e então ramifique pelo código de saída ou pelo JSON. Só o smoke do grupo D precisa de rede e pnpm. A ação completa está em [`plugin-doctor.yml`](plugin-doctor.yml): lê apenas a árvore commitada, auto-verifica que R0/K1 rodaram de verdade e lista R2/R4 à parte em vez de exigi-los (eles leem artefatos construídos).

</details>

<details>
<summary>Uma execução degradada ou saltada pode gerar verde falso?</summary>

Não. Um nome de grupo que não casa em `--only` → imediatamente saída 2; um grupo pedido que nunca rodou de verdade → saída 6; em `--format check` um skip nunca é renderizado como `PASS` (vira `WARN` com `skipped: true`). Se você realmente quiser aceitar a degradação, use `--allow-degraded`: o código cai para 0, mas o `degraded` do JSON continua não vazio e a metade anfitriã nomeia os grupos na resposta.

</details>

<details>
<summary>Por que ainda existe um dsh-plugin-doctor no npm?</summary>

Porque é outro projeto. Este repositório passou de `@perrylink/dsh-plugin-doctor` para `dsh-clinic`; o nome npm simples `dsh-plugin-doctor` (0.1.1) pertence a Xrainsmile/DSH-Plugin-Doctor, então `npx dsh-plugin-doctor` executa o pacote de outra pessoa. Use `npx dsh-clinic@<version>` (ou `dsh plugin add dsh-clinic`). O pacote antigo com escopo e o repo antigo do GitHub permanecem como ponteiros.

</details>

## Limites de segurança

- **Estático e somente leitura.** R/K/CC e a varredura de terceiros só leem o sistema de arquivos; nada escreve no repositório sob teste fora dos testes. As únicas escritas são o sandbox próprio em `%TEMP%` e os diretórios de quarentena.
- **Sandbox descartável.** O `DSH_HOME`/`DSH_AGENTS_HOME` temporário do grupo D vive sob `%TEMP%\doctor-*` e nunca toca o `~/.dsh` real (linha vermelha 3).
- **Sem scripts de instalação do pacote testado.** `dsh plugin add` passa explicitamente `--ignore-scripts`; um bloco `ignored-builds` do pnpm é classificado como `environment` (não conta como aprovado nem como defeito do plugin).
- **Quarentena, não exclusão.** O stdout/stderr de cada subprocesso vai para `%TEMP%\doctor-run-*\logs\`; no fim a execução renomeia para `%TEMP%\doctor-quarantine-*`, imprime esse caminho no pé do relatório e deixa a remoção para `--purge` após confirmação humana (linha vermelha 4, a regra de três etapas).
- **Redação de caminhos.** Caminhos absolutos vistos em execução viram `<path>` antes de entrar no JSON ou no texto renderizado, então um relatório pode ser commitado no repo de outra pessoa sem disparar o portão de vazamento de caminhos dela.
- **Falha fechada, sem verde falso.** Grupo desconhecido/opção desconhecida → 2; um grupo inteiro que nunca rodou → 6; a degradação precisa ser aceita explicitamente com `--allow-degraded`; um `skip` nunca é escrito como `pass`.

## Limitações conhecidas

- O grupo K é uma **varredura estática heurística**: K1/K3/K4 perdem wrappers complexos e também podem dar falsos alarmes; todo achado de nível warn precisa de olhar humano e nunca condena um plugin automaticamente.
- D3 só prova que «a composição inicia até uma requisição ao modelo»; **não prova que os schemas de ferramentas sejam válidos nem que a lógica de negócio esteja correta** (isso precisa de uma execução e2e com chave ou de um LLM simulado).
- Um bloco `ignored-builds` do pnpm é um problema de receita de ambiente: quando D1 o encontra, a verificação degrada para warn e imprime a receita `allowBuilds` do `compat.yml`, alinhada à linha environment-blocked do spec v1 de certificação, e nunca conta como defeito do plugin.
- Hosts da linha npm (0.1.2-rc.1) não têm aplicação de engines/peerDependencies no packument, então R6 é apenas recomendatório ali.
- Uma armadilha medida neste ambiente: uma âncora `$` (sem a flag `m`) não casa com a posição antes de um `\r` final solitário, então analisar texto CRLF deve dividir por `/\r?\n/` (já tratado internamente — não regrida).
- **Cruzamento de padrões.** R/K/D — com X como evidência complementar — mapeiam apenas para a linha de base de compatibilidade **DSH-ENTRY**; o envelope JSON agora carrega um campo aditivo `standards` (`dsh-levels/1`). DSH-FLOW (`J1–J8`) é `manual` e DSH-BOOST (`LEV-1..LEV-8`) é `not-measured` — esta ferramenta não executa jornadas de usuário nem benchmarks — e os níveis não são um padrão oficial da DeepSeek. Veja [`STANDARDS.md`](STANDARDS.md) e `data/standards.json`.

## Compatibilidade

| Superfície | Status |
|---|---|
| Harness | DeepSeek Harness `dsh-v0.2.2-alpha.3` (linha de base atualizada em 2026-11-03; sem dependências e agnóstico ao host por design: o `package.json` não declara nenhuma dependência `@deepseek-ai/dsh-*` nem faixa de peers, então as verificações `R5`/`R8` deste repositório são saltadas de propósito em vez de passar — veja `SELF-CHECK.md`; o registro dessa linha está no `CHANGELOG.md` §0.4.6, «host pins move to `0.2.1-alpha.1`», e o smoke de sandbox do grupo D toma seu host de `--dsh`, por padrão o piso de peers `0.1.2-rc.1`) |
| Node | `>=24.9.0` |

## Ecossistema e qualidade

- [Página do dshfind](https://dshfind.com/plugins/PerryLink/dsh-clinic) (instalações e ranking)
- [Base de conhecimento do ecossistema](https://perrylink.github.io/dsh-plugin-guide/): guia de desenvolvimento · dados de seleção · critérios de manutenção
- [Repositório dsh-standards](https://github.com/PerryLink/dsh-standards): o padrão da família com o qual os critérios desta ferramenta se cruzam
- [Relatório da varredura R+K de terceiros](THIRD-PARTY-RK-SCAN.md): 60 candidatos → 20 plugins qualificados → 10 aprovados / 10 reprovados (2026-09-10); nova varredura em 2026-09-23: 19 → 6 aprovados / 13 reprovados
- **Estado honesto**: 43 repos da família já trazem o portão (o registro `data/verified-repos.json` lista 40 agora; o template do portão foi unificado byte a byte em 2026-09-23/24); **ainda não há adotantes externos** — o que limita este projeto é a adoção, não a cobertura de catálogos (raciocínio em [`OUTREACH.md`](OUTREACH.md) §C4). As publicações saem pelo npm Trusted Publishing (OIDC), sem token de longa duração. Todas as mudanças da 0.2.0 são aditivas e foram validadas contra a base de 37 repos com diffs = 0.
- **Canal da loja 1024**: primeiro `npm i -g dsh1024`, depois `dsh1024 plugin --profile web add dsh-clinic` (conta para o ranking de instalações do [deepseek1024.com](https://deepseek1024.com))

## Desenvolvimento

```sh
npm install
npm test                      # checagens de sintaxe + 14 autotestes + suítes contract/drift/compat
npm run check:readmes         # portão de consistência dos README em cinco idiomas (modo A)
npm run test:host-surface     # os dados da superfície de serviços batem com a linha de base 0.2.2-alpha.3
npm run check:cross-repo      # portão mensal K14 entre repos (monta a família a partir de tarballs publicados)
node scripts/check-release-health.mjs --repo . --no-registry   # saúde da publicação (offline)
npm run verify:registry       # atualização do registro e dos selos do Caminho B (API do GitHub somente leitura)
npm run badge                 # re-renderizar o SVG verificado
```

### Estrutura do repositório

```text
doctor.mjs               entrada da CLI (orquestração de grupos, códigos de saída, relatório JSON)
plugin.mjs               metade anfitriã (ferramenta plugin_doctor + comando /doctor)
cordis.patch.yml         declaração do bundle (insere uma linha; sem chaves de configuração)
lib/framework.mjs        registro/execução/veredicto/renderização de verificações (sem dependências)
lib/util.mjs             sandbox temporário + execução de subprocessos (stdout/stderr em disco, evitando limites de captura por pipe)
lib/workspace.mjs        localização do workspace familiar
lib/checks-package.mjs   estático · estrutura do pacote R0–R8
lib/checks-cordis.mjs    estático · contrato Cordis K1–K16
lib/checks-runtime.mjs   verificações X do contrato do anfitrião
lib/checks-smoke.mjs     dinâmico · smoke em sandbox D0–D3, D9
lib/checks-collections.mjs  ecossistema · listagens de diretório CC1–CC5
tests/selftest.mjs       14 autotestes de CLI real (os 7 casos existentes do contrato de exit code idênticos byte a byte, mais 7 casos novos de degradação/guarda de uso)
tests/contract.mjs       31 testes de contrato (congelam os 5 observáveis dos quais a CI dos 37 repos existentes depende)
scripts/check-readme-sync.mjs  portão de README em cinco idiomas (modo A: principal chinês + inglês)
scripts/verify.mjs       atualização do registro verificado e dos selos (lê a API do GitHub para auditar o portão de cada repo)
scripts/badge.mjs        renderização do SVG verificado
scripts/check-cross-repo.mjs    portão mensal K14 entre repos (monta a família a partir de tarballs publicados)
scripts/check-release-health.mjs saúde da publicação (portadores de versão, registro, procedência, tarball)
scripts/gen-readme-assets.py     imagens README programáticas (Python + Pillow)
data/verified-repos.json repos declarantes verificados
data/verified.json       registro verificado
badges/                  selos verificados
THIRD-PARTY-RK-SCAN.md   conjunto de resultados da varredura estática R+K de terceiros (relatório público)
data/rk-scans.json       forma legível por máquina dessa varredura (base 2026-09-10)
SURVEY.md                a metodologia de detecção de todos os canais mais a fonte de cada critério
SPEC.md                  os critérios normativos de verificação (escritos por PerryLink)
GOVERNANCE.md            autoria, versionamento do spec e que atribuição é pedida versus exigida
NOTICE                   aviso de atribuição Apache-2.0 (deve viajar com redistribuições)
CITATION.cff             metadados de citação
plugin-doctor.yml        o portão de CI canônico, distribuído pronto para copiar no seu repo
FOR-ADOPTERS.md          página de entrada do adotante: portão, selo, veredictos, limites
SELF-CHECK.md            o resultado desta ferramenta contra seus próprios critérios
OUTREACH.md              notas de adoção: estados de canal, posicionamento, ações
```

### Saúde da publicação

Um workflow de release verde não prova uma publicação correta. Em 2026-10-05 a família publicou 37 pacotes e as falhas que importavam eram invisíveis na cor do job: 36 CHANGELOGs carregavam a data literal `undefined`, dois pacotes publicaram com sucesso e ainda assim terminaram vermelhos, um falhou com `ENEEDAUTH` porque o binding de trusted-publisher do npm nomeava um arquivo de workflow que não realiza mais a troca OIDC, e um nunca chegou ao npm porque seu portão `verify` pré-publicação falhou primeiro e o job de publish ficou `skipped`.

O `scripts/check-release-health.mjs` verifica as quatro coisas que cobrem todos esses casos:

| Pass | Pergunta | Precisa de rede? |
|---|---|---|
| LOCKSTEP | todo portador de versão do repo concorda com o `package.json`? | não |
| PUBLISHED | a versão local é a que está no registro? | sim |
| PROVENANCE | qual arquivo de workflow publicou, e ele é um arquivo de publicação atual? | sim |
| FILES | o tarball publicado ainda carrega `src/`, `lib/` ou `dist/`? | sim |

```sh
# um repositório, offline (o modo que um repo a jusante deveria usar na própria CI)
node scripts/check-release-health.mjs --repo . --no-registry

# toda a família declarada, a partir do registro, sem fazer checkout de nada
node scripts/check-release-health.mjs --roster data/verified-repos.json
```

Códigos de saída: `0` saudável, `1` pelo menos um problema, `2` erro de uso. `--json <path>` grava o relatório legível por máquina, `--quiet` imprime só falhas. Ambos os comandos podem ser ligados à sua própria CI.

Apenas duas formas de portador fazem a verificação falhar, porque só duas são afirmadas em toda a família: o `VERSION` exportado de `src/version.ts`, e um arquivo `VERSION` onde existir. Uma diferença de versão no `SKILL.md` é reportada como nota — a maioria das skills versiona de forma independente.

### Regenerar as imagens

`docs/assets/dsh-clinic-hero-{zh,en}-{light,dark}.webp` e `docs/assets/dsh-clinic-flow-v5-{light,dark}.svg` são gerados programaticamente por [`scripts/gen-readme-assets.py`](scripts/gen-readme-assets.py) (Pillow para o hero, SVG escrito à mão para a figura de estrutura; a ausência de uma fonte aborta com erro). O hero existe em zh/en; a figura de estrutura contém apenas tokens de comando (nomes de grupo, comandos, códigos de saída) e é compartilhada pelos cinco idiomas. Reexecutar:

```sh
python scripts/gen-readme-assets.py
```

Este repositório não tem dados de benchmark, então nenhum gráfico de barras de evidência é gerado; os números medidos acima são citados diretamente do relatório de varredura.

## Família e agradecimentos

Este projeto faz parte da família de plugins do DeepSeek Harness da [PerryLink](https://github.com/PerryLink) (95 plugins, todos Apache-2.0). Se ele for útil, **dê uma estrela**: isso não desbloqueia nada, mas ajuda a próxima pessoa a encontrá-lo.

### Autoria dos critérios

Os critérios de verificação — não apenas a ferramenta que os implementa — foram escritos por **PerryLink** (<https://github.com/PerryLink>). Seu texto normativo é [`SPEC.md`](SPEC.md), e este repositório é a fonte canônica tanto da especificação quanto da implementação de referência. Veja [`GOVERNANCE.md`](GOVERNANCE.md) para saber como os critérios mudam e que atribuição é pedida (versus a exigida pelo Apache-2.0 §4(d) via [`NOTICE`](NOTICE)).

Adotar o portão não precisa de permissão. Se você adotar, mantenha os critérios atribuídos à PerryLink e não os apresente como seu próprio padrão.

<details>
<summary>Expandir todos os plugins</summary>

| Plugin | Status |
|---|---|
| **[dsh-aqua-input-check](https://github.com/PerryLink/dsh-aqua-input-check)** |  |
| **[dsh-archive-check](https://github.com/PerryLink/dsh-archive-check)** |  |
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** |  |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** | 🧊 CONGELADO — ver o README do repo |
| **[dsh-bid-ca-precheck](https://github.com/PerryLink/dsh-bid-ca-precheck)** |  |
| **[dsh-bid-qual-check](https://github.com/PerryLink/dsh-bid-qual-check)** |  |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** | 🧊 CONGELADO — ver o README do repo |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** |  |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** |  |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** |  |
| **[dsh-contract-stance](https://github.com/PerryLink/dsh-contract-stance)** |  |
| **[dsh-customs-doc-check](https://github.com/PerryLink/dsh-customs-doc-check)** |  |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** | 🧊 CONGELADO — ver o README do repo |
| **[dsh-demurrage-ledger](https://github.com/PerryLink/dsh-demurrage-ledger)** |  |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** |  |
| **[dsh-drill-script-check](https://github.com/PerryLink/dsh-drill-script-check)** |  |
| **[dsh-eia-guide-check](https://github.com/PerryLink/dsh-eia-guide-check)** |  |
| **[dsh-emergency-plan](https://github.com/PerryLink/dsh-emergency-plan)** |  |
| **[dsh-essay-rubric-check](https://github.com/PerryLink/dsh-essay-rubric-check)** |  |
| **[dsh-evidence-check](https://github.com/PerryLink/dsh-evidence-check)** |  |
| **[dsh-export-ctl-check](https://github.com/PerryLink/dsh-export-ctl-check)** |  |
| **[dsh-fast](https://github.com/PerryLink/dsh-fast)** |  |
| **[dsh-fmea-table-check](https://github.com/PerryLink/dsh-fmea-table-check)** |  |
| **[dsh-forecast-penalty](https://github.com/PerryLink/dsh-forecast-penalty)** |  |
| **[dsh-fund-research](https://github.com/PerryLink/dsh-fund-research)** |  |
| **[dsh-github](https://github.com/PerryLink/dsh-github)** |  |
| **[dsh-gongwen-flow-check](https://github.com/PerryLink/dsh-gongwen-flow-check)** |  |
| **[dsh-gongwen-word-check](https://github.com/PerryLink/dsh-gongwen-word-check)** |  |
| **[dsh-guard-plan-qc](https://github.com/PerryLink/dsh-guard-plan-qc)** |  |
| **[dsh-hazchem-check](https://github.com/PerryLink/dsh-hazchem-check)** |  |
| **[dsh-hazplan-check](https://github.com/PerryLink/dsh-hazplan-check)** |  |
| **[dsh-hidden-risk-map](https://github.com/PerryLink/dsh-hidden-risk-map)** |  |
| **[dsh-hs-classify](https://github.com/PerryLink/dsh-hs-classify)** |  |
| **[dsh-icd-rule-check](https://github.com/PerryLink/dsh-icd-rule-check)** |  |
| **[dsh-industry-research](https://github.com/PerryLink/dsh-industry-research)** |  |
| **[dsh-lawcite-adapter](https://github.com/PerryLink/dsh-lawcite-adapter)** |  |
| **[dsh-laya](https://github.com/PerryLink/dsh-laya)** |  |
| **[dsh-lc-doc-check](https://github.com/PerryLink/dsh-lc-doc-check)** |  |
| **[dsh-learning-gap-check](https://github.com/PerryLink/dsh-learning-gap-check)** |  |
| **[dsh-library](https://github.com/PerryLink/dsh-library)** |  |
| **[dsh-local-ai](https://github.com/PerryLink/dsh-local-ai)** |  |
| **[dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions)** |  |
| **[dsh-mask](https://github.com/PerryLink/dsh-mask)** |  |
| **[dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel)** |  |
| **[dsh-medrec-qc](https://github.com/PerryLink/dsh-medrec-qc)** |  |
| **[dsh-memento](https://github.com/PerryLink/dsh-memento)** | 🧊 CONGELADO — ver o README do repo |
| **[dsh-nsfc-form-check](https://github.com/PerryLink/dsh-nsfc-form-check)** |  |
| **[dsh-nurse-record-check](https://github.com/PerryLink/dsh-nurse-record-check)** |  |
| **[dsh-observe](https://github.com/PerryLink/dsh-observe)** |  |
| **[dsh-origin-rvc-check](https://github.com/PerryLink/dsh-origin-rvc-check)** |  |
| **[dsh-ota-review-check](https://github.com/PerryLink/dsh-ota-review-check)** |  |
| **[dsh-output-styles](https://github.com/PerryLink/dsh-output-styles)** |  |
| **[dsh-paper-doc-adapter](https://github.com/PerryLink/dsh-paper-doc-adapter)** |  |
| **[dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules)** |  |
| **[dsh-permit-report-check](https://github.com/PerryLink/dsh-permit-report-check)** |  |
| **[dsh-pipeline-check](https://github.com/PerryLink/dsh-pipeline-check)** |  |
| **[dsh-pleading-draft](https://github.com/PerryLink/dsh-pleading-draft)** |  |
| **[dsh-clinic](https://github.com/PerryLink/dsh-clinic)** |  |
| **[dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide)** |  |
| **[dsh-plugin-kit](https://github.com/PerryLink/dsh-plugin-kit)** | 🚫 APOSENTADO (repo arquivado) |
| **[dsh-plugin-upgrade](https://github.com/PerryLink/dsh-plugin-upgrade)** | 🚫 APOSENTADO (repo arquivado) |
| **[dsh-policy-brief-draft](https://github.com/PerryLink/dsh-policy-brief-draft)** |  |
| **[dsh-power-loss-split](https://github.com/PerryLink/dsh-power-loss-split)** |  |
| **[dsh-power-ticket-check](https://github.com/PerryLink/dsh-power-ticket-check)** |  |
| **[dsh-ppap-check](https://github.com/PerryLink/dsh-ppap-check)** |  |
| **[dsh-protest-deadline](https://github.com/PerryLink/dsh-protest-deadline)** |  |
| **[dsh-railway-window](https://github.com/PerryLink/dsh-railway-window)** |  |
| **[dsh-repair-order-qc](https://github.com/PerryLink/dsh-repair-order-qc)** |  |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** |  |
| **[dsh-review-reply-check](https://github.com/PerryLink/dsh-review-reply-check)** |  |
| **[dsh-rulefile-check](https://github.com/PerryLink/dsh-rulefile-check)** |  |
| **[dsh-safety-brief-check](https://github.com/PerryLink/dsh-safety-brief-check)** |  |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** | 🧊 CONGELADO — ver o README do repo |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** |  |
| **[dsh-site-log-check](https://github.com/PerryLink/dsh-site-log-check)** |  |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** |  |
| **[dsh-soe-decision-check](https://github.com/PerryLink/dsh-soe-decision-check)** |  |
| **[dsh-soilwater-check](https://github.com/PerryLink/dsh-soilwater-check)** |  |
| **[dsh-sop-sync-check](https://github.com/PerryLink/dsh-sop-sync-check)** |  |
| **[dsh-spc-gbt-adapter](https://github.com/PerryLink/dsh-spc-gbt-adapter)** |  |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** |  |
| **[dsh-tender-extract](https://github.com/PerryLink/dsh-tender-extract)** |  |
| **[dsh-tender-matrix](https://github.com/PerryLink/dsh-tender-matrix)** |  |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** |  |
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** | 🚫 APOSENTADO (repo arquivado) |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** |  |
| **[dsh-warranty-calc](https://github.com/PerryLink/dsh-warranty-calc)** |  |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | 🧊 CONGELADO — ver o README do repo |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | 🧊 CONGELADO — ver o README do repo |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | 🧊 CONGELADO — ver o README do repo |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | 🧊 CONGELADO — ver o README do repo |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | 🧊 CONGELADO — ver o README do repo |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | 🚫 APOSENTADO (repo arquivado) |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | 🚫 APOSENTADO (repo arquivado) |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | 🚫 APOSENTADO (repo arquivado) |
</details>

## Licença

[LICENSE](LICENSE) (Apache License 2.0) © 2026 dsh-clinic contributors

<p align="center"><sub>Apache-2.0 · Ferramenta da comunidade, sem vínculo com a DeepSeek.</sub></p>
