angular.module('baasic.blog')
    .controller('SCCtrl', ['$scope', '$state', 'meteringUtilityService',
        function ($scope, $state, meteringUtilityService) {
            'use strict';

            $scope.requestFilter = angular.extend(meteringUtilityService.getDriveDefaultFilter(), {});

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