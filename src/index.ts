import { promises } from 'fs';
import { resolve } from 'path';
import showdown from 'showdown';
import open from 'open';
import { ArticleConfig, ArticleAttributes, ArticlePaths } from './types';

const {
  readFile,
  mkdir,
  writeFile,
  copyFile
} = promises;

const getPattern = (find: string): RegExp =>
  new RegExp('\{\{(?:\\s+)?(' + find + ')(?:\\s+)?\}\}', 'g');

const buildTag = (tagContent: string) => (tag: string): string =>
  tagContent.replace(getPattern('tag'), tag);

const fromMarkdownToHTML = (articleMarkdown: string): string => {
  const converter = new showdown.Converter()
  return converter.makeHtml(articleMarkdown);
};

const getTemplateContent = async (): Promise<string> => {
  const contentTemplatePath = resolve(__dirname, '../examples/template.html');
  return await readFile(contentTemplatePath, 'utf8');
};

const getArticleConfig = async (): Promise<ArticleConfig> => {
  const articleConfigPath = resolve(__dirname, '../examples/article.config.json');
  const articleConfigContent = await readFile(articleConfigPath, 'utf8');
  return JSON.parse(articleConfigContent);
};

const getArticleTags = async ({ tags }: { tags: string[] }): Promise<string> => {
  const tagTemplatePath = resolve(__dirname, '../examples/tag_template.html');
  const tagContent = await readFile(tagTemplatePath, 'utf8');
  return tags.map(buildTag(tagContent)).join('');
};

const getArticleBody = async ({ articleFile }: { articleFile: string }): Promise<string> => {
  const articleMarkdownPath = resolve(__dirname, `../examples/${articleFile}`);
  const articleMarkdown = await readFile(articleMarkdownPath, 'utf8');
  return fromMarkdownToHTML(articleMarkdown);
};

const slugify = (title: string): string =>
  title
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/[\s]/g, '-');

const buildNewArticleFolderPath = ({ title, date }: { title: string, date: string }): string => {
  const [year, month]: string[] = date.split('-');
  const slugifiedTitle: string = slugify(title);

  return resolve(__dirname, `../../${year}/${month}/${slugifiedTitle}`);
};

const buildPaths = (newArticleFolderPath: string): ArticlePaths => {
  const imageCoverFileName: string = 'cover.jpeg';
  const newArticlePath: string = `${newArticleFolderPath}/index.html`;
  const imageCoverExamplePath: string = resolve(__dirname, `../examples/${imageCoverFileName}`);
  const assetsFolder: string = `${newArticleFolderPath}/assets`;
  const imageCoverPath: string = `${assetsFolder}/${imageCoverFileName}`;

  return {
    newArticlePath,
    imageCoverExamplePath,
    imageCoverPath,
    assetsFolder
  };
};

const buildArticle = (templateContent: string) => ({
  with: (articleConfig: ArticleAttributes) =>
    templateContent
      .replace(getPattern('title'), articleConfig.title)
      .replace(getPattern('description'), articleConfig.description)
      .replace(getPattern('date'), articleConfig.date)
      .replace(getPattern('tags'), articleConfig.articleTags)
      .replace(getPattern('imageCover'), articleConfig.imageCover)
      .replace(getPattern('imageAlt'), articleConfig.imageAlt)
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
  const newArticleFolderPath: string = buildNewArticleFolderPath(articleConfig);

  const {
    newArticlePath,
    imageCoverExamplePath,
    imageCoverPath,
    assetsFolder
  }: ArticlePaths = buildPaths(newArticleFolderPath);

  const article: string = buildArticle(templateContent).with({
    ...articleConfig,
    articleTags,
    articleBody
  });

  await mkdir(newArticleFolderPath, { recursive: true });
  await writeFile(newArticlePath, article);
  await mkdir(assetsFolder, { recursive: true });
  await copyFile(imageCoverExamplePath, imageCoverPath);
  await open(newArticlePath);
};

start();
