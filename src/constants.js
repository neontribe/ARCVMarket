export default {
    MESSAGE_ERROR: 0,
    MESSAGE_STATUS: 1,
    MESSAGE_SUCCESS: 2,
    MESSAGE_WARNING: 3,
    copy: {
        PAYMENT_REQUEST_DEFAULT:
            "Thanks, your payment request has been sent. Please take your vouchers to your market representative for them to be sent off.",
        PAYMENT_REQUEST_ERROR:
            "There was a problem with your payment request, please try again later.",
        VOUCHER_SUBMIT_INVALID:
            "That isn't a valid voucher code, please check the number and try again.",
        VOUCHER_LOST_SIGNAL: "Not enough internet signal, voucher queued.",
        QUEUE_NETWORK_ERROR:
            "Whoops! There may be a network problem. When you have a better signal, click 'Submit queued vouchers' to retry.",
        DELETE_VOUCHER_SUCCESS:
            " has been successfully removed from your list.",
        DELETE_VOUCHER_FAIL:
            " cannot be removed at this time, please try later.",
        FORCED_LOGOUT:
            "The system has logged you out, please login again in a little while.",
        USER_LOGOUT: "You have logged out.",
        TIMEOUT_LOGOUT: "Your session has timed out, please login again.",
        UNKNOWN_EVENT: "Something unusual has happened.",
        INVALID_CREDENTIALS:
            "The username and password combination entered was not recognised. Please check your details and try again.",
        PASSWORD_RESET: "Your password has been reset.",
    },
};
