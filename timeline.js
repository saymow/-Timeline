import { Migration } from './migration.js'

export class Timeline {
  /** @type {number} */
  #pointer = 0
  /** @type {any} */
  data = null
  /** @type {Migration[]} */
  migrations = []

  set pointer(position) {
    this.#pointer = _.clamp(position, 0, this.migrations.length - 1)
  }

  get pointer() {
    return this.#pointer
  }

  /**
   * @param  {{title:String;description:string}} initialData
   * @param  {HTMLFormElement} formEl
   * @param  {HTMLInputElement} titleInputEl
   * @param  {HTMLInputElement} descriptionInputEl
   * @param  {HTMLElement} titleEl
   * @param  {HTMLElement} descriptionEl
   * @param  {HTMLButtonElement} nextBtnEl
   * @param  {HTMLButtonElement} backBtnEl
   */
  constructor(
    initialData,
    formEl,
    titleInputEl,
    descriptionInputEl,
    titleEl,
    descriptionEl,
    nextBtnEl,
    backBtnEl,
  ) {
    this.formEl = formEl
    this.titleInputEl = titleInputEl
    this.descriptionInputEl = descriptionInputEl
    this.titleEl = titleEl
    this.descriptionEl = descriptionEl
    this.nextBtnEl = nextBtnEl
    this.backBtnEl = backBtnEl
    this.data = initialData

    this.timelinePush = _.debounce(this.migrationsLatest, 50)

    this.init()
  }

  init() {
    this.backBtnEl.addEventListener('click', this.migrationsBack.bind(this))
    this.nextBtnEl.addEventListener('click', this.migrationsNext.bind(this))
    this.withDataBinding()
    this.syncView()
  }

  withDataBinding() {
    this.titleInputEl.addEventListener(
      'input',
      _.debounce((e) => {
        const value = e.target.value
        const previousValue = this.data.title

        this.migrations.push(
          new Migration(
            value,
            (data, title) => {
              return { ...data, title }
            },
            previousValue,
            (data, previousTitle) => {
              return { ...data, title: previousTitle }
            },
          ),
        )

        this.migrationsLatest()
      }),
    )

    this.descriptionInputEl.addEventListener(
      'input',
      _.debounce((e) => {
        const value = e.target.value
        const previousValue = this.data.description

        this.migrations.push(
          new Migration(
            value,
            (data, description) => {
              return { ...data, description }
            },
            previousValue,
            (data, previousDescription) => {
              return { ...data, description: previousDescription }
            },
          ),
        )

        this.migrationsLatest()
      }, 100),
    )
  }

  migrationsLatest() {
    this.pointer = this.migrations.length - 1
    this.data = this.migrations.at(this.pointer).execute(this.data)
    this.syncView()
  }

  migrationsNext() {
    this.pointer++
    this.data = this.migrations.at(this.pointer).execute(this.data)
    this.syncView()
  }

  migrationsBack() {
    this.pointer--
    this.data = this.migrations.at(this.pointer).execute(this.data)
    this.syncView()
  }

  syncView() {
    const { title, description } = this.data

    this.syncInputs(title, description)
    this.syncCard(title, description)
    this.syncControllers()
  }

  syncInputs(title, description) {
    this.titleInputEl.value = title
    this.descriptionInputEl.value = description
  }

  syncCard(title, description) {
    this.titleEl.textContent = title
    this.descriptionEl.textContent = description
  }

  syncControllers() {
    if (this.isAtStart()) this.backBtnEl.setAttribute('disabled', 'disabled')
    else this.backBtnEl.removeAttribute('disabled')

    if (this.isAtEnd()) this.nextBtnEl.setAttribute('disabled', 'disabled')
    else this.nextBtnEl.removeAttribute('disabled')
  }

  isAtStart() {
    return this.#pointer === 0
  }

  isAtEnd() {
    return this.#pointer === Math.max(this.migrations.length - 1, 0)
  }
}
