
function createRecord() {
    body = JSON.stringify({
        poi_name: "poi-name" + Math.floor(Math.random() * 100001),
        latitude: "111.1111",
        longtitude: "22.2222",
        address1: "address1",
        address2: "address2",
        address3: "address3",
        zip: "243-0211",
        category: "CAT_HOTEL",
        icon_id: 14,
        poi_file_name: "POI_111.1111x22.2222.gpx|",
        reg_time: "2025-01-11-16:59:55",
        gpx: "<>"


    });
    $.ajax({
        url: "users", // The URL to send the request to
        type: "POST", // The HTTP method (POST)
        async: false,
        data: body, // The data to send, often JSON stringified
        contentType: "application/json; charset=utf-8", // Specifies the content type of the data being sent
        dataType: "json", // Expected data type of the response from the server
        success: function (response) {
            console.log("Success:", response);
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
        }
    });
}

let actionJson = {};
function userDtoStr(formName) {
    let form = document.forms[formName];
    let value = form.elements["poiName"].value
    if (value) actionJson.poi_name = value;
    value = form.elements["latitude"].value
    if (value) actionJson.latitude = value;
    value = form.elements["longtitude"].value;
    if (value) actionJson.longtitude = value;
    value = form.elements["address1"].value;
    if (value) actionJson.address1 = value;
    value = form.elements["address2"].value;
    if (value) actionJson.address2 = value;
    value = form.elements["address3"].value;
    if (value) actionJson.address3 = value;
    value = form.elements["zip"].value;
    if (value) actionJson.zip = value;
    value = form.elements["category"].value;
    if (value) actionJson.category = value;
    value = form.elements["iconId"].value;
    if (value) actionJson.icon_id = Number(value);
    //value = form.elements["poiFileName"].value;
    value = "POI_" + actionJson.latitude + "x" + actionJson.longtitude + ".gpx";
    if (value) actionJson.poi_file_name = value;
    value = form.elements["regTime"].value;
    if (value) actionJson.reg_time = value;
    updateGpx(form);
    value = form.elements["gpxFileContent"].value;
    //if (!value) form.elements["gpxFileContent"].value = GpxSample;
    //value = form.elements["gpxFileContent"].value;
    if (value) actionJson.gpx = value;
    let actionJsonStr = JSON.stringify(actionJson);
    //alert(actionJsonStr);
    return actionJsonStr;
}

function createNewRecord() {
    try {
        $.ajax({
            type: "POST",
            url: '/users/',
            data: userDtoStr("createUser"),
            async: false,
            contentType: "application/json; charset=utf-8", // Specifies the content type of the data being sent
            dataType: "json", // Expected data type of the response from the server
            success: function (json) {
                loadDb((CurrentPage - 1) * Limit, Limit);
                checkbox = $('table tbody input[type="checkbox"]');
                //document.getElementById("numEntryId").innerHTML = 'Showing <b>' + Limit + '</b> out of <b>' + (++NumEntry) + '</b> entries';
            },
            error: function (json) {
                alert(json.responseJSON.message);
            }
        });
        pageJump("l");
    }
    catch (error) {
        console.error(error.message);
    }
    numberOfRecords();
}

/*
function updateRecord(id) {
    $.ajax({
        url: "users/" + id, // The URL to send the request to
        type: "GET", // The HTTP method (POST)
        dataType: "json", // Expected data type of the response from the server
        success: function (response) {
            console.log("Success:", response);
            response.password = "pass" + Math.floor(Math.random() * 101);
            $.ajax({
                url: "users/" + id, // The URL to send the request to
                type: "PUT", // The HTTP method (POST)
                data: JSON.stringify(response), // The data to send, often JSON stringified
                contentType: "application/json; charset=utf-8", // Specifies the content type of the data being sent
                dataType: "json", // Expected data type of the response from the server
                success: function (response) {
                    console.log("Success:", response);
                },
                error: function (xhr, status, error) {
                    console.error("Error:", error);
                }
            });
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
        }
    });
}
*/

function editRecord(id) {
    if (id) {
        actionId = id;
        var elem = document.getElementById("tableBody");
        for (var i = 0; i < elem.childElementCount; i++) {
            if (elem.children[i].children[1].innerText == id) {
                $.ajax({
                    type: "GET",
                    url: '/users/' + id,
                    async: false,
                    success: function (json) {
                        actionJson = json;
                        var form = document.forms["editUserForm"];
                        form.elements["poiName"].value = json.poi_name;
                        form.elements["latitude"].value = json.latitude;
                        form.elements["longtitude"].value = json.longtitude;
                        form.elements["address1"].value = json.address1;
                        form.elements["address2"].value = json.address2;
                        form.elements["address3"].value = json.address3;
                        form.elements["zip"].value = json.zip;
                        form.elements["category"].value = json.category;
                        form.elements["iconId"].value = json.icon_id;
                        form.elements["poiFileName"].value = json.poi_file_name;
                        form.elements["gpxFileContent"].value = json.gpx;
                        form.elements["regTime"].value = json.reg_time;
                    },
                    error: function (json) {
                        alert(json.responseJSON.message);
                    }
                });
                break;
            }
        }
    } else if (actionId)
        $.ajax({
            type: "PUT",
            url: '/users/' + actionId,
            data: userDtoStr("editUserForm"),
            contentType: "application/json; charset=utf-8", // Specifies the content type of the data being sent
            dataType: "json", // Expected data type of the response from the server
            async: false,
            success: function (json) {
                var elem = document.getElementById("tableBody");
                for (var i = 0; i < elem.childElementCount; i++) {
                    if (elem.children[i].children[1].innerText == actionId) {
                        elem.children[i].replaceWith(createRow(json));
                        /*
                        elem.children[i].children[2].innerText = json.poi_name;
                        elem.children[i].children[3].innerText = json.latitude;
                        elem.children[i].children[4].innerText = json.longtitude;
                        elem.children[i].children[5].innerText = json.address1;
                        elem.children[i].children[6].innerText = json.address2;
                        elem.children[i].children[7].innerText = json.address3;
                        elem.children[i].children[8].innerText = json.zip;
                        switch (json.category) {
                            case -1: elem.children[i].children[9].innerText = "Unkown";
                                break;
                            case 0: elem.children[i].children[9].innerText = "Female";
                                break;
                            case 1: elem.children[i].children[9].innerText = "Male";
                                break;
                        }
                        switch (json.icon_id) {
                            case -1: elem.children[i].children[19].innerText = "Unkown";
                                break;
                            case 0: elem.children[i].children[10].innerText = "Female";
                                break;
                            case 1: elem.children[i].children[10].innerText = "Male";
                                break;
                        }
                        elem.children[i].children[11].innerText = json.poi_file_name;
                        elem.children[i].children[12].innerText = json.reg_time;
                        */
                        break;
                    }
                }
                actionId = "";
                //actionJson = "";

            },
            error: function (json) {
                alert(json.responseJSON.message);
            }
        });
    //else editCheckedUsers(0, document.getElementById("tableBody").childElementCount);
}

function getRecord(id) {
    $.ajax({
        url: "users/" + id, // The URL to send the request to
        type: "GET", // The HTTP method (POST)
        dataType: "json", // Expected data type of the response from the server
        success: function (response) {
            console.log("Success:", response);
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
        }
    });
}

function getRecords(offset, limit) {
    $.ajax({
        url: "users/offset/" + offset + "/limit/" + limit, // The URL to send the request to
        type: "GET", // The HTTP method (POST)
        dataType: "json", // Expected data type of the response from the server
        success: function (response) {
            console.log("Success:", response);
            for (var i = 0; i < response.items.length; i++) {
                addRow(response.items[i], i);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
        }
    });
}

let actionId;
function deleteRecord(id, elem) {
    if (id) {
        actionId = id;
        let poiName = elem.parentElement.parentElement.children[2].innerHTML;
        document.getElementById("deleteRecordsId").innerHTML = poiName;
    } else if (actionId) {
        $.ajax({
            url: "users/" + actionId, // The URL to send the request to
            type: "DELETE", // The HTTP method (POST)
            async: false,
            dataType: "json", // Expected data type of the response from the server
            success: function (response) {
                console.log("Success:", response);
                loadDb((CurrentPage - 1) * Limit, Limit);
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
                alert(json.responseJSON.message);
            }
        });
        actionId = "";
    } else {
        deleteCheckedUsers(0, document.getElementById("tableBody").childElementCount);
    }
    numberOfRecords();
}

/*
function registerPoi() {
    let form = document.forms["createUser"];
    form.elements["poiName"].value = document.getElementById('POIName').value;
    form.elements["latitude"].value = document.getElementById('latitude').value;
    form.elements["longtitude"].value = document.getElementById('longtitude').value;
    form.elements["poiFileName"].value = document.getElementById('POIFileName').value;
    form.elements["zip"].value = document.getElementById('zipCode').value;
    form.elements["address1"].value = document.getElementById('state').value;
    form.elements["address2"].value = document.getElementById('city').value;
    form.elements["address3"].value = document.getElementById('exCity').value;
    document.getElementById("addButtonId").dispatchEvent(new PointerEvent("click"));
    console.log("add button clicked");
}
*/

function registerPOI() {
    let form = document.forms["createUser"];
    let value = document.getElementById("poiNameInputId").value;
    form.elements["poiName"].value = value;
    value = document.getElementById("categorySelectorId").value;
    form.elements["category"].value = value;
    value = document.getElementById("iconSelectorId").value;
    form.elements["iconId"].value = value;
    form.elements["regTime"].value = getRegTime();

    document.getElementById("addButtonId").dispatchEvent(new PointerEvent("click"));
    numberOfRecords();
}

/*
function createRecordFetch() {
    body = JSON.stringify({
        username: "user-" + i++,
        email: "user@gmail.com",
        password: "pass",
        role: "ROLE_GUEST"
    });
    fetch("users", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    })
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}
*/

