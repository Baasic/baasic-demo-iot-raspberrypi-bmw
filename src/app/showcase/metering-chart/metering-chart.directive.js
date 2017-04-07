angular.module('baasic.blog')
    .directive("baasicMeteringChart", ['$timeout',
        function ($timeout) {
            return {
                restrict: 'E',
                scope: {
                    chartConfig: '=',
                    filter: '=',
                    chartTitle: '='
                },
                controller: function ($scope) {
                    var filterWatcher = $scope.$watch('filter', function () {
                        $scope.chartInstance.reflow();
                    }, true);
                    var chartWatcher = $scope.$watch('chartTitle', function () {
                        $timeout(function () {
                            if ($scope.chartTitle && $scope.chartTitle.text) {
                                $scope.chartInstance.setTitle({
                                    text: $scope.chartTitle.text
                                });
                            }
                        });
                    }, true);

                    $scope.$on('$destroy', function () {
                        if (filterWatcher) {
                            filterWatcher();
                        }
                        if (chartWatcher) {
                            chartWatcher();
                        }
                    });


                    $scope.config = {
                        options: {
                            chart: {
                                type: ''
                            },
                            plotOptions: {
                                series: {
                                    minPointLength: 5,
                                    cursor: 'pointer'
                                }
                            }
                        },
                        title: {
                            text: ''
                        },
                        yAxis: {
                            title: {
                                text: ''
                            }
                        },
                        xAxis: {
                            title: {
                                text: 'Time'
                            },
                            categories: []
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

                                }
                            }, 1000);
                        },
                        series: []
                    };

                    $scope.config = angular.extend($scope.config, $scope.chartConfig);
                },
                link: function ($scope, element, attrs, ngModel) {
                    if (attrs.title) {
                        $scope.config.title.text = attrs.title;
                    }
                    if (attrs.yAxisTitle) {
                        $scope.config.yAxis.title.text = attrs.yAxisTitle;
                    }
                    if (attrs.xAxisTitle) {
                        $scope.config.xAxis.title.text = attrs.xAxisTitle;
                    }
                },
                templateUrl: "/templates/showcase/metering-chart/metering-chart.directive.html"
            }
        }
    ]);