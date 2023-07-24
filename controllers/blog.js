const ErrorHandler = require('../utils/ErrorHandler');
const { Model } = require('objection');
const { Op } = require('objection');
const Blog = require('../models/blog');

exports.createBlog = async (ctx, next) => {
  try {

    const { title, summary, content } = ctx.request.body;

    // Validation

    if (!title || !summary || !content) {

      return next(ErrorHandler(ctx, { status: 400, message: 'Please fill in all the required fields.' }));
    }

    const newBlog = await Blog.query().insert({
      author_id: ctx.user.id,
      title,
      content,
      summary,
      published: true
    })

    ctx.status = 200;
    ctx.body = newBlog;

  } catch (error) {
    console.log(`Error❤️‍🔥: ${error}`);
    return next(ErrorHandler(ctx, { status: 400, message: 'Failed to add a new Blog😞' }))
  }
}

exports.updateBlog = async (ctx, next) => {

  try {

    const { blogId } = ctx.params;
    console.log('Check blog id:', blogId);
    const { title, summary, content, published } = ctx.request.body;


    // Check if blog exists 
    const blog = await Blog.query().findOne({ author_id: ctx.user.id });

    if (!blog) {
      return next(ErrorHandler(ctx, { status: 404, message: 'No blog found for this user😞' }))
    }
    const updatedBlog = await Blog.query().patchAndFetchById(blogId, {
      title: title || blog.title,
      summary: summary || blog.summary,
      content: content || blog.content,
      published: published || blog.published
    });

    ctx.status = 200;
    ctx.body = updatedBlog;

  } catch (error) {
    console.log(`Error❤️‍🔥: ${error}`);
    return next(ErrorHandler(ctx, { status: 400, message: 'Failed to update a Blog😞' }))
  }
}

exports.deleteBlog = async (ctx, next) => {

  try {

    const { blogId } = ctx.params;

    // Check if blog exists 
    const blog = await Blog.query().findOne({ author_id: ctx.user.id });

    if (!blog) {
      return next(ErrorHandler(ctx, { status: 404, message: 'No blog found for this user😞' }))
    }

    await Blog.query().deleteById(blogId);
    ctx.status = 200;
    ctx.body = { message: 'Blog Deleted Successfully' }

  } catch (error) {
    console.log(`Error❤️‍🔥: ${error}`);
    return next(ErrorHandler(ctx, { status: 400, message: 'Failed to delete the Blog😞' }))
  }
}

exports.getAllPublishedBlogs = async (ctx, next) => {

  try {

    const blogs = await Blog.query().where('published', true);

    if (!blogs) {
      return next(ErrorHandler(ctx, { status: 404, message: 'Published blogs not found😞' }))
    }

    ctx.status = 200;
    ctx.body = blogs;


  } catch (error) {

    console.log(`Error❤️‍🔥: ${error}`);
    return next(ErrorHandler(ctx, { status: 400, message: 'Failed to get all published blogs😞' }))
  }

}

exports.getAllUserBlogs = async (ctx, next) => {

  try {

    const blogs = await Blog.query().where('author_id', ctx.user.id);

    if (!blogs) {
      return next(ErrorHandler(ctx, { status: 404, message: 'User blogs not found😞' }))
    }

    ctx.status = 200;
    ctx.body = blogs;


  } catch (error) {

    console.log(`Error❤️‍🔥: ${error}`);
    return next(ErrorHandler(ctx, { status: 400, message: 'Failed to get all user blogs😞' }))
  }

}
exports.getBlogWithID = async (ctx, next) => {


}



