# angular-chrome-autofill-fix
A tiny fix for chrome problems regarding auto-filled passwords.
This includes a fix for [angular-material inputs](https://material.angularjs.org/latest/demo/input) to prevent label collapse 
(until a fix get pulled into repo), and another fix which overrides the default `required` validator to take Chrome auto-filling into account.

## Install
```
bower install angular-chrome-autofill-fix --save
```
## Usage
just add dependency chrome-autofill-fix`:
```
angular.module('yourApp', ['chrome-autofill-fix']);
```

## Problem example
In the following form, there is an `ng-disabled` directive on the login button in order to disable it when the form is invalid. As you see the form is auto-filled and so it should be valid but it's not. `angular-chrome-autofill-fix` fix this by overriding `required` validator in a way that reports valid state when the password field is autofilled by chrome.


![chrome-autofill](https://cloud.githubusercontent.com/assets/3150694/15499432/77a0241a-21b9-11e6-86c1-961d2626028f.PNG)


