const Messages = {
    
    /**
     * General Error Messages
     */
    FILE_REQUIRED: "File is required!",
    NOT_IMPLEMENTED_ERROR: 'Not Implemented!',
    LANGUAGE_CODE_REQUIRED : "Locale required",
    SERVICE_UNAVAILABLE_ERROR: "Service Unavailable!",
    FORBIDDEN_ERROR: "Authorization Failure: You're not allowed!",
    INTERNAL_SERVER_ERROR: "Internal Error: Something went wrong!",
    IMAGE_INVALID_TYPE: "Only .png, .jpg and .jpeg format allowed!",
    UNAUTHORIZED_ERROR: "Authorization Failure: Incorrect credentials!",

    /**
     * IAM Error Messages
     */
    PASSWORD_INCORRECT: "Incorrect password!",
    USERNAME_REQUIRED: "Username is required!",
    PASSWORD_REQUIRED: "Password is required!",
    NEW_PASSWORD_REQUIRED: "New password is required!",
    CURRENT_PASSWORD_REQUIRED: "Current password is required!",
    AUTHENTICATION_ERROR: "Login Failed: Invalid email or password!",
    ACCOUNT_INACTIVE: "Your account is not active! Please contact the system admin.",

    /**
     * User Related Error Messages
     */
    USER_NOT_FOUND: "User not found",
    USER_REQUIRED: "User is required",
    USER_ALREADY_EXISTS: "User already exists",
    USER_TYPE_REQUIRED: "User type is required",
    USER_PASSWORD_REQUIRED: "Password is required",
    USER_USERNAME_REQUIRED: "Username is required",
    USER_STATUS_REQUIRED: "User status is required",

    /**
     * User Type Related Error Messages
     */
    USER_TYPE_NOT_FOUND: "User type not found",

    /**
     * LA related messages
     */
    CLIENT_NOT_FOUND: "Ecommerce Agent not found",
    CLIENT_REQUIRED: "Ecommerce Agent is requried",
    CLIENT_ALREADY_EXISTS: "Ecommerce agent already exists",
    CLIENT_PHONE_REQUIRED: "Ecommerce Agent phone is required",
    CLIENT_EMAIL_REQUIRED: "Ecommerce Agent email is required",
    CLIENT_LOCATION_REQUIRED: "Ecommerce Agent location is required",
    CLIENT_LAST_NAME_REQUIRED: "Ecommerce Agent last name is required",
    CLIENT_FIRST_NAME_REQUIRED: "Ecommerce Agent first name is required",
    CLIENT_MIDDLE_NAME_REQUIRED: "Ecommerce Agent middle name is required",

    /**
     * Product related messages
     */
    PRODUCT_STOCK_REQUIRED: "Product stock is required",
    PRODUCT_PRICE_REQUIRED: "Product price is required",
    PRODUCT_NOT_FOUND: "Product not found",
    PRODUCT_STOCK_NOT_AVAILABLE: "Product stock not available",
    PRODUCT_REQUIRED: "Product is required",
    PRODUCT_NAME_REQUIRED: "Product unit of measurement is required",
    PRODUCT_EXISTS:"Product already exists",
     /**
     * Order related messages
     */
    CARTITEM_NOT_FOUND: "Cart Item not found",
    CARTITEM_PRODUCT_REQUIRED: "Cart Item product is required",
    CARTITEM_CLIENT_REQUIRED: "Cart Item client is required",
    CARTITEM_QUANTITY_REQUIRED: "Cart Item unit of measurment is required",
 
    /**
     * Order and Transaction related messages
     */
    TRANSACTION_NOT_FOUND: "Transaction not found",
    TRANSACTION_CLIENT_REQUIRED: "Farmer is required",
    TRANSACTION_ORDERS_REQUIRED: "Orders are required",
    TRANSACTION_PRODUCT_REQUIRED: "Product is required",
    TRANSACTION_TOTAL_REQUIRED : "Transaction total requried",
    TRANSACTION_SUBTOTAL_REQUIRED : "Transaction sub total requried",
    TRANSACTION_CLIENT_ORDERS_REQUIRED: "Farmer orders are required",

};

export default Messages;