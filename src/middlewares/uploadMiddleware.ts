import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Asegurar que las carpetas existan
const createStorageFolders = () => {
  const folders = [
    'storage/images/autos',
    'storage/images/thumbnails',
    'storage/temp'
  ];

  folders.forEach(folder => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  });
};

createStorageFolders();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Por ahora solo manejamos imágenes de autos
    cb(null, 'storage/images/autos');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `auto-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, WEBP)'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

export default upload; 