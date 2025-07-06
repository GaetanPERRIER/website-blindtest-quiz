<script setup>
</script>

<template>
    <section class="banner-infos-container">
        <div class="banner-content">
            <h2>Quiz musicaux et bien plus encore !</h2>

            <div class="banner-text">
                <p>
                    Pour le moment seul des blindtests "classiques" sont disponibles et jouables,
                    cependant d'autres mini-jeux dans l'univers de la musique sont à venir ainsi
                    que quelques variantes du blindtest traditionnel. Alors reste connecté !
                </p>

                <p>
                    Si tu as une quelconque proposition de jeu à ajouter, nous nous ferons
                    un plaisir de la découvrir !
                </p>
            </div>

            <button class="cta-contact t-body-text">
                Nous contacter
                <img src="/Home/BannerInfos/icon-enveloppe.png" alt="" class="envelope-icon">
            </button>
        </div>
    </section>
</template>

<style scoped lang="scss">
@import '@/assets/styles/settings/settings.scss';

.banner-infos-container {
    width: 100%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 80px 20px;

    .banner-content {
        max-width: 1000px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 30px;
        text-align: center;

        h2 {
            font-size: 2.5rem;
            color: $major-yellow-color;
            margin: 0;
            position: relative;

            &::after {
                content: '';
                display: block;
                width: 100px;
                height: 3px;
                background: $major-yellow-color;
                margin: 20px auto 0;
            }
        }

        .banner-text {
            display: flex;
            flex-direction: column;
            gap: 20px;

            p {
                font-size: 1.1rem;
                color: rgba(255, 255, 255, 0.9);
                line-height: 1.6;
                margin: 0;
            }
        }

        .cta-contact {
            display: flex;
            align-items: center;
            gap: 10px;
            background-color: $major-blue-color;
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            font-size: 18px;
            font-weight: 500;
            border: none;
            cursor: pointer;
            transition: all 300ms $authenticMotion;

            &:hover {
                background-color: darken($major-blue-color, 10%);
                transform: translateY(-3px);
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
            }

            .envelope-icon {
                width: 20px;
                height: 20px;
            }
        }
    }
}

@media (max-width: 768px) {
    .banner-infos-container {
        padding: 60px 20px;

        h2 {
            font-size: 2rem !important;
        }
    }
}
</style>