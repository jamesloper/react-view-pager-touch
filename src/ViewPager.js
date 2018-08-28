import React, { Component } from 'react';
import PanResponder, { SNAP_DURATION } from './util/PanResponder';
import { clamp, easeOutCubic, xform } from './util/util';

const ios = !!navigator.userAgent.match('iOS');

class ViewPager extends Component {
	static defaultProps = {
		items: [],
		currentPage: 0,
		minPage: 0,
		className: '',
		onDragStart: () => null,
	};

	constructor(props) {
		super(props);

		this.scrollTo = this.scrollTo.bind(this);
		this.coastToPage = this.coastToPage.bind(this);
		this.renderPage = this.renderPage.bind(this);
		this.touchStart = this.touchStart.bind(this);
		this.touchMove = this.touchMove.bind(this);
		this.touchEnd = this.touchEnd.bind(this);

		this.state = {width: 0};
		this.travelingToPage = props.currentPage;
		this.pan = new PanResponder();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.currentPage !== this.travelingToPage) {
			this.coastToPage(nextProps.currentPage, false, false);
		}
	}

	componentDidMount() {
		const {items, minPage, currentPage} = this.props;
		const width = this.el.clientWidth;

		this.el.addEventListener('touchstart', this.touchStart);
		this.el.addEventListener('touchmove', this.touchMove);
		this.el.addEventListener('touchend', this.touchEnd);

		this.el.addEventListener('mousedown', this.touchStart);
		document.addEventListener('mousemove', this.touchMove);
		document.addEventListener('mouseup', this.touchEnd);

		this.minX = minPage * width;
		this.maxX = (items.length - 1) * width;
		this.travelingToPage = currentPage;

		this.setState({'width': width}, () => {
			this.scrollTo(currentPage * width);
		});
	}

	componentWillUnmount() {
		document.removeEventListener('mousemove', this.touchMove);
		document.removeEventListener('mouseup', this.touchEnd);
	}

	render() {
		const {id, className, items} = this.props;
		const classes = ['view-pager'];
		if (className) classes.push(className);
		return (
			<div id={id} className={classes.join(' ')} ref={el => this.el = el}>
				<div className="over over-left" ref={el => this.overLeft = el}/>
				<div className="over over-right" ref={el => this.overRight = el}/>
				<div className="view-pager-canvas" ref={el => this.canvas = el}>
					{items.map(this.renderPage)}
				</div>
			</div>
		);
	}

	renderPage(item, index) {
		const {renderItem} = this.props;
		return (
			<div key={index} className="view-pager-view" children={renderItem(item, index)}/>
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
					this.overLeft.classList.remove('ease-x');
				} else if (pos > this.maxX) {
					let scaleFactor = (pos - this.maxX);
					pos = this.maxX;
					this.overRight.style[xform] = `scaleX(${scaleFactor / width})`;
					this.overRight.classList.remove('ease-x');
				}
			}
		}

		this.x = Math.round(pos);
		this.canvas.style[xform] = `translate3d(${-1 * this.x}px,0,0)`;
	}

	touchStart(e) {
		this.startX = this.x;
		this.pan.initialize(e);
		this.moved = false;
	}

	touchMove(e) {
		const {onDragStart} = this.props;

		if (this.pan.touch) {
			const {dx, locked} = this.pan.track(e);
			if (locked === 'h') {
				this.scrollTo(this.startX - dx);
				if (!this.moved) {
					onDragStart();
					this.moved = true;
				}
			}
		}
	}

	touchEnd() {
		if (!this.pan.touch) return;
		const {vx, flick, locked} = this.pan.release();
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
			this.overLeft.classList.add('ease-x');
			this.overLeft.style[xform] = 'scaleX(0)';
			this.overRight.classList.add('ease-x');
			this.overRight.style[xform] = 'scaleX(0)';
		}
	}

	coastToPage(page, useReleaseVelocity, performCallback) {
		const {minPage, onPageSelected, currentPage, items} = this.props;
		const {width} = this.state;

		this.travelingToPage = clamp(page, minPage, items.length - 1);

		const x1 = this.x,
			x2 = this.travelingToPage * width,
			dx = x2 - x1,
			t1 = Date.now();

		let duration = SNAP_DURATION;
		if (useReleaseVelocity) duration = Math.abs(dx / this.pan.sx);

		let t = 0;
		const animate = () => {
			if (this.pan.touch) return;
			t = Date.now() - t1;
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

		animate();
	}
}

export default ViewPager;