angular.module('baasic.blog').service("meteringService", ["$rootScope", "$interval", "$q", "baasicApiHttp", "baasicApiService", "baasicUriTemplateService", "baasicMeteringService", "baasicDynamicResourceService",
    function ($rootScope, $interval, $q, baasicApiHttp, baasicApiService, uriTemplateService, baasicMeteringService, baasicDynamicResourceService) {
        this.result = {
            syncData: {},
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

        var self = this;

        function sync() {
            baasicDynamicResourceService.get('Commands', '7ilgDcx7j4MLxQTH0FTfn2')
                .success(function (data) {
                    if (data && data.state) {
                        self.result.syncData.data = data;
                        var rawData = [];
                        rawData.push({
                            "name": "LowBeam",
                            "moduleName": "Light",
                            "status": 200,
                            "value": data.state.lightLowBeam ? 10 : 0,
                            "category": "commands"
                        });
                        rawData.push({
                            "name": "HighBeam",
                            "moduleName": "Light",
                            "status": 200,
                            "value": data.state.lightHighBeam ? 20 : 0,
                            "category": "commands"
                        });
                        rawData.push({
                            "name": "TurnSignal",
                            "moduleName": "Light",
                            "status": 200,
                            "value": data.state.lightTurnSignal ? 30 : 0,
                            "category": "commands"
                        });
                        self.result.batch.create(rawData)
                            .error(function (error) {
                                console.log(error);
                            });
                    }
                });
        }
        sync();
        var backgroundTask = $interval(sync, 10000);

        return this.result;
    }
]);