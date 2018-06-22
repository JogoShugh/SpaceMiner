module.exports = function Html({ scripts }) {
  return `<html>
      <head>
        <title>Space Miner</title>
      </head>
      <body>
        <div id="app" />
        ${scripts.map(scriptUrl => `<script src="${scriptUrl}"></script>`).join('')}
        <script>
          let appEl = document.getElementById('app');
          App.render(appEl);
        </script>
      </body>
    </html>`;
}
