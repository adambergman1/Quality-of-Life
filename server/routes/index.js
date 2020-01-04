const router = require('express').Router()
const indexController = require('../controller')

/**
 * @route   GET cities
 * @desc    Handles get requests to cities
 * @access  Public
 */
router.get('/cities', indexController.cities)

/**
 * @route   POST cityDetails
 * @desc    Handles post requests to city details
 * @access  Public
 */
router.post('/cityDetails', indexController.cityDetails)

/**
 * @route   POST countries
 * @desc    Handles post requests to countries
 * @access  Public
 */
router.post('/countries', indexController.countries)

module.exports = router
