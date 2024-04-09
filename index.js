import fs from 'node:fs';
import showdown from 'showdown';

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
</html>`
}


function postPage(content, keywords, title) {
  return `<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    <meta name="keywords" content="${keywords.join(',')}">
  </head>
  <body>
    <main>
      ${content}
    </main>
  </body>
</html>`
}

fs.readFile(
  './content/struct.json',
  { encoding: 'utf-8' },
  (err, data) => {
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
        { encoding: 'utf-8' },
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
          )
        }
      )

      links.push(
        `<li><a href="/${post.slug}.html">${post.title}</a></li>`
      )
    }

    fs.writeFile(
      './generated/index.html',
      html(struct.author, struct.headline, `<ul>${links.join("")}</ul>`),
      (err) => {
        if (err) {
          throw err;
        }

        console.log('index.html ready');
      }
    )
  }
)
