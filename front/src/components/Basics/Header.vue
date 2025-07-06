<script setup>
import { ref } from 'vue';

const isMenuOpen = ref(false);

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};

const navLinks = [
    { label: 'Accueil', url: '/' },
    { label: 'Jouer', url: '/blindtest' },
    { label: 'À propos', url: '/about' },
    { label: 'Contact', url: '/contact' }
];
</script>

<template>
    <header class="header">
        <div class="header-container">
            <!-- Logo -->
            <router-link to="/" class="logo-link">
                <img src="/Header/temp-logo.png" alt="Maestro Logo" class="logo">
            </router-link>

            <!-- Navigation principale -->
            <nav class="main-nav  u-p10">
                <ul class="nav-list">
                    <li v-for="(link, index) in navLinks" :key="index" class="nav-item">
                        <router-link
                            :to="link.url"
                            class="nav-link"
                            active-class="active-link"
                        >
                            {{ link.label }}
                            <span class="underline"></span>
                        </router-link>
                    </li>
                </ul>
            </nav>

            <!-- Bouton Jouer -->
            <router-link to="/blindtest" class="play-button">
                <img src="/Header/mirco-icon.png" alt="Micro" class="micro-icon">
                <span class="t-body-text">Jouer</span>
            </router-link>

            <!-- Menu mobile - Hamburger CSS -->
            <button class="hamburger" @click="toggleMenu" :class="{ 'is-active': isMenuOpen }">
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            </button>

            <!-- Menu mobile déroulant -->
            <transition name="slide-down">
                <div v-if="isMenuOpen" class="mobile-menu">
                    <ul class="mobile-nav-list">
                        <li v-for="(link, index) in navLinks" :key="index" class="mobile-nav-item">
                            <router-link
                                :to="link.url"
                                class="mobile-nav-link"
                                @click="toggleMenu"
                            >
                                {{ link.label }}
                                <span class="mobile-underline"></span>
                            </router-link>
                        </li>
                    </ul>
                </div>
            </transition>
        </div>
    </header>
</template>

<style scoped lang="scss">
@import '@/assets/styles/settings/settings.scss';

.header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(15px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    z-index: 1000;
    padding: 15px 0;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.header-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
}

.logo-link {
    display: flex;
    align-items: center;

    .logo {
        height: 45px;
        transition: transform 0.3s ease;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));

        &:hover {
            transform: scale(1.05) rotate(-5deg);
        }
    }
}

.main-nav {
    display: flex;
    align-items: center;

    @media (max-width: 1000px) {
        display: none;
    }
}

.nav-list {
    display: flex;
    gap: 30px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.nav-item {
    position: relative;
}

.nav-link {
    color: white;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    padding: 8px 0;
    font-size: 20px;

    display: flex;
    flex-direction: column;
    align-items: center;

    &:hover {
        .underline {
            width: 100%;
            opacity: 1;
        }
    }

    &.active-link {
        .underline {
            width: 100%;
            opacity: 1;
        }
    }
}

.underline {
    height: 3px;
    width: 0;
    background: $major-yellow-color;
    margin-top: 5px;
    border-radius: 3px;
    opacity: 0;
    transition: all 0.3s ease;
}

.play-button {
    display: flex;
    align-items: center;
    gap: 10px;
    background: linear-gradient(135deg, #FF6E6E 0%, #FFDF6B 100%);
    color: #fff;
    padding: 12px 30px;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 400;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    font-size: 18px !important;
    box-shadow: 0 4px 15px rgba(255, 110, 110, 0.4);

    &:hover {
        transform: translateY(-3px) scale(1.05);
        box-shadow: 0 6px 20px rgba(255, 110, 110, 0.6);
    }

    .micro-icon {
        width: 22px;
        height: 22px;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
    }
}

/* Hamburger Menu CSS */
.hamburger {
    display: none;
    flex-direction: column;
    justify-content: space-around;
    width: 30px;
    height: 24px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 1100;
    transition: all 0.3s ease;

    @media (max-width: 1000px) {
        display: flex;
    }

    &:focus {
        outline: none;
    }
}

.hamburger-line {
    width: 100%;
    height: 3px;
    background: white;
    border-radius: 2px;
    transition: all 0.3s ease;
    transform-origin: center;
}

.hamburger.is-active {
    .hamburger-line:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
    }

    .hamburger-line:nth-child(2) {
        opacity: 0;
    }

    .hamburger-line:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
    }
}

.mobile-menu {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: rgba(26, 26, 46, 0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    padding: 20px 40px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.mobile-nav-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.mobile-nav-item {
    display: flex;
    justify-content: center;
}

.mobile-nav-link {
    color: white;
    text-decoration: none;
    font-size: 1.2rem;
    font-weight: 500;
    transition: all 0.3s ease;
    padding: 12px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    &:hover {
        .mobile-underline {
            width: 80%;
            opacity: 1;
        }
    }
}

.mobile-underline {
    height: 2px;
    width: 0;
    background: $major-yellow-color;
    margin-top: 8px;
    border-radius: 2px;
    opacity: 0;
    transition: all 0.3s ease;
}

.slide-down-enter-active,
.slide-down-leave-active {
    transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

@media (max-width: 768px) {
    .header-container {
        padding: 0 20px;
    }

    .mobile-menu {
        padding: 15px 20px;
    }
}
</style>