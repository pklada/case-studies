---
layout: post
title:  "Guidebook's Feed Animation"
date:   2016-1-16
img: "/images/plada-feed.png"
custom_buttons:
  - url: "https://guidebook.com/event-apps/activity-feed/"
    title: "More about the feed"

tags: ['feed', 'activity', 'css', 'animation', 'javascript']
---

We recently released a major update to Guidebook, which included [the new activity feed](https://guidebook.com/event-apps/activity-feed/). It was a big milestone, and something I'll write more about in the future, but I wanted to share one thing that I worked on to help promote it which I thought was cool.

We wanted to display the feed on our site, but didn't want simply a static image as that wouldn't show off enough of what the feed offered. We also shied away from a video, mainly due to difficulties in updating it and translating it to other languages. I decided to create a series of animations using pure css and javascript in order to show the feed "in use". I think the result turned out nice:

<div class="media media-feed post_section">
  <div class="media_iframe">
    <iframe src="https://guidebook.com/feed/build/feed.html" width="375" height="667" frameBorder="0" scrolling="no"></iframe>
  </div>
  <div class="media_caption">A representation of Guidebook's new activity feed, using css transitions.</div>
</div>

The solution was fairly simple. I created a few views which contained screenshots of various states of the feed. I would then transition between these views using css transitions. The "finger taps" were also simulated using css transitions and some simple javascript. The entire thing is run on a super minimal javascript animation timeline.

The obvious benefits of this approach is that you can easily update screenshots, views, etc as the app evolves. Its also much easier to translate to other languages, as I'd just have to dump in translated screenshots rather than having to re-record a video. Its in an iframe right now, but if you were to directly insert it into your codebase, you could hook into various animations and adjust other sections of your site accordingly. The obvious downsides (relative to video) is that its not a true 1:1 representation of what the app can do, and you lose out on some of the more granular interactions.

If there is more interest in this I can throw it up on github to show how it was done.
