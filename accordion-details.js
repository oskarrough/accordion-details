// Wrap this around one or more <details> to add
// 1. smooth animations
// 2. allow only a single details to be open at a time. Can be disabled with <accordion-details allow-multiple>

class AccordionDetails extends HTMLElement {
	connectedCallback() {
		this.details = this.querySelectorAll('details')
		if (!this.details.length) return

		for (const el of this.details) {
			this.setDetailsHeight(el)

			if (!this.hasAttribute('allow-multiple')) {
				el.querySelector('summary').addEventListener('click', this.closeOpenDetails.bind(this))
			}
		}
	}

	closeOpenDetails(event) {
		event.preventDefault()
		const details = event.target.closest('details')
		const currentStateWasOpen = details.hasAttribute('open')

		const openOnes = this.querySelectorAll('details[open]')
		for (let detail of openOnes) {
			detail.removeAttribute('open')
		}

		details.toggleAttribute('open', !currentStateWasOpen)
	}

	// Sets two CSS variables on the <detail> with the collapsed and expanded (open) height.
	// We use these to animate the height as you toggle it.
	// The resize obsever makes sure the variables are updated as the window resizes.
	setDetailsHeight(detail, wrapper = document) {
		const setHeight = (detail, open = false) => {
			detail.open = open
			const rect = detail.getBoundingClientRect()
			detail.dataset.width = rect.width
			detail.style.setProperty(open ? `--expanded` : `--collapsed`, `${rect.height}px`)
		}
		const resize = new ResizeObserver((entries) => {
			return entries.forEach((entry) => {
				const detail = entry.target
				const wasOpen = detail.hasAttribute('open')
				const width = parseInt(detail.dataset.width, 10)
				if (width !== entry.contentRect.width) {
					detail.removeAttribute('style')
					setHeight(detail)
					setHeight(detail, true)
					detail.open = wasOpen
				}
			})
		})
		resize.observe(detail)
	}
}

customElements.define('accordion-details', AccordionDetails)
