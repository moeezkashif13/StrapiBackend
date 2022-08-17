module.exports = {
    routes: [
      { // Path defined with an URL parameter
        method: 'POST',
        path: '/articles/:id/commentsReleated', 
        handler: 'article.commentsReleated',
      },
      { // Path defined with an URL parameter
        method: 'POST',
        path: '/articles/:id/replytocomment', 
        handler: 'article.replytocomment',
      },
      { // Path defined with an URL parameter
        method: 'POST',
        path: '/articles/:id/getcomments', 
        handler: 'article.getcomments',
      },

      { // Path defined with an URL parameter
        method: 'POST',
        path: '/articles/:id/relatedposts', 
        handler: 'article.relatedposts',
      },

    ]
  }
  