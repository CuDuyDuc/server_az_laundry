const UserModel = require("../models/user_model");
const bcryp = require('bcryptjs');
const asyncHandle = require('express-async-handler');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const RoleModel = require("../models/role_model");


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // port của gmail là 587
    auth: {
        user: "duccu1403@gmail.com",
        pass: "ctda urbe beqa kjsf",
    },
})

const getJsonWebToken = (email, id) => {

    const payload = {
        email,
        id,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: '7d', // thời hạn sau khi đăng kỳ tài khoản người dùng bắt buộc đăng nhập lại
    })
    return token;
}

const handleSendMail = async (val) => {

    try {
        await transporter.sendMail(val);

        return 'Done';
    } catch (error) {
        return error
    }
};

//  khi sử dụng asyncHandle thì không cần sử dụng try catch
const verification = asyncHandle(async (req, res) => {
    const { email } = req.body;
    const verificationCode = Math.round(1000 + Math.random() * 9000);

    try {
        const data = {
            from: `AZ_Laundry <duccu1403@gmail.com>`,
            to: email, 
            subject: "Verification email code", 
            text: "Your code to verificayion email", 
            html: `<h1>${verificationCode}</h1>`, 
        }
        await handleSendMail(data);

        res.status(200).json({
            message: 'Send verification code successfully!',
            data: {
                code: verificationCode,
            },
        })
    } catch (error) {
        res.status(401);
        throw new Error('Can not send email!')
    }
});

const register = asyncHandle(async (req, res) => {
    const { email, fullname, password ,name_role} = (req.body);
    // kiểm tra xem email có bị trùng lặp hay không(email đã đăng ký tài khoản)
    const existingUser = await UserModel.findOne({ email }).populate('role_id');
    const defaultRole = await RoleModel.findOne({ name_role: name_role??"user" });
    if(!defaultRole){
        res.status(401)
        throw new Error(`role not found`)
    }
    // nếu có user thì trả ra lỗi
    if (existingUser) {
        res.status(401)
        throw new Error(`User has already exist!!!`)
    }

    // Mã hóa mật khẩu 
    const salt = await bcryp.genSalt(10);

    const hashedPassword = await bcryp.hash(password, salt)

    const newUser = new UserModel({
        fullname: fullname ?? '',
        email,
        password: hashedPassword,
        role_id:defaultRole._id
    })

    // lưu vào database
    await newUser.save()

    const userWithRole = await UserModel.findById(newUser.id).populate('role_id');
    res.status(200).json({
        message: "Register new user successfully",
        data: {
            fullname:userWithRole.fullname,
            email: userWithRole.email,
            id: userWithRole.id,
            role_id:userWithRole.role_id,
            accesstoken: await getJsonWebToken(email, userWithRole.id),
        }
    });
});

const login = asyncHandle(async (req, res) => {
    const { email, password } = req.body
    const defaultRole = await RoleModel.findOne({ name_role: "user" });

    const existingUser = await UserModel.findOne({ email }).populate('role_id');
    if (!existingUser) {
        res.status(403);
        throw new Error('User not found!!!')
    }

    const isMatchPassword = await bcryp.compare(password, existingUser.password);
    if (!isMatchPassword) {
        res.status(401);
        throw new Error('Email or Password is not correct!');
    }

    res.status(200).json({
        message: 'Login successfully',
        data: {
            id: existingUser.id,
            fullname:existingUser.fullname,
            email: existingUser.email,
            role_id:defaultRole,
            accesstoken: await getJsonWebToken(email, existingUser.id),
        },
    })
})

const forgotPassword = asyncHandle(async(req, res) => {
    const {email} = req.body;

    const randomPassword = Math.round(100000 + Math.random() * 99000);
    const data = {
        from: `Mật Khẩu Mới <duccu1403@gmail.com>`, 
        to: email, 
        subject: "Verification email code", 
        text: "Your code to verificayion email", 
        html: `<h1>${randomPassword}</h1>`, 
    }

    // cập nhật mật khẩu mới của người dùng vào tài khoản. Kiểm tra xem trên local có tài
    // khoản hay không bằng UserModel.findOne
    const user = await UserModel.findOne({email})
    if(user) {
        // nếu có user bắt đầu mã hóa lại mật khẩu mà người dùng gửi xuống
        const salt = await bcryp.genSalt(10);

        const hashedPassword = await bcryp.hash(`${randomPassword}`, salt);

        await UserModel.findByIdAndUpdate(user._id, {
            password: hashedPassword,
            isChangePassword: true
        }).then(() => {
            console.log('Xong')
        }).catch((error) => console.log(error));

        await handleSendMail(data).then(() => {
            res.status(200).json({
                message: 'Gửi mật khẩu mới thành công!',
                data: []
            });
        }).catch((error) => {
            res.status(401);
            throw new Error('Không thể gửi mật khẩu mới!')
        });
    } else {
        res.status(401);
        throw new Error('Không tìm thấy tài khoản!');
    }
});


const getUserData = asyncHandle(async (req, res) => {

    try {
        const user = await UserModel.find();
        res.status(200).json({
            message: 'Users retrieved successfully',
            data: user,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
});

const handleLoginWithGoogle = asyncHandle(async(req, res) => {
    const userInfo = req.body;

    const defaultRole = await RoleModel.findOne({ name_role: "user" });

    let user = {...userInfo}
    if(existingUser) {
        await UserModel.findByIdAndUpdate(existingUser.id, {...userInfo, updatedAt: Date.now()})
        console.log('Update done')
        user.accesstoken = await getJsonWebToken(userInfo.email, userInfo.id,)
    } else {
        const newUser = new UserModel({
            fullname: userInfo.name,
            email: userInfo.email,
            role_id:defaultRole._id,
            ...userInfo
        })
        await newUser.save();
        user.accesstoken = await getJsonWebToken(userInfo.email, newUser.id)
    }
    
    res.status(200).json({
        massage: 'Login with google successfully',
        data: {...user, id: existingUser ? existingUser.id : user.id,role_id:defaultRole,fullname:existingUser.fullname}, 
    })

    // Ở đây nó không lấy được id từ mongodb mà nó chỉ lấy được id của tài khoản gg vì vậy mình cần lấy thêm id khi người dùng 
    // đăng nhập bằng gg trong mongodb thành công lúc đó mới đặt hàng được.
})

const createAdminIfNotExists = asyncHandle(async()=>{
    const existingUser = await UserModel.findOne({ email: 'admin@gmail.com' }).populate('role_id');
    const defaultRole = await RoleModel.findOne({ name_role: "admin" });

    if (!defaultRole) {
        console.error('Role not found');
        return;
    }

    // Nếu không có user, tạo user mới
    if (!existingUser) {
        const salt = await bcryp.genSalt(10);
        const hashedPassword = await bcryp.hash('admin123', salt);

        const newAdmin = new UserModel({
            fullname: 'admin',
            email: "admin@gmail.com",
            password: hashedPassword,
            role_id: defaultRole._id
        });

        await newAdmin.save();
        console.log('Tạo thành công admin');
    }
})
module.exports = {
    register,
    login,
    verification,
    forgotPassword,
    getUserData,
    handleLoginWithGoogle,
    createAdminIfNotExists
}