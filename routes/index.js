var express = require('express');
var router = express.Router();
const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;
const stripe = require("stripe")(keySecret);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* payment route */
router.post("/charge", function(req, res) {
  const user = {
    email: req.body.email,
    card: req.body.card
  }
  stripe.customers.create({
    email: user.email,
    card: user.card
  }).then((customer) => {
    return stripe.charges.create({
      amount: 120,
      description: "Sample charge",
      currency: "cad",
      customer: customer.id
    }).then(charge => res.send(charge))
    .catch(err => {
      console.log("Error:", err);
      res.status(500).send({message: "Purchase failed"});
    })
  });
});

module.exports = router;
