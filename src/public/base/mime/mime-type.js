const types = require('./mime-type.json');
const extension_map = {}
const mime_map = {}
function split(str) {
  return str.replace("if it doesn't contain video", '').split(/\n|\s/).filter(d => d)
}
types.forEach(c => {
  c.extensions = split(c.extension);
  c.extension = c.extensions[0];
  c.mimes = split(c.mime);
  c.mime = c.mimes[0];
  c.extensions.forEach(d => {
    if(d) {
      extension_map[d] = c
    }
  })
  c.mimes.forEach(d => {
    if(d) {
      mime_map[d] = c
    }
  })
});
export const MIME_TYPE = types;
export const EXTENSION_MAP = extension_map;
export const MIME_MAP = mime_map;
