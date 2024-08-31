const UserAuth = require('./middlewares/auth')

const ProductService = require('../services/product-service')
const CustomerService = require('../services/customer-service')

module.exports = (app) => {
    const service = new ProductService()
    const customerService = new CustomerService()


    //Create Products
    app.post('/product/create', async(req, res, next) => {
            try {
                const { name, desc, banner, type, unit, price, available, supplier } = req.body
                const { data } = await service.CreateProduct({ name, desc, banner, type, unit, price, available, supplier })
                return res.json(data)
            } catch (error) {
                next(error)
            }
        })
        //Get All product By Ids
    app.get('/category/:type', async(req, res, next) => {
        try {
            const { data } = await service.ProductByType(req.params.type)
            return res.json(data)
        } catch (error) {
            next(error)
        }
    })

    //Get All Products
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

    //Add a Item to wishlist
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

    //Remove a Item to wishlist
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

    //Added a item to cart
    app.put('/cart', UserAuth, async(req, res) => {
        try {
            const { _id, qty } = req.body
            const userId = req.user._id
                // console.log(userId)
            const product = await service.GetProductById(_id)
            const userCurrentData = await customerService.addToCart(userId, product, 1)
            return res.status(200).json({ "Cart Updated": userCurrentData })
        } catch (error) {
            next(error)
        }
    })

    // app.put('/cart', UserAuth, async(req, res) => {
    //     try {
    //         const { _id, qty } = req.body
    //         const userId = req.user._id
    //             // console.log(userId)
    //         const product = await service.GetProductById(_id)
    //         const userCurrentData = await customerService.addToCart(userId, product, 1)
    //         return res.status(200).json({ "Cart Updated": userCurrentData })
    //     } catch (error) {
    //         next(error)
    //     }
    // })

    //Delete item from cart
    app.delete('/cart/:id', UserAuth, async(req, res) => {
        try {
            // console.log(req.user)
            const product = await service.GetProductById(req.params.id)
            if (product) {
                const userData = await customerService.deleteToCart(req.user._id, product.data._id)
                return res.status(200).json(userData)
            } else {
                return res.status(400).json({ "Data": "Not Found" })
            }
            // console.log(product.data._id)
            // return res.status(200).json({ "Hello": "Done" })

        } catch (error) {
            next(error)
        }
    })

}