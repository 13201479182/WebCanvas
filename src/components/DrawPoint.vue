<template>
    <div class="point" ref="pointRef">
        <canvas ref="canvasRef" v-bind="attr"></canvas>
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue';
import { mat4 } from 'gl-matrix';

const pointRef = ref<HTMLDivElement>();
const canvasRef = ref<HTMLCanvasElement>();
const attr = reactive({
    width: 0,
    height: 0,
});

const points: number[] = [0, 0, 0, 0];
onMounted(() => {
    if (pointRef.value) {
        const { width, height } = pointRef.value.getBoundingClientRect();
        attr.width = width;
        attr.height = height - 3;
        nextTick(init);
    }
});

function init() {
    // 获取3d上下文
    const webgl = canvasRef.value?.getContext('webgl');
    if (webgl) {
        // 1. 初始化WebGL
        const orthoMat4 = initWebGL(webgl);
        // 2. 创建shader
        const shaders: (WebGLShader | null)[] = initShader(webgl);
        // 3. 创建程序
        const program = initProgram(webgl, shaders);
        // 3. 将数据应用于program
        initBuffer(webgl, program, orthoMat4);
        // 4. 绘制
        draw(webgl);
        // 实时绘制
        canvasRef.value?.addEventListener('click', ({ x, y, target }) => {
            /**
             * webgl坐标系
             * canvas坐上角, webgl中心, 且需要归并到 -1 ~ 1
             * 坐标: x, y, z, w
             */
            const { top, left } = (target as HTMLCanvasElement).getBoundingClientRect();
            const halfCw = attr.width / 2;
            const halfCh = attr.height / 2;
            points.push((x - left - halfCw) / halfCw, -(y - top - halfCh) / halfCh, 1.0, 1.0);

            initBuffer(webgl, program, orthoMat4);
            draw(webgl);
        });
    }
}

function initWebGL(webgl: WebGLRenderingContext) {
    // 1. 初始化webGL视口 左下角坐标以及宽高
    webgl.viewport(0, 0, attr.width, attr.height);
    // 2. 生成给定边界的四纬投影矩阵
    return mat4.ortho([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 0, attr.width, attr.height, 0, -1, 1);
}

function initShader(webgl: WebGLRenderingContext) {
    // 1. 定义顶点着色器
    const vertexString = `
        attribute vec4 a_position;
        uniform mat4 proj;
        void main() {
            gl_Position = a_position;
            gl_PointSize = 100.0;
        }
    `;
    // 2. 定义片源着色器
    const fragmentString = `
        void main() {
            gl_FragColor = vec4(0, 0, 1.0, 1.0);
        }
    `;

    // 3. 创建shader
    const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
    const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
    if (vertexShader && fragmentShader) {
        // 4. 装载shader
        webgl.shaderSource(vertexShader, vertexString);
        webgl.shaderSource(fragmentShader, fragmentString);
        // 5. 编译shader
        webgl.compileShader(vertexShader);
        webgl.compileShader(fragmentShader);
    }

    return [vertexShader, fragmentShader];
}

function initProgram(webgl: WebGLRenderingContext, shaders: (WebGLShader | null)[]) {
    // 1. 创建项目
    const program = webgl.createProgram();
    if (program && shaders.length) {
        for (let shader of shaders) {
            if (shader) {
                // 2. 绑定shader
                webgl.attachShader(program, shader);
            }
        }
        // 3. 链接项目
        webgl.linkProgram(program);
        // 4. 应用项目
        webgl.useProgram(program);
    }
    return program;
}

function initBuffer(webgl: WebGLRenderingContext, program: WebGLProgram | null, orthoMat4: mat4) {
    if (program) {
        const a_position = webgl.getAttribLocation(program, 'a_position');
        const proj = webgl.getUniformLocation(program, 'proj');

        // 1. 创建、绑定、填充缓冲区
        const pointsPos = new Float32Array(points);
        const buffer = webgl.createBuffer();
        webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
        webgl.bufferData(webgl.ARRAY_BUFFER, pointsPos, webgl.STATIC_DRAW);
        webgl.enableVertexAttribArray(a_position);
        // 顶点属性的索引/顶点属性的组件数量/组件的数据类型/是否应标准化/连续顶点属性开头之间的偏移量/第一个组件的偏移量
        webgl.vertexAttribPointer(a_position, 4, webgl.FLOAT, false, 4 * 4, 4 * 0);

        // 2. 更新a_position
        webgl.vertexAttrib4fv(a_position, pointsPos);
        // 3. 更新proj
        webgl.uniformMatrix4fv(proj, false, orthoMat4);
    }
}

function draw(webgl: WebGLRenderingContext) {
    // 1. 清空画布(r, g, b, a)
    webgl.clearColor(0.5, 0.3, 0.5, 0.1);
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    // 2. 绘制点
    webgl.drawArrays(webgl.POINTS, 0, points.length);
}
</script>

<style lang="less" scoped>
.point {
    width: 100%;
    height: 100%;
}
</style>
