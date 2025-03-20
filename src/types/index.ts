
export interface Portfolio {
  id: string;
  name: string;
  createdAt: string;
  imageCount: number;
  coverImage?: string;
}

export interface Image {
  id: string;
  portfolioId: string;
  url: string;
  caption: string;
  createdAt: string;
}
