import fs from "node:fs";
import { parse } from "acorn";
import { walk } from "zimmerframe";

export function check(filePath) {
  const errors = [];
  const file = fs.readFileSync(filePath).toString();
  const parsed = parse(file, { ecmaVersion: 'latest', sourceType: 'module' });

  const state = {
    declarations: [],
  };

  walk(parsed, state, {
    FunctionDeclaration(node, { next }) {
      if (node.async) {
        state.declarations.push(node.id.name);
      }
      next();
    },
  });

  walk(parsed, state, {
    IfStatement(node, { next }) {
      if (node.test.type === "CallExpression") {
        if (node.test.callee.type === "Identifier") {
          if (state.declarations.includes(node.test.callee.name)) {
            errors.push({
              start: node.test.start,
              end: node.test.end,
            });
          }
        }
      }
      next();
    },
  });

  return errors;
}
