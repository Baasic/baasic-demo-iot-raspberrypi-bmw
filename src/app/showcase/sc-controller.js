angular.module('baasic.blog')
    .controller('SCCtrl', ['$scope', '$state', 'meteringUtilityService', 'baasicDynamicResourceService', 'meteringService',
        function ($scope, $state, meteringUtilityService, baasicDynamicResourceService, meteringService) {
            'use strict';
            $scope.syncData = meteringService.syncData;

            $scope.driveFilter = angular.extend(meteringUtilityService.getDriveDefaultFilter(), {});
            $scope.ambientFilter = angular.extend(meteringUtilityService.getAmbientDefaultFilter(), {});
            $scope.commandsFilter = angular.extend(meteringUtilityService.getCommandsDefaultFilter(), {});

            $scope.updateLowBeamState = function (state) {
                var data = angular.copy($scope.syncData.data);
                data.state.lightLowBeam = state;
                save(data);
            };

            $scope.updateHighBeamState = function (state) {
                var data = angular.copy($scope.syncData.data);
                data.state.lightHighBeam = state;
                save(data);
            };

            $scope.updateTurnSignalState = function (state) {
                var data = angular.copy($scope.syncData.data);
                data.state.lightTurnSignal = state;
                save(data);
            };

            function save(data) {
                baasicDynamicResourceService.update('Commands', data)
                    .success(function (data) {
                        $scope.syncData.data = data;
                    })
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