function targetLinksToNewWindow() {
  if (!document.getElementsByTagName) return;
  var anchors = document.getElementsByTagName("a");
  for (var i=0; i<anchors.length; i++) {
       var anchor = anchors[i];
       if (anchor.getAttribute("href") &&
           (anchor.getAttribute("class") == "popup" || anchor.getAttribute("class") == "popup no_icon" || anchor.getAttribute("class") == "no_icon popup"))
           anchor.target = "_blank";
   }
  var forms = document.getElementsByTagName("form");
  for (var i=0; i<forms.length; i++) {
       var form = forms[i];
       if (form.getAttribute("class") == "popup")
           form.target = "_blank";
   }
}
window.onload = targetLinksToNewWindow;
