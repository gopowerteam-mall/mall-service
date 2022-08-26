import { BaseEntity } from 'typeorm'

export class EntityClass extends BaseEntity {
  toPlain() {
    return Object.assign({}, this)
  }

  static toPlain(data) {
    if (data instanceof Array) {
      return data.map((x) => Object.assign({}, x))
    } else {
      return Object.assign({}, data)
    }
  }
}

export type Constructor<T = EntityClass> = new (...args: any[]) => T

export * from './entity-with-enable'
export * from './entity-with-id'
export * from './entity-with-uuid'
export * from './entity-with-time'
export * from './entity-with-delete'
export * from './entity-with-sort'
