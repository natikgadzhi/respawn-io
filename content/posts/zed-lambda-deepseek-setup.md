---
created: 2025-04-15
modified: 2025-04-15
title: Setup Zed AI Assistant with DeepSeek V3 on Lambda
excerpt: Had to spin up a new work laptop, so I figured — I'll tweak my Zed setup, do some dogfooding, and show you how to make Zed AI assist awesome!
tags:
  - coding
  - ai-dev-tools
  - lambda-labs
  - zed
---

# Setup Zed AI Assistant with DeepSeek V3 on Lambda

Zed is a lovely text editor. I _enjoy_ typing in it every time I try. Yet, the vibe coding capabilities are lacking 🙃 The foundations are flexible — they've [figured out "extensions" and "workflows" back in August 2024](https://zed.dev/blog/zed-ai), yet it's not as well developed as Cursor, Cline, or Copilot Agent Mode.

AI Assistant is a core part of Zed, and it's pretty great. They've partnered up with Anthropic and provide Sonnet 3.7 with _very reasonable_ context windows and rate limits _for free_ for now.

I like where Zed is right now. You _can_ make a model edit your code in-place, but it doesn't get in the way as much. You just can't completely absolve yourself of thinking how the magic happens.

Let's setup the magic.

## Why bother switching from Sonnet?

My reasons will differ from your reasons. Personally, I want to work on products that I would be proud and happy to use myself. Lambda models must become the best models for my IDE, Lambda assistance must replace my Claude and Perplexity.

> For most users, the biggest reason to switch to Lambda-hosted models is privacy. Lambda is not in the business of training proprietary models or selling data. [We do not log or store inference prompts and generated responses, at all](https://deeptalk.lambdalabs.com/t/inference-api-privacy/4553/2).


## Zed AI Assisant configuration

I'm assuming you are already using Zed. You'll need to grab a Lambda API key ([get one here](https://cloud.lambda.ai/api-keys/cloud-api))

```json
// settings.json
{
  // ... everything else ...
  // This block configures the default / current model to use
  {
  "assistant": {
    "default_model": {
      "provider": "openai",
      "model": "deepseek-v3-0324"
    },
    "version": "2"
  },

  // This configures using DeepSeek on Lambda inference
  // via an openai-compatible client.
  "language_models": {
    "openai": {
      "api_url": "https://api.lambda.ai/v1",
      "available_models": [
        {
          "name": "deepseek-v3-0324",
          "display_name": "Lambda DeepSeek V3",
          "max_tokens": 164000
        }
      ],
      "version": "1"
    }
  },
}
```

Honestly, that's it. As we ship new models, you can experiment with them by switching the model name, or on https://lambda.chat. Here's the same in a video:

<iframe width="560" height="380" src="https://www.youtube.com/embed/2Uk7n0nrUV8?si=Ly7objH16UwVSY7D" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


## Bonus

[[daily/2025-04-20|You can use Claude Code in a terminal pane in Zed and that's also pretty cool!]]
