import { promises as fs } from "fs";
import { resolve } from "path";

const replaceAll = (content: string, pattern: string, replacement: string): string =>
  content.replace(new RegExp(pattern, "g"), replacement);

const start = async () => {
  const contentTemplatePath = resolve(__dirname, '../data/template.html');
  const content = await fs.readFile(contentTemplatePath, "utf8");

  const articleConfigPath = resolve(__dirname, '../data/article.config.json');
  const articleConfigContent = await fs.readFile(articleConfigPath, "utf8");
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
};

start();
