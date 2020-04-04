import { promises as fs } from 'fs';
import { resolve } from 'path';

const getPattern = (find: string): RegExp =>
  new RegExp('\{\{(?:\\s+)?(' + find + ')(?:\\s+)?\}\}', 'g');

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

  const article = content
    .replace(getPattern('title'), title)
    .replace(getPattern('description'), description)
    .replace(getPattern('date'), date)
    .replace(getPattern('tags'), tags)
    .replace(getPattern('imageCover'), imageCover)
    .replace(getPattern('photographerUrl'), photographerUrl)
    .replace(getPattern('photographerName'), photographerName)
    .replace(getPattern('articleFile'), articleFile)
    .replace(getPattern('keywords'), keywords);

  console.log(article)
};

start();
