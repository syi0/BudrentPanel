function isValidNIP(nip) {
    return /^\d{10}$/.test(nip);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = { isValidNIP, isValidEmail };
