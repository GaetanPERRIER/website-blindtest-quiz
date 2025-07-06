<script setup>
defineProps({
    cardInfoData: Object
})
</script>

<template>
    <div class="card-info">
        <div class="card-header">
            <img :src="cardInfoData.cardInfoIconPath" :alt="cardInfoData.cardInfoTitle" class="card-icon">
            <h3 class="card-title">{{ cardInfoData.cardInfoTitle }}</h3>
        </div>

        <p class="card-content">{{ cardInfoData.cardInfoContent }}</p>

        <button class="card-button t-body-text">
            {{ cardInfoData.cardInfoButtonLabel }}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/settings/settings.scss';

.card-info {
    width: 100%;
    max-width: 400px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 20px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 25px;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    }
}

.card-header {
    display: flex;
    align-items: center;
    gap: 15px;
}

.card-icon {
    width: 45px;
    height: 45px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.card-title {
    color: white;
    font-size: 1.5rem;
    margin: 0;
}

.card-content {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.1rem;
    line-height: 1.6;
    text-align: center;
    margin: 0;
}

.card-button {
    display: flex;
    align-items: center;
    gap: 10px;
    background: linear-gradient(135deg, #FF6E6E 0%, #FFDF6B 100%);
    color: #1a1a2e;
    padding: 12px 30px;
    border-radius: 50px;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 110, 110, 0.4);

    &:hover {
        transform: translateY(-2px) scale(1.05);
        box-shadow: 0 6px 20px rgba(255, 110, 110, 0.6);
    }
}

@media (max-width: 500px) {
    .card-info {
        padding: 30px;
    }

    .card-icon {
        width: 40px;
        height: 40px;
    }

    .card-title {
        font-size: 1.3rem;
    }

    .card-content {
        font-size: 1rem;
    }
}
</style>