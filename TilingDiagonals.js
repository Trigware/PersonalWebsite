const canvas = document.getElementById("TilingDiagonals");
const gl = canvas.getContext("webgl2");
const rectVertices = new Float32Array([
    -1.0, 1.0, 0.0, 0.0,
    1.0, 1.0, 1.0, 0.0,
    -1.0, -1.0, 0.0, 1.0,
    1.0, -1.0, 1.0, 1.0
]);
const rectIndices = new Uint16Array([
    0, 1, 2,
    1, 2, 3
]);
import { ShaderProgram } from "./ShaderProgram.js";
async function SetupCanvas() {
    SetupBuffers();
    await shaderProgram.CreateShader(gl, "TilingDiagonals.glsl");
    OnDraw();
}
const vertexAttributeSize = 2;
const vertexFloatCount = 4;
let vertexArray;
let shaderProgram = new ShaderProgram();
function SetupBuffers() {
    vertexArray = gl.createVertexArray();
    gl.bindVertexArray(vertexArray);
    CreateBuffer(gl.ARRAY_BUFFER, rectVertices);
    CreateBuffer(gl.ELEMENT_ARRAY_BUFFER, rectIndices);
    const stride = vertexFloatCount * Float32Array.BYTES_PER_ELEMENT;
    for (let i = 0; i <= 1; i++) {
        let byteOffset = vertexAttributeSize * Float32Array.BYTES_PER_ELEMENT * i;
        gl.enableVertexAttribArray(i);
        gl.vertexAttribPointer(i, vertexAttributeSize, gl.FLOAT, false, stride, byteOffset);
    }
}
function CreateBuffer(bufferType, bufferSource) {
    let createdBuffer = gl.createBuffer();
    gl.bindBuffer(bufferType, createdBuffer);
    gl.bufferData(bufferType, bufferSource, gl.STATIC_DRAW);
}
function OnDraw() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    shaderProgram.Bind();
    gl.bindVertexArray(vertexArray);
    gl.drawElements(gl.TRIANGLES, rectIndices.length, gl.UNSIGNED_SHORT, 0);
    requestAnimationFrame(OnDraw);
}
SetupCanvas();
