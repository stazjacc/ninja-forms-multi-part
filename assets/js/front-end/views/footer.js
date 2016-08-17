define( [], function() {
	var view = Marionette.ItemView.extend( {
		template: "#nf-tmpl-mp-footer",
 		
		initialize: function( options ) {
			this.listenTo( this.collection, 'change:part', this.reRender );
		},

		reRender: function() {
			this.model = this.collection.getElement();
			this.render();
		},

		templateHelpers: function() {
			var that = this;
			return {
				renderNextPrevious: function() {
					var template = _.template( jQuery( '#nf-tmpl-mp-next-previous' ).html() );
					var showNext = false;
					var showPrevious = false;
					var visibleParts = that.collection.where( { visible: true } );
					
					/*
					 * If our collection pointer isn't on the last visible part, show Next navigation.
					 */
					if ( visibleParts.indexOf( that.model ) != visibleParts.length - 1 ) {
						showNext = true;
					}

					/*
					 * If our collection pointer isn't on the first visible part, show Previous navigation.
					 */
					if ( visibleParts.indexOf( that.model ) != 0 ) {
						showPrevious = true;
					}
					
					return template( { showNext: showNext, showPrevious: showPrevious } );
				}
			}
		}

	} );

	return view;
} );