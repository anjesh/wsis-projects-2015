jQuery(function($) {
    var $el = $('.search-here');
    // Check for config from url query string
    var config = recline.View.parseQueryString(decodeURIComponent(window.location.search));
    // Create our Recline Dataset from sample local data
    var dataset = new recline.Model.Dataset({
        url: '../scrapper/wsis-projects-data.csv',
        backend: 'csv',
        delimiter: ',',
        // quotechar: '"',
        // encoding: 'utf8'
    });
    dataset.fetch().done(function(dataset) {
        
    });

    var template = ' \
        <div class="record"> \
        <b> {{Project}} ,<em> {{Country}}</em> </b> \
        <br>Institution: {{Organisation}}</span> \
        <br>Category: {{Category}} \
        </div> \
        <br> \
    ';

  // #### Set up the search View (using custom template)
    var searchView = new SearchView({
    el: $el,
    model: dataset,
    template: template 
    });
    searchView.render();

    // #### Optional - we configure the initial query a bit and set up facets
    dataset.queryState.set({size: 5}, {silent: true});
    dataset.queryState.addFacet('Country', 10);
    // After this point the Search View will take over handling queries!
    dataset.query();
});


var SearchView = Backbone.View.extend({
    initialize: function(options) {
        this.el = $(this.el);
        _.bindAll(this, 'render');
        this.recordTemplate = options.template;
        // Every time we do a search the recline.Dataset.records Backbone
        // collection will get reset. We want to re-render each time!
        this.model.records.bind('reset', this.render);
        this.templateResults = options.template;
    },

    // overall template for this view
    template: ' \
        <div class="controls"> \
        <div class="query-here"></div> \
        </div> \
        <div class="total"><h2><span></span> projects found</h2></div> \
        <div class="body"> \
        <div class="sidebar"></div> \
        <div class="results"> \
        {{{results}}} \
        </div> \
        </div> \
        <div class="pager-here"></div> \
    ',

    // render the view
    render: function() {
        var results = '';
        if (_.isFunction(this.templateResults)) {
            var results = _.map(this.model.records.toJSON(), this.templateResults).join('\n');
        } else {
        // templateResults is just for one result ...
            var tmpl = '{{#records}}' + this.templateResults + '{{/records}}'; 
            var results = Mustache.render(tmpl, {
            records: this.model.records.toJSON()
            });
        }
        var html = Mustache.render(this.template, {
            results: results
            });
        this.el.html(html);

        // Set the total records found info
        this.el.find('.total span').text(this.model.recordCount);

        // ### Now setup all the extra mini-widgets
        // 
        // Facets, Pager, QueryEditor etc
        var view = new recline.View.FacetViewer({
            model: this.model
            });
        view.render();
        this.el.find('.sidebar').append(view.el);

        var pager = new recline.View.Pager({
            model: this.model
            });
        this.el.find('.pager-here').append(pager.el);

        var queryEditor = new recline.View.QueryEditor({
            model: this.model.queryState
            });
        this.el.find('.query-here').append(queryEditor.el);
    }
});