---
layout: post
title:  "How to create an animated and stateful toggle using only CSS (no Javascript!)"
date:   2015-1-31
custom-button-url: "http://codepen.io/pklada/pen/jEGwMB"
custom-button-title: "View on Codepen"
custom-button-class: button-view
img: "/images/toggle/toggle-web-image.png"
tags: ['css', 'no-js', 'guidebook']
like_text: Helpful
has_excerpt: true
---

[I recently posted a shot on Dribbble](https://dribbble.com/shots/1908149-CSS-only-toggle-no-js) demoing a component I worked on for a web project we're working on internally at Guidebook. The component is a simple binary toggle, but with a caveat: it was constructed using only CSS (and HTML of course). I had some requests to show how it was done, so I'll detail how to create your own CSS-only toggle here.

{% capture image_url %}{{ site.baseurl }}/assets/images/toggle/toggle.gif{% endcapture %}
{% include image.html src=image_url class="post_section" caption="'Binary Toggle' for a web project at Guidebook. Created using only CSS and some markup." %}


The Markup
---
Let's start with the HTML. The toggle is, at it's core, an input checkbox. This is how we store the state of the toggle without using Javascript -- the input element stores it's `checked` state internally.

The markup consists of a container `label`, an `input` element of type `checkbox`, and some additional elements to create the toggle background and switch.

<div class="code-block post_section">
<span class="code-block_title">HTML</span>
{% highlight html %}
<label class="tgl">
  <input type="checkbox" />
  <span class="tgl_body">
    <span class="tgl_switch"></span>
    <span class="tgl_track">
      <span class="tgl_bgd"></span>
      <span class="tgl_bgd tgl_bgd-negative"></span>
    </span>
  </span>
</label>
{% endhighlight %}
</div>

<!--end-->

I'm using a CSS framework we developed within Guidebook, but essentially `.tgl` is the module name, and all children elements must be preceded with that class name. Modifiers are indicated by a dash (`-`).

So, we have a `body` element which essentially contains all the markup used for display. The `switch` element renders the round switch part of the toggle. the `track` element defines the track that the switch can move on, and the `bgd` elements render the colored (or white) sections of the toggle background (and also contain background images for the checkmark and x).

The CSS
---
We use SCSS at Guidebook so this part is written in SCSS. I won't go into too much detail about how each element is handled, but I want to cover the most important part of the CSS which also happens to animate the toggle.

<div class="code-block post_section">
<span class="code-block_title">SCSS</span>
{% highlight scss %}
.tgl {
  > :checked ~ .tgl_body {

    > .tgl_switch {
      left: $toggle-width - $switch-size;
    }

    .tgl_bgd {
      right: -($toggle-width - ($switch-size / 2));

      &.tgl_bgd-negative {
        right: auto;
        left: -10px;
      }
    }
  }
}
{% endhighlight %}
</div>

The key part here is the `:checked ~ .tgl_body` line. The means that when the `input` element has a state of `:checked`, the elements within the `.tgl_body` class take on the defined rules. Notice the `~` selector, which selects, in this case, the `.tgl_body` class only if it is preceeded by a `:checked` element.

Its important to note that clicking anywhere on the parent `<label>` element will cause the child `<input>` element to either check or uncheck. This is native behavior of HTML.

When these rules come into play, the background sections, as well as the switch, animate either left or right. I of course defined some transitions on the `switch` and `bgd` elements in order to have them animate properly. The satisfying 'bounce' effect is gained by using a cubic-bezier curve, rather than an ease or linear curve.

<div class="code-block post_section">
<span class="code-block_title">SCSS</span>
{% highlight scss %}
$anim-slight-bounce: cubic-bezier(0.34,1.61,0.7,1);
$anim-speed-normal: 250ms;

.tgl_bgd {
  @include transition(left $anim-slight-bounce $anim-speed-normal, right $anim-slight-bounce $anim-speed-normal);
}
{% endhighlight %}
</div>

[I've recreated the full toggle in a Codepen](http://codepen.io/pklada/pen/jEGwMB). Let me know if it needs more explanation and I'll be happy to offer some.
