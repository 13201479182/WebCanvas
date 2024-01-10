<template>
    <div ref="lineRef" class="line">
        <canvas ref="canvasRef" v-bind="attr"></canvas>
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue';
import { mat4 } from 'gl-matrix';

const lineRef = ref<HTMLDivElement>();
const canvasRef = ref<HTMLCanvasElement>();
const attr = reactive({
    width: 0,
    height: 0,
});

onMounted(() => {
    const containter = lineRef.value;
    if (containter) {
        const { width, height } = containter.getBoundingClientRect();
        attr.width = width;
        attr.height = height - 3;
        nextTick(init);
    }
});

function initWebGL(webgl: WebGLRenderingContext) {
    // 生成视窗(平面)
    webgl.viewport(0, 0, attr.width, attr.height);
}

function initShader(webgl: WebGLRenderingContext) {
    const vertexString = `
        attribute vec4 a_position;
        uniform mat4 proj;
        void main() {
            gl_Position = proj * a_position;
            gl_PointSize = 100.0;
        }
    `;
    const fragmentString = `
        void main() {
            gl_FragColor = vec4(0, 0, 1.0, 1.0);
        }
    `;

    const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
    const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);

    if (vertexShader && fragmentShader) {
        webgl.shaderSource(vertexShader, vertexString);
        webgl.shaderSource(fragmentShader, fragmentString);

        webgl.compileShader(vertexShader);
        webgl.compileShader(fragmentShader);
    }

    return [vertexShader, fragmentShader] as WebGLShader[];
}

function initProgram(webgl: WebGLRenderingContext, shaders: WebGLShader[]) {
    const program = webgl.createProgram();

    if (program) {
        for (let shader of shaders) {
            webgl.attachShader(program, shader);
        }
        webgl.linkProgram(program);
        webgl.useProgram(program);
    }
    return program as WebGLProgram;
}

function initBuffer(webgl: WebGLRenderingContext, program: WebGLProgram) {
    const aPosition = webgl.getAttribLocation(program, 'a_position');
    const proj = webgl.getUniformLocation(program, 'proj');

    const points = new Float32Array([100.0, 100.0, 0, 1.0, 200.0, 200.0, 0, 1.0, 300.0, 300.0, 0, 1.0, 400.0, 400.0, 0, 1.0, 200.0, 400.0, 0, 1.0]);

    const buffer = webgl.createBuffer();
    webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
    webgl.bufferData(webgl.ARRAY_BUFFER, points, webgl.STATIC_DRAW);
    webgl.enableVertexAttribArray(aPosition);

    // 更新顶点, 告诉gpu从什么地方读取顶点
    webgl.vertexAttrib4fv(aPosition, points);
    webgl.vertexAttribPointer(aPosition, 4, webgl.FLOAT, false, 4 * 4, 0 * 4);

    // 生成投影矩阵,且更新全局变量proj
    const matPro = mat4.ortho([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 0, attr.width, attr.height, 0, -1, 1);
    webgl.uniformMatrix4fv(proj, false, matPro);
}

function draw(webgl: WebGLRenderingContext) {
    webgl.clearColor(1.0, 1.0, 1.0, 1.0);
    webgl.clear(webgl.COLOR_BUFFER_BIT);

    // 绘制线段
    // webgl.drawArrays(webgl.LINES, 0, 5);
    // 绘制线条
    webgl.drawArrays(webgl.LINE_STRIP, 0, 5);
    // 绘制线圈
    // webgl.drawArrays(webgl.LINE_LOOP, 0, 5);
}

function init() {
    const webgl = canvasRef.value?.getContext('webgl');
    if (webgl) {
        // 1.初始化webgl
        initWebGL(webgl);
        // 2.初始化shader
        const shaders = initShader(webgl);
        // 3.初始化项目
        const program = initProgram(webgl, shaders);
        // 4.生成数据
        initBuffer(webgl, program);
        // 5.绘制
        draw(webgl);
    }
}
</script>

<style lang="less" scoped>
.line {
    width: 100%;
    height: 100%;
}
</style>
