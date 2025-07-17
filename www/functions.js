
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
    value = form.elements["poiFileName"].value;
    if (value) actionJson.poi_file_name = value;
    value = form.elements["gpxFileContent"].value;
    if (value) actionJson.gpx = value;
    value = form.elements["regTime"].value;
    if (value) actionJson.reg_time = value;
    let actionJsonStr = JSON.stringify(actionJson);
    //alert(actionJsonStr);
    return actionJsonStr;
}

function createNewRecord() {
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
}

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
function deleteRecord(id) {
    if (id) {
        actionId = id;
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
