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


const start = async()=> {
  try {
    await conn.sync({ force: true });
    const [ moe, lucy, larry, ethyl, foo, bar, bazz, quq] = await Promise.all([
      User.create({ name: 'moe' }),
      User.create({ name: 'lucy' }),
      User.create({ name: 'larry' }),
      User.create({ name: 'ethyl' }),
      Product.create({ name: 'foo' }),
      Product.create({ name: 'bar' }),
      Product.create({ name: 'bazz' }),
      Product.create({ name: 'quq' }),
    ]);

    await Promise.all([
      Sale.create({ productId: foo.id, userId: moe.id }),
      Sale.create({ productId: foo.id, userId: moe.id, quantity: 7 }),
      Sale.create({ productId: bar.id, userId: lucy.id, quantity: 7 }),
      Sale.create({ productId: bazz.id, userId: lucy.id })
    ]);
  }
  catch(ex){
    console.log(ex);
  }
};

start();
