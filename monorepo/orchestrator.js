import fs from "node:fs";
import path from "node:path";
import { exec } from "node:child_process";

function findProjects() {
  const packageJsonPath = path.join(import.meta.dirname, "package.json");
  const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const workspacePath = path.join(import.meta.dirname, path.dirname(packageData.workspaces[0]));
  const projectPackageFiles = fs.readdirSync(workspacePath, { withFileTypes: true, recursive: true }).filter((item) => item.isFile() && item.name === 'package.json');

  const projectsPackageData = projectPackageFiles.map((item) => {
    return {
      data: JSON.parse(fs.readFileSync(path.join(item.parentPath, item.name), 'utf-8')),
      path: item.parentPath
    }
  });

  return projectsPackageData;
}

function runScript(project, buildCommand) {
  const hasScript = Object.keys(project.data.scripts).includes(buildCommand);
  if (!hasScript) {
    console.log(`[${project.data.name}] skipped (no ${buildCommand})`)
    return;
  }

  return new Promise((resolve, reject) => {
    exec(project.data.scripts[buildCommand], { cwd: project.path }, (error) => {
      if (error) {
        reject(error);
        return;
      }
      console.log(`[${project.data.name}] ${buildCommand} finished`)
      resolve();
    })
  });
}

async function run() {
  const projects = findProjects();
  const buildCommand = process.argv[2];

  for (const project of projects) {
    await runScript(project, buildCommand);
  }
}

run();
