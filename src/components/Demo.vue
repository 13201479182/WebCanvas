<template>
    <div ref="pointRef" class="point">
        <canvas v-bind="attr"></canvas>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

const pointRef = ref<HTMLDivElement>();
const attr = reactive({
    width: 0,
    height: 0,
});

onMounted(() => {
    const containter = pointRef.value;
    if (containter) {
        const { width, height } = containter.getBoundingClientRect();
        attr.width = width;
        attr.height = height - 3;
        init();
    }
});

function init() {}
</script>

<style lang="less" scoped>
.point {
    width: 100%;
    height: 100%;
}
</style>
