var SSE = {
  dom:{
    form:document.id('track_tweets'),
    list:document.id('tweets'),
    cancel:document.id('cancel')
  },
  count:0,
  source:null,
  /**
   * Initialize the SSE object.
   * Add submit event handler to DOM form that createas a new EventStream
   */
  init:function(){
    this.dom.form.addEvent('submit',this.track.bind(this));
    this.dom.cancel.addEvent('click',this.reset.bind(this));
  },
  /**
   * Form submit event handler.
   * Create a new EventStream that tracks twitter's stream for given keywords
   * @param {DOMEvent} ev - submit DOM event
   */
  track:function(ev){
    ev.preventDefault();
    this.reset();
    var url = this.dom.form.get('action') + '?' + (unescape(this.dom.form.toQueryString()).replace(/,\s/g,','));
    this.dom.form.addClass('loading');
    this.source = new EventSource(url);
    this.source.addEventListener('tweet', function(e) {
      this.addTweet(JSON.parse(e.data));
    }.bind(this), false);
    
    this.source.addEventListener('open', function(e) {
      this.dom.form.removeClass('loading');
    }.bind(this), false);
    
    this.source.addEventListener('close', function(e) {
    }, false);
    
    this.source.addEventListener('error', function(e) {
      if (e.eventPhase == EventSource.CLOSED) {
      // Connection was closed.
      }
    }, false);
  },
  /**
   * Resets the EventStream connection
   */
  reset:function(){
    if(this.source !== null){
      this.source.close();
      this.source = null;
    }
  },
  /**
   * Adds a tweet to the DOM
   * @param {Object} data - tweet data
   */
  addTweet:function(data){
    var html = '<a href="http://twitter.com/#!'+data.user+'" target="_blank">'+data.user+'</a> said: '+ data.tweet;
    var li = new Element('li',{'class':'tweet'}).set('html',html).inject(this.dom.list,'top');
    li.addClass.delay(500,li,['active']);
    this.count += 1;
    if(this.count > 20){
      var last = this.dom.list.getElements('li').getLast();
      last.removeClass('active').dispose.delay(500,last);
    }
  }
}

window.addEvent('domready',function(){
  SSE.init();
});
//window.onload = SSE.init;