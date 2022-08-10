const express = require('express');
const { conn, User, Sale, Product } = require('./db');
const app = express();

app.use(express.urlencoded({ extended: false }));

app.use((req, res, next)=> {
  if(req.query.method){
    req.method = req.query.method;
  }
  next();
});


app.use('/assets', express.static('assets'));


app.delete('/sales/:id', async(req, res, next)=> {
  try {
    const sale = await Sale.findByPk(req.params.id);
    await sale.destroy();
    res.redirect('/');
  }
  catch(ex){
    next(ex);
  }
});

app.post('/sales', async(req, res, next)=> {
  try {
    await Sale.create(req.body);
    res.redirect('/');
  }
  catch(ex){
    next(ex);
  }
});

app.get('/', async(req, res, next)=> {
  try {
    const sales = await Sale.findAll({
      include: [ Product, User ]
    });
    const [ products, users ] = await Promise.all([
      Product.findAll(),
      User.findAll()
    ]);

    res.send(`
      <html>
        <head>
          <title>The Acme Store</title>
          <link rel='stylesheet' href='/assets/style.css' />
        </head>
        <body>
          <h1>The Acme Store</h1>
          <main>
            <ul>
              ${
                sales.map( sale => {
                  return `
                    <li>
                      ${sale.user.name}  bought ${sale.quantity} ${ sale.product.name } on ${ new Date(sale.createdAt).toLocaleString()}
                      <a href='/sales/${sale.id}?method=delete'>x</a>
                    </li>
                  `;
                }).join('')
              }
            </ul>
            <form method='POST' action='/sales'>
              <select name='userId'>
                ${ users.map( user => {
                  return `
                    <option value='${user.id}'>${ user.name }</option>
                  `;
                }).join('') }
              </select>
              <select name='productId'>
                ${ products.map( product => {
                  return `
                    <option value='${product.id}'>
                      ${ product.name }
                    </option>
                  `;
                }).join('') }
              </select>
              <input placeholder='quantity' name='quantity' />
              <button>Create</button>
            </form>
          </main>
        </body>
      </html>
    `);
  }
  catch(ex){
    next(ex);
  }
});

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
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));
  }
  catch(ex){
    console.log(ex);
  }
};

start();
