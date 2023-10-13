const db = require("../connect");
require("dotenv").config();
const axios = require("axios");

const callback = async (req, res) => {
  console.log("callback is called");
  // Handle the Chapa callback request here
  console.log(req.query);
  const txRef = req.query.trx_ref;
  console.log(txRef);
  const status = req.query.status;
  console.log(status);
  const secret = process.env.CHAPASECRET;
  const endpoint = `https://api.chapa.co/v1/transaction/verify/${txRef}`;
  try {
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${secret}`,
      },
    });
    const { data } = response.data;
    const { transaction_id, amount, status, tx_ref } = data;
    console.log(data);
    const currentdate = new Date();
    const q =
      'INSERT INTO PaymentStatus (user_tracking_id, paid_date, amount_paid, status, tx_ref) VALUES (?, ?, ?, ?, ?)';
    const values = [
      parseInt(data.customization.description),
      currentdate.toISOString(),
      amount,
      status,
      tx_ref,
    ];
    db.query(q, values, (err, results) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(500).json({ error: 'Failed to insert data into the database' });
      } else {
        console.log('Data inserted successfully!');
        return res.status(200).json({ message: 'Data inserted successfully!' });
      }
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: 'Failed to fetch data from the endpoint' });
  }
};



module.exports = {
  callback,
};
