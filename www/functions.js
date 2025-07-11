
function createRecord() {
    body = JSON.stringify({
        poi_name: "poi-name" + Math.floor(Math.random() * 10001),
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

function deleteRecord(id) {
    $.ajax({
        url: "users/" + id, // The URL to send the request to
        type: "DELETE", // The HTTP method (POST)
        dataType: "json", // Expected data type of the response from the server
        success: function (response) {
            console.log("Success:", response);
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
        }
    });
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
