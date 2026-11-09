export type Burst = { id: string | null; frame: number }

declare module 'claude-code' {
  interface PluginState {
    'six-seven': { burst: Burst; seen: string[] }
  }
}
