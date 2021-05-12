const types = require('./mime-type.json');
types.forEach(c => {
  c.extensions = c.extension.split('\n');
  c.extension = c.extensions[0];
});
export const MIME_TYPE = types;
