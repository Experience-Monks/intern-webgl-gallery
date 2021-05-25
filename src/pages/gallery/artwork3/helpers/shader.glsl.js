export const vertexShader = `
void main() { 
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragmentShader = ` 
uniform vec3 u_color;

void main(){ 
    gl_FragColor = vec4(u_color, 1.0);
}
`;
