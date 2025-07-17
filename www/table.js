


let CurrentPage = 1;
let Limit = 10;
let PageMenuLength = 10;

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
}

let Filter = false;
function loadDb(offset, limit) {
    document.getElementById("tableBody").innerHTML = '';
    if (Filter)
        $.ajax({
            type: "POST",
            url: '/selectImages/offset/' + offset + '/limit/' + limit,
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

function addRow(json, i) {

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
    str = str + ' onClick="editUser(' + json.id + ')">';
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
    const file = event.target.files[0];
    document.forms["createUser"].elements["poiFileName"].value = file.name;
    const reader = new FileReader();
    reader.onload = function (e) {
        const fileContent = e.target.result;
        console.log(fileContent);
        gpxParser(fileContent);
        //document.getElementById(outputTextArea).value = data;
    };
    reader.readAsText(file);
    //reader.readAsDataURL(file);
}

function gpxParser(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

    // パース結果の検証
    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        // エラー処理
        console.error('XMLのパースエラー');
    } else {
        // 取得したDOMオブジェクトの操作
        let form = document.forms["createUser"];
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
