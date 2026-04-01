import { useEffect, useMemo, useRef, useState } from 'react';

const vertexShaderSource = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader) || 'Unknown shader compile error';
    gl.deleteShader(shader);
    throw new Error(info);
  }

  return shader;
}

function createProgram(gl, fragmentShaderSource) {
  const fragmentSource = `
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform vec4 iMouse;
uniform float iFrame;

${fragmentShaderSource}

void main() {
  vec4 color = vec4(0.0);
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}
`;

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program) || 'Unknown shader link error';
    gl.deleteProgram(program);
    throw new Error(info);
  }

  return program;
}

export default function ShaderBackground({
  fragmentShader,
  className = '',
  opacity = 0.55,
  mixBlendMode = 'screen',
  pixelScale = 0.5,
}) {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const observerRef = useRef(null);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, downX: 0, downY: 0, pressed: 0 });
  const [isVisible, setIsVisible] = useState(true);

  const shaderSource = useMemo(() => fragmentShader, [fragmentShader]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !shaderSource) {
      return undefined;
    }

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
      premultipliedAlpha: false,
      stencil: false,
    });

    if (!gl) {
      return undefined;
    }

    let program;
    try {
      program = createProgram(gl, shaderSource);
    } catch (error) {
      console.error('ShaderBackground error:', error);
      return undefined;
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, 'iResolution');
    const timeLocation = gl.getUniformLocation(program, 'iTime');
    const mouseLocation = gl.getUniformLocation(program, 'iMouse');
    const frameLocation = gl.getUniformLocation(program, 'iFrame');

    const resize = () => {
      const width = Math.max(1, Math.floor(canvas.clientWidth * pixelScale));
      const height = Math.max(1, Math.floor(canvas.clientHeight * pixelScale));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      gl.viewport(0, 0, width, height);
      gl.uniform3f(resolutionLocation, width, height, 1);
    };

    const start = performance.now();

    const render = (now) => {
      if (!isVisible) {
        return;
      }

      resize();
      frameRef.current += 1;

      const time = (now - start) / 1000;
      const mouse = mouseRef.current;

      gl.uniform1f(timeLocation, time);
      gl.uniform4f(mouseLocation, mouse.x, mouse.y, mouse.downX, mouse.downY);
      gl.uniform1f(frameLocation, frameRef.current);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationRef.current = window.requestAnimationFrame(render);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    if (isVisible) {
      animationRef.current = window.requestAnimationFrame(render);
    }

    return () => {
      resizeObserver.disconnect();
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [isVisible, pixelScale, shaderSource]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 },
    );

    observerRef.current.observe(canvas);

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible && animationRef.current) {
      window.cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, [isVisible]);

  const updateMouse = (event, pressed) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * pixelScale;
    const y = (rect.height - (event.clientY - rect.top)) * pixelScale;

    mouseRef.current.x = x;
    mouseRef.current.y = y;
    mouseRef.current.pressed = pressed ? 1 : 0;

    if (pressed) {
      mouseRef.current.downX = x;
      mouseRef.current.downY = y;
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full ${className}`.trim()}
      style={{ mixBlendMode, opacity }}
      onPointerDown={(event) => updateMouse(event, true)}
      onPointerMove={(event) => updateMouse(event, mouseRef.current.pressed > 0)}
      onPointerUp={(event) => updateMouse(event, false)}
      onPointerLeave={() => {
        mouseRef.current.pressed = 0;
      }}
      aria-hidden="true"
    />
  );
}
