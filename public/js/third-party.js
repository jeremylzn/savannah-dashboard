let post = function(url, data) {
    return fetch(url, {method: "POST", body: data});
}