import { i as integer } from './index-83fb8e35.worker.js';
import { t as text } from './index-08620d62.worker.js';

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
