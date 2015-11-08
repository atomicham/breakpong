
var LoopbackCommChannel = Class.extend({
    maxQueueDepth: 10,
    peer: null,
    messages: null,

    init: function () {
        this.messages = [];
    },

    read:function()
    {
        return this.peer.messages.pop();
    },

    write:function(message)
    {
        if (this.messages.length >= this.maxQueueDepth)
        {
            this.messages.pop();
        }

        this.messages.push(message);
    },

    setPeer: function (commChannel) {
        this.peer = commChannel;
    }
});
