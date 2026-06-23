export const toCapitalCase = (value) => {
    if (!value) return '';

    return value.charAt(0) + value.slice(1).toLowerCase();
};