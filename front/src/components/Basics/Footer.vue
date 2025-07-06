<script setup>
const currentYear = new Date().getFullYear();

const socialLinks = [
    { icon: '/Footer/discord.png', alt: 'Discord', url: '#' },
    { icon: '/Footer/X.png', alt: 'Twitter/X', url: '#' },
    { icon: '/Footer/instagram.png', alt: 'Instagram', url: '#' }
];

const navLinks = [
    { label: 'Accueil', url: '#' },
    { label: 'Jouer', url: '#' },
    { label: 'Contact', url: '#' }
];
</script>

<template>
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-section">
                <h3 class="footer-title">Navigation</h3>
                <nav class="footer-nav">
                    <a
                        v-for="(link, index) in navLinks"
                        :key="index"
                        :href="link.url"
                        class="nav-link"
                    >
                        {{ link.label }}
                        <span class="underline"></span>
                    </a>
                </nav>
            </div>

            <div class="footer-section">
                <h3 class="footer-title">Réseaux sociaux</h3>
                <div class="social-links">
                    <a
                        v-for="(social, index) in socialLinks"
                        :key="index"
                        :href="social.url"
                        class="social-link"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            :src="social.icon"
                            :alt="social.alt"
                            class="social-icon"
                        >
                    </a>
                </div>
                <a href="mailto:email.example@gmail.com" class="email-link">
                    email.example@gmail.com
                    <span class="underline"></span>
                </a>
            </div>
        </div>

        <div class="footer-bottom">
            <p class="credits">
                &copy; {{ currentYear }} Maestro. Tous droits réservés.
                <span class="api-credit">Musiques fournies par Deezer API</span>
            </p>
        </div>
    </footer>
</template>

<style scoped lang="scss">
@import '@/assets/styles/settings/settings.scss';

.footer {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(15px);
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding: 60px 20px 30px;
    color: white;
    font-size: 1rem;
    position: relative;
    z-index: 10;

    .footer-content {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 40px;
        padding-bottom: 40px;
        margin-bottom: 30px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }

    .footer-section {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 25px;
    }

    .footer-title {
        color: white;
        font-size: 1.3rem;
        font-weight: 600;
        margin: 0 0 15px;
        position: relative;
        padding-bottom: 10px;

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 50px;
            height: 3px;
            background: $major-yellow-color;
            border-radius: 3px;
        }
    }

    .footer-nav {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .nav-link, .email-link {
        color: white;
        text-decoration: none;
        transition: all 0.3s ease;
        font-size: 1rem;
        padding: 5px 0;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: fit-content;
        position: relative;

        &:hover {
            .underline {
                width: 100%;
                opacity: 1;
            }
        }
    }

    .underline {
        height: 2px;
        width: 0;
        background: $major-yellow-color;
        margin-top: 5px;
        border-radius: 2px;
        opacity: 0;
        transition: all 0.3s ease;
    }

    .social-links {
        display: flex;
        gap: 15px;
        margin-bottom: 20px;
    }

    .social-link {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 45px;
        height: 45px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        transition: all 0.3s ease;
        backdrop-filter: blur(5px);

        &:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-3px) scale(1.1);
        }
    }

    .social-icon {
        width: 24px;
        height: 24px;
        filter: brightness(0) invert(1) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
    }

    .footer-bottom {
        max-width: 1200px;
        margin: 0 auto;
        text-align: center;
        padding-top: 20px;
    }

    .credits {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.8);
        margin: 0;
    }

    .api-credit {
        display: block;
        margin-top: 8px;
        font-size: 0.8rem;
    }
}

@media (max-width: 768px) {
    .footer {
        padding: 40px 20px 20px;

        .footer-content {
            grid-template-columns: 1fr;
            gap: 30px;
            padding-bottom: 30px;
        }

        .footer-section {
            align-items: center;
            text-align: center;

            .footer-title::after {
                left: 50%;
                transform: translateX(-50%);
            }
        }

        .footer-nav {
            align-items: center;
        }

        .nav-link, .email-link {
            align-items: center;
        }
    }
}
</style>