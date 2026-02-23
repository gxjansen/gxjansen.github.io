declare var umami:
  | {
      track(event: string, data?: Record<string, string>): void;
    }
  | undefined;
