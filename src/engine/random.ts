// Browsers use their normal sources. The server installs an async-local resolver
// so a suspended command can be replayed with exactly the same draws and IDs.
export interface EngineSources { random(): number; uuid(): string; now(): number; }
let resolve: () => EngineSources | undefined = () => undefined;
export const setEngineSourcesResolver = (resolver: typeof resolve) => { resolve = resolver; };
export const engineRandom = () => resolve()?.random() ?? Math.random();
export const engineUuid = () => resolve()?.uuid() ?? crypto.randomUUID();
export const engineNow = () => resolve()?.now() ?? Date.now();
