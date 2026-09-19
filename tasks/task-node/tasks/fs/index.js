import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";

/**
 * Напишите функцию которая будет собирать статистику о структуре файловой системы начиная с некой root директории
 * Она должна вернуть:
 * files - количество файлов
 * dirs - количество директорий
 * totalSize - общий вес всех файлов
 * largest - топ 3 файла
 *
 * Для обхода используйте fs/path (без glob) вместе с рекурсией/стеком
 */

function walk(root) {
  let fileCounter = 0;
  let dirCounter = 0;
  let sizeCounter = 0;
  let largest = [];
  const entries = fs.readdirSync(root, { withFileTypes: true });
  for (const item of entries) {
    const fullPath = path.join(root, item.name);
    if (item.isDirectory()) {
      const { files, dirs, totalSize, largest: newLargest} =  walk(fullPath);
      dirCounter += dirs + 1;
      fileCounter += files;
      sizeCounter += totalSize
      largest = [...largest, ...newLargest];
    } else if (item.isFile()) {
      fileCounter += 1
      const size = fs.statSync(fullPath).size
      sizeCounter += size
      largest.push({
        path: fullPath,
        size
      })
    }
    largest = largest.sort((a, b) => b.size - a.size).slice(0, 3)
  }
  return { files: fileCounter, dirs: dirCounter, totalSize: sizeCounter, largest };
}

const root = path.join(import.meta.dirname, "./src");
const result = walk(root);

assert.deepEqual(result, {
  files: 9,
  dirs: 10,
  totalSize: 547,
  largest: [
    {
      path: `${root}/config/config.json`,
      size: 134,
    },
    {
      path: `${root}/utils/calculator.js`,
      size: 129,
    },
    {
      path: `${root}/pages/login/index.js`,
      size: 48,
    },
  ],
});
