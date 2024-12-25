---
title: The endless pile of notifications in remote work
excerpt: How to lead a team in remote-first environment, and establish the communication systems and standards so that your team moves quickly, and people are healthy and happy and don't get routinely overwhelmed with notifications.
created: 2023-12-08
modified: 2023-12-08
draft: false
meta_description: How to lead a remote team, and help them manage notifications and mentions across Slack, Google Docs, Figma, and all the tools they are using.
meta_keywords: Remote, remote work, remote communications, notifications
og_image_hide_description: true
tags:
  - remote
  - engineering-leadership
---

# The endless pile of notifications in remote work

Returning to an inbox of 400 notifications is no fun, yet you get that after a week off. On the chart of things that are difficult for [[remote-and-async-work|teams trying to work remotely]], managing communication channels and notification volume is up there at the top.

People on remote teams will get overwhelmed from time to time, inevitably. But you've _been_ there already, you've _seen_ it happen again and again — so why don't you prepare your teams for it, and set up your communication systems in a way that doesn't hurt their brains as much?

All you need to do is to make people agree on how quickly they expect each other to reply to what types of questions and messages, and on what channels. In practice, it's a little bit more complicated than that.

## Cultures, intents, and expectations

Different people, different cultures. Remember the meme about what Americans and folks in different European countries mean when they say "Good" or "Interesting"? Remember how there's this stereotype about Eastern European engineers with Slavic accent being tone-deaf to the point of being rude? Right. Different cultures. We're going to make our own work culture, buckle up.

Some people assume that if they tagged you on Slack, you're bound to respond quickly, just as you would respond in a conversation if you met them iIRL. Others embrace _asynchronous work_ and treat Slack as it was a letter in your inbox.

> [!tip]
> You know what happens when you mix cultures without acknowledging their differences and helping them understand each other? Well, a client once told an engineer on my team "Yo, this feature is _sick_!". The engineer thought it's a bad thing, thought it was rude, and was pretty sad about that _for a week_.


It's your job as an engineering leader to listen to the people in your charge, help them agree on what *communication practice* works best for their group:
- **What's the intent expressed by a mention on Slack? Does the person need an immediate response, or no?**
- **What's an acceptable turnaround time?** In most of my teams, we mostly consider "same day" reasonable.
- **What channels and threads should each team member follow?** If there was a chat, do you expect that people have read if they were not mentioned on that thread?
- What channels follow that set of rules? What about comments on Google Docs, Loom Videos, Figma, GitHub issues?

**Once you figure out the rules, it's your job to write them down,** and make sure that everyone on the team actually follows them, and that the team can work well with the rest of the company.

In practice, someone on the team will be unhappy because suddenly, they might realize why they felt so awkward all the time, and that their work style is in fact not what everyone else was doing all along. Yikes. A difficult conversation for you to have. Luckily, you're a manager, and difficult conversations are what you enjoy, right?

Don't think that the only difficult conversations will be with people who don't read or reply to Slack messages. The other way happens, too. If everyone agrees that a reply on Slack is expected within a day, and someone starts _texting_ their co-workers on their personal phones because they want an urgent Slack reply, that's unacceptable, too. If and when that happens, it might be that the offender will not be on your team. Good luck 🙃

## Unsubscribe like you're getting paid every time you hit that button

Once you and your team agree on _how we want to talk to each other, and how we expect each other to respond_, you can write down the next most important document — a guide on how to set up all the notifications on all tools that you use for work. That should be in your handbook. *WDYM you don't have a handbook in a remote-first team?!*

When someone on the team complains that they're overwhelmed by the unrelenting stream of notifications and messages on every channel and that it's humanely impossible to be up to date — it's your job to remind them that _**in a remote-first company, managing their communication is a part of their job that they signed up for**._

But it's your job to make sure they know this, and to help them set up their communication subscriptions in a way that allows them to be up-to-date, and stay responsive, without exerting 10x engineer heroic all-nighter effort 3 times a week.

So, you make a guide on how to set up notifications, and you make sure everyone on the team:
- **Is only subscribed to the stuff that matters to them**. If your team agreed that get someone's attention we mention them specifically by handle, and we don't expect them to read every thread of every document otherwise — well, that means that people can opt to only be notified when they are mentioned by name. Great!
- Set up notifications for each platform. Some folks prefer keeping their email inbox empty, and check-in with each platform separately, and others prefer to dump all notifications into email, and grind through their inbox, combined. If you make a guide on how to do either of these approaches, though — that will help your engineers a lot. They're not trained to do this, so they'd appreciate the help.

## Default on notification debt intentionally when you have to

Having hundreds of unread notifications that are two weeks old is not helping anyone. Give people a way out — teach them how to default on their notification debt.

When people mention someone, they generally expect that the person got the memo. But if the recipient is currently being suffocated by anxiety of having the number on the notification badge exceed the number on their checking account, it's very likely that they have not, in fact, gotten the memo.

Worry not, the only thing the recipient has to do to get out of that trap is to just intentionally, deliberately, publicly acknowledge that they're drowning in notifications, and that they will not, in fact, read them at all. Then they mark all as read. And publicly say that if anyone awaits on a response from them, or if there's anything critical for them to see — please mention them again.

I strongly believe people should have that escape hatch. But there's a caveat. *Different cultures, remember?* My product manager once went back online after a few days off, and asked the team to ping them on the highest priority items for them to catch up on first. Someone more senior on another team looked at that and asked _me_ why _that product manager_ thinks _their time is more valuable than ours, and why can't they catch up on their own_.

This ritual needs to be alright with everyone. It's not because people are lazy, it's because spending days and days reading stale notifications is not the best use of time. Nobody should think less of others just because they default on notifications in extreme situations.

Just like unlimited PTO, of course, it's a trap. If someone starts every other week with "Happy Monday! I won't read my notifications, ping me if you need me" — you two are overdue for a chat.


## When mentioning people, leave meaningful context

This one is best in a form of an example.

You have a senior software engineer, Julia, who is just fantastic — she's been with the company for a long time, and built quite a few things, in different areas of your product. She recently led a feature-team, and the feature was merged and shipped under a feature flag a month ago.

Your account managers released it to customers in waves, and now your product manager Patrick has a request for an improvement that they have left as a comment on the Google Doc with the original feature spec.

Patrick made a first comment with a description of an edge case that was, on it's own, well-written. But they didn't mention anyone, and for that sin, they did not get a reply in the next two days.

> **Patrick**: Hey, so in a situation when this widget does not have enough data for the second line on the chart, can we show a little notice with a button to connect additional data stores?

Patrick is smart, they realized their mistake. So they reply to their own comment:
> **Patrick**: Hey @julia, can you take a look?

So, Julia receives an email from Google Docs that has just this — hey Julia, can you take a look? Sure, it has a link, but just scanning this — Julia has no clue what the hell she's stepping into, clicking on that link. She also does not know what Patrick expects her to do — does he expect her to work on the feature? Did he already talk to her engineering manager about it? etc.

> [!tip]
> When mentioning people, add concise, meaningful context. One sentence should tell people what they're looking at, what action is expected, and where to learn more.

It Patrick asked you how they could improve their comment, you should tell them to write something like:

> **Patrick**: Hey @julia, in the dashboard widget you shipped last month, there's this edge case. I'm looking for your feedback before I file a ticket. Not urgent, I don't expect you to build the thing.



## Read more

I've posted a few notes on remote work:
- [[remote-team-health-check|Remote team health check]] on how to quickly assess strong and weak sides of a team, and figure out what to focus on as a leader.
- [[remote-and-async-work]] on how to strengthen an asynchronous remote-first work environment.

There's no right or wrong way to work. Just like technologies and frameworks, the work communication framework you use is a tool. You choose a tool based on the job at hand, and on what you and your team know well.

If the team likes hybrid work, or likes to huddle at a white board with pizza and bears, and it works well for them — you _probably_ should not try and change _the whole team_.
