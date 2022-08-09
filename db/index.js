const Sequelize = require('sequelize');
const { STRING, INTEGER } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/the_acme_store_db');

const User = conn.define('user', {
  name: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
});

const Product = conn.define('product', {
  name: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    },
    unique: true
  }
});

const Sale = conn.define('sale', {
  quantity: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  productId: {
    type: INTEGER,
    allowNull: false
  },
  userId: {
    type: INTEGER,
    allowNull: false
  }
});

Sale.belongsTo(User);
Sale.belongsTo(Product);

module.exports = {
  conn,
  Product,
  Sale,
  User
};

