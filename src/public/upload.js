const multer = require('multer');
const path = require('path'); // Thư viện để xử lý đường dẫn

// Cấu hình lưu trữ file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Định nghĩa thư mục lưu trữ
        cb(null, 'src/public/uploads'); // Đảm bảo thư mục này đã tồn tại
    },
    filename: function (req, file, cb) {
        // Tạo tên file duy nhất
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Giữ phần mở rộng gốc
    }
});

// Kiểm tra loại file được phép
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4', 'video/mkv'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // File hợp lệ
    } else {
        cb(new Error('Chỉ cho phép ảnh (jpeg, jpg, png) hoặc video (mp4, mkv)!'), false);
    }
};

// Tạo middleware Multer
const upload = multer({
    storage: storage, // Cấu hình lưu trữ
    fileFilter: fileFilter, // Lọc file
    limits: {
        fileSize: 10 * 1024 * 1024 // Giới hạn dung lượng file (10MB)
    }
});

module.exports = upload;
