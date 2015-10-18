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

pongBreakApp.controller('masterController', ['$scope', function pongBreakMasterController($scope) {
	$scope.toggleChat = function (show) {
		if (show) {
			$("#chatWindow").show();
		} else {
			$("#chatWindow").hide();
		}
	};
}]);

pongBreakApp.controller('lobbyController', ['$scope', function pongBreakLobbyController($scope) {
	$scope.toggleChat(true);
}]);

pongBreakApp.controller('gameController', ['$scope', function pongBreakLobbyController($scope) {
	$scope.toggleChat(true);
}]);

pongBreakApp.controller('accountController', ['$scope', function pongBreakLobbyController($scope) {
	$scope.toggleChat(false);
}]);

pongBreakApp.controller('chatController', ['$scope', function chatController($scope) {
	var socket = io(window.location.origin + '/chat');
	$scope.chat = {
		message: '',
		messages: [],
		sendMessage: function () {
			var value = this.message;
			if (!!value && !!value.trim()) {
				socket.emit('client msg', value);
				this.message = '';
			}
			return false;
		},
		messageKeyUp: function (e) {
			if (e.keyCode == 13) {
				this.sendMessage();
			}
		},
		addMessage: function (msg) {
			$scope.$apply(function () {
				$scope.chat.messages.push(msg);
			});
		}
	};

	socket.on('serv msg', function (msg) {
		$scope.chat.addMessage(msg);
	});

	socket.on('serv usr conn', function (msg) {
		$scope.chat.addMessage(msg);
	});

	socket.on('serv usr disc', function (msg) {
		$scope.chat.addMessage(msg);
	});
}]);