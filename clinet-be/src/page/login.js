const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../model/userBE");
const { Admin } = require("../model/adminBE");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Thiếu thông tin đăng nhập" });

    let role = null;
    let account = await User.findOne({ username });

    if (account) {
      role = "user";
    } else {
      account = await Admin.findOne({ username });
      if (!account)
        return res.status(404).json({ message: "Không tìm thấy tài khoản" });
      role = "admin";
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch)
      return res.status(401).json({ message: "Sai mật khẩu" });

    const token = jwt.sign(
      { userId: account._id, role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      role,
      userId: account._id,
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = { login };
