const db = require("../connect");
const jwt = require("jsonwebtoken");

const softDeleteRecord = (req, res) => {
    console.log("user deleting is callded")
    const token = req.cookies.accessToken;
    console.log(token)
    if (!token) return res.status(401).json("Not logged in!");
  
    jwt.verify(token, "your_secret_key", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
  
      const userId = req.params.id;
      console.log(userId)
      const isDeleted = 1;
      const deletedAt = Date.now();
  
      const q = "UPDATE users SET is_deleted = ?, deleted_at = ? WHERE id = ?";
  
      db.query(q, [isDeleted, deletedAt, userId], (err, data) => {
        if (err) return res.status(500).json(err);
  
        if (data.affectedRows > 0) {
          return res.status(200).json("User successfully deleted");
        } else {
          return res.status(404).json("User not found");
        }
      });
    });
  };
  

const getAllusersinfo = (req, res) => {
  console.log("user info is working");
  const q = "SELECT * FROM users WHERE is_deleted = 0";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

const singleUser = (req, res)=>{
   //lets check if they are soft deleted 
   const id  = req.params.id
   const q = `SELECT w.*,u.first_name, p.status, p.amount_paid, u.last_name, u.email FROM usertracking as w JOIN users as u ON(w.user_id = u.id)   LEFT JOIN paymentstatus as p ON(p.user_tracking_id = w.id) WHERE w.user_id = ${id}` 
   db.query(q, (err, data)=>{
    if(err) return res.status(500).json(err)
    return res.status(200).json(data)
   })
}

const getUserUpdatedata = (req, res)=>{
 const id = req.params.id
 const q = `SELECT * FROM users WHERE id = ${id} `

 db.query(q, (err, data)=>{
  if(err) return res.status(500).josn(err)
  return res.status(200).json(data[0])
 })
}
// water usage total to show how much eskezare kefeele price


const updateUser = (req, res) => {
  console.log("updateUser is called");
  const id = req.body.id;
  console.log(id);
  console.log(req.body);
  const { first_name, last_name, email, phone, mac, region, zone, wereda } = req.body;
  const q = `UPDATE users SET 
    first_name = '${first_name}',
    last_name = '${last_name}',
    phone = '${phone}',
    mac_address = '${mac}',
    email = '${email}',
    region = '${region}',
    zone = '${zone}',
    address = '${wereda}'
    WHERE id = ${id}`;
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("User updated successfully");
  });
};





module.exports = {
  softDeleteRecord,
  getAllusersinfo,
  singleUser,
  getUserUpdatedata,
  updateUser
};
