
const { sql, poolPromise } = require('../config/db');

const getAllProducts = async (req, res) => {
  const upcc = req.params.upcc;
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM products');
    res.status(200).json({ success: true, data: result.recordset });
  } catch (err) {
    console.error('❌ Error fetching products:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const getProductByUPC = async (req, res) => {
  const { upc_code } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('upc_code', sql.VarChar, upc_code)
      .query(`
        SELECT * FROM products 
        WHERE upc_code = @upc_code OR alt_upc_code = @upc_code
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, data: result.recordset });
  } catch (err) {
    console.error('Error fetching product by UPC:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


module.exports = { getAllProducts, getProductByUPC };