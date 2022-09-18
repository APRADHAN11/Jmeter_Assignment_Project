/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 92.3076923076923, "KoPercent": 7.6923076923076925};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7075163398692811, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-2"], "isController": false}, {"data": [0.8, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7/screen/personal/attachments?limit=50&offset=0"], "isController": false}, {"data": [0.1, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-7"], "isController": false}, {"data": [0.5, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7"], "isController": false}, {"data": [0.8, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7"], "isController": false}, {"data": [0.975, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/core/i18n/messages"], "isController": false}, {"data": [0.0, 500, 1500, "03_Go To My Info"], "isController": true}, {"data": [0.8, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/employment-statuses"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7-1"], "isController": false}, {"data": [0.8, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/subunits"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7-4"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7-6"], "isController": false}, {"data": [0.8, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/job-titles"], "isController": false}, {"data": [0.8, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7/custom-fields?screen=personal"], "isController": false}, {"data": [0.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/"], "isController": false}, {"data": [0.0, 500, 1500, "01_Homepage"], "isController": true}, {"data": [0.4, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees?limit=50&offset=0&model=detailed&includeEmployees=onlyCurrent&sortField=employee.firstName&sortOrder=ASC"], "isController": false}, {"data": [0.5, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails"], "isController": false}, {"data": [0.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/-6"], "isController": false}, {"data": [0.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/-5"], "isController": false}, {"data": [0.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/-4"], "isController": false}, {"data": [0.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://opensource-demo.orangehrmlive.com/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/-1"], "isController": false}, {"data": [0.4, 500, 1500, "https://opensource-demo.orangehrmlive.com/-0"], "isController": false}, {"data": [0.8, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7/personal-details"], "isController": false}, {"data": [0.0, 500, 1500, "02_Login"], "isController": true}, {"data": [0.8, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees"], "isController": false}, {"data": [0.0, 500, 1500, "04_Click Personal Details"], "isController": true}, {"data": [0.775, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/holidays?fromDate=2022-01-01&toDate=2022-12-31"], "isController": false}, {"data": [0.8, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/workweek?model=indexed"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 286, 22, 7.6923076923076925, 799.9720279720282, 131, 9407, 305.0, 1727.9, 4969.449999999988, 7394.849999999997, 2.204493775773692, 284.1658296238486, 2.2200754181600955], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-0", 5, 0, 0.0, 814.2, 258, 1034, 929.0, 1034.0, 1034.0, 1034.0, 0.1914168676543777, 0.3270536637188469, 0.17724753311511812], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-1", 5, 0, 0.0, 284.4, 271, 296, 289.0, 296.0, 296.0, 296.0, 0.1970288056113804, 0.4310005122748946, 0.14750222888836348], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-2", 5, 0, 0.0, 307.4, 138, 359, 344.0, 359.0, 359.0, 359.0, 0.19649453745185883, 1.2487765144816474, 0.1512470648628468], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7/screen/personal/attachments?limit=50&offset=0", 10, 2, 20.0, 298.7, 215, 383, 300.5, 380.2, 383.0, 383.0, 0.15279072254732692, 0.14219683455820564, 0.10041812136167093], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate", 5, 0, 0.0, 1530.8, 684, 1823, 1724.0, 1823.0, 1823.0, 1823.0, 0.18570102135561745, 2.7681421193129063, 1.2046265668523677], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-3", 5, 0, 0.0, 140.2, 139, 142, 140.0, 142.0, 142.0, 142.0, 0.19809040846242223, 0.19178401459926311, 0.16624892288340398], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-0", 5, 0, 0.0, 744.8, 526, 983, 835.0, 983.0, 983.0, 983.0, 0.4130865829477859, 7.101861987772637, 0.290048098769002], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-4", 5, 0, 0.0, 139.0, 131, 149, 138.0, 149.0, 149.0, 149.0, 0.19809825673534073, 0.19210114154120445, 0.16772577010697307], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-1", 5, 0, 0.0, 231.0, 136, 425, 161.0, 425.0, 425.0, 425.0, 0.42165626581210996, 0.6810736949738573, 0.32480709225839094], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-5", 5, 0, 0.0, 139.8, 132, 147, 142.0, 147.0, 147.0, 147.0, 0.1980668673744256, 0.1921093873791792, 0.16649996038662654], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-6", 5, 0, 0.0, 142.8, 136, 149, 144.0, 149.0, 149.0, 149.0, 0.19801195992237933, 0.19221082828402836, 0.16745933329373094], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-7", 4, 0, 0.0, 141.0, 136, 146, 141.0, 146.0, 146.0, 146.0, 0.15849116411760045, 0.15384786829384262, 0.1327982605594738], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7", 5, 0, 0.0, 705.0, 619, 923, 645.0, 923.0, 923.0, 923.0, 0.13021511537059222, 3.105554203669462, 0.6288728823766863], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7", 10, 2, 20.0, 292.90000000000003, 221, 330, 303.0, 328.6, 330.0, 330.0, 0.15102546289304378, 0.14869518719606126, 0.08332947903766576], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/core/i18n/messages", 20, 0, 0.0, 313.09999999999997, 252, 574, 270.5, 425.50000000000006, 566.6999999999999, 574.0, 0.16647937736712864, 4.001179012152995, 0.10831727067465767], "isController": false}, {"data": ["03_Go To My Info", 5, 1, 20.0, 4184.8, 3648, 4509, 4388.0, 4509.0, 4509.0, 4509.0, 0.16962377446822946, 6.554633697459035, 1.8339576725073785], "isController": true}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/employment-statuses", 5, 1, 20.0, 282.0, 224, 301, 296.0, 301.0, 301.0, 301.0, 0.19685039370078738, 0.21134504183070868, 0.12245478592519686], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-6", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 2.356075546116505, 1.9175705400485439], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-4", 5, 0, 0.0, 368.4, 140, 454, 416.0, 454.0, 454.0, 454.0, 0.4072987943955686, 0.39528666198273055, 0.32504353005865105], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7-0", 5, 0, 0.0, 435.0, 235, 488, 487.0, 488.0, 488.0, 488.0, 0.131832203970786, 2.393681447253935, 0.09488313899069264], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-5", 5, 0, 0.0, 366.8, 138, 447, 419.0, 447.0, 447.0, 447.0, 0.40756439517443754, 0.3956240320345614, 0.32278781688131725], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7-1", 5, 0, 0.0, 231.4, 133, 422, 147.0, 422.0, 422.0, 422.0, 0.1324468226007258, 0.2142948200047681, 0.1020254430346216], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/subunits", 5, 1, 20.0, 278.2, 224, 298, 289.0, 298.0, 298.0, 298.0, 0.1970210418472693, 0.3579087324651273, 0.12044450409803767], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-2", 5, 0, 0.0, 316.4, 136, 460, 421.0, 460.0, 460.0, 460.0, 0.4168056018672891, 0.4040246488412804, 0.3327932227409136], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7-2", 5, 0, 0.0, 199.8, 137, 430, 145.0, 430.0, 430.0, 430.0, 0.13192960236417847, 0.12788410479168316, 0.10533754188764875], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-3", 5, 0, 0.0, 320.2, 132, 453, 433.0, 453.0, 453.0, 453.0, 0.4065371168387674, 0.39422984084071877, 0.3223712293682413], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7-3", 5, 0, 0.0, 142.8, 134, 150, 142.0, 150.0, 150.0, 150.0, 0.13191567949766508, 0.1279221384191225, 0.10460501147666412], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7-4", 5, 0, 0.0, 197.2, 134, 415, 149.0, 415.0, 415.0, 415.0, 0.1319087191663369, 0.12801844248779845, 0.10526934111594777], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7-5", 5, 0, 0.0, 200.2, 134, 425, 151.0, 425.0, 425.0, 425.0, 0.1319087191663369, 0.12804420590951063, 0.10447067504287033], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7-6", 1, 0, 0.0, 150.0, 150, 150, 150.0, 150.0, 150.0, 150.0, 6.666666666666667, 6.471354166666667, 5.266927083333334], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/job-titles", 5, 1, 20.0, 285.8, 221, 307, 301.0, 307.0, 307.0, 307.0, 0.19689690478065686, 0.7339409038552415, 0.12075317988501222], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7/custom-fields?screen=personal", 10, 2, 20.0, 301.7, 211, 335, 312.0, 333.8, 335.0, 335.0, 0.1525739220652406, 0.154391697308596, 0.0978916667938116], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/", 5, 0, 0.0, 7731.8, 6739, 9407, 7311.0, 9407.0, 9407.0, 9407.0, 0.5315190815350271, 1888.702914883863, 2.5293871917189326], "isController": false}, {"data": ["01_Homepage", 5, 0, 0.0, 8171.4, 7167, 9981, 7709.0, 9981.0, 9981.0, 9981.0, 0.5009518084360284, 1826.7007118212102, 2.686745441338543], "isController": true}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees?limit=50&offset=0&model=detailed&includeEmployees=onlyCurrent&sortField=employee.firstName&sortOrder=ASC", 5, 1, 20.0, 457.4, 230, 527, 511.0, 527.0, 527.0, 527.0, 0.19520574685718747, 2.1363210182907784, 0.13916034688061216], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails", 5, 0, 0.0, 1187.0, 682, 1413, 1280.0, 1413.0, 1413.0, 1413.0, 0.389377774316642, 8.909678349622304, 1.873652387859201], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/-6", 5, 0, 0.0, 6011.2, 5156, 6411, 6108.0, 6411.0, 6411.0, 6411.0, 0.7791803023219572, 1110.6576038257754, 0.5425347222222222], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/-5", 5, 0, 0.0, 5666.8, 4623, 7149, 5374.0, 7149.0, 7149.0, 7149.0, 0.6988120195667366, 791.9457820143256, 0.493399502096436], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/-4", 5, 0, 0.0, 3364.2, 2365, 3890, 3628.0, 3890.0, 3890.0, 3890.0, 1.2850167052171677, 613.8251232812902, 0.897252875224878], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/-3", 5, 0, 0.0, 3646.0, 2758, 4066, 3785.0, 4066.0, 4066.0, 4066.0, 1.2297097884899164, 627.2240454377767, 0.8706441373585834], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/-2", 5, 0, 0.0, 596.0, 528, 703, 543.0, 703.0, 703.0, 703.0, 7.0821529745042495, 11.577660233711049, 4.945057985127479], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/-1", 5, 0, 0.0, 301.8, 287, 308, 308.0, 308.0, 308.0, 308.0, 14.326647564469916, 61.7752731017192, 9.136035995702006], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/-0", 5, 0, 0.0, 1140.4, 412, 1859, 1146.0, 1859.0, 1859.0, 1859.0, 2.6001040041601664, 2.676278926157046, 1.5971341978679148], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7/personal-details", 10, 2, 20.0, 291.50000000000006, 220, 321, 303.5, 320.8, 321.0, 321.0, 0.15083866296609147, 0.1779719458941716, 0.09486337788101845], "isController": false}, {"data": ["02_Login", 5, 1, 20.0, 3102.4, 1857, 3508, 3380.0, 3508.0, 3508.0, 3508.0, 0.9169264624977076, 30.712917488079956, 8.905648267008985], "isController": true}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees", 10, 2, 20.0, 319.70000000000005, 212, 357, 343.0, 356.5, 357.0, 357.0, 0.15298473212373406, 0.6308528611969525, 0.08411172283756081], "isController": false}, {"data": ["04_Click Personal Details", 5, 1, 20.0, 3626.4, 2927, 4065, 3737.0, 4065.0, 4065.0, 4065.0, 0.35295778624876467, 13.980575188832415, 3.8223535886982916], "isController": true}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/holidays?fromDate=2022-01-01&toDate=2022-12-31", 20, 4, 20.0, 308.54999999999995, 217, 593, 303.0, 377.8, 582.2499999999999, 593.0, 0.30039050765995795, 0.6975278799939922, 0.17659676329227997], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/workweek?model=indexed", 20, 4, 20.0, 282.8500000000001, 212, 309, 294.5, 306.0, 308.85, 309.0, 0.30211936736204476, 0.2806995762775873, 0.17053222103052917], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["401/Unauthorized", 22, 100.0, 7.6923076923076925], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 286, 22, "401/Unauthorized", 22, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7/screen/personal/attachments?limit=50&offset=0", 10, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7", 10, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/employment-statuses", 5, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/subunits", 5, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/job-titles", 5, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7/custom-fields?screen=personal", 10, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees?limit=50&offset=0&model=detailed&includeEmployees=onlyCurrent&sortField=employee.firstName&sortOrder=ASC", 5, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7/personal-details", 10, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees", 10, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/holidays?fromDate=2022-01-01&toDate=2022-12-31", 20, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/workweek?model=indexed", 20, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
