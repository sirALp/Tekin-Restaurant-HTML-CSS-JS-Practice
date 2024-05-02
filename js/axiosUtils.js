(function($global){


    var axiosUtils = {};
    axiosUtils.sendGetRequest = function (URL, handleResponse, handleError){
        axios.get(URL)
        .then(response => {
            handleResponse(response);
        })
        .catch(error => {
            handleError(error);
        });
    }

    axiosUtils.sendPostRequest = function (URL, data, handleResponse, handleError){
        axios.post(URL, data)
        .then(response => {
            handleResponse(response);
        })
        .catch(error => {
            handleError(error);
        });
    }

    axiosUtils.sendPutRequest = function (URL, data, handleResponse, handleError){
        axios.put(URL, data)
        .then(response => {
            handleResponse(response);
        })
        .catch(error => {
            handleError(error);
        });
    }

    axiosUtils.sendDeleteRequest = function (URL, handleResponse, handleError){
        axios.delete(URL)
        .then(response => {
            handleResponse(response);
        })
        .catch(error => {
            handleError(error);
        });
    }
  
    $global.$axiosUtils = axiosUtils;
})(window);