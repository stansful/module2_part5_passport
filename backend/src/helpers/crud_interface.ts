export interface Crud<Type> {
  getAll(options?: any): Promise<Type[]>;

  getOne(criteria: any): Promise<Type>;

  create(entity: Type): Promise<Type>;

  delete(criteria: any): Promise<Boolean>;
}
