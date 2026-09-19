import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import process from 'node:process';

/**
 * С помощью node:process реализуйте функции:
 * checkMajorNodeVersion - функция должна проверять что используемая мажорная версия nodejs больше 18
 * checkPackageJson - функция должна проверять существование файла package.json и скрипта build в нем (поле scripts)
 */

function checkMajorNodeVersion() {
  const majorVer = process.versions.node.split('.')[0];
  return Number(majorVer) > 18;
}

function checkPackageJson(packageJsonPath) {
  const isExist = fs.existsSync(packageJsonPath);
  if (!isExist) return 'not found';
  const jsonData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  if (jsonData.scripts?.build !== undefined) return 0;
  return 1;
}

assert.equal(checkMajorNodeVersion(), true);

const emptyPackageJsonPath = path.join(
  import.meta.dirname,
  "fixtures",
  "empty",
  "package.json"
);
assert.equal(checkPackageJson(emptyPackageJsonPath), 1);

const notExistsPackageJsonPath = path.join(
  import.meta.dirname,
  "fixtures",
  "not-exists",
  "package.json"
);
assert.equal(checkPackageJson(notExistsPackageJsonPath), "not found");

const packageJsonPath = path.join(
  import.meta.dirname,
  "fixtures",
  "package.json"
);
assert.equal(checkPackageJson(packageJsonPath), 0);
