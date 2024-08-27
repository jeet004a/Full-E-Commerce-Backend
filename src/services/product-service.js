const { ProductRepository } = require('../database')
const { FormateData } = require('../utils')

class ProductService {
    constructor() {
        this.repository = new ProductRepository();
    }

    async CreateProduct(productInputs) {
        try {
            const productResult = await this.repository.CreateProduct(productInputs)
            return FormateData(productResult)
        } catch (error) {
            console.log(error)
        }
    }

    async ProductByType(productInputs) {
        try {
            const result = await this.repository.productByType(productInputs)
            return FormateData(result)
        } catch (error) {
            console.log(error)
        }
    }

    async GetProducts() {
        try {
            const products = await this.repository.Product()
            let categories = {}
            products.map(({ type }) => {
                categories[type] = type
            })

            return FormateData({ products, categories })
        } catch (error) {
            console.log(error)
        }
    }

    async GetProductDescription(productId) {
        try {
            const data = await this.repository.FindById(productId)
            return FormateData(data)
        } catch (error) {
            console.log(error)
        }
    }

    async GetProductById(productId) {
        try {
            const data = await this.repository.FindById(productId)
            return FormateData(data)
        } catch (error) {
            console.log(error)
        }
    }

}


module.exports = ProductService