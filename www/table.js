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
    str = str + ' onClick="deleteUser(' + json.id + ')">';
    str = str + '</button>';
    td.innerHTML = str;
    tr.appendChild(td);
    console.log(tr);
    document.getElementById("tableBody").appendChild(tr);
}