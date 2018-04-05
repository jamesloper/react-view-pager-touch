import React, { Component } from 'react';
import pan, { SNAP_DURATION } from './util/PanResponder';
import { clamp, xform, range, easeOutCubic } from './util/util';

const ios = !!navigator.userAgent.match('iPhone OS');

class ViewPager extends Component {
	static defaultProps = {
		items: [],
		currentPage: 0,
		minPage: 0,
		className: '',
	};

	constructor(props) {
		super(props);

		this.scrollTo = this.scrollTo.bind(this);
		this.coastToPage = this.coastToPage.bind(this);
		this.renderPage = this.renderPage.bind(this);
		this.touchStart = this.touchStart.bind(this);
		this.touchMove = this.touchMove.bind(this);
		this.touchEnd = this.touchEnd.bind(this);
		this.domReady = this.domReady.bind(this);

		this.state = {width: 0};
		this.travelingToPage = props.currentPage;
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.currentPage !== this.travelingToPage) {
			this.coastToPage(nextProps.currentPage, false, false);
		}
	}

	componentDidMount() {
		this.el.addEventListener('touchstart', this.touchStart);
		this.el.addEventListener('touchmove', this.touchMove);
		this.el.addEventListener('touchend', this.touchEnd);
	}

	render() {
		const {id, className, items} = this.props;

		return (
			<div id={id} className={`viewpager ${className}`} ref={this.domReady}>
				<div className="over" id="over-left" ref={el => this.overLeft = el}/>
				<div className="over" id="over-right" ref={el => this.overRight = el}/>
				<div className="viewpager-canvas" ref={el => this.canvas = el}>
					{range(items.length).map(this.renderPage)}
				</div>
			</div>
		);
	}

	domReady(el) {
		if (!el) return;

		const {items, minPage, currentPage} = this.props;
		const width = el.clientWidth;

		this.el = el;
		this.minX = minPage * width;
		this.maxX = items.length * width;
		this.travelingToPage = currentPage;

		this.setState({'width': width}, () => {
			this.scrollTo(currentPage * width);
		});
	}

	renderPage(index) {
		const {renderItem, items} = this.props;

		return (
			<div key={index} className="viewpager-view">
				{renderItem(items[index], index)}
			</div>
		);
	}

	scrollTo(pos) {
		const {width} = this.state;
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
		pan.initialize(e);
	}

	touchMove(e) {
		const {dx, locked} = pan.track(e);
		if (locked === 'h') this.scrollTo(this.startX - dx);
	}

	touchEnd() {
		const {vx, flick, locked} = pan.release();
		const {width} = this.state;

		if (locked !== 'h') return;

		if (flick) {
			let newPage = this.travelingToPage - Math.sign(vx);
			this.coastToPage(newPage, true, true);
		} else {
			let newPage = Math.round(this.x / width);
			this.coastToPage(newPage, false, true);
		}

		// Clear android overflow
		if (!ios) {
			this.overLeft.classList.add('easex');
			this.overLeft.style[xform] = 'scaleX(0)';
			this.overRight.classList.add('easex');
			this.overRight.style[xform] = 'scaleX(0)';
		}
	}

	coastToPage(page, useReleaseVelocity, performCallback) {
		const {minPage, onPageSelected, currentPage, items} = this.props;
		const {width} = this.state;

		this.travelingToPage = clamp(page, minPage, items.length);

		const x1 = this.x,
			x2 = this.travelingToPage * width,
			dx = x2 - x1,
			t1 = Date.now();

		let duration = SNAP_DURATION;
		if (useReleaseVelocity) duration = Math.abs(dx / pan.sx);

		const animate = () => {
			if (pan.touch) return;
			const t = Date.now() - t1;
			if (t >= duration) {
				this.scrollTo(x2);

				// callback if initiated by user gesture
				if (performCallback) onPageSelected({
					position: this.travelingToPage,
					previous: currentPage,
					offset: Math.sign(this.travelingToPage - currentPage),
					item: items[this.travelingToPage],
				});
			} else {
				const dx2 = dx * easeOutCubic(t / duration);
				this.scrollTo(x1 + dx2);
				requestAnimationFrame(animate);
			}
		};

		requestAnimationFrame(animate);
	}
}

export default ViewPager;