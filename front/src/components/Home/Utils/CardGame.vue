<script setup>
defineProps({
    imgPath: String,
    cardTitle: String,
    cardContent: String,
    comingSoon: {
        type: Boolean,
        default: false
    }
})
</script>

<template>
    <div class="card-game">
        <div class="card-image-container">
            <img :src="imgPath" :alt="cardTitle" class="card-image">
            <div v-if="comingSoon" class="coming-soon-badge">Bientôt disponible</div>
        </div>

        <div class="card-content">
            <h3 class="card-title t-title">{{ cardTitle }}</h3>
            <p class="card-description t-body-text">{{ cardContent }}</p>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/settings/settings.scss';

.card-game {
    width: 100%;
    max-width: 350px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 20px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    }
}

.card-image-container {
    position: relative;
}

.card-image {
    width: 200px;
    height: auto;
    border-radius: 12px;
    transition: transform 0.3s ease;

    .card-game:hover & {
        transform: scale(1.05);
    }
}

.coming-soon-badge {
    position: absolute;
    top: 10px;
    right: -30px;
    background: $major-yellow-color;
    color: #1a1a2e;
    padding: 5px 30px;
    font-size: 0.8rem;
    font-weight: 600;
    transform: rotate(45deg);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    text-align: center;
}

.card-title {
    color: white;
    font-size: 1.5rem;
    margin: 0;
}

.card-description {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1rem;
    margin: 0;
    line-height: 1.5;
}

@media (max-width: 768px) {
    .card-game {
        padding: 30px;
        gap: 25px;
    }

    .card-image {
        width: 180px;
    }

    .card-title {
        font-size: 1.3rem;
    }
}

@media (max-width: 480px) {
    .card-game {
        padding: 25px;
    }

    .card-image {
        width: 160px;
    }
}
</style>