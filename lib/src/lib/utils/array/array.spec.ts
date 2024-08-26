import { isArrayEmpty } from './array';

describe('Array utils', () => {
    it('should return that array is empty', () => {
        expect(isArrayEmpty([])).toEqual(true);
        expect(isArrayEmpty(['test'])).toEqual(false);
    });
});
