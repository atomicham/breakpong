var pongBreakApp = angular.module('pongBreakApp', ['ngRoute']);

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