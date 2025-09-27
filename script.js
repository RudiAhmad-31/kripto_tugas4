// Toggle antara input sesuai algoritma
function toggleInputs() {
    const algorithm = document.getElementById('algorithm').value;
    const caesarInput = document.getElementById('caesar-input');
    const vigenereInput = document.getElementById('vigenere-input');
    const streamInput = document.getElementById('stream-input');
    const blockInput = document.getElementById('block-input');
    const superInput = document.getElementById('super-input');

    caesarInput.style.display = 'none';
    vigenereInput.style.display = 'none';
    streamInput.style.display = 'none';
    blockInput.style.display = 'none';
    superInput.style.display = 'none';

    if (algorithm === 'caesar') {
        caesarInput.style.display = 'block';
    } else if (algorithm === 'vigenere') {
        vigenereInput.style.display = 'block';
    } else if (algorithm === 'stream') {
        streamInput.style.display = 'block';
    } else if (algorithm === 'block') {
        blockInput.style.display = 'block';
    } else if (algorithm === 'super') {
        superInput.style.display = 'block';
    }
}

// Caesar Cipher Function
function caesarCipher(str, shift) {
    shift = shift % 26;
    if (shift < 0) shift = 26 + shift;

    return str.split('').map(char => {
        if (char.match(/[a-z]/i)) {
            const code = char.charCodeAt(0);
            const base = code >= 65 && code <= 90 ? 65 : 97;
            return String.fromCharCode(((code - base + shift) % 26) + base);
        }
        return char;
    }).join('');
}

// Vigenère Cipher Function
function vigenereCipher(str, key, encrypt = true) {
    key = key.toLowerCase();
    let j = 0;

    return str.split('').map(char => {
        if (char.match(/[a-z]/i)) {
            const code = char.charCodeAt(0);
            const base = code >= 65 && code <= 90 ? 65 : 97;
            const shift = key[j % key.length].charCodeAt(0) - 97;
            j++;
            const adjustedShift = encrypt ? shift : -shift;
            return String.fromCharCode(((code - base + adjustedShift + 26) % 26) + base);
        }
        return char;
    }).join('');
}

function padText(text, blockSize = 4) {
    while (text.length % blockSize !== 0) {
        text += "X";
    }
    return text;
}

// Ubah angka ke hex 2 digit
function toHex(n) {
    return n.toString(16).padStart(2, '0');
}

// Ubah hex ke angka
function fromHex(h) {
    return parseInt(h, 16);
}

// Stream Cipher
function streamCipher(text, key, encrypt = true) {
    let result = "";
    if (encrypt) {
        for (let i = 0; i < text.length; i++) {
            const t = text.charCodeAt(i);
            const k = key.charCodeAt(i % key.length);
            const c = t ^ k; 
            result += toHex(c); 
        }
    } else {
        for (let i = 0; i < text.length; i += 2) {
            const c = fromHex(text.substr(i, 2)); 
            const k = key.charCodeAt((i / 2) % key.length);
            const p = c ^ k;
            result += String.fromCharCode(p);
        }
    }
    return result;
}

// Block Cipher
function blockCipher(text, key, encrypt = true, blockSize = 4) {
    let result = "";
    if (encrypt) {
        text = padText(text, blockSize);
        for (let i = 0; i < text.length; i++) {
            const t = text.charCodeAt(i);
            const k = key.charCodeAt(i % key.length);
            const c = t ^ k;
            result += toHex(c);
        }
    } else {
        if (text.length % 2 !== 0) {
            alert("Ciphertext tidak valid (harus hex dengan panjang genap).");
            return "";
        }
        for (let i = 0; i < text.length; i += 2) {
            const c = fromHex(text.substr(i, 2));
            const k = key.charCodeAt((i / 2) % key.length);
            const p = c ^ k;
            result += String.fromCharCode(p);
        }
        result = result.replace(/X+$/, "");
    }
    return result;
}

function superEncrypt(plaintext, caesarKey, vigenereKey, streamKey, blockKey) {
    let step1 = caesarCipher(plaintext, caesarKey);
    let step2 = vigenereCipher(step1, vigenereKey, true);
    let step3 = streamCipher(step2, streamKey, true);
    let step4 = blockCipher(step3, blockKey, true);
    return step4; 
}

function superDecrypt(ciphertext, caesarKey, vigenereKey, streamKey, blockKey) {
    let step1 = blockCipher(ciphertext, blockKey, false);
    let step2 = streamCipher(step1, streamKey, false);
    let step3 = vigenereCipher(step2, vigenereKey, false);
    let step4 = caesarCipher(step3, -caesarKey);
    return step4;
}


// Encrypt Function
function encryptText() {
    const inputText = document.getElementById('inputText').value;
    const algorithm = document.getElementById('algorithm').value;
    let result = '';

    if (algorithm === 'caesar') {
        const shift = parseInt(document.getElementById('shift').value);
        result = caesarCipher(inputText, shift);
    } else if (algorithm === 'vigenere') {
        const key = document.getElementById('vigenereKey').value;
        result = vigenereCipher(inputText, key, true);
    } else if (algorithm === 'stream') {
        const key = document.getElementById('streamKey').value;
        result = streamCipher(inputText, key, true);
    } else if (algorithm === 'block') {
        const key = document.getElementById('blockKey').value;
        result = blockCipher(inputText, key, true);
    } else if (algorithm === 'super') {
        const caesarKey = parseInt(document.getElementById('superCaesar').value);
        const vigenereKey = document.getElementById('superVigenere').value;
        const streamKey = document.getElementById('superStream').value;
        const blockKey = document.getElementById('superBlock').value;
        result = superEncrypt(inputText, caesarKey, vigenereKey, streamKey, blockKey);
    }

    document.getElementById('resultText').value = result;
}

// Decrypt Function
function decryptText() {
    const inputText = document.getElementById('inputText').value;
    const algorithm = document.getElementById('algorithm').value;
    let result = '';

    if (algorithm === 'caesar') {
        const shift = parseInt(document.getElementById('shift').value);
        result = caesarCipher(inputText, -shift);
    } else if (algorithm === 'vigenere') {
        const key = document.getElementById('vigenereKey').value;
        result = vigenereCipher(inputText, key, false);
    } else if (algorithm === 'stream') {
        const key = document.getElementById('streamKey').value;
        result = streamCipher(inputText, key, false);
    } else if (algorithm === 'block') {
        const key = document.getElementById('blockKey').value;
        result = blockCipher(inputText, key, false);
    } else if (algorithm === 'super') {
        const caesarKey = parseInt(document.getElementById('superCaesar').value);
        const vigenereKey = document.getElementById('superVigenere').value;
        const streamKey = document.getElementById('superStream').value;
        const blockKey = document.getElementById('superBlock').value;
        result = superDecrypt(inputText, caesarKey, vigenereKey, streamKey, blockKey);
    }

    document.getElementById('resultText').value = result;
}