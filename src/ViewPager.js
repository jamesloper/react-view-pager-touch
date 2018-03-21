import React, { Component } from 'react';
import pan from './util/PanResponder';
import xform from './util/xform';
import clamp from './util/clamp';
import PropTypes from 'prop-types';

const ios = !!navigator.userAgent.match('iPhone OS');
const width = document.body.clientWidth;
const easeOutCubic = (t) => (--t) * t * t + 1;
const range = (n) => Array.apply(null, {length: n}).map(Number.call, Number);

class ViewPager extends Component {
	static propTypes = {
		currentPage: PropTypes.number.isRequired,
		onPageSelected: PropTypes.func.isRequired,
		itemsPerPage: PropTypes.number,
		items: PropTypes.array.isRequired,
		minPage: PropTypes.number,
		className: PropTypes.string,
		scrollEnabled: PropTypes.bool,
	};

	static defaultProps = {
		currentPage: 0,
		itemsPerPage: 1,
		minPage: 0,
		items: [],
		className: '',
		scrollEnabled: true,
	};

	constructor(props) {
		super(props);
		const {itemsPerPage, items, minPage} = props;

		this.numPages = Math.ceil(items.length / itemsPerPage);

		this.minX = minPage * width;
		this.maxX = this.numPages * width;
		this.x = this.minX;

		this.scrollTo = this.scrollTo.bind(this);
		this.coast = this.coast.bind(this);
		this.touchStart = this.touchStart.bind(this);
		this.touchMove = this.touchMove.bind(this);
		this.touchEnd = this.touchEnd.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.coast(nextProps.currentPage);
	}

	componentDidMount() {
		this.el.addEventListener('touchstart', this.touchStart);
		this.el.addEventListener('touchmove', this.touchMove);
		this.el.addEventListener('touchend', this.touchEnd);
		this.scrollTo(this.x); // sync first render
	}

	render() {
		const {id, className} = this.props;

		return (
			<div
				id={id}
				className={`viewpager ${className}`}
				ref={el => this.el = el}
			>
				<div className="over" id="over-left" ref={el => this.overLeft = el}/>
				<div className="over" id="over-right" ref={el => this.overRight = el}/>
				<div className="viewpager-canvas" ref={el => this.canvas = el}>
					{range(this.numPages).map(this.renderPage.bind(this))}
				</div>
			</div>
		);
	}

	renderPage(index) {
		const {renderItem, items, itemsPerPage} = this.props;

		const startItemIndex = (index * itemsPerPage);
		const itemsToRender = items.slice(startItemIndex, startItemIndex + itemsPerPage);

		return (
			<div key={index} className="viewpager-view">
				{itemsToRender.map((r, i) => renderItem(r, index + i))}
			</div>
		);
	}

	scrollTo(pos) {
		const over = (pos < this.minX || pos > this.maxX);
		if (over) {
			if (ios) {
				if (pos < this.minX) pos -= (pos - this.minX) / 2;
				if (pos > this.maxX) pos -= (pos - this.maxX) / 2;
			} else {
				if (pos < this.minX) {
					let scaleFactor = -(pos - this.minX);
					pos = this.minX;
					this.overLeft.style[xform] = `scaleX(${scaleFactor / width})`;
					this.overLeft.classList.remove('easex');
				} else if (pos > this.maxX) {
					let scaleFactor = (pos - this.maxX);
					pos = this.maxX;
					this.overRight.style[xform] = `scaleX(${scaleFactor / width})`;
					this.overRight.classList.remove('easex');
				}
			}
		}

		this.x = Math.round(pos);
		this.canvas.style[xform] = `translate3d(${-1 * this.x}px,0,0)`;
	}

	touchStart(e) {
		this.startX = this.x;
		this.scrollHoriz = false;
		if (this.props.scrollEnabled) pan.initializeTouch(e);
	}

	touchMove(e) {
		if (!e.cancelable || !this.props.scrollEnabled) return;
		const {dx, absX} = pan.trackMovement(e);
		if (absX > 10) this.scrollHoriz = true;
		if (this.scrollHoriz) {
			e.preventDefault();
			this.scrollTo(this.startX - dx);
		}
	}

	touchEnd() {
		if (!this.scrollHoriz) return;
		const {currentPage, onPageSelected, minPage, items} = this.props;
		const {vx, flick} = pan.getReleaseVelocity();

		// Flick (momentum) or snap (round) according to flick velocity
		let newPage = flick ? currentPage - Math.sign(vx) : Math.round(this.x / width);
		newPage = clamp(newPage, minPage, this.numPages);

		onPageSelected({
			position: newPage,
			previous: currentPage,
			offset: Math.sign(newPage - currentPage),
			item: items[newPage],
		});

		// Clear android overflow
		if (!ios) {
			this.overLeft.classList.add('easex');
			this.overLeft.style[xform] = 'scaleX(0)';
			this.overRight.classList.add('easex');
			this.overRight.style[xform] = 'scaleX(0)';
		}
	}

	coast(page) {
		const x1 = this.x,
			x2 = page * width,
			dx = x2 - x1,
			t1 = Date.now();

		const sx = pan.flick ? pan.sx : .5;
		const duration = Math.abs(dx / sx);

		const animate = () => {
			if (pan.touch) return;
			const t = Date.now() - t1;
			if (t >= duration) {
				this.scrollTo(x2);
			} else {
				const dx2 = dx * easeOutCubic(t / duration);
				this.scrollTo(x1 + dx2, true);
				requestAnimationFrame(animate);
			}
		};

		requestAnimationFrame(animate);
	}
}

export default ViewPager;