/**
 * Utility functions to encode and decode payment JSONs
 */

/**
 * Encodes a payment JSON object into a URL-safe string
 * @param {{description: string, amount: number, uuid: string}} json 
 * @returns {string} URL-safe encoded string
 */
export function encodePaymentJSON(json) {
    // Validar que el JSON tenga la estructura esperada
    if (!json.description || !json.amount || !json.uuid) {
        throw new Error('Invalid payment JSON structure');
    }

    // Convertir a string y codificar en base64 URL-safe
    const jsonString = JSON.stringify(json);
    return btoa(jsonString)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

/**
 * Decodes a URL-safe string back into a payment JSON object
 * @param {string} encoded 
 * @returns {{description: string, amount: number, uuid: string}}
 */
export function decodePaymentJSON(encoded) {
    try {
        // Restaurar el formato base64 estándar
        const base64 = encoded
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        
        // Agregar padding si es necesario
        const padding = base64.length % 4;
        const paddedBase64 = padding ? base64 + '='.repeat(4 - padding) : base64;
        
        // Decodificar y parsear
        const jsonString = atob(paddedBase64);
        const decoded = JSON.parse(jsonString);

        // Validar la estructura del JSON decodificado
        if (!decoded.description || !decoded.amount || !decoded.uuid) {
            throw new Error('Invalid decoded payment structure');
        }

        return decoded;
    } catch (error) {
        throw new Error('Failed to decode payment JSON: ' + error.message);
    }
}

// Ejemplo de uso:
/*
const payment = {
    description: "Store purchase",
    amount: 12000.5,
    uuid: "0c56ccbd-f6f7-46bf-9264-71e1c8c28812"
};

const encoded = encodePaymentJSON(payment);
console.log('Encoded:', encoded);

const decoded = decodePaymentJSON(encoded);
console.log('Decoded:', decoded);
*/ 