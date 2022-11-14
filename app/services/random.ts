export function randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }


export function randomString(length: number, chars: string) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
