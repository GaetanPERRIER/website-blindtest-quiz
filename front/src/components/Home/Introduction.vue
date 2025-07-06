<script setup>
import CardGame from "@/components/Home/Utils/CardGame.vue";

const cardIntro = {
    imgPath: "/Home/Introduction/blindtest-image.png",
    cardTitle: "Blindtest",
    cardContent: "Teste tes connaissances musicales"
}
</script>

<template>
    <section class="introduction-container">
        <div class="introduction-content">
            <CardGame :img-path="cardIntro.imgPath" :card-title="cardIntro.cardTitle" :card-content="cardIntro.cardContent" class="intro-card"/>

            <div class="content-intro">
                <div class="content-intro-title">
                    <h2>Il est l'heure <span class="highlight-text">maestro</span> !</h2>
                </div>

                <p class="intro-description">
                    Seul ou entre amis, voyage à travers les styles et générations de musiques.
                    Ici, pas besoin de s'abîmer les cordes vocales pour se faire entendre !
                </p>

                <button class="cta-lets-go t-body-text">
                    C'est parti
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">
@import '@/assets/styles/settings/settings.scss';

.introduction-container {
    width: 100%;
    max-width: 1400px;
    padding: 0 40px;

    .introduction-content {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 80px;
        width: 100%;

        .content-intro {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 25px;
            max-width: 600px;

            .content-intro-title {
                display: flex;
                align-items: center;
                gap: 20px;

                h2 {
                    font-size: 3rem;
                    font-weight: 700;
                    color: white;
                    margin: 0;
                    line-height: 1.2;

                    .highlight-text {
                        color: $major-yellow-color;
                    }
                }

                .clock-icon {
                    width: 60px;
                    height: 60px;
                    animation: pulse 2s infinite;
                }
            }

            .intro-description {
                font-size: 1.2rem;
                color: rgba(255, 255, 255, 0.9);
                line-height: 1.6;
                margin: 0;
            }

            .cta-lets-go {
                display: flex;
                align-items: center;
                gap: 10px;
                background-color: $major-yellow-color;
                color: #000;
                padding: 15px 30px;
                border-radius: 50px;
                font-size: 18px;
                font-weight: 500;
                border: none;
                cursor: pointer;
                transition: all 300ms $authenticMotion;

                &:hover {
                    background-color: darken($major-yellow-color, 10%);
                    transform: translateY(-3px);
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
                }
            }
        }
    }
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

@media (max-width: 1000px) {
    .introduction-container {
        padding: 0 30px;

        .introduction-content {
            flex-direction: column;
            gap: 50px;

            .content-intro {
                align-items: center;
                text-align: center;

                .content-intro-title {
                    flex-direction: column;
                    gap: 15px;
                }
            }
        }
    }
}

@media (max-width: 768px) {
    .introduction-container {
        padding: 0 20px;

        .content-intro-title h2 {
            font-size: 2.5rem !important;
        }
    }
}
</style>