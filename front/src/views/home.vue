<script setup>
import CardGameMode from "@/components/Basics/CardGameMode.vue";

const gameModes = [
    {
        name: "Blindtest",
        description: "Identifie des morceaux musicaux avant tes adversaires et accumule un maximum de points.",
        icon: "headphones",
        badge: "🔥 Popular",
        players: "1–8 joueurs",
        link: "/blindtest"
    },
    {
        name: "Quiz",
        description: "Réponds à des questions à choix multiples le plus vite possible pour battre le chrono.",
        icon: "bulb",
        badge: "⚡ Rapide",
        players: "1–4 joueurs",
        link: "/quiz"
    },
    {
        name: "Memory",
        description: "Retrouve toutes les paires de cartes cachées en un minimum de tentatives. aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        icon: "cards",
        badge: "🧠 Réflexion",
        players: "1–2 joueurs",
        link: "/memory"
    },
    {
        name: "Wordle",
        description: "Devine le mot mystère en 6 essais grâce aux indices de couleur sur chaque lettre.",
        icon: "keyboard",
        badge: "✨ Nouveau",
        players: "Solo",
        link: "/wordle"
    },
]
</script>

<template>
    <div class="home-container">
        <div class="home-header">
            <span class="home-subtitle">🎮 Sélectionnez votre mode</span>
            <h1>Choisissez votre jeu</h1>
            <p class="home-description">Des expériences uniques pour tous les goûts</p>
            <div class="header-decoration">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </div>
        </div>
        <div class="home-container-game-modes">
            <CardGameMode v-for="gameMode in gameModes" :key="gameMode.name" :game-mode="gameMode" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.home-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 28px;

    .home-header {
        text-align: center;
        margin-bottom: 12px;
        position: relative;
        animation: headerAppear 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        opacity: 0;

        .home-subtitle {
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 3px;
            color: rgba(255,255,255,0.4);
            background: rgba(255,255,255,0.08);
            padding: 6px 16px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            display: inline-block;
            animation: subtitleFade 0.5s ease 0.15s forwards;
            opacity: 0;
            transform: translateY(-8px);
            border: 1px solid rgba(255,255,255,0.05);
            transition: all 0.3s ease;

            &:hover {
                background: rgba(255,255,255,0.12);
                border-color: rgba(255,255,255,0.15);
                transform: translateY(-2px) scale(1.02);
            }
        }

        h1 {
            font-size: 42px;
            margin: 16px 0 8px;
            background: linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.6));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: titleGlow 3s ease-in-out infinite, titleSlide 0.6s ease 0.25s forwards;
            opacity: 0;
            transform: translateY(18px) scale(0.96);
            position: relative;
            letter-spacing: -0.5px;

            &::after {
                content: '';
                position: absolute;
                bottom: -4px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 2px;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                animation: underlineExpand 0.7s ease 0.6s forwards;
            }
        }

        .home-description {
            font-size: 16px;
            color: rgba(255,255,255,0.5);
            animation: descriptionFade 0.5s ease 0.4s forwards;
            opacity: 0;
            transform: translateY(12px);
            transition: color 0.3s ease;

            &:hover {
                color: rgba(255,255,255,0.7);
            }
        }

        .header-decoration {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-top: 16px;
            animation: dotsAppear 0.5s ease 0.55s forwards;
            opacity: 0;

            .dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: rgba(255,255,255,0.2);
                animation: dotPulse 2s ease-in-out infinite;

                &:nth-child(1) { animation-delay: 0s; }
                &:nth-child(2) { animation-delay: 0.3s; }
                &:nth-child(3) { animation-delay: 0.6s; }
            }
        }
    }

    .home-container-game-modes {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
        width: 100%;
        max-width: 1100px;
        padding: 0 20px;

        @media (min-width: 1024px) {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    // Animation d'entrée pour les cartes (entre-deux)
    .card-game-mode {
        opacity: 0;
        animation:
            cardFadeInOpacityParent 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards,
            cardFadeInTransformParent 0.5s cubic-bezier(0.16, 1, 0.3, 1); // sans forwards !

        @for $i from 1 through 4 {
            &:nth-child(#{$i}) {
                animation-delay: #{$i * 0.07 + 0.5}s;
            }
        }
    }

    // Keyframes du header (entre-deux)
    @keyframes headerAppear {
        from {
            opacity: 0;
            transform: translateY(-25px) scale(0.96);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    @keyframes subtitleFade {
        from {
            opacity: 0;
            transform: translateY(-8px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes titleSlide {
        from {
            opacity: 0;
            transform: translateY(18px) scale(0.96);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    @keyframes titleGlow {
        0%, 100% {
            text-shadow: 0 0 20px rgba(255,255,255,0.05);
        }
        50% {
            text-shadow: 0 0 40px rgba(255,255,255,0.15);
        }
    }

    @keyframes underlineExpand {
        from {
            width: 0;
        }
        to {
            width: 60%;
        }
    }

    @keyframes descriptionFade {
        from {
            opacity: 0;
            transform: translateY(12px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes dotsAppear {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    @keyframes dotPulse {
        0%, 100% {
            transform: scale(1);
            opacity: 0.2;
        }
        50% {
            transform: scale(1.5);
            opacity: 0.6;
        }
    }

    @keyframes cardFadeInOpacityParent {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes cardFadeInTransformParent {
        from { transform: translateY(25px); }
        to { transform: translateY(0); }
    }

    // Effet de parallaxe subtil au hover du header
    .home-header:hover {
        .home-subtitle {
            transform: translateY(-2px);
            background: rgba(255,255,255,0.12);
        }

    }

    @keyframes shimmer {
        from {
            background-position: -200% center;
        }
        to {
            background-position: 200% center;
        }
    }
}
</style>