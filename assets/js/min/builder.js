!function(){var e,t,n;!function(i){function r(e,t){return b.call(e,t)}function a(e,t){var n,i,r,a,l,o,s,c,d,u,h,f=t&&t.split("/"),p=y.map,g=p&&p["*"]||{};if(e&&"."===e.charAt(0))if(t){for(e=e.split("/"),l=e.length-1,y.nodeIdCompat&&j.test(e[l])&&(e[l]=e[l].replace(j,"")),e=f.slice(0,f.length-1).concat(e),d=0;d<e.length;d+=1)if(h=e[d],"."===h)e.splice(d,1),d-=1;else if(".."===h){if(1===d&&(".."===e[2]||".."===e[0]))break;d>0&&(e.splice(d-1,2),d-=2)}e=e.join("/")}else 0===e.indexOf("./")&&(e=e.substring(2));if((f||g)&&p){for(n=e.split("/"),d=n.length;d>0;d-=1){if(i=n.slice(0,d).join("/"),f)for(u=f.length;u>0;u-=1)if(r=p[f.slice(0,u).join("/")],r&&(r=r[i])){a=r,o=d;break}if(a)break;!s&&g&&g[i]&&(s=g[i],c=d)}!a&&s&&(a=s,o=c),a&&(n.splice(0,o,a),e=n.join("/"))}return e}function l(e,t){return function(){var n=C.call(arguments,0);return"string"!=typeof n[0]&&1===n.length&&n.push(null),f.apply(i,n.concat([e,t]))}}function o(e){return function(t){return a(t,e)}}function s(e){return function(t){m[e]=t}}function c(e){if(r(v,e)){var t=v[e];delete v[e],w[e]=!0,h.apply(i,t)}if(!r(m,e)&&!r(w,e))throw new Error("No "+e);return m[e]}function d(e){var t,n=e?e.indexOf("!"):-1;return n>-1&&(t=e.substring(0,n),e=e.substring(n+1,e.length)),[t,e]}function u(e){return function(){return y&&y.config&&y.config[e]||{}}}var h,f,p,g,m={},v={},y={},w={},b=Object.prototype.hasOwnProperty,C=[].slice,j=/\.js$/;p=function(e,t){var n,i=d(e),r=i[0];return e=i[1],r&&(r=a(r,t),n=c(r)),r?e=n&&n.normalize?n.normalize(e,o(t)):a(e,t):(e=a(e,t),i=d(e),r=i[0],e=i[1],r&&(n=c(r))),{f:r?r+"!"+e:e,n:e,pr:r,p:n}},g={require:function(e){return l(e)},exports:function(e){var t=m[e];return"undefined"!=typeof t?t:m[e]={}},module:function(e){return{id:e,uri:"",exports:m[e],config:u(e)}}},h=function(e,t,n,a){var o,d,u,h,f,y,b=[],C=typeof n;if(a=a||e,"undefined"===C||"function"===C){for(t=!t.length&&n.length?["require","exports","module"]:t,f=0;f<t.length;f+=1)if(h=p(t[f],a),d=h.f,"require"===d)b[f]=g.require(e);else if("exports"===d)b[f]=g.exports(e),y=!0;else if("module"===d)o=b[f]=g.module(e);else if(r(m,d)||r(v,d)||r(w,d))b[f]=c(d);else{if(!h.p)throw new Error(e+" missing "+d);h.p.load(h.n,l(a,!0),s(d),{}),b[f]=m[d]}u=n?n.apply(m[e],b):void 0,e&&(o&&o.exports!==i&&o.exports!==m[e]?m[e]=o.exports:u===i&&y||(m[e]=u))}else e&&(m[e]=n)},e=t=f=function(e,t,n,r,a){if("string"==typeof e)return g[e]?g[e](t):c(p(e,t).f);if(!e.splice){if(y=e,y.deps&&f(y.deps,y.callback),!t)return;t.splice?(e=t,t=n,n=null):e=i}return t=t||function(){},"function"==typeof n&&(n=r,r=a),r?h(i,e,t,n):setTimeout(function(){h(i,e,t,n)},4),f},f.config=function(e){return f(e)},e._defined=m,n=function(e,t,n){if("string"!=typeof e)throw new Error("See almond README: incorrect module build, no module name");t.splice||(n=t,t=[]),r(m,e)||r(v,e)||(v[e]=[e,t,n])},n.amd={jQuery:!0}}(),n("../lib/almond",function(){}),n("models/partModel",[],function(){var e=Backbone.Model.extend({defaults:{formContentData:[],order:0,type:"part",clean:!0,title:"Part Title"},initialize:function(){this.on("change:title",this.unclean),this.filterFormContentData(),this.listenTo(this.get("formContentData"),"change:order",this.sortFormContentData);var e=i.channel("fields").request("get:collection");this.listenTo(e,"remove",this.triggerRemove),this.get("key")||this.set("key",Math.random().toString(36).replace(/[^a-z]+/g,"").substr(0,8))},unclean:function(){this.set("clean",!1)},sortFormContentData:function(){this.get("formContentData").sort()},triggerRemove:function(e){_.isArray(this.get("formContentData"))&&this.filterFormContentData(),this.get("formContentData").trigger("remove:field",e)},filterFormContentData:function(){if(this.get("formContentData")){var e=this.get("formContentData"),t=i.channel("formContent").request("get:loadFilters"),n=_.without(t,void 0),r=n[1],a=0==e.length;if("undefined"==typeof t[4]&&_.isArray(e)&&0!=e.length&&"undefined"!=typeof e[0].cells){var l=[],o=_.pluck(e,"cells");_.each(o,function(e){var t=_.flatten(_.pluck(e,"fields"));l=_.union(l,t)}),e=l,this.set("formContentData",e)}this.set("formContentData",r(e,a,e))}}});return e}),n("models/partCollection",["models/partModel"],function(e){var t=Backbone.Collection.extend({model:e,currentElement:!1,comparator:"order",initialize:function(e,t){e=e||[],this.on("remove",this.afterRemove),this.on("add",this.afterAdd),this.maybeChangeBuilderClass(e.length)},afterRemove:function(e,t,n){this.changeCurrentPart(e,t,n),this.maybeChangeBuilderClass(e,t,n),i.channel("app").request("close:drawer")},afterAdd:function(e){this.setElement(e),this.maybeChangeBuilderClass(e)},maybeChangeBuilderClass:function(e,t,n){!0==e instanceof Backbone.Model&&(e=this.length),this.changeBuilderClass(1<e)},changeBuilderClass:function(e){var t=i.channel("app").request("get:builderEl");e?jQuery(t).addClass("nf-has-parts"):jQuery(t).removeClass("nf-has-parts")},changeCurrentPart:function(e,t,n){this.getElement()==e?0==n.index?this.setElement(this.at(0)):this.setElement(this.at(n.index-1)):1==this.length&&this.setElement(this.at(0))},getElement:function(){return this.currentElement||this.setElement(this.at(0),!0),this.currentElement},setElement:function(e,t){if(e!=this.currentElement&&(t=t||!1,this.previousElement=this.currentElement,this.currentElement=e,!t)){var n=i.channel("app").request("get:currentDrawer");if(n&&"editSettings"==n.get("id")){var r=i.channel("mp").request("get:settingGroupCollection");i.channel("app").request("open:drawer","editSettings",{model:e,groupCollection:r})}this.trigger("change:part",this)}},next:function(){return this.hasNext()&&this.setElement(this.at(this.indexOf(this.getElement())+1)),this},previous:function(){return this.hasPrevious()&&this.setElement(this.at(this.indexOf(this.getElement())-1)),this},hasNext:function(){return 0!=this.length&&this.length-1!=this.indexOf(this.getElement())},hasPrevious:function(){return 0!=this.length&&0!=this.indexOf(this.getElement())},getFormContentData:function(){return this.getElement().get("formContentData")},updateOrder:function(){this.each(function(e,t){e.set("order",t)}),this.sort()},append:function(e){var t=_.max(this.pluck("order"))+1;return e instanceof Backbone.Model?e.set("order",t):e.order=t,this.add(e)}});return t}),n("controllers/data",["models/partCollection"],function(e){var t=Marionette.Object.extend({layoutsEnabed:!1,initialize:function(){i.channel("mp").reply("init:partCollection",this.initPartCollection,this),i.channel("mp").reply("get:collection",this.getCollection,this);var e=i.channel("formContent").request("get:loadFilters");this.layoutsEnabed="undefined"!=typeof e[4],this.listenTo(i.channel("fields"),"render:newField",function(e,t){return t=t||"",(!this.layoutsEnabed||"duplicate"!=t)&&void this.addField(e,t)},this),this.listenTo(i.channel("fields"),"render:duplicateField",this.addField)},initPartCollection:function(e){this.collection=e},getCollection:function(){return this.collection},addField:function(e,t){return(!this.layoutsEnabed||"duplicate"!=t)&&(this.collection.getFormContentData().trigger("add:field",e),void(1==this.collection.getFormContentData().length&&this.collection.getFormContentData().trigger("reset")))}});return t}),n("controllers/clickControls",[],function(){var e=Marionette.Object.extend({initialize:function(){this.listenTo(i.channel("mp"),"click:previous",this.clickPrevious),this.listenTo(i.channel("mp"),"click:next",this.clickNext),this.listenTo(i.channel("mp"),"click:new",this.clickNew),this.listenTo(i.channel("mp"),"click:part",this.clickPart),this.listenTo(i.channel("setting-name-mp_remove"),"click:extra",this.clickRemove),this.listenTo(i.channel("setting-name-mp_duplicate"),"click:extra",this.clickDuplicate)},clickPrevious:function(e){var t=i.channel("mp").request("get:collection");t.previous()},clickNext:function(e){var t=i.channel("mp").request("get:collection");t.next()},clickNew:function(e){var t=i.channel("mp").request("get:collection"),n=t.append({});i.channel("app").request("update:setting","clean",!1),i.channel("app").request("update:db");var r={object:"Part",label:n.get("title"),change:"Added",dashicon:"plus-alt"},a={collection:n.collection};i.channel("changes").request("register:change","addPart",n,null,r,a)},clickPart:function(e,t){if(t==t.collection.getElement(t)){var n=i.channel("mp").request("get:settingGroupCollection");i.channel("app").request("open:drawer","editSettings",{model:t,groupCollection:n})}else t.collection.setElement(t)},clickRemove:function(e,t,n,r){i.channel("app").request("update:setting","clean",!1),i.channel("app").request("update:db");var a={object:"Part",label:n.get("title"),change:"Removed",dashicon:"dismiss"},l={collection:n.collection};this.trash=[],this.removeFields(n.get("formContentData").models,this),this.trash.forEach(function(e){e.collection.remove(e)});i.channel("changes").request("register:change","removePart",n,null,a,l);n.collection.remove(n)},removeFields:function(e,t){_.each(e,function(e){"undefined"!=typeof e&&("undefined"!=typeof e.get("fields")?t.removeFields(e.get("fields").models,t):"undefined"!=typeof e.get("cells")?t.removeFields(e.get("cells").models,t):"undefined"!=e.get("id")&&t.trash.push(e))})},clickDuplicate:function(e,t,n,r){var a=i.channel("app").request("clone:modelDeep",n);a.set("key",Math.random().toString(36).replace(/[^a-z]+/g,"").substr(0,8));var l=[],o=i.channel("formContent").request("get:loadFilters"),s=i.channel("app").request("get:currentDomain"),c=s.get("id");if("undefined"!=typeof o[4]){_.each(a.get("formContentData").models,function(e,t){l[t]=[],_.each(e.get("cells").models,function(e,n){l[t][n]=[],_.each(e.get("fields").models,function(e,r){var a=i.channel("app").request("clone:modelDeep",e),o=i.channel(c).request("get:tmpID");a.set("id",o),l[t][n][r]=i.channel(c).request("add",a,!0,!1,"duplicate")})})});for(var d=0;d<l.length;d++)for(var u=0;u<l[d].length;u++)a.get("formContentData").models[d].get("cells").models[u].get("fields").models=l[d][u]}else _.each(a.get("formContentData").models,function(e,t){i.channel(c).request("add",e,!1,!1,"duplicate")});n.collection.add(a),a.set("order",n.get("order")),n.collection.updateOrder(),n.collection.setElement(a),i.channel("app").request("update:setting","clean",!1),i.channel("app").request("update:db");var h={object:"Part",label:a.get("title"),change:"Duplicated",dashicon:"admin-page"},f={collection:a.collection};i.channel("changes").request("register:change","duplicatePart",a,null,h,f)}});return e}),n("controllers/gutterDroppables",[],function(){var e=Marionette.Object.extend({initialize:function(){this.listenTo(i.channel("mp"),"over:gutter",this.over),this.listenTo(i.channel("mp"),"out:gutter",this.out),this.listenTo(i.channel("mp"),"drop:rightGutter",this.dropRight),this.listenTo(i.channel("mp"),"drop:leftGutter",this.dropLeft)},over:function(e,t){jQuery("#nf-main").find(".nf-fields-sortable-placeholder").addClass("nf-sortable-removed").removeClass("nf-fields-sortable-placeholder"),e.item=e.draggable,i.channel("app").request("over:fieldsSortable",e)},out:function(e,t){jQuery("#nf-main").find(".nf-sortable-removed").addClass("nf-fields-sortable-placeholder"),e.item=e.draggable,i.channel("app").request("out:fieldsSortable",e)},drop:function(e,t,n){e.draggable.dropping=!0,e.item=e.draggable,i.channel("app").request("out:fieldsSortable",e),i.channel("fields").request("sort:fields",null,null,!1)},dropLeft:function(e,t){if(this.drop(e,t,"left"),t.hasPrevious())if(jQuery(e.draggable).hasClass("nf-field-wrap")){var n=i.channel("fields").request("get:field",jQuery(e.draggable).data("id")),r=n.get("order");t.getFormContentData().trigger("remove:field",n);var a=t.at(t.indexOf(t.getElement())-1);a.get("formContentData").trigger("append:field",n),i.channel("app").request("update:setting","clean",!1),i.channel("app").request("update:db");var l={object:"Field",label:n.get("label"),change:"Changed Part",dashicon:"image-flip-horizontal"},o={oldPart:t.getElement(),newPart:a,fieldModel:n,oldOrder:r};i.channel("changes").request("register:change","fieldChangePart",a,null,l,o)}else if(jQuery(e.draggable).hasClass("nf-field-type-draggable")){var s=jQuery(e.draggable).data("id"),n=this.addField(s,t);t.at(t.indexOf(t.getElement())-1).get("formContentData").trigger("append:field",n)}else{i.channel("fields").request("sort:staging");var c=i.channel("fields").request("get:staging");_.each(c.models,function(e,n){var i=this.addField(e.get("slug"),t);t.at(t.indexOf(t.getElement())-1).get("formContentData").trigger("append:field",i)},this),i.channel("fields").request("clear:staging")}},dropRight:function(e,t){if(this.drop(e,t),jQuery(e.draggable).hasClass("nf-field-wrap")){var n=i.channel("fields").request("get:field",jQuery(e.draggable).data("id"));if(t.hasNext()){var r=n.get("order");t.getFormContentData().trigger("remove:field",n);var a=t.at(t.indexOf(t.getElement())+1);a.get("formContentData").trigger("append:field",n),i.channel("app").request("update:setting","clean",!1),i.channel("app").request("update:db");var l={object:"Field",label:n.get("label"),change:"Changed Part",dashicon:"image-flip-horizontal"},o={oldPart:t.getElement(),newPart:a,fieldModel:n,oldOrder:r};i.channel("changes").request("register:change","fieldChangePart",a,null,l,o)}else{var s=t.getElement();t.getFormContentData().trigger("remove:field",n);var c=t.append({formContentData:[n.get("key")]});t.setElement(c),i.channel("app").request("update:setting","clean",!1),i.channel("app").request("update:db");var l={object:"Part",label:c.get("title"),change:"Added",dashicon:"plus-alt"},o={collection:c.collection,oldPart:s,fieldModel:n};i.channel("changes").request("register:change","addPart",c,null,l,o)}}else{if(jQuery(e.draggable).hasClass("nf-field-type-draggable")){var d=jQuery(e.draggable).data("id"),n=this.addField(d,t);if(t.hasNext())return t.at(t.indexOf(t.getElement())+1).get("formContentData").trigger("append:field",n),!1;var c=t.append({formContentData:[n.get("key")]});t.setElement(c),i.channel("app").request("update:setting","clean",!1),i.channel("app").request("update:db");var l={object:"Part",label:c.get("title"),change:"Added",dashicon:"plus-alt"},o={collection:c.collection};i.channel("changes").request("register:change","addPart",c,null,l,o);return c}i.channel("fields").request("sort:staging");var u=i.channel("fields").request("get:staging"),h=[];if(_.each(u.models,function(e,n){var i=this.addField(e.get("slug"),t);t.hasNext()?t.at(t.indexOf(t.getElement())+1).get("formContentData").trigger("append:field",i):h.push(i.get("key"))},this),!t.hasNext()){var c=t.append({formContentData:h});t.setElement(c),i.channel("app").request("update:setting","clean",!1),i.channel("app").request("update:db");var l={object:"Part",label:c.get("title"),change:"Added",dashicon:"plus-alt"},o={collection:c.collection};i.channel("changes").request("register:change","addPart",c,null,l,o)}i.channel("fields").request("clear:staging")}},addField:function(e,t){var n=i.channel("fields").request("get:type",e),r=i.channel("fields").request("add",{label:n.get("nicename"),type:e});return t.getFormContentData().trigger("remove:field",r),r},changePart:function(e,t){t.next(),jQuery(e.helper).draggable()}});return e}),n("controllers/partSettings",[],function(e){var t=Marionette.Object.extend({initialize:function(){this.setupCollection(),i.channel("mp").reply("get:settingGroupCollection",this.getCollection,this)},setupCollection:function(){var e=i.channel("app").request("get:settingGroupCollectionDefinition");this.collection=new e([{id:"primary",label:"",display:!0,priority:100,settings:[{name:"title",type:"textbox",label:"Part Title",width:"full"},{name:"mp_duplicate",type:"html",width:"one-half",value:'<a href="#" class="nf-duplicate-part nf-button secondary extra">Duplicate Part</a>'},{name:"mp_remove",type:"html",width:"one-half",value:'<a href="#" class="nf-remove-part nf-button secondary extra">Remove Part</a>'}]}])},getCollection:function(){return this.collection}});return t}),n("controllers/partDroppable",[],function(){var e=Marionette.Object.extend({initialize:function(){this.listenTo(i.channel("mp"),"over:part",this.over),this.listenTo(i.channel("mp"),"out:part",this.out),this.listenTo(i.channel("mp"),"drop:part",this.drop)},over:function(e,t,n,r){jQuery("#nf-main").find(".nf-fields-sortable-placeholder").addClass("nf-sortable-removed").removeClass("nf-fields-sortable-placeholder"),t.item=t.draggable,jQuery(t.draggable).hasClass("nf-field-type-draggable")||jQuery(t.draggable).hasClass("nf-stage")?i.channel("app").request("over:fieldsSortable",t):jQuery(t.helper).css({width:"300px",height:"50px",opacity:"0.7"})},out:function(e,t,n,r){if(jQuery("#nf-main").find(".nf-sortable-removed").addClass("nf-fields-sortable-placeholder"),t.item=t.draggable,jQuery(t.draggable).hasClass("nf-field-type-draggable")||jQuery(t.draggable).hasClass("nf-stage"))i.channel("app").request("out:fieldsSortable",t);else{var a=i.channel("fields").request("get:sortableEl"),l=jQuery(a).width();jQuery(a).height();jQuery(t.helper).css({width:l,height:"",opacity:""})}},drop:function(e,t,n,r){t.draggable.dropping=!0,t.item=t.draggable,i.channel("app").request("out:fieldsSortable",t),jQuery(t.draggable).effect("transfer",{to:jQuery(r.el)},500),jQuery(t.draggable).hasClass("nf-field-wrap")?this.dropField(e,t,n,r):jQuery(t.draggable).hasClass("nf-field-type-draggable")?this.dropNewField(e,t,n,r):jQuery(t.draggable).hasClass("nf-stage")&&this.dropStaging(e,t,n,r)},dropField:function(e,t,n,r){i.channel("fields").request("sort:fields",null,null,!1),i.channel("app").request("out:fieldsSortable",t);var a=i.channel("fields").request("get:field",jQuery(t.draggable).data("id")),l=a.get("order"),o=n.collection.getElement(),s=n;n.collection.getFormContentData().trigger("remove:field",a),n.get("formContentData").trigger("append:field",a),i.channel("app").request("update:setting","clean",!1),i.channel("app").request("update:db");var c={object:"Field",label:a.get("label"),change:"Changed Part",dashicon:"image-flip-horizontal"},d={oldPart:o,newPart:s,fieldModel:a,oldOrder:l};i.channel("changes").request("register:change","fieldChangePart",n,null,c,d)},dropNewField:function(e,t,n,i){var r=jQuery(t.draggable).data("id"),a=this.addField(r,n.collection);n.get("formContentData").trigger("append:field",a)},dropStaging:function(e,t,n,r){i.channel("fields").request("sort:staging");var a=i.channel("fields").request("get:staging");_.each(a.models,function(e,t){var i=this.addField(e.get("slug"),n.collection);n.get("formContentData").trigger("append:field",i)},this),i.channel("fields").request("clear:staging")},addField:function(e,t){var n=i.channel("fields").request("get:type",e),r=i.channel("fields").request("add",{label:n.get("nicename"),type:e});return t.getFormContentData().trigger("remove:field",r),r}});return e}),n("controllers/partSortable",[],function(){var e=Marionette.Object.extend({initialize:function(){this.listenTo(i.channel("mp"),"start:partSortable",this.start),this.listenTo(i.channel("mp"),"stop:partSortable",this.stop),this.listenTo(i.channel("mp"),"update:partSortable",this.update)},start:function(e,t,n,i){jQuery(t.item).hasClass("nf-field-type-draggable")||jQuery(t.item).hasClass("nf-stage")||(jQuery(t.item).css("opacity","0.5").show(),jQuery(t.helper).css("opacity","0.75"))},stop:function(e,t,n,i){jQuery(t.item).hasClass("nf-field-type-draggable")||jQuery(t.item).hasClass("nf-stage")||jQuery(t.item).css("opacity","")},update:function(e,t,n,r){var a=n.findWhere({key:jQuery(t.item).prop("id")}),l={};n.each(function(e,t){l[e.get("key")]=t}),jQuery(t.item).css("opacity","");var o=_.without(jQuery(r.el).sortable("toArray"),"");_.each(o,function(e,t){n.findWhere({key:e}).set("order",t)},this),n.sort(),i.channel("app").request("update:setting","clean",!1),i.channel("app").request("update:db");var s={object:"Part",label:a.get("title"),change:"Sorted",dashicon:"sort"},c={oldOrder:l,collection:n};i.channel("changes").request("register:change","sortParts",a,null,s,c)}});return e}),n("controllers/undo",[],function(){var e=Marionette.Object.extend({initialize:function(){i.channel("changes").reply("undo:addPart",this.undoAddPart,this),i.channel("changes").reply("undo:removePart",this.undoRemovePart,this),i.channel("changes").reply("undo:duplicatePart",this.undoDupilcatePart,this),i.channel("changes").reply("undo:fieldChangePart",this.undoFieldChangePart,this),i.channel("changes").reply("undo:sortParts",this.undoSortParts,this)},undoAddPart:function(e,t){var n=e.get("model"),r=e.get("data"),a=r.collection;a.remove(n),"undefined"!=typeof r.fieldModel&&r.oldPart.get("formContentData").trigger("add:field",r.fieldModel);var l=i.channel("changes").request("get:collection");l.remove(l.filter({model:n})),this.maybeRemoveChange(e,t)},undoFieldChangePart:function(e,t){var n=e.get("data"),i=n.oldPart,r=n.fieldModel,a=n.oldOrder,l=n.newPart;l.get("formContentData").trigger("remove:field",r),i.get("formContentData").trigger("add:field",r),r.set("order",a),this.maybeRemoveChange(e,t)},undoRemovePart:function(e,t){var n=e.get("model"),i=e.get("data"),r=i.collection;r.add(n),this.maybeRemoveChange(e,t)},undoDupilcatePart:function(e,t){var n=e.get("model"),r=e.get("data"),a=r.collection;a.remove(n),"undefined"!=typeof r.fieldModel&&r.oldPart.get("formContentData").trigger("add:field",r.fieldModel);var l=i.channel("changes").request("get:collection");l.remove(l.filter({model:n})),this.maybeRemoveChange(e,t)},undoSortParts:function(e,t){var n=e.get("data").collection,i=e.get("data").oldOrder;n.each(function(e){e.set("order",i[e.get("key")])}),n.sort(),this.maybeRemoveChange(e,t)},maybeRemoveChange:function(e,t){var t="undefined"!=typeof t&&t;if(!t){i.channel("app").request("update:db");var n=i.channel("changes").request("get:collection");n.remove(e),0==n.length&&(i.channel("app").request("update:setting","clean",!0),i.channel("app").request("close:drawer"))}}});return e}),n("controllers/loadControllers",["controllers/data","controllers/clickControls","controllers/gutterDroppables","controllers/partSettings","controllers/partDroppable","controllers/partSortable","controllers/undo"],function(e,t,n,i,r,a,l){var o=Marionette.Object.extend({initialize:function(){new e,new t,new n,new i,new r,new a,new l}});return o}),n("views/drawerItem",[],function(){var e=Marionette.ItemView.extend({tagName:"li",template:"#nf-tmpl-mp-drawer-item",initialize:function(e){this.collectionView=e.collectionView,this.listenTo(this.model,"change:title",this.updatedTitle),this.listenTo(this.model.collection,"change:part",this.maybeChangeActive)},updatedTitle:function(){this.render(),this.collectionView.setULWidth(this.collectionView.el)},maybeChangeActive:function(){jQuery(this.el).removeClass("active"),this.model==this.model.collection.getElement()&&jQuery(this.el).addClass("active")},attributes:function(){return{id:this.model.get("key")}},onShow:function(){var e=this;jQuery(this.el).droppable({activeClass:"mp-drag-active",hoverClass:"mp-drag-hover",accept:".nf-field-type-draggable, .nf-field-wrap, .nf-stage",tolerance:"pointer",over:function(t,n){i.channel("mp").trigger("over:part",t,n,e.model,e)},out:function(t,n){i.channel("mp").trigger("out:part",t,n,e.model,e)},drop:function(t,n){i.channel("mp").trigger("drop:part",t,n,e.model,e)}}),this.maybeChangeActive()},events:{click:"click"},click:function(e){i.channel("mp").trigger("click:part",e,this.model)},templateHelpers:function(){var e=this;return{getIndex:function(){return e.model.collection.indexOf(e.model)+1}}}});return e}),n("views/drawerCollection",["views/drawerItem"],function(e){var t=Marionette.CollectionView.extend({tagName:"ul",childView:e,reorderOnSort:!0,initialize:function(e){this.drawerLayoutView=e.drawerLayoutView,jQuery(window).on("resize",{context:this},this.resizeEvent),this.listenTo(this.collection,"change:part",this.maybeScroll)},maybeScroll:function(e){var t=jQuery(this.el).children("#"+e.getElement().get("key"));if(0==jQuery(t).length)return!1;var n=parseInt(jQuery(t).css("marginLeft").replace("px","")),i=jQuery(this.drawerLayoutView.viewport.el).width(),r=jQuery(t).offset().left+jQuery(t).outerWidth()+n-i;jQuery(this.drawerLayoutView.viewport.el).animate({scrollLeft:"+="+r},100)},resizeEvent:function(e){e.data.context.showHidePagination(e.data.context)},childViewOptions:function(e,t){var n=this;return{collectionView:n}},onShow:function(){var e=this;jQuery(this.el).sortable({items:"li:not(.no-sort)",helper:"clone",update:function(t,n){i.channel("mp").trigger("update:partSortable",t,n,e.collection,e)},start:function(t,n){i.channel("mp").trigger("start:partSortable",t,n,e.collection,e)},stop:function(t,n){i.channel("mp").trigger("stop:partSortable",t,n,e.collection,e)}})},onAttach:function(){this.setULWidth(this.el),this.showHidePagination()},setULWidth:function(e){if(0!=jQuery(e).find("li").length){var t=0;jQuery(e).find("li").each(function(){var e=parseInt(jQuery(this).css("marginLeft").replace("px",""));t+=jQuery(this).outerWidth()+e+2}),jQuery(e).width(t)}},onRemoveChild:function(){this.setULWidth(this.el)},onAddChild:function(){this.setULWidth(this.el),this.maybeScroll(this.collection)},onBeforeAddChild:function(e){jQuery(this.el).css("width","+=100")},showHidePagination:function(e,t){e=e||this,t=t||jQuery(e.el).parent().parent().width()-120,jQuery(e.el).width()>=t?jQuery(e.drawerLayoutView.el).find(".nf-mp-drawer-scroll").is(":visible")||jQuery(e.drawerLayoutView.el).find(".nf-mp-drawer-scroll").show():jQuery(e.drawerLayoutView.el).find(".nf-mp-drawer-scroll").is(":visible")&&(jQuery(e.drawerLayoutView.el).find(".nf-mp-drawer-scroll").hide(),i.channel("app").request("update:gutters"))}});return t}),n("views/drawerLayout",["views/drawerCollection"],function(e){var t=Marionette.LayoutView.extend({tagName:"div",template:"#nf-tmpl-mp-drawer-layout",regions:{viewport:"#nf-mp-drawer-viewport"},initialize:function(e){jQuery(window).on("resize",{context:this},this.resizeWindow),this.listenTo(i.channel("drawer"),"before:open",this.beforeDrawerOpen),this.listenTo(i.channel("drawer"),"before:close",this.beforeDrawerClose)},onBeforeDestroy:function(){jQuery(window).off("resize",this.resizeWindow)},onShow:function(){this.viewport.show(new e({collection:this.collection,drawerLayoutView:this}))},onAttach:function(){this.resizeViewport(this.viewport.el)},resizeViewport:function(e){var t=i.channel("app").request("get:builderEl");if(jQuery(t).hasClass("nf-drawer-opened"))var n=i.channel("app").request("get:drawerEl"),r=r||jQuery(n).outerWidth()-140;else var r=r||jQuery(window).width()-140;jQuery(e).width(r)},resizeWindow:function(e){e.data.context.resizeViewport(e.data.context.viewport.el)},beforeDrawerOpen:function(){var e=this,t=i.channel("app").request("get:drawerEl"),n=jQuery(t).width()-60;jQuery(this.viewport.el).animate({width:n},300,function(){e.viewport.currentView.showHidePagination(null,n),e.viewport.currentView.maybeScroll(e.collection)})},beforeDrawerClose:function(){var e=this,t=jQuery(window).width()-140;jQuery(this.viewport.el).animate({width:t},500,function(){e.viewport.currentView.showHidePagination(null,t),e.viewport.currentView.maybeScroll(e.collection)})}});return t}),n("views/layout",["views/drawerLayout"],function(e){var t=Marionette.LayoutView.extend({tagName:"div",template:"#nf-tmpl-mp-layout",regions:{mainContent:"#nf-mp-main-content",drawer:"#nf-mp-drawer"},initialize:function(){this.listenTo(this.collection,"change:part",this.changePart)},onShow:function(){this.drawer.show(new e({collection:this.collection}));var t=i.channel("formContent").request("get:viewFilters"),n=_.without(t,void 0),r=n[1];this.formContentView=r(),this.mainContent.show(new this.formContentView({collection:this.collection.getFormContentData()}))},events:{"click .nf-mp-drawer-scroll-previous":"clickPrevious","click .nf-mp-drawer-scroll-next":"clickNext"},clickPrevious:function(e){var t=this,n=(jQuery(this.drawer.currentView.viewport.el).scrollLeft(),jQuery(this.drawer.currentView.viewport.currentView.el).find("li"));jQuery(n).each(function(e){if(0<jQuery(this).offset().left){var i=parseInt(jQuery(this).css("marginLeft").replace("px","")),r=jQuery(jQuery(n)[e-1]).outerWidth()+i+5;return jQuery(t.drawer.currentView.viewport.el).animate({scrollLeft:"-="+r},300),!1}})},clickNext:function(e){var t=this,n=(jQuery(this.drawer.currentView.viewport.currentView.el).width(),jQuery(this.drawer.currentView.viewport.el).width()),i=jQuery(this.drawer.currentView.viewport.el).scrollLeft(),r=jQuery(this.drawer.currentView.viewport.currentView.el).find("li"),a=n+i,l=0,i=0;jQuery(r).each(function(e){var n=parseInt(jQuery(this).css("marginLeft").replace("px",""));if(l+=jQuery(this).outerWidth()+n+5,l>=a)return i=jQuery(this).outerWidth()+n+5,jQuery(t.drawer.currentView.viewport.el).animate({scrollLeft:"+="+i},300),!1})},changePart:function(){var e=this.collection.indexOf(this.collection.getElement()),t=this.collection.indexOf(this.collection.previousElement);if(e>t)var n="left",i="right";else var n="right",i="left";var r=this;jQuery(this.mainContent.el).hide("slide",{direction:n},100,function(){r.mainContent.empty(),r.mainContent.show(new r.formContentView({collection:r.collection.getFormContentData()}))}),jQuery(this.mainContent.el).show("slide",{direction:i},100),jQuery(this.el).closest(".nf-app-main").scrollTop(0)}});return t}),n("views/gutterLeft",[],function(){var e=Marionette.ItemView.extend({tagName:"div",template:"#nf-tmpl-mp-gutter-left",events:{"click .fa":"clickPrevious"},initialize:function(){this.collection=i.channel("mp").request("get:collection"),this.listenTo(this.collection,"change:part",this.render),this.listenTo(this.collection,"sort",this.render),this.listenTo(this.collection,"remove",this.render)},onRender:function(){var e=this;jQuery(this.el).find(".fa").droppable({tolerance:"pointer",hoverClass:"mp-circle-over",activeClass:"mp-circle-active",accept:".nf-field-type-draggable, .nf-field-wrap, .nf-stage",over:function(t,n){i.channel("mp").trigger("over:gutter",n,e.collection)},out:function(t,n){i.channel("mp").trigger("out:gutter",n,e.collection)},drop:function(t,n){i.channel("mp").trigger("drop:leftGutter",n,e.collection)}})},clickPrevious:function(e){i.channel("mp").trigger("click:previous",e)},templateHelpers:function(){var e=this;return{hasPrevious:function(){return e.collection.hasPrevious()}}},changePart:function(e){e.collection.previous()}});return e}),n("views/gutterRight",[],function(){var e=Marionette.ItemView.extend({tagName:"div",template:"#nf-tmpl-mp-gutter-right",events:{"click .next":"clickNext","click .new":"clickNew"},initialize:function(){this.collection=i.channel("mp").request("get:collection"),this.listenTo(this.collection,"change:part",this.render),this.listenTo(this.collection,"sort",this.render),this.listenTo(this.collection,"remove",this.render),this.listenTo(this.collection,"add",this.render),this.listenTo(i.channel("fields"),"add:field",this.render)},test:function(){console.log("test test test")},onRender:function(){var e=this;jQuery(this.el).find(".fa").droppable({tolerance:"pointer",hoverClass:"mp-circle-over",activeClass:"mp-circle-active",accept:".nf-field-type-draggable, .nf-field-wrap, .nf-stage",over:function(t,n){i.channel("mp").trigger("over:gutter",n,e.collection)},out:function(t,n){i.channel("mp").trigger("out:gutter",n,e.collection)},drop:function(t,n){i.channel("mp").trigger("drop:rightGutter",n,e.collection)}})},clickNext:function(e){i.channel("mp").trigger("click:next",e)},clickNew:function(e){i.channel("mp").trigger("click:new",e)},templateHelpers:function(){var e=this;return{hasNext:function(){return e.collection.hasNext()},hasContent:function(){return 0!=i.channel("fields").request("get:collection").length}}},changePart:function(e){e.collection.next()}});return e}),n("views/mainContentEmpty",[],function(){var e=Marionette.ItemView.extend({tagName:"div",template:"#nf-tmpl-mp-main-content-fields-empty",onBeforeDestroy:function(){jQuery(this.el).parent().removeClass("nf-fields-empty-droppable").droppable("destroy");
},onRender:function(){this.$el=this.$el.children(),this.$el.unwrap(),this.setElement(this.$el)},onShow:function(){jQuery(this.el).parent().hasClass("ui-sortable")&&jQuery(this.el).parent().sortable("destroy"),jQuery(this.el).parent().addClass("nf-fields-empty-droppable"),jQuery(this.el).parent().droppable({accept:function(e){if(jQuery(e).hasClass("nf-stage")||jQuery(e).hasClass("nf-field-type-button"))return!0},activeClass:"nf-droppable-active",hoverClass:"nf-droppable-hover",tolerance:"pointer",over:function(e,t){t.item=t.draggable,i.channel("app").request("over:fieldsSortable",t)},out:function(e,t){t.item=t.draggable,i.channel("app").request("out:fieldsSortable",t)},drop:function(e,t){t.item=t.draggable,i.channel("app").request("receive:fieldsSortable",t);var n=i.channel("fields").request("get:collection");n.trigger("reset",n)}})}});return e}),n("controllers/filters",["views/layout","views/gutterLeft","views/gutterRight","views/mainContentEmpty","models/partCollection"],function(e,t,n,r,a){var l=Marionette.Object.extend({initialize:function(){this.listenTo(i.channel("app"),"after:loadViews",this.addFilters)},addFilters:function(){i.channel("formContentGutters").request("add:leftFilter",this.getLeftView,1,this),i.channel("formContentGutters").request("add:rightFilter",this.getRightView,1,this),i.channel("formContent").request("add:viewFilter",this.getContentView,1),i.channel("formContent").request("add:saveFilter",this.formContentSave,1),i.channel("formContent").request("add:loadFilter",this.formContentLoad,1),i.channel("conditions").request("add:groupFilter",this.conditionsFilter),i.channel("conditions-part").reply("get:triggers",this.conditionTriggers),this.listenTo(i.channel("conditions"),"change:then",this.maybeAddElse),this.emptyView()},getLeftView:function(){return t},getRightView:function(){return n},formContentLoad:function(e){if(!0==e instanceof a)return e;if(_.isArray(e)&&!_.isEmpty(e)&&"undefined"!=typeof _.first(e)&&"part"==_.first(e).type)var t=new a(e);else{e="undefined"==typeof e?i.channel("fields").request("get:collection").pluck("key"):e;var t=new a({formContentData:e})}return i.channel("mp").request("init:partCollection",t),t},getContentView:function(){return e},formContentSave:function(e){var t=new Backbone.Collection,n=i.channel("formContent").request("get:saveFilters");return e.each(function(e){var i=_.clone(e.attributes),r=_.without(n,void 0),a=r[1],l=a(i.formContentData);i.formContentData=l,t.add(i)}),t.toJSON()},emptyView:function(){this.defaultMainContentEmptyView=i.channel("views").request("get:mainContentEmpty"),i.channel("views").reply("get:mainContentEmpty",this.getMainContentEmpty,this)},getMainContentEmpty:function(){return 1==i.channel("mp").request("get:collection").length?this.defaultMainContentEmptyView:r},conditionsFilter:function(e,t){var n=i.channel("mp").request("get:collection");if(0==n.length||"when"==t)return e;var r=n.map(function(e){return{key:e.get("key"),label:e.get("title")}});return e.unshift({label:"Parts",type:"part",options:r}),e},conditionTriggers:function(e){return{show_field:{label:"Show Part",value:"show_part"},hide_field:{label:"Hide Part",value:"hide_part"}}},maybeAddElse:function(e,t){var n=!1,i=jQuery(e.target).val();switch(i){case"show_part":n="hide_part";break;case"hide_part":n="show_part"}if(n){var r=t.collection.options.conditionModel;"undefined"==typeof r.get("else").findWhere({key:t.get("key"),trigger:n})&&r.get("else").add({type:t.get("type"),key:t.get("key"),trigger:n})}}});return l});var i=Backbone.Radio;t(["controllers/loadControllers","controllers/filters"],function(e,t){var n=Marionette.Application.extend({initialize:function(e){this.listenTo(i.channel("app"),"after:loadControllers",this.loadControllers)},loadControllers:function(){new e},onStart:function(){new t}}),r=new n;r.start()}),n("main",function(){})}();
//# sourceMappingURL=almond.build.js.map
//# sourceMappingURL=builder.js.map
