export const errorParseInterceptor = (error) => {

    if (error?.response?.data) {

        const {
            status,
            statusText,
            message,
            details,
        } = error.response.data

        return {
            status,
            details,
            statusText,
            message
        }
    }

    return {
        status: '',
        statusText: error.message || 'Unexpected Error',
        message: 'Something wrong...'
    }
}
