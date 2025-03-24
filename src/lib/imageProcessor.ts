import { Annotation } from '@/types';

// Aumentando os fatores de escala
const SCALE_FACTOR = 2.5; // Aumentado de 1.5 para 2.5

export async function renderAnnotationsToImage(
  imageUrl: string,
  annotations: Annotation[]
): Promise<Blob> {
  // Create canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Load image
  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.crossOrigin = "anonymous"; // Add this to prevent CORS issues
    img.src = imageUrl;
  });

  // Set canvas size to match image
  canvas.width = img.width;
  canvas.height = img.height;
  
  // Aumentando o tamanho base do texto
  const BASE_TEXT_SIZE = Math.max(canvas.width * 0.03, 32); // Aumentado de 0.02 para 0.03 e mínimo de 32px
  // Draw original image
  ctx.drawImage(img, 0, 0);

  // Calculate scale factor based on image width
  const scaleFactor = canvas.width / 1000; // 1000px como largura de referência

  // Draw annotations
  annotations.forEach(annotation => {
    const x = Math.round((annotation.x / 100) * canvas.width);
    const y = Math.round((annotation.y / 100) * canvas.height);

    // Cálculo do tamanho do texto baseado na largura da imagem
    const fontSize = Math.max(canvas.width * 0.04, 36); // Aumentado para 4% da largura e mínimo 36px
    
    // Desenhar a seta
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((annotation.arrowAngle * Math.PI) / 180);
    
    // Seta proporcional à largura da imagem
    const arrowWidth = canvas.width * 0.15; // 15% da largura
    ctx.beginPath();
    ctx.strokeStyle = annotation.color;
    ctx.lineWidth = Math.max(canvas.width * 0.005, 4); // Linha mais grossa
    ctx.moveTo(0, 0);
    ctx.lineTo(arrowWidth, 0);
    ctx.stroke();

    // Ponta da seta proporcional
    const headSize = arrowWidth * 0.15;
    ctx.beginPath();
    ctx.fillStyle = annotation.color;
    ctx.moveTo(arrowWidth, 0);
    ctx.lineTo(arrowWidth - headSize, -headSize/2);
    ctx.lineTo(arrowWidth - headSize, headSize/2);
    ctx.closePath();
    ctx.fill();

    // Texto e caixa
    ctx.restore();
    ctx.save();
    ctx.translate(x, y);
    
    ctx.font = `${fontSize}px ${annotation.fontFamily}`;
    
    // Espaçamentos proporcionais ao tamanho da fonte
    const padding = fontSize * 0.5;
    const metrics = ctx.measureText(annotation.text);
    const textHeight = fontSize * 1.2;
    const textBoxDistance = fontSize * 0.3; // Reduzido para aproximar da seta
    
    // Fundo do texto
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(
      -metrics.width - padding * 2 - textBoxDistance,
      -textHeight/2,
      metrics.width + padding * 2,
      textHeight
    );

    // Texto
    ctx.fillStyle = annotation.color;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right';
    ctx.fillText(
      annotation.text,
      -textBoxDistance - padding/2,
      0
    );

    ctx.restore();
  });

  // Convert canvas to blob with maximum quality
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob!);
    }, 'image/png', 1.0); // Added quality parameter
  });
}
