module.exports = {
  name: `plugin-duplicates-list`,
  factory: (require) => {
    const { BaseCommand } = require(`@yarnpkg/cli`);
    const { Configuration, Project, structUtils } = require("@yarnpkg/core");

    class DuplicatesList extends BaseCommand {
      static paths = [['duplicates']];

      async execute() {
        const config = await Configuration.find(this.context.cwd, this.context.plugins);
        const { project } = await Project.find(config, this.context.cwd);

        await project.restoreInstallState();

        const packageVersions = new Map();

        for (const pkg of project.storedPackages.values()) {
          if (!structUtils.isVirtualLocator(pkg)) {
            const name = structUtils.stringifyIdent(pkg);
            if (!packageVersions.has(name)) {
              packageVersions.set(name, new Set());
            }
            packageVersions.get(name).add(pkg.version);
          }
        }

        for (const [name, versions] of packageVersions) {
          if (versions.size > 1) {
            console.log(`${name}: ${Array.from(versions).join(' ')}`);
          }
        }
      }
    }

    return {
      commands: [DuplicatesList],
    };
  },
};
