const path = require('path');
const fs = require('fs');
const react = require('react');
const ReactDOMServer = require('react-dom/server');
const { StaticRouter } = require('react-router-dom/server');

module.exports = function (app) {
  app.get('/*', (req, res) => {
    fs.readFile(path.resolve('../public/index.html'), 'utf-8', (err, data) => {
      console.log(err, data);
      if (err) {
        return res.status(500).send(err);
      }
      const html = ReactDOMServer.renderToString(
        <StaticRouter location={req.url}>
          <App />
        </StaticRouter>,
      );

      return res.send(data.replace('<div id="app"></div>', `<div id="app">${html}</div>`));
    });
  });
};
