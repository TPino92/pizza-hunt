const { Pizza } = require('../models');
const { db } = require('../models/Pizza');

const pizzaController = {
    // get all Pizzas
    getAllPizza(req, res) {
        Pizza.find({})
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // get one Pizza
    getPizzaById({ params }, res) {
        Pizza.findOne ({_id: params.id })
            .then(dbPizzaData => {
                // if none found 404
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No Pizza found with this id' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // create Pizza
    createPizza({ body }, res) {
        Pizza.create(body)
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => res.status(400).json(err));
    },

    // update Pizza 
    updatePizza({ params, body }, res){
        Pizza.findOneAndUpdate({ _id:params.id}, body, {new: true})
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(400).json({ message: 'No Pizza found with this id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.status(400).json(err));
    },

    // Delete Pizza 
    deletePizza({ params }, res) {
        Pizza.findOneAndDelete({ _id: params.id })
            .then(dbPizzaData => {
                if(!dbPizzaData){
                    res.status(404).json({ message: 'No Pizza found with this Id!' });
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.status(400).json(err));
    }
}


module.exports = pizzaController;