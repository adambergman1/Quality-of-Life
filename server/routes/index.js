const router = require('express').Router()
const indexController = require('../controller')

/**
 * @route   GET index
 * @desc    Handles get requests
 * @access  Public
 */
router.get('/', indexController.index)

/**
 * @route   POST index
 * @desc    Handles post requests
 * @access  Public
 */
router.post('/', indexController.post)

module.exports = router