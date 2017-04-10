angular.module('baasic.blog').service("meteringService", ["$rootScope", "$interval", "$q", "baasicApiHttp", "baasicApiService", "baasicUriTemplateService", "baasicMeteringService",
    function ($rootScope, $interval, $q, baasicApiHttp, baasicApiService, uriTemplateService, baasicMeteringService) {
        return {
            find: function (option) {
                return baasicMeteringService.find(option);
            },
            get: function (id, options) {
                return baasicMeteringService.get(id, options);
            },
            create: function (data) {
                return baasicMeteringService.create(data);
            },
            update: function (data) {
                return baasicMeteringService.update(data);
            },
            remove: function (data) {
                return baasicMeteringService.remove(data);
            },
            purge: function () {
                return baasicMeteringService.purge();
            },
            statistics: {
                find: function (options) {
                    var apiParams = angular.extend({}, options);
                    return baasicMeteringService.statistics.find(apiParams);
                }
            },
            acl: {
                get: function (options) {
                    return baasicMeteringService.acl.get(options);
                },
                update: function (options) {
                    return baasicMeteringService.acl.update(options);
                },
                removeByUser: function (id, action, user, data) {
                    return baasicMeteringService.acl.removeByUser(id, action, user, data);
                },
                removeByRole: function (id, action, role, data) {
                    return baasicMeteringService.acl.removeByRole(id, action, role, data);
                }
            },
            batch: {
                create: function (data) {
                    return baasicMeteringService.batch.create(data);
                },
                update: function (data) {
                    return baasicMeteringService.batch.update(data);
                },
                remove: function (ids) {
                    return baasicMeteringService.batch.remove(ids);
                }
            }
        };
    }
]);