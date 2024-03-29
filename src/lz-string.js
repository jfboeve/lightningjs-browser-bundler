const f = String.fromCharCode;
const keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
const baseReverseDic = {};

const getBaseValue = (alphabet, character) => {
    if (!baseReverseDic[alphabet]) {
        baseReverseDic[alphabet] = {};
        for (var i=0 ; i<alphabet.length ; i++) {
            baseReverseDic[alphabet][alphabet.charAt(i)] = i;
        }
    }
    return baseReverseDic[alphabet][character];
}

const getCompression = (uncompressed, bitsPerChar, getCharFromInt) => {
    if(uncompressed === null) {
        return "";
    }
    const context_dictionary = {},
          context_dictionaryToCreate = {},
          context_data = [];
    let i, ii, value,
        context_c ="",
        context_wc ="",
        context_w ="",
        context_enlargeIn = 2,
        context_dictSize = 3,
        context_numBits = 2,
        context_data_val = 0,
        context_data_position = 0;
    
    for(ii = 0; ii < uncompressed.length; ii += 1) {
        context_c = uncompressed.charAt(ii);
        if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
            context_dictionary[context_c] = context_dictSize++;
            context_dictionaryToCreate[context_c] = true;
        }
        context_wc = context_w + context_c;
        if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
            context_w = context_wc;
        }
        else {
            if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
                if (context_w.charCodeAt(0)<256) {
                    for (i = 0; i < context_numBits; i++) {
                        context_data_val = (context_data_val << 1);
                        if (context_data_position == bitsPerChar-1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        } else {
                            context_data_position++;
                        }
                    }
                    value = context_w.charCodeAt(0);
                    for (i = 0; i < 8; i++) {
                        context_data_val = (context_data_val << 1) | (value&1);
                        if (context_data_position == bitsPerChar-1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        } else {
                            context_data_position++;
                        }
                        value = value >> 1;
                    }
                }
                else {
                    value = 1;
                    for (i = 0; i < context_numBits; i++) {
                        context_data_val = (context_data_val << 1) | value;
                        if (context_data_position ==bitsPerChar-1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        } else {
                            context_data_position++;
                        }
                        value = 0;
                    }
                    value = context_w.charCodeAt(0);
                    for (i = 0; i < 16; i++) {
                        context_data_val = (context_data_val << 1) | (value&1);
                        if (context_data_position == bitsPerChar-1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        } else {
                            context_data_position++;
                        }
                        value = value >> 1;
                    }
                }
                context_enlargeIn--;
                if (context_enlargeIn == 0) {
                    context_enlargeIn = Math.pow(2, context_numBits);
                    context_numBits++;
                }
                delete context_dictionaryToCreate[context_w];
            }
            else {
                value = context_dictionary[context_w];
                for (i = 0 ; i < context_numBits; i++) {
                    context_data_val = (context_data_val << 1) | (value&1);
                    if (context_data_position == bitsPerChar-1) {
                        context_data_position = 0;
                        context_data.push(getCharFromInt(context_data_val));
                        context_data_val = 0;
                    } else {
                        context_data_position++;
                    }
                    value = value >> 1;
                }
            }
            context_enlargeIn--;
            if (context_enlargeIn == 0) {
                context_enlargeIn = Math.pow(2, context_numBits);
                context_numBits++;
            }
            context_dictionary[context_wc] = context_dictSize++;
            context_w = String(context_c);
        }
    }

    if(context_w !== "") {
        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
            if(context_w.charCodeAt(0) < 256) {
                for (i = 0 ; i < context_numBits; i++) {
                    context_data_val = (context_data_val << 1);
                    if (context_data_position == bitsPerChar-1) {
                        context_data_position = 0;
                        context_data.push(getCharFromInt(context_data_val));
                        context_data_val = 0;
                    } 
                    else {
                        context_data_position++;
                    }
                }
                value = context_w.charCodeAt(0);
                for (i=0 ; i<8 ; i++) {
                    context_data_val = (context_data_val << 1) | (value&1);
                    if (context_data_position == bitsPerChar-1) {
                        context_data_position = 0;
                        context_data.push(getCharFromInt(context_data_val));
                        context_data_val = 0;
                    } 
                    else {
                        context_data_position++;
                    }
                    value = value >> 1;
                }
            }
            else {
                value = 1;
                for (i=0 ; i<context_numBits ; i++) {
                    context_data_val = (context_data_val << 1) | value;
                    if (context_data_position == bitsPerChar-1) {
                        context_data_position = 0;
                        context_data.push(getCharFromInt(context_data_val));
                        context_data_val = 0;
                    } 
                    else {
                        context_data_position++;
                    }
                    value = 0;
                }
                value = context_w.charCodeAt(0);
                for (i=0 ; i<16 ; i++) {
                    context_data_val = (context_data_val << 1) | (value&1);
                    if (context_data_position == bitsPerChar-1) {
                        context_data_position = 0;
                        context_data.push(getCharFromInt(context_data_val));
                        context_data_val = 0;
                    } 
                    else {
                        context_data_position++;
                    }
                    value = value >> 1;
                }
            }

            context_enlargeIn--;
            if (context_enlargeIn == 0) {
                context_enlargeIn = Math.pow(2, context_numBits);
                context_numBits++;
            }
            delete context_dictionaryToCreate[context_w];
        }
        else {
            value = context_dictionary[context_w];
            for (i=0 ; i<context_numBits; i++) {
                context_data_val = (context_data_val << 1) | (value&1);
                if (context_data_position == bitsPerChar-1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                }
                else {
                    context_data_position++;
                }
                value = value >> 1;
            }
        }

        context_enlargeIn--;
        if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
        }
    }

    value = 2;
    for (i = 0 ; i < context_numBits; i++) {
        context_data_val = (context_data_val << 1) | (value&1);
        if (context_data_position == bitsPerChar-1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
        } else {
            context_data_position++;
        }
        value = value >> 1;
    }

    // Flush the last char
    while (true) {
        context_data_val = (context_data_val << 1);
        if (context_data_position == bitsPerChar-1) {
            context_data.push(getCharFromInt(context_data_val));
            break;
        }
        else context_data_position++;
    }
    return context_data.join('');
}

const getDecompression = (length, resetValue, getNextValue) => {
    const dictionary = [0, 1, 2],
          result = [];

    let enlargeIn = 4,
        dictSize = 4,
        numBits = 3,
        entry = "",
        w,
        bits, resb, maxpower, power,
        c,
        data = {val: getNextValue(0), position: resetValue, index: 1};

    bits = 0;
    maxpower = Math.pow(2, 2);
    power = 1;
    while(power != maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index++);
        }
        bits |= (resb>0 ? 1 : 0) * power;
        power <<= 1;
    }

    if(bits === 2) {
        return "";
    }
    if(bits < 2) {
        maxpower = Math.pow(2, bits === 1 ? 16 : 8);
        bits = 0;
        power = 1;
        while(power != maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
        }
        c = f(bits);
    }
    dictionary[3] = c;
    w = c;
    result.push(c);
    
    while(true) {
        if(data.index > length) {
            return "";
        }
        bits = 0;
        maxpower = Math.pow(2, numBits);
        power = 1;
        while(power != maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
        }
        c = bits;
        if(bits < 2) {
            maxpower = Math.pow(2, bits === 1 ? 16 : 8);
            bits = 0;
            power = 1;
            while(power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                    data.position = resetValue;
                    data.val = getNextValue(data.index++);
                }
                bits |= (resb>0 ? 1 : 0) * power;
                power <<= 1;
            }

            dictionary[dictSize++] = f(bits);
            c = dictSize - 1;
            enlargeIn--;
        }

        if(bits === 2) {
            return result.join('');
        }

        if(enlargeIn === 0) {
            enlargeIn = Math.pow(2, numBits);
            numBits++;
        }

        if (dictionary[c]) {
            entry = dictionary[c];
        } 
        else {
            if (c === dictSize) {
                entry = w + w.charAt(0);
            } 
            else {
                return null;
            }
        }
        result.push(entry);

        dictionary[dictSize++] = w + entry.charAt(0);
        enlargeIn--;
        w = entry;

        if(enlargeIn === 0) {
            enlargeIn = Math.pow(2, numBits);
            numBits++;
        }
    }
}

export const compress = (input) => {
    return getCompression(input, 16, (a) => f(a));
}

export const decompress = (input) => {
    if(input === null) {
        return "";
    }
    if(input === "") {
        return null;
    }
    return getDecompression(input.length, 32768, (index) => input.charCodeAt(index));
}

const Base64End = {
    0: "",
    1: "===",
    2: "==",
    3: "=",
};

export const compressToBase64 = (input) => {
    if(input === null) {
        return "";
    }
    const res = getCompression(input, 6, (a) => keyStrBase64.charAt(a));
    return res + Base64End[(res.length % 4)];
}

export const decompressFromBase64 = (input) => {
    if(input === null) {
        return "";
    }
    if(input === "") {
        return null;
    }
    return getDecompression(input.length, 32, (index) => getBaseValue(keyStrBase64, input.charAt(index)));
}

export const compressToUTF16 = (input) => {
    if(input === null) {
        return "";
    }
    return getCompression(input, 15, (a) => f(a+32)) + " ";
}

export const decompressFromUTF16 = (input) => {
    if(input === null) {
        return "";
    }
    if(input === "") {
        return null;
    }
    return getDecompression(input.length, 16384, (index) => input.charCodeAt(index) - 32);
}

export const compressToUint8Array = (input) => {
    const compressed = compress(input);
    const buffer = new Uint8Array(input.length * 2);

    for(let i = 0; i < compress.length; i++) {
        const value = compressed.charCodeAt(i);
        buffer[i * 2] = value >>> 8;
        buffer[i * 2 + 1] = value % 256; 
    }
    return buf;
}

export const decompressFromUint8Array = (input) => {
    if(input === null || input === undefined) {
        return decompress(input);
    }
    else {
        const buffer = new Array(input.length / 2);
        const bufferLength = buffer.length;
        for(let i = 0; i < bufferLength; i++) {
            buffer[i] = input[i * 2] * 256 + input[i * 2 + 1];
        }
        const result = buffer.map((c) => f(c));
        return decompress(result.join(''));
    }
}

export const compressToEncodedURIComponent = (input) => {
    if(input === null) {
        return ""
    }
    return getCompression(input, 6, (a) => keyStrUriSafe.charAt(a));
}

export const decompressFromEncodedURIComponent = (input) => {
    if(input === null) {
        return "";
    }
    if(input === "") {
        return null;
    }
    input = input.replace(/ /g, "+");
    return getDecompression(input.length, 32, (index) => getBaseValue(keyStrUriSafe, input.charAt(index)));
}

export default {
    compress,
    decompress,
    compressToBase64,
    decompressFromBase64,
    compressToUTF16,
    decompressFromUTF16,
    compressToUint8Array,
    decompressFromUint8Array,
    compressToEncodedURIComponent,
    decompressFromEncodedURIComponent
}