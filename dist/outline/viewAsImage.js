import * as UI from 'solid-ui-jss';
export default dom => function viewAsImage(obj) {
  const img = UI.utils.AJARImage(obj.uri, UI.utils.label(obj), UI.utils.label(obj), dom);
  img.setAttribute('class', 'outlineImage');
  return img;
};
//# sourceMappingURL=viewAsImage.js.map