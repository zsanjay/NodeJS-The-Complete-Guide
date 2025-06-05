const Pool = require('pg').Pool

const pool = new Pool({
    user: 'sanjay',
    host: 'localhost',
    database: 'product',
    password: 'Dubai@6140',
    port: 5432,
});

(async () => {
    await pool.query('SET search_path TO "node-complete";');
})();

module.exports = pool;
