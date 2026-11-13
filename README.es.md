<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/dsh-clinic-hero-en-dark.webp">
  <img src="docs/assets/dsh-clinic-hero-en-light.webp" width="100%" alt="dsh-clinic: acepta un plugin DSH en una sola ejecución — estructura del paquete, contrato cordis, arranque en sandbox y listados, con veredicto en seis estados y códigos de salida 0–6">
</picture>

# dsh-clinic

**Acepta un plugin de DSH en una sola ejecución: estructura del paquete, contratos cordis, arranque en sandbox y listados de directorio.**

Un comprobador «integridad + salud en tiempo de ejecución» sin dependencias para plugins de DeepSeek Harness: las dos capas estáticas corren sin red, el smoke dinámico arranca una composición en un sandbox desechable y el veredicto se lee en el código de salida.

[Instalación](#instalación-en-tres-pasos) · [Configuración](#configuración) · [FAQ](#faq) · [简体中文](README.md) · [English](README.en.md) · [Español](README.es.md) · [Português](README.pt.md) · [हिन्दी](README.hi.md)

[![License](https://img.shields.io/badge/license-Apache--2.0-3366CC?style=flat-square&labelColor=2B3245)](LICENSE)
[![DSH](https://img.shields.io/badge/DSH-%E2%89%A50.2.1%20%3C0.3.0-4B67B4?style=flat-square&labelColor=2B3245)](#compatibilidad)
[![npm](https://img.shields.io/npm/v/dsh-clinic?style=flat-square&labelColor=2B3245&color=CB3837)](https://www.npmjs.com/package/dsh-clinic)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-clinic/smoke.yml?branch=main&label=CI&style=flat-square&labelColor=2B3245)](https://github.com/PerryLink/dsh-clinic/actions/workflows/smoke.yml)
[![Node](https://img.shields.io/badge/node-%3E%3D24.9-339933?style=flat-square&labelColor=2B3245)](#compatibilidad)

[![Stars](https://img.shields.io/github/stars/PerryLink/dsh-clinic?style=flat-square&labelColor=2B3245)](https://github.com/PerryLink/dsh-clinic/stargazers)
[![npm downloads](https://img.shields.io/npm/dm/dsh-clinic?style=flat-square&labelColor=2B3245&color=CB3837)](https://www.npmjs.com/package/dsh-clinic)
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-clinic?metric=downloads)](https://dshfind.com/plugins/PerryLink/dsh-clinic?ref=badge)

```sh
dsh plugin --profile <name> add dsh-clinic
```

</div>

<sub>Herramienta comunitaria, sin relación con DeepSeek y no es una certificación, auditoría ni aval oficial; el bloque `dsh.standards` es un marcador `not-run`, no un aprobado. Repositorio canónico: <https://github.com/PerryLink/dsh-clinic> (antes `@perrylink/dsh-plugin-doctor`; el repo antiguo queda como puntero).</sub>

## Qué es

`dsh-clinic` divide «¿se puede instalar este plugin, puede arrancar, lo rechazará un directorio?» en cuatro capas legibles: **R estructura del paquete → K contratos cordis → D smoke en sandbox → CC listados de directorio**. R y K solo leen el árbol confirmado —sin instalar dependencias ni usar la red—; D ejecuta de verdad `npm pack` y arranca un perfil sin credenciales en un sandbox de un solo uso hasta la petición al modelo; CC contrasta las restricciones reales de cinco directorios/registros del ecosistema. Una ejecución produce un veredicto de seis estados (pass / warn / info / skip / fail / error) y siete códigos de salida, así que la CI puede ramificar por el código.

Los criterios no son improvisados: vienen de tres líneas de investigación de primera mano fechadas el 2026-09-07 —la documentación y el código de deepseek-harness, los contratos de código de cordiverse/cordis y un inventario de todos los canales de distribución del espacio de trabajo (texto completo y cada cita en [`SURVEY.md`](SURVEY.md))—. No sustituye a las pruebas ni es una auditoría de seguridad: convierte lo que puede juzgarse estáticamente en una puerta reproducible.

**📖 Base de conocimiento del ecosistema** (datos medidos, no marketing): [guía de desarrollo · datos de selección · criterios de mantenimiento](https://perrylink.github.io/dsh-plugin-guide/).

### Confusión de nombres (importante)

En 2026-11 este repositorio pasó de **`@perrylink/dsh-plugin-doctor`** a **`dsh-clinic`**; el paquete npm con scope antiguo y el repo antiguo de GitHub quedan como punteros/respaldos. Hay otros proyectos con el mismo nombre: no instales el equivocado.

- El nombre npm simple **`dsh-plugin-doctor`** (0.1.1) pertenece a **Xrainsmile/DSH-Plugin-Doctor**, no a este repo. **Nunca ejecutes `npx dsh-plugin-doctor`**: ejecuta el paquete de otra persona.
- El paquete npm de este repo ahora es **`dsh-clinic`**; `npx dsh-clinic@<version>` y `dsh plugin add dsh-clinic` apuntan a él.
- Diez repos de GitHub llevan `dsh-plugin-doctor` en el nombre (ocho exactamente), p. ej. `zoahdev/dsh-plugin-doctor` (solo GitHub, nunca publicado en npm).
- El README de [`dsh-testkit`](https://github.com/PerryLink/dsh-testkit) enlaza el nombre antiguo al repo de zoahdev; no tiene relación con este.

En una línea: **sin dependencias, capaz de operar sin conexión (`--only R,K`), y convierte los contratos cordis v4 (K1–K16) y cinco listados de directorio del ecosistema (CC1–CC5) en una puerta de CI cuyo veredicto se lee en el código de salida.** (Sin afirmaciones del tipo «el único»: solo que no apareció nada comparable dentro del conjunto de herramientas realmente examinado.)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/dsh-clinic-flow-v5-dark.svg">
  <img src="docs/assets/dsh-clinic-flow-v5-light.svg" width="100%" alt="Estructura de dsh-clinic (un embudo): cinco fuentes de evidencia R/K/D/CC/X entran en un embudo, cada comprobación cae en uno de seis estados, el peor estado fija el veredicto y la salida da los códigos de salida 0–6">
</picture>

## Instalación en tres pasos

1. **Instalar** (elige un canal):

   ```sh
   # canal git (main más reciente; equivale a git+https://github.com/PerryLink/dsh-clinic.git)
   dsh plugin --profile web add github:PerryLink/dsh-clinic
   # canal npm (versiones publicadas)
   dsh plugin --profile web add dsh-clinic
   # canal tarball: pnpm pack en este repo y luego
   dsh plugin --profile web add ./dsh-clinic-<version>.tgz
   ```

   `package.json` declara `dsh.bundle.patch` → `cordis.patch.yml`, así que se instala como bundle de DSH y también funciona como CLI independiente (`node doctor.mjs` / `npx dsh-clinic`).

2. **Montar** (la forma bundle inserta una fila; no hacen falta claves de configuración):

   ```yaml
   - insert:
       - id: plugin-doctor
         name: 'dsh-clinic'
   ```

   La fila insertada carga este paquete bajo el contrato estándar de plugins de Cordis: la mitad anfitriona es un módulo ESM normal que exporta `apply(ctx)` (su `inject` declara `tools` y `commands`). El paquete no incluye interfaz de navegador, así que no hay declaración `dsh.client`.

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

   **Desinstalar**: `dsh plugin --profile web remove dsh-clinic` (o borra la fila del patch del perfil). El uso de la CLI no se ve afectado.

## Capacidades clave

Las mismas comprobaciones tienen dos entradas: la CLI (`doctor.mjs`, con códigos de salida) y la mitad anfitriona (herramienta `plugin_doctor` / comando `/doctor`, que devuelve el informe completo). Cuatro grupos centrales:

- **R | estructura del paquete (R0–R8)** — campos base; la puerta de activación `dsh.bundle.patch` (crítica); si `npm pack --dry-run` incluye entrada y patch; estructura de `cordis.patch.yml`; exportaciones `name`/`apply` de la entrada; política de dependencias rescopeadas; alineación de `engines`; prebuild + lista blanca `files`; peers antiguos de rc.
- **K | contratos cordis (K1–K16)** — acceso a servicios vs declaración `inject`; la línea roja de serialización de datos vivos de `ctx`; temporizadores/listeners sin envolver en `ctx.effect`; Schema con función; forma de retorno de `apply` (contrato Effect v4); la costura del nombre de servicio `inject`; APIs heredadas de v3; Config debe ser un Standard Schema; el caso especial `name==='apply'`; K15 spec de activation anidada (el host ≥ 0.2.2-rc.3 la aplana, así que un prompt dentro de request deja de funcionar); K16 temperature/top_p sin reasoningEffort en modo pensamiento (se ignoran en silencio, INFO).
- **D | smoke en sandbox (D0–D3, D9)** — `npm pack` → `dsh plugin --profile headless add <tarball>` → afirmar que los bundles del perfil contienen el nombre del paquete → marcador de capa `--dump-config` → ejecución headless sin credenciales que debe **salir con 1 + `dsh: MISSING_CREDENTIAL`** (la composición arrancó hasta la petición al modelo) → limpieza del sandbox.
- **CC | listados de directorio (CC1–CC5)** — evidencia de cinco dimensiones del spec v1 del registro de certificación; campos/enums/descripciones del yml de adp-list; restricciones de entrada de dsh-catalog (comandos de instalación prohibidos, heurísticas de truncado); los cinco valores de activación de `dshWorkshop` en omdsh; las tres puertas de dsh-plugin-kit (license / README en cinco idiomas / los tres roles de costura).
- **X | contratos del anfitrión (evidencia complementaria)** — corredor de peers, superficie de servicios `inject`, localizabilidad de la fila del patch; degrada cuando no se puede leer una instalación de dsh y nunca finge un aprobado.

**GitHub Action**: el repositorio incluye `action.yml` en la raíz, así que un workflow puede llamarlo sin paso de instalación: `uses: PerryLink/dsh-clinic@main` (`with: only: R,K`); en producción, fija una etiqueta publicada.

### Catálogo de comprobaciones

| Grupo | Comprobaciones | Qué cubren los criterios |
|---|---|---|
| estático · estructura del paquete | R0–R8 | campos base; **la puerta de activación `dsh.bundle.patch` (crítica)**; el tarball contiene entrada y patch; estructura de `cordis.patch.yml`; exportaciones `name`/`apply`; política de dependencias rescopeadas (prohibido `cordis` pelado); `engines` alineado a la línea oficial; prebuild + lista blanca `files`; peers antiguos de rc (la lección de la doble base del 2026-09-05) |
| estático · contrato Cordis | K1–K16 | acceso a servicios vs declaración `inject`; línea roja de serialización de datos vivos de `ctx`; temporizadores/listeners sin `ctx.effect`; Schema con función; forma de retorno de `apply` (contrato Effect v4); costura del nombre de servicio `inject`; **APIs heredadas de v3 (lista de eliminación 3.x→4.x)**; Config debe ser Standard Schema; el caso especial `name==='apply'`; K15 spec de activation anidada (el host ≥ 0.2.2-rc.3 la aplana, así que un prompt dentro de request deja de funcionar); K16 temperature/top_p sin reasoningEffort en modo pensamiento (se ignoran en silencio, INFO) |
| dinámico · smoke en sandbox | D0–D3, D9 | `npm pack` → `dsh plugin --profile headless add <tarball>` → afirmar que `dsh.profile.bundles` contiene el nombre → marcador de capa `--dump-config` → ejecución headless sin credenciales que debe **salir con 1 + `dsh: MISSING_CREDENTIAL`** (se excluyen NO_ADAPTER / ERR_MODULE_NOT_FOUND / SyntaxError / TypeError) → limpieza del sandbox |
| ecosistema · listados de directorio | CC1–CC5 | evidencia de cinco dimensiones del spec v1; campos/enums/descripciones del yml de adp-list; restricciones de dsh-catalog (comandos de instalación prohibidos, heurísticas de truncado); los cinco valores de activación de `dshWorkshop`; las tres puertas de dsh-plugin-kit (license / README en cinco idiomas / tres roles de costura, prefiriendo la CLI oficial del kit) |

### Contrato de códigos de salida

| Código | Significado | Introducido |
|---|---|---|
| `0` | sin fail/error (se permiten warn/skip) y todos los grupos solicitados se ejecutaron de verdad | 0.1.x |
| `1` | hay fail/error (un defecto del plugin) | 0.1.x |
| `2` | error de uso, grupo desconocido, **opción desconocida** | 0.1.x |
| `3` | error de infraestructura (falta npm/pnpm y similares) | **0.2.0** |
| `4` | versión de host no soportada (el host no se pudo instalar; **no** es un veredicto del plugin) | **0.2.0** |
| `5` | resultado inestable (un paso agotó el tiempo o lo mató una señal) | **0.2.0** |
| `6` | **degradado**: un grupo solicitado nunca se ejecutó de verdad (p. ej. no hay archivos fuente que escanear) | **0.2.0** |

**Protección contra aprobados silenciosos** (dos capas):

1. Si un solo nombre de grupo en `--only` no coincide → inmediatamente `2`. Las versiones 0.1.4 y anteriores «no comprobaban nada + salían con 0» cuando un nombre de grupo se corrompía, lo que una vez convirtió las puertas de CI de 35 repos en verde falso (medido el 2026-09-09: `checks_run=0`, `exit=0`).
2. Desde 0.2.0: **un grupo solicitado cuyas comprobaciones se saltaron todas → `6`**. La implementación antigua solo cubría «no corrió ni una comprobación», no «corrió pero todo se saltó»; esto último dejaba que «grupo K con cobertura cero» contara como aprobado. Para aceptarlo explícitamente, usa `--allow-degraded` (el código baja a 0, pero `degraded` sigue no vacío en el JSON).

> ⚠️ Las puertas existentes de los 41 repos de la familia **no leen el código de salida** (sus workflows usan `set +e` / `out="$(…)"` / `set -e`) y solo analizan los prefijos `R0 ` / `K1 ` en stdout y `results[].name` en el JSON. Por eso los nuevos códigos de 0.2.0 **no cambian nada para esas tuberías**; sirven para uso interactivo y para integradores futuros.

### Mitad anfitriona: `plugin_doctor` / `/doctor`

Instalado como bundle, el plugin registra las mismas comprobaciones R/K/X como herramienta de solo lectura y como comando. Dos cosas difieren de la CLI, y ambas se declaran en la respuesta porque **la mitad anfitriona no tiene código de salida**: el informe devuelto es todo el mensaje.

- **Las ejecuciones degradadas lo dicen.** Cuando un grupo solicitado no llegó a ejecutarse de verdad, la respuesta lleva la misma advertencia de degradación que imprime la CLI, nombrando los grupos, para que una respuesta degradada nunca pueda leerse como aprobado.
- **`workspace` se resuelve desde el repositorio, no desde la instalación.** La herramienta sube desde el repositorio inspeccionado hasta el directorio más cercano que contenga dos o más repos de plugins DSH (`DSH_WORKSPACE` y el parámetro explícito tienen prioridad). Resolverlo como `import.meta.dirname/..` —como hacía 0.7.0— da `<profile>/node_modules` (o `…/@perrylink`) cuando el paquete está instalado como bundle, que no es un workspace en absoluto: CC1–CC4 entonces informan «no existe localmente» para registros que sí existen, y K14 nunca encuentra un repo hermano. Cuando no se puede localizar un workspace, la respuesta lo dice explícitamente, en lugar de dejar que esos skip se lean como registros ausentes.

Parámetros y valores por defecto en [Configuración](#configuración).

### Formas de destino y cobertura

`--repo` puede ser un **árbol de fuentes** o un **directorio de paquete instalado / artefacto tarball desempaquetado** (esto último es habitual en `node_modules/<pkg>`). Los criterios cambian con la forma:

| Forma | Grupo K (contrato Cordis) | Notas |
|---|---|---|
| Árbol de fuentes con `src/` | escanea `src/**` más JS de la raíz (`mode: src`) | completo |
| **Sin `src/`, `main` apunta a `lib/`** | **escaneo de respaldo de `lib/**` (`mode: lib-fallback`)** | corregido en 0.2.0: la implementación antigua se basaba en «sin script de build», pero los paquetes publicados **conservan** su script de build → el respaldo nunca se activaba, las nueve comprobaciones K se saltaban y aun así salía con 0 (verde falso) |
| Ni `src/` ni `lib/` | las nueve se saltan (`mode: none`) | **el grupo entero nunca se ejecutó → código de salida 6**, se acabó el verde falso |

La cobertura se escribe en `coverage.K` del JSON (`{filesInspected, mode}`) y se resume en `groups.K`.

### Grupos `--only` y alias ASCII

| Alias | Nombre completo del grupo | Contenido |
|---|---|---|
| `R` | estático · estructura del paquete | R0–R8 |
| `K` | estático · escaneo del contrato Cordis | K1–K16 |
| `D` | dinámico · smoke en sandbox | D0–D3, D9 |
| `CC` | ecosistema · listados de directorio | CC1–CC5 |

Los alias no distinguen mayúsculas y los nombres completos en chino siguen funcionando. **Usa los alias en los workflows**: si un editor o script hace ida y vuelta de un nombre de grupo chino con la codificación equivocada, `--only` no coincide con ningún grupo.

### La vista de contrato de tres valores (`--format check`)

`--format check` emite el contrato común de tres valores del ecosistema (`PASS`/`WARN`/`FAIL`, salida `0`/`1`/`2`, `checks[]` plano) en lugar del sobre más rico de este proyecto, para que otro comprobador o Action consuma el resultado directamente. Es una *vista*: nunca cambia si un proyecto aprueba, y un `skip` nunca se renderiza como `PASS` (se convierte en `WARN` con `skipped: true`). La semántica completa queda en el campo lateral `doctor`. Véase `SPEC.md` §1.1: esas tres propiedades son normativas y `tests/compat.mjs` las afirma.

### Ejemplos

**Ejemplo detallado** — comando `node doctor.mjs --repo . --no-smoke --only R,K`, salida:

```text
== 静态·包结构 ==
[PASS] R0 基础字段（name/version/license/README/type）
    基础字段齐全
[PASS] R1 激活门 dsh.bundle.patch [关键]
    dsh.bundle.patch = ./cordis.patch.yml
```

*Observed from `doctor.mjs` (Usage); `lib/framework.mjs:121` (render)*

**Rama de fallo** — entrada:

```text
node doctor.mjs --repo . --only NOPE --no-smoke
```

Salida:

```text
未知分组: NOPE
可用分组: 静态·包结构（R）, 静态·cordis 契约扫描（K）, 动态面·宿主契约（X）, 生态·集合站清单（CC）
```

*Observed from `doctor.mjs:196-206`; `tests/selftest.mjs:95`*

**Ejemplos breves**: `--only R,K` · `--json -` · `--format check`

### De dónde vienen los criterios

- **lado harness**: `docs/user/develop/basic/publish.md`, `apps/cli/src/plugin.ts` (la puerta de activación es el único interruptor), `packages/bundle/headless/README.md` (el criterio MISSING_CREDENTIAL), Releases (los cambios de 0.1.2-rc.1 / 0.1.3-alpha.1), `@deepseek-ai/dsh-loader-smoke` (el patrón oficial «DSH_HOME temporal + código de salida esperado»).
- **lado Cordis**: el código de cordiverse/cordis v4 (registry/fiber/reflect/events.ts) + los documentos cordis-primer/tutorial de DSH + el diff de d.ts de v3 `@cordisjs/core@3.10.2` (la lista negra 3.x→4.x).
- **lado ecosistema**: el spec v1 de dsh-plugin-certification, `entries.mjs`/`check-submission.mjs` de adp-list, el live smoke de `validate.mjs`/`deploy.yml` de dsh-catalog, build-submission de omdsh, `verify/*` de dsh-plugin-kit.

## Insignias verificadas

Hay **dos rutas de insignia** y hacen afirmaciones distintas. Elige la que realmente puedas respaldar. **[`FOR-ADOPTERS.md`](FOR-ADOPTERS.md) es la versión paso a paso de esta sección**: el archivo exacto que copiar, el markdown exacto de la insignia, qué significa cada veredicto y qué *no* demuestra esta comprobación.

### Ruta A — insignia de puerta autoinstalable (sin permiso, sin participación del autor)

Esta insignia hace **una afirmación estrecha y comprobable**: *el repositorio ejecuta la puerta estática R+K de dsh-clinic en su propia CI, y ese workflow está verde en la rama por defecto del repositorio.* Se renderiza directamente desde el estado de tu propio workflow —la insignia nativa de GitHub (la mostrada) o shields.io—, así que no necesita entrada en ningún registro, ni pull request, ni token de nadie, y no la puede romper la infraestructura de este proyecto:

```markdown
[![dsh-doctor R+K](https://github.com/<owner>/<name>/actions/workflows/plugin-doctor.yml/badge.svg)](https://github.com/PerryLink/dsh-clinic/blob/main/SPEC.md)
```

Sustituye `<owner>/<name>` (y `branch=` si tu rama por defecto no es `main`). El destino del enlace es `SPEC.md`: los criterios que afirmas cumplir y una declaración explícita de quién los escribió.

**Usa la Ruta A.** Es el estándar completo, autoinstalable, y para eso está diseñada esta especificación. No requiere nada de este proyecto.

Dos advertencias honestas sobre la Ruta A: la insignia refleja *tu* workflow, así que solo es tan fiable como tu configuración de CI —nadie más la verifica—; y si usas la forma de shields.io, shields.io conoce el nombre de tu repositorio.

### Ruta B — insignia auditada emitida por el autor

Llevar esta insignia significa exactamente una cosa auditable: **el repo ejecuta la puerta estática R+K de dsh-clinic (23 comprobaciones: R0/R1/R3/R5/R6/R7/R8 + K1–K16) en su propia CI, y esa puerta está verde en el HEAD actual de la rama por defecto**, *revisado por el auditor de este proyecto*. **No** es una insignia de certificación: sin Scorecard, sin procedencia, sin smoke de instalación. R2 (integridad del tarball) y R4 (contrato de entrada) leen el `lib/` construido, y construir la mayoría de los repos de la familia necesita `HARNESS_COMMIT` + `gen-aliases` —esas dos las cubre el `ci.yml` propio de cada repo (puerta de build-drift + pack smoke) y quedan deliberadamente fuera de esta puerta.

```markdown
[![dsh-doctor](https://raw.githubusercontent.com/PerryLink/dsh-clinic/main/badges/PerryLink__dsh-github.svg)](https://github.com/PerryLink/dsh-clinic/blob/main/README.es.md#insignias-verificadas)
```

**La Ruta B es un servicio centralizado de un solo operador y debe tratarse como tal.** Necesita un PAT fine-grained con lectura entre repositorios, guardado como secreto `DOCTOR_AUDIT_TOKEN` del repositorio. El `GITHUB_TOKEN` con alcance de workflow **no** puede sustituirlo: no tiene permiso de lectura entre repositorios, así que GitHub lo trata como llamante anónimo limitado a 60 peticiones/hora, mientras que una auditoría completa de los repos declarados necesita 200+. Sin el PAT, cada insignia se renderiza en gris `NO DATA`; el fallo parece un programa de insignias roto en vez de un secreto ausente. Ha ocurrido (primero `401`, luego `403 rate limit exceeded`), y es la razón de que exista la Ruta A y sea la recomendada. `scripts/verify.mjs` ahora se detiene en la primera respuesta de ese tipo, sale con `3` y escribe un registro cuyas razones nombran la causa real en vez de emitir la misma línea de límite de peticiones para cada repo.

- El registro `data/verified.json` es la única fuente de verdad de la Ruta B, refrescado por `scripts/verify.mjs` (originalmente lo impulsaba un workflow diario + en cada push; este repo conserva hoy solo el workflow de smoke, y el script de refresco sigue ahí). Un refresco solo lee la API de GitHub: analiza la configuración de la puerta `plugin-doctor.yml` del HEAD de cada repo (debe fijar `dsh-clinic@<version>`, usar un argumento `--only` que funcione y autoverificar que R0/K1 se ejecutaron de verdad), y luego comprueba la conclusión de la ejecución del workflow `plugin-doctor` de ese HEAD. **La CI de este repo nunca clona, instala ni ejecuta código de terceros.**
- Apariencia de la insignia: el lenguaje visual sigue las dos insignias más nuevas del ecosistema (monoespaciado mayúsculas + espaciado + marca + degradado de `dsh.directory`, y el bloque de sello de `awesome-dsh-plugin`): **un segmento izquierdo metálico plata/platino, una marca de tick de escudo y mayúsculas monoespaciadas azul tinta**, con el segmento derecho en un **color de estado sólido de convención GitHub** (verde/naranja/rojo/gris) que lleva una palabra de estado en mayúsculas monoespaciadas, y el estado además expresado por un **icono dibujado con trazado** (✓ / ! / ✕ / –) para que siga siendo legible con deficiencia de visión cromática. Radio de esquina 5px + trazo de 1px; **el trazo es obligatorio**: sin él, el segmento izquierdo plateado desaparece sobre un fondo de README blanco.
- Cuatro estados (el texto del valor usa las palabras convencionales de shields / GitHub Actions): `passing` (verde: la ejecución del HEAD tuvo éxito) / `warning` (naranja: el HEAD aún no ha corrido, hay una ejecución en cola o falta una precondición de la puerta) / `failing` (rojo: la ejecución del HEAD falló, o la configuración de la puerta no se sostiene —incluida una «puerta falsa» cuyo argumento `--only` está doblemente mal codificado—) / `no data` (gris: falló la consulta a la API). La insignia es **dinámica**: en cuanto deja de aprobar se pone roja. El alcance preciso de R+K vive en esta sección y en el campo `meaning` del registro, no en el texto de la insignia (la insignia enlaza de vuelta aquí).
- Para unirte a la Ruta B: abre un PR contra `data/verified-repos.json` añadiendo `{ "repo": "<owner>/<name>", "package": "<nombre del paquete npm>" }`, y añade `plugin-doctor.yml` a tu repo; la entrada debe pasar la auditoría anterior. **La Ruta A no necesita nada de esto.**
- **El archivo de la puerta se distribuye, no se copia a mano.** Copia [`plugin-doctor.yml`](plugin-doctor.yml) —el workflow canónico y listo para usar— a `.github/workflows/plugin-doctor.yml` de tu repositorio y ajusta el pin. También está dentro del tarball de npm, así que los usuarios de `npx dsh-clinic` pueden leer la copia distribuida en vez de reconstruir el paso desde este README. Los nombres de grupo usan los **alias ASCII `R,K`** (soportados desde 0.1.5, manteniendo archivo y línea de comandos en ASCII puro), y el final autoverifica que R0/K1 se ejecutaron de verdad.

> Por qué la puerta no instala ni construye nada, y por qué este repo no ejecuta la insignia: las comprobaciones estáticas R/K solo leen el árbol confirmado (no hacen falta dependencias), mientras que `npm run build` falla en un entorno sin los alias de harness, y su prebuild borra el `lib/` confirmado, fabricando un rojo falso. Concentrar instalaciones de dependencias de terceros en la CI de este repo, por otro lado, sería un riesgo de cadena de suministro. Por eso la puerta corre dentro de la CI de cada repo contra el árbol confirmado, y este repo solo audita y emite la insignia de la Ruta B.

## Datos medidos

Estos números vienen de **ejecuciones reales**, no de gráficos de marketing. El primer escaneo estático R+K de plugins de terceros (no PerryLink) (2026-09-10, 0.2.0): **60 candidatos → 20 plugins que declaran de verdad `dsh.bundle.patch` → 10 aprobados / 10 fallidos bajo la puerta de 16 comprobaciones**. Un reescaneo del mismo conjunto cualificado el 2026-09-23 con 0.3.0: **20 candidatos reescaneados → 19 cualificados → 6 aprobados / 13 fallidos / 0 degradados / 1 fallo de clonado**; histograma de fallos con puerta `{"R8":9,"R3":5,"R7":3}`. **Ningún repositorio retrocedió por las correcciones de R3/R7**: el movimiento principal es todo `R8`: la línea mínima de peers avanzó y los repos que siguen fijando `0.1.0-rc.6` están ahora mediblemente atrasados. Lee `R8` como **obsolescencia, no rotura**. El método completo, la tabla por repo, los comandos de reproducción y el canal de corrección están en [`THIRD-PARTY-RK-SCAN.md`](THIRD-PARTY-RK-SCAN.md); la base legible por máquina del 2026-09-10 está en `data/rk-scans.json`.

**No es una certificación, ni una calificación, y no dice nada sobre la seguridad de un plugin**: un aprobado solo significa que «las 23 comprobaciones estáticas no reportaron ningún fallo en ese commit». Método: clones de solo lectura, **ejecución cero** de código de terceros, R2/R4 listados aparte y no sujetos a la puerta; la cobertura `lib-fallback` es real pero no equivalente, y K3–K7 pueden infravalorar. Cualquier repositorio nombrado en el informe puede abrir un issue por el canal de corrección y la fila se re-ejecuta y se enmienda en el mismo lugar con la misma prominencia.

## Configuración

`dsh-clinic` no tiene **ningún Config schema** propio: los ajustes son los flags de la CLI y los seis parámetros de la mitad anfitriona. Los valores por defecto sirven para CI; una puerta estática sin red solo necesita `--only R,K --no-smoke`.

Flags habituales de la CLI:

| Flag | Por defecto | Significado |
|---|---|---|
| `--repo <path>` | obligatorio | ruta del repositorio del plugin (árbol de fuentes, o directorio de paquete instalado / artefacto tarball desempaquetado) |
| `--only <groups>` | todos | ejecutar solo los grupos indicados: `R`, `K`, `D`, `CC` (alias ASCII sin distinción de mayúsculas; los nombres completos en chino también funcionan) |
| `--no-smoke` | desactivado | omitir el smoke dinámico en sandbox; solo estáticas y listados (puerta estática offline/CI) |
| `--dsh <version>` | suelo de peers | versión de host usada por el smoke; por defecto la línea publicada más reciente en npm |
| `--json <path>` | — | escribir el informe en un archivo; `-` significa stdout (suprime el informe legible) |
| `--format check` | doctor | vista de contrato de tres valores (PASS/WARN/FAIL + 0/1/2, `checks[]` plano) |
| `--workspace <root>` | automático | workspace familiar con los repos hermanos (para CC1–CC5 y K14) |
| `--allow-degraded` | desactivado | aceptar explícitamente «el grupo entero nunca se ejecutó»; por defecto es salida 6 |
| `--no-nested-activation` | activo | desactiva K15 (spec de activation anidada) |
| `--no-thinking` | activo | desactiva K16 (uso de temperature/top_p en modo pensamiento) |

<details>
<summary>Parámetros de la mitad anfitriona (<code>plugin_doctor</code> / <code>/doctor</code>)</summary>

| Parámetro | Por defecto | Significado |
|---|---|---|
| `repo` (obligatorio) | — | ruta del repositorio del plugin (necesita `package.json`) |
| `smoke` | `false` | ejecutar además el smoke de sandbox del grupo D (requiere red + pnpm) |
| `host` | `true` | ejecutar el grupo X (contratos del anfitrión); degrada si no se puede leer una instalación de dsh |
| `workspace` | automático | directorio del workspace familiar (el padre que contiene varios repos de plugins `dsh-*`) para CC1–CC5 y K14; se resuelve hacia arriba desde el repositorio por defecto, y `DSH_WORKSPACE` también funciona |
| `nestedActivation` | `true` | ejecuta K15; equivale a `--no-nested-activation` en la CLI |
| `thinking` | `true` | ejecuta K16; equivale a `--no-thinking` en la CLI |

</details>

Superficie completa de comandos (los flags de mantenimiento como `--purge` no están en la tabla anterior):

```powershell
node doctor.mjs --repo <ruta-del-repo>          # ejecución completa (incluye smoke dinámico; requiere red + pnpm)
node doctor.mjs --repo <ruta> --no-smoke        # solo estáticas + listados
node doctor.mjs --repo <ruta> --dsh 0.2.2-alpha.3 # versión del host del smoke (por defecto la línea publicada más reciente)
node doctor.mjs --repo <ruta> --only R,K        # solo las dos capas estáticas (se recomiendan los alias ASCII)
node doctor.mjs --repo <ruta> --json report.json
node doctor.mjs --repo <ruta> --json -          # JSON a stdout (suprime el informe legible)
node doctor.mjs --repo <ruta> --format check --json -   # vista de contrato de tres valores (PASS/WARN/FAIL + 0/1/2)
node doctor.mjs --repo <ruta> --workspace <raíz-del-workspace>   # workspace con los repos hermanos (usado por el grupo CC)
node doctor.mjs --repo <ruta> --allow-degraded  # aceptar explícitamente «el grupo entero nunca se ejecutó» (salida 6 por defecto)
node doctor.mjs --purge <directorio-de-cuarentena> # limpiar directorios de cuarentena creados por esta herramienta (solo doctor-quarantine-*)
```

## FAQ

<details>
<summary>¿Toca mi repositorio o mi entorno?</summary>

No. R/K/CC estáticos solo leen el árbol confirmado: sin instalar dependencias, sin ejecutar el código bajo prueba; el escaneo de terceros es un clon de solo lectura. El grupo D mantiene su `DSH_HOME`/`DSH_AGENTS_HOME` temporal dentro de un sandbox propio en `%TEMP%` (prefijo `doctor-`, que **no se solapa** con la plantilla protegida del host `%TEMP%\dsh-*`), y a `dsh plugin add` siempre se le pasa `--ignore-scripts`, así que los scripts install/prepare del paquete probado nunca se ejecutan en el host. Al final la ejecución **pone en cuarentena en vez de borrar** (renombra a `%TEMP%\doctor-quarantine-*`), y el borrado queda para `--purge` tras confirmación humana. Las rutas absolutas vistas en ejecución se sustituyen por `<path>` antes de llegar al JSON o al texto renderizado.

</details>

<details>
<summary>¿Un PASS es una certificación o una calificación de seguridad?</summary>

No. Un aprobado solo significa que «las comprobaciones estáticas solicitadas no reportaron fallos en ese commit». El grupo K es un **escaneo estático heurístico**: los envoltorios complejos pueden escaparse y las falsas alarmas son posibles; D3 solo demuestra que la composición arranca hasta una petición al modelo, no que los esquemas de herramientas sean válidos o que la lógica de negocio sea correcta; un fallo de `R8` se lee como «línea de peers obsoleta», no como «plugin roto». Esta herramienta no hace auditoría de seguridad, y el bloque `dsh.standards` es un marcador `not-run`, no un aprobado.

</details>

<details>
<summary>¿Cómo lo ejecuto en CI? ¿Necesita red?</summary>

La puerta estática no necesita red: `npx --yes dsh-clinic@0.8.1 --repo . --no-smoke --only "R,K"`, y luego ramifica por el código de salida o el JSON. Solo el smoke del grupo D necesita red y pnpm. La acción completa está en [`plugin-doctor.yml`](plugin-doctor.yml): lee solo el árbol confirmado, autoverifica que R0/K1 se ejecutaron de verdad y lista R2/R4 aparte en vez de exigirlos (leen artefactos construidos).

</details>

<details>
<summary>¿Una ejecución degradada o saltada puede producir un verde falso?</summary>

No. Un nombre de grupo que no coincide en `--only` → inmediatamente salida 2; un grupo solicitado que nunca se ejecutó de verdad → salida 6; en `--format check` un skip nunca se renderiza como `PASS` (se convierte en `WARN` con `skipped: true`). Si de verdad quieres aceptar la degradación, usa `--allow-degraded`: el código baja a 0, pero el `degraded` del JSON sigue no vacío y la mitad anfitriona nombra los grupos en su respuesta.

</details>

<details>
<summary>¿Por qué sigue existiendo un dsh-plugin-doctor en npm?</summary>

Porque es otro proyecto. Este repositorio pasó de `@perrylink/dsh-plugin-doctor` a `dsh-clinic`; el nombre npm simple `dsh-plugin-doctor` (0.1.1) pertenece a Xrainsmile/DSH-Plugin-Doctor, así que `npx dsh-plugin-doctor` ejecuta el paquete de otra persona. Usa `npx dsh-clinic@<version>` (o `dsh plugin add dsh-clinic`). El paquete antiguo con scope y el repo antiguo de GitHub quedan como punteros.

</details>

## Límites de seguridad

- **Estático y de solo lectura.** R/K/CC y el escaneo de terceros solo leen el sistema de archivos; nada escribe en el repositorio bajo prueba fuera de los tests. Las únicas escrituras son el sandbox propio en `%TEMP%` y los directorios de cuarentena.
- **Sandbox de un solo uso.** El `DSH_HOME`/`DSH_AGENTS_HOME` temporal del grupo D vive bajo `%TEMP%\doctor-*` y nunca toca el `~/.dsh` real (línea roja 3).
- **Sin scripts de instalación del paquete probado.** `dsh plugin add` pasa explícitamente `--ignore-scripts`; un bloque `ignored-builds` de pnpm se clasifica como `environment` (no cuenta como aprobado ni como defecto del plugin).
- **Cuarentena, no borrado.** El stdout/stderr de cada subproceso se escribe en `%TEMP%\doctor-run-*\logs\`; al final la ejecución lo renombra a `%TEMP%\doctor-quarantine-*`, imprime esa ruta al pie del informe y deja el borrado para `--purge` tras confirmación humana (línea roja 4, la regla de tres etapas).
- **Redacción de rutas.** Las rutas absolutas vistas en ejecución se convierten en `<path>` antes de entrar al JSON o al texto renderizado, así que un informe puede commitearse en el repo de otra persona sin disparar su puerta de fuga de rutas.
- **Fallo cerrado, sin verde falso.** Grupo desconocido/opción desconocida → 2; un grupo entero que nunca corrió → 6; la degradación debe aceptarse explícitamente con `--allow-degraded`; un `skip` nunca se escribe como `pass`.

## Limitaciones conocidas

- El grupo K es un **escaneo estático heurístico**: K1/K3/K4 se pierden envoltorios complejos y también pueden dar falsas alarmas; todo hallazgo de nivel warn necesita una mirada humana y nunca condena un plugin automáticamente.
- D3 solo demuestra que «la composición arranca hasta una petición al modelo»; **no demuestra que los esquemas de herramientas sean válidos ni que la lógica de negocio sea correcta** (eso necesita una ejecución e2e con clave o un LLM simulado).
- Un bloque `ignored-builds` de pnpm es un problema de receta de entorno: cuando D1 lo encuentra, la comprobación degrada a warn e imprime la receta `allowBuilds` de `compat.yml`, en línea con la línea environment-blocked del spec v1 de certificación, y nunca cuenta como defecto del plugin.
- Los hosts de la línea npm (0.1.2-rc.1) no tienen aplicación de engines/peerDependencies en su packument, así que R6 es solo recomendatorio allí.
- Una trampa medida en este entorno: un ancla `$` (sin el flag `m`) no coincide con la posición antes de un `\r` final solitario, así que analizar texto CRLF debe dividir por `/\r?\n/` (ya se maneja internamente; no lo rompas).
- **Cruce de estándares.** R/K/D —con X como evidencia complementaria— solo se mapean a la línea base de compatibilidad **DSH-ENTRY**; el sobre JSON ahora lleva un campo aditivo `standards` (`dsh-levels/1`). DSH-FLOW (`J1–J8`) es `manual` y DSH-BOOST (`LEV-1..LEV-8`) es `not-measured` —esta herramienta no ejecuta recorridos de usuario ni benchmarks— y los niveles no son un estándar oficial de DeepSeek. Véase [`STANDARDS.md`](STANDARDS.md) y `data/standards.json`.

## Compatibilidad

| Superficie | Estado |
|---|---|
| Harness | DeepSeek Harness `dsh-v0.2.2-alpha.3` (línea base actualizada el 2026-11-03; sin dependencias y ágil respecto al host por diseño: `package.json` no declara ninguna dependencia `@deepseek-ai/dsh-*` ni rango de peers, así que las comprobaciones `R5`/`R8` de este repositorio se omiten a propósito en vez de pasar — véase `SELF-CHECK.md`; el registro de esta línea está en `CHANGELOG.md` §0.4.6, «host pins move to `0.2.1-alpha.1`», y el smoke de sandbox del grupo D toma su host de `--dsh`, por defecto el suelo de peers `0.1.2-rc.1`) |
| Node | `>=24.9.0` |

## Ecosistema y calidad

- [Página de dshfind](https://dshfind.com/plugins/PerryLink/dsh-clinic) (instalaciones y ranking)
- [Base de conocimiento del ecosistema](https://perrylink.github.io/dsh-plugin-guide/): guía de desarrollo · datos de selección · criterios de mantenimiento
- [Repositorio dsh-standards](https://github.com/PerryLink/dsh-standards): el estándar familiar con el que se cruzan los criterios de esta herramienta
- [Informe del escaneo R+K de terceros](THIRD-PARTY-RK-SCAN.md): 60 candidatos → 20 plugins cualificados → 10 aprobados / 10 fallidos (2026-09-10); reescaneo del 2026-09-23: 19 → 6 aprobados / 13 fallidos
- **Estado honesto**: 43 repos de la familia ya llevan la puerta (el registro `data/verified-repos.json` lista 40 ahora mismo; la plantilla de la puerta se unificó byte a byte el 2026-09-23/24); **todavía no hay adoptantes externos** —lo que limita este proyecto es la adopción, no la cobertura de catálogos (razonamiento en [`OUTREACH.md`](OUTREACH.md) §C4)—. Las publicaciones salen por npm Trusted Publishing (OIDC), sin token de larga vida. Todos los cambios de 0.2.0 son aditivos y se validaron contra la base de 37 repos con diffs = 0.
- **Canal de la tienda 1024**: primero `npm i -g dsh1024`, luego `dsh1024 plugin --profile web add dsh-clinic` (cuenta para el ranking de instalaciones de [deepseek1024.com](https://deepseek1024.com))

## Desarrollo

```sh
npm install
npm test                      # comprobaciones de sintaxis + 14 autopruebas + suites contract/drift/compat
npm run check:readmes         # puerta de consistencia de los README en cinco idiomas (modo A)
npm run test:host-surface     # los datos de la superficie de servicios coinciden con la base 0.2.2-alpha.3
npm run check:cross-repo      # puerta mensual K14 entre repos (monta la familia desde tarballs publicados)
node scripts/check-release-health.mjs --repo . --no-registry   # salud de la publicación (offline)
npm run verify:registry       # refresco del registro e insignias de la Ruta B (API de GitHub de solo lectura)
npm run badge                 # re-renderizar el SVG verificado
```

### Estructura del repositorio

```text
doctor.mjs               entrada CLI (orquestación de grupos, códigos de salida, informe JSON)
plugin.mjs               mitad anfitriona (herramienta plugin_doctor + comando /doctor)
cordis.patch.yml         declaración del bundle (inserta una fila; sin claves de configuración)
lib/framework.mjs        registro/ejecución/veredicto/renderizado de comprobaciones (sin dependencias)
lib/util.mjs             sandbox temporal + ejecución de subprocesos (stdout/stderr a disco, evitando límites de captura por tubería)
lib/workspace.mjs        localización del workspace familiar
lib/checks-package.mjs   estático · estructura del paquete R0–R8
lib/checks-cordis.mjs    estático · contrato Cordis K1–K16
lib/checks-runtime.mjs   comprobaciones X del contrato del anfitrión
lib/checks-smoke.mjs     dinámico · smoke en sandbox D0–D3, D9
lib/checks-collections.mjs  ecosistema · listados de directorio CC1–CC5
tests/selftest.mjs       14 autopruebas de CLI real (los 7 casos existentes del contrato de exit code idénticos byte a byte, más 7 casos nuevos de degradación/guarda de uso)
tests/contract.mjs       31 pruebas de contrato (congelan los 5 observables de los que depende la CI de los 37 repos existentes)
scripts/check-readme-sync.mjs  puerta de README en cinco idiomas (modo A: principal chino + inglés)
scripts/verify.mjs       refresco del registro verificado y de las insignias (lee la API de GitHub para auditar la puerta de cada repo)
scripts/badge.mjs        renderizado SVG verificado
scripts/check-cross-repo.mjs    puerta mensual K14 entre repos (monta la familia desde tarballs publicados)
scripts/check-release-health.mjs salud de la publicación (portadores de versión, registro, procedencia, tarball)
scripts/gen-readme-assets.py     imágenes README programáticas (Python + Pillow)
data/verified-repos.json repos declarantes verificados
data/verified.json       registro verificado
badges/                  insignias verificadas
THIRD-PARTY-RK-SCAN.md   conjunto de resultados del escaneo estático R+K de terceros (informe público)
data/rk-scans.json       forma legible por máquina de ese escaneo (base 2026-09-10)
SURVEY.md                la metodología de detección de todos los canales más la fuente de cada criterio
SPEC.md                  los criterios normativos de verificación (escritos por PerryLink)
GOVERNANCE.md            autoría, versionado del spec y qué atribución se pide frente a la requerida
NOTICE                   aviso de atribución Apache-2.0 (debe viajar con las redistribuciones)
CITATION.cff             metadatos de citación
plugin-doctor.yml        la puerta de CI canónica, distribuida lista para copiar a tu repo
FOR-ADOPTERS.md          página de aterrizaje del adoptante: puerta, insignia, veredictos, límites
SELF-CHECK.md            el resultado de esta herramienta contra sus propios criterios
OUTREACH.md              notas de adopción: estados de canal, posicionamiento, acciones
```

### Salud de la publicación

Un workflow de release verde no demuestra una publicación correcta. El 2026-10-05 la familia publicó 37 paquetes y los fallos que importaban eran invisibles en el color del job: 36 CHANGELOGs llevaban la fecha literal `undefined`, dos paquetes se publicaron con éxito y aun así acabaron en rojo, uno falló con `ENEEDAUTH` porque el binding de trusted-publisher de npm nombraba un archivo de workflow que ya no realiza el intercambio OIDC, y uno nunca llegó a npm porque su puerta `verify` previa a la publicación falló primero y el job de publish quedó `skipped`.

`scripts/check-release-health.mjs` comprueba las cuatro cosas que cubren todos esos casos:

| Pass | Pregunta | ¿Necesita red? |
|---|---|---|
| LOCKSTEP | ¿todo portador de versión del repo coincide con `package.json`? | no |
| PUBLISHED | ¿la versión local es la que está en el registro? | sí |
| PROVENANCE | ¿qué archivo de workflow lo publicó, y es un archivo de publicación actual? | sí |
| FILES | ¿el tarball publicado sigue llevando `src/`, `lib/` o `dist/`? | sí |

```sh
# un repositorio, offline (el modo que un repo aguas abajo debería usar en su propia CI)
node scripts/check-release-health.mjs --repo . --no-registry

# toda la familia declarada, desde el registro, sin hacer checkout de nada
node scripts/check-release-health.mjs --roster data/verified-repos.json
```

Códigos de salida: `0` sano, `1` al menos un problema, `2` error de uso. `--json <path>` escribe el informe legible por máquina, `--quiet` imprime solo fallos. Ambos comandos pueden conectarse a tu propia CI.

Solo dos formas de portador hacen fallar la comprobación, porque solo dos se afirman en toda la familia: el `VERSION` exportado de `src/version.ts`, y un archivo `VERSION` donde exista. Una diferencia de versión en `SKILL.md` se reporta como nota: la mayoría de las skills se versionan de forma independiente.

### Regenerar las imágenes

`docs/assets/dsh-clinic-hero-{zh,en}-{light,dark}.webp` y `docs/assets/dsh-clinic-flow-v5-{light,dark}.svg` se generan programáticamente con [`scripts/gen-readme-assets.py`](scripts/gen-readme-assets.py) (Pillow para el hero, SVG escrito a mano para la figura de estructura; la ausencia de una fuente aborta con error). El hero existe en zh/en; la figura de estructura solo contiene tokens de comandos (nombres de grupo, comandos, códigos de salida) y la comparten los cinco idiomas. Re-ejecutar:

```sh
python scripts/gen-readme-assets.py
```

Este repositorio no tiene datos de benchmark, así que no se genera gráfico de barras de evidencia; los números medidos de arriba se citan directamente del informe de escaneo.

## Familia y agradecimientos

Este proyecto forma parte de la familia de plugins de DeepSeek Harness de [PerryLink](https://github.com/PerryLink) (95 plugins, todos Apache-2.0). Si te resulta útil, **dale una estrella**: no desbloquea nada, pero ayuda a que la siguiente persona lo encuentre.

### Autoría de los criterios

Los criterios de verificación —no solo la herramienta que los implementa— fueron escritos por **PerryLink** (<https://github.com/PerryLink>). Su texto normativo es [`SPEC.md`](SPEC.md), y este repositorio es la fuente canónica tanto de la especificación como de la implementación de referencia. Véase [`GOVERNANCE.md`](GOVERNANCE.md) para saber cómo cambian los criterios y qué atribución se pide (frente a la que exige Apache-2.0 §4(d) mediante [`NOTICE`](NOTICE)).

Adoptar la puerta no necesita permiso. Si la adoptas, mantén los criterios atribuidos a PerryLink y no los presentes como tu propio estándar.

<details>
<summary>Expandir todos los plugins</summary>

| Plugin | Estado |
|---|---|
| **[dsh-aqua-input-check](https://github.com/PerryLink/dsh-aqua-input-check)** |  |
| **[dsh-archive-check](https://github.com/PerryLink/dsh-archive-check)** |  |
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** |  |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** | 🧊 CONGELADO — ver el README del repo |
| **[dsh-bid-ca-precheck](https://github.com/PerryLink/dsh-bid-ca-precheck)** |  |
| **[dsh-bid-qual-check](https://github.com/PerryLink/dsh-bid-qual-check)** |  |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** | 🧊 CONGELADO — ver el README del repo |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** |  |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** |  |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** |  |
| **[dsh-contract-stance](https://github.com/PerryLink/dsh-contract-stance)** |  |
| **[dsh-customs-doc-check](https://github.com/PerryLink/dsh-customs-doc-check)** |  |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** | 🧊 CONGELADO — ver el README del repo |
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
| **[dsh-memento](https://github.com/PerryLink/dsh-memento)** | 🧊 CONGELADO — ver el README del repo |
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
| **[dsh-plugin-kit](https://github.com/PerryLink/dsh-plugin-kit)** | 🚫 RETIRADO (repo archivado) |
| **[dsh-plugin-upgrade](https://github.com/PerryLink/dsh-plugin-upgrade)** | 🚫 RETIRADO (repo archivado) |
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
| **[dsh-score](https://github.com/PerryLink/dsh-score)** | 🧊 CONGELADO — ver el README del repo |
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
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** | 🚫 RETIRADO (repo archivado) |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** |  |
| **[dsh-warranty-calc](https://github.com/PerryLink/dsh-warranty-calc)** |  |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | 🧊 CONGELADO — ver el README del repo |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | 🧊 CONGELADO — ver el README del repo |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | 🧊 CONGELADO — ver el README del repo |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | 🧊 CONGELADO — ver el README del repo |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | 🧊 CONGELADO — ver el README del repo |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | 🚫 RETIRADO (repo archivado) |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | 🚫 RETIRADO (repo archivado) |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | 🚫 RETIRADO (repo archivado) |
</details>

## Licencia

[LICENSE](LICENSE) (Apache License 2.0) © 2026 dsh-clinic contributors

<p align="center"><sub>Apache-2.0 · Herramienta comunitaria, sin relación con DeepSeek.</sub></p>
