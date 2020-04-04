import { promises as fs } from 'fs';
import { resolve } from 'path';
import showdown from 'showdown';

const getPattern = (find: string): RegExp =>
  new RegExp('\{\{(?:\\s+)?(' + find + ')(?:\\s+)?\}\}', 'g');

const buildTag = (tagContent: string) => (tag: string): string =>
  tagContent.replace(getPattern('tag'), tag);

const fromMarkdownToHTML = (articleMarkdown: string): string => {
  const converter = new showdown.Converter()
  return converter.makeHtml(articleMarkdown);
}

const start = async () => {
  const contentTemplatePath = resolve(__dirname, '../data/template.html');
  const content = await fs.readFile(contentTemplatePath, 'utf8');

  const articleConfigPath = resolve(__dirname, '../data/article.config.json');
  const articleConfigContent = await fs.readFile(articleConfigPath, 'utf8');
  const articleConfig = JSON.parse(articleConfigContent);

  const {
    title,
    description,
    date,
    tags,
    imageCover,
    photographerUrl,
    photographerName,
    articleFile,
    keywords
  } = articleConfig;

  const tagTemplatePath = resolve(__dirname, '../data/tag_template.html');
  const tagContent = await fs.readFile(tagTemplatePath, 'utf8');
  const articleTags = tags.map(buildTag(tagContent)).join('');

  const articleMarkdownPath = resolve(__dirname, `../data/${articleFile}`);
  const articleMarkdown = await fs.readFile(articleMarkdownPath, 'utf8');
  const articleBody = fromMarkdownToHTML(articleMarkdown);

  const article = content
    .replace(getPattern('title'), title)
    .replace(getPattern('description'), description)
    .replace(getPattern('date'), date)
    .replace(getPattern('tags'), articleTags)
    .replace(getPattern('imageCover'), imageCover)
    .replace(getPattern('photographerUrl'), photographerUrl)
    .replace(getPattern('photographerName'), photographerName)
    .replace(getPattern('article'), articleBody)
    .replace(getPattern('keywords'), keywords);

  fs.writeFile('index.html', article);
};

start();
