export type ArticleConfig = {
  title: string;
  description: string;
  date: string;
  tags: string[];
  imageCover: string;
  imageAlt: string;
  photographerUrl: string;
  photographerName: string;
  articleFile: string;
  keywords: string;
};

export type ArticleAttributes = {
  title: string;
  description: string;
  date: string;
  articleTags: string;
  imageCover: string;
  imageAlt: string;
  photographerUrl: string;
  photographerName: string;
  articleBody: string;
  keywords: string;
};

export type ArticlePaths = {
  newArticlePath: string;
  imageCoverExamplePath: string;
  imageCoverPath: string;
  assetsFolder: string;
  imageCoverFileName: string;
};
