import * as Utils from "./Utils.js";
export class ShaderProgram {
    async CreateShader(gl, shaderPath) {
        this.gl = gl;
        let shaderSource = await Utils.GetFileContents(shaderPath);
        let currentLine = "";
        for (let i = 0; i < shaderSource.length; i++) {
            let ch = shaderSource[i];
            if (ch === '\r')
                continue;
            if (ch === '\n') {
                this.ParseShaderLine(currentLine);
                currentLine = "";
                continue;
            }
            currentLine += ch;
        }
        this.ParseShaderLine(currentLine);
        this.AppendPreviousShader();
        this.LinkToShaderObject();
    }
    Bind() {
        this.gl.useProgram(this.shaderProgram);
    }
    ParseShaderLine(currentLine) {
        let isShaderDirective = currentLine.startsWith(ShaderProgram.shaderDirective);
        if (!isShaderDirective) {
            this.currentShaderSource += '\n' + currentLine;
            return;
        }
        this.AppendPreviousShader();
        let directiveEndIndex = ShaderProgram.shaderDirective.length;
        let directiveValue = "";
        for (let i = directiveEndIndex; i < currentLine.length; i++) {
            let ch = currentLine[i];
            if (ch === ' ')
                continue;
            directiveValue += ch;
        }
        switch (directiveValue) {
            case "fragment":
                this.currentShaderType = this.gl.FRAGMENT_SHADER;
                break;
            case "vertex":
                this.currentShaderType = this.gl.VERTEX_SHADER;
                break;
            default:
                console.error(`Encountered invalid shader type '${directiveValue}'!`);
                break;
        }
        this.currentShaderSource = "";
    }
    AppendPreviousShader() {
        if (this.currentShaderSource.length == 0)
            return;
        let fullSource = this.currentShaderSource;
        fullSource = ShaderProgram.shaderVersion + fullSource;
        this.shaderSources.set(this.currentShaderType, fullSource);
        this.currentShaderSource = "";
    }
    LinkToShaderObject() {
        this.shaderProgram = this.gl.createProgram();
        for (const [shaderType, shaderSource] of this.shaderSources) {
            let currentShader = this.CompileShader(shaderType, shaderSource);
            this.gl.attachShader(this.shaderProgram, currentShader);
        }
        this.gl.linkProgram(this.shaderProgram);
        this.gl.validateProgram(this.shaderProgram);
        for (let shaderObject of this.shaderObjectList) {
            this.gl.deleteShader(shaderObject);
        }
    }
    CompileShader(shaderType, shaderSource) {
        let currentShader = this.gl.createShader(shaderType);
        this.gl.shaderSource(currentShader, shaderSource);
        this.gl.compileShader(currentShader);
        let hasSucessfullyCompiled = this.gl.getShaderParameter(currentShader, this.gl.COMPILE_STATUS);
        if (hasSucessfullyCompiled)
            return currentShader;
        let errorMessage = this.gl.getShaderInfoLog(currentShader);
        let shaderTypeStr = "Unknown";
        switch (shaderType) {
            case this.gl.VERTEX_SHADER:
                shaderTypeStr = "Vertex";
                break;
            case this.gl.FRAGMENT_SHADER:
                shaderTypeStr = "Fragment";
                break;
        }
        console.error(`Shader compilation failure at shader type '${shaderTypeStr}' with message:\n\t${errorMessage}\nShader source is:\n\n ${shaderSource}`);
        return currentShader;
    }
    shaderProgram;
    gl;
    static shaderVersion = "#version 300 es";
    static shaderDirective = "#shader";
    shaderSources = new Map();
    shaderObjectList = [];
    currentShaderType = 0;
    currentShaderSource = "";
}
