angular.module('lobbyModule', [])
.controller('lobbyController', ['$scope', function pongBreakLobbyController($scope) {
	$scope.toggleChat(true);

	var socket = io(window.location.origin + '/lobby');
	var self = this;
	this.games = {};
	this.lobbyName = "Magical Lobby Land";

	socket.on('new game', function (game) {
		$scope.$apply(function () {
			self.games[game.id] = game;
		});
	});

	socket.on('update game', function (game) {
		$scope.$apply(function () {
			self.games[game.id] = game;
		});
	});

	socket.on('remove game', function (id) {
		$scope.$apply(function () {
			delete self.games[id];
		});
	});
}])
.directive('avatar', function () {
	return {
		restrict: 'E',
		scope: {
			name: '=name'
		},
		template: '<div class="avatar"><img class="profileImg" title="{{name}}" ng-src="/profile/{{name}}/avatar" /></div>'
	};
});
