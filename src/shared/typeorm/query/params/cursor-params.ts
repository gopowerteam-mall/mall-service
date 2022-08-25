export class CursorParams {
  public cursor: string
  public size: number
  public cursorKey: string
  public orderKey: string

  #defaultSize = 10

  constructor(
    cursor: string,
    size: number,
    cursorKey: string,
    orderKey: string,
  ) {
    this.cursor = cursor
    this.size = size || this.#defaultSize
    this.cursorKey = cursorKey || 'id'
    this.orderKey = orderKey || 'createdAt'
  }

  public get limit() {
    return this.size
  }
}
