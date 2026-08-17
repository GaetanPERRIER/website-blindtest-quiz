# BeatQuiz — Design System & Branding

> Référence des tokens visuels (couleurs, typographie, boutons) utilisés dans `front/src/assets/styles/`

---

## Brand Identity

### Logo

**Concept :** Casque audio + notes de musique stylisées

- **Icône primaire :** `beatquiz-logo.svg` (48x48 px) — Identifiant à afficher sur toutes les pages
- **Favicon :** `beatquiz-favicon.svg` — Version optimisée 32x32 px pour les onglets navigateur
- **Palette :** Gradient chaud FF6E6E → FFDF6B (rouge → jaune)

### Tagline

**"Guess the song. Beat your friends."**

---

## Color System

### Primary Gradient

```
$color-primary-gradient: linear-gradient(135deg, #FF6E6E 0%, #FFDF6B 100%)
```

**Usage :**
- CTA buttons (Start, Create, Join)
- Logo & branding
- Highlights & accents

### Surface & Interaction

| Variable | Value | Usage |
|---|---|---|
| `$color-surface` | `rgba(255, 255, 255, 0.1)` | Card backgrounds, panels |
| `$color-surface-hover` | `rgba(255, 255, 255, 0.15)` | Hover state |
| `$color-surface-active` | `rgba(255, 255, 255, 0.2)` | Active state |
| `$color-border` | `rgba(255, 255, 255, 0.2)` | Default borders |
| `$color-border-hover` | `rgba(255, 255, 255, 0.3)` | Border interaction |

### Text

| Variable | Value | Usage |
|---|---|---|
| `$color-text` | `#ffffff` | Primary text |
| `$color-text-muted` | `rgba(255, 255, 255, 0.6)` | Secondary text, labels |
| `$color-text-light` | `rgba(255, 255, 255, 0.4)` | Disabled, hints |

### Semantic Colors

| Color | Value | Usage |
|---|---|---|
| Success | `#55EFC4` | Correct answer, check marks |
| Warning | `#FFBB33` | Cautions, alerts |
| Danger | `#FF6B6B` | Errors, wrong answers |
| Info | `#A29BFE` | Information, hints |

### Player Avatar Colors (6 slots)

```scss
$player-colors: (
  #FF6B6B,   // Red
  #4ECDC4,   // Teal
  #A29BFE,   // Purple
  #FFEAA7,   // Yellow
  #FD79A8,   // Pink
  #55EFC4    // Mint
);
```

**Usage :** Bande de couleur unique pour chaque slot joueur (0-5)

---

## Typography

### Scale

| Name | Size | Usage |
|---|---|---|
| `xs` | 11px | Timestamps, meta info |
| `sm` | 13px | Labels, captions |
| `base` | 15px | Body text, standard copy |
| `lg` | 18px | Buttons, call-outs |
| `xl` | 22px | Subheadings, emphasis |
| `2xl` | 28px | Section titles |
| `3xl` | 36px | Main headings, hero |

**Font Family :** `Poppins, sans-serif`

**Line Heights :**
- `tight: 1.2` — Headings, compact text
- `normal: 1.5` — Standard body text
- `relaxed: 1.75` — Descriptive text

---

## Spacing Scale

| Name | Value | Usage |
|---|---|---|
| `xs` | 4px | Minimal gaps |
| `sm` | 8px | Small padding, borders |
| `md` | 12px | Standard padding |
| `lg` | 16px | Button padding, section gaps |
| `xl` | 24px | Large sections, gutter |
| `2xl` | 32px | Major section spacing |
| `3xl` | 48px | Page-level padding |

---

## Button System

### 3 Variants

#### 1. **Primary Button** — `.btn-primary`

**Purpose :** Main calls-to-action (Start Game, Create Lobby, Join)

**Style :**
- Gradient background (FF6E6E → FFDF6B)
- Black text (#060606) — fort contraste
- Shadow: `0 8px 24px rgba(255, 110, 110, 0.3)`
- Border radius: 12px
- Padding: 16px 32px

**States :**
- Default: Full gradient + shadow
- Hover: Translatey(-2px), stronger shadow
- Active: No translate, lighter shadow
- Disabled: 50% opacity, no interaction

```html
<button class="btn-primary">Start Game</button>
```

#### 2. **Secondary Button** — `.btn-secondary`

**Purpose :** Secondary actions (Cancel, Settings, Back)

**Style :**
- Background: `rgba(255, 255, 255, 0.1)` avec glassmorphism blur
- Border: 2px solid `rgba(255, 255, 255, 0.2)`
- White text
- Border radius: 12px
- Padding: 16px 32px

**States :**
- Hover: Lighter background, border highlight, subtle shadow
- Active: Slightly darker background

```html
<button class="btn-secondary">Cancel</button>
```

#### 3. **Ghost Button** — `.btn-ghost`

**Purpose :** Tertiary / subtle actions (Copy link, Toggle settings)

**Style :**
- Background: Transparent
- Border: 1px solid `rgba(255, 255, 255, 0.2)`
- White text
- Border radius: 8px
- Padding: 12px 16px

**States :**
- Hover: `$color-surface` background, `$color-accent` text
- Active: Slightly darker background

```html
<button class="btn-ghost">Copy Link</button>
```

### Size Modifiers

- `.btn-sm` — Smaller padding & font (use for secondary actions)
- `.btn-lg` — Larger padding & font (use for hero CTAs)
- `.btn-full-width` — 100% width

### Special States

- `.btn-loading` — Spinner animation, disabled pointer events
- `:disabled` — 50% opacity, no cursor, no interaction

---

## Shadows & Effects

| Variable | Value | Usage |
|---|---|---|
| `$shadow-sm` | `0 1px 2px rgba(0, 0, 0, 0.05)` | Subtle cards |
| `$shadow-md` | `0 4px 6px rgba(0, 0, 0, 0.1)` | Standard elevation |
| `$shadow-lg` | `0 10px 15px rgba(0, 0, 0, 0.2)` | Prominent cards, modals |
| `$shadow-xl` | `0 20px 25px rgba(0, 0, 0, 0.3)` | Floating elements |

### Blur (for glassmorphism)

| Variable | Value |
|---|---|
| `$blur-sm` | 4px |
| `$blur-md` | 8px |
| `$blur-lg` | 12px |

---

## Animation

### Durations

| Variable | Value | Usage |
|---|---|---|
| `$duration-fast` | 150ms | Quick interactions, hovers |
| `$duration-normal` | 300ms | Standard transitions |
| `$duration-slow` | 500ms | Complex animations, reveals |

### Easing Functions

- `$authenticMotion` — Standard ease (`.4,0,.2,1`) — Most interactions
- `$easeOutBackPlus` — Bounce exit — Button press feedback
- `$magikMotion` — Smooth curve (`.645,.045,.355,1`) — Flowing movements
- `$easeOutBack` — Spring effect — Entrance animations

---

## Components

### Logo Component

```scss
.logo {
    height: 48px;
    width: auto;
    
    &-link {
        display: flex;
        align-items: center;
        text-decoration: none;
        transition: transform $duration-normal $authenticMotion;
        
        &:hover {
            transform: scale(1.05);
        }
    }
}

.logo-text {
    font-size: $font-size-2xl;
    font-weight: 700;
    background: $color-primary-gradient;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-left: $spacing-md;
}
```

**Usage :**
```html
<router-link to="/" class="logo-link">
    <img src="/beatquiz-logo.svg" alt="BeatQuiz" class="logo">
    <span class="logo-text">BeatQuiz</span>
</router-link>
```

---

*Les tokens et composants ci-dessus sont en place et utilisés dans le front. Pour le suivi des tâches restantes, voir le Notion du projet plutôt que ce fichier.*

