let privateCtor = false;

const HTML_FILTER = (() => {
  let prefixes = [
    '<!DOCTYPE',
    '<html',
    '<head',
    '</html',
    '<meta',
    '<title',
    '</head',
    '<body',
    '</body',
    '<article',
    '</article',
  ].join('|');
  let pat = `^(${prefixes}).*> *$`;
  return new RegExp(pat);
})();

export class LegacyDoc {
  constructor(opts = {}) {
    const msg = 'LegacyDoc.ctor:';
    if (!privateCtor) {
      throw new Error(`${msg} use LegacyDoc.create()`);
    }
    Object.assign(this, opts);
  }

  static filterHtml(line) {
    if (HTML_FILTER.test(line)) {
      return false;
    }

    return true;
  }

  static create(rawDoc) {
    const msg = 'LegacyDoc.create:';
    if (typeof legacy === 'string') {
      legacy = JSON.parse(legacy);
    }

    let { uid, lang, title, author, author_uid, text } = rawDoc;

    let para;
    let lines = text.filter((line) => !HTML_FILTER.test(line));
    lines = lines
      .join(' ')
      .replace(/<\/p> */g, '')
      .replace(/<h.*sutta-title.>(.*)<\/h1> /, '$1')
      .split('<p>');
    let footer = [];
    lines.forEach((line,i) => {
      if (/<footer>/.test(line)) {
        let f = line.replace(/.*<footer>(.*)<.footer>.*/, '$1');
        footer.push(f); 
        lines[i] = line.replace(/<footer>.*<.footer>/, '');
      }
      lines[i] = lines[i].trim();
    });
    footer = footer.join(' ');

    let opts = {
      uid,
      lang,
      title,
      author,
      author_uid,
      footer,
      lines,
    };

    privateCtor = true;
    let ldoc = new LegacyDoc(opts);
    privateCtor = false;

    return ldoc;
  }
}
