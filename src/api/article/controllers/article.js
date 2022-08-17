'use strict';

/**
 *  article controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

const clone = require('rfdc')()



module.exports = createCoreController('api::article.article', ({ strapi }) => ({
  // Method 1: Creating an entirely custom action
  async commentsReleated(ctx) {

    try {


      const { Name, Message, Email, CommentCreatedAt, Slug, articleID } = ctx.request.body.data;


      const singleArticle = await strapi.entityService.findMany('api::article.article', {

        filters: {
          $and: [{
            slug: Slug
          }]
        },


        populate: {

          OutsideComments: {

            fields: ['*'],
            sort: 'CommentCreationOrUpdateTime:desc'

          }
        }

        // populate:{

        //   OutsideComments:{
        //     fields:['Message','createdAt']
        //   }
        // }


      })


      // const {title,content,secondtitle,slug,description,articleherosectimage,ArticleHighlightsContainer } = singleArticle;



      const { OutsideComments } = singleArticle[0];



      // console.log(newOutsideComments,'newOutsideComments  newOutsideComments newOutsideComments');


      const updatedOrNewComment = {

        Name,
        Message,
        Email,
        CommentCreationOrUpdateTime: new Date().toLocaleTimeString(),
      }



      const { id } = updatedOrNewComment;

      const eliminatePreviousComment = OutsideComments.findIndex((eachElem, index) => {

        return eachElem.id == id;

      });

      const eliminatingPreviousComment = clone(OutsideComments);


      if (eliminatePreviousComment >= 0) {
        eliminatingPreviousComment.splice(eliminatePreviousComment, 1);
      }


      eliminatingPreviousComment.push(updatedOrNewComment)





      await strapi.entityService.update('api::article.article', articleID, {
        // populate:'*',

        data: {

          OutsideComments: [

            ...eliminatingPreviousComment,

          ]
        },
      });




      ctx.body = {
        temp: singleArticle,
        checking: 'done',
      }


    } catch (err) {

      console.log(err);
      console.log('catchhh ctxx objectt ');

      ctx.body = err;
    }


  },

  async getcomments(ctx) {

    try {


      const { Slug } = ctx.request.body;

      const singleArticle = await strapi.entityService.findMany('api::article.article', {

        filters: {
          $and: [{
            slug: Slug
          }]
        },


        populate: {

          OutsideComments: {

            fields: ['*'],
            populate: 'EachCommentReplies',
            sort: 'CommentCreationOrUpdateTime:desc'

          }
        }

      })




      const { OutsideComments } = singleArticle[0];

      ctx.body = {
        AllComments: OutsideComments,
      }
    } catch (error) {


      ctx.body = error


    }



  },


  async replytocomment(ctx) {
    try {

      const { Email, Message, Name, IDFROMCMS, articleID } = ctx.request.body.data;


      var today = new Date();
      var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date + ' ' + time;

      console.log(dateTime, 'dateTime dateTime');
      // ABHII NEWW COMMENTS ADD HONGE LEKINN AGARR KOII COMMENT UPDATE KARNAA TO USKII ID BHII DENII NEW EACH COMMENT ME UPPRR WALO ME BHII AISAA HI HONAA JO UPPR OUTSIDE COMMENTS HAINN 

      const newEachComment = {
        Name,
        Message,
        Email,
        DateAndTime: dateTime

      };


      const chall = await strapi.entityService.findOne('api::article.article', articleID, {
        populate: {
          OutsideComments: {

            populate: '*',
          }
        }
      });

      const cloned = clone(chall);

      console.log(cloned.OutsideComments, 'urrprrrrr urrprrrrr urrprrrrr');


      cloned.OutsideComments.forEach(eachElem => {


        if (eachElem.id == IDFROMCMS) {


          if (newEachComment.hasOwnProperty('id')) {

            const findIndex = eachElem.EachCommentReplies.findIndex(eachElemCheck => {
              return eachElemCheck.id == newEachComment.id;
            });


            eachElem.EachCommentReplies.splice(findIndex, 1);

            eachElem.EachCommentReplies.push(newEachComment);

          } else {
            eachElem.EachCommentReplies.push(newEachComment);
          }


        };

      });;


      console.log(cloned.OutsideComments[0].EachCommentReplies, 'clonedddd clonedddd clonedddd clonedddd ');


      await strapi.entityService.update('api::article.article', articleID, {
        // populate:'*',

        data: {

          ...cloned,
        },
      }).then(() => {
        ctx.body = {

          DateAndTime: dateTime


        }
      });






    } catch (error) {
      console.log(error);
      ctx.body = {
        error
      }
    }
  },


  async relatedposts(ctx) {
    try {


      const { id: articleID } = ctx.request.body.data



      const first = await strapi.entityService.findOne('api::article.article', articleID)

      const { title, id } = first;

      const splitTitle = title.split(' ');

      const entries = await strapi.entityService.findMany('api::article.article', {

        populate: ['articleherosectimage'],

        filters: {
          title: {
            $containsi: [...splitTitle],
          },

          id: {
            $not: {
              $containsi: id
            }
          }

        }
      })



      if (entries.length == 0) {

        const entries = await strapi.entityService.findMany('api::article.article', {

          populate: ['articleherosectimage'],


        });


        ctx.body = {
          entries
        }

        return;

      }

      ctx.body = {
        entries,
      }


    } catch (error) {
      ctx.body = {
        error
      }
    }
  },






}));
