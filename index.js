const formEl = document.querySelector('[data-id="form"]')
const titleInputEl = document.querySelector('[data-id="title-input"]')
const descriptionInputEl = document.querySelector(
  '[data-id="description-input"]',
)
const titleEl = document.querySelector('[data-id="title"]')
const descriptionEl = document.querySelector('[data-id="description"]')
const backBtnEl = document.querySelector('[data-id="go-back"]')
const nextBtnEl = document.querySelector('[data-id="go-next"]')

const initialData = {
  title: 'Initial title',
  description: 'Initial description',
}

class App {
  #pointer = null

  set pointer(position) {
    this.#pointer = _.clamp(position, 0, this.timeLine.length - 1)
  }

  get pointer() {
    return this.#pointer
  }

  constructor() {
    this.timeLine = []

    this.timelinePush = _.debounce(this.timelinePush, 50)
    this.init()
  }

  init() {
    backBtnEl.addEventListener('click', this.timeLineBack.bind(this))
    nextBtnEl.addEventListener('click', this.timeLineNext.bind(this))
    this.withDataBinding()

    this.timelinePush(initialData)
  }

  withDataBinding() {
    const getFormData = () => ({
      title: titleInputEl.value,
      description: descriptionInputEl.value,
    })

    formEl.addEventListener('input', () => {
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
    titleInputEl.value = title
    descriptionInputEl.value = description
  }

  syncCard(title, description) {
    titleEl.textContent = title
    descriptionEl.textContent = description
  }

  syncControllers() {
    if (this.isAtStart()) backBtnEl.setAttribute('disabled', 'disabled')
    else backBtnEl.removeAttribute('disabled')

    if (this.isAtEnd()) nextBtnEl.setAttribute('disabled', 'disabled')
    else nextBtnEl.removeAttribute('disabled')
  }

  isAtStart() {
    return this.#pointer === 0
  }

  isAtEnd() {
    return this.#pointer === this.timeLine.length - 1
  }
}

const app = new App()
