angular.module('baasic.blog')
    .controller('SCCtrl', ['$scope', '$state', '$interval', 'meteringUtilityService', 'baasicDynamicResourceService', 'meteringService',
        function ($scope, $state, $interval, meteringUtilityService, baasicDynamicResourceService, meteringService) {
            'use strict';
            $scope.syncData = {
                data: {}
            };

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

            $scope.driveFilter = angular.extend(meteringUtilityService.getDriveDefaultFilter(), {});
            $scope.ambientFilter = angular.extend(meteringUtilityService.getAmbientDefaultFilter(), {});

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

            $scope.updateHighBeamState = function (state) {
                var data = angular.copy($scope.syncData.data);
                data.state.lightHighBeam = state;
                save(data);

                $scope.updateAutoOff($scope.highBeamAutoOff);
            };

            $scope.updateTurnSignalState = function (state) {
                var data = angular.copy($scope.syncData.data);
                data.state.lightTurnSignal = state;
                save(data);

                $scope.updateAutoOff($scope.turnSignalAutoOff);
            };



            function save() {
                baasicDynamicResourceService.update('Commands', $scope.syncData.data)
                    .success(function (data) {})
                    .error(function (error) {
                        console.log(error);
                    });
            }

            //$scope.$root.loader.suspend();

            // blogService.get($state.params.slug, {
            //         embed: 'tags'
            //     })
            //     .success(function (blog) {
            //         $scope.blog = blog;
            //         $scope.authorId = $scope.blog.authorId;
            //     })
            //     .error(function (error) {
            //         console.log(error); // jshint ignore: line
            //     })
            //     .finally(function () {
            //         $scope.$root.loader.resume();
            //     });




        }
    ]);