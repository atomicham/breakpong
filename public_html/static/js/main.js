var pongBreakApp = angular.module('pongBreakApp', ['ngRoute']);

pongBreakApp.directive('script', function ($parse, $rootScope, $compile) {
	return {
		restrict: 'E',
		terminal: true,
		link: function (scope, element, attr) {
			if (attr.ngSrc) {
				var domElem = '<script src="' + attr.ngSrc + '" async defer></script>';
				$(element).append($compile(domElem)(scope));
			}
		}
	};
});

pongBreakApp.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.
	when('/lobby', {
		templateUrl: 'static/app/views/lobby.html',
		controller: 'lobbyController'
	})
	.when('/account', {
		templateUrl: 'static/app/views/account.html',
		controller: 'accountController'
	})
	.when('/game', {
		templateUrl: 'static/app/views/game.html',
		controller: 'gameController'
	})
	.otherwise({
		redirectTo: '/lobby'
	});
}]);

pongBreakApp.controller('masterController', function pongBreakMasterController() {

});

pongBreakApp.controller('lobbyController', function pongBreakLobbyController() {

});

pongBreakApp.controller('gameController', function pongBreakLobbyController() {

});

pongBreakApp.controller('accountController', function pongBreakLobbyController() {

});

pongBreakApp.controller('chatController', function chatController() {

});