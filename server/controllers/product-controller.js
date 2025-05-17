const ProductService = require('../services/product-service')

class ProductController {
    async getAll(req, res)  {
        const products = await ProductService.getAll()
        res.json(products)
    }

    async getById(req, res) {
        const product = await ProductService.getById(req.params.id)
        if (!product) return res.status(404).json({ message: 'Not found' })
        res.json(product)
    }

    async create(req, res) {
        console.log(req.files)
        try {
            const created = await ProductService.create(req.body, req.files)
            res.status(201).json(created)
        } catch (err) {
            res.status(400).json({ message: err.message })
        }
    }

    async update(req, res) {
        try {
            const updated = await ProductService.update(req.params.id, req.body)
            if (!updated) return res.status(404).json({ message: 'Not found' })
            res.json(updated)
        } catch (err) {
            res.status(400).json({ message: err.message })
        }
    }

    async delete(req, res) {
        const deleted = await ProductService.remove(req.params.id)
        if (!deleted) return res.status(404).json({ message: 'Not found' })
        res.json({ message: 'Deleted' })
    }

    async addReview(req, res) {
        try {
            const updatedProduct = await ProductService.addReview(req.params.id, req.body, req.user)
            res.status(201).json(updatedProduct)
        } catch (err) {
            res.status(400).json({ message: err.message })
        }
    }
}

module.exports = new ProductController()