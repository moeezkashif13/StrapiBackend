const slugify = require('slugify');


const {yup,errors} = require('@strapi/utils')



const {ForbiddenError} = errors;



module.exports = {

  

  async beforeUpdate(event) {

    
    if (event.params.data.title) {
      
      event.params.data.slug = slugify(event.params.data.title, { lower: true });
    }


  },


  async beforeCreate(event) {


    const fetchDifferentSlugs = await strapi.db.query('api::article.article').findMany({
      select: ['slug'],
    });

    const differentSlugsInArr = fetchDifferentSlugs.map(eachSlug=>{
      return eachSlug.slug
    });


let schema = yup.mixed().notOneOf([...differentSlugsInArr]);

    const convertTitleToSlug = slugify(event.params.data.title,{lower:true});

const checking = await schema.isValid(convertTitleToSlug);



    if (event.params.data.title && checking) {
      event.params.data.slug = slugify(event.params.data.title, { lower: true });
    }else if(!checking) {
      
      throw new ForbiddenError('You already have a post with same title');

    }
  },
};
