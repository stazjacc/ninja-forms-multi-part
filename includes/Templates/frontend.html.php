<script id="nf-tmpl-mp-form-content" type="text/template">
	<div class="nf-mp-header"></div>
	<div class="nf-mp-body"></div>
	<div class="nf-mp-footer"></div>
</script>

<script id="nf-tmpl-mp-header" type="text/template">
	<%= renderBreadcrumbs() %>
	<h3>
		<%= title %>
	</h3>
</script>

<script id="nf-tmpl-mp-footer" type="text/template">
	<%= renderNextPrevious() %>
</script>

<script id="nf-tmpl-mp-next-previous" type="text/template">
	<% if ( ! showNext && ! showPrevious ) return %>
	<ul>
		<% if ( showPrevious ) { %>
			<li>
				<a href="#" class="nf-previous">PREVIOUS</a>
			</li>
		<% } %>
		
		<% if ( showNext ) { %>
			<li>
				<a href="#" class="nf-next">NEXT</a>
			</li>
		<% } %>
	</ul>
</script>

<script id="nf-tmpl-mp-breadcrumbs" type="text/template">
	<ul>
		<% _.each( parts, function( part, index ) { %>
			<li class="<%= ( currentIndex == index ) ? 'active' : '' %> <%= ( part.errors ) ? 'errors' : '' %>">
				<a href="#" class="nf-breadcrumb" data-index="<%= index %>"><%= part.title %></a>
				<%= ( part.errors ) ? '<-- ERRORS' : '' %>
			</li>
		<% } ); %>
	</ul>
</script>