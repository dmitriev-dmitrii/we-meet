import {ref} from "vue";

const messagesList = ref([])

var ws = new WebSocket("ws://host:port/");

socket.onopen = function() {
    console.log('open')
    //do something when connection estabilished
};

socket.onmessage = function(message) {
    console.log('msg')
    //do something when message arrives
};

socket.onclose = function() {
    console.log('close')
    //do something when connection close
};






export const useMeetChat = ()=> {

    const submitMessage = (message = 'hui')=> {

        // { event: "chat-message", payload: { userName, message }}
        // conn.send(JSON.stringify())

        // setTimeout(function (){
        //     wsSend(message);
        // },100);
    }

 return {
     submitMessage,
     messagesList
 }
}