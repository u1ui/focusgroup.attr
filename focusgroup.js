/* Copyright (c) 2016 Tobias Buschor https://goo.gl/gl0mbf | MIT License https://goo.gl/HgajeK */

document.addEventListener('keydown', e => {
	if (e.defaultPrevented) return;

	const isVertical = (e.code === 'ArrowUp' || e.code === 'ArrowDown');
	const isHorizontal = (e.code === 'ArrowLeft' || e.code === 'ArrowRight');
	if (!isVertical && !isHorizontal) return;

	let target = e.target;
	let parent = target.closest('[u1-focusgroup]');

	if (!parent) { // inside shadow dom
		target = e.originalTarget;
		parent = target.closest('[u1-focusgroup]');
	}
	// todo: handle slotted elements
	if (!parent) return;

	if (isHorizontal) {
		if (target.tagName === 'INPUT' && (target.type !== 'checkbox' && target.type !== 'radio')) return;
		if (target.tagName === 'TEXTAREA') return;
	}
	if (isVertical) {
		if (target.tagName === 'SELECT') return;
		if (target.tagName === 'TEXTAREA') return;
	}

	const tmp = parent.getAttribute('u1-focusgroup').split(' ');
	const options = Object.fromEntries(tmp.map(o => [o, true]));
	if (!options.horizontal && !options.vertical) {
		options.horizontal = true;
		options.vertical = true;
	}

	if (!options.horizontal && isHorizontal) return;
	if (!options.vertical && isVertical) return;

	let direction = false;
	if (e.code === 'ArrowLeft' || e.code === 'ArrowUp') direction = 'prev';
	if (e.code === 'ArrowRight' || e.code === 'ArrowDown') direction = 'next';
	if (!direction) return;

	//const focusable = [...parent.querySelectorAll(':is(a[href], button, input, select, textarea, [contenteditable], [tabindex]:not([tabindex="-1"]))')];
	const focusable = [...parent.querySelectorAll(':is(a[href], button, input, select, textarea, [contenteditable], [tabindex])')];
	if (focusable.length < 2) return;

	const index = focusable.indexOf(target);
	// in the spec all other focusables will get tabindex=-1, should we do the same? https://open-ui.org/components/focusgroup.explainer/

	if (index === -1) {
		console.warn('focusgroup: got a keyup event, but the target is not focusable!');
		return;
	}

	let next;
	if (direction === 'prev') {
		next = focusable[index - 1];
		if (!next && options.wrap) next = focusable.at(-1);
	}
	if (direction === 'next') {
		next = focusable[index + 1];
		if (!next && options.wrap) next = focusable[0];
	}

	if (!next) return;

	next.focus();
	e.preventDefault();
});
