angular.module('baasic.blog')
    .directive("baasicMeteringRequestChart", [
        function () {
            return {
                restrict: 'E',
                scope: {
                    chartTitle: '=',
                    filter: '=',
                    chartConfig: '=',
                    transformData: '&',
                    seriesClick: '&',
                    applicationIdentifier: '=',
                    viewMoreRedirectState: '@'
                },
                link: function ($scope, element, attrs) {
                    $scope.viewMoreRedirectState = '';
                    if (attrs.viewMoreRedirectState) {
                        $scope.viewMoreRedirectState = attrs.viewMoreRedirectState;
                    }
                },
                controller: ["$scope", "$state", "currentView", "meteringService", "notificationService", 'meteringUtilityService', 'baasicAuthorizationService', 'dashBoardApp',
                    function ($scope, $state, currentView, meteringService, notificationService, meteringUtilityService, authService, dashBoardApp) {
                        //Colors
                        var colors = dashBoardApp.metering.colors;

                        var moduleView = currentView.get('meteringRequestChartDirective');
                        $scope.view = moduleView;
                        moduleView.suspend();

                        $scope.$watch('filter', function () {
                            if (!$scope.view.isSuspended) {
                                $scope.reload();
                            }
                        }, true);

                        function seriesClick(info) {
                            var result = $scope.seriesClick({
                                info: info
                            });
                            if (!result) {
                                $state.go('index.metering.general-request-view', {
                                    category: 'Request',
                                    month: info.category
                                });
                            }
                        };

                        $scope.requestChartConfig = _.deepExtend({
                            title: {
                                text: 'Requests',
                                useHTML: true
                            },
                            options: {
                                chart: {
                                    type: 'column',
                                    height: 250,
                                    backgroundColor: null,
                                    style: {
                                        fontFamily: '"Roboto", Arial, Helvetica, sans-serif',
                                    },
                                },
                                plotOptions: {
                                    series: {
                                        minPointLength: 5,
                                        cursor: 'pointer',
                                        point: {
                                            events: {
                                                click: function () {
                                                    seriesClick(this);
                                                }
                                            }
                                        }
                                    },
                                    area: {
                                        marker: {
                                            enabled: false,
                                            symbol: 'circle',
                                            radius: 2,
                                            states: {
                                                hover: {
                                                    enabled: true
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            series: [],
                            yAxis: {
                                title: {
                                    text: 'Requests'
                                }
                            },
                            xAxis: {
                                categories: []
                            }
                        }, $scope.chartConfig || {});

                        function compileCategory(item) {
                            return meteringUtilityService.compileCategory($scope.filter.rateBy, item);
                        }

                        function transformData(data) {
                            var values = [];
                            var categories = [];
                            _.each(data.metrics, function (item) {
                                values.push(item.value);
                                categories.push(compileCategory(item));
                            });

                            return {
                                series: [{
                                    name: 'Requests',
                                    data: values
                                }],
                                categories: categories
                            };
                        }

                        function executeTransformData(data) {
                            var result = $scope.transformData(data);
                            if (!result) {
                                result = transformData(data);
                            }
                            return result;
                        }



                        $scope.reload = function () {
                            var user = authService.getUser();
                            if (!user) {
                                $scope.hasResults = false;
                                return;
                            }
                            moduleView.suspend();
                            meteringService.statistics.find($scope.filter)
                                .success(function (metrics) {
                                    $scope.hasResults = metrics && metrics.item && metrics.item.length > 0;
                                    var seriesCounter = 0;
                                    $scope.requestChartConfig.xAxis.categories.splice(0, $scope.requestChartConfig.xAxis.categories.length)
                                    $scope.requestChartConfig.series.splice(0, $scope.requestChartConfig.series.length)

                                    var result = executeTransformData({
                                        metrics: metrics.item
                                    });
                                    _.each(result.categories, function (item) {
                                        $scope.requestChartConfig.xAxis.categories.push(item);
                                    });
                                    _.each(result.series, function (item) {
                                        if (item.data && item.data.length > 0 && angular.isObject(item.data[0])) {
                                            _.each(item.data, function (data) {
                                                if (seriesCounter > colors.length) {
                                                    seriesCounter = 0;
                                                }
                                                data.color = colors[seriesCounter];
                                                seriesCounter++;
                                            });
                                        } else {
                                            if (seriesCounter > colors.length) {
                                                seriesCounter = 0;
                                            }
                                            item.color = colors[seriesCounter];
                                            seriesCounter++;
                                        }
                                        $scope.requestChartConfig.series.push(item);
                                    });
                                })
                                .error(function (data, status, headers, config) {
                                    var notification = notificationService.create("Unable to load account metering data.");
                                    notificationService.formatErrorNotification(notification, data, status, headers, config);
                                    notificationService.update(notification);
                                })
                                .finally(function () {
                                    moduleView.resume();
                                });
                        };
                        $scope.reload();
                    }
                ],
                templateUrl: function (elem, attrs) {
                    var url = '/templates/showcase/metering-request-chart/';
                    if (!attrs.templateUrl) {
                        url = url + 'metering-request-chart.directive.html';
                    } else {
                        url = url + attrs.templateUrl + '.html';
                    }
                    return url;
                }
            }
        }
    ]);