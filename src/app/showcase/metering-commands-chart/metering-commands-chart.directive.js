angular.module('baasic.blog')
    .directive("baasicMeteringCommandsChart", [
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
                link: function ($scope, element, attrs) {},
                controller: ["$scope", "$state", "$interval", "meteringService", 'meteringUtilityService', 'baasicAuthorizationService',
                    function ($scope, $state, $interval, meteringService, meteringUtilityService, authService) {

                        $scope.config = {
                            title: {
                                text: 'Commands Data'
                            },
                            chart: {
                                type: 'line',
                                backgroundColor: null,
                                plotBackgroundColor: null,
                                plotBackgroundImage: null,
                                plotBorderWidth: 0,
                                plotShadow: false,
                                spacingTop: 0,
                                spacingLeft: 0,
                                spacingRight: 0,
                                spacingBottom: 0,
                                height: 250,
                                animation: Highcharts.svg, // don't animate in old IE
                                marginRight: 10,
                                style: {
                                    fontFamily: '"Roboto", Arial, Helvetica, sans-serif',
                                },
                            },
                            plotOptions: {
                                series: {
                                    minPointLength: 5,
                                    cursor: 'pointer',
                                    point: {}
                                }
                            },
                            series: [],
                            yAxis: {
                                title: {
                                    text: 'Data'
                                },
                                plotLines: [{
                                    value: 0,
                                    width: 1,
                                    color: '#808080'
                                }]
                            },
                            xAxis: {
                                categories: [],
                                tickPixelInterval: 150
                            },
                            func: function (chart) {
                                var chartInstance = chart;
                                $scope.chartInstance = chart;
                                $timeout(function () {
                                    try {
                                        if (chartInstance && chartInstance.reflow) {
                                            chartInstance.reflow();
                                        }
                                    } catch (e) {
                                        console.log(e);
                                    }
                                }, 1000);
                            },
                            size: {
                                height: 250
                            }
                        };



                        //Colors
                        var colors = ['#00C2E8', '#531a93', '#0a80a8', '#70db36', '#ed5e61', '#30a7ba', '#d2f449', '#74ce21', '#add34c', '#d62652', '#f733bf', '#e1fc67', '#cc5b57', '#7043a8', '#27dd73', '#316991', '#17c41a', '#db420a', '#1b4989', '#38c193', '#addb43', '#5971d1', '#1409e8', '#d545e8', '#a8471e', '#38bef7', '#aace1a', '#db2e36', '#ed7e68', '#d8457b', '#dd52d2', '#1538a3', '#dd1ca0', '#e9ed1e', '#8b41e0', '#a51329', '#3ff4bb', '#f49613', '#d1a349', '#d6ed0e', '#3be2c9', '#14ce0a', '#623bef', '#12d112', '#bc0124', '#1ba6f7', '#bc4c40', '#7ea00c', '#2be2d0', '#60db97', '#d36a4a', '#5482f7', '#1b9314', '#e05302', '#f25975', '#44e5c8', '#d17c4f', '#dba34e', '#11c3db', '#cc6341', '#c48f00', '#d15772', '#3ef96d', '#925ce8', '#05724c', '#1e388c', '#30479b', '#af1d5a', '#0d5770', '#f2e165', '#aed328', '#3c318e', '#295b87', '#c5d356', '#d14274', '#2e7fba', '#5753ba', '#26d3c2', '#6a7707', '#62ff2d', '#9edd5f', '#f9002d', '#2a3ce0', '#20aa73', '#39dbba', '#f966cb', '#af3d0f', '#d1307d', '#cbd12b', '#c7f959', '#7a42ce', '#d6724a', '#35fcc3', '#4ad6b5', '#28e084', '#d81ec3', '#05b210', '#4fcad1', '#33e8db', '#7df745'];

                        function compileCategory(item) {
                            return meteringUtilityService.compileCategory($scope.filter.rateBy, item);
                        }

                        $scope.transformData = function (metrics) {
                            var seriesMetaData = {
                                categories: []
                            };

                            var names = [];
                            _.each(metrics, function (item) {
                                names.push(item.name);
                            });
                            var uniqueNames = _.unique(names);

                            var xAxis = [];
                            _.each(metrics, function (item) {
                                xAxis.push(meteringUtilityService.compileCategory($scope.filter.rateBy, item));
                            });
                            var uniqueXAxis = _.unique(xAxis);
                            seriesMetaData.categories = uniqueXAxis;

                            _.each(uniqueNames, function (name) {
                                var nameMetrics = _.filter(metrics, function (item) {
                                    return item.name === name;
                                });

                                _.each(uniqueXAxis, function (xAxisValue) {
                                    var metric = _.find(nameMetrics, function (nameMetric) {
                                        return meteringUtilityService.compileCategory($scope.filter.rateBy, nameMetric) === xAxisValue;
                                    });

                                    seriesMetaData[name] = seriesMetaData[name] || {};
                                    seriesMetaData[name].data = seriesMetaData[name].data || [];
                                    if (metric) {
                                        seriesMetaData[name].name = metric.name;
                                        var value = metric.value;
                                        seriesMetaData[name].data.push(value);
                                    } else {
                                        seriesMetaData[name].data.push(0);
                                    }
                                });
                            });

                            var result = {
                                series: [],
                                categories: seriesMetaData.categories,
                            };
                            delete seriesMetaData.categories;
                            _.each(seriesMetaData, function (item) {
                                result.series.push({
                                    name: item.name,
                                    data: item.data
                                });
                            });

                            return result;
                        };

                        function executeTransformData(data) {
                            var result = $scope.transformData(data);
                            if (!result) {
                                result = transformData(data);
                            }
                            return result;
                        }

                        $scope.createChart = function () {
                            if ($scope.chart) {
                                $scope.chart.destroy();
                            }
                            $scope.chart = Highcharts.chart('containerCommands', $scope.config);
                        };

                        $scope.sync = $interval(function () {
                            $scope.reload()
                                .finally(function () {
                                    try {
                                        if ($scope.chart && $scope.chart.reflow) {
                                            $scope.chart.reflow();
                                        }
                                    } catch (e) {
                                        console.log(e);
                                    }
                                });
                        }, 1000);

                        $scope.$on("$destroy", function () {
                            if ($scope.sync) {
                                $interval.cancel($scope.sync);
                            }
                        });

                        $scope.reload = function () {
                            return meteringService.statistics.find($scope.filter)
                                .success(function (metrics) {
                                    if (!$scope.chart) {
                                        //Init
                                        var seriesCounter = 0;
                                        $scope.config.xAxis.categories.splice(0, $scope.config.xAxis.categories.length)
                                        $scope.config.series.splice(0, $scope.config.series.length)

                                        var result = executeTransformData(metrics.item);
                                        _.each(result.categories, function (item) {
                                            $scope.config.xAxis.categories.push(item);
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
                                            $scope.config.series.push(item);
                                        });

                                        $scope.createChart();
                                    } else {
                                        //Add point
                                        if ($scope.chart) {
                                            var result = executeTransformData(metrics.item);
                                            _.each(result.categories, function (item) {
                                                $scope.chart.xAxis[0].categories.push(item);
                                            });

                                            _.each($scope.chart.series, function (item) {
                                                _.each(metrics.item, function (mItem) {
                                                    if (mItem.name === item.name) {
                                                        item.addPoint([meteringUtilityService.compileCategory($scope.filter.rateBy, mItem), mItem.value], true, true);
                                                    }
                                                });
                                            });
                                        }
                                    }
                                })
                                .error(function (data, status, headers, config) {
                                    console.log("Unable to load account metering data.");
                                })
                                .finally(function () {

                                });
                        };
                        $scope.reload();
                    }
                ],
                templateUrl: function (elem, attrs) {
                    return '/templates/showcase/metering-commands-chart/metering-commands-chart.directive.html';
                }
            }
        }
    ]);