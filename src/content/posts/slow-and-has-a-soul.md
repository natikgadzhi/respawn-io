---
title: Slow and Has a Soul
tags:
  - startups
  - remote
  - engineering-leadership
excerpt: A take on the trajectory of two YC W20 companies
created: 2025-06-15
modified: 2025-06-15
---
# Slow and Has a Soul

Something is wrong with us as an industry if we look at Airbyte with a $1.5b valuation and think, wow, this is winning, compared to Raycast with their $30m Series B.

I love Raycast. I like their product, I love the way they engage with their community, and I absolutely love the way they structure their team. *To me, this is the dream — to work with the people I love, on a product we are committed to. Ship fast, put feedback over metrics, and grow together.*

There are a lot of venture-grade problems with Raycast, and enterprise software is an “easier path to money”, sure, but Raycast has something most VC-backed companies don't.

---

I went out for a run yesterday and listened to [Distributed with Thomas Paul Mann](https://www.youtube.com/watch?v=uHhJ_ZwQtuw) and realized, wow, Raycast was in the same YC W20 batch as Airbyte, but the companies couldn't have more diverging trajectories. Not an attack on Airbyte, but hear me out.

| Airbyte | Raycast |
|---------:|:---------|
| • _Forced_ to go remote from the start.<br/>• It's market-reactive: [designed to go after a specific problem space, based on the skills Michel and the team had, and projected future market sizes](https://www.youtube.com/watch?v=0cjkqwAetZc).<br/>• _Uses open core_ as a bottoms-up user acquisition and marketing strategy.<br/>• Prioritizes company success and growth.<br/>• Hits $1.5b _valuation_ within 2 years of company inception. Grew to 150+ people quickly.| • Also remote, and moved to Europe.<br/>• Built out of frustration, to [improve tools for themselves](https://changelog.com/podcast/587).<br/>• Step-function team growth, prioritizes product above all. Only 35-ish people. |


## Companies by the vibes

Airbyte is a designer-made venture-backed company. Raycast is a “spotlight sucks, let's make a thing that we don't hate using every day eh?”. Is it as successful from VC perspective? No. Is it a better company in my _personal_ moral compass? Undoubtfully, yes.

<WithAside>
One is built for money, the other one — out of sheer frustration and hatred. I'd bet on an engineer building out of spite any day.
<Aside>
You can't put a gauge on _quality_. Reminds me of [Zen and the Art of Motorcycle Maintenance](https://bookshop.org/p/books/zen-and-the-art-of-motorcycle-maintenance-an-inquiry-into-values-robert-m-pirsig/10292709). Read it if you haven't yet.
</Aside>
</WithAside>


## Remote work approach

Airbyte and Raycast were _forced_ to build remote. They graduated YC at the beginning of the COVID lockdown. Never let a good crisis go to waste — both companies built great teams and great product in the years since. But the _mode_ of work and company-building evolved differently.

### Airbyte

Airbyte has an _exceptional_ remote team. This engineering organization has insanely high sustained velocity. People are genuinely excited to build Airbyte at Airbyte, at all levels, from Michel, to Charles the VP, to all ICs that I worked with. _This was the fastest and most engaged organization that I worked with, it sets the bar for me_.

But that's where I got _really conpuzzled_. Remote served Airbyte really well, and then we got to a point where Michel realized he has significant experience with in-office teams, and uncomfortable lack of experience with remote ones.

Cue the RTO for _some_ folks in the company, and a writing on the wall with _extreme clarity_ for the rest — we're going for the _AI vibes of the city, because this is where the revolution is_. Maybe he's right, I definitely hope it works out for the company. I have an uncomfortable lack of experience successfully convincing great engineers to abandon their lives and move their families to a city they don't otherwise choose to live in.

<WithAside>
> But ultimately a work process is a tool, and you the right tool for the job. The _right_ tool is the one that you have, know how to use, and that can get the job done. [[remote-and-async-work|Remote is not a silver bullet]]. Take a team that only worked in-office and scatter them across the globe, and you're cooked. If you have a kickass team of engineers who can build in PHP, and you want to build a new website and force them to use Closure, you're about to _Find Out_.
<Aside>
    And if you're the loner Go engineer who wants to k8s everything in a room with LAMP believers, you [[pattern-recognition|quit and look for shit you can k8s all day long]].
</Aside>
</WithAside>

### Raycast

_There goes my hero._ On that Distributed episode, Thomas says that one decision they made on how they will structure work is to clamp on timezones. Thomas and Petr are in London — so, Europe it is. This puts some interesting constraints: most of your users will be in the US, but most of your team is in Europe. What became a PITA for Airbyte, became a superpower for Raycast.

Most Airbyte people are in the US timezones, so we _can_ work with folks from Europe, but they have to be senior enough to manage their time, and make it so it's not taxing on the team. Raycast _stayed_ committed to remove, but made an explicit decision to _not_ allow timezone tax in the first place.

Raycast is also deliberate about building and testing an excellent product, and staying as small as possible, so they can run as fast as possible.

## How does the math look?

Everything below is a speculation. I thought, wow, Raycast's trajectory makes me anxious AF. On one hand, the product, the team, the community are exceptional and make my heart beat faster. On the other hand, you took VC money, so you're pressured to show growth, but the model is _tricky_. So how could that look, based on the numbers that are publicly available?

**Context:**
- Team size: 35-ish people
- Funding: $47.8m, with $30m series B in the latest round.
- DAU: "hundreds of thousands", let's be generous and assume 400k. This will affect quite a lot of math below.

**Finger to the wind revenue:**
- Valuation: Probably around $150m to $250m based on Series B size. There are some high caliber folks involved, so $300m + wouldn't shock me completely.
- MAU: I feel that folks who use Raycast, use it daily and a LOT, so DAU/MAU ration would be on the higher side. Let's assume 1M MAU.
- Let's assume 5% of Raycast users are paying users.
- Let's assume average revenue per user of $10 / mo. Pro plan is $8 at the time of this note, and Pro AI is $16 (but that comes with HEAVY costs of inference, too).
- Revenue: 5% * 1_000_000 * $10 = $6M ARR.
- Enterprise and team plans are probably making the number go up the most. But Raycast is not yet pushing into enterprise sales, it seems — the team composition would look different when that kicks in.
- I could easily be 5x wrong (take 100k DAUs, drop ARPU, boom) but probably not 25x wrong.

**Finger to the wind expenses:**
- Let's assume the biggest chunk of expenses is talent.
- Let's assume 75% engineering / 25% non-eng roles split.
- Let's assume $220k for an eng role and $180k for non-eng role in Europe with all expenses bundled in. I have no idea if this is a good estimate.
- That would mean $7.35M expenses to support the team. Infrastructure, software, legal, etc is probably another $1-2m. Inference is a big question (hey Raycast, let's talk, I have some great cheap inference).

If that math is in the right ballpark, both Airbyte and Raycast are in position where they could turn a knob tomorrow and be profitable, without too much shellshock to their teams. AKA no hard layoffs.

## The Dream

This gives me hope and energy. I just joined Lambda a couple months ago. Lambda is a completely different beast — everyone is digging for gold with their bare hands, and we have the shovels, so our math is _wild_.

But as I am building out my teams here, I keep thinking — we chase insane compensation packages, unrealistic valuations based on expectation of unbounded growth. The dream is to work on a meaningful product that we believe in, with the team of people that you trust, who are your _true friends and as close to a family as it gets_. What does it take to get there?

So many folks I know want to _do good_ and go work for a non-profit or go into civil tech. Except we can't — it doesn't pay. What drives us to non-profits is the idea that VC-backed companies are a grind for a cause we don't subscribe to. So can we build our own little companies without compromising our values, and be successful?

Will I ever have the energy to build from scratch?

Will I ever have the guts to ask the people I love to join me, and what would it take to run to a spot where we are a team of 10-ish, generating enough money to sustain our lifestyles, support our families, while making astonishingly great product, and changing lives of our users for the better?

Folks at Raycast seem to be doing just that, and I am in awe.
