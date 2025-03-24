export interface Portfolio {
  id: string;
  name: string;
  createdAt: string;
  imageCount?: number;
  coverImage?: string;
}

export interface Annotation {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  fontSize: string;
  fontFamily: string;
  arrowAngle: number;
  arrowLength: number;
}

export interface ImageItem {
  id: string;
  portfolioId: string;
  url: string;
  caption: string;
  createdAt: string;
  imageName?: string;
  annotations?: Annotation[];
}

export type Image = ImageItem;

export interface TelegramUser {
  id: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  activePortfolioId?: string;
  createdAt: string;
}
