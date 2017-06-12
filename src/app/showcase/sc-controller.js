angular.module('baasic.blog')
    .controller('SCCtrl', ['$scope', '$state', '$interval', 'meteringUtilityService', 'baasicDynamicResourceService', 'meteringService', 'baasicAuthorizationService',
        function ($scope, $state, $interval, meteringUtilityService, baasicDynamicResourceService, meteringService, baasicAuthorizationService) {
            'use strict';
            $scope.syncData = {
                data: {}
            };

            var token = baasicAuthorizationService.getAccessToken();
            $scope.userDetails = null;
            if (token) {
                $scope.userDetails = baasicAuthorizationService.getUser();
            }

            $scope.driveRange = 30;
            $scope.ambientRange = 10;

            $scope.lowBeamAutoOff = {
                on: false,
                counter: 10
            };
            $scope.highBeamAutoOff = {
                on: false,
                counter: 10
            };
            $scope.turnSignalAutoOff = {
                on: false,
                counter: 10
            };

            baasicDynamicResourceService.get('Commands', '7ilgDcx7j4MLxQTH0FTfn2')
                .success(function (data) {
                    $scope.syncData.data = data;

                    $scope.lowBeamAutoOff.on = function (state) {
                        if (state !== undefined) {
                            $scope.syncData.data.state.lightLowBeam = state;
                        }
                        return $scope.syncData.data.state.lightLowBeam;
                    };
                    $scope.highBeamAutoOff.on =
                        function (state) {
                            if (state !== undefined) {
                                $scope.syncData.data.state.lightHighBeam = state;
                            }
                            return $scope.syncData.data.state.lightHighBeam;
                        };
                    $scope.turnSignalAutoOff.on = function (state) {
                        if (state !== undefined) {
                            $scope.syncData.data.state.lightTurnSignal = state;
                        }
                        return $scope.syncData.data.state.lightTurnSignal;
                    };

                    $scope.updateAutoOff($scope.lowBeamAutoOff);
                    $scope.updateAutoOff($scope.highBeamAutoOff);
                    $scope.updateAutoOff($scope.turnSignalAutoOff);
                })
                .error(function (error) {
                    console.log(error);
                });

            function getRateBy(range) {
                if (range === 30) {
                    return 'day';
                } else if (range === 5 || range === 10) {
                    return 'hour';
                } else {
                    return 'minute';
                }
            }

            function getFrom(range) {
                //Note: This sample uses demo data collected during MiniMakerFaire 2017
                var oneDay = 24 * 60 * 60 * 1000;
                var makerDate = new Date(2017, 3, 29);
                var today = new Date();
                var daysDiff = Math.round(Math.abs((makerDate.getTime() - today.getTime()) / (oneDay)));

                if (range === 30) {
                    return (daysDiff + 17) + ' days ago'; //Data before 11.04.17 is invalid data
                } else if (range === 10) {
                    return (daysDiff + 10) + ' days ago';
                } else if (range === 5) {
                    return (daysDiff + 5) + ' days ago';
                } else if (range === 2) {
                    return (daysDiff + 2) + ' days ago';
                } else if (range === 1) {
                    return daysDiff + ' days ago';
                }
            }

            function getPageSize(range) {
                if (range === 30) {
                    return 'hour';
                } else {
                    return 'minute';
                }


            }

            $scope.driveFilter = angular.extend(meteringUtilityService.getDriveDefaultFilter(), {
                from: getFrom($scope.driveRange),
                rateBy: getRateBy($scope.driveRange)
            });
            $scope.ambientFilter = angular.extend(meteringUtilityService.getAmbientDefaultFilter(), {
                from: getFrom($scope.ambientRange),
                rateBy: getRateBy($scope.ambientRange)
            });

            function updateDriverFilter() {
                $scope.driveFilter.from = getFrom($scope.driveRange);
                $scope.driveFilter.rateBy = getRateBy($scope.driveRange);
            }

            function updateAmbientFilter() {
                $scope.ambientFilter.from = getFrom($scope.ambientRange);
                $scope.ambientFilter.rateBy = getRateBy($scope.ambientRange);
            }

            $scope.refresh = function (filter) {
                if (!filter.refreshCounter) {
                    filter.refreshCounter = 1;
                }
                filter.refreshCounter = filter.refreshCounter + 1;
            };

            $scope.$watch('driveRange', function () {
                updateDriverFilter();
            });

            $scope.$watch('ambientRange', function () {
                updateAmbientFilter();
            });

            $scope.availableNames = ['KPH', 'RPM', 'RangeLeft'];
            $scope.selection = ['KPH', 'RPM'];
            $scope.toggleSelection = function toggleSelection(name) {
                var idx = $scope.selection.indexOf(name);
                // Is currently selected
                if (idx > -1) {
                    $scope.selection.splice(idx, 1);
                }
                // Is newly selected
                else {
                    $scope.selection.push(name);
                }
                $scope.driveFilter.names = $scope.selection.join();
            };



            $scope.updateAutoOff = function (autoOffState) {
                if (autoOffState.ref) {
                    $interval.cancel(autoOffState.ref);
                }
                autoOffState.counter = 10;
                if (autoOffState.on()) {
                    autoOffState.ref = $interval(function () {
                        autoOffState.counter--;
                        if (autoOffState.counter === 0) {
                            autoOffState.on(!autoOffState.on());
                            save();
                            $interval.cancel(autoOffState.ref);
                            autoOffState.counter = 10;
                        }
                    }, 1000);
                }
            };

            $scope.updateState = function (autoOff) {
                save();

                $scope.updateAutoOff(autoOff);
            };

            $scope.updateLowBeamState = function () {
                $scope.syncData.data.state.lightLowBeam = !$scope.syncData.data.state.lightLowBeam;
                $scope.updateState($scope.lowBeamAutoOff);
            };

            $scope.updateHighBeamState = function () {
                $scope.syncData.data.state.lightHighBeam = !$scope.syncData.data.state.lightHighBeam;
                $scope.updateState($scope.highBeamAutoOff);
            };

            $scope.updateTurnSignalState = function () {
                $scope.syncData.data.state.lightTurnSignal = !$scope.syncData.data.state.lightTurnSignal;
                $scope.updateState($scope.turnSignalAutoOff);
            };

            $scope.updateLockState = function () {
                $scope.syncData.data.state.locks = !$scope.syncData.data.state.locks;
                save();
            };


            function save() {
                baasicDynamicResourceService.update('Commands', $scope.syncData.data)
                    .success(function (data) {})
                    .error(function (error) {
                        console.log(error);
                    });
            }



            $scope.syncStatusDoorsWindows = function () {
                baasicDynamicResourceService.get('StatusDoorsWindows', 'fsxLX3BYs4AuhATQ01FWI0')
                    .success(function (data) {
                        $scope.statusDoorsWindowsState = {
                            windowFrontLeft: data.state.windowFrontLeft != 'closed',
                            windowFrontRight: data.state.windowFrontRight != 'closed',
                            windowRearLeft: data.state.windowRearLeft != 'closed',
                            windowRearRight: data.state.windowRearRight != 'closed',
                            doorFrontLeft: data.state.doorFrontLeft != 'closed',
                            doorFrontRight: data.state.doorFrontRight != 'closed',
                            doorRearLeft: data.state.doorRearLeft != 'closed',
                            doorRearRight: data.state.doorRearRight != 'closed',
                            trunk: data.state.trunk != 'closed',
                            sunroof: data.state.sunroof != 'closed'
                        };
                    })
                    .error(function (error) {
                        console.log(error);
                    });
            }
            $interval(function () {
                $scope.syncStatusDoorsWindows();
            }, 1000);

        }
    ]);