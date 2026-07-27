import path from "node:path";
import assert from "node:assert";
import fs from "node:fs";

import express from "express";
import CDP from "chrome-remote-interface";

const app = express();
const expected = "Infrastructure";
const template = fs.readFileSync(
  path.resolve(import.meta.dirname, "./index.html"),
  "utf-8"
);

app.get("/", (req, res) => {
  res.type("html");
  res.send(template);
});

// Запускаем сервер который отдает на localhost:3000 html - ./index.html
app.listen(3000, () => {
  console.log("Server listen on port 3000");
  test();
});

async function test() {
  let client;

  try {
    client = await CDP();
    console.log("Successfully connected to chrome!");

    const { Network, Page, DOM, Runtime } = client;

    // Включаем Network, Page и Runtime
    await Network.enable();
    await Page.enable();
    await Runtime.enable();

    // Нужно перейти на localhost:3000, дождаться инициализации DOM и вызвать нужные команды
    await Page.navigate({ url: "http://localhost:3000" });
    await Page.loadEventFired();
    await DOM.enable();

    const doc = await DOM.getDocument();
    const nodeId = doc.root.nodeId;
    const elem = await DOM.querySelector({
      nodeId,
      selector: "#root",
    });
    const outerElem = await DOM.getOuterHTML({ nodeId: elem.nodeId });

    // Здесь нужно получить содержимое элемента #root
    const result = outerElem.outerHTML.slice(outerElem.outerHTML.indexOf('>') + 1, outerElem.outerHTML.lastIndexOf('<'));

    assert.equal(result, expected);
  } catch (err) {
    console.error(err);
  } finally {
    if (client) {
      await client.close();
    }

    process.exit(0);
  }
}
