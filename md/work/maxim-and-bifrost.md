# maxim & bifrost

# bifrost

i joined early, before stable v1 and i've stayed on the core team since, shipping across pretty much every layer — provider integrations, the compat plugin, observability and helm configs. this is what I've mostly worked on:

## new providers

added elevenLabs (speech + transcription), groq STT/TTS, and most recently deepseek as a first-class provider.

![logs dashboard](/img/bifrost_dashboard.png)

## compat plugin

this is the layer that makes "any client, any provider" actually work. it roughly does this:

- convert one request to another and back to the original (for example, if a model does not support chat completions but supports responses, it will convert the request from chat to responses, hit the model and convert the response back to chat completions format)
- automatically drops or converts unsupported parameters for each model based on bifrost's [datasheet](https://getbifrost.ai/datasheet). compatibility fixes now don't need a new version release, it only needs a datasheet update (and older clients stay compatible longer).
- a long tail of per-provider quirks — anthropic rejecting trailing-assistant messages, `cache_control` handling for bedrock, conversion of role developer, flattening of namespaced tools for non-openai providers.

## multi-deployment support

reworked Ollama and SGLang from a single provider-level base URL to per-key URLs, so you can load-balance across multiple local instances serving different models.

## multiple OTEL collector profiles

added support for multiple OTEL collector profiles (fan-out tracing and metrics to multiple destinations, like datadog, langfuse, prometheus, etc).

## pricing correctness

fixed streaming cost/usage attribution more than once (vLLM's `--skip-pipeline` output, image generation/edit streaming, virtual-key-scoped pricing overrides not propagating through the streaming accumulator context).

## helm charts
tightened helm schema

---

# maxim

[maxim](https://getmaxim.ai) is an ai observability and evaluation platform — logging, tracing, evals, test runs, prompt management, and simulations for teams building on LLMs. i have worked across the whole stack — the main platform (next.js monorepo on Nx), and both Python and JS/TS SDKs.

## internal bifrost deployment

maintains internal bifrost instance that powers maxim's ai layer. it allows us to do things like:
- BYOK (bring your own key), provide provider-specific configs (like vertex's regions, bedrock arn, etc.), multiple deployments for Ollama and vLLM.
- provider and model discovery — maxim supports 1000+ models, across 20+ providers.
- inference, voice simulations, and streaming all go through bifrost.

## human & retro evals

external human raters on log repositories, a variable catalog for evaluator suggestions, and the human-eval sheet/table UI (annotation forms, comparison views, xlsx export for human evaluations in test runs).

## logging pipeline

consolidated the logging surface into a single logging API, added a `LogLine` class in the JS SDK for manually pushing logs, and fixed a nasty bug where multiple Maxim SDK instances on the same API key stepped on each other.

added the `LogLine` apis to collect log lines and push them to the logging apis. this gives client ownership of the log export process.
 
kept both SDKs in lockstep — prompt id / prompt version passthrough, variable mapping, `withLogger`/`with_logger` for logging on prompt runs, streaming fixes for the agno integration (python), and making sure a broken log-repository connection doesn't block logger creation.

## prompts, evaluator, simulation apis

built out a big chunk of the public API surface — prompt tools, prompt versions v2, prompt deployment by version number, prompt partials, and model / evaluator management apis. Also shipped variable mapping for SDK test runs and prompt-version fallback logic when creating new versions.

## ui work

- session table improvements (tool-call display, saved search, tooltips for cost / tokens / prompt versions)
- drag-to-reorder and filtering in trace and session tables
- dataset split search and migration fixes
- dashboard and email-template fixes and a long tail of UI bugfixes (dropdown state, title race conditions, drag-and-drop, rich text handling).

<!-- ## core prs -->
<!---->
<!-- some of my prs: -->
<!---->
<!-- - [#824](https://github.com/maximhq/bifrost/pull/824) — feat: support for ElevenLabs provider (speech, streaming, transcription) -->
<!-- - [#886](https://github.com/maximhq/bifrost/pull/886) — feat: time-based log filtering and log deletion -->
<!-- - [#892](https://github.com/maximhq/bifrost/pull/892) — feat: enable logs UI when a log store is connected -->
<!-- - [#2039](https://github.com/maximhq/bifrost/pull/2039) — fix: move text→chat conversion from plugin to provider dispatch level (LiteLLM compat) -->
<!-- <!-- - [#2050](https://github.com/maximhq/bifrost/pull/2050) — feat: litellmcompat converts chat completion → responses when unsupported --> -->
<!-- - [#2099](https://github.com/maximhq/bifrost/pull/2099) — feat: Groq speech synthesis and transcription (STT/TTS) -->
<!-- - [#2102](https://github.com/maximhq/bifrost/pull/2102) — fix: handle text/vtt/srt response formats for transcriptions -->
<!-- <!-- - [#2195](https://github.com/maximhq/bifrost/pull/2195) — feat: drop unsupported params per-model based on catalog allowlists --> -->
<!-- <!-- - [#2260](https://github.com/maximhq/bifrost/pull/2260) — feat: split single LiteLLM-fallback flag into granular compat toggles --> -->
<!-- <!-- - [#2328](https://github.com/maximhq/bifrost/pull/2328) — feat: track and surface dropped parameters during provider conversion --> -->
<!-- - [#2386](https://github.com/maximhq/bifrost/pull/2386) — feat: per-key URLs for Ollama/SGLang to support multiple deployments -->
<!-- <!-- - [#2528](https://github.com/maximhq/bifrost/pull/2528) — fix: convert `developer` role to `system` for Bedrock and Gemini --> -->
<!-- <!-- - [#2567](https://github.com/maximhq/bifrost/pull/2567) — feat: multiple OTEL collector profiles (fan-out tracing/metrics) --> -->
<!-- - [#2784](https://github.com/maximhq/bifrost/pull/2784) — fix: token usage attribution for vLLM `--skip-pipeline` -->
<!-- - [#2858](https://github.com/maximhq/bifrost/pull/2858) — feat: Codex compatibility — namespace tool type + web-search tool dropping -->
<!-- - [#2913](https://github.com/maximhq/bifrost/pull/2913) — feat: namespace tool type support, flattened for non-OpenAI providers -->
<!-- - [#2938](https://github.com/maximhq/bifrost/pull/2938) / [#2965](https://github.com/maximhq/bifrost/pull/2965) — fix: drop empty `thinking` blocks that made Claude Code choke on Anthropic -->
<!-- - [#3074](https://github.com/maximhq/bifrost/pull/3074) — fix: fall back to provider-level `network_config` if per-key URL isn't set -->
<!-- - [#3154](https://github.com/maximhq/bifrost/pull/3154) — fix: drop `cachePoint`/`cache_control` for models/providers that don't support prompt caching -->
<!-- - [#3200](https://github.com/maximhq/bifrost/pull/3200) — fix: `developer`→`system`/`user` role handling across Anthropic, Bedrock, Gemini -->
<!-- - [#3202](https://github.com/maximhq/bifrost/pull/3202) — fix: compat plugin booleans were silently defaulting to `false`; now default `true` -->
<!-- - [#3203](https://github.com/maximhq/bifrost/pull/3203) — fix: strip trailing assistant messages for Anthropic, sanitize Mistral `reasoning_effort` -->
<!-- - [#3221](https://github.com/maximhq/bifrost/pull/3221) — fix: `reasoningConfig` field naming + message sanitization for non-Anthropic Bedrock models -->
<!-- - [#3421](https://github.com/maximhq/bifrost/pull/3421) — fix: virtual-key/provider-key pricing overrides weren't propagating through streaming context -->
<!-- - [#4630](https://github.com/maximhq/bifrost/pull/4630) — feat: drop `reasoning` when tools are present but the model doesn't support both together -->
<!-- - [#4657](https://github.com/maximhq/bifrost/pull/4657) — fix: strip assistant `reasoning_content` for Cerebras (unsupported field) -->
<!-- - [#4802](https://github.com/maximhq/bifrost/pull/4802) — fix: cost/usage attribution for image generation & image-edit streaming -->
<!-- - [#4852](https://github.com/maximhq/bifrost/pull/4852) — feat: add DeepSeek as a first-class provider -->
<!-- - [#4861](https://github.com/maximhq/bifrost/pull/4861) — fix: disable DeepSeek thinking mode when `tool_choice: required` is set -->
<!-- - [#4956](https://github.com/maximhq/bifrost/pull/4956) — feat: Anthropic Files API — `content_type` forwarding + `file_id` references -->
<!-- <!-- - [#935](https://github.com/maximhq/bifrost/pull/935) — feat: send back raw provider error when enabled --> -->
<!-- <!-- - [#5012](https://github.com/maximhq/bifrost/pull/5012) — fix: Azure `model-router` deployments fall back through Chat Completions for the Responses API --> -->
<!-- <!-- - [#5136](https://github.com/maximhq/bifrost/pull/5136) — fix: use the client's ephemeral secret (not Bifrost's own key) for realtime WS relay auth --> -->
<!-- <!-- - [#2867](https://github.com/maximhq/bifrost/pull/2867) — feat: Ollama-native HTTP integration (in progress) --> -->
<!-- <!-- - [#847](https://github.com/maximhq/bifrost/pull/847) — feat: hermetic binary for offline local use --> -->
