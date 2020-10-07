import numeral from 'numeral';

/**
 * Generate Format
 * @param number_of_characters 
 */
const GetFormat = (number_of_characters: number) => {
    let format: string = "";
    for (let i = 0; i < number_of_characters; i++) {
        format += "0";
    }
    return format;
};

/**
 * Custom Code Generator
 * @param prefix                Prefix
 * @param number_of_characters  Number of Characters for the Numerical Section
 * @param current_value         Current Value
 */
export const CodeGenerator = (prefix: string, number_of_characters: number, current_value: number) => {
    return prefix + numeral(current_value + 1).format(GetFormat(number_of_characters));
};