'use strict';

/**
 * new-homepage service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::new-homepage.new-homepage');
