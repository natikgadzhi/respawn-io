---
title: The Trade-offs of Designing in HTML and Rails
excerpt: Rails approach to designing products (in code) allows teams to build _extremely quickly_, but constraints the team's ability to think with unorthodox or new approaches. Here's what I've seen happen in practice, when designing in code works well, what are some of the downsides, and when it just doesn't work at all.
created: 2023-11-30
modified: 2023-11-30
draft: false
meta_description: Here's what I've seen happen in practice, when designing in code works well, what are some of the downsides, and when it just doesn't work at all.
meta_keywords: Ruby on Rails, design in html, design in code
tags:
  - rails
og_image_hide_description: true
---
# The Trade-offs of Designing in HTML and Rails

Folks at 37Signals have _strong opinions_ on how to build products for the Web. Between ShapeUp, design philosophy, and Rails approaches to frontend, monolith vs services, and infrastructure, there are a _number of conventions_.

I don't like the personalities behind them, but the approaches are _generally very sane_ for the audience they're articulated for. They just don't generalize well, in my experience.

I'm yet to see an organization successfully and happily using ShapeUp in a team bigger than 50 people. _Get it? Rails (approach) doesn't scale? Hehe._

## Designers who can write code absolutely rock

> People who span across several areas of the work, generally, have a much stronger understanding of the overall goals, values, and motivations of the product. And as such, they're able to bring extreme clarity to the rest of the team. They're moving quickly. They have their own opinions about the product you're building. Designer + Engineer combo is not an exception from that rule.

In Zipline, I've been privileged to support not one, but _three_ absolutely amazing designers-turned-frontend-engineers. With them, and with ShapeUp, early on, we've been able to iterate on our products _very quickly_, and with a very respectable level of clarity for everyone involved.

When I worked on my own company, Amplifr, and later in Evil Martians, I had the pleasure of working with [Andrew Sitnik](https://sitnik.ru/en/), who you might know by his work on Autoprefixer and PostCSS. He basically designed all of Amplifr in the early years, from scratch, and also built half of the UI. He thought through the whole product experience.

In Amplifr, we were not just building a standard-issue Rails application. We were not confined to the Rails "DHH-approved" stack. We've built out optimistic UI with CRDT over [Logux](https://logux.org) backed by a Rails backend.

I do have to admit, teams that build with Rails are capable of building _a lot_, and doing so _quickly_. So while it might be very difficult to scale and grow such a team beyond certain threshold (more on this below), you can get _very, very far_ with a small team.

## Designers who can code are also rather rare

When we've been recently looking to hire product design folks at Zipline, it became pretty clear that even in the 2022-2023 market, folks who can design and implement their designs in HTML are rather rare. Folks who can do that, and are also experienced in the Rails stack, are even more exceedingly rare.

The problem here is that once you set up a team where your designers are expected to write Rails views, and contribute or prototype controllers for features they're envisioning, that team will have a very hard time onboarding designers with any other experience profiles.

"Rails stack" (Rails views, Hotwire, Stimulus, designers write said views) is great early on, but the more you align with it, the harder it might be to scale the team:
- Rails frontend is not an "industry standard" for designers. They don't have the tooling that they're used to.
- If your team _thinks and designs_ in code, they won't really like jumping into Figma and navigating your product designs in Figma once the team starts using it.
- Rails apps usually have a semblance of an implicit design system in their views and partials. Once you try to design in Figma, there will be a very well-meaning designer who starts tweaking the very primitives of your controls, and the design system brain split will be painful.

## Designing in code limits your creativity

> Sticking with just one mental model limits the number of angles you consider, limits your creativity in how you solve a problem.

The problem with designing and prototyping straight in HTML or Rails views is that it limits the level of polish and creativity that your team can apply to solving a problem.

Amplifr's team won't be able to build optimistic UIs with Rails primitives consistently, not at that time (Turbolink's idea of fragment reloading was shoving `js` code in `.slim` partials, good luck with that).

Think about the most beautiful and amazingly functional products you know of. They're likely not designed in code. Stripe's homepage and product documentation are likely not designed in HTML, despite Stripe using Rails heavily.

Admittedly, _most Rails apps don't need to push design to the limit of what's possible with modern HTML and CSS_. Depending on what audience is using your product, perhaps Rails frontend and Rails approach to design are totally fine! Most SaaS products out there just take content in, process it, perhaps sync in some more data from other systems, and present text content in different views and drilldowns. It's fine to use primitives that people already know and love, take an off the shelf design system and go for it. [Twitter Bootstrap](https://getbootstrap.com/), [Tailwind](https://tailwindcss.com), [Shopify Polaris](https://polaris.shopify.com/), [GitHub Primer](https://primer.style/), [Stripe Elements](https://stripe.com/payments/elements).

But sometimes, you need to drop the constraints of the technology that you have today, and think about what a great solution to the problem looks like, and then think backwards from that — think about what technology you need to make that solution a reality. If you only have designers-who-html on the team, they likely won't be as great at that type of work.