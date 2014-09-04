Z.wrap('github/ionicabizau/url-extra/v0.0.1/client/main.js', function(require, module, exports) {

    function init(config, ready) {
        var self = this;

        if (!self.view || !self.view.layout) {
            throw new Error("A view named 'layout' is required.");
        }

        self.view.layout.render();

        /**
         * queryString
         * Finds the value of parameter passed in first argument.
         *
         * @name queryString
         * @function
         * @param {String} name The parameter name
         * @param {Boolean} notDecoded If true, the result will be encoded.
         * @return {String} The value of the parameter name (`name` parameter)
         */
        function queryString(name, notDecoded) {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
            var results = regex.exec(location.search);
            if (results == null) {
                return "";
            } else {
                var encoded = results[1].replace(/\+/g, " ");
                if (notDecoded) {
                    return encoded;
                }
                return decodeURIComponent(encoded)
            }
        }

        /**
         * parseQuery
         * Parses the string from `search` parameter or the location search
         *
         * @name parseQuery
         * @function
         * @param {String} search Optional string that should be parsed
         * @return {Object} The parsed search query
         */
        function parseQuery(search) {
            var query = {};
            search = search || window.location.search
            if (search[0] === "?") {
                search = search.substring(1);
            }
            if (!search) {
                return {};
            }
            var a = search.split('&');
            for (var i in a) {
                var b = a[i].split('=');
                query[decodeURIComponent(b[0])] = decodeURIComponent(b[1]);
            }

            return query;
        }

        /**
         * queryToString
         * Stringifies a query object
         *
         * @name queryToString
         * @function
         * @param {Object} queryObj The object that should be stringified
         * @return {String} The stringified value of `queryObj` object
         */
        function queryToString(queryObj) {
            if (!queryObj || queryObj.constructor !== Object) {
                throw new Error("Query object should be an object.");
            }
            var stringified = "";
            for (var param in queryObj) {
                if (!queryObj.hasOwnProperty(param)) continue;
                stringified +=
                    param + "=" + encodeURIComponent(queryObj[param]) + "&";
            }
            stringified = stringified.substring(0, stringified.length - 1);
            return stringified;
        }

        /**
         * updateSearchParam
         * Adds a parameter=value to the url (without page refresh)
         *
         * @name updateSearchParam
         * @function
         * @param {String} param The parameter name
         * @param {String|undefined} value The parameter value. If undefined, the parameter will be removed.
         * @return undefined
         */
        function updateSearchParam(param, value) {
            var searchParsed = parseQuery();
            if (value === undefined) {
                delete searchParsed[param];
            } else {
                value = encodeURIComponent(value);
                if (searchParsed[param] === value) {
                    return;
                }
                searchParsed[param] = value;
            }

            var newSearch = "?" + queryToString(searchParsed);
            return location.pathName + newSearch + location.hash;
        }

        // Public functions
        self.queryString = function(name, notDecoded) {
            self.emit("queryString:get", null, queryString(name, notDecoded));
        };
        self.parseQuery = function(search) {
            self.emit("parseQuery:get", null, parseQuery(search));
        };
        self.queryToString = function(queryObj) {
            self.emit("queryToString:get", null, queryToString(queryObj));
        };
        self.updateSearchParam = function(param, value) {
            Z.route(updateSearchParam(param, value));
            if (config.reloadOnChange) {
                Z._reload();
            }
        };

        ready();
    }

    module.exports = init;

    return module;
});
