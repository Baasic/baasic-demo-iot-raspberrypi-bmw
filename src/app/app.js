angular.module('baasic.blog', [
    'baasic.article'
]);

angular.module('myBlog', [
        'ui.router',
        'ngAnimate',
        'btford.markdown',
        'ngTagsInput',
        'smoothScroll',
        'baasic.security',
        'baasic.membership',
        'baasic.dynamicResource',
        'baasic.blog',
        'baasic.userProfile',
        'baasic.metering',
        'ui.gravatar'
    ])
    .config(['$locationProvider', '$urlRouterProvider', '$stateProvider', 'baasicAppProvider', 'baasicAppConfigProvider',
        function config($locationProvider, $urlRouterProvider, $stateProvider, baasicAppProvider, baasicAppConfigProvider) {
            'use strict';

            baasicAppProvider.create(baasicAppConfigProvider.config.apiKey, {
                apiRootUrl: baasicAppConfigProvider.config.apiRootUrl,
                apiVersion: baasicAppConfigProvider.config.apiVersion
            });

            $locationProvider.html5Mode({
                enabled: true
            });

            $urlRouterProvider.when('', '/');

            /*
                    $urlRouterProvider.otherwise(function ($injector) {
                        var $state = $injector.get('$state');
                        $state.go('404');
                    });
            */

            $urlRouterProvider.rule(function ($injector, $location) {
                var path = $location.path();

                // check to see if the path ends in '/'
                if (path[path.length - 1] === '/') {
                    $location.replace().path(path.substring(0, path.length - 1));
                }
            });

            $urlRouterProvider.otherwise(function ($injector, $location) {
                var state = $injector.get('$state');
                var searchObject = $location.search();
                if (searchObject && searchObject.oauth_token) {
                    state.go('login', searchObject);
                } else if (searchObject && searchObject.code) {
                    state.go('login', searchObject);
                } else {
                    state.go('404');
                }
                return $location.path();
            });

            $stateProvider
                .state('master', {
                    abstract: true,
                    url: '/',
                    templateUrl: 'templates/master.html'
                })
                .state('master.main', {
                    abstract: true,
                    templateUrl: 'templates/main.html',
                    controller: 'MainCtrl'
                })
                .state('master.main.index', {
                    url: '',
                    templateUrl: 'templates/showcase/home.html',
                    controller: 'SCCtrl'
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'templates/login.html'
                })
                .state('404', {
                    templateUrl: 'templates/404.html'
                });
        }


    ])
    .constant('recaptchaKey', '6LcmVwMTAAAAAKIBYc1dOrHBR9xZ8nDa-oTzidES')
    .controller('MainCtrl', ['$scope', '$state', '$rootScope', '$browser', 'baasicBlogService',
        function MainCtrl($scope, $state, $rootScope, $browser, blogService) {
            'use strict';

            // http://stackoverflow.com/questions/8141718/javascript-need-to-do-a-right-trim
            var rightTrim = function (str, ch) {
                if (!str) {
                    return '';
                }
                for (var i = str.length - 1; i >= 0; i--) {
                    if (ch !== str.charAt(i)) {
                        str = str.substring(0, i + 1);
                        break;
                    }
                }
                return str ? str : '';
            };

            $rootScope.baseHref = rightTrim($browser.baseHref.href, ('/'));
            if ($rootScope.baseHref === '/') {
                $rootScope.baseHref = '';
            }

            blogService.tags.find({
                    rpp: 10
                })
                .success(function (tagList) {
                    $scope.tags = tagList.item;
                });

            $scope.setEmptyUser = function setEmptyUser() {
                $scope.$root.user = {
                    isAuthenticated: false
                };
            };

            $scope.newBlogPost = function newBlogPost() {
                $state.go('master.new-blog-post');
            };
        }
    ])
    .controller('SearchCtrl', ['$scope', '$state', function ($scope, $state) {
        'use strict';

        $scope.searchBlog = function searchBlog() {
            if ($scope.searchFor) {
                $state.go('master.main.blog-search', {
                    search: $scope.searchFor
                });
            }
        };
    }])
    .run(['$rootScope', '$window', 'baasicAuthorizationService',
        function moduleRun($rootScope, $window, baasicAuthService) {
            'use strict';

            var token = baasicAuthService.getAccessToken();
            var userDetails;
            if (token) {
                userDetails = baasicAuthService.getUser();
            }

            var user;
            if (userDetails !== undefined && userDetails !== null) {
                user = {
                    isAuthenticated: true,
                    isAdmin: userDetails.roles.indexOf('Administrators') !== -1
                };

                angular.extend(user, userDetails);
            } else {
                user = {
                    isAuthenticated: false
                };
            }

            $rootScope.user = user;
        }
    ]);