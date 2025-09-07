export const errorParseInterceptor = (error) => {

    if (error.response) {

        const {
            status = '500',
            statusText = 'Service Error',
            message = ''
        } = error.response

        return {
            status,
            statusText,
            message
        }
    }

    return {
        status: '',
        statusText: error.message || 'Service unavailable',
        message: 'Something wrong...'
    }
}
