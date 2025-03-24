
import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Move, Type, Circle, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Annotation } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface ImageAnnotationProps {
  imageUrl: string;
  onSave: (annotations: Annotation[]) => void;
  initialAnnotations?: Annotation[];
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

export const ImageAnnotation: React.FC<ImageAnnotationProps> = ({
  imageUrl,
  onSave,
  initialAnnotations = [],
}) => {
  const [annotations, setAnnotations] = useState<Annotation[]>(initialAnnotations);
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Update annotations when initialAnnotations change
    setAnnotations(initialAnnotations);
  }, [initialAnnotations]);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      x,
      y,
      text: 'Nova anotação',
      color: '#ffffff',
      fontSize: '16px',
      fontFamily: 'sf-pro-display',
      arrowAngle: 45,
      arrowLength: 100,
    };

    setAnnotations([...annotations, newAnnotation]);
    setSelectedAnnotation(newAnnotation);
  };

  const handleSave = () => {
    onSave(annotations);
    toast({
      description: "Anotações salvas com sucesso!",
    });
  };

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="relative w-full h-full cursor-crosshair"
        onClick={handleImageClick}
      >
        <img src={imageUrl} alt="Imagem com anotações" className="w-full h-auto" />

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

      <Button
        variant="secondary"
        size="sm"
        className="absolute top-4 right-4 z-50"
        onClick={handleSave}
      >
        Salvar Anotações
      </Button>
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

        onChange({
          ...annotation,
          x: Math.max(0, Math.min(100, newX)),
          y: Math.max(0, Math.min(100, newY)),
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
  }, [isDragging, dragType, startPos, annotation, onChange, containerBounds]);

  return (
    <div
      ref={elementRef}
      className="absolute"
      style={{
        left: `${annotation.x}%`,
        top: `${annotation.y}%`,
      }}
      onMouseDown={(e) => handleMouseDown(e, 'move')}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Text Box */}
      <div className="absolute right-full mb-2 p-2 rounded backdrop-blur-sm translate-y-[-50%] mr-2">
        <Input
          value={annotation.text}
          onChange={(e) => onChange({ ...annotation, text: e.target.value })}
          className="bg-black/50 border-none text-white min-w-[120px]"
        />
      </div>

      {/* Arrow */}
      <div
        className="relative"
        style={{
          transform: `rotate(${annotation.arrowAngle}deg)`,
        }}
      >
        {/* Arrow line */}
        <div
          className="absolute h-[2px] origin-left transform transition-all"
          style={{
            backgroundColor: annotation.color,
            transform: `rotate(${annotation.arrowAngle}deg)`,
            width: '100px', // Fixed width for arrow line
          }}
        >
          {/* Arrow head */}
          <div
            className="absolute right-0 transform translate-x-[1px]"
            style={{ color: annotation.color }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              style={{
                transform: 'rotate(-90deg) translate(50%, 0)',
              }}
            >
              <path
                d="M6 0L12 12H0L6 0Z"
                fill={annotation.color}
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
