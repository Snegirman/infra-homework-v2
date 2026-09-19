import http from "node:http";
import https from "node:https";

export function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const { protocol } = new URL(url);
    const proto = protocol === 'https:' ? https : http;
    const req = proto.request(url, options, (res) => {
      res.setEncoding("utf-8");
      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      })
      res.on("end", () =>{
        const { statusCode, headers } = res;
        resolve({
          statusCode,
          headers,
          body
        })
      })
      res.on("error", (err) => {
        reject(err);
      })
    });
    req.on("error", (err) => {
      reject(err);
    })
    req.end();
  })
}
