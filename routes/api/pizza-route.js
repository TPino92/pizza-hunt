const router = require('express').Router();
const {
    getAllPizza,
    getPizzaById,
    createPizza,
    updatePizza,
    deletePizza
} = require('../../controllers/pizza-controller');

// set up GET all & POST /api/pizzas
router
    .route('/')
    .get(getAllPizza)
    .post(createPizza);

// set up GET one, PUT and DELETE /api/pizzas/:id
router
    .route('/:id')
    .get(getAllPizza)
    .put(updatePizza)
    .delete(deletePizza);

module.exports = router;
