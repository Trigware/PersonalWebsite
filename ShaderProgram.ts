import * as Utils from "./Utils.js";

export class ShaderProgram {
    public async CreateShader(gl: WebGL2RenderingContext, shaderPath: string) {
        this.gl = gl;
        let shaderSource: string = await Utils.GetFileContents(shaderPath);
        let currentLine: string = "";

        for (let i: number = 0; i < shaderSource.length; i++) {
            let ch = shaderSource[i];
            if (ch === '\r') continue;
            if (ch === '\n') { this.ParseShaderLine(currentLine); currentLine = ""; continue; }
            currentLine += ch;
        }

        this.ParseShaderLine(currentLine);
        this.AppendPreviousShader();
        this.LinkToShaderObject();
    }

    public Bind() {
        this.gl.useProgram(this.shaderProgram);
    }

    private ParseShaderLine(currentLine: string) {
        let isShaderDirective = currentLine.startsWith(ShaderProgram.shaderDirective);
        if (!isShaderDirective) { this.currentShaderSource += '\n' + currentLine; return; }
        this.AppendPreviousShader();

        let directiveEndIndex: number = ShaderProgram.shaderDirective.length;
        let directiveValue: string = ""
        for (let i: number = directiveEndIndex; i < currentLine.length; i++) {
            let ch = currentLine[i];
            if (ch === ' ') continue;
            directiveValue += ch;
        }

        switch (directiveValue) {
            case "fragment": this.currentShaderType = this.gl.FRAGMENT_SHADER; break;
            case "vertex": this.currentShaderType = this.gl.VERTEX_SHADER; break;
            default: console.error(`Encountered invalid shader type '${directiveValue}'!`); break;
        }

        this.currentShaderSource = "";
    }

    private AppendPreviousShader() {
        if (this.currentShaderSource.length == 0) return;

        let fullSource: string = this.currentShaderSource;
        fullSource = ShaderProgram.shaderVersion + fullSource;
        this.shaderSources.set(this.currentShaderType, fullSource);
        this.currentShaderSource = "";
    }

    private LinkToShaderObject() {
        this.shaderProgram = this.gl.createProgram();
        for (const [shaderType, shaderSource] of this.shaderSources) {
            let currentShader: WebGLShader = this.CompileShader(shaderType as number, shaderSource);
            this.gl.attachShader(this.shaderProgram, currentShader);
        }

        this.gl.linkProgram(this.shaderProgram);
        this.gl.validateProgram(this.shaderProgram);
        for (let shaderObject of this.shaderObjectList) {
            this.gl.deleteShader(shaderObject);
        }
    }

    private CompileShader(shaderType: number, shaderSource: string): WebGLShader {
        let currentShader: WebGLShader = this.gl.createShader(shaderType)!;
        this.gl.shaderSource(currentShader, shaderSource);
        this.gl.compileShader(currentShader);

        let hasSucessfullyCompiled = this.gl.getShaderParameter(currentShader, this.gl.COMPILE_STATUS);
        if (hasSucessfullyCompiled) return currentShader;

        let errorMessage = this.gl.getShaderInfoLog(currentShader);
        let shaderTypeStr = "Unknown";
        switch (shaderType) {
            case this.gl.VERTEX_SHADER: shaderTypeStr = "Vertex"; break;
            case this.gl.FRAGMENT_SHADER: shaderTypeStr = "Fragment"; break;
        }
        console.error(`Shader compilation failure at shader type '${shaderTypeStr}' with message:\n\t${errorMessage}\nShader source is:\n\n ${shaderSource}`);
        return currentShader;
    }

    public shaderProgram !: WebGLProgram;
    public gl !: WebGL2RenderingContext;

    private static readonly shaderVersion: string = "#version 300 es";
    private static readonly shaderDirective: string = "#shader";

    private shaderSources = new Map<Number, string>();
    private shaderObjectList: WebGLShader[] = [];
    private currentShaderType: Number = 0;
    private currentShaderSource: string = "";
}