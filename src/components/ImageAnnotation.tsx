import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MoreHorizontal, Move, Type, Circle, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { renderAnnotationsToImage } from '@/lib/imageProcessor';

interface Annotation {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  fontSize: string;
  fontFamily: string;
  arrowAngle: number;
  arrowLength: number; // Added property for arrow length
}

interface ImageAnnotationProps {
  imageUrl: string;
  onSave: (newAnnotations: Annotation[], annotatedImageBlob: Blob) => void;
  onCancel: () => void;  // Add this prop
  initialAnnotations?: Annotation[];
  maxHeight?: string; // Nova prop para controlar altura máxima
}

const fontFamilies = [
  { name: 'SF Pro Display', value: 'sf-pro-display' },
  { name: 'Helvetica Now', value: 'helvetica-now' },
  { name: 'Instagram Sans', value: 'instagram-sans' },
];

const colors = [
  '#ffffff',
  '#000000',
  '#ff0000',
  '#00ff00',
  '#0000ff',
  '#ffff00',
  '#ff00ff',
  '#00ffff',
];

const ARROW_WIDTH = 120; // Aumentado de 100 para 120
const ARROW_LINE_HEIGHT = 3; // Aumentado de 2 para 3
const ARROW_HEAD_SIZE = 12; // Aumentado de 8 para 12
const TEXT_SIZE = 16; // Aumentado de 14 para 16

export const ImageAnnotation: React.FC<ImageAnnotationProps> = ({
  imageUrl,
  onSave,
  onCancel,  // Add this prop
  initialAnnotations = [],
  maxHeight = "500px" // Valor padrão
}) => {
  const [annotations, setAnnotations] = useState<Annotation[]>(initialAnnotations);
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      x,
      y,
      text: '', // Alterado para começar vazio
      color: '#ffffff',
      fontSize: '16px', // Reduced from 24px
      fontFamily: 'sf-pro-display',
      arrowAngle: 45,
      arrowLength: 50, // Base length (will be doubled in rendering)
    };

    setAnnotations([...annotations, newAnnotation]);
    setSelectedAnnotation(newAnnotation);
  };

  const handleSave = async () => {
    try {
      const annotatedImageBlob = await renderAnnotationsToImage(imageUrl, annotations);
      onSave(annotations, annotatedImageBlob);
    } catch (error) {
      console.error('Error saving annotations:', error);
    }
  };

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="relative w-full h-full"
        onClick={handleImageClick}
      >
        <img 
          src={imageUrl} 
          alt="Imagem com anotações" 
          className="w-full h-full object-contain"
          style={{ maxHeight }} // Usa a prop maxHeight
        />

        {annotations.map((annotation) => (
          <AnnotationElement
            key={annotation.id}
            annotation={annotation}
            isSelected={selectedAnnotation?.id === annotation.id}
            onSelect={() => setSelectedAnnotation(annotation)}
            onChange={(updatedAnnotation) => {
              setAnnotations(annotations.map(a => 
                a.id === updatedAnnotation.id ? updatedAnnotation : a
              ));
            }}
            onDelete={() => {
              setAnnotations(annotations.filter(a => a.id !== annotation.id));
              setSelectedAnnotation(null);
            }}
            containerBounds={containerRef.current?.getBoundingClientRect()}
          />
        ))}
      </div>

      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handleSave}
        >
          Aplicar Anotações
        </Button>
      </div>
    </div>
  );
};

const AnnotationElement: React.FC<{
  annotation: Annotation;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (annotation: Annotation) => void;
  onDelete: () => void;
  containerBounds?: DOMRect;
}> = ({ annotation, isSelected, onSelect, onChange, onDelete, containerBounds }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'move' | 'rotate' | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  // Memoize keepAnnotationInBounds function
  const keepAnnotationInBounds = useCallback((x: number, y: number) => {
    const textBoxWidth = 150;
    const arrowWidth = ARROW_WIDTH;
    
    const minX = (textBoxWidth / (containerBounds?.width || 1)) * 100;
    const maxX = 100 - ((arrowWidth / (containerBounds?.width || 1)) * 100);
    
    return {
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(0, Math.min(100, y))
    };
  }, [containerBounds]);

  const handleMouseDown = (e: React.MouseEvent, type: 'move' | 'rotate') => {
    e.stopPropagation();
    setIsDragging(true);
    setDragType(type);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerBounds) return;

      if (dragType === 'move') {
        const deltaX = e.clientX - startPos.x;
        const deltaY = e.clientY - startPos.y;
        
        const newX = annotation.x + (deltaX / containerBounds.width) * 100;
        const newY = annotation.y + (deltaY / containerBounds.height) * 100;

        // Apply bounds checking
        const bounded = keepAnnotationInBounds(newX, newY);
        
        onChange({
          ...annotation,
          x: bounded.x,
          y: bounded.y,
        });

        setStartPos({ x: e.clientX, y: e.clientY });
      } else if (dragType === 'rotate') {
        const rect = elementRef.current?.getBoundingClientRect();
        if (!rect) return;

        const center = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };

        const angle = Math.atan2(
          e.clientY - center.y,
          e.clientX - center.x
        ) * (180 / Math.PI);

        onChange({
          ...annotation,
          arrowAngle: angle,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDragType(null);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragType, startPos, annotation, onChange, containerBounds, keepAnnotationInBounds]);

  return (
    <div
      ref={elementRef}
      className="absolute"
      style={{
        left: `${annotation.x}%`,
        top: `${annotation.y}%`,
        transform: 'translate(-0%, -0%)', // Remove any translation that might offset the position
      }}
      onMouseDown={(e) => handleMouseDown(e, 'move')}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Text Box */}
      <div className="absolute right-full mb-0 p-2 rounded backdrop-blur-sm translate-y-[-50%] mr-2">
        <Input
          value={annotation.text}
          onChange={(e) => onChange({ ...annotation, text: e.target.value })}
          className="bg-black/90 border-none text-white min-w-[150px]" // Removido font-semibold
          style={{ 
            fontSize: `${TEXT_SIZE}px`,
            padding: '8px 12px', // Padding maior
            height: '36px' // Altura maior
          }}
          placeholder="Digite a anotação..."
          autoFocus
        />
      </div>

      {/* Arrow */}
      <div
        className="relative"
        style={{
          transform: `rotate(${annotation.arrowAngle}deg)`,
          transformOrigin: '0 0', // Make sure rotation happens from the start point
        }}
      >
        {/* Arrow line */}
        <div
          className="absolute origin-left transform transition-all"
          style={{
            backgroundColor: annotation.color,
            width: `${ARROW_WIDTH}px`,
            height: `${ARROW_LINE_HEIGHT}px`
          }}
        >
          {/* Arrow head */}
          <div
            className="absolute right-0 transform"
            style={{ color: annotation.color }}
          >
            <svg
              width={ARROW_HEAD_SIZE}
              height={ARROW_HEAD_SIZE}
              viewBox={`0 0 ${ARROW_HEAD_SIZE} ${ARROW_HEAD_SIZE}`}
              fill="none"
              style={{
                transform: 'rotate(-90deg) translate(50%, 0)',
              }}
            >
              <path
                d={`M${ARROW_HEAD_SIZE/2} 0L${ARROW_HEAD_SIZE} ${ARROW_HEAD_SIZE}H0L${ARROW_HEAD_SIZE/2} 0Z`}
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

        {/* Rotation Handle */}
        <div
          className="absolute right-0 w-4 h-4 bg-white rounded-full cursor-move"
          onMouseDown={(e) => handleMouseDown(e, 'rotate')}
        />
      </div>

      {/* Settings Menu - Moved to bottom right corner of the image */}
      {isSelected && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="fixed bottom-4 right-4 z-50 bg-black/50 hover:bg-black/70"
            >
              <MoreHorizontal className="w-4 h-4 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {/* Color picker */}
            <div className="p-2 grid grid-cols-4 gap-1">
              {colors.map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded-full border border-gray-200"
                  style={{ backgroundColor: color }}
                  onClick={() => onChange({ ...annotation, color })}
                />
              ))}
            </div>
            
            {/* Font family selector */}
            <div className="p-2 border-t">
              {fontFamilies.map((font) => (
                <button
                  key={font.value}
                  className="w-full text-left px-2 py-1 hover:bg-accent rounded"
                  style={{ fontFamily: font.value }}
                  onClick={() => onChange({ ...annotation, fontFamily: font.value })}
                >
                  {font.name}
                </button>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Delete Button - Repositioned */}
      {isSelected && (
        <Button
          variant="destructive"
          size="icon"
          className="absolute -top-8 -left-8"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
