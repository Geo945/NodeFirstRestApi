const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//for the token check:
const checkAuth = require('../middleware/check-auth');


//for storing images:
const multer = require('multer');
const storage = multer.diskStorage({
   //configurations
   destination: function(req, file, cb){
       //all the function params are passed automatically by multer
       cb(null, './uploads');//1 arg- potention error(null because we don't have)
       //2 arg- the path were to store the file
   },
   filename: function(req, file, cb){
       cb(null, Math.random() + file.originalname);//2 arg - the name of the file
   }
});
//filter to only accept jpeg and png files
const fileFilter = (req, file , cb) => {
    if ( file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        //accept file
        cb(null, true);
    }else {
        //reject a file
        cb(new Error('Invalid file'), false);//instead of null we can put an error
    }
};
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },//limits - limit file size to 5 MB(1024 * 1024 = 1 MB)
    fileFilter: fileFilter
});//this will initialize it
//storage specifies a folder where multer will try to store all the files




const Product = require('../models/product');

const ProductsController = require('../controllers/productsController');

// /products/
router.get('/', ProductsController.products_get_all);


//in fata unui main handler (req, res, next) mai putem pune handleri
//am pus un handler pt a uploada o imagine
//single means that we will only get one file
//upload.single('field_name_who_will_have_the_file')
router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product);

router.get('/:productId', ProductsController.products_get_product);

router.patch('/:productId', checkAuth, ProductsController.products_update_product);

router.delete('/:productId', checkAuth, ProductsController.products_delete_product);

module.exports = router;