const { conn, User, Sale, Product } = require('./db');

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
