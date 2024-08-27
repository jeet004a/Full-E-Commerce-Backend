const UserAuth = require('./middlewares/auth')

const ProductService = require('../services/product-service')
const CustomerService = require('../services/customer-service')

module.exports = (app) => {
    const service = new ProductService()
    const customerService = new CustomerService()

    app.post('/product/create', async(req, res, next) => {
        try {
            const { name, desc, banner, type, unit, price, available, supplier } = req.body
            const { data } = await service.CreateProduct({ name, desc, banner, type, unit, price, available, supplier })
            return res.json(data)
        } catch (error) {
            next(error)
        }
    })

    app.get('/category/:type', async(req, res, next) => {
        try {
            const { data } = await service.ProductByType(req.params.type)
            return res.json(data)
        } catch (error) {
            next(error)
        }
    })


    app.get('/', async(req, res, next) => {
        try {
            // const { data } = await service.GetProducts()
            const data = await service.GetProducts()
            return res.json(data)
        } catch (error) {
            next(error)
        }
    })


    app.get('/:id', async(req, res, next) => {
        try {
            const { data } = await service.GetProductDescription(req.params.id)
            return res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    });

    app.put('/wishlist', UserAuth, async(req, res, next) => {
        try {
            const { _id } = req.user
            const product = await service.GetProductById(req.body._id)
            const wishlist = await customerService.AddToWishList(_id, product)
                // await customerService.AddToWishList(_id, product)
            return res.status(200).json(wishlist)
                // return res.status(200).json({ "wishlist": "ABC" });
        } catch (error) {
            next(error)
        }
    })


    app.delete('/wishlist/:id', UserAuth, async(req, res, next) => {
        try {
            const { _id } = req.user
            const productId = req.params.id;
            const product = await service.GetProductById(productId);
            // const wishlist = await customerService.AddToWishlist(_id, product)
            const data = await customerService.deleteToWishList(_id, product)
                // console.log(product)
                // return res.status(200).json(wishlist);

            return res.status(200).json(data);
        } catch (err) {
            next(err)
        }
    });

}