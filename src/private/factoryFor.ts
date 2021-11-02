// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Class = new (...args: any[]) => any;

export type Constructor<T extends Class> = (...args: ConstructorParameters<T>) => InstanceType<T>;

export const factoryFor = <T extends Class>(cla$$: T): Constructor<T> => (...args) => new cla$$(...args);
