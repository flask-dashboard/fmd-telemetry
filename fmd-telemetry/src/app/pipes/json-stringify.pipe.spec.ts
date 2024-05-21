import { JsonStringifyPipePipe } from '../json-stringify-pipe.pipe';

describe('JsonStringifyPipePipe', () => {
  it('create an instance', () => {
    const pipe = new JsonStringifyPipePipe();
    expect(pipe).toBeTruthy();
  });
});
