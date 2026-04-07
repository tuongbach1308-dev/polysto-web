export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  category: 'phu-kien' | 'ipad' | 'macbook' | 'tin-tuc';
  publishedAt: string;
  author: string;
}

export const blogCategoryLabels: Record<string, string> = {
  'phu-kien': 'Phụ kiện',
  'ipad': 'iPad',
  'macbook': 'Macbook',
  'tin-tuc': 'Tin tức',
};
