define( [ 'models/partModel' ], function( PartModel ) {
	var collection = Backbone.Collection.extend( {
		model: PartModel,
		currentElement: false,
		comparator: 'order',

		initialize: function( models, options ){
			models = models || [];

			this.on( 'remove', this.afterRemove );
			this.on( 'add', this.afterAdd );

			this.maybeChangeBuilderClass( models.length );
		},

		afterRemove: function( model, collection, options ) {
			this.changeCurrentPart( model, collection, options );
			this.maybeChangeBuilderClass( model, collection, options );
			/*
			 * If our drawer is open, close it.
			 */
			nfRadio.channel( 'app' ).request( 'close:drawer' );	
		},

		afterAdd: function( model ) {
			this.moveToEnd( model );
			this.maybeChangeBuilderClass( model );
			this.openDrawer( model );
			this.setElement( model );
		},

		moveToEnd: function( model ) {
			model.set( 'order', this.length - 1 );
		},

		maybeChangeBuilderClass: function( count, collection, options ) {
			if ( true === count instanceof Backbone.Model ) {
				count = this.length;
			}

			this.changeBuilderClass( 1 < count );
		},
		
		openDrawer: function( model ) {
			var settingGroupCollection = nfRadio.channel( 'mp' ).request( 'get:settingGroupCollection' );
			nfRadio.channel( 'app' ).request( 'open:drawer', 'editSettings', { model: model, groupCollection: settingGroupCollection } );
		
			/*
			 * When the drawer opens, focus the input box.
			 */
			nfRadio.channel( 'drawer' ).on( 'opened', this.focusTitle );
		},

		focusTitle: function() {
			var drawerEl = nfRadio.channel( 'app' ).request( 'get:drawerEl' );
			jQuery( drawerEl ).find( '#title' ).select();
			jQuery( drawerEl ).find( '#title' ).focus();
			nfRadio.channel( 'drawer' ).off( 'opened', this.focusTitle );
		},

		changeBuilderClass: function( hasParts ) {
			var builderEl = nfRadio.channel( 'app' ).request( 'get:builderEl' );
			if ( hasParts ) {
				jQuery( builderEl ).addClass( 'nf-has-parts' );
			} else {
				jQuery( builderEl ).removeClass( 'nf-has-parts' );
			}
		},

		changeCurrentPart: function( model, collection, options ) {
			/*
			 * When we remove the current part, change the current part in our collection.
			 *
			 * TODO: Find a way to pass index to has previous or has next for proper testing.
			 * Since the model has been removed, it will always return a -1.
			 */
			if ( this.getElement() == model ) {
				if ( 0 == options.index ) {
					this.setElement( this.at( 0 ) );
				} else {
					this.setElement( this.at( options.index - 1 ) );
				}
			} else if ( 1 == this.length ) {
				this.setElement( this.at( 0 ) );
			}
		},

		append: function( data ) {
			data = data || {};
			var order = this.length - 1;
			data = _.extend( { order: order }, data );
			return this.add( data );
		},
		
		getElement: function() {
			/*
			 * If we haven't set an element yet, set it to the first one.
			 */
			if ( ! this.currentElement ) {
				this.setElement( this.at( 0 ), true );
			}
			return this.currentElement;
		},
		  
		setElement: function( model, silent ) {
			if ( model == this.currentElement ) return;
			silent = silent || false;
			this.previousElement = this.currentElement;
			this.currentElement = model;
			if ( ! silent ) {
				/*
				 * Close the drawer for editing this title if it is open.
				 */
				var currentDrawer = nfRadio.channel( 'app' ).request( 'get:currentDrawer' );
				if ( currentDrawer && 'editSettings' == currentDrawer.get( 'id' ) ) {
					// nfRadio.channel( 'app' ).request( 'close:drawer' );
				}
				this.trigger( 'change:part', this );	
			}
		},
		
		next: function (){
			/*
			 * If this isn't the last part, move forward.
			 */
			if ( this.hasNext() ) {
				this.setElement( this.at( this.indexOf( this.getElement() ) + 1 ) );
			}
			
			return this;
		},

		previous: function() {
			/*
			 * If this isn't the first part, move backward.
			 */
			if ( this.hasPrevious() ) {
				this.setElement( this.at( this.indexOf( this.getElement() ) - 1 ) );	
			}
			
			return this;
		},

		hasNext: function() {
			if ( 0 == this.length ) return false;
			return this.length - 1 != this.indexOf( this.getElement() );
		},

		hasPrevious: function() {
			if ( 0 == this.length ) return false;
			return 0 != this.indexOf( this.getElement() );
		},

		getFormContentData: function() {
			return this.getElement().get( 'formContentData' );
		},

		updateOrder: function() {
			this.each( function( model, index ) {
				model.set( 'order', index );
			} );
			this.sort();
		},

		append: function( model ) {
		    var order = _.max( this.pluck( 'order' ) ) + 1;
		    if( model instanceof Backbone.Model ) {
		        model.set( 'order', order );
		    } else {
		        model.order = order;
		    }
		    this.add( model );
		}
	} );

	return collection;
} );