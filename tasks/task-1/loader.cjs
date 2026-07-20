const fs = require("node:fs");
const yaml = require("yaml");

const parser = (module, filename) => {
  module.exports = yaml.parse(fs.readFileSync(filename, 'utf8'));
};

require.extensions['.yml'] = parser;

require.extensions['.yaml'] = parser;
