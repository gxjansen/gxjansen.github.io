---
title: "AI slop is drowning communities. Reputation systems can fix it."
description: "AI-generated junk content is flooding every community platform. Traditional moderation can't keep up. Portable, cross-community reputation is a structural fix that addresses the root cause."
draft: true
authors:
  - gxjansen
pubDate: 2026-03-03
categories:
  - AI
  - Community
  - Open Source
---

In my [last post introducing Barazo](/post/introducing-barazo-community-forums/), I mentioned I'd write about the reputation system next so here it is. This turned out to be less about Barazo specifically and more about a problem that affects every online community right now.

## The slop problem

You've seen the forum or social media posts that read like they were written by someone who almost understands the topic. Stack Overflow answers that are technically correct but miss the actual question. LinkedIn comments that say nothing in three paragraphs. Blog posts that hit every SEO keyword without containing a single original thought.

This is AI slop. Generated content that exists to fill space, game algorithms, or fake engagement. And it's getting worse fast.

The volume of AI-generated text posted online has grown a lot since mid-2024. Not all of it is bad. But the ratio of generated noise to genuine signal is climbing in every community I participate in. And the tools to generate it are getting cheaper while the tools to detect it are falling behind.

I've run communities on Slack, Vanilla, and self-hosted forums. The moderation load has changed. The old playbook (spam filters, manual review, rate limiting) was built for human-speed abuse. It doesn't work when one person with a script can flood your forum with plausible-looking posts faster than your mod team can read them.

## Why traditional moderation fails

Most community platforms handle moderation at the content level. Flag a post. Review a post. Remove a post. Repeat.

This is a losing game against AI slop.

Volume is one part. A human moderator can review maybe 100 posts per hour. A slop generator can produce 100 posts per minute. The math doesn't work.

Then there's quality. Early AI spam was obviously fake. Current slop is harder to spot. It uses correct grammar, references real concepts, and sometimes even makes valid points. The tells are subtle: generic phrasing, lack of specific experience, responses that address the topic but not the conversation. I've caught posts that looked fine on first read but had zero connection to the thread they were replying to.

And persistence. Ban an account, they create another. IP blocks? VPN. Email verification? Disposable addresses. Every barrier you add costs real members more than it costs bad actors.

Content-level moderation is necessary but it's not enough. It treats symptoms. The structural problem is that most platforms can't distinguish between someone who's been genuinely helpful for three years and someone who created an account five minutes ago.

## Reputation as a structural defense

What if, instead of trying to evaluate every piece of content in isolation, you could evaluate the person posting it?

Their track record, specifically.

A member who has contributed useful answers across multiple communities over several years has earned something. Trust. And that trust should be portable and verifiable, not locked inside one platform's database where it disappears the moment they switch communities.

This is what cross-community reputation enables. A verifiable history of contributions that follows you and that you control. (I keep calling it "portable reputation" because that's the best label I have... open to better names.)

So what changes with this?

New accounts start with zero trust. A reasonable default. First posts go through review. As contributions prove genuine, restrictions loosen automatically. At Spryker we built something similar (new-account trust ramps), and it worked well even without cross-community data.

Established members get the benefit of the doubt. Someone with verified contributions across three communities doesn't need their posts pre-screened. They've earned that through behavior, not time.

Slop accounts can't fake history. You can generate a thousand plausible forum posts. You can't fake two years of helpful contributions that other real people actually engaged with across independent communities. This is the bit that makes the biggest difference, I think.

And bad behavior has lasting consequences. If you trash your reputation in one community, that information is available to other communities. Not an automatic ban, but signal. Each community still makes its own moderation decisions.

## Why portability matters

Most platforms already have some form of reputation: karma, points, trust levels, badges. The problem is that all of these are siloed.

Your 50,000 karma on Reddit means nothing on Discord. Your Stack Overflow reputation doesn't transfer to GitHub Discussions. Every platform you join, you start from zero. Even if you've been a valuable community member for a decade.

I've seen this frustration firsthand. When we moved the Spryker community from Slack to a self-hosted forum, our most active contributors went from being recognized voices to... new accounts. All their history, gone. We had to manually grant trust levels based on what we remembered. That's not scalable.

This creates a massive opening for AI slop. If everyone starts at zero everywhere, there's no way to tell the difference between a new genuine member and a new bot account.

Portable reputation closes that gap. When a member logs into a new Barazo community, their history from other communities is visible. Not the content itself (that stays with each community), but the reputation signal: how much they contributed, how the community received it, and whether they were flagged for abuse.

## How this works on AT Protocol

I'm building Barazo on [AT Protocol](https://atproto.com/) because the protocol's architecture makes portable reputation possible without a central authority.

Identity is decentralized. Your AT Protocol identity (your Bluesky handle) isn't owned by any single application. You can move it between providers. Your reputation is tied to an identity you control, not an account some company controls.

Data is user-owned. When you post in a Barazo forum, that content is written to your Personal Data Server (PDS), not Barazo's database. Barazo indexes it for fast browsing, but you own the original. Same applies to reputation data.

And AT Protocol's firehose lets any application subscribe to public data. A reputation service can aggregate signals from every Barazo instance (and potentially other AT Protocol apps) without any single party controlling the data.

In practice, the reputation system works like this:

Every topic, reply, and reaction is a verifiable record on the user's PDS. No platform can inflate or erase your contributions because they don't control the source data. This is the foundation.

Scoring looks at multiple signals. Reputation isn't a post count. It factors in how others responded (genuine engagement vs. ignored posts), consistency over time, and diversity across communities. Gaming one metric is easy. Gaming all of them simultaneously across independent communities... much harder.

Each forum instance decides how much weight to give external reputation. A technical community might care most about contribution quality in similar communities. A local community might prioritize local participation. The reputation data is shared; the interpretation is local.

And reputation isn't permanent. Old contributions matter less than recent ones. If someone had a bad period, sustained good behavior rebuilds trust. People change. The system should reflect that.

## Beyond forums

This isn't a forum-specific problem. AI slop is hitting every platform. And the reputation problem (starting from zero everywhere, trust locked in silos) exists across the entire internet.

The work I'm doing with Barazo is a starting point. AT Protocol's open nature means any application can participate in the reputation ecosystem. A comment on a Bluesky post, a contribution to an open source project, a helpful answer in a forum... these could all feed into a portable reputation that you carry with you.

Switching from one community platform to another without losing everything you've built. New community members arriving with a verifiable track record instead of a blank slate. Moderators having signal about whether a post is probably genuine before they even read it. That's where this is going, and the protocol infrastructure to build it already exists.

## What this doesn't solve

There are real limitations.

Reputation systems can be gamed. Cross-community portable reputation is harder to game than single-platform systems, but coordinated groups could still artificially inflate each other's reputation. The multi-signal scoring and decay mechanisms help. No system is bulletproof though.

Privacy is a tradeoff. Portable reputation means your activity in one community is visible to others. That's the point, but it's also a fair concern. The system needs controls for what you share, where, and with whom. I'm still working through the right defaults here.

This doesn't eliminate moderation either. Even with perfect reputation data, communities still need human moderators making judgment calls. Reputation adds signal. It doesn't replace human decisions.

And adoption is the hard part. A reputation system is only as useful as the network participating in it. One forum's reputation data is a data point. A thousand forums' reputation data is an ecosystem. Getting there takes time. (Sound familiar? Same chicken-and-egg problem every protocol faces.)

## Where this is going

AI-generated content is only going to increase. The models are getting better, cheaper, and more accessible. Within a year or two, I think the difference between human-written and AI-generated text will be nearly undetectable by automated tools.

Content-level moderation can't win this arms race alone. We need structural solutions that make it economically unattractive to produce slop. Reputation systems that carry real weight across communities, tied to identities that people actually invest in, are one of those solutions.

The current internet architecture (isolated platforms, siloed identities, starting from zero everywhere) was built before AI content generation existed. It doesn't fit a world where content is cheap and trust is scarce.

We can keep patching that. Or we can build something that works for the world we're actually living in.

I'm building the latter. [Barazo is open source](https://github.com/orgs/singi-labs/repositories) and the reputation system is being built in the open. If you're working on similar problems or have thoughts on the approach, I'd like to hear from you.

What's your community's strategy for dealing with AI-generated content? And does portable reputation sound like a solution you'd actually use?
