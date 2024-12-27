
class Vector extends Object {
  constructor(props) {
    super();
    Object.assign(this, props);
    Object.defineProperty(this, "$length", {
      writable: true,
    });
  }

  get length() {
    if (this.$length == null) {
      this.$length = Object.keys(this).length;
    }
    return this.$length;
  }

  norm() {
    let keys = Object.keys(this);
    if (keys.length === 0) {
      return 0;
    }
    let sumSqr = keys.reduce((a,k)=>{
      let v = this[k];
      return a + v*v;
    }, 0);
    return Math.sqrt(sumSqr);
  }

  dot(vec2) {
    let keys = Object.keys(this);
    return keys.reduce((a,k)=>{
      let v1 = this[k];
      let v2 = vec2[k] || 0;

      return a + v1*v2;
    }, 0);
  }

  intersect(vec2) {
    let keys = Object.keys(this);
    return keys.reduce((a,k)=>{
      let v1 = this[k];
      let v2 = vec2[k] || 0;
      if (v1 && v2) {
        a[k] = v1*v2;
      }

      return a;
    }, new Vector());
  }

  similar(vec2) {
    let d = this.dot(vec2);
    let norm1 = this.norm();
    let norm2 = vec2.norm();
    let den = norm1 * norm2;
    return den ? d / den : 0;
  }
}

export default class WordSpace {
  constructor(opts={}) {
    let {
      minWord = 3, // minimum word length
      wordMap = {}, // word replacement map
    } = opts;

    wordMap = Object.keys(wordMap).reduce((a,w)=>{
      let wLow = w.toLowerCase();
      a[wLow] = wordMap[w].toLowerCase();
      return a;
    }, {});

    Object.assign(this, {
      minWord,
      wordMap,
    });
  }

  static get Vector() { return Vector; }

  string2Vector(str) {
    const msg = 'WordSpace.string2Vector:';
    let dbg = 0;
    let { 
      minWord, wordMap 
    } = this;
    let sNorm = str.toLowerCase().trim()
      .replace(/[-]/g,' ')
      .replace(/[.,_:;"'“”‘’!?]/g,'');
    let words = sNorm.split(' ');
    return words.reduce((a,w)=>{
      if (wordMap[w]) {
        dbg && console.log(msg, w, wordMap[w]);
        w = wordMap[w].toLowerCase();
      }
      if (w.length >= minWord) {
        a[w] = (a[w] || 0) + 1;
      }
      return a;
    }, new Vector());
  }

}
