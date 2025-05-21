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
    <div class="invite-button u-flex u-justify-content-center u-align-items-center">
        <p class="invite-button-text">Inviter des amis</p>
        <img class="invite-button-icon" src="/icons/copy%201.png" alt="Invite">
    </div>
</template>

<style scoped lang="scss">

.invite-button {
    padding: 1.388888888888889vh 1.041666666666667vw;
    border-radius: 0.78125vw;
    cursor: pointer;
    gap: 0.5208333333333333vw;
    transition: transform 250ms ease;
    box-shadow: 0 0.2083333333333333vw 0.4166666666666667vw rgba(0, 0, 0, 0.2);

    &:hover {
        background-color: #ffe339;
        transform: translate(0, -2px);
    }

    p {
        font-size: 0.7291666666666667vw;
        color: #fff;
    }

    .invite-button-icon {
        width: 1.041666666666667vw;
    }
}

</style>