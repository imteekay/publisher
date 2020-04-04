import { promises as fs } from 'fs';
import { resolve } from 'path';
import showdown from 'showdown';

type ArticleConfig = {
  title: string
  description: string
  date: string
  tags: string[]
  imageCover: string
  photographerUrl: string
  photographerName: string
  articleFile: string
  keywords: string
}

type ArticleAttributes = {
  title: string
  description: string
  date: string
  articleTags: string
  imageCover: string
  photographerUrl: string
  photographerName: string
  articleBody: string
  keywords: string
};

const getPattern = (find: string): RegExp =>
  new RegExp('\{\{(?:\\s+)?(' + find + ')(?:\\s+)?\}\}', 'g');

const buildTag = (tagContent: string) => (tag: string): string =>
  tagContent.replace(getPattern('tag'), tag);

const fromMarkdownToHTML = (articleMarkdown: string): string => {
  const converter = new showdown.Converter()
  return converter.makeHtml(articleMarkdown);
};

const getTemplateContent = async (): Promise<string> => {
  const contentTemplatePath = resolve(__dirname, '../data/template.html');
  return await fs.readFile(contentTemplatePath, 'utf8');
};

const getArticleConfig = async (): Promise<ArticleConfig> => {
  const articleConfigPath = resolve(__dirname, '../data/article.config.json');
  const articleConfigContent = await fs.readFile(articleConfigPath, 'utf8');
  return JSON.parse(articleConfigContent);
};

const getArticleTags = async ({ tags }: { tags: string[] }): Promise<string> => {
  const tagTemplatePath = resolve(__dirname, '../data/tag_template.html');
  const tagContent = await fs.readFile(tagTemplatePath, 'utf8');
  return tags.map(buildTag(tagContent)).join('');
};

const getArticleBody = async ({ articleFile }: { articleFile: string }): Promise<string> => {
  const articleMarkdownPath = resolve(__dirname, `../data/${articleFile}`);
  const articleMarkdown = await fs.readFile(articleMarkdownPath, 'utf8');
  return fromMarkdownToHTML(articleMarkdown);
};

const buildArticle = (templateContent: string) => ({
  with: (articleConfig: ArticleAttributes) =>
    templateContent
      .replace(getPattern('title'), articleConfig.title)
      .replace(getPattern('description'), articleConfig.description)
      .replace(getPattern('date'), articleConfig.date)
      .replace(getPattern('tags'), articleConfig.articleTags)
      .replace(getPattern('imageCover'), articleConfig.imageCover)
      .replace(getPattern('photographerUrl'), articleConfig.photographerUrl)
      .replace(getPattern('photographerName'), articleConfig.photographerName)
      .replace(getPattern('article'), articleConfig.articleBody)
      .replace(getPattern('keywords'), articleConfig.keywords)
});

const start = async () => {
  const templateContent: string = await getTemplateContent();
  const articleConfig: ArticleConfig = await getArticleConfig();
  const articleTags: string = await getArticleTags(articleConfig);
  const articleBody: string = await getArticleBody(articleConfig);

  const article: string = buildArticle(templateContent).with({
    ...articleConfig,
    articleTags,
    articleBody
  });

  fs.writeFile('index.html', article);
};

start();
