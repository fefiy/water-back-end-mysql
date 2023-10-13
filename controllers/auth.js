const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../connect");


const register = (req, res) => {
  const role_id = req.body.role_id;
  console.log(role_id);

  if (role_id == 2) {
    console.log("admin is calleded");
    const q = "SELECT * FROM admin WHERE username = ?";
    db.query(q, [req.body.username], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length) return res.status(409).json("Admin already exists!");
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);

      const q =
        "INSERT INTO admin (`name`,`email`,`password`,`username`, `phone`) VALUE (?)";

      const values = [
        req.body.name,
        req.body.email,
        hashedPassword,
        req.body.username,
        req.body.phone,
      ];
      console.log("it is admin");
      console.log(values);

      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("User has been created.");
      });
    });
  }
  if (role_id == 1) {
    // user creation
    console.log("it is user");
    const q = "SELECT * FROM users WHERE mac_address = ?";
    db.query(q, [req.body.mac], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length) return res.status(409).json("User already exists!");
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);

      const q =
        "INSERT INTO users (`first_name`, `last_name`,`email`,`password`, `mac_address`,`phone`, `address`, `region`, `zone` ) VALUE (?)";

      const values = [
        req.body.first_name,
        req.body.last_name,
        req.body.email,
        hashedPassword,
        req.body.mac,
        req.body.phone,
        req.body.wereda,
        req.body.region,
        req.body.zone,
      ];
      console.log(values);

      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
         console.log(data)
        const qw =  "INSERT INTO waterusage (`user_id`, `amount`,`date` ) VALUE (?)"; 
          const val = [
            data. insertId,
            0,
            Date.now()
          ]
          db.query(qw, [val], (err, data)=>{
        if (err) return res.status(500).json(err);
             return res.status(200).json("User has been created.");
          })
      });
    });
  }
};

const login = (req, res) => {
  const { mac, password } = req.body;

  const userQuery = "SELECT * FROM users WHERE mac_address = ?";
  const adminQuery = "SELECT * FROM admin WHERE username = ?";

  // Check user credentials
  db.query(userQuery, [mac], (err, userResults) => {
    console.log("user credential is callded")
    if (err) return res.status(500).json(err);
    if (userResults.length > 0) {
      const user = userResults[0];
      const passwordMatch = bcrypt.compareSync(password, user.password);
      console.log(user)
      if (passwordMatch) {
        const token = jwt.sign(
          { id: user.id },
          "your_secret_key"
          // , {
          //   // expiresIn: "24h",
          // }
        );

        const { password, ...others } = user;
        others.role = "user";
        console.log(others)
        res.cookie("accessToken", token, {
          httpOnly: true,
        });
        return res.status(200).json(others);
      }
    }
    // Check admin credentials
    db.query(adminQuery, [mac], (err, adminResults) => {
      if (err) return res.status(500).json(err);

      if (adminResults.length > 0) {
        const admin = adminResults[0];
        const passwordMatch = bcrypt.compareSync(password, admin.password);

        if (passwordMatch) {
          const token = jwt.sign(
            { id: admin.id },
            "your_secret_key"
            // , {
            //   // expiresIn: "24h",
            // }
          );

          const { password, ...others } = admin;
          others.role = "admin";

          res.cookie("accessToken", token, {
            httpOnly: true,
          });
          return res.status(200).json(others);
        }
      }
      // Invalid credentials
      return res.status(401).json("Invalid credentials");
    });
  });
};

const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("User has been logged out.");
};

const accessToken = (req, res) => {
  console.log(" aceess token iw=s working");
  const token = req.cookies.accessToken;
  console.log("token", token)
  if (!token) {
    res.json({ isTrue: false });
  } else {
    res.json({ isTrue: true });
  }
  //   res.json(req.cookie.accessToken)
};




module.exports = {
  register,
  login,
  logout,
  accessToken,

};
const logiin = (req, res) => {
  console.log("is working");

  const q = "SELECT * FROM users WHERE mac_address = ?";

  db.query(q, [req.body.mac], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!checkPassword)
      return res.status(400).json("Wrong password or username!");

    const token = jwt.sign({ id: data[0].id }, "secretkey");

    const { password, ...others } = data[0];

    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
};
