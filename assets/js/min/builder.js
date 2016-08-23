!function(){var e,t,n;!function(i){function r(e,t){return y.call(e,t)}function o(e,t){var n,i,r,o,l,a,s,c,f,u,d,h=t&&t.split("/"),g=C.map,p=g&&g["*"]||{};if(e&&"."===e.charAt(0))if(t){for(e=e.split("/"),l=e.length-1,C.nodeIdCompat&&x.test(e[l])&&(e[l]=e[l].replace(x,"")),e=h.slice(0,h.length-1).concat(e),f=0;f<e.length;f+=1)if(d=e[f],"."===d)e.splice(f,1),f-=1;else if(".."===d){if(1===f&&(".."===e[2]||".."===e[0]))break;f>0&&(e.splice(f-1,2),f-=2)}e=e.join("/")}else 0===e.indexOf("./")&&(e=e.substring(2));if((h||p)&&g){for(n=e.split("/"),f=n.length;f>0;f-=1){if(i=n.slice(0,f).join("/"),h)for(u=h.length;u>0;u-=1)if(r=g[h.slice(0,u).join("/")],r&&(r=r[i])){o=r,a=f;break}if(o)break;!s&&p&&p[i]&&(s=p[i],c=f)}!o&&s&&(o=s,a=c),o&&(n.splice(0,a,o),e=n.join("/"))}return e}function l(e,t){return function(){var n=b.call(arguments,0);return"string"!=typeof n[0]&&1===n.length&&n.push(null),h.apply(i,n.concat([e,t]))}}function a(e){return function(t){return o(t,e)}}function s(e){return function(t){m[e]=t}}function c(e){if(r(v,e)){var t=v[e];delete v[e],w[e]=!0,d.apply(i,t)}if(!r(m,e)&&!r(w,e))throw new Error("No "+e);return m[e]}function f(e){var t,n=e?e.indexOf("!"):-1;return n>-1&&(t=e.substring(0,n),e=e.substring(n+1,e.length)),[t,e]}function u(e){return function(){return C&&C.config&&C.config[e]||{}}}var d,h,g,p,m={},v={},C={},w={},y=Object.prototype.hasOwnProperty,b=[].slice,x=/\.js$/;g=function(e,t){var n,i=f(e),r=i[0];return e=i[1],r&&(r=o(r,t),n=c(r)),r?e=n&&n.normalize?n.normalize(e,a(t)):o(e,t):(e=o(e,t),i=f(e),r=i[0],e=i[1],r&&(n=c(r))),{f:r?r+"!"+e:e,n:e,pr:r,p:n}},p={require:function(e){return l(e)},exports:function(e){var t=m[e];return"undefined"!=typeof t?t:m[e]={}},module:function(e){return{id:e,uri:"",exports:m[e],config:u(e)}}},d=function(e,t,n,o){var a,f,u,d,h,C,y=[],b=typeof n;if(o=o||e,"undefined"===b||"function"===b){for(t=!t.length&&n.length?["require","exports","module"]:t,h=0;h<t.length;h+=1)if(d=g(t[h],o),f=d.f,"require"===f)y[h]=p.require(e);else if("exports"===f)y[h]=p.exports(e),C=!0;else if("module"===f)a=y[h]=p.module(e);else if(r(m,f)||r(v,f)||r(w,f))y[h]=c(f);else{if(!d.p)throw new Error(e+" missing "+f);d.p.load(d.n,l(o,!0),s(f),{}),y[h]=m[f]}u=n?n.apply(m[e],y):void 0,e&&(a&&a.exports!==i&&a.exports!==m[e]?m[e]=a.exports:u===i&&C||(m[e]=u))}else e&&(m[e]=n)},e=t=h=function(e,t,n,r,o){if("string"==typeof e)return p[e]?p[e](t):c(g(e,t).f);if(!e.splice){if(C=e,C.deps&&h(C.deps,C.callback),!t)return;t.splice?(e=t,t=n,n=null):e=i}return t=t||function(){},"function"==typeof n&&(n=r,r=o),r?d(i,e,t,n):setTimeout(function(){d(i,e,t,n)},4),h},h.config=function(e){return h(e)},e._defined=m,n=function(e,t,n){if("string"!=typeof e)throw new Error("See almond README: incorrect module build, no module name");t.splice||(n=t,t=[]),r(m,e)||r(v,e)||(v[e]=[e,t,n])},n.amd={jQuery:!0}}(),n("../lib/almond",function(){}),n("models/partModel",[],function(){var e=Backbone.Model.extend({defaults:{title:"",formContentData:[],order:0},initialize:function(){var e=i.channel("formContent").request("get:loadFilters"),t=_.without(e,void 0),n=t[1];this.set("formContentData",n(this.get("formContentData"))),this.listenTo(this.get("formContentData"),"change:order",this.sortFormContentData);var r=i.channel("fields").request("get:collection");this.listenTo(r,"remove",this.triggerRemove)},sortFormContentData:function(){this.get("formContentData").sort()},triggerRemove:function(e){this.get("formContentData").trigger("remove:field",e)}});return e}),n("models/partCollection",["models/partModel"],function(e){var t=Backbone.Collection.extend({model:e,currentElement:!1,comparator:"order",initialize:function(e,t){},getElement:function(){return this.currentElement||this.setElement(this.at(0),!0),this.currentElement},setElement:function(e,t){t=t||!1,this.currentElement=e,t||this.trigger("change:part",this)},next:function(){return this.hasNext()&&this.setElement(this.at(this.indexOf(this.getElement())+1)),this},previous:function(){return this.hasPrevious()&&this.setElement(this.at(this.indexOf(this.getElement())-1)),this},hasNext:function(){return this.length-1!=this.indexOf(this.getElement())},hasPrevious:function(){return 0!=this.indexOf(this.getElement())},getFormContentData:function(){return this.getElement().get("formContentData")}});return t}),n("controllers/data",["models/partCollection"],function(e){var t=Marionette.Object.extend({initialize:function(){i.channel("mp").reply("init:partCollection",this.initPartCollection,this),i.channel("mp").reply("get:collection",this.getCollection,this),this.listenTo(i.channel("fields"),"add:field",this.addField)},initPartCollection:function(e){this.collection=e},getCollection:function(){return this.collection},addField:function(e){this.collection.getFormContentData().trigger("add:field",e),1==this.collection.getFormContentData().length&&this.collection.getFormContentData().trigger("reset")}});return t}),n("views/topDrawerItem",[],function(){var e=Marionette.ItemView.extend({tagName:"li",template:"#nf-tmpl-mp-top-drawer-item",events:{click:"click"},click:function(e){this.model.collection.setElement(this.model)},templateHelpers:function(){var e=this;return{getIndex:function(){return e.model.collection.indexOf(e.model)+1}}}});return e}),n("views/topDrawerCollection",["views/topDrawerItem"],function(e){var t=Marionette.CollectionView.extend({tagName:"ul",childView:e,initialize:function(){var e=_.template(jQuery("#nf-tmpl-mp-top-drawer-pagination-left").html());this.leftPagination="<li>"+e()+"</li>",e=_.template(jQuery("#nf-tmpl-mp-top-drawer-pagination-right").html()),this.rightPagination="<li>"+e()+"</li>"},attachHtml:function(e,t,n){e.isBuffering?e._bufferedChildren.splice(n,0,t):e._insertBefore(t,n)||(jQuery(e.el).find("li:last").remove(),e._insertAfter(t),jQuery(e.el).append(this.rightPagination))},attachBuffer:function(e,t){e.$el.prepend(this.leftPagination),e.$el.append(t),e.$el.append(this.rightPagination)}});return t}),n("views/layout",["views/topDrawerCollection"],function(e){var t=Marionette.LayoutView.extend({tagName:"div",template:"#nf-tmpl-mp-layout",regions:{mainContent:"#nf-mp-main-content",topDrawer:"#nf-mp-top-drawer"},initialize:function(){this.listenTo(this.collection,"change:part",this.changePart)},onShow:function(){this.topDrawer.show(new e({collection:this.collection}));var t=i.channel("formContent").request("get:viewFilters"),n=_.without(t,void 0),r=n[1];this.formContentView=r(),0==this.collection.length&&this.collection.add({}),this.mainContent.show(new this.formContentView({collection:this.collection.getFormContentData()}))},changePart:function(){this.mainContent.empty(),this.mainContent.show(new this.formContentView({collection:this.collection.getFormContentData()}))}});return t}),n("views/gutterLeft",[],function(){var e=Marionette.ItemView.extend({tagName:"div",template:"#nf-tmpl-mp-gutter-left",events:{"click .fa":"clickPrevious"},initialize:function(){this.collection=i.channel("mp").request("get:collection"),this.listenTo(this.collection,"change:part",this.render)},onRender:function(){var e=this;jQuery(this.el).find(".fa").droppable({tolerance:"pointer",hoverClass:"mp-circle-over",activeClass:"mp-circle-active",accept:".nf-field-type-draggable, .nf-field-wrap, .nf-stage",over:function(t,n){i.channel("mp").trigger("over:gutter",n,e.collection)},out:function(t,n){i.channel("mp").trigger("out:gutter",n,e.collection)},drop:function(t,n){i.channel("mp").trigger("drop:leftGutter",n,e.collection)}})},clickPrevious:function(e){i.channel("mp").trigger("click:previous",e)},templateHelpers:function(){var e=this;return{hasPrevious:function(){return e.collection.hasPrevious()}}},changePart:function(e){e.collection.previous()}});return e}),n("views/gutterRight",[],function(){var e=Marionette.ItemView.extend({tagName:"div",template:"#nf-tmpl-mp-gutter-right",events:{"click .next":"clickNext","click .new":"clickNew"},initialize:function(){this.collection=i.channel("mp").request("get:collection"),this.listenTo(this.collection,"change:part",this.render),this.listenTo(this.collection,"add",this.render)},onRender:function(){var e=this;jQuery(this.el).find(".fa").droppable({tolerance:"pointer",hoverClass:"mp-circle-over",activeClass:"mp-circle-active",accept:".nf-field-type-draggable, .nf-field-wrap, .nf-stage",over:function(t,n){i.channel("mp").trigger("over:gutter",n,e.collection)},out:function(t,n){i.channel("mp").trigger("out:gutter",n,e.collection)},drop:function(t,n){i.channel("mp").trigger("drop:rightGutter",n,e.collection)}})},clickNext:function(e){i.channel("mp").trigger("click:next",e)},clickNew:function(e){i.channel("mp").trigger("click:new",e)},templateHelpers:function(){var e=this;return{hasNext:function(){return e.collection.hasNext()}}},changePart:function(e){e.collection.next()}});return e}),n("views/mainContentEmpty",[],function(){var e=Marionette.ItemView.extend({tagName:"div",template:"#nf-tmpl-mp-main-content-fields-empty",onBeforeDestroy:function(){jQuery(this.el).parent().removeClass("nf-fields-empty-droppable").droppable("destroy")},onRender:function(){this.$el=this.$el.children(),this.$el.unwrap(),this.setElement(this.$el)},onShow:function(){jQuery(this.el).parent().hasClass("ui-sortable")&&jQuery(this.el).parent().sortable("destroy"),jQuery(this.el).parent().addClass("nf-fields-empty-droppable"),jQuery(this.el).parent().droppable({accept:function(e){return jQuery(e).hasClass("nf-stage")||jQuery(e).hasClass("nf-field-type-button")?!0:void 0},activeClass:"nf-droppable-active",hoverClass:"nf-droppable-hover",tolerance:"pointer",over:function(e,t){t.item=t.draggable,i.channel("app").request("over:fieldsSortable",t)},out:function(e,t){t.item=t.draggable,i.channel("app").request("out:fieldsSortable",t)},drop:function(e,t){t.item=t.draggable,i.channel("app").request("receive:fieldsSortable",t);var n=i.channel("fields").request("get:collection");n.trigger("reset",n)}})}});return e}),n("controllers/filters",["views/layout","views/gutterLeft","views/gutterRight","views/mainContentEmpty","models/partCollection"],function(e,t,n,r,o){var l=Marionette.Object.extend({initialize:function(){this.listenTo(i.channel("app"),"after:loadViews",this.addFilters)},addFilters:function(){i.channel("formContentGutters").request("add:leftFilter",this.getLeftView,1,this),i.channel("formContentGutters").request("add:rightFilter",this.getRightView,1,this),i.channel("formContent").request("add:viewFilter",this.getContentView,1),i.channel("formContent").request("add:saveFilter",this.formContentSave,1),i.channel("formContent").request("add:loadFilter",this.formContentLoad,1),this.emptyView()},getLeftView:function(){return t},getRightView:function(){return n},formContentLoad:function(e){if(!0==e instanceof Backbone.Collection)return e;var t=new o(e);return i.channel("mp").request("init:partCollection",t),t},getContentView:function(){return e},formContentSave:function(e){var t=i.channel("app").request("clone:collectionDeep",e),n=i.channel("formContent").request("get:saveFilters");return t.each(function(e){var t=_.without(n,void 0),i=t[1];e.set("formContentData",i(e.get("formContentData")))}),t.toJSON()},emptyView:function(){this.defaultMainContentEmptyView=i.channel("views").request("get:mainContentEmpty"),i.channel("views").reply("get:mainContentEmpty",this.getMainContentEmpty,this)},getMainContentEmpty:function(){return 1==i.channel("mp").request("get:collection").length?this.defaultMainContentEmptyView:r}});return l}),n("controllers/clickControls",[],function(){var e=Marionette.Object.extend({initialize:function(){this.listenTo(i.channel("mp"),"click:previous",this.clickPrevious),this.listenTo(i.channel("mp"),"click:next",this.clickNext),this.listenTo(i.channel("mp"),"click:new",this.clickNew)},clickPrevious:function(e){var t=i.channel("mp").request("get:collection");t.previous()},clickNext:function(e){var t=i.channel("mp").request("get:collection");t.next()},clickNew:function(e){var t=i.channel("mp").request("get:collection"),n=t.add({});t.setElement(n)}});return e}),n("controllers/gutterDroppables",[],function(){var e=Marionette.Object.extend({initialize:function(){this.listenTo(i.channel("mp"),"over:gutter",this.over),this.listenTo(i.channel("mp"),"out:gutter",this.out),this.listenTo(i.channel("mp"),"drop:rightGutter",this.dropRight),this.listenTo(i.channel("mp"),"drop:leftGutter",this.dropLeft)},over:function(e,t){jQuery("#nf-main").find(".nf-fields-sortable-placeholder").addClass("nf-sortable-removed").removeClass("nf-fields-sortable-placeholder"),e.item=e.draggable,i.channel("app").request("over:fieldsSortable",e)},out:function(e,t){jQuery("#nf-main").find(".nf-sortable-removed").addClass("nf-fields-sortable-placeholder"),e.item=e.draggable,i.channel("app").request("out:fieldsSortable",e)},drop:function(e,t,n){e.draggable.dropping=!0,e.item=e.draggable,i.channel("app").request("out:fieldsSortable",e)},dropLeft:function(e,t){if(this.drop(e,t,"left"),t.hasPrevious())if(jQuery(e.draggable).hasClass("nf-field-wrap")){var n=i.channel("fields").request("get:field",jQuery(e.draggable).data("id"));t.getFormContentData().trigger("remove:field",n),t.at(t.indexOf(t.getElement())-1).get("formContentData").trigger("append:field",n)}else if(jQuery(e.draggable).hasClass("nf-field-type-draggable")){var r=jQuery(e.draggable).data("id"),n=this.addField(r,t);t.at(t.indexOf(t.getElement())-1).get("formContentData").trigger("append:field",n)}else{i.channel("fields").request("sort:staging");var o=i.channel("fields").request("get:staging");_.each(o.models,function(e,n){var i=this.addField(e.get("slug"),t);t.at(t.indexOf(t.getElement())-1).get("formContentData").trigger("append:field",i)},this),i.channel("fields").request("clear:staging")}},dropRight:function(e,t){if(this.drop(e,t),jQuery(e.draggable).hasClass("nf-field-wrap")){var n=i.channel("fields").request("get:field",jQuery(e.draggable).data("id"));if(t.hasNext())t.getFormContentData().trigger("remove:field",n),t.at(t.indexOf(t.getElement())+1).get("formContentData").trigger("append:field",n);else{t.getFormContentData().trigger("remove:field",n);var r=t.add({formContentData:[n.get("key")]});t.setElement(r)}}else{if(jQuery(e.draggable).hasClass("nf-field-type-draggable")){var o=jQuery(e.draggable).data("id"),n=this.addField(o,t);if(t.hasNext())return t.at(t.indexOf(t.getElement())+1).get("formContentData").trigger("append:field",n),!1;var r=t.add({formContentData:[n.get("key")]});return t.setElement(r),r}i.channel("fields").request("sort:staging");var l=i.channel("fields").request("get:staging"),a=[];if(_.each(l.models,function(e,n){var i=this.addField(e.get("slug"),t);t.hasNext()?t.at(t.indexOf(t.getElement())+1).get("formContentData").trigger("append:field",i):a.push(i.get("key"))},this),!t.hasNext()){var r=t.add({formContentData:a});t.setElement(r)}i.channel("fields").request("clear:staging")}},addField:function(e,t){var n=i.channel("fields").request("get:type",e),r=i.channel("fields").request("add",{label:n.get("nicename"),type:e});return t.getFormContentData().trigger("remove:field",r),r}});return e}),n("controllers/loadControllers",["controllers/data","controllers/filters","controllers/clickControls","controllers/gutterDroppables"],function(e,t,n,i){var r=Marionette.Object.extend({initialize:function(){new e,new t,new n,new i}});return r});var i=Backbone.Radio;t(["controllers/loadControllers"],function(e){var t=Marionette.Application.extend({initialize:function(e){this.listenTo(i.channel("app"),"after:appStart",this.afterStart)},onStart:function(){new e}}),n=new t;n.start()}),n("main",function(){})}();
//# sourceMappingURL=almond.build.js.map
//# sourceMappingURL=builder.js.map
