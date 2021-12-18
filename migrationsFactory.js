import { Migration } from './migration.js'

export class MigrationsFactory {
  static getInstance(field, executePayload, undoPayload) {
    if (field === 'title') {
      return new Migration(
        executePayload,
        (data, title) => ({ ...data, title }),
        undoPayload,
        (data, previousTitle) => ({ ...data, title: previousTitle }),
      )
    } else if (field === 'description') {
      return new Migration(
        executePayload,
        (data, description) => ({ ...data, description }),
        undoPayload,
        (data, previousDescription) => ({
          ...data,
          description: previousDescription,
        }),
      )
    }
  }
}
