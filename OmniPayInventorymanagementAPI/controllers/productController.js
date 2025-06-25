
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

const getAllCategories = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM CategoryMaster');
    res.status(200).json({ success: true, data: result.recordset });
  } catch (err) {
    console.error('❌ Error fetching categories:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const getActiveSalesTax = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM SalesTax WHERE IsActive = 1');
    res.status(200).json({ success: true, data: result.recordset });
  } catch (err) {
    console.error('❌ Error fetching SalesTax:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const getCreditCardChargeConfig = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('configKey', sql.VarChar, 'CreditCardCharge')
      .query('SELECT TOP 1 * FROM Config WHERE [Key] = @configKey');

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Config not found' });
    }

    res.status(200).json({ success: true, data: result.recordset[0] });
  } catch (err) {
    console.error('❌ Error fetching Config:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

module.exports = { getAllProducts, getProductByUPC , getAllCategories, getActiveSalesTax, getCreditCardChargeConfig};