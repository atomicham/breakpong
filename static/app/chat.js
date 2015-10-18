angular.module('chatModule', [])
	.controller('chatController', ['$scope', function chatController($scope) {
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