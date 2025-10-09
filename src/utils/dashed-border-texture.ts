import { CanvasTexture } from "three";

export function createDashedBorderTexture(width = 256, height = 256, ratio: "2:3" | "3:2" | "1:1" = "2:3") {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Clear canvas with transparent background
  ctx.clearRect(0, 0, width, height);

  // Create a mostly transparent background with slight tint
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  ctx.fillRect(0, 0, width, height);

  // Set up dashed border style for the outer edge
  ctx.strokeStyle = "#666666";
  ctx.lineWidth = 3;
  ctx.setLineDash([12, 8]); // Larger dashes for better visibility

  // Draw dashed border around the entire texture area (this will be the design boundary)
  ctx.strokeRect(2, 2, width - 4, height - 4);

  // Add subtle corner indicators
  ctx.setLineDash([]); // Solid lines for corners
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#888888";
  
  const cornerSize = 16;
  // Top-left corner
  ctx.beginPath();
  ctx.moveTo(8, 8 + cornerSize);
  ctx.lineTo(8, 8);
  ctx.lineTo(8 + cornerSize, 8);
  ctx.stroke();
  
  // Top-right corner
  ctx.beginPath();
  ctx.moveTo(width - 8 - cornerSize, 8);
  ctx.lineTo(width - 8, 8);
  ctx.lineTo(width - 8, 8 + cornerSize);
  ctx.stroke();
  
  // Bottom-left corner
  ctx.beginPath();
  ctx.moveTo(8, height - 8 - cornerSize);
  ctx.lineTo(8, height - 8);
  ctx.lineTo(8 + cornerSize, height - 8);
  ctx.stroke();
  
  // Bottom-right corner
  ctx.beginPath();
  ctx.moveTo(width - 8 - cornerSize, height - 8);
  ctx.lineTo(width - 8, height - 8);
  ctx.lineTo(width - 8, height - 8 - cornerSize);
  ctx.stroke();

  // Add text label in center
  ctx.fillStyle = "#666666";
  ctx.font = `${Math.max(12, width / 20)}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  // Draw text in center with semi-transparent background
  const textY = height / 2;
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.fillRect(width / 2 - 40, textY - 15, 80, 30);
  
  ctx.fillStyle = "#666666";
  ctx.fillText("Motiv", width / 2, textY - 4);
  ctx.font = `${Math.max(10, width / 25)}px Arial`;
  ctx.fillText(ratio, width / 2, textY + 8);

  // Create and return texture
  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
