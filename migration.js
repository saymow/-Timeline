export class Migration {
  /**
   * @param  {any} executePayload
   * @param  {(data:any)=>any} execute
   * @param  {any} undoPayload
   * @param  {(data:any)=>any} undo
   */
  constructor(executePayload, execute, undoPayload, undo) {
    this.execute = (data) => execute(data, executePayload)
    this.undo = (data) => undo(data, undoPayload)
  }
}