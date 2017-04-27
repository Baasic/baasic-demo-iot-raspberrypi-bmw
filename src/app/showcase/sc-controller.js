angular.module('baasic.blog')
    .controller('SCCtrl', ['$scope', '$state', '$interval', 'meteringUtilityService', 'baasicDynamicResourceService', 'meteringService',
        function ($scope, $state, $interval, meteringUtilityService, baasicDynamicResourceService, meteringService) {
            'use strict';
            $scope.syncData = {
                data: {}
            };

            $scope.driveRange = 1;
            $scope.ambientRange = 1;

            $scope.lowBeamAutoOff = {
                on: false,
                counter: 60
            };
            $scope.highBeamAutoOff = {
                on: false,
                counter: 60
            };
            $scope.turnSignalAutoOff = {
                on: false,
                counter: 60
            };
            $scope.locksAutoOff = {
                on: false,
                counter: 60
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
                    $scope.locksAutoOff.on = function (state) {
                        if (state !== undefined) {
                            $scope.syncData.data.state.locks = state;
                        }
                        return $scope.syncData.data.state.locks;
                    };

                    $scope.updateAutoOff($scope.lowBeamAutoOff);
                    $scope.updateAutoOff($scope.highBeamAutoOff);
                    $scope.updateAutoOff($scope.turnSignalAutoOff);
                    $scope.updateAutoOff($scope.locksAutoOff);
                })
                .error(function (error) {
                    console.log(error);
                });

            $scope.driveFilter = angular.extend(meteringUtilityService.getDriveDefaultFilter(), {
                from: $scope.driveRange == 10 ? '10 days ago' : ($scope.driveRange == 5) ? '5 days ago' : 'today',
                rateBy: $scope.driveRange > 1 ? 'hour' : 'minute'
            });
            $scope.ambientFilter = angular.extend(meteringUtilityService.getAmbientDefaultFilter(), {
                from: $scope.ambientRange == 10 ? '10 days ago' : ($scope.ambientRange == 5) ? '5 days ago' : 'today',
                rateBy: $scope.ambientRange > 1 ? 'hour' : 'minute'
            });

            function updateFilter() {
                $scope.driveFilter.from = $scope.driveRange == 10 ? '10 days ago' : ($scope.driveRange == 5) ? '5 days ago' : 'today';
                $scope.driveFilter.rateBy = $scope.driveRange > 1 ? 'hour' : 'minute';

                $scope.ambientFilter.from = $scope.ambientRange == 10 ? '10 days ago' : ($scope.ambientRange == 5) ? '5 days ago' : 'today';
                $scope.ambientFilter.rateBy = $scope.ambientRange > 1 ? 'hour' : 'minute';

            }

            $scope.$watch('driveRange', function () {
                updateFilter();
            });

            $scope.updateAutoOff = function (autoOffState) {
                if (autoOffState.ref) {
                    $interval.cancel(autoOffState.ref);
                }
                autoOffState.counter = 60;
                if (autoOffState.on()) {
                    autoOffState.ref = $interval(function () {
                        autoOffState.counter--;
                        if (autoOffState.counter === 0) {
                            autoOffState.on(!autoOffState.on());
                            save();
                            $interval.cancel(autoOffState.ref);
                            autoOffState.counter = 60;
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
                $scope.updateState($scope.locksAutoOff);
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
                            trunk: data.state.trunk != 'closed'
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