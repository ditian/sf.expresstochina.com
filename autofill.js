// Global variables
var NAME_ID = 'ctl00_ctl00_ctl00_ContentPlaceHolder1_ContentPlaceHolder1_ContentPlaceHolder1_TXT_RECV_USERNAME';
var PHONE_NUMBER_ID = 'ctl00_ctl00_ctl00_ContentPlaceHolder1_ContentPlaceHolder1_ContentPlaceHolder1_TXT_RECV_TEL1';
var ADDRESS_ID = 'ctl00_ctl00_ctl00_ContentPlaceHolder1_ContentPlaceHolder1_ContentPlaceHolder1_TXT_RECV_ADDRESS';
var POSTAL_CODE_ID = 'ctl00_ctl00_ctl00_ContentPlaceHolder1_ContentPlaceHolder1_ContentPlaceHolder1_TXT_RECV_POST';

var PROVINCE_NAME = 'ctl00$ctl00$ctl00$ContentPlaceHolder1$ContentPlaceHolder1$ContentPlaceHolder1$ctrlProviceCityArea$DropDownList1';
var PROVINCE_ID = 'ctl00_ctl00_ctl00_ContentPlaceHolder1_ContentPlaceHolder1_ContentPlaceHolder1_ctrlProviceCityArea_DropDownList1';
var CITY_NAME = 'ctl00$ctl00$ctl00$ContentPlaceHolder1$ContentPlaceHolder1$ContentPlaceHolder1$ctrlProviceCityArea$DropDownList2';
var CITY_ID = 'ctl00_ctl00_ctl00_ContentPlaceHolder1_ContentPlaceHolder1_ContentPlaceHolder1_ctrlProviceCityArea_DropDownList2';
var DISTRICT_NAME = 'ctl00$ctl00$ctl00$ContentPlaceHolder1$ContentPlaceHolder1$ContentPlaceHolder1$ctrlProviceCityArea$DropDownList3';
var DISTRICT_ID = 'ctl00_ctl00_ctl00_ContentPlaceHolder1_ContentPlaceHolder1_ContentPlaceHolder1_ctrlProviceCityArea_DropDownList3';

var NAME_ID_FEIYANG = 'txtRece_name';
var PHONE_NUMBER_ID_FEIYANG = 'txtRece_mobilephone';
var COUNTRY_ID_FEIYANG = 'txtRece_country';
var PROVINCE_ID_FEIYANG = 'txtRece_province';
var CITY_ID_FEIYANG = 'txtRece_city';
var POSTAL_CODE_ID_FEIYANG = 'txtRece_postoffice';
var ADDRESS_ID_FEIYANG = 'txtRece_address';

var DIALOG_IFRAME_FEIYANG = '_DialogFrame_0';

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
    var firstTwoCharacters = provinceCityDistrict.substr(0, 2);
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
    var province = infoArray[0];
    var city = infoArray[1];
    var district = infoArray[2];
    
    // set province value and post it back to the server to get follow-up information of city
    var provinceDropdownList = document.getElementById(PROVINCE_ID);
    if (provinceDropdownList) {
        var provinceOptions = provinceDropdownList.options;
        var provinceValue;
        for (var i = 0; i < provinceOptions.length; ++i) {
            if (provinceOptions[i].text == province) {
                provinceValue = provinceOptions[i].value;
                break;
            }
        }
        provinceDropdownList.value = provinceValue;
        var execStrProvince = '__doPostBack(\'' + PROVINCE_NAME + '\',\'\')';
        setTimeout(execStrProvince, 0);
    }

    // set city value and post it back to the server to get follow-up information of district
    var cityDropdownList = document.getElementById(CITY_ID);
    if (cityDropdownList) {
        var cityOptions = cityDropdownList.options;
        var cityValue;
        for (var i = 0; i < cityOptions.length; ++i) {
            if (cityOptions[i].text == city) {
                cityValue = cityOptions[i].value;
                break;
            }
        }
        cityDropdownList.value = cityValue;
        var execStrCity = '__doPostBack(\'' + CITY_NAME + '\',\'\')';
        setTimeout(execStrCity, 0);
    }

    // set district value; no postBack needed
    var districtDropdownList = document.getElementById(DISTRICT_ID);
    if (districtDropdownList) {
        var districtOptions = districtDropdownList.options;
        var districtValue;
        for (var i = 0; i < districtOptions.length; ++i) {
            if (districtOptions[i].text == district) {
                districtValue = districtOptions[i].value;
                break;
            }
        }
        districtDropdownList.value = districtValue;
    }

    var addressBox = document.getElementById(ADDRESS_ID);
    if (addressBox) {
        addressBox.value = infoArray[3];
    }
    var postalCodeBox = document.getElementById(POSTAL_CODE_ID);
    if (postalCodeBox) { 
        postalCodeBox.value = infoArray[4];
    }
    var nameBox = document.getElementById(NAME_ID);
    if (nameBox) {
        nameBox.value = infoArray[5];
    }
    var phoneNumberBox = document.getElementById(PHONE_NUMBER_ID);
    if (phoneNumberBox) {
        phoneNumberBox.value = infoArray[6];
    }

    // for Feiyang Express:
    // Text boxes which need to be filled are inside the content document of the iframe of the dialog box.
    var documentFeiyang = document.getElementById(DIALOG_IFRAME_FEIYANG).contentDocument;
    if (documentFeiyang) {
        var nameBoxFeiyang = documentFeiyang.getElementById(NAME_ID_FEIYANG);
        if (nameBoxFeiyang) {
            nameBoxFeiyang.value = infoArray[5];
        }
        var phoneNumberBoxFeiyang = documentFeiyang.getElementById(PHONE_NUMBER_ID_FEIYANG);
        if (phoneNumberBoxFeiyang) {
            phoneNumberBoxFeiyang.value = infoArray[6];
        }
        var countryBoxFeiyang = documentFeiyang.getElementById(COUNTRY_ID_FEIYANG);
        if (countryBoxFeiyang) {
            countryBoxFeiyang.value = '中国';
        }
        var provinceBoxFeiyang = documentFeiyang.getElementById(PROVINCE_ID_FEIYANG);
        if (provinceBoxFeiyang) {
            provinceBoxFeiyang.value = province;
        }
        var cityBoxFeiyang = documentFeiyang.getElementById(CITY_ID_FEIYANG);
        if (cityBoxFeiyang) {
            cityBoxFeiyang.value = city;
        }
        var postalCodeBoxFeiyang = documentFeiyang.getElementById(POSTAL_CODE_ID_FEIYANG);
        if (postalCodeBoxFeiyang) {
            postalCodeBoxFeiyang.value = infoArray[4];
        }
        var addressBoxFeiyang = documentFeiyang.getElementById(ADDRESS_ID_FEIYANG);
        if (addressBoxFeiyang) {
            addressBoxFeiyang.value = district + ' ' + infoArray[3];  // district + address
        }
    }
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



