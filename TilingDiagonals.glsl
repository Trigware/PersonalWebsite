#shader vertex

layout(location = 0) in vec2 position;
layout(location = 1) in vec2 uv;

out vec2 UV;

void main() {
	gl_Position = vec4(position, 0.0, 1.0);
	UV = uv;
}

#shader fragment

precision mediump float;
in vec2 UV;
layout(location = 0) out vec4 COLOR;

void main() {
    COLOR = vec4(UV.x, UV.y, 0.0, 1.0);
}