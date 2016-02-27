var myBeat = angular.module('myBeat', ['ui.router', 'ngMessages']);

myBeat.config(function($locationProvider){
	$locationProvider.html5Mode({enabled:true, requireBase:false});
});
