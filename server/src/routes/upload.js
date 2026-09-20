import { Router } from 'express';
import multer from 'multer';
import crypto from 'crypto';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 8 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only image files are allowed'));
    cb(null, true);
  },
});

function cloudinarySignature(params, secret) {
  const payload = Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== null && params[key] !== '')
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  return crypto.createHash('sha1').update(payload + secret).digest('hex');
}

router.post('/images', upload.array('images', 8), async (req, res, next) => {
  try {
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      return res.status(500).json({ success: false, message: 'Cloudinary is not configured on the server.' });
    }

    if (!req.files?.length) {
      return res.status(400).json({ success: false, message: 'Please select at least one image.' });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = 'gokana/products';
    const signature = cloudinarySignature({ folder, timestamp }, CLOUDINARY_API_SECRET);

    const uploaded = [];
    for (const file of req.files) {
      const form = new FormData();
      form.append('file', new Blob([file.buffer], { type: file.mimetype }), file.originalname);
      form.append('api_key', CLOUDINARY_API_KEY);
      form.append('timestamp', String(timestamp));
      form.append('folder', folder);
      form.append('signature', signature);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: form },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || 'Cloudinary upload failed');
      }

      uploaded.push({
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
      });
    }

    res.json({ success: true, images: uploaded });
  } catch (err) {
    next(err);
  }
});

export default router;
