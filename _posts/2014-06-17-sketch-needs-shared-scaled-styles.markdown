---
layout: post
title:  "Sketch Needs Shared Style Scaling"
date:   2014-06-17 23:47:22
has_excerpt: true
---

I use Sketch on an almost daily basis now, near completely replacing Photoshop as my primary UI editing and creation tool. Overall it's great: it's performant, it affords context via multiple artboards in the same project, and it allows easy style sharing via linked styles and symbols. 

There is one feature that would make my workflow more efficient by quite a margin which is currently missing: **scaled (shared) styles**. 

<!--end-->

Now, I tweeted back and forth with the Sketch guys, and they let me know that style scaling would be contrary to the workflow envisioned for Sketch -- design once, generate multiple asset sizes on export. In general, I agree with this maxim. It allows for quick iteration and cuts out the tedium of maintaining multiple raw asset files per density. 

<blockquote class="twitter-tweet" lang="en"><p><a href="https://twitter.com/pklada">@pklada</a> you have a point there. However, current workflow is oriented towards having 1 vector asset, and multiple sizes for export…</p>&mdash; Sketch (@sketchapp) <a href="https://twitter.com/sketchapp/statuses/477177563362885632">June 12, 2014</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
<br/>
However, my personal workflow contains a few instances where scaled styles would be extremely beneficial.

I do a large amount of UI design for Android, and if you are at all familiar with Android interface development you'll be no stranger to nine-patches. Nine-patches are, essentially, a way to bake the streching and padding of an asset directly into the image file itself via 1px black borders. The borders around the image need to be 100% black or 100% transparent to define stretchable/padding regions, and if they arent, the app will fail to build. 

With that in mind, you simply cannot create nine-patch assets in Sketch and expect the program to export the assets with the correct 1px borders around the image intact (Sketch's export will shrink/enlarge the 1px borders and create a malformed nine-patch). So, I have to create multiple instances of the same shape with the borders pre-baked. My secondary artboard often looks something like this:

{% capture image_url %}{{ site.baseurl }}/assets/images/9-patch-artboard.png{% endcapture %}
{% include image.html src=image_url class="post_section" caption="(As an aside, it would be even more amazing if there was somehow nine-patch support built into Sketch, but I digress.)" %}


This is where scaled styles would be incredibly handy. On my first artboard, I layout the views as they would appear in the app, defining the base styles there. Then, on the secondary artboard where I maintain the shapes with their pre-baked 1px borders, I would link the styles from artboard one. Currently, I can only link the style to the first shape (or whichever shape matches the native density of the project). I then have to copy the style over to the other shapes, and scale down the styles manually. This sucks, and doens't allow me to quickly iterate on designs as any slight change to the base styles has to be manually copied and scaled across four distinct shapes per object. 

If I could simply assign a style to a shape, and then select a scale factor for that style (.75x, .5x, etc) it would allow rapid iteration on nine-patch shape styles. 

Agree or disagree with anything I said? Let me know on [Twitter](http://twitter.com/pklada)! Would love to hear other designer's thoughts (or if you have a better way of tackling this situation).
