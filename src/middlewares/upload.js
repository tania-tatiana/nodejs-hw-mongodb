import path from 'node:path';

import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (request, response, cb) {
    cb(null, path.resolve('src/tmp'));
  },
  filename: function (request, file, cb) {
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniquePrefix}_${file.originalname}`);
  },
});

export const upload = multer({ storage });
