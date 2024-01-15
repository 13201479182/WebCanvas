<template>
    <div ref="polygonRef" class="polygon">
        <canvas ref="canvasRef" v-bind="attr"></canvas>
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue';
import { mat4 } from 'gl-matrix';

const polygonRef = ref<HTMLDivElement>();
const canvasRef = ref<HTMLCanvasElement>();
const attr = reactive({
    width: 0,
    height: 0,
});

onMounted(() => {
    const containter = polygonRef.value;
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
            gl_Position = a_position;
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

function generateFivePointStartVertex() {
    const points: any = [];
    const r1 = Math.min(attr.width, attr.height) / Math.max(attr.width, attr.height);
    const r2 = r1 / 2;
    console.log(r1, r2);

    const { PI, sin, cos } = Math;
    const anveragePI = PI / 5;
    for (let i = 0, l = 10; i < l; i += 2) {
        const angle1 = i * anveragePI - PI / 2;
        const angle2 = (i + 1) * anveragePI - PI / 2;

        const x1 = r1 * cos(angle1);
        const y1 = -r1 * sin(angle1);
        const x2 = r2 * cos(angle2);
        const y2 = -r2 * sin(angle2);
        points.push(x1, y1, 0, 1, x2, y2, 0, 1);
    }

    return new Float32Array(points);
}
generateFivePointStartVertex();

function initBuffer(webgl: WebGLRenderingContext, program: WebGLProgram) {
    const aPosition = webgl.getAttribLocation(program, 'a_position');
    const proj = webgl.getUniformLocation(program, 'proj');

    const points = generateFivePointStartVertex();

    const buffer = webgl.createBuffer();
    webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
    webgl.bufferData(webgl.ARRAY_BUFFER, points, webgl.STATIC_DRAW);
    webgl.enableVertexAttribArray(aPosition);

    // 更新顶点, 告诉gpu从什么地方读取顶点
    webgl.vertexAttrib4fv(aPosition, points);
    webgl.vertexAttribPointer(aPosition, 4, webgl.FLOAT, false, 4 * 4, 0 * 4);

    // 生成投影矩阵,且更新全局变量proj
    const matPro = mat4.ortho([] as any, 0, attr.width, attr.height, 0, -1, 1);
    webgl.uniformMatrix4fv(proj, false, matPro);
}

function draw(webgl: WebGLRenderingContext) {
    webgl.clearColor(1.0, 1.0, 1.0, 1.0);
    webgl.clear(webgl.COLOR_BUFFER_BIT);

    // 绘制线段(成对的点)
    webgl.drawArrays(webgl.LINE_LOOP, 0, 10);
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
.polygon {
    width: 100%;
    height: 100%;
}
</style>
