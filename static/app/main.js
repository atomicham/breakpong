var pongBreakApp = angular.module('pongBreakApp', ['ngRoute', 'chatModule', 'lobbyModule']);

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
		controller: 'lobbyController',
		controllerAs: 'lobby'
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

pongBreakApp.controller('masterController', ['$scope', '$http', function pongBreakMasterController($scope, $http) {
	$scope.toggleChat = function (show) {
		if (show) {
			$("#chatWindow").show();
		} else {
			$("#chatWindow").hide();
		}
	};

	$scope.user = {};

	$http.get('/profile/details').then(function (res) {
		$scope.user = res.data;
	});

}]);

pongBreakApp.controller('gameController', ['$scope', function pongBreakLobbyController($scope) {
	$scope.toggleChat(true);
}]);

pongBreakApp.controller('accountController', ['$scope', function pongBreakLobbyController($scope) {
	$scope.toggleChat(false);
}]);