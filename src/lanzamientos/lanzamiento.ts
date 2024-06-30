export const initThrows = () => {
  if (!global.throws) {
    global.throws = {};
    global.gThrows = {};
  }
};

export const userThrows = global as unknown as {
  throws: Record<string, UserThrows>;
};

export const generalThrows = global as unknown as {
  gThrows: Record<string, UserThrows>;
};

export interface UserThrows {
  currentThrow: number;
  throws: { throw: string; special: boolean }[];
}
