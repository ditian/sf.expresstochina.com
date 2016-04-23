// Global variables
var NAME_ID = 'ctl00_ctl00_ctl00_ContentPlaceHolder1_ContentPlaceHolder1_ContentPlaceHolder1_TXT_RECV_USERNAME';
var PHONE_NUMBER_ID = 'ctl00_ctl00_ctl00_ContentPlaceHolder1_ContentPlaceHolder1_ContentPlaceHolder1_TXT_RECV_TEL1';
var ADDRESS_ID = 'ctl00_ctl00_ctl00_ContentPlaceHolder1_ContentPlaceHolder1_ContentPlaceHolder1_TXT_RECV_ADDRESS';
var POSTAL_CODE_ID = 'ctl00_ctl00_ctl00_ContentPlaceHolder1_ContentPlaceHolder1_ContentPlaceHolder1_TXT_RECV_POST';

// getClipboardText()
// return any text that is currently on the clipboard
function getClipboardText() {
    // create div element for pasting into
    var pasteDiv = document.createElement('div');

    // place div outside the visible area
    pasteDiv.style.position = 'absolute';
    pasteDiv.style.left = '-10000px';
    pasteDiv.style.top = '-10000px';

    // set contentEditable mode
    pasteDiv.contentEditable = true;

    // find a good place to add the div to the document
    // start with the currently active element
    var insertionElement = document.activeElement;
    // get the element type 
    var nodeName = insertionElement.nodeName.toLowerCase();
    // if have not reached an element that it is valid to insert a div into
    // (stopping eventually with 'body' if no others are found first)
    while (nodeName !== 'body' && nodeName !== 'div' && nodeName !== 'li' && nodeName !== 'th' && nodeName !== 'td') { 
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

// parse(clipboardText)
// Extract [province, city, district, address, postalCode, name, phoneNumber] from TaoBao-formatted receiver 
// information.
function parse(clipboardText) {
    var infoArray0 = clipboardText.split('，');  // split by the comma of Chinese character
    for (var i = 0; i < infoArray0.length; ++i) {  // remove leading and trailing whitespaces
        infoArray0[i] = infoArray0[i].trim();
    }
    // now infoArray0 is [compositeAddress, postalCode, name, phoneNumber]
    var postalCode = infoArray0[1];  // ***
    var name = infoArray0[2];  // ***
    var phoneNumber = infoArray0[3];  // ***

    // the content before the first whitespace is "province + city + district"
    var compositeAddress = infoArray0[0];
    var firstWhitespaceIndex = compositeAddress.indexOf(' ');
    var provinceCityDistrict = compositeAddress.substr(0, firstWhitespaceIndex);  // *** -- need further processing
    var address = compositeAddress.substr(firstWhitespaceIndex + 1).trim();  // ***
    
    var province;
    var city;
    var district;
    var firstTwoCharacters = provinceCityDistrict.substr(0, 3);
    if (firstTwoCharacters == '北京') {
        province = '北京';
        city = '北京市';
        district = provinceCityDistrict.substr(5);
    } else if (firstTwoCharacters == '上海') {
        province = '上海';
        city = '上海市';
        district = provinceCityDistrict.substr(5);
    } else if (firstTwoCharacters == '天津') {
        province = '天津';
        city = '天津市';
        district = provinceCityDistrict.substr(5);
    } else if (firstTwoCharacters == '重庆') {
        province = '重庆';
        city = '重庆市';
        district = provinceCityDistrict.substr(5);
    } else {
        var splitIndex = provinceCityDistrict.indexOf('省');
        province = provinceCityDistrict.substr(0, splitIndex + 1);
        provinceCityDistrict = provinceCityDistrict.substr(splitIndex + 1);
        splitIndex = provinceCityDistrict.indexOf('市');
        city = provinceCityDistrict.substr(0, splitIndex + 1);
        district = provinceCityDistrict.substr(splitIndex + 1);
    }

    /*console.log(province);
    console.log(city);
    console.log(district);
    console.log(address);
    console.log(name);
    console.log(postalCode);
    console.log(phoneNumber);*/

    var infoArray = [province, city, district, address, postalCode, name, phoneNumber];
    console.log(infoArray);
    return infoArray;
}

// autofill(infoArray)
// infoArray = [province, city, district, address, postalCode, name, phoneNumber]
function autofill(infoArray) {
    document.getElementById(ADDRESS_ID).value = infoArray[3];
    document.getElementById(POSTAL_CODE_ID).value = infoArray[4];
    document.getElementById(NAME_ID).value = infoArray[5];
    document.getElementById(PHONE_NUMBER_ID).value = infoArray[6];
    // document.getElementById("ctl00_ctl00_ctl00_ContentPlaceHolder1_ContentPlaceHolder1_ContentPlaceHolder1_" +
    //    "ctrlProviceCityArea_DropDownList1").value = clipboardText;
    // setTimeout('__doPostBack(\'ctl00$ctl00$ctl00$ContentPlaceHolder1$ContentPlaceHolder1$ContentPlaceHolder1$ctrlProviceCityArea$DropDownList1\',\'\')', 0);
}

autofill(parse(getClipboardText()));

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



