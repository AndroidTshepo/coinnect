
var coinnect = angular.module('coinnect', ['ionic', 'coinnect.controllers', 'ionic-material', 'ionMdInput', 'ngAnimate', 'ngCordova', 'firebase','angular-svg-round-progress'])

coinnect.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})
    .directive('input', function ($timeout) {
        return {
            restrict: 'E',
            scope: {
                'returnClose': '=',
                'onReturn': '&',
                'onFocus': '&',
                'onBlur': '&'
            },
            link: function (scope, element, attr) {
                element.bind('focus', function (e) {
                    if (scope.onFocus) {
                        $timeout(function () {
                            scope.onFocus();
                        });
                    }
                });
                element.bind('blur', function (e) {
                    if (scope.onBlur) {
                        $timeout(function () {
                            scope.onBlur();
                        });
                    }
                });
                element.bind('keydown', function (e) {
                    if (e.which == 13) {
                        if (scope.returnClose) element[0].blur();
                        if (scope.onReturn) {
                            $timeout(function () {
                                scope.onReturn();
                            });
                        }
                    }
                });
            }
        }
    })

    .factory("Messages", function ($firebaseArray) {
        var messages = new Firebase("https://coinnect.firebaseio.com/");
        return $firebaseArray(messages);
    })
    .factory("menu", function ($firebaseArray) {
        var autoscroll = true;
        return {
            set: function (as) {
                autoscroll = as;

            },
            get: function () {
                return autoscroll;
            }

        }
    })

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $compileProvider) {
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
        // Turn off caching for demo simplicity's sake

        $ionicConfigProvider.views.maxCache(0);

        /*
         // Turn off back button text
         $ionicConfigProvider.backButton.previousTitleText(false);
         */

        $stateProvider.state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'AppCtrl'
        })



            .state('app.login', {
                url: '/login',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/admin/login.html',
                        controller: 'LoginCtrl'
                    },
                    'fabContent': {
                        template: ''
                    }
                }
            })

            .state('app.notification', {
                url: '/notification',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/utills/notification.html',
                        controller: 'NotificationCtrl'
                    },
                    'fabContent': {
                        template: '<button id="fab-friends"  class="button button-assertive-900  button-fab  button-fab-bottom-right expanded button-energized-900 spin " ui-sref="app.profile" ><i class="icon ion-arrow-left-a "></i></button>',
                        controller: function ($timeout) {
                            $timeout(function () {
                                document.getElementById('fab-friends').classList.toggle('on');


                            }, 900);


                        }
                    }
                }
            })


            .state('app.send_chore', {
                url: '/send_chore',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/utills/send_chore.html',
                        controller: 'sendChoreCtrl'
                    },
                    'fabContent': {
                        // template: '<button id="fab-profile" class="button button-fab button-fab-bottom-right button-energized-900"><i class="icon ion-plus"></i></button>',
                        controller: function ($timeout) {
                            /*$timeout(function () {
                             document.getElementById('fab-profile').classList.toggle('on');
                             }, 800);*/
                        }
                    }
                }
            })

            .state('app.timer', {
                url: '/timer',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/utills/timer.html',
                        controller: 'TimerCtrl'
                    },
                    'fabContent': {
                        template: '<button id="fab-timer" class="button button-assertive-900 button-fab button-fab-bottom-right expanded button-energized-900 spin" ui-sref="app.notification"><i class="icon ion-arrow-left-a"></i></button>',
                        controller: function ($timeout) {
                            $timeout(function () {
                                document.getElementById('fab-timer').classList.toggle('on');
                            }, 600);
                        }
                    }
                }
            })

            .state('app.peers', {
                url: '/peers',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/utills/peers.html',
                        controller: 'PeersCtrl'
                    },
                    'fabContent': {
                        template: '<button id="fab-profile" class="button button-fab button-assertive-900 button-fab-bottom-right button-energized-900" ui-sref="app.profile"><i class="icon ion-arrow-left-a"></i></button>',
                        controller: function ($timeout) {
                            /*$timeout(function () {
                             document.getElementById('fab-profile').classList.toggle('on');
                             }, 800);*/
                        }
                    }
                }
            })


            .state('app.registration', {
                url: '/registration',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/admin/registration.html',
                        controller: 'RegisterCtrl'
                    },
                    'fabContent': {
                        template: '<button id = "fab-n'
                    }
                }
            })


            .state('app.profile', {
                url: '/profile',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/profile.html',
                        controller: 'ProfileCtrl'
                    },
                    'fabContent': {
                        // template: '<button id="fab-profile" class="button button-fab button-fab-bottom-right button-energized-900"><i class="icon ion-plus"></i></button>',
                        controller: function ($timeout) {
                            /*$timeout(function () {
                             document.getElementById('fab-profile').classList.toggle('on');
                             }, 800);*/
                        }
                    }
                }
            })


            //.state('app.notification', {
            //    url: '/notification',
            //    views: {
            //        'menuContent': {
            //            templateUrl: 'templates/notification.html',
            //            controller: 'NotificationCtrl'
            //        },
            //        'fabContent': {
            //            template: '<button id="fab-notifications"  class="button button-assertive-900  button-fab button-fab-bottom-right expanded button-energized-900 spin " ui-sref="app.profile" ><i class="icon ion-arrow-left-a "></i></button>',
            //            controller: function ($timeout) {
            //                $timeout(function () {
            //                    document.getElementById('fab-notifications').classList.toggle('on');
            //                }, 200);
            //            }
            //        }
            //    }
            //})
            //

            .state('app.pocket-reloaded', {
                url: '/pocket-reloaded',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/pocket/pocket-reloaded.html',
                        controller: 'Pocket-reloadedCtrl'
                    },
                    'fabContent': {
                        template: '<button id="fab-friends"  class="button button-assertive-900   button-fab  button-fab-bottom-right expanded button-energized-900 spin " ui-sref="app.profile" ><i class="icon ion-arrow-left-a "></i></button>',
                        controller: function ($timeout) {
                            $timeout(function () {
                                document.getElementById('fab-friends').classList.toggle('on');


                            }, 900);


                        }
                    }
                }
            })


            .state('app.buy', {
                url: '/buy',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/pocket/buy.html',
                        controller: 'BuyCtrl'
                    },
                    'fabContent': {
                        template: '<button id="fab-friends"  class="button button-assertive-900  button-fab  button-fab-bottom-right expanded button-energized-900 spin " ui-sref="app.pocket-reloaded" ><i class="icon ion-arrow-left-a "></i></button>',
                        controller: function ($timeout) {
                            $timeout(function () {
                                document.getElementById('fab-friends').classList.toggle('on');


                            }, 900);


                        }
                    }
                }
            })


            .state('app.age', {
                url: '/age',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/pocket/age.html',
                        controller: 'AgeCtrl'
                    },
                    'fabContent': {
                        template: '<button id="fab-friends"  class="button button-assertive-900   button-fab  button-fab-top-right expanded button-energized-900 spin " ui-sref="app.pocket-reloaded" ><i class="icon ion-arrow-left-a "></i></button>',
                        controller: function ($timeout) {
                            $timeout(function () {
                                document.getElementById('fab-friends').classList.toggle('on');
                            }, 900);


                        }
                    }
                }
            })


            .state('app.gallery', {
                url: '/gallery',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/gallery.html',
                        controller: 'GalleryCtrl'
                    },
                    'fabContent': {
                        template: '<button id="fab-gallery" class="button button-assertive-900 button-fab button-fab-bottom-right expanded button-energized-900 spin" ui-sref="app.profile"><i class="icon ion-arrow-left-a"></i></button>',
                        controller: function ($timeout) {
                            $timeout(function () {
                                document.getElementById('fab-gallery').classList.toggle('on');
                            }, 600);
                        }
                    }
                }
            })


            .state('app.transfer', {
                url: '/transfer',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/pocket/transfer.html',
                        controller: 'TransferCtrl'
                    },
                    'fabContent': {
                        template: '<button id="fab-friends"  class="button button-assertive-900   button-fab  button-fab-bottom-right expanded button-energized-900 spin " ui-sref="app.pocket-reloaded" ><i class="icon ion-arrow-left-a "></i></button>',
                        controller: function ($timeout) {
                            $timeout(function () {
                                document.getElementById('fab-friends').classList.toggle('on');


                            }, 900);


                        }
                    }
                }
            })


            .state('app.shops', {
                url: '/shops',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/shops.html',
                        controller: 'ShopsCtrl'
                    },
                    'fabContent': {
                        template: '<button id="fab-friends"  class="button button-assertive-900  button-fab  button-fab-bottom-right expanded button-energized-900 spin " ui-sref="app.profile" ><i class="icon ion-arrow-left-a "></i></button>',
                        controller: function ($timeout) {
                            $timeout(function () {
                                document.getElementById('fab-friends').classList.toggle('on');


                            }, 900);


                        }
                    }
                }
            })


            .state('app.Transactions', {
                url: '/Transactions',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/pocket/Transactions.html',
                        controller: 'transactionsCtrl'
                    },
                    'fabContent': {
                        template: '<button id="fab-friends"  class="button button-assertive-900   button-fab  button-fab-bottom-right expanded button-energized-900 spin " ui-sref="app.pocket-reloaded" ><i class="icon ion-arrow-left-a "></i></button>',
                        controller: function ($timeout) {
                            $timeout(function () {
                                document.getElementById('fab-friends').classList.toggle('on');


                            }, 900);


                        }
                    }
                }
            })

            .state('app.Blockchain', {
                url: '/Blockchain',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/pocket/Blockchain.html',
                        controller: 'BlockchainCtrl'
                    },
                    'fabContent': {
                        template: '<button id="fab-friends"  class="button button-assertive-900   button-fab  button-fab-bottom-right expanded button-energized-900 spin " ui-sref="app.pocket-reloaded" ><i class="icon ion-arrow-left-a "></i></button>',
                        controller: function ($timeout) {
                            $timeout(function () {
                                document.getElementById('fab-friends').classList.toggle('on');


                            }, 900);


                        }
                    }
                }
            })

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/login');
    });


