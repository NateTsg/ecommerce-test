/**
 * Format Phone Number
 * 
 * @param {string} phone_number 
 */
export const formatPhoneNumber = (phone_number: string): string => {
    return `+251` + (phone_number ? phone_number.slice(phone_number.length - 9) : null);
}