const express = require('express');
const exphbs  = require('express-handlebars');

const AvoShopper = require('./avo-shopper');
const pg = require('pg');
const Pool = pg.Pool;
//const shopper = AvoShopper(pool);


const app = express();
const PORT =  process.env.PORT || 3019;

const connectionString = process.env.DATABASE_URL || 'postgresql://matome:pg123@localhost:5433/avo_shopper';

const pool = new Pool({
    connectionString
});
const avoShopper = AvoShopper(pool);
// enable the req.body object - to allow us to use HTML forms
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable the static folder...
app.use(express.static('public'));

// add more middleware to allow for templating support

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');


app.get('/', async function(req, res) {

	let shops = await avoShopper.listShops();

	res.render('index', {
		shops
	});
});

app.post('/add', async function(req, res) {
	console.log(req.body.deal_name);
	let deals = await avoShopper.createDeal(req.body.deal_name)
	res.render('add',{
		deals
	});
});

app.get('/deals:shop', async function(req, res) {

	res.render('/deals:shop', {
		
	})
})

// start  the server and start listening for HTTP request on the PORT number specified...
app.listen(PORT, function() {
	console.log(`AvoApp started on port ${PORT}`)
});