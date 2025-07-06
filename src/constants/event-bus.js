export const BUS_EVENTS_INSTANCE = {
    WEB_RTC_EVENT_BUS_INSTANCE: '1',
    DATA_CHANEL_EVENT_BUS_INSTANCE: '3',
};

export const WEB_RTC_EVENT_BUS_INSTANCE = 'webrtc'

export const WEB_RTC_EVENT_BUS_TYPES = {

    PEER_UPDATE_STATUS: '1', // remote user изменился  статус соединения  web rtc
    
    PEER_REMOTE_USER_ON_TRACK: '2',// remote user начал передавать медиа треки //TODO нужен ли

    DATA_CHANEL_OPEN: '3',
    DATA_CHANEL_CLOSE: '4',

    DATA_CHANEL_TEXT_MESSAGE: '5', //текстовое сообщение
    DATA_CHANEL_MEDIA_TRACK_STATE: '6', // remote user изменяет состояние медиа треков во время звонка: вкл \ выкл видео
    
}
