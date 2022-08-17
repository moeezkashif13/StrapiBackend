const slugify = require('slugify');


const {yup,errors} = require('@strapi/utils')



const {ForbiddenError} = errors;



module.exports = {

  

  async beforeUpdate(event) {

    
    if (event.params.data.name) {
        event.params.data.slug = slugify(event.params.data.name, { lower: true });
      }


  },


  async beforeCreate(event) {

    console.log(event);

    const fetchDifferentSlugs = await strapi.db.query('api::category.category').findMany({
      select: ['slug'],
    });

    const differentSlugsInArr = fetchDifferentSlugs.map(eachSlug=>{
      return eachSlug.slug
    });


let schema = yup.mixed().notOneOf([...differentSlugsInArr]);

    const convertTitleToSlug = slugify(event.params.data.name,{lower:true});

const checking = await schema.isValid(convertTitleToSlug);



    if (event.params.data.name && checking) {
      event.params.data.slug = slugify(event.params.data.name, { lower: true });
    }
    else if(!checking) {
      throw new ForbiddenError('You already have a category with same name');

    }


  }
};
