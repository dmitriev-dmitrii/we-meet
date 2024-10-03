import {ref, unref} from "vue";

const messagesList = ref([])
const userMessage= ref('')


var ws = new WebSocket("ws://localhost:3003");

ws.onopen = function(event) {
    console.log('open event', event)
    //do something when connection estabilished
};

ws.onmessage = function(event) {
    console.log('event Message',event)

    messagesList.value.push(JSON.parse(event.data))

    //do something when message arrives
};

ws.onclose = function(event) {
    console.log('event Close', event)

    //do something when connection close
};

ws.onerror = function(event) {
    console.log('error event', event)

    //do something when connection close
};






export const useMeetChat = ()=> {

    const submitMessage = ()=> {

        const payload = JSON.stringify({ userId:'hui', text : unref(userMessage) })

        if(ws.readyState){
            ws.send(payload)
         return
        }

        setTimeout(function (){
            console.warn('readyState Warn')
            ws.send(payload)
        },1000);

    }

 return {
        userMessage,
     submitMessage,
     messagesList
 }
}