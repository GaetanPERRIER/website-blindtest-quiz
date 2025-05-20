<script setup>

const playerStore = usePlayerStore();
const bgGradient = computed(() => playerStore.bgGradient);

onMounted(() => {
    const gradientElement = document.querySelector(".invite-button");
    if (gradientElement) {
        gradientElement.style.background = bgGradient.value;

        gradientElement.style.backgroundSize = "400%";
        gradientElement.style.backgroundPosition = "center";
    }
});

</script>

<template>
    <div class="invite-button u-flex u-justify-content-center u-align-items-center u-gap10">
        <p class="invite-button-text">Inviter des amis</p>
        <img class="invite-button-icon" src="/icons/copy%201.png" alt="Invite">
    </div>
</template>

<style scoped lang="scss">

.invite-button {
    padding: 15px 20px;
    border-radius: 15px;
    cursor: pointer;
    transition: all 250ms ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);


    &:hover {
        background-color: #ffe339;
        transform: translate(0, -2px);
    }

    p {
        font-size: 14px;
        color: #fff;
    }
}

</style>