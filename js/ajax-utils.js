(function (global){

    // set-up a namespace for our utility
    var ajaxUtils = {};

    // returns an HTTP request object
    function getRequestObject(){
        if (window.XMLHttpRequest) {
            return (new XMLHttpRequest());
        }
        else {
            global.alert("Ajax is not supported!");
            return(null);
        }
    }

    function handleResponse(request, responseHandler, isJsonResponse){
        if ((request.readyState == 4) && request.status == 200) {
            // Set default isJsonResponse to true
            if (isJsonResponse == undefined) {
                isJsonResponse = true;
            }

            if (isJsonResponse) {
                responseHandler(JSON.parse(request.responseText));
            }
            else {
                responseHandler(request.responseText);
            }
        }
    }

    ajaxUtils.sendGetRequest = 
    function(requestURL, responseHandler, isJsonResponse){
        var request = getRequestObject();
        request.onreadystatechange =
            function () {
                handleResponse(
                    request,
                    responseHandler,
                    isJsonResponse);
            };
        request.open("GET", requestURL, true);
        request.send(null); // for POST only
    };

    global.$ajaxUtils = ajaxUtils;

})(window);