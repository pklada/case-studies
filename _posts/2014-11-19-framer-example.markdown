---
layout: post
title:  "Prototyping with Framer at Guidebook"
date:   2014-11-19
custom-button-url: "/assets/guidebook-search.framer.zip"
custom-button-title: "Download Framer file"
custom-button-class: button-download
img: "/images/guidebook-search.gif"
tags: ['framer', 'prototype', 'guidebook']
like_text: Helpful
---

I have been using [Framer](http://framerjs.com) for prototyping for a while now, but have recently started to make a concerted effort to use it on a daily basis to improve my interaction prototypes. I have quickly found it to be an invaluable tool &mdash; something which makes communicating with, and inspiring, developers a simple task. 

I wanted to share some of my work with the community, so I put together an interaction prototype the other day based off some experimental views we are working on at [Guidebook](http://guidebook.com). The prototype is honestly a little too complex for an actual prototype &mdash; the idea behind them is that you should be able to quickly pump them out and iterate on your existing designs, not spend huge amounts of time refining. But in any case, its fun to work on a more complete view prototype, so here you are. 

{% capture image_url %}{{ site.baseurl }}/assets/images/guidebook-search.gif{% endcapture %}
{% include image.html src=image_url class="post_section" caption="'Guide search' interaction prototype for Guidebook, created with Framer." %}

The prototype consists of five primary interactions: searching, redeeming a code, scanning a code, pulling to refresh, and scrolling the view. The view, to give some context, is an experimental way to display your guides within Guidebook.

Download the Framer file with the button below. The code is not super organized or well documented, but hopefully it helps someone learn a bit about what you can accomplish with the tool.
