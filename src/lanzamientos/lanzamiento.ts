export const initThrows = () => {
  if (!global.throws) {
    global.throws = {};
  }
};

export const userThrows = global as unknown as {
  throws: Record<string, UserThrows>;
};

export interface UserThrows {
  currentThrow: number;
  throws: { throw: string; special: boolean }[];
}
