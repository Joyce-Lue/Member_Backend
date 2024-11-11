const express = require("express");
const session = require("express-session");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Success, Error } = require("./response");

// const bcrypt = require("bcryptjs"); // 加密密碼
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken"); // 生成和驗證
// const dotenv = require("dotenv");
// dotenv.config(); // 加載 .env 文件中的環境變量

//session設定
app.use(
  session({
    secret:
      "iamagooddeveloperofjavascript,iwoilllearnaboutallofthisapplication",
    resave: false,
    saveUninitialized: false,

    cookie: {
      path: "/",
      httpOnly: true,
      secure: false,
      maxAge: 10 * 60 * 1000,
    },
  })
);

// 跨來源資源共享
app.use(
  cors({
    origin: "http://localhost:3000", //允許來源
    methods: ["GET", "POST", "DELETE"],
    credentials: true, //允許帶有憑證的請求
    optionsSuccessStatus: 200, // 使某些舊版本的瀏覽器成功響應
  })
);

app.use(bodyParser.json()); // 解析json資料
app.use(bodyParser.urlencoded({ extended: true }));

// function isAuthenticated(req, res, next) {
//   console.log("Session ID:", req.session.userID); // 查看 session ID
//   if (req.session.userID) {
//     return next();
//   }
//   console.log("未登錄，定向到登入頁面");
//   res.redirect("/login");
// }

// 獲取用戶資料
const getUserData = (req, res, next) => {
  db.query(
    "SELECT * FROM login WHERE userID = ?",
    [req.session.userID],
    (err, results) => {
      if (err) {
        return next(err);
      }
      req.user = results[0];
      next();
    }
  );
};

// 連接資料庫
let db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "member",
  multipleStatements: true,
  // 允許多個SQL語句一次執行
});

db.connect(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("member資料庫連線成功");
  }
});

//註冊
app.post("/register", async function (req, res) {
  var body = req.body;
  // const hashedPassword = await bcrypt.hash(body.password, 10);
  var sql = `INSERT INTO register(userName, email, password) VALUES ( ?, ?, ?);`;
  var data = [body.userName, body.email, body.password];
  console.log("---------我是/register分隔線-----------");
  console.log(sql);
  console.log(data);
  console.log("---------我是/register分隔線-----------");
  db.query(sql, data, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.end(JSON.stringify(new Error("新增失敗:" + error.message)));
    } else {
      res.end(JSON.stringify(new Success("新增成功")));
    }
  });
});

// 登入
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  // console.log(email);
  // console.log(password);

  db.query(
    "SELECT * FROM login WHERE email = ?",
    [email],
    async (error, results) => {
      console.log("測試: error", error);
      console.log("測試: results", results);

      const user = results[0];
      console.log(user);

      // const isMatch = await bcrypt.compare(password, user.password);
      // if (!isMatch) {
      //   return res.status(400).json({ message: "Invalid credentials" });
      // }

      // 生成JWT
      // const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      //   expiresIn: "1h",
      // });
      //原始寫法:
      // res.json({ token });

      res.json(user.userID); // 將JWT發送回前端
    }
  );
});

// 忘記密碼(還沒測試)
// 發送重設密碼的電子郵件
app.post("/api/forgetPassword", (req, res) => {
  const { email } = req.body;

  // 查詢用戶的電子郵件是否存在
  db.query(
    "SELECT * FROM register WHERE email = ?",
    [email],
    (err, results) => {
      if (err) return res.status(500).send("Server error");
      if (results.length === 0) return res.status(404).send("用戶不存在");

      const user = results[0];
      const token = jwt.sign({ userId: user.id }, "your-jwt-secret", {
        expiresIn: "1h",
      });

      // 儲存 token 到資料庫以便後續驗證
      db.query(
        "UPDATE users SET resetToken = ?, resetTokenExpiry = ? WHERE userID = ?",
        [token, Date.now() + 3600000, user.userID], // 設定 token 有效期為 1 小時
        (err) => {
          if (err) return res.status(500).send("Error saving token");

          // 使用 nodemailer 發送重設密碼的郵件
          const transporter = nodemailer.createTransport({
            service: "gmail", // 或者使用其他郵件服務
            auth: {
              user: "irisel_perfume@gmail.com",
              pass: "your-email-password",
            },
          });

          const mailOptions = {
            from: "your-email@gmail.com",
            to: email,
            subject: "重設密碼連結",
            text: `請點擊以下連結來重設您的密碼：\n\nhttp://localhost:3000/reset-password/${token}`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return res.status(500).send("Email sending failed");
            }
            res.send({ message: "重設密碼的郵件已發送！" });
          });
        }
      );
    }
  );
});

// 重設密碼 API（用戶點擊重設連結後）
app.post("/api/reset-password/:token", (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  // 驗證 token
  jwt.verify(token, "your-jwt-secret", (err, decoded) => {
    if (err) return res.status(400).send("無效或過期的連結");

    // 找到對應的用戶
    db.query(
      "SELECT * FROM register WHERE userID = ?",
      [decoded.userId],
      (err, results) => {
        if (err) return res.status(500).send("Server error");
        if (results.length === 0) return res.status(404).send("用戶不存在");

        const user = results[0];

        // 更新用戶的密碼
        const sql = "UPDATE register SET password = ? WHERE userID = ?";
        db.query(sql, [newPassword, user.userID], (err) => {
          if (err) return res.status(500).send("Error updating password");
          res.send({ message: "密碼已成功重設" });
        });
      }
    );
  });
});

// 創建一個 API 路由來獲取my_account資料 http://localhost:8000/api/my_account
app.get("/api/my_account", (req, res) => {
  db.query("SELECT * FROM my_account", (err, results) => {
    if (err) {
      return console.log(err);
    }
    res.json(results);
  });
});

// 獲取 帳戶設定 的account_setting資料
app.get("/api/account_setting", getUserData, (req, res) => {
  db.query("SELECT * FROM account_setting ", (err, results) => {
    if (err) {
      return console.log(err);
    }
    res.json(results);
  });
});

// 更新 帳戶地址member_address資料 M15 router index.js
app.post("/update/my_account", function (req, res) {
  var body = req.body;
  var sql = `UPDATE my_account SET userName = ?, phoneNumber = ?, TelePhone = ?, address1 = ?, address2 = ? WHERE userID = 1`;
  var data = [
    body.userName,
    body.phoneNumber,
    body.TelePhone,
    body.address1,
    body.address2,
    // parseInt(body.userID),
  ];

  db.query(sql, data, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.end(JSON.stringify(new Error("update failed:" + error.message)));
    } else {
      res.end(JSON.stringify(new Success("更新成功!")));
    }
  });
});

// 更新 帳戶設定 的 個人資料
app.post("/update/account_setting", function (req, res) {
  var body = req.body;
  var sql = `UPDATE account_setting SET userName = ?, birthday = ?, gender = ? WHERE userID = 1`;
  var data = [body.userName, body.birthday, body.gender];
  db.query(sql, data, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.end(JSON.stringify(new Error("更新失敗:" + error.message)));
    } else {
      res.end(
        JSON.stringify(new Success("更新成功，請至帳戶設定的個人資料查看!"))
      );
    }
  });
});

// 更新 帳戶設定 的 電子郵件
app.post("/update/account_setting_email", function (req, res) {
  const { currentEmail, email, currentPassword } = req.body;

  // 先查詢用戶的資料，包括 userID、密碼和電子郵件
  const sql = `SELECT userID, password, email FROM account_setting WHERE email = ?`;

  db.query(sql, [currentEmail], function (error, results) {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "查詢失敗：" + error.message });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "電子信箱輸入錯誤!" });
    }

    const { userID, password: storedPassword, email: storedEmail } = results[0];

    // 驗證目前電子郵件和密碼
    if (currentEmail !== storedEmail || currentPassword !== storedPassword) {
      return res.json({
        success: false,
        message: "目前電子郵件或目前密碼不正確",
      });
    }

    // 更新電子郵件
    const updateQuery = `UPDATE account_setting SET email = ? WHERE userID = ?`;
    db.query(updateQuery, [email, userID], function (error, results) {
      if (error) {
        console.log(error);
        res.end(JSON.stringify(new Error("更新失敗:" + error.message)));
      }

      res.end(JSON.stringify(new Success("更新成功!")));
    });
  });
});

// 更新 帳戶設定 的 電話號碼
app.post("/update/account_setting_phonenumber", function (req, res) {
  var body = req.body;
  var sql = `UPDATE account_setting SET phoneNumber = ? WHERE userID = 1`;
  var data = [body.phoneNumber];
  db.query(sql, data, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.end(JSON.stringify(new Error("更新失敗:" + error.message)));
    } else {
      res.end(JSON.stringify(new Success("更新成功")));
    }
  });
});

// 更新 帳戶設定 的 密碼
app.post("/update/account_setting_password", function (req, res) {
  const { email, currentPassword, password } = req.body;

  // 先查詢用戶的資料，包括 userID、密碼和電子郵件
  const userQuery = `SELECT userID, password, email FROM account_setting WHERE email = ?`;

  db.query(userQuery, [email], function (error, results) {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "查詢失敗：" + error.message });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "目前電子信箱輸入錯誤!" });
    }

    const { userID, password: storedPassword, email: storedEmail } = results[0];

    // 驗證目前電子郵件和密碼
    if (email !== storedEmail || currentPassword !== storedPassword) {
      return res
        .status(401)
        .json({ success: false, message: "目前電子郵件或目前密碼不正確" });
    }

    // 更新密碼
    const updateQuery = `UPDATE account_setting SET password = ? WHERE userID = ?`;
    db.query(updateQuery, [password, userID], function (error, results) {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .json({ success: false, message: "更新失敗：" + error.message });
      }

      return res.json({ success: true, message: "更新成功" });
    });
  });
});

// 獲取 訂單 的orders_log資料
app.get("/api/orders_log", getUserData, (req, res) => {
  db.query("SELECT * FROM orders_log", (err, results) => {
    if (err) {
      return console.log(err);
    }
    res.json(results);
  });
});

// 獲取 收藏 的collection資料
app.get("/api/collection", getUserData, (req, res) => {
  db.query("SELECT * FROM collection", (err, results) => {
    if (err) {
      return console.log(err);
    }
    res.json(results);
  });
});

// 加入購物車(用完還沒測試)
app.post("/api/collection/addCart", (req, res) => {
  const body = req.body;
  const sql = `INSERT INTO cart(productID, productName, capacity, unitPrice, img_url) VALUES (?, ?, ?, ?, ?)`;
  const data = [
    body.productID,
    body.productName,
    body.capacity,
    body.unitPrice,
    body.img_url,
  ];
  db.query(sql, data, (err, results) => {
    if (err) {
      console.log(err);
      return res.json({
        success: false,
        message: "加入購物車失敗：" + err.message,
      });
    }
    res.json({ success: true, message: "成功加入購物車" });
  });
});

// 加入收藏(用完還沒測試)
app.post("/api/collection/add", (req, res) => {
  const body = req.body;
  const sql = `INSERT INTO collection (productID, productName, capacity, unitPrice, img_url) VALUES (?, ?, ?, ?, ?)`;
  const data = [
    body.productID,
    body.productName,
    body.capacity,
    body.unitPrice,
    body.img_url,
  ];
  db.query(sql, data, (err, results) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "加入收藏失敗：" + err.message });
    }
    res.json({ success: true, message: "成功加入收藏" });
  });
});

// 取消收藏 http://localhost:8000/api/collection/delete
app.delete("/api/collection/delete", function (req, res) {
  var body = req.body;
  var sql = `DELETE FROM collection WHERE collectID = ?  AND userID = ?`;
  var data = [parseInt(body.collectID), parseInt(body.userID)];
  db.query(sql, data, function (results, fields) {
    //使用affectedRows，判斷是否有被刪除
    if (results) {
      res.end(JSON.stringify(new Success("刪除成功")));
    } else {
      res.end(JSON.stringify(new Error("刪除失敗")));
    }
  });
});

// ======================================================================================

// 啟動伺服器
app.listen(8000, () => {
  console.log("呼嚕" + new Date().toLocaleTimeString());
});
