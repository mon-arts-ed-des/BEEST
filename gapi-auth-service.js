'use strict';

angular.module('driveApp')
    .factory('gapiAuthService', function ($q) {
        //Google Drive api client id
        var client_id="97361103722-bs8u1e0lp7rnati4703leav6b4nknhg7.apps.googleusercontent.com";
        var scope=['https://www.googleapis.com/auth/drive.file'];

        function getConfig(immediate){
            return {
                'client_id': client_id,
                'scope': scope,
                immediate: immediate
            }
        }

        function isTokenNeedsRefresh(token){
            return !token || moment.duration(moment(token.expires_at*1000).valueOf()-moment().valueOf()).minutes()<10;
        }

        return {
            checkLogin:function(){
                var deferred = $q.defer();

                gapiCallbacks.push(function () {
                    if (isTokenNeedsRefresh(gapi.auth.getToken())) {
                        gapi.auth.authorize(getConfig(true), function (authResult) {
                            if (authResult && !authResult.error) {
                                deferred.resolve(gapi.auth.getToken().access_token);
                            } else {
                                deferred.reject(authResult);
                            }
                        })
                    } else {
                        deferred.resolve(gapi.auth.getToken().access_token);
                    }
                });

                return deferred.promise;
            },

            login:function() {
                var deferred = $q.defer();
                //check login status
                this.checkLogin().then(function (accessToken) {
                    deferred.resolve(accessToken);
                }, function () {
                    gapi.auth.authorize(getConfig(false), function (authResult) {
                        if (authResult && !authResult.error) {
                            deferred.resolve(gapi.auth.getToken().access_token);
                        } else {
                            deferred.reject(authResult);
                        }
                    })
                });

                return deferred.promise;
            }
        }


    });
