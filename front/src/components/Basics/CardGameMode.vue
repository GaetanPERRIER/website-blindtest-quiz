<script setup>
const props = defineProps({
    gameMode: { type: Object, required: true }
})

const badgeColors = {
    '🔥 Popular': 'rgba(255, 107, 53, 0.3)',
    '⚡ Rapide': 'rgba(255, 193, 7, 0.3)',
    '🧠 Réflexion': 'rgba(33, 150, 243, 0.3)',
    '✨ Nouveau': 'rgba(156, 39, 176, 0.3)'
}
</script>

<template>
    <div class="card-game-mode" @click="$router.push(gameMode.link)">
        <div class="card-game-mode-header">
            <div class="card-icon-wrap">
                <i :class="`ti ti-${gameMode.icon}`" aria-hidden="true"></i>
            </div>
            <span v-if="gameMode.badge" class="card-badge" :style="{ backgroundColor: badgeColors[gameMode.badge] }">
                {{ gameMode.badge }}
            </span>
        </div>
        <div class="card-game-mode-content">
            <h2>{{ gameMode.name }}</h2>
            <p>{{ gameMode.description }}</p>
        </div>
        <div class="card-game-mode-divider"></div>
        <div class="card-game-mode-footer">
            <button class="card-btn" @click.stop="$router.push(gameMode.link)">
                <i class="ti ti-player-play" aria-hidden="true"></i>
                <span>Jouer</span>
            </button>
            <span v-if="gameMode.players" class="card-meta">
                <i class="ti ti-users" aria-hidden="true"></i>
                {{ gameMode.players }}
            </span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.card-game-mode {
    position: relative;
    overflow: hidden;
    background: $color-surface;
    border: 1px solid $color-border;
    border-radius: 20px;
    cursor: pointer;
    backdrop-filter: blur($blur-md);
    -webkit-backdrop-filter: blur(20px);
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    background 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;

    // Animation d'entrée
    // -> séparée en deux animations distinctes :
    //    - cardFadeInOpacity reste en "forwards" pour ne pas redisparaître
    //    - cardFadeInTransform n'a PAS de "forwards" : une fois terminée,
    //      elle "lâche" la propriété transform, qui redevient libre pour
    //      le hover et les transitions (sinon l'animation continue de
    //      posséder transform indéfiniment et bloque toute transition)
    opacity: 0;
    animation:
        cardFadeInOpacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards,
        cardFadeInTransform 0.5s cubic-bezier(0.16, 1, 0.3, 1);

    // Effet de brillance
    &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.05) 0%, transparent 70%);
        opacity: 0;
        transition: opacity 0.5s ease;
        pointer-events: none;
        z-index: 0;
    }

    // Effet de bordure lumineuse au survol
    &::after {
        content: '';
        position: absolute;
        inset: -1px;
        border-radius: 20px;
        background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent, rgba(255,255,255,0.05));
        opacity: 0;
        transition: opacity 0.4s ease;
        z-index: -1;
        pointer-events: none;
    }

    &:hover {
        transform: translateY(-4px) scale(1.02);

        &::before {
            opacity: 1;
        }

        &::after {
            opacity: 1;
        }

        // Animation de l'icône
        .card-icon-wrap {
            background: rgba(255,255,255,0.15);
            border-color: rgba(255,255,255,0.3);

            i {
                transform: scale(1.15) rotate(-5deg);
                color: #fff;
            }
        }

        // Animation du badge
        .card-badge {
            transform: scale(1.08) translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        // Animation du titre
        .card-game-mode-content {
            h2 {
                color: #fff;
                transform: translateX(3px);
            }
            p {
                color: rgba(255, 255, 255, 0.85);
            }
        }

        // Animation du bouton
        .card-btn {
            transform: scale(1.05);
            box-shadow: 0 4px 20px rgba($major-yellow-color, 0.3);
        }

        // Animation du meta
        .card-meta {
            color: rgba(255, 255, 255, 0.8);

            i {
                transform: scale(1.1);
            }
        }

        // Animation du divider
        .card-game-mode-divider {
            background: rgba(255, 255, 255, 0.3);
            transform: scaleX(1.05);
        }
    }

    @keyframes cardFadeInOpacity {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes cardFadeInTransform {
        from {
            transform: translateY(25px) scale(0.95);
        }
        to {
            transform: translateY(0) scale(1);
        }
    }

    .card-game-mode-header {
        padding: 18px 18px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        z-index: 1;

        .card-icon-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 52px;
            height: 52px;
            border-radius: 14px;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.15);
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

            i {
                font-size: 26px;
                transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                color: rgba(255,255,255,0.9);
            }
        }

        .card-badge {
            backdrop-filter: blur(4px);
            padding: 4px 14px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
            border: 1px solid rgba(255,255,255,0.2);
            color: #fff;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            cursor: default;

            &:hover {
                transform: scale(1.08);
            }
        }
    }

    .card-game-mode-content {
        padding: 14px 18px 10px;
        position: relative;
        z-index: 1;

        h2 {
            font-size: 18px;
            font-weight: 700;
            color: $color-white;
            margin-bottom: 6px;
            text-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }

        p {
            font-size: 14px;
            line-height: 1.65;
            color: rgba(255, 255, 255, 0.7);
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            transition: color 0.3s ease;
        }
    }

    .card-game-mode-divider {
        margin: 0 18px;
        height: 1px;
        background: rgba(255, 255, 255, 0.15);
        transition: all 0.3s ease;
        position: relative;
        z-index: 1;
        transform-origin: center;
    }

    .card-game-mode-footer {
        padding: 10px 18px 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        z-index: 1;

        .card-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 14px;
            font-weight: 600;
            padding: 8px 18px;
            border-radius: 20px;
            border: none;
            cursor: pointer;
            background: $major-yellow-color;
            color: $color-black;
            transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
            letter-spacing: 0.01em;

            i {
                font-size: 13px;
                transition: transform 0.2s ease;
            }

            &:hover {
                background: darken($major-yellow-color, 8%);
                transform: scale(1.06) !important;
                box-shadow: 0 4px 15px rgba($major-yellow-color, 0.3);

                i {
                    transform: translateX(3px);
                }
            }

            &:active {
                transform: scale(0.95) !important;
            }
        }

        .card-meta {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.55);
            transition: all 0.3s ease;

            i {
                font-size: 13px;
                transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
        }
    }
}
</style>