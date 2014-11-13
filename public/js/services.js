/* global angular */
/* global localStorage */

var expensesApp = angular.module("expensesApp");

expensesApp.factory("DataStore", [function () {
    "use strict";

    return {
        data: {
            items: []
        }
    };
}]);

expensesApp.service("LocalStorage", [function() {
    "use strict";

    function getData() {
        if (!localStorage.getItem("itera-expenses")) {
            localStorage.setItem("itera-expenses", JSON.stringify({
                items: []
            }));
        }

        return JSON.parse(localStorage.getItem("itera-expenses"));
    }

    function setData(data) {
        localStorage.setItem("itera-expenses", JSON.stringify(data));
    }

    function clear() {
        localStorage.removeItem("itera-expenses");
    }

    return {
        setData: setData,
        getData: getData,
        clear: clear
    };
}]);