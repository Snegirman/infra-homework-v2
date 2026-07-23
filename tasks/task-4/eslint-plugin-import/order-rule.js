const getGroup = (value) => {
  if (value.startsWith('./')) {
    return 1;
  }
  if (value.startsWith('../')) {
    return 2;
  }
  return 0;
}

export default {
  meta: {
    fixable: "code",
  },
  create: (context) => {
    const foundImports = [];

    return {
      ImportDeclaration(node) {
        foundImports.push(node);
      },
      "Program:exit"() {
        const imports = foundImports.map(x => x).sort((a, b) => {
          const aGroup = getGroup(a.source.value);
          const bGroup = getGroup(b.source.value);
          if (aGroup === bGroup) {
            return a.source.value.localeCompare(b.source.value);
          }
          return aGroup - bGroup;
        });

        const isSortedEquals = imports.every(
          (sortedItem, index) => sortedItem === foundImports[index],
        );

        if (isSortedEquals) {
          return;
        }

        context.report({
          node: foundImports[0],
          message: "Imports are not sorted by groups",
          fix: (fixer) => {
            const merged = imports.map(item => context.sourceCode.getText(item)).join("\n");
            return fixer.replaceTextRange([foundImports[0].range[0], foundImports.at(-1).range[1]], merged);
          }
        })
      },
    }
  }
};
