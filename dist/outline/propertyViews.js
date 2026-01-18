"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.propertyViews = propertyViews;
exports.viewsAddPropertyView = viewsAddPropertyView;
var _solidUiJss = require("solid-ui-jss");
var _viewAsImage = _interopRequireDefault(require("./viewAsImage"));
var _viewAsMbox = _interopRequireDefault(require("./viewAsMbox"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/** some builtin simple views **/

function propertyViews(dom) {
  // view that applies to items that are objects of certain properties.
  const views = {
    properties: [],
    defaults: [],
    classes: []
  }; // views

  const asImage = (0, _viewAsImage.default)(dom);
  const asMbox = (0, _viewAsMbox.default)(dom);
  viewsAddPropertyView(views, _solidUiJss.ns.foaf('depiction').uri, asImage, true);
  viewsAddPropertyView(views, _solidUiJss.ns.foaf('img').uri, asImage, true);
  viewsAddPropertyView(views, _solidUiJss.ns.foaf('thumbnail').uri, asImage, true);
  viewsAddPropertyView(views, _solidUiJss.ns.foaf('logo').uri, asImage, true);
  viewsAddPropertyView(views, _solidUiJss.ns.schema('image').uri, asImage, true);
  viewsAddPropertyView(views, _solidUiJss.ns.foaf('mbox').uri, asMbox, true);
  return views;
}

/** add a property view function **/
function viewsAddPropertyView(views, property, pviewfunc, isDefault) {
  if (!views.properties[property]) {
    views.properties[property] = [];
  }
  views.properties[property].push(pviewfunc);
  if (isDefault) {
    // will override an existing default!
    views.defaults[property] = pviewfunc;
  }
} // viewsAddPropertyView
//# sourceMappingURL=propertyViews.js.map