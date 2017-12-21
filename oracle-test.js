/**
 * Author: Jessica Wise
 * Creation Date: 12/21/2017
 * Abstract: API and client methods to load articles
 * Usage: Simply load index.html file into browser
 * Started: 11 AM PST
 * Ended: 12 PM PST
 */

// note from the author: I tried to model this on how I would design a REST service, despite this being limited by being focused on vanilla es6 and not node.

class API {
    /**
     * instance a dataservice
     */
    constructor() {
       this.dataService = new DataService
    }
    /**
     * Set interval using fat arrow to preserve "this" context
     * @param {*} interval 
     */
    loadEventLoop(interval) {
       setInterval(() => this.dataService.autoSortAndSave() , interval)
    }
    /**
     * kick off event loop
     */
    load() {
        this.loadEventLoop(600)
    }
    /**
     * The thinking here is you can use this function to simulate a "rest-esque" pattern in your UI.
     * i.e. <a href="#" id='article1' onClick='api.dispatch('trackArticleHit',this.id)>test</a>
     * @param {*} endpoint 
     * @param {*} data 
     */
    dispatch(endpoint, data) {
        if (endpoint === 'trackArticleHit') {this.trackArticleHit(data)}
        if (endpoint === 'getMostPopularArticles') {this.getMostPopularArticles(data)}
    }
    /**
     * Uses data service method to enumerate the article value
     * @param {*} articleId 
     */
    trackArticleHit(articleId) {
        this.dataService.recordHit(articleId)
    }
    /**
     * Using the database, return top 5
     */
    getMostPopularArticles() {
        return this.dataService.articles.slice(0,5)
    }
}

/**
 * In order to better model what an actual REST service would look like,
 * I have written the code in such a way that you are able to decouple the 
 * 'logic' for the data from the hooks provided in the API.
 */
class DataService {
    constructor() {
        this.articles = this.loadSave()
        this.save = false
    }
    /**
     * If data was present in localstore, it would be loaded from there
     */
    loadSave() {
        var resp = []
        var source = localStorage.getItem('articles') !== null ? localStorage.getItem('articles') : articleData
        source.forEach(function(obj) {
            var article = new articleDataStructure(obj.articleId, obj.title, obj.body, obj.hits)
            resp.push(article)
        }, this)
        return resp
    }
    /**
     * Sorts articles using a custom sort function.
     * If save is enabled, writes to local storage
     */
    autoSortAndSave() {
        console.log('sorting')
        this.articles = this.articles.sort(function(a, b) {
            if (a.hits < b.hits) {return -1}
            else if (a.hits > b.hits ) {return 1}
            else {return 0}
        })
        if (this.save) {
            localStorage.setItem('articles', this.articles)
        }
    }
    /**
     * By using a fatarrow plus a map, we both reduce write times and reduce 
     * code complexity
     * @param {*} articleId 
     */
    recordHit(articleId) {
        this.articles = this.articles.map(x => {
            if (x.articleId === articleId) {
                x.hit += 1
            }
        })
    }       
}

/**
 * Data structure for article
 * @param {*} articleId 
 * @param {*} title 
 * @param {*} body 
 * @param {*} hits 
 */
function articleDataStructure(articleId, title, body, hits) {
        this.articleId = articleId
        this.title = title
        this.body = body
        this.hits = hits
}

var articleData=[{'articleId':'article1','title':'article title','body':'article body','hits':0},{'articleId':'article2','title':'article title','body':'article body','hits':0},{'articleId':'article3','title':'article title','body':'article body','hits':0},{'articleId':'article4','title':'article title','body':'article body','hits':0},{'articleId':'article5','title':'article title','body':'article body','hits':0},{'articleId':'article6','title':'article title','body':'article body','hits':0},{'articleId':'article7','title':'article title','body':'article body','hits':0},{'articleId':'article8','title':'article title','body':'article body','hits':0}]

var api = new API
api.load()

