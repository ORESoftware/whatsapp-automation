const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

fs.readFile('/Users/alex.mills/codes/oresoftware/whatsapp-automation/assets/ws.html', 'utf8', (err, data) => {
  if (err) throw err;
  const dom = new JSDOM(data);
  const document = dom.window.document;

  // Remove <style> and <link> tags
  document.querySelectorAll('style, link[rel="stylesheet"]').forEach(el => el.remove());

  fs.writeFile('/Users/alex.mills/codes/oresoftware/whatsapp-automation/assets/xyz-wo-css.html', dom.serialize(), (err) => {
    if (err) throw err;
    console.log('CSS stripped HTML saved as xyz-wo-css.html');
  });
});
