export class Timeline {
  #pointer = null

  set pointer(position) {
    this.#pointer = _.clamp(position, 0, this.timeLine.length - 1)
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
    this.timeLine = []

    this.timelinePush = _.debounce(this.timelinePush, 50)

    this.init(initialData)
  }

  init(initialData) {
    this.backBtnEl.addEventListener('click', this.timeLineBack.bind(this))
    this.nextBtnEl.addEventListener('click', this.timeLineNext.bind(this))
    this.withDataBinding()

    this.timelinePush(initialData)
  }

  withDataBinding() {
    const getFormData = () => ({
      title: this.titleInputEl.value,
      description: this.descriptionInputEl.value,
    })

    this.formEl.addEventListener('input', () => {
      this.timelinePush(getFormData())
    })
  }

  timelinePush(data) {
    this.timeLine.push(data)
    this.pointer = this.timeLine.length - 1
    this.syncView()
  }

  timeLineBack() {
    this.pointer--
    this.syncView()
  }

  timeLineNext() {
    this.pointer++
    this.syncView()
  }

  syncView() {
    const { title, description } = this.timeLine.at(this.pointer)

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
    return this.#pointer === this.timeLine.length - 1
  }
}
