# Family — Style Reference
> Pixar storyboard on cream paper — playful illustrated characters inhabit a warm off-white world where fintech feels like an adventure game.

**Theme:** light

Family lands like a children's book dropped into a fintech dashboard — warm off-white canvas (#fbfaf9) littered with expressive flat-illustrated characters in vivid primary colors (electric orange, grass green, sky blue, bright yellow) while the typography stays grounded and authoritative. The custom 'Family' typeface at 68px with tight -0.031em tracking carries the hero weight, while Inter handles everything else with progressively tighter letter-spacing as sizes increase. Cards use an inset warm-stone border (a single 1px shadow at #f2f0ed) instead of drop shadows, keeping surfaces flat and tactile. The only dark surface is the 'Get Started' pill button in near-black #121212 against the warm cream background — a single moment of contrast in an otherwise light, airy layout. The illustration vocabulary — wobbly blob creatures with stick legs and expressive faces — is the real identity system, not the color palette alone.

## Colors

| Name | Value | Role |
|------|-------|------|
| Warm Canvas | `#fbfaf9` | Page background, nav background, light button fill |
| Stone Surface | `#f2f0ed` | Card inset border color, secondary button background, subtle dividers |
| Parchment Card | `#f8f7f4` | Feature card backgrounds (display-p3 0.984 0.980 0.976 approximation) |
| Graphite | `#474645` | Body text, nav links, card body copy — the dominant text color across the entire page |
| Charcoal Primary | `#343433` | Nav text, headings at smaller sizes, links — mapped to --color-primary and --color-text |
| Midnight | `#121212` | Primary CTA button background, high-contrast heading text |
| Obsidian | `#000000` | Dark card background (phone mockup cards), icon fills |
| Ash | `#848281` | Muted body text, secondary nav labels |
| Fog | `#c6c6c6` | Footer text, inactive borders, dividers |
| Smoke | `#a7a7a7` | Disabled states, placeholder text, tertiary labels |
| Pepper | `#282624` | Dark nav overlay text, deep secondary labels |
| Ember Orange | `#ff3e00` | Primary brand accent — CTA text links, icon highlights, illustration character color — the single most prominent chromatic color site-wide, heat against the cream canvas |
| Meadow Green | `#00ca48` | Secondary brand accent — success indicators, illustration fills, receive/confirmation states |
| Sky Blue | `#0090ff` | Tertiary brand accent — links in body, illustration fills, Ethereum-related UI elements |
| Sunburst Yellow | `#ffbb26` | Quaternary brand accent — coin illustrations, star motifs, card highlights |
| Deep Amber | `#d48f00` | Yellow shadow/stroke in illustrations, icon outlines on yellow elements |
| Ocean Blue | `#0086fc` | Link color in body copy, stroke on blue illustration elements |
| Ice Blue | `#64c6ff` | Illustration fill — lighter blue tones on characters and graphics |
| Spearmint | `#00c978` | Illustration stroke and fill variant for green characters |
| Flamingo | `#ff58ae` | Illustration accent — pink character fills, occasional badge backgrounds |
| Violet Pop | `#9f4fff` | Illustration accent — purple character/NFT badge backgrounds |
| Coral Red | `#ff2b3a` | Error state background, destructive action indicator |
| Valid Green | `#00c454` | Success/valid input state — mapped to --background-valid |

## Typography

### Family — Hero and section display headlines only. The 68px/500 weight with -0.031em tracking is the signature move — a custom typeface that reads as a friendly geometric serif hybrid, warmer than Inter but less precious than a display serif. Used sparingly: 2-3 instances per page maximum.
- **Substitute:** Fraunces or Playfair Display at weight 500
- **Weights:** 500
- **Sizes:** 44px, 68px
- **Line height:** 1.09–1.10
- **Letter spacing:** -2.11px at 68px, -0.88px at 44px

### Inter — All UI text: nav (14px/500), body copy (15-17px/400), card labels (13px/500), buttons (14-15px/500-600), captions (12px/400). Letter-spacing tightens with size — large Inter (44px) gets -0.026em to match the display font's density.
- **Substitute:** System UI stack or IBM Plex Sans
- **Weights:** 400, 500, 600
- **Sizes:** 12px, 13px, 14px, 15px, 16px, 17px, 19px, 23px, 44px
- **Line height:** 1.00–1.58
- **Letter spacing:** -1.14px at 44px, -0.44px at 23px, -0.25px at 19px, -0.22px at 17px, -0.16px at 16px, -0.20px at 15px, -0.18px at 14px, -0.17px at 13px, -0.12px at 12px
- **OpenType features:** `normal`

### Type Scale

| Role | Size | Line Height | Letter Spacing |
|------|------|-------------|----------------|
| caption | 12px | 1.58 | -0.14px |
| body | 15px | 1.47 | -0.2px |
| heading-sm | 19px | 1.38 | -0.25px |
| heading | 23px | 1.2 | -0.44px |
| heading-lg | 44px | 1.09 | -1.14px |
| display | 68px | 1.09 | -2.11px |

## Spacing & Layout

**Base unit:** 4px

**Density:** comfortable

- **Page max-width:** 1200px
- **Section gap:** 120-180px
- **Card padding:** 32px
- **Element gap:** 8-12px

### Border Radius

- **tags:** 6px
- **cards:** 10px
- **icons:** 40px
- **inputs:** 10px
- **buttons:** 32px
- **cardsLarge:** 24px
- **buttonsPill:** 32px
- **illustrations:** 72px

## Components

### Primary CTA Button (Pill Dark)
**Role:** Main conversion action — 'Get Started', 'Download on iOS'

Background #121212, text #ffffff, border-radius 32px, padding 0px 14px. Inter 14px weight 500-600. The near-black pill floats against #fbfaf9 canvas as the site's only dark punch. Hover state likely lightens to #343433 via 0.2s ease transition.

### Secondary CTA Button (Pill Light)
**Role:** Alternative actions — 'Log In', 'Watch the Video'

Background #f6f4ef (warm cream), text #121212, border-radius 32px, padding 0px 14px. Inter 14px weight 500. Creates a paired hierarchy with the dark pill without competing — same shape, inverted warmth.

### Ghost Text Link Button
**Role:** Inline navigation links — 'Watch the demo', section CTAs

Background transparent, text color #ff3e00 (Ember Orange), border-radius 0px, padding 4px 0px. No border. Inter 14-15px weight 500. The underline-less orange text link is the signature inline action — orange on cream reads as warm urgency without a button shell.

### Outlined Navigation Button
**Role:** Tertiary actions in nav or contextual contexts

Background transparent, text #474645 (Graphite), border 1px solid #474645, border-radius 12px, padding 12px 32px 12px 12px. Inter 14px weight 500. Used for modal-adjacent actions that need definition without weight.

### Feature Card (White)
**Role:** Primary content cards — feature descriptions, testimonials

Background white (display-p3 1 1 1), border via inset box-shadow: color(display-p3 0.949 0.941 0.929) 0px 0px 0px 1px inset (warm stone border, ~#f2f0ed), border-radius 10px, padding 32px all sides. The inset shadow technique keeps borders off-layout-flow — cards look hand-placed on the canvas.

### Feature Card (Warm Cream)
**Role:** Secondary content panels — screenshot containers, demo previews

Background #f8f7f4 (display-p3 0.984 0.980 0.976), no box-shadow, border-radius 12px, padding 0px 22.8px 14px 22.8px. Slightly sunken into the page — the warm tint against #fbfaf9 creates a 1-level depth shift without any shadow.

### Dark Phone Mockup Card
**Role:** Product screenshot showcase — wallet UI demonstrations

Background #000000, border-radius 24px (top) 0px 0px 24px (bottom), box-shadow rgba(0,0,0,0.15) 0px 0px 24px 0px, padding 4px 0px 4px 4px. The only true drop shadow on the page — reserved for the product hero moment, making the dark phone pop off the cream background.

### Testimonial Card
**Role:** Social proof — Twitter/X quotes in 'Friends of Family' section

Background white, border via inset stone shadow (same as Feature Card White), border-radius 10px, padding 32px. Contains avatar (circular, ~40px), handle in Inter 13px #848281, body in Inter 15px #474645, X logo icon in top-right. Horizontally scrolling or grid-arranged.

### Illustration Character
**Role:** Decorative brand mascots — blob creatures, emoji animals scattered in hero

Flat illustrated characters using brand palette: Ember Orange, Meadow Green, Sky Blue, Sunburst Yellow, Flamingo. Contained in 72px radius rounded containers or free-floating. No shadow, no border. Characters have expressive faces (dot eyes, smile curves) and stick limbs. Sized 60-120px, clustered around headline.

### Navigation Bar
**Role:** Sticky top navigation

Background #fbfaf9 (canvas), height ~64px, box-shadow rgba(0,0,0,0.04) 0px 0px 0px 1px (barely-there outline). Logo left, nav links center in Inter 14px #343433 weight 500, 'Log In' ghost pill and 'Get Started' dark pill right. Dropdown chevrons on Developers/Resources.

### Section Heading
**Role:** Page section titles

Family typeface 500 at 68px with -2.11px letter-spacing and line-height 1.09 for hero. Inter 600 at 44px with -1.14px letter-spacing for sub-section heads. Color #343433 or #121212. Always left-aligned or centered — no right-aligned headlines.

### Colored Action Badge
**Role:** Transaction type labels inside wallet UI mockups — Send, Receive, Purchase

Circular icon badge: background in brand color (Meadow Green for Receive, Flamingo for Purchase), icon in white, border-radius 40px, ~40px diameter. Acts as the only iconographic navigation within the dark phone card context.

## Do's and Don'ts

### Do
- Use #fbfaf9 as page background — never pure white (#ffffff) at canvas level; the warm cream cast is the foundation of the tactile feel.
- Apply the inset stone border (box-shadow: color(display-p3 0.949 0.941 0.929) 0px 0px 0px 1px inset) on all white cards instead of a CSS border property — keeps cards off-layout-flow.
- Use border-radius 32px for all pill buttons (both #121212 dark and #f6f4ef light variants) — the pill shape is non-negotiable for interactive elements.
- Apply tight negative letter-spacing to all large text: -2.11px at 68px display, -1.14px at 44px heading-lg, scaling to near-zero at body sizes.
- Restrict the Family custom typeface to display and large section headings only (44px and 68px) — Inter handles all UI text regardless of weight.
- Use Ember Orange (#ff3e00) exclusively for text-link CTAs and illustration accents — never as a button background fill; its power is as an inline pop against cream.
- Space illustration characters asymmetrically around hero text — overlap the headline bounding box with characters to create depth through layering, not z-index stacking.

### Don't
- Don't use drop shadows on content cards — the inset warm-stone border is the only surface definition mechanism; shadows appear only on the dark phone mockup and hover-elevated states.
- Don't use pure #ffffff as a page background — it breaks the warm cream identity; #fbfaf9 is the minimum warmth threshold.
- Don't use the illustration characters as pure decoration at small sizes — below 60px they lose their expressive faces and become abstract blobs.
- Don't mix Inter weight 700+ with the Family display typeface — the site uses Inter max weight 600; heavier weights fight the custom font's personality.
- Don't apply Ember Orange (#ff3e00) to more than one UI element per viewport — its rarity is what creates urgency; overuse collapses the hierarchy.
- Don't use border-radius below 10px on cards — the minimum card radius is 10px; anything sharper breaks the soft-edged system.
- Don't use the Violet Pop (#9f4fff), Flamingo (#ff58ae), or Coral Red (#ff2b3a) colors in UI chrome — these are illustration-only accents and have no role in buttons, nav, or body text.

## Elevation

- **Feature Card (White):** `color(display-p3 0.949 0.941 0.929) 0px 0px 0px 1px inset`
- **Dark Phone Mockup Card:** `rgba(0, 0, 0, 0.15) 0px 0px 24px 0px`
- **Navigation Bar:** `rgba(0, 0, 0, 0.04) 0px 0px 0px 1px`
- **Elevated Card (hover/active):** `rgba(0, 0, 0, 0.04) 0px 1px 6px 0px, rgba(0, 0, 0, 0.05) 0px 0px 24px 0px`

## Surfaces

- **Canvas** (`#fbfaf9`) — Page background — warm off-white with a faint cream cast, not pure white
- **Card Surface** (`#ffffff`) — White card faces with a warm inset stone border — floats 1px above canvas visually
- **Recessed Panel** (`#f8f7f4`) — Screenshot and demo container backgrounds — slightly warmer than white, sits below card level
- **Stone Tint** (`#f2f0ed`) — Button backgrounds (secondary), inset border reference color, hover states on cream
- **Dark Shell** (`#000000`) — Phone mockup cards — full inversion for product showcase moments

## Imagery

Exclusively custom flat illustration — no photography anywhere on the page. Characters are organic blob-shaped creatures with stick limbs, dot eyes, and emoji-like expressions, rendered in vivid primaries (orange, green, blue, yellow) against the warm cream canvas. Illustration density is highest in the hero: 12-15 characters and objects scattered asymmetrically around the headline, creating a 'spilled toy box' composition. Product screenshots appear inside dark rounded phone mockups (border-radius 24px) — contained and framed, never bleeding to page edge. Icons are filled monochrome at small sizes; action badges use filled circles with white icon glyphs. The illustration style is the primary brand differentiator: deliberately childlike but executed with precision — consistent stroke weights, flat shading with no gradients, expressive character design that makes crypto feel approachable rather than intimidating.

## Layout

Max-width ~1200px centered on the warm canvas. Hero is full-viewport with centered headline text (Family typeface), flanked by illustration characters positioned left and right of the text column — not a split layout but a 'headline-surrounded-by-friends' composition. Below hero: alternating sections with generous vertical gaps (120-180px). Feature section uses a 3-column card grid (white cards with inset borders). Phone mockup sections show 2-3 device frames side by side on white or cream bands. Social proof section ('Friends of Family') uses a horizontal scrolling card row. Navigation is a fixed top bar with logo left, links center, actions right. Footer is minimal — link grid on canvas background. No sidebar, no mega-menu. Page is text-dominant with illustrations as punctuation, not wallpaper.

## Similar Brands

- **Lunchbox** — Same warm off-white canvas with flat illustrated characters as primary brand expression — both use illustration density to make a transactional product feel playful
- **Linear** — Shares the tight negative letter-spacing system and custom display typeface approach, though Linear goes dark where Family stays cream
- **Notionforms** — Same inset-border card technique (1px warm-toned inner ring) and Inter-based UI text system on warm-white backgrounds
- **Superhuman** — Pill buttons in near-black paired with a secondary cream pill — identical button pairing strategy and tight tracking on Inter headings
- **Raycast** — Custom display typeface reserved for hero scale while Inter handles all functional UI text — same typographic division of labor
