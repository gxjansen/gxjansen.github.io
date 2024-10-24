import { i as integer } from './index-9722793d.node.react-server.js';
import { t as text } from './index-10ea50e2.node.react-server.js';

function CloudImagePreview() {}
function CloudImagePreviewForNewEditor() {}
let cloudImageToolbarIcon = undefined;
function handleFile() {}

const cloudImageSchema = {
  src: text({
    label: 'URL',
    validation: {
      length: {
        min: 1
      }
    }
  }),
  alt: text({
    label: 'Alt text'
  }),
  height: integer({
    label: 'Height'
  }),
  width: integer({
    label: 'Width'
  })
};

export { CloudImagePreviewForNewEditor as C, cloudImageToolbarIcon as a, CloudImagePreview as b, cloudImageSchema as c, handleFile as h };
