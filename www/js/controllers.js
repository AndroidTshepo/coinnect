/* global angular, document, window */
'use strict';

angular.module('coinnect.controllers', ['ionic','ionic-toast', 'ionMdInput', 'firebase', 'angular-svg-round-progress'])


    .controller('AppCtrl', function ($scope, $ionicModal, $ionicPopover, $timeout) {
        // Form data for the login modal
        $scope.loginData = {};
        $scope.isExpanded = false;
        $scope.hasHeaderFabLeft = false;
        $scope.hasHeaderFabRight = false;

        var navIcons = document.getElementsByClassName('ion-navicon');
        for (var i = 0; i < navIcons.length; i++) {
            navIcons.addEventListener('click', function () {
                this.classList.toggle('active');
            });
        }

        ////////////////////////////////////////
        // Layout Methods
        ////////////////////////////////////////

        $scope.hideNavBar = function () {
            document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
        };

        $scope.showNavBar = function () {
            document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
        };

        $scope.noHeader = function () {
            var content = document.getElementsByTagName('ion-content');
            for (var i = 0; i < content.length; i++) {
                if (content[i].classList.contains('has-header')) {
                    content[i].classList.toggle('has-header');
                }
            }
        };

        $scope.setExpanded = function (bool) {
            $scope.isExpanded = bool;
        };

        $scope.setHeaderFab = function (location) {
            var hasHeaderFabLeft = false;
            var hasHeaderFabRight = false;

            switch (location) {
                case 'left':
                    hasHeaderFabLeft = true;
                    break;
                case 'right':
                    hasHeaderFabRight = true;
                    break;
            }

            $scope.hasHeaderFabLeft = hasHeaderFabLeft;
            $scope.hasHeaderFabRight = hasHeaderFabRight;
        };

        $scope.hasHeader = function () {
            var content = document.getElementsByTagName('ion-content');
            for (var i = 0; i < content.length; i++) {
                if (!content[i].classList.contains('has-header')) {
                    content[i].classList.toggle('has-header');
                }
            }

        };

        $scope.hideHeader = function () {
            $scope.hideNavBar();
            $scope.noHeader();
        };

        $scope.showHeader = function () {
            $scope.showNavBar();
            $scope.hasHeader();
        };

        $scope.clearFabs = function () {
            var fabs = document.getElementsByClassName('button-fab');
            if (fabs.length && fabs.length > 1) {
                fabs[0].remove();
            }
        };
    })


//Login Controller
    .controller('LoginCtrl', function ($scope,ionicToast, $cordovaToast, $firebaseAuth, $location, $state, $timeout, $stateParams, ionicMaterialInk, $ionicPopup) {


//Creating a log in function to the system

        var fb = new Firebase("https://coinnect.firebaseio.com/");
        $scope.login = function (username, password) {
            var fbAuth = $firebaseAuth(fb);
            fbAuth.$authWithPassword({
                email: username,
                password: password
            }).then(function (authData) {
                //$cordovaToast.show("Successfully Logged in", 'short','center');
                ionicToast.show("Successfully logged in "+ username, 'bottom', false, 4000);
                console.log('User who has logedin :', authData.uid);
                $state.go("app.profile");

            }).catch(function (error) {

                //alert("error: " + error);
                ionicToast.show("Please check your user credentials "+ error, 'bottom', false, 4000);
            });
        }


        $scope.$parent.clearFabs();
        $timeout(function () {
            $scope.$parent.hideHeader();
        }, 0);
        ionicMaterialInk.displayEffect();
    })


    //Registration Controller
    .controller('RegisterCtrl', function ($scope,ionicToast, $firebaseAuth, $location, $timeout, $stateParams, ionicMaterialInk, ionicMaterialMotion, $ionicPopup, $state) {

       //Creating a registration controller that uses firebaseAuth method to authenticate
        $scope.createPerson = function (data) {

            var ref = new Firebase("https://coinnect.firebaseio.com/");
            ref.createUser({
                email: data.email,
                password: data.password
            }, function (error, userData) {
                if (error) {
                    //alert(error);
                    ionicToast.show("There was an error creating an account: "+ error, 'bottom', true, 4000);
                    console.log("Error creating user:", error);
                } else {
                    ionicToast.show("Successfully registered as: "+ data.email, 'bottom', false, 4000);
                    console.log("Successfully created user account with uid:", userData.uid);
                    $state.go("app.profile");

                }
            })

        }

        $scope.$parent.clearFabs();
        $timeout(function () {
            $scope.$parent.hideHeader();
        }, 0);

        $timeout(function () {
            ionicMaterialMotion.slideUp({
                selector: '.slide-up'
            });
        }, 300);

        $timeout(function () {
            ionicMaterialMotion.fadeSlideInRight({
                startVelocity: 3000
            });
        }, 700);
        ionicMaterialInk.displayEffect();
    })

    //notification controller
    .controller("NotificationCtrl", function ($scope, $timeout, $http, $cordovaGeolocation, menu, Messages, $ionicScrollDelegate, $firebaseObject, $ionicPopup, $firebaseAuth) {

        $scope.messages = Messages;
        $scope.scroll = function () {
            $ionicScrollDelegate.scrollBottom(true);
        }
        $scope.messages.$watch(function (event) {


            if ($scope.messages.length > 100) {
                $scope.messages.$remove(0);
            }
        });
        for (var i = 0; i < $scope.messages.length; i++) {
        }
        var isAndroid = ionic.Platform.isWebView() && ionic.Platform.isAndroid();
        var usercity;

        $cordovaGeolocation.getCurrentPosition()
            .then(function (position) {

                $http({
                    url: "http://maps.googleapis.com/maps/api/geocode/json",
                    method: "GET",
                    params: {
                        latlng: position.coords.latitude + "," + position.coords.longitude,
                    }
                }).then(function successCallback(response) {
                    usercity = response.data.results[4].formatted_address;
                }, function errorCallback(response) {
                    usercity = "unknown";
                });


            }, function (error) {

            });


        $scope.inputUp = function () {
            if (isAndroid) $scope.data.keyboardHeight = 216;
            $timeout(function () {
                $ionicScrollDelegate.scrollBottom(true);
            }, 300);

        };

        $scope.inputDown = function () {
            if (isAndroid) $scope.data.keyboardHeight = 0;
            $ionicScrollDelegate.resize();
        };

        $scope.send = function () {
            console.log(this.data.message);
            if (this.data !== null && this.data != null) {
                if (this.data.message != null) {
                    if (usercity == null) {
                        usercity = "unknown";
                    }
                    $scope.messages.$add({
                        "text": this.data.message,
                        "city": usercity
                    })
                    this.data.message = null;
                    $ionicScrollDelegate.scrollBottom(true);
                }
            }

        }
    })



    //Profile Controller
    .controller('ProfileCtrl', function ($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $ionicModal, $firebase, $rootScope ) {


        // Set Header
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);


        //Creating a modal using a tamplate
        $ionicModal.fromTemplateUrl('templates/test.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        //Triggering the close button to close modal
        $scope.call_modal = function () {
            $scope.modal.show();

        };

        $scope.closeModal = function () {
            $scope.modal.hide();
        };


        // Set Motion
        $timeout(function () {
            ionicMaterialMotion.slideUp({
                selector: '.slide-up'
            });
        }, 300);

        $timeout(function () {
            ionicMaterialMotion.fadeSlideInRight({
                startVelocity: 3000
            });
        }, 700);

        // Set Ink
        ionicMaterialInk.displayEffect();

    })


    //Pocket Controller
    .controller('Pocket-reloadedCtrl', function ($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $ionicModal, $ionicPopup) {


        // Set Header
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);


        //Creating a modal using a tamplate
        $ionicModal.fromTemplateUrl('templates/pocket-reloaded.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        //pop up for balance
        $scope.showAlert = function () {

            $scope.data = {};

            var alertPopup = $ionicPopup.alert({
                title: 'Balance',
                template: $scope.data.balance

            });
            alertPopup.then(function (res) {
                console.log('Thank you for not eating my delicious ice cream cone');
            });
        };

        //Triggering the close button to close modal
        $scope.call_modal = function () {
            $scope.modal.show();

        };

        $scope.closeModal = function () {
            $scope.modal.hide();
        };


        // Set Motion
        $timeout(function () {
            ionicMaterialMotion.slideUp({
                selector: '.slide-up'
            });
        }, 300);

        $timeout(function () {
            ionicMaterialMotion.fadeSlideInRight({
                startVelocity: 3000
            });
        }, 700);

        // Set Ink
        ionicMaterialInk.displayEffect();

    })



    //Shops controller
    .controller('ShopsCtrl', function ($scope, $state, $ionicModal, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, $filter) {

        //Creating a list
        $scope.datapointsList = [
            {DPNAME: 'Burger King', id: 1},
            {DPNAME: 'Pic n Pay', id: 2},
            {DPNAME: 'Shoprite', id: 3, pic: ".../img/cute.jpg"},
            {DPNAME: 'Woolworths', id: 4},
            {DPNAME: 'Ster Kenikor', id: 5},
            {DPNAME: 'McDonald', id: 6},
            {DPNAME: 'Edgars', id: 7},
            {DPNAME: 'Pep', id: 8}
        ];




        $scope.names = $scope.datapointsList;
        $scope.adn = {};
        $scope.srcchchange = function () {
            $scope.names = "";
            var filtervalue = [];
            var searchdata = $scope.datapointsList;
            console.log(searchdata);
            for (var i = 0; i < searchdata.length; i++) {
                var fltvar = $filter('uppercase')($scope.adn.item);
                var jsval = $filter('uppercase')(searchdata[i].DPNAME);

                if (jsval.indexOf(fltvar) >= 0) {
                    filtervalue.push(searchdata[i]);
                }
            }
            console.log(filtervalue);
            $scope.names = filtervalue;
        };
        $scope.resetsearch = function () {
            $scope.adn.item = "";
            $scope.names = $scope.datapointsList;
        }


        $ionicModal.fromTemplateUrl('templates/test.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        //Triggering the close button to close modal
        $scope.card = function () {
            $scope.modal.show();

        };

        $scope.closeModal = function () {
            $scope.modal.hide();
        };


        // Set Header
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.$parent.setHeaderFab('left');


        // Delay expansion
        $timeout(function () {
            $scope.isExpanded = true;
            $scope.$parent.setExpanded(false);
        }, 300);

        // Set Motion
        ionicMaterialMotion.fadeSlideInRight();

        // Set Ink
        ionicMaterialInk.displayEffect();


    })

    //peer controller
    .controller('PeersCtrl', function ($scope,ionicToast,$stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, $http, $cordovaGeolocation, menu, Messages, $ionicScrollDelegate, $state, $firebaseObject, $ionicPopup, $firebaseAuth) {

        //retrieving registered users from firebase
        $scope.items = [];
        var ref = new Firebase("https://vikash.firebaseio.com/");
        var usersRef = ref.child("profile");

        usersRef.on("value", function (snapshot) {
            snapshot.forEach(function (childSnapshot) {

                // key will be "fred" the first time and "barney" the second time
                var key = childSnapshot.key();
                // childData will be the actual contents of the child
                $scope.childData = childSnapshot.val();
                //$scope.allEmails = $scope.childData.email;
                $scope.items.push($scope.childData.email);
                console.log($scope.childData.email);

            });
        }, function (errorObject) {

            console.log("The read failed" + errorObject.code);
        })


        //sends the data
        $scope.selectedData = function (selectedId) {
            $state.go('send_chore', {id: selectedId});
        };

        $scope.messages = Messages;
        $scope.scroll = function () {
            $ionicScrollDelegate.scrollBottom(true);
        }
        $scope.messages.$watch(function (event) {


            if ($scope.messages.length > 100) {
                $scope.messages.$remove(0);
            }
        });
        for (var i = 0; i < $scope.messages.length; i++) {
        }
        var isAndroid = ionic.Platform.isWebView() && ionic.Platform.isAndroid();
        var usercity;

        $cordovaGeolocation.getCurrentPosition()
            .then(function (position) {

                $http({
                    url: "http://maps.googleapis.com/maps/api/geocode/json",
                    method: "GET",
                    params: {
                        latlng: position.coords.latitude + "," + position.coords.longitude,
                    }
                }).then(function successCallback(response) {
                    usercity = response.data.results[4].formatted_address;
                }, function errorCallback(response) {
                    usercity = "unknown";
                });


            }, function (error) {

            });


        $scope.inputUp = function () {
            if (isAndroid) $scope.data.keyboardHeight = 216;
            $timeout(function () {
                $ionicScrollDelegate.scrollBottom(true);
            }, 300);

        };

        $scope.inputDown = function () {
            if (isAndroid) $scope.data.keyboardHeight = 0;
            $ionicScrollDelegate.resize();
        };

        ionicMaterialInk.displayEffect();

        ionicMaterialMotion.fadeSlideInRight({
            selector: '.animate-fade-slide-in .item'
        })


        //popup function to send a request to notifications
        $scope.popUp = function (item) {

            $scope.data = {};

            var sendPOP = $ionicPopup.show({


                title: "Sending Chore",
                subTitle: item,
                template: '<input type="text" ng-model="data.message">',
                scope: $scope,
                buttons: [
                    {text: '<h5>Cancel</h5>'}
                    , {
                        text: '<h5>Send</h5>',
                        type: 'button-positive',
                        onTap:  function () {
                            console.log($scope.data.message);
                            ionicToast.show("Request transfered to:"+ item, 'bottom', false, 4000);
                            if ($scope.data !== null && $scope.data != null) {
                                if ($scope.data.message != null) {
                                    if (usercity == null) {
                                        usercity = "unknown";
                                    }
                                    $scope.messages.$add({
                                        "text": $scope.data.message,
                                        "city": usercity
                                    })
                                    $state.go('app.peers');
                                    $scope.data.message = null;
                                    $ionicScrollDelegate.scrollBottom(true);

                                }
                            }

                        }

                    }

                ]


            });

        }


    })


    //This is the buy control---when clicked on buying toCoins
    .controller('BuyCtrl', function ($scope, $cordovaCamera, ionicToast, $stateParams, $firebaseObject, $firebase, $timeout, ionicMaterialMotion, ionicMaterialInk, $ionicModal, $cordovaToast) {


        $scope.takePicture = function() {
            console.log("fucking camera");
            var options = {

                quality : 75,
                destinationType : Camera.DestinationType.DATA_URL,
                sourceType : Camera.PictureSourceType.CAMERA,
                allowEdit : true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.imgURI = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // An error occured. Show a message to the user
            });
        }


        $scope.numbercc = {
            cc: undefined
        }

        $scope.howmanycc = {
            cc: undefined
        }


    //Validating the card number if it does not contain any characters or if the number is not exceeding 16
        $scope.validate = function (number) {


            //Regular Expressions for validating the card number format
            if ((!/\d{15,16}(~\w[a-zA-Z])*$/g.test(number)) || (number.length > 16)) {
                ionicToast.show("Card number does not exist", 'bottom', false, 4000);
                return false;
            } else {
                return true;
            }

        }

        $scope.buy = function (number) {

            //Getting card number from a user
            var ccNumSplit = number.split(""), sum = 0, validCard = false;
            var singleNum = [], doubleNum = [], finalArray = undefined;


            if ($scope.validate(number) === true) {


                if (number.length === 15) {//american express cards
                    for (var i = ccNumSplit.length - 1; i >= 0; i--) {
                        if (i % 2 === 0) {
                            singleNum.push(ccNumSplit[i]);
                        } else {
                            doubleNum.push((ccNumSplit[i] * 2).toString());
                        }

                    }

                } else if (number.length === 16) {//normal card formats other than american express
                    for (var i = ccNumSplit.length - 1; i >= 0; i--) {
                        if (i % 2 !== 0) {
                            singleNum.push(ccNumSplit[i]);
                        } else {
                            doubleNum.push((ccNumSplit[i] * 2).toString());
                        }
                    }
                }


                doubleNum = doubleNum.join("").split("");
                finalArray = doubleNum.concat(singleNum);
                for (var j = 0; j < finalArray.length; j++) {
                    sum += parseInt(finalArray[j], 10);
                }
                if (sum % 10 === 0) {
                    validCard = true;
                    return validCard;
                } else {
                    validCard = false;
                    return validCard;
                }
            } else {


            }
            ionicToast.show("Unknown Card number", 'bottom', false, 4000);
            console.log(doubleNum);
            console.log(finalArray);
        }

        //Getting the specific type of card a user have
        //var validCard = false;
        $scope.whatCard = function (number) {


            var cardName = "unknown";


            if ($scope.buy(number) === true) {
                var cardObj = {//Card type Regular Expressions
                    "visa": /^4[0-9]{6,}$/g,
                    "mastercard": /^5[1-5][0-9]{14}$/g,
                    "american express": /^3[47][0-9]{5,}$/g,
                    "discover": /^(?:011|5[0-9]{2})[0-9]{3,}$/g,
                    "jcb": /^(?:2131|1800|35[0-9]{3,})$/g
                };


                Object.keys(cardObj).forEach(function (prop) {
                    if (cardObj[prop].test(number)) {
                        cardName = prop;
                    }
                });


                return cardName;

            } else {

                ionicToast.show("Transaction was unsuccessful", 'bottom', false, 4000);
                return false;
            }
        };


        //creating Tocoins and storing them in the database
        //Creating a function that enables a user to buy Tocoins from the database
        // var valid = false;
        $scope.buyTocoins = function () {

            var fb = new Firebase("https://coinnect.firebaseio.com/");
            var number = $scope.numbercc.cc;
            var userRef = fb.child("Pocket_Coins");
            var userBuy = $scope.howmanycc.cc;

            //var balance = $scope.remainingTocoins;

            if ($scope.whatCard(number) === false) {

                ionicToast.show("Transaction was unsuccessful Please use a valid credit card number", 'bottom', false, 4000);

            } else {
                var cardName = $scope.whatCard(number);
                $scope.balance = 400;
                var currentTocoins;
                userRef.on("value", function (snapshot) {


                     currentTocoins = snapshot.val();



                })

                    //Checking if the amount on the database is is not smaller than the one required by the user
                    if (currentTocoins >= userBuy) {
                        var balance = ((currentTocoins) - (userBuy));
                        fb.update({Pocket_Coins: balance});
                        ionicToast.show("Coins bought: "+userBuy +" Card name: "+cardName+". "+ " Remaining Tocoins: " + balance, 'bottom', true, 4000);
                        console.log("Coins requested " + userBuy);
                        console.log("Remaining Coins " + balance);
                        console.log("Card Name " + cardName);


                    }




            }
        }
            $scope.$parent.showHeader();
            $scope.$parent.clearFabs();
            $scope.isExpanded = false;
            $scope.$parent.setExpanded(false);
            $scope.$parent.setHeaderFab(false);


            //Creating a modal using a tamplate
            $ionicModal.fromTemplateUrl('templates/Buy.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });

            //Triggering the close button to close modal
            $scope.call_modal = function () {
                $scope.modal.show();

            };

            $scope.closeModal = function () {
                $scope.modal.hide();
            };


            // Set Motion
            $timeout(function () {
                ionicMaterialMotion.slideUp({
                    selector: '.slide-up'
                });
            }, 300);

            $timeout(function () {
                ionicMaterialMotion.fadeSlideInRight({
                    startVelocity: 3000
                });
            }, 700);

            // Set Ink
            ionicMaterialInk.displayEffect();

    })

    //timer controller
    .controller('TimerCtrl', function($scope, $ionicModal, $timeout, $cordovaCamera) {

        // Timer
        var mytimeout = null; // the current timeoutID
        // actual timer method, counts down every second, stops on zero
        $scope.onTimeout = function() {
            if ($scope.timer === 0) {
                $scope.$broadcast('timer-stopped', 0);
                $timeout.cancel(mytimeout);
                return;
            }
            $scope.timer--;
            mytimeout = $timeout($scope.onTimeout, 1000);
        };
        // functions to control the timer
        // starts the timer
        $scope.startTimer = function() {
            mytimeout = $timeout($scope.onTimeout, 1000);
            $scope.started = true;
        };

        // stops and resets the current timer
        $scope.stopTimer = function(closingModal) {
            if (closingModal != true) {
                $scope.$broadcast('timer-stopped', $scope.timer);
            }
            $scope.timer = $scope.timeForTimer;
            $scope.started = false;
            $scope.paused = false;
            $timeout.cancel(mytimeout);
        };
        // pauses the timer
        $scope.pauseTimer = function() {
            $scope.$broadcast('timer-stopped', $scope.timer);
            $scope.started = false;
            $scope.paused = true;
            $timeout.cancel(mytimeout);
        };

        // triggered, when the timer stops, you can do something here, maybe show a visual indicator or vibrate the device
        $scope.$on('timer-stopped', function(event, remaining) {
            if (remaining === 0) {
                $scope.done = true;
            }
        });
        // UI
        // When you press a timer button this function is called
        $scope.selectTimer = function(val) {
            $scope.timeForTimer = val;
            $scope.timer = val;
            $scope.started = false;
            $scope.paused = false;
            $scope.done = false;

        };

        // This function helps to display the time in a correct way in the center of the timer
        $scope.humanizeDurationTimer = function(input, units) {
            // units is a string with possible values of y, M, w, d, h, m, s, ms
            if (input == 0) {
                return 0;
            } else {
                var duration = moment().startOf('day').add(input, units);
                var format = "";
                if (duration.hour() > 0) {
                    format += "H[h] ";
                }
                if (duration.minute() > 0) {
                    format += "m[m] ";
                }
                if (duration.second() > 0) {
                    format += "s[s] ";
                }
                return duration.format(format);
            }
        };

        $scope.takePicture = function() {
            console.log("fucking camera");
            var options = {

                quality : 75,
                destinationType : Camera.DestinationType.DATA_URL,
                sourceType : Camera.PictureSourceType.CAMERA,
                allowEdit : true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.imgURI = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // An error occured. Show a message to the user
            });
        }

        // function for the modal
        $ionicModal.fromTemplateUrl('templates/timer.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });
    })

    //Advertisements Controller
    .controller('GalleryCtrl', function ($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);

        // Activate ink for controller
        ionicMaterialInk.displayEffect();

        ionicMaterialMotion.pushDown({
            selector: '.push-down'
        });
        ionicMaterialMotion.fadeSlideInRight({
            selector: '.animate-fade-slide-in .item'
        })


    })


    //Transfer ToCoins Controller
    .controller('TransferCtrl', function ($scope, $state, $ionicModal, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {

        //Creating a modal using a tamplate
        $ionicModal.fromTemplateUrl('templates/transfer.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        //Triggering the close button to close modal
        $scope.card = function () {
            $scope.modal.show();

        };

        $scope.closeModal = function () {
            $scope.modal.hide();
        };


        // Set Header
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.$parent.setHeaderFab('left');


        // Delay expansion
        $timeout(function () {
            $scope.isExpanded = true;
            $scope.$parent.setExpanded(false);
        }, 300);

        // Set Motion
        ionicMaterialMotion.fadeSlideInRight();

        // Set Ink
        ionicMaterialInk.displayEffect();


    })


    //Age Controller
    .controller('AgeCtrl', function ($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $ionicModal) {

        // Set Header
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);


        //Creating a modal using a tamplate
        $ionicModal.fromTemplateUrl('templates/age.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        //Triggering the close button to close modal
        $scope.call_modal = function () {
            $scope.modal.show();

        };

        $scope.closeModal = function () {
            $scope.modal.hide();
        };


        // Set Motion
        $timeout(function () {
            ionicMaterialMotion.slideUp({
                selector: '.slide-up'
            });
        }, 300);

        $timeout(function () {
            ionicMaterialMotion.fadeSlideInRight({
                startVelocity: 3000
            });
        }, 700);

        // Set Ink
        ionicMaterialInk.displayEffect();


    })


    //Transactions Controller
    .controller('transactionsCtrl', function ($scope, $ionicModal, $state) {

        //Creating a modal here using template
        $ionicModal.fromTemplateUrl('templates/Transactions.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.transfer_modal = function () {
            $scope.modal.show();

        };

        $scope.go_back = function () {

            $state.go("app.pocket-reloaded");

        }

    })

    //Scrolling for the transaction Tab
    .controller('tableSentCtrl', function ($scope, $ionicScrollDelegate) {
        $scope.scrollTop = function () {
            $ionicScrollDelegate.scrollTop();
        }
    })

    //Blockchain Controller
    .controller('BlockchainCtrl', function ($scope, $ionicModal, $state) {

        //Creating a modal here using template
        $ionicModal.fromTemplateUrl('templates/Blockchain.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.transfer_modal = function () {
            $scope.modal.show();

        };

        $scope.go_back = function () {

            $state.go("app.pocket-reloaded");

        }

    })


    //Photo Controller
    .controller('takePhoto', function ($scope, $cordovaCamera) {

        $scope.takePhoto = function () {
            var options = {
                fileKey: "avatar",
                fileName: "image.png",
                chunkedMode: "false",
                mimeType: "false",
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };
            $cordovaCamera.getPicture(options).then(function (imageData) {
                $scope.imgURI = "data:image/jpeg;base64," + imageData;
            }, function (err) {
                // An error occured. Show a message to the user
            });
        };
    })


    //sending chore notification and their controller here
    .controller('sendChoreCtrl', function ($scope, $timeout, $http, $cordovaGeolocation, menu, Messages, $ionicScrollDelegate, $state, $firebaseObject, $ionicPopup, $firebaseAuth) {

        $scope.messages = Messages;
        $scope.scroll = function () {
            $ionicScrollDelegate.scrollBottom(true);
        }
        $scope.messages.$watch(function (event) {


            if ($scope.messages.length > 100) {
                $scope.messages.$remove(0);
            }
        });
        for (var i = 0; i < $scope.messages.length; i++) {
        }
        var isAndroid = ionic.Platform.isWebView() && ionic.Platform.isAndroid();
        var usercity;

        $cordovaGeolocation.getCurrentPosition()
            .then(function (position) {

                $http({
                    url: "http://maps.googleapis.com/maps/api/geocode/json",
                    method: "GET",
                    params: {
                        latlng: position.coords.latitude + "," + position.coords.longitude,
                    }
                }).then(function successCallback(response) {
                    usercity = response.data.results[4].formatted_address;
                }, function errorCallback(response) {
                    usercity = "unknown";
                });


            }, function (error) {

            });


        $scope.inputUp = function () {
            if (isAndroid) $scope.data.keyboardHeight = 216;
            $timeout(function () {
                $ionicScrollDelegate.scrollBottom(true);
            }, 300);

        };

        $scope.inputDown = function () {
            if (isAndroid) $scope.data.keyboardHeight = 0;
            $ionicScrollDelegate.resize();
        };

        $scope.send = function () {
            console.log(this.data.message);
            if (this.data !== null && this.data != null) {
                if (this.data.message != null) {
                    if (usercity == null) {
                        usercity = "unknown";
                    }
                    $scope.messages.$add({
                        "text": this.data.message,
                        "city": usercity
                    })
                    $state.go('app.friends');
                    this.data.message = null;
                    $ionicScrollDelegate.scrollBottom(true);

                }
            }

        }


    });










