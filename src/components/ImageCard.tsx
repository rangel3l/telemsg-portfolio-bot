
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ImageItem, Annotation } from '@/types';

interface ImageCardProps {
  image: ImageItem;
}

const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  return (
    <Card className="overflow-hidden group h-full transition-all">
      <CardContent className="p-0 relative h-full">
        <div className="relative overflow-hidden pb-[75%]">
          <div className="absolute inset-0">
            <img 
              src={image.url} 
              alt={image.caption || "Imagem"} 
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          {/* Render annotations */}
          {image.annotations && image.annotations.length > 0 && image.annotations.map((annotation) => (
            <div
              key={annotation.id}
              className="absolute pointer-events-none"
              style={{
                left: `${annotation.x}%`,
                top: `${annotation.y}%`,
              }}
            >
              {/* Text Box */}
              <div className="absolute right-full mb-2 p-2 rounded backdrop-blur-sm translate-y-[-50%] mr-2">
                <div
                  className="text-white min-w-[120px]"
                  style={{
                    fontFamily: annotation.fontFamily,
                    fontSize: annotation.fontSize,
                    color: annotation.color,
                  }}
                >
                  {annotation.text}
                </div>
              </div>

              {/* Arrow */}
              <div
                style={{
                  transform: `rotate(${annotation.arrowAngle}deg)`,
                }}
              >
                <div
                  className="absolute h-[2px] origin-left"
                  style={{
                    backgroundColor: annotation.color,
                    width: `${annotation.arrowLength}px`,
                  }}
                >
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
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
          {(image.imageName || image.caption) && (
            <div className="bg-black/50 p-2 rounded-md backdrop-blur-sm">
              {image.imageName && (
                <h3 className="font-semibold text-white text-sm uppercase">{image.imageName}</h3>
              )}
              {image.caption && (
                <p className="text-xs text-white/80 line-clamp-2">{image.caption}</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageCard;
