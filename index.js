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
  constructor() {
    this.pointer = null
    this.timeLine = []

    this.timelinePush = _.debounce(this.timelinePush, 50)

    this.init()
  }

  init() {
    backBtnEl.addEventListener('click', this.timeLineBack.bind(this))
    nextBtnEl.addEventListener('click', this.timeLineNext.bind(this))
    this.withTwoWayDataBinding()

    this.timelinePush(initialData)
  }

  withTwoWayDataBinding() {
    const getFormData = () => {
      return {
        title: titleInputEl.value,
        description: descriptionInputEl.value,
      }
    }

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
    this.pointer = Math.max(this.pointer - 1, 0)
    this.syncView()
  }

  timeLineNext() {
    this.pointer = Math.min(this.pointer + 1, this.timeLine.length - 1)
    this.syncView()
  }

  syncView() {
    const { title, description } = this.timeLine.at(this.pointer)

    this.syncInputs(title, description)
    this.syncCard(title, description)
    this.syncControls()
  }

  syncInputs(title, description) {
    titleInputEl.value = title
    descriptionInputEl.value = description
  }

  syncCard(title, description) {  
    titleEl.textContent = title
    descriptionEl.textContent = description
  }

  syncControls() {
    if (this.pointer === this.timeLine.length - 1) {
      nextBtnEl.setAttribute('disabled', 'disabled')
    } else {
      nextBtnEl.removeAttribute('disabled')
    }

    if (this.pointer === 0) {
      backBtnEl.setAttribute('disabled', 'disabled')
    } else {
      backBtnEl.removeAttribute('disabled')
    }
  }
}

const app = new App()
