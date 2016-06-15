/**
 * Created by Alireza Mirian (alireza.mirian@gmail.com) on 05/24/2016.
 */


(function(angular){
    "use strict";

    var MAX_TRIES = 5;
    var TRY_INTERVAL = 100;

    /**
     * @ngdoc module
     * @name chrome-autofill-fix
     * @module chrome-autofill-fix
     * @description
     * A tiny fix for chrome problems regarding auto-filled passwords
     *
     */
    angular.module("chrome-autofill-fix", [])
        /**
         * @ngdoc directive
         * @module chrome-autofill-fix
         * @name mdInputContainer
         * Prevents floating label collapsing in [angular-material](https://material.angularjs.org/latest/demo/input) inputs
         *
         */
        .directive('mdInputContainer', ['$interval', mdInputContainerDirective])
        /**
         * @ngdoc directive
         * @module chrome-autofill-fix
         * @name required
         * Overrides the default `required` validator to take Chrome auto-filling into account
         */
        .directive("required", ['$interval', '$log', requiredDirective]);

    function requiredDirective($interval, $log) {
        return {
            priority: 100,
            require: "?ngModel",
            link: linkFn
        };
        function linkFn(scope, elem, attrs, ngModel) {
            if(!ngModel){
                // no ngModel, nothing to do!
                return;
            }
            var originalValidator = ngModel.$validators.required;
            ngModel.$validators.required = validator;

            // try validating until
            var tries = 0;
            var timer = $interval(function () {
                tries++;
                if (tries > MAX_TRIES) {
                    $interval.cancel(timer);
                }
                ngModel.$validate();
            }, TRY_INTERVAL);

            function validator(modelValue, viewValue) {

                if (isChrome() && elem[0].matches("input[type=password]:-webkit-autofill")) {
                    $log.info("bypassing required validator because of Chrome auto-filling");
                    $interval.cancel(timer);
                    return true;
                }
                return originalValidator(modelValue, viewValue);
            }
        }
    }

    function mdInputContainerDirective($interval) {
        return {
            restrict: "E",
            link: linkFn
        };
        function linkFn($scope, elem) {
            if (isChrome()) {
                var tries = 0;
                var timer = $interval(function () {
                    tries++;
                    if (tries > MAX_TRIES) {
                        $interval.cancel(timer);
                    }
                    if (elem[0].querySelector('input[type=password]:-webkit-autofill')) {
                        elem.addClass('md-input-has-value');
                        $interval.cancel(timer);
                    }
                }, TRY_INTERVAL);
            }
        }
    }


    function isChrome(){
        return navigator.userAgent.match(/chrome/i) && !navigator.userAgent.match(/edge/i);
    }
    
    /**
     * element.matches() pollyfill
     */
    Element && function(ElementPrototype) {
        ElementPrototype.matches = ElementPrototype.matchesSelector ||
            ElementPrototype.mozMatchesSelector ||
            ElementPrototype.msMatchesSelector ||
            ElementPrototype.oMatchesSelector ||
            ElementPrototype.webkitMatchesSelector ||
            function (selector) {
                var node = this, nodes = (node.parentNode || node.document).querySelectorAll(selector), i = -1;

                while (nodes[++i] && nodes[i] != node);

                return !!nodes[i];
            }
    }(Element.prototype);
})(angular);
