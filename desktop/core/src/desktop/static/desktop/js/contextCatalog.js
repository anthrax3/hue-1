// Licensed to Cloudera, Inc. under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  Cloudera, Inc. licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @typedef {Object} ContextNamespace
 * @property {string} id
 * @property {string} name
 */

var ContextCatalog = (function () {

  var CONTEXT_CATALOG_VERSION = 1;

  var ContextCatalog = (function () {

    function ContextCatalog() {
      var self = this;
      self.namespaces = {};
      self.namespacePromises = {};

      self.computes = {};
      self.computePromises = {};

      // TODO: Add caching
    }

    /**
     * @param {Object} options
     * @param {string} options.sourceType
     * @param {boolean} [options.silenceErrors]
     * @return {Promise}
     */
    ContextCatalog.prototype.getNamespaces = function (options) {
      var self = this;

      if (self.namespacePromises[options.sourceType]) {
        return self.namespacePromises[options.sourceType];
      }

      if (self.namespaces[options.sourceType]) {
        self.namespacePromises[options.sourceType] = $.Deferred().resolve(self.namespaces[options.sourceType]).promise();
        return self.namespacePromises[options.sourceType];
      }

      var deferred = $.Deferred();
      self.namespacePromises[options.sourceType] = deferred.promise();

      ApiHelper.getInstance().fetchContextNamespaces(options).done(function (namespaces) {
        if (namespaces[options.sourceType]) {
          var namespaces = namespaces[options.sourceType];
          if (namespaces) {
            self.namespaces[self.sourceType] = namespaces;
            deferred.resolve(self.namespaces[self.sourceType])
            // TODO: save
          } else {
            deferred.reject();
          }
        } else {
          deferred.reject();
        }
      });

      return self.namespacePromises[options.sourceType];
    };

    /**
     * @param {Object} options
     * @param {string} options.sourceType
     * @param {boolean} [options.silenceErrors]
     * @return {Promise}
     */
    ContextCatalog.prototype.getComputes = function (options) {
      var self = this;

      if (self.computePromises[options.sourceType]) {
        return self.computePromises[options.sourceType];
      }

      if (self.computes[options.sourceType]) {
        self.computePromises[options.sourceType] = $.Deferred().resolve(self.computes[options.sourceType]).promise();
        return self.computePromises[options.sourceType];
      }

      var deferred = $.Deferred();
      self.computePromises[options.sourceType] = deferred.promise();

      ApiHelper.getInstance().fetchContextComputes(options).done(function (computes) {
        if (computes[options.sourceType]) {
          var computes = computes[options.sourceType];
          if (computes) {
            self.computes[self.sourceType] = computes;
            deferred.resolve(self.computes[self.sourceType])
            // TODO: save
          } else {
            deferred.reject();
          }
        } else {
          deferred.reject();
        }
      });

      return self.computePromises[options.sourceType];
    };

    return ContextCatalog;
  })();

  return (function () {
    var contextCatalog = new ContextCatalog();

    return {
      /**
       * @param {Object} options
       * @param {string} options.sourceType
       * @param {boolean} [options.silenceErrors]
       * @return {Promise}
       */
      getNamespaces: function (options) {
        return contextCatalog.getNamespaces(options);
      },
      /**
       * @param {Object} options
       * @param {string} options.sourceType
       * @param {boolean} [options.silenceErrors]
       * @return {Promise}
       */
      getComputes: function (options) {
        return contextCatalog.getComputes(options);
      }
    }
  })();
})();