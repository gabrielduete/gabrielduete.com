# ADR-009: Microsoft Clarity for Analytics

## Context

I needed an analytics tool that:

- Provided user behavior insights
- Showed hot spots (heatmaps) of the site
- Tracked clicks and interactions
- Was free for personal use
- Integrated well with Next.js
- Respected user privacy

## Decision

I implemented **Microsoft Clarity** for analytics, utilizing:

- Heatmaps to visualize most clicked areas
- Session recordings to understand navigation
- Performance and engagement metrics
- Integration via script in Next.js
- Dashboard for data analysis

## More about

Video showing the recordings tab, you can see in detail the interaction of each
session:

(one cool thing is the click sound when the user clicks ahuahu)

<video controls width='100%'>
  <source
    src='/public/assets/images/blog/architecture-decisions/clarity-1.mp4'
    type='video/mp4'
  />
  Your browser does not support HTML5 videos.
</video>

<br />

Dashboard showing heatmaps and metrics:
![Microsoft Clarity
dashboard showing heatmaps and
metrics](/public/assets/images/blog/architecture-decisions/clarity-2.png)

Dashboard showing a heat map of the home:
![Microsoft Clarity heat map showing most clicked areas](/public/assets/images/blog/architecture-decisions/clarity-3.png)

## Alternatives Considered

- **Google Analytics**: More complete, but too complex for a personal blog
- **Hotjar**: I thought about using Hotjar at first, but several cool features
  are paid. With Clarity I got practically the same things for free.
