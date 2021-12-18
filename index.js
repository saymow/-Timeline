import { Timeline } from './timeline.js'

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

const timeline = new Timeline(
  initialData,
  formEl,
  titleInputEl,
  descriptionInputEl,
  titleEl,
  descriptionEl,
  nextBtnEl,
  backBtnEl,
)
