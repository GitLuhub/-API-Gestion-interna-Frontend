import '@testing-library/jest-dom';
import { fetch, Headers, Request, Response } from 'cross-fetch';
import { TextEncoder, TextDecoder } from 'util';
import { TransformStream, WritableStream } from 'web-streams-polyfill';
import { BroadcastChannel } from 'worker_threads';

global.fetch = fetch;
global.Headers = Headers as any;
global.Request = Request as any;
global.Response = Response as any;
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;
global.TransformStream = TransformStream;
global.WritableStream = WritableStream as any;
global.BroadcastChannel = BroadcastChannel as any;

import { server } from './mocks/server';
import { store } from './store';
import { apiSlice } from './store/apiSlice';

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  store.dispatch(apiSlice.util.resetApiState());
});
afterAll(() => server.close());
