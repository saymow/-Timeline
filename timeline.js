import { MigrationsFactory } from './migrationsFactory.js'

const with150msDebounce = (callback) => _.debounce(callback, 150)
export class Timeline {
  /** @type {number} */
  #pointer = -1
  /** @type {any} */
  data = null
  /** @type {Migration[]} */
  migrations = []

  set pointer(position) {
    this.#pointer = _.clamp(position, -1, this.migrations.length - 1)
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
      with150msDebounce((e) => this.onTitleChanges(e.target.value)),
    )

    this.descriptionInputEl.addEventListener(
      'input',
      with150msDebounce((e) => this.onDescriptionChanges(e.target.value)),
    )
  }

  onTitleChanges(value) {
    const previousValue = this.data.title

    this.migrations.push(
      MigrationsFactory.getInstance('title', value, previousValue),
    )

    this.migrationsLatest()
  }

  onDescriptionChanges(value) {
    const previousValue = this.data.description

    this.migrations.push(
      MigrationsFactory.getInstance('description', value, previousValue),
    )

    this.migrationsLatest()
  }

  migrationsLatest() {
    this.pointer = this.migrations.length - 1
    this.data = this.currentMigration().execute(this.data)
    this.syncView()
  }

  migrationsNext() {
    this.pointer++
    this.data = this.currentMigration().execute(this.data)
    this.syncView()
  }

  migrationsBack() {
    this.data = this.currentMigration().undo(this.data)
    this.pointer--
    this.syncView()
  }

  currentMigration() {
    return this.migrations.at(this.pointer)
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
    return this.pointer === -1
  }

  isAtEnd() {
    return this.pointer === this.migrations.length - 1
  }
}
