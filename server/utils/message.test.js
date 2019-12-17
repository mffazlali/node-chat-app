// 53-test-utils-message__videoroxo

var expect = require('expect');
var { generateMessage, generateLocationMessage } = require('./message');

describe('Generate message', () => {
    it('Should generate correct message object', () => {
        var from = 'mohammad';
        var text = 'hello';
        var message = generateMessage(from, text);
        expect(typeof message.createdAt).toBe('number');
        expect(message).toEqual(expect.objectContaining({ from, text }));
    })
})

describe('Generate location message', () => {
    it('Should generate correct location message object', () => {
        var from = 'ehsan';
        var latitude = 34.7897436;
        var longitude = 48.5092451;
        var url = 'https://google.com/maps?q=34.7897436,48.5092451';
        var message = generateLocationMessage(from, latitude, longitude);
        expect(typeof message.createdAt).toBe('number');
        expect(message).toEqual(expect.objectContaining({ from, url }));
    })
})