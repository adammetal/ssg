import fs from "node:fs/promises";
import showdown from "showdown";

const converter = new showdown.Converter();

function html(author, headline, content) {
  return `<!DOCTYPE html>
<html>
  <body>
    <h1>${headline}</h1>
    <h2>By: ${author}</h2>

    <main>
      ${content}
    </main>
  </body>
</html>`;
}

function postPage(content, keywords, title) {
  return `<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    <meta name="keywords" content="${keywords.join(",")}">
  </head>
  <body>
    <main>
      ${content}
    </main>
  </body>
</html>`;
}

// syntax sugar
async function main() {
  const structFile = await fs.readFile("./content/struct.json", "utf-8");
  const struct = JSON.parse(structFile);
  
  const links = [];
  for (const post of struct.posts) {
    links.push(`<li><a href="/${post.slug}.html">${post.title}</a></li>`);

    const md = await fs.readFile(`./content/${post.filename}`, "utf-8");
    const htm = converter.makeHtml(md);

    await fs.writeFile(
      `./generated/${post.slug}.html`,
      postPage(htm, post.keywords, post.title)
    );
  }

  await fs.writeFile(
    "./generated/index.html",
    html(struct.author, struct.headline, `<ul>${links.join("")}</ul>`)
  );

  console.log("Static site generated");
}

main().catch((err) => {
  console.error(err);
})

/*
fs.readFile("./content/struct.json", { encoding: "utf-8" })
  .then((data) => {
    const struct = JSON.parse(data);

    const links = [];

    for (const post of struct.posts) {
      links.push(`<li><a href="/${post.slug}.html">${post.title}</a></li>`);

      fs.readFile(`./content/${post.filename}`, { encoding: "utf-8" })
        .then((md) => converter.makeHtml(md))
        .then((htm) => {
          return fs.writeFile(
            `./generated/${post.slug}.html`,
            postPage(htm, post.keywords, post.title)
          );
        });
    }

    return [struct, links];
  })
  .then(([struct, links]) => {
    return fs.writeFile(
      "./generated/index.html",
      html(struct.author, struct.headline, `<ul>${links.join("")}</ul>`)
    );
  })
  .then(() => {
    console.log("static site genearted");
  })
  .catch((err) => {
    throw err;
  });

fs.readFile("./content/struct.json", { encoding: "utf-8" }, (err, data) => {
  if (err) {
    throw err;
  }
  // string
  const struct = JSON.parse(data);
  // object

  const links = [];
  for (const post of struct.posts) {
    fs.readFile(
      `./content/${post.filename}`,
      { encoding: "utf-8" },
      (err, data) => {
        const content = converter.makeHtml(data);

        fs.writeFile(
          `./generated/${post.slug}.html`,
          postPage(content, post.keywords, post.title),
          (err) => {
            if (err) {
              throw err;
            }
          }
        );
      }
    );

    links.push(`<li><a href="/${post.slug}.html">${post.title}</a></li>`);
  }

  fs.writeFile(
    "./generated/index.html",
    html(struct.author, struct.headline, `<ul>${links.join("")}</ul>`),
    (err) => {
      if (err) {
        throw err;
      }

      console.log("index.html ready");
    }
  );
});
*/