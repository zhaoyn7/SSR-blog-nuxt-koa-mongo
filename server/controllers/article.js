const articleModel = require('../models/article')
const categoryController = require('./category')
const getTimeObj = require('../utils/getTimeObj')

module.exports = {
  // 获取client文章列表
  async getArticles (ctx) {
    // 判断管理员是否登录，如已登陆则返回所有文章，否则仅返回公开文章
    condition = 
      ctx.session.user 
      ? {} 
      : {
        isPublic: true,
        isPublished: true,
      }
    let {pageNum, pageSize, isAdmin} = ctx.query
    pageNum = pageNum ? parseInt(pageNum) : 1
    pageSize = parseInt(pageSize)
    let totalArticleCount = await articleModel.countDocuments(condition)
    let getArticleList = articleModel.find(
      condition, {}, 
      {
        sort: {createTime: -1}, 
        skip: (pageNum - 1) * pageSize,
        limit: pageSize,
      }
    )
    let articleList = 
      isAdmin
      ? await getArticleList.populate('category')
      : await getArticleList
    ctx.response.body = {
      articleList, 
      totalArticleCount 
    }
  },

  // 获取前台主页文章热门列表
  async getPopularArticles (ctx, next) {
    let {pageNum, pageSize} = ctx.query
    pageNum = pageNum ? parseInt(pageNum) : 1
    pageSize = parseInt(pageSize)
    let popularList = await articleModel.find(
      {}, 
      {}, 
      {
        sort: {views: -1}, 
        limit: pageSize
      }
    )
    ctx.body = { popularList }
  },

  // 获取前台单篇文章内容
  async getOneArticle (ctx, next) {
    let id = ctx.params.id
    let getOne = articleModel.findOne({_id: id}, null)
    let addViewsNumber = articleModel.updateOne({_id: id}, {$inc: {views: 1}})
    let [article] = await Promise.all([getOne.populate('category'), addViewsNumber])
    ctx.body = {
      article
    }
  },

  async getTagArticles (ctx, next) {
    let tag = ctx.params.tag
    let list = await articleModel.find({tags:tag}, '-content -comments', {sort: {createTime: -1}})
    ctx.body = {
      list
    }
  },

  // 发布文章（保存至数据库）
  async saveArticle (ctx, next) {
    let createTime = getTimeObj()
    let {title, author, tags, category, isOriginal, isPublic, content, abstract,isPublished} = ctx.request.body
    let newDoc = new articleModel({
      title,
      author,
      content,
      abstract,
      createTime,
      updateTime: {},
      tags,
      category,
      isPublic,
      isOriginal,
      isPublished
    })
    let articleDoc = await newDoc.save()
    let result = await categoryController.saveToCategory(articleDoc.category, articleDoc._id)
    if(!result.nModified)
      throw new Error('文章类型未成功保存至数据库！')
    ctx.body = {
      message: articleDoc.isPublished ? '文章发表成功！' : '文章草稿保存成功！'
    }
  },

  // 修改文章方法
  async updateArticle (ctx, next) {
    let {id, content, category} = ctx.request.body
    let getUpdateResult = articleModel.updateOne({_id: id}, {$set: {content:content, category:category}})
    let getSaveCateResult = categoryController.saveToCategory(category, id)
    let [updateResult, saveCateResult] = await Promise.all([getUpdateResult, getSaveCateResult])
    if(!updateResult.nModified)
      throw new Error('文章修改未成功保存至数据库')
    if(!saveCateResult.nModified)
      throw new Error('文章类型未成功保存至数据库')
    ctx.body = {
      message:'修改成功！'
    }
  },

  // 删除文章方法
  async deleteArticle (ctx, next) {
    let id = ctx.params.id
    await articleModel.deleteOne({_id: id})
    ctx.body = {
      message:'删除成功！'
    }
  },

  async likeArticle (ctx, next) {
    let {id} = ctx.params
    let result = await articleModel.updateOne({_id: id}, { $inc: {likes: 1} })
    if (result.nModified !== 0) 
      ctx.response.body = {
        success: true,
      }
    else
      ctx.response.body = {
        success: false,
      }
  },
  
  async dislikeArticle (ctx, next) {
    let {id} = ctx.params
    let result = await articleModel.updateOne({_id: id}, { $inc: {likes: -1} })
    if (result.nModified !== 0) 
      ctx.response.body = {
        success: true,
      }
    else
      ctx.response.body = {
        success: false,
      }
    }
}