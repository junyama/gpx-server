


let CurrentPage = 1;
let Limit = 10;
let PageMenuLength = 10;
let GpxSample;

function initPage() {
    loadDb((CurrentPage - 1) * Limit, Limit);
    checkbox = $('table tbody input[type="checkbox"]');
    $("#selectAll").click(function () {
        if (this.checked) {
            checkbox.each(function () {
                this.checked = true;
            });
        } else {
            checkbox.each(function () {
                this.checked = false;
            });
        }
    });
    checkbox.click(function () {
        if (!this.checked) {
            $("#selectAll").prop("checked", false);
        }
    });
    createPageMenu(PageMenuLength);
    /*
    document.getElementById("nextButtonId").addEventListener('click', nextImg);
    document.getElementById("lastButtonId").addEventListener('click', lastImg);
    document.getElementById("playButtonId").addEventListener('click', startPlayImg);
    document.getElementById("reverseButtonId").addEventListener('click', startReverseImg);
    */
    $.ajax({
        type: "GET",
        url: '/gpxSample.gpx',
        success: function (responseXML) {
            const serializer = new XMLSerializer();
            GpxSample = serializer.serializeToString(responseXML);
            //GpxSample = responseXML;
        },
        error: function (json) {
            if (json.responseJSON)
                alert(json.responseJSON.message);
            else
                alert(json.statusText);
        }
    });
    numberOfRecords();

    const text_form = document.getElementById("keyWord");
    text_form.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const btn_search = document.getElementById("btn_search");
            btn_search.dispatchEvent(new PointerEvent("click"));  // clickイベントを発生させて、送り込む
            e.preventDefault();  // Enterキー入力を他に伝搬させないために
        }
        return false;
    });

}

function applyFilter() {
    Filter = true;
    document.getElementById("numberOfRecordsButtonId").value = "Number of Filtered Records";
    loadDb((CurrentPage - 1) * Limit, Limit);
    document.getElementById("numEntryId").value = "-----";
    numberOfRecords();
}

function createFilterJsonStr(index) {
    /*
    let chickIdValue = document.getElementById("poiNameFilterId").value;
    if (!chickIdValue) chickIdValue = 0;
    let userIdValue = document.getElementById("prefectureFilterId").value;
    if (!userIdValue) userIdValue = 0;
    let scoreValue = document.getElementById("cityFilterId").value;
    if (!scoreValue) scoreValue = 0;
    */
    let json = actionJson;

    /*
    let value = document.getElementById("poiNameFilterId").value;
    if (value) json.poi_namae = value;
    else json.poi_namae = "*";
    json.address1 = document.getElementById("prefectureFilterId").value;
    value = document.getElementById("cityFilterId").value;
    if (value) json.address2 = value;
    else json.address2 = "*";
    value = document.getElementById("townFilterId").value;
    if (value) json.address3 = value;
    else json.address3 = "*";
    json.category = document.getElementById("categoryFilterId").value;
    json.icon_id = Number(document.getElementById("iconFilterId").value);

    json.reg_time = "*";
    json.usename = "*";
    json.zip = "*";
    json.poi_file_name = "*";
    json.latitude = "*";
    json.longtitude = "*";
    json.id = 0;
    json.gpx = "*";
    */

    return JSON.stringify(json);
}

let Filter = false;
function loadDb(offset, limit) {
    document.getElementById("tableBody").innerHTML = '';
    if (Filter)
        $.ajax({
            type: "POST",
            url: '/selectRecords/offset/' + offset + '/limit/' + limit,
            data: createFilterJsonStr(),
            async: false,
            success: function (json) {
                PageIndexArray = [];
                for (var i = 0; i < json.items.length; i++) {
                    addRow(json.items[i], i);
                }
                checkbox = $('table tbody input[type="checkbox"]');
            },
            error: function (json) {
                alert(json.responseJSON.message);
            }
        });
    else $.ajax({
        type: "GET",
        url: '/users/offset/' + offset + '/limit/' + limit,
        async: false,
        success: function (json) {
            PageIndexArray = [];
            for (var i = 0; i < json.items.length; i++) {
                addRow(json.items[i], i);
            }
            console.log("PageIndexArray: " + PageIndexArray);
            checkbox = $('table tbody input[type="checkbox"]');
        },
        error: function (json) {
            if (json.responseJSON)
                alert(json.responseJSON.message);
            else
                alert(json.statusText);
        }
    });
}

function createRow(json) {
    var tr = document.createElement("tr");
    var td = document.createElement('td');
    td.innerHTML = '<span class="custom-checkbox"><input type="checkbox" id="checkbox' + json.id + '" name="options[]" value="1"><label for="checkbox' + json.id + '"></label></span>';
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = json.id;
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = json.poi_name;
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = json.latitude;
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = json.longtitude;
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = json.address1;
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = json.address2;
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = json.address3;
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = json.zip;
    tr.appendChild(td);
    td = document.createElement('td');
    var category;
    switch (json.category) {
        case "CAT_TRAVEL": category = "観光地";
            break;
        case "CAT_CAR": category = "車";
            break;
        case "CAT_THEATER": category = "劇場";
            break;
        case "CAT_SHOPPING": category = "ショッピング";
            break;
        case "CAT_BUSINESS": category = "仕事";
            break;
        case "CAT_TEMPLE": category = "神社、仏閣";
            break;
        case "CAT_MUSEUM": category = "美術館、博物館";
            break;
        case "CAT_HOTEL": category = "ホテル、旅館";
            break;
        case "CAT_HOSPITAL": category = "病院";
            break;
        case "CAT_GOVERMENT": category = "役所";
            break;
        case "CAT_RESTAURANT": category = "レストラン";
            break;
        case "CAT_OTHERS": category = "その他";
            break;
        default: category = "Unknown";
    }
    td.innerHTML = category;
    tr.appendChild(td);
    td = document.createElement('td');
    let iconId;
    switch (json.icon_id) {
        case 1: iconId = "目的地＠";
            break;
        case 6: iconId = "カメラ";
            break;
        case 7: iconId = "ハート";
            break;
        case 11: iconId = "レストラン";
            break;
        case 12: iconId = "マップピン";
            break;
        case 13: iconId = "車";
            break;
        case 14: iconId = "ホテル";
            break;
        case 15: iconId = "ショッピング";
            break;
        case 19: iconId = "目的地";
            break;
        default: iconId = "Unknown";
    }
    td.innerHTML = iconId;
    tr.appendChild(td);
    td = document.createElement('td');
    if (json.poi_file_name)
        td.innerHTML = json.poi_file_name;
    else
        td.innerHTML = "POI_" + json.latitude + "x" + json.longtitude + ".gpx";
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = json.reg_time;
    tr.appendChild(td);

    td = document.createElement('td');
    let str;
    str = '<button type="button" class="bi bi-pencil-fill" data-bs-toggle="modal" data-bs-target="#editEmployeeModal" style="margin-right: 10px; background: transparent; border: 0; font-size: 16px; color: orange"';
    str = str + ' onClick="editRecord(' + json.id + ')">';
    str = str + '</button>';
    str = str + '<button type="button" class="bi bi-trash-fill" data-bs-toggle="modal" data-bs-target="#deleteEmployeeModal" style="background: transparent; border: 0; font-size: 16px; color: red"';
    str = str + ' onClick="deleteRecord(' + json.id + ')">';
    str = str + '</button>';
    td.innerHTML = str;
    tr.appendChild(td);
    console.log(tr);
    return tr;
    //document.getElementById("tableBody").appendChild(tr);
}

function addRow(json, i) {
    document.getElementById("tableBody").appendChild(createRow(json, i));
}

function addRow2(json, i) {

    //PageIndexArray.push(json.id); //added

    var tr = document.createElement("tr");
    var td = document.createElement('td');
    td.innerHTML = '<span class="custom-checkbox"><input type="checkbox" id="checkbox' + json.id + '" name="options[]" value="1"><label for="checkbox' + json.id + '"></label></span>';
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = json.id;
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = json.poi_name;
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = json.latitude;
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = json.longtitude;
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = json.address1;
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = json.address2;
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = json.address3;
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = json.zip;
    tr.appendChild(td);
    td = document.createElement('td');
    var category;
    switch (json.category) {
        case "CAT_TRAVEL": category = "観光地";
            break;
        case "CAT_CAR": category = "車";
            break;
        case "CAT_THEATER": category = "劇場";
            break;
        case "CAT_SHOPPING": category = "ショッピング";
            break;
        case "CAT_BUSINESS": category = "仕事";
            break;
        case "CAT_TEMPLE": category = "神社、仏閣";
            break;
        case "CAT_MUSEUM": category = "美術館、博物館";
            break;
        case "CAT_HOTEL": category = "ホテル、旅館";
            break;
        case "CAT_HOSPITAL": category = "病院";
            break;
        case "CAT_GOVERMENT": category = "役所";
            break;
        case "CAT_RESTAURANT": category = "レストラン";
            break;
        case "CAT_OTHERS": category = "その他";
            break;
        default: category = "Unknown";
    }
    td.innerHTML = category;
    tr.appendChild(td);
    td = document.createElement('td');
    let iconId;
    switch (json.icon_id) {
        case 1: iconId = "目的地＠";
            break;
        case 6: iconId = "カメラ";
            break;
        case 7: iconId = "ハート";
            break;
        case 11: iconId = "レストラン";
            break;
        case 12: iconId = "マップピン";
            break;
        case 13: iconId = "車";
            break;
        case 14: iconId = "ホテル";
            break;
        case 15: iconId = "ショッピング";
            break;
        case 19: iconId = "目的地";
            break;
        default: iconId = "Unknown";
    }
    td.innerHTML = iconId;
    tr.appendChild(td);
    td = document.createElement('td');
    if (json.poi_file_name)
        td.innerHTML = json.poi_file_name;
    else
        td.innerHTML = "POI_" + json.latitude + "x" + json.longtitude + ".gpx";
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = json.reg_time;
    tr.appendChild(td);

    td = document.createElement('td');
    let str;
    str = '<button type="button" class="bi bi-pencil-fill" data-bs-toggle="modal" data-bs-target="#editEmployeeModal" style="margin-right: 10px; background: transparent; border: 0; font-size: 16px; color: orange"';
    str = str + ' onClick="editRecord(' + json.id + ')">';
    str = str + '</button>';
    str = str + '<button type="button" class="bi bi-trash-fill" data-bs-toggle="modal" data-bs-target="#deleteEmployeeModal" style="background: transparent; border: 0; font-size: 16px; color: red"';
    str = str + ' onClick="deleteRecord(' + json.id + ')">';
    str = str + '</button>';
    td.innerHTML = str;
    tr.appendChild(td);
    console.log(tr);
    document.getElementById("tableBody").appendChild(tr);
}

/*
function deleteUser(id) {
    if (id) {
        actionId = id;
    } else if (actionId) {
        $.ajax({
            type: "DELETE",
            url: '/images/' + actionId,
            success: function (json) {
                loadDb((CurrentPage - 1) * Limit, Limit);
                //document.getElementById("numEntryId").innerHTML = 'Showing <b>' + Limit + '</b> out of <b>' + (--NumEntry) + '</b> entries';
            },
            error: function (json) {
                alert(json.responseJSON.message);
            }
        });
        actionId = "";
    } else {
        //document.getElementById('selectAll').checked = false;
        deleteCheckedUsers(0, document.getElementById("tableBody").childElementCount);
    }
}
*/

function deleteCheckedUsers(i, count) {
    if (i < count) {
        //var elem = document.getElementById("tableBody");
        //for (var i = 0; i < elem.childElementCount; i++) {
        if (checkbox[i].checked) {
            var id = document.getElementById("tableBody").children[i].children[1].innerText;
            $.ajax({
                type: "DELETE",
                url: '/users/' + id,
                async: false,
                success: function (json) {
                    //setTimeout(deleteCheckedUsers(++i, count), 500);
                    deleteCheckedUsers(++i, count);
                    //loadDb((CurrentPage - 1) * 5, 5);
                    checkbox = $('table tbody input[type="checkbox"]');
                    //document.getElementById("numEntryId").innerHTML = 'Showing <b>' + Limit + '</b> out of <b>' + (--NumEntry) + '</b> entries';
                },
                error: function (json) {
                    alert(json.responseJSON.message);
                }
            });
        } else deleteCheckedUsers(++i, count);

    } else {
        document.getElementById('selectAll').checked = false;
        //setTimeout(loadDbByKey((CurrentPage - 1) * Limit, Limit), 500);
        //setTimeout(loadDb((CurrentPage - 1) * Limit, Limit), 500);
        loadDb((CurrentPage - 1) * Limit, Limit);
    }
    numberOfRecords();
}

function numberOfRecords() {
    document.getElementById("numEntryId").value = "wait for the number showing up";
    if (!Filter)
        $.ajax({
            type: "GET",
            url: '/getNumberOfRecords',
            async: false,
            success: function (json) {
                document.getElementById("numEntryId").value = json.count;
                //getIndexRange();
            },
            error: function (json) {
                alert(json.responseJSON.message);
            }
        });
    else {
        let chickIdValue = document.getElementById("chickIdFilterId").value;
        if (!chickIdValue) chickIdValue = 0;
        let userIdValue = document.getElementById("userIdFilterId").value;
        if (!userIdValue) userIdValue = 0;
        $.ajax({
            type: "POST",
            url: '/getNumberOfFilteredRecords',
            data: createFilterJsonStr(),
            async: false,
            success: function (jsonStr) {
                let count = JSON.parse(jsonStr)[0]['count(*)'];
                document.getElementById("numEntryId").value = count;
                getIndexRange();
            },
            error: function (json) {
                alert(json.responseJSON.message);
            }
        });
    }
}

function menuIndex(page, numberOfMenu) {
    var mod = page % numberOfMenu;
    if (mod == 0) return mod + PageMenuLength;
    else return mod;
}

function createPageMenu(pageMenuLenght) {
    var pageMenuEle = document.getElementById("pageMenu");
    pageMenuEle.innerHTML = "";

    var liEle = document.createElement('li');
    liEle.classList = "page-item disabled";
    liEle.innerHTML = '<a class="page-link" id="firstPageButtonId" href="#">&#x23ee</a>';
    liEle.children[0].onclick = function () { pageJump(1) };
    pageMenuEle.appendChild(liEle);

    liEle = document.createElement('li');
    liEle.classList = "page-item disabled";
    liEle.innerHTML = '<a class="page-link" id="previousPageButtonId" href="#">&#x23f4</a>';
    liEle.children[0].onclick = function () { pageJump('p') };
    pageMenuEle.appendChild(liEle);

    for (var i = 1; i < pageMenuLenght + 1; i++) {
        var liEle = document.createElement('li');
        if (i == 1) liEle.classList = "page-item active disabled";
        else liEle.classList = "page-item";
        liEle.innerHTML = '<a class="page-link" href="#" onclick="pageJump(' + i + ')">' + i + '</a>';
        pageMenuEle.appendChild(liEle);
    }
    liEle = document.createElement('li');
    liEle.classList = "page-item";
    liEle.innerHTML = '<a class="page-link" id="nextPageButtonId" href="#">&#x23f5</a>';
    liEle.children[0].onclick = function () { pageJump('n') };
    pageMenuEle.appendChild(liEle);
    var liEle = document.createElement('li');
    liEle.classList = "page-item";
    liEle.innerHTML = '<a class="page-link" id="lastPageButtonId" href="#">&#x23ed</a>';
    liEle.children[0].onclick = function () { pageJump('l') };
    pageMenuEle.appendChild(liEle);
    liEle = document.createElement('li');
    liEle.classList = "page-item";
    liEle.innerHTML = '<a class="page-link">Jump page</a>';
    liEle.children[0].onclick = function () { pageJump('?') };
    pageMenuEle.appendChild(liEle);
    liEle = document.createElement('li');
    liEle.innerHTML = '<input type="text" id="jumpInputId" style="width: 80px;font-size: medium;"></>';
    pageMenuEle.appendChild(liEle);
    document.getElementById("jumpInputId").onchange = function () { pageJump('?') };
}

function pageJump(page) {
    if (CurrentPage != page) {
        if (CurrentPage == 1) {
            document.getElementById("pageMenu").children[0].classList.remove("disabled");
            document.getElementById("pageMenu").children[1].classList.remove("disabled");
        }
        else if (page == 1) {
            document.getElementById("pageMenu").children[0].classList.add("disabled");
            document.getElementById("pageMenu").children[1].classList.add("disabled");
        }
        switch (page) {
            case "p":
                if (menuIndex(CurrentPage, PageMenuLength) == 1) {
                    decrementPageMenu(CurrentPage);
                }
                if (CurrentPage != 1) pageJump(CurrentPage - 1);
                break;
            case "n":
                if (menuIndex(CurrentPage, PageMenuLength) == PageMenuLength) {
                    incrementPageMenu(CurrentPage);
                }
                pageJump(CurrentPage + 1);
                break;
            case "?":
                let jumpPage = document.getElementById('jumpInputId').value;
                if (jumpPage) pageJump(Number(jumpPage));
                break;
            case "@":
                pageJump(Math.floor(showImageID / Limit) + 1);
                break;
            case "l":
                numberOfRecords();
                let numEntry = Number(document.getElementById("numEntryId").value);
                let lastPage = Math.floor(numEntry / Limit);
                if (numEntry % Limit != 0) lastPage++;
                pageJump(lastPage);
                break;
            default:
                //loadDbByKey((page - 1) * Limit, Limit);
                loadDb((page - 1) * Limit, Limit);
                document.getElementById("pageMenu").children[menuIndex(CurrentPage, PageMenuLength) + 1].classList.remove("active", "disabled");
                jumpPageMenu(page);
                document.getElementById("pageMenu").children[menuIndex(page, PageMenuLength) + 1].classList.add("active", "disabled");
                //event.currentTarget.parentElement.classList.add('active');
                CurrentPage = page;
        }
        document.getElementById('selectAll').checked = false;
    }
}

function incrementPageMenu(lastPge) {
    for (var i = 1; i < PageMenuLength + 1; i++) {
        var pageNum = lastPge + i;
        document.getElementById("pageMenu").children[i + 1].innerHTML = '<a class="page-link" href="#" onclick="pageJump(' + pageNum + ')">' + pageNum + '</a>';
    }
}

function decrementPageMenu(firstPage) {
    if (firstPage != 1)
        for (var i = 1; i < PageMenuLength + 1; i++) {
            var pageNum = firstPage - PageMenuLength - 1 + i;
            document.getElementById("pageMenu").children[i + 1].innerHTML = '<a class="page-link" href="#" onclick="pageJump(' + pageNum + ')">' + pageNum + '</a>';
            //document.getElementById("pageMenu").children[i].children[0].innerHTML = firstPage - PageMenuLength - 1 + i;
        }
}

function jumpPageMenu(jumpPage) {
    for (var i = 1; i < PageMenuLength + 1; i++) {
        var pageNum = jumpPage - menuIndex(jumpPage, PageMenuLength) + i;
        document.getElementById("pageMenu").children[i + 1].innerHTML = '<a class="page-link" href="#" onclick="pageJump(' + pageNum + ')">' + pageNum + '</a>';
    }
}

function readGpx(event) {
    const files = event.target.files;
    for (i = 0; i < files.length; i++) {
        document.forms["createUser"].elements["poiFileName"].value = files[i].name;
        const reader = new FileReader();
        reader.onload = function (e) {
            const fileContent = e.target.result;
            console.log(fileContent);
            importGpx(fileContent, "createUser");
            //document.getElementById(outputTextArea).value = data;        
            document.getElementById("addButtonId").dispatchEvent(new PointerEvent("click"));

        };
        reader.readAsText(files[i]);
        //alert(files[i].name + " loaded");

        //reader.readAsDataURL(file);
    }
}

function importGpx(xmlString, formName) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

    // パース結果の検証
    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        // エラー処理
        console.error('XMLのパースエラー');
    } else {
        // 取得したDOMオブジェクトの操作
        let form = document.forms[formName];
        form.elements['gpxFileContent'].value = xmlString;
        let element = xmlDoc.getElementsByTagName("gpx:name")[0];
        form.elements["poiName"].value = element.innerHTML;
        element = xmlDoc.getElementsByTagName("gpxd:Address")[0];
        form.elements["address1"].value = element.getAttribute("State");
        form.elements["address2"].value = element.getAttribute("City");
        form.elements["address3"].value = element.getAttribute("CityCenter");
        form.elements["zip"].value = element.getAttribute("ZIP");
        element = xmlDoc.getElementsByTagName("gpx:wpt")[0];
        form.elements["latitude"].value = element.getAttribute("lat");
        form.elements["longtitude"].value = element.getAttribute("lon");
        element = xmlDoc.getElementsByTagName("time")[0];
        if (element) form.elements["regTime"].value = element.innerHTML;
        element = xmlDoc.getElementsByTagName("gpxd:WptIconId")[0];
        form.elements["iconId"].value = element.getAttribute("IconId");
        element = xmlDoc.getElementsByTagName("gpxd:POICategory")[0];
        switch (element.getAttribute("Cat")) {
            case "観光地":
                form.elements["category"].value = 'CAT_TRAVEL';
                break;
            case "車":
                form.elements["category"].value = 'CAT_CAR';
                break;
            case "劇場":
                form.elements["category"].value = 'CAT_THEATER';
                break;
            case "ショッピング":
                form.elements["category"].value = 'CAT_SHOPPING';
                break;
            case "仕事":
                form.elements["category"].value = 'CAT_BUSINESS';
                break;
            case "神社・仏閣":
                form.elements["category"].value = 'CAT_TEMPLE';
                break;
            case "美術館・博物館":
                form.elements["category"].value = 'CAT_MUSEUM';
                break;
            case "ホテル・旅館":
                form.elements["category"].value = 'CAT_HOTEL';
                break;
            case "病院":
                form.elements["category"].value = 'CAT_HOSPITAL';
            case "役所":
                form.elements["category"].value = 'CAT_GOVERMENT';
            case "レストラン":
                form.elements["category"].value = 'CAT_RESTAURANT';
            default:
                form.elements["category"].value = 'CAT_OTHERS';
        }
    }
}

function updateGpx(form) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(GpxSample, 'application/xml');

    // パース結果の検証
    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        // エラー処理
        console.error('XMLのパースエラー');
    } else {
        // 取得したDOMオブジェクトの操作
        let element = xmlDoc.getElementsByTagName("gpx:name")[0];
        element.innerHTML = form.elements["poiName"].value;
        element = xmlDoc.getElementsByTagName("gpxd:Address")[0];
        element.setAttribute("State", form.elements["address1"].value);
        element.setAttribute("City", form.elements["address2"].value);
        element.setAttribute("CityCenter", form.elements["address3"].value);
        element.setAttribute("ZIP", form.elements["zip"].value);

        element = xmlDoc.getElementsByTagName("gpx:wpt")[0];
        element.setAttribute("lat", form.elements["latitude"].value);
        element.setAttribute("lon", form.elements["longtitude"].value);
        element = xmlDoc.getElementsByTagName("time")[0];
        element.innerHTML = form.elements["regTime"].value;
        element = xmlDoc.getElementsByTagName("gpxd:WptIconId")[0];
        element.setAttribute("IconId", form.elements["iconId"].value);

        element = xmlDoc.getElementsByTagName("gpxd:WptIconId")[0];
        element.setAttribute("IconId", form.elements["iconId"].value);
        element = xmlDoc.getElementsByTagName("gpxd:POICategory")[0];

        switch (form.elements["category"].value) {
            case "CAT_TRAVEL":
                element.setAttribute("Cat", "観光地");
                break;
            case "CAT_CAR":
                element.setAttribute("Cat", "車");
            case "CAT_THEATER":
                element.setAttribute("Cat", "劇場");
                break;
            case "CAT_SHOPPING":
                element.setAttribute("Cat", "ショッピング");
                break;
            case "CAT_BUSINESS":
                element.setAttribute("Cat", "仕事");
                break;
            case "CAT_TEMPLE":
                element.setAttribute("Cat", "神社・仏閣");
                break;
            case "CAT_MUSEUM":
                element.setAttribute("Cat", "美術館・博物館");
                break;
            case "CAT_HOSPITAL":
                element.setAttribute("Cat", "病院");
                break;
            case "CAT_GOVERMENT":
                element.setAttribute("Cat", "役所");
                break;
            case "CAT_RESTAURANT":
                element.setAttribute("Cat", "レストラン");
                break;
            default:
                element.setAttribute("Cat", "その他");
        }

        const serializer = new XMLSerializer();
        form.elements['gpxFileContent'].value = serializer.serializeToString(xmlDoc);
    }

}

function getRegTime() {
    let dateT = new Date;
    //let date = dateT.getFullYear() + "-" + dateT.getMonth() + "-" + dateT.getDay() + "-";
    //let time = dateT.getHours() + ":" + dateT.getMinutes() + ":" + dateT.getSeconds();
    return dateT.toLocaleString();
}

function exportGpx() {
    $.ajax({
        type: "GET",
        url: '/exportGpx',
        async: false,
        success: function (text) {
            console.log(text);
        },
        error: function (json) {
            if (json.responseJSON)
                alert(json.responseJSON.message);
            else
                alert(json.statusText);
        }
    });
}

/*
function exportGpx() {
    let offset = 0;
    const limit = 10;
    let itemLength = 10;
    while (itemLength > 0) {
        $.ajax({
            type: "GET",
            url: '/users/offset/' + offset + '/limit/' + limit,
            async: false,
            success: function (json) {
                //PageIndexArray = [];
                itemLength = json.items.length;
                for (var i = 0; i < itemLength; i++) {
                    console.log(json.items[i].poi_file_name);
                    console.log(json.items[i].gpx);
                }
                offset += limit;
                //console.log("PageIndexArray: " + PageIndexArray);
                //checkbox = $('table tbody input[type="checkbox"]');
            },
            error: function (json) {
                if (json.responseJSON)
                    alert(json.responseJSON.message);
                else
                    alert(json.statusText);
            }
        });
    }
*/