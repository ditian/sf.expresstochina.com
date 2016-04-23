// getClipboardText()
// return any text that is currently on the clipboard
function getClipboardText() {
    // create div element for pasting into
    var pasteDiv = document.createElement("div");

    // place div outside the visible area
    pasteDiv.style.position = "absolute";
    pasteDiv.style.left = "-10000px";
    pasteDiv.style.top = "-10000px";

    // set contentEditable mode
    pasteDiv.contentEditable = true;

    // find a good place to add the div to the document
    // start with the currently active element
    var insertionElement = document.activeElement;
    // get the element type 
    var nodeName = insertionElement.nodeName.toLowerCase();
    // if have not reached an element that it is valid to insert a div into
    // (stopping eventually with 'body' if no others are found first)
    while (nodeName !== "body" && nodeName !== "div" && nodeName !== "li" && nodeName !== "th" && nodeName !== "td") { 
        insertionElement = insertionElement.parentNode;  // go up the hierarchy
        nodeName = insertionElement.nodeName.toLowerCase();  // get the parent node element 
    }

    // add element to document
    insertionElement.appendChild(pasteDiv);

    // paste the current clipboard text into the element
    pasteDiv.focus();
    document.execCommand('paste');

    // get the pasted text from the div
    var clipboardText = pasteDiv.innerText;

    // remove the temporary element
    insertionElement.removeChild(pasteDiv);

    // return the text
    return clipboardText;
}

function autofill() {
    console.log(getClipboardText());
    var clipboardText = getClipboardText();
    document.getElementById("ctl00_ctl00_ctl00_ContentPlaceHolder1_ContentPlaceHolder1_ContentPlaceHolder1_" + 
        "TXT_RECV_ADDRESS").value = clipboardText;
    document.getElementById("ctl00_ctl00_ctl00_ContentPlaceHolder1_ContentPlaceHolder1_ContentPlaceHolder1_" +
        "ctrlProviceCityArea_DropDownList1").value = clipboardText;
    setTimeout('__doPostBack(\'ctl00$ctl00$ctl00$ContentPlaceHolder1$ContentPlaceHolder1$ContentPlaceHolder1$ctrlProviceCityArea$DropDownList1\',\'\')', 0);
}

autofill();

// __doPostBack(eventTarget, eventArgument)
// Submit the option which is selected from the dropdown list to the server, requesting for more follow-up information.
var theForm = document.forms['aspnetForm'];

if (!theForm) {
    theForm = document.aspnetForm;
}

function __doPostBack(eventTarget, eventArgument) {
    if (!theForm.onsubmit || (theForm.onsubmit() != false)) {
        theForm.__EVENTTARGET.value = eventTarget;
        theForm.__EVENTARGUMENT.value = eventArgument;
        theForm.submit();
    }
}



