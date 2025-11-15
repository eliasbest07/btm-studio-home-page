"use client";

import { useEffect, useRef, useState } from "react";

interface Shape {
  type: "circle" | "star" | "triangle" | "hexagon" | "square" | "pentagon" | "heart";
  x: number;
  y: number;
  size: number;
  color: string;
}

interface CaptchaChallenge {
  targetNumber: number;
  targetShape: Shape["type"];
}

const SHAPE_NAMES = {
  circle: { en: "circle", es: "círculo" },
  star: { en: "star", es: "estrella" },
  triangle: { en: "triangle", es: "triángulo" },
  hexagon: { en: "hexagon", es: "hexágono" },
  square: { en: "square", es: "cuadrado" },
  pentagon: { en: "pentagon", es: "pentágono" },
  heart: { en: "heart", es: "corazón" },
};

const COLORS = [
  "rgba(255, 100, 100, 0.3)",
  "rgba(100, 150, 255, 0.3)",
  "rgba(100, 255, 150, 0.3)",
  "rgba(255, 200, 100, 0.3)",
  "rgba(200, 100, 255, 0.3)",
  "rgba(255, 150, 200, 0.3)",
];

const GRID_SIZE = 25; // 25x25 grid
const CELL_SIZE = 50; // Size of each cell

interface ShapeCaptchaProps {
  onSuccess: () => void;
  locale?: string;
}

export default function ShapeCaptcha({ onSuccess, locale = "es" }: ShapeCaptchaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [challenge, setChallenge] = useState<CaptchaChallenge | null>(null);
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [numberGrid, setNumberGrid] = useState<number[][]>([]);
  const [isSolved, setIsSolved] = useState(false);

  // Function to generate/regenerate CAPTCHA
  const generateCaptcha = () => {
    const shapeTypes: Shape["type"][] = ["circle", "star", "triangle", "hexagon", "square", "pentagon", "heart"];
    const newShapes: Shape[] = [];

    // Generate shapes in canvas space (fixed positions, 450x300 canvas)
    const canvasWidth = 450;
    const canvasHeight = 300;

    for (let i = 0; i < 8 + Math.floor(Math.random() * 4); i++) {
      newShapes.push({
        type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
        x: 80 + Math.random() * (canvasWidth - 160),
        y: 60 + Math.random() * (canvasHeight - 120),
        size: 50 + Math.random() * 40,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }

    setShapes(newShapes);

    // Generate 25x25 grid of random numbers 0-9
    const grid: number[][] = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      const rowNumbers: number[] = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        rowNumbers.push(Math.floor(Math.random() * 10));
      }
      grid.push(rowNumbers);
    }
    setNumberGrid(grid);

    // Generate challenge
    const targetShape = newShapes[Math.floor(Math.random() * newShapes.length)];
    const targetNumber = Math.floor(Math.random() * 10);

    setChallenge({
      targetNumber,
      targetShape: targetShape.type,
    });

    // Start with numbers offset
    setCameraOffset({ x: -100, y: -100 });

    // Reset solved state
    setIsSolved(false);
  };

  // Generate initial CAPTCHA on mount
  useEffect(() => {
    generateCaptcha();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background shapes FIRST (fixed, no transformation)
    shapes.forEach((shape) => {
      drawShape(ctx, shape);
    });

    // Save context state
    ctx.save();

    // Apply camera transformation for numbers only
    ctx.translate(cameraOffset.x, cameraOffset.y);

    // Draw number grid (moveable)
    drawNumberGrid(ctx);

    // Restore context state
    ctx.restore();
  }, [shapes, cameraOffset, numberGrid]);

  const drawShape = (ctx: CanvasRenderingContext2D, shape: Shape) => {
    ctx.fillStyle = shape.color;
    ctx.strokeStyle = shape.color.replace("0.3", "0.8");
    ctx.lineWidth = 2;

    ctx.beginPath();

    switch (shape.type) {
      case "circle":
        ctx.arc(shape.x, shape.y, shape.size, 0, Math.PI * 2);
        break;
      case "star":
        drawStar(ctx, shape.x, shape.y, 5, shape.size, shape.size / 2);
        break;
      case "triangle":
        ctx.moveTo(shape.x, shape.y - shape.size);
        ctx.lineTo(shape.x - shape.size, shape.y + shape.size);
        ctx.lineTo(shape.x + shape.size, shape.y + shape.size);
        ctx.closePath();
        break;
      case "hexagon":
        drawPolygon(ctx, shape.x, shape.y, 6, shape.size);
        break;
      case "square":
        ctx.rect(shape.x - shape.size, shape.y - shape.size, shape.size * 2, shape.size * 2);
        break;
      case "pentagon":
        drawPolygon(ctx, shape.x, shape.y, 5, shape.size);
        break;
      case "heart":
        drawHeart(ctx, shape.x, shape.y, shape.size);
        break;
    }

    ctx.fill();
    ctx.stroke();
  };

  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
  };

  const drawPolygon = (ctx: CanvasRenderingContext2D, cx: number, cy: number, sides: number, size: number) => {
    const angle = (Math.PI * 2) / sides;
    ctx.moveTo(cx + size * Math.cos(0), cy + size * Math.sin(0));
    for (let i = 1; i <= sides; i++) {
      ctx.lineTo(cx + size * Math.cos(angle * i), cy + size * Math.sin(angle * i));
    }
    ctx.closePath();
  };

  const drawHeart = (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) => {
    const topCurveHeight = size * 0.3;
    ctx.moveTo(cx, cy + topCurveHeight);
    // Top left curve
    ctx.bezierCurveTo(
      cx, cy,
      cx - size / 2, cy,
      cx - size / 2, cy + topCurveHeight
    );
    // Bottom left curve
    ctx.bezierCurveTo(
      cx - size / 2, cy + (size + topCurveHeight) / 2,
      cx, cy + (size + topCurveHeight) / 1.2,
      cx, cy + size
    );
    // Bottom right curve
    ctx.bezierCurveTo(
      cx, cy + (size + topCurveHeight) / 1.2,
      cx + size / 2, cy + (size + topCurveHeight) / 2,
      cx + size / 2, cy + topCurveHeight
    );
    // Top right curve
    ctx.bezierCurveTo(
      cx + size / 2, cy,
      cx, cy,
      cx, cy + topCurveHeight
    );
    ctx.closePath();
  };

  const drawNumberGrid = (ctx: CanvasRenderingContext2D) => {
    // Draw all numbers in the 25x25 grid
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#FFFFFF";

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const x = col * CELL_SIZE + CELL_SIZE / 2;
        const y = row * CELL_SIZE + CELL_SIZE / 2;
        const number = numberGrid[row]?.[col];

        if (number !== undefined) {
          ctx.fillText(number.toString(), x, y);
        }
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDragging(true);
    setDragStart({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dx = x - dragStart.x;
    const dy = y - dragStart.y;

    setCameraOffset((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));

    setDragStart({ x, y });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Check if captcha is solved after dragging
    checkSolution();
  };

  const checkSolution = () => {
    if (!challenge || isSolved) return;

    // Find the target shape (in canvas space)
    const targetShape = shapes.find((s) => s.type === challenge.targetShape);
    if (!targetShape) return;

    // Check all numbers in the grid to see if any target number is inside the target shape
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const number = numberGrid[row]?.[col];

        if (number === challenge.targetNumber) {
          // Calculate world position of this number
          const worldX = col * CELL_SIZE + CELL_SIZE / 2;
          const worldY = row * CELL_SIZE + CELL_SIZE / 2;

          // Transform to canvas space (apply camera offset)
          const canvasX = worldX + cameraOffset.x;
          const canvasY = worldY + cameraOffset.y;

          // Check if this number is inside the target shape
          if (isPointInShape(canvasX, canvasY, targetShape)) {
            setIsSolved(true);
            onSuccess();
            return;
          }
        }
      }
    }
  };

  const isPointInShape = (x: number, y: number, shape: Shape): boolean => {
    const dx = x - shape.x;
    const dy = y - shape.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Simplified collision detection - check if point is within shape's radius
    return distance <= shape.size;
  };

  const resetCaptcha = () => {
    // Regenerate CAPTCHA without reloading the page
    generateCaptcha();
  };

  if (!challenge) return null;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-white text-lg font-semibold mb-2">
          {locale === "es" ? "Verificación de seguridad:" : "Security verification:"}
        </p>
        <p className="text-white/80">
          {locale === "es"
            ? `Arrastra para mover los números y coloca un ${challenge.targetNumber} en el centro dentro de un ${SHAPE_NAMES[challenge.targetShape][locale]}`
            : `Drag to move the numbers and place a ${challenge.targetNumber} inside the ${SHAPE_NAMES[challenge.targetShape][locale]}`
          }
        </p>
      </div>

      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={450}
          height={300}
          className="border-2 border-white/30 rounded-lg cursor-move bg-gray-800/50"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      <div className="flex justify-center gap-4 items-center">
        {isSolved && (
          <p className="text-green-400 font-semibold">
            {locale === "es" ? "✓ ¡Verificación exitosa!" : "✓ Verification successful!"}
          </p>
        )}
        <button
          onClick={resetCaptcha}
          className="text-white/60 hover:text-white text-sm underline"
        >
          {locale === "es" ? "Generar nuevo desafío" : "Generate new challenge"}
        </button>
      </div>
    </div>
  );
}
