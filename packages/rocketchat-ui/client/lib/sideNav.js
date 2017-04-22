this.SideNav = new class {
	constructor() {
		this.initiated = false;
		this.sideNav = {};
		this.flexNav = {};
		this.arrow = {};
		this.animating = false;
		this.openQueue = [];
	}

	toggleArrow(status = null) {
		if (status === 0) {
			this.arrow.addClass('close');
			this.arrow.removeClass('top');
			return this.arrow.removeClass('bottom');
		} else if (status === -1 || (status !== 1 && this.arrow.hasClass('top'))) {
			this.arrow.removeClass('close');
			this.arrow.removeClass('top');
			return this.arrow.addClass('bottom');
		} else {
			this.arrow.removeClass('close');
			this.arrow.addClass('top');
			return this.arrow.removeClass('bottom');
		}
	}
	toggleFlex(status, callback) {
		if (this.animating === true) {
			return;
		}
		this.animating = true;
		if (status === -1 || (status !== 1 && this.flexNav.opened)) {
			this.flexNav.opened = false;
			this.flexNav.addClass('animated-hidden');
		} else {
			this.flexNav.opened = true;
			setTimeout(() => {
				return this.flexNav.removeClass('animated-hidden');
			}, 50);
		}
		return setTimeout(() => {
			this.animating = false;
			return typeof callback === 'function' && callback();
		}, 500);
	}
	closeFlex(callback = null) {
		let subscription;
		if (!RocketChat.roomTypes.getTypes().filter(function(i) {
			return i.route;
		}).map(function(i) {
			return i.route.name;
		}).includes(FlowRouter.current().route.name)) {
			subscription = RocketChat.models.Subscriptions.findOne({
				rid: Session.get('openedRoom')
			});
			if (subscription != null) {
				RocketChat.roomTypes.openRouteLink(subscription.t, subscription, FlowRouter.current().queryParams);
			} else {
				FlowRouter.go('home');
			}
		}
		if (this.animating === true) {
			return;
		}
		this.toggleArrow(-1);
		return this.toggleFlex(-1, callback);
	}
	flexStatus() {
		return this.flexNav.opened;
	}
	setFlex(template, data) {
		if (data == null) {
			data = {};
		}
		Session.set('flex-nav-template', template);
		return Session.set('flex-nav-data', data);
	}
	getFlex() {
		return {
			template: Session.get('flex-nav-template'),
			data: Session.get('flex-nav-data')
		};
	}

	toggleCurrent() {
		if (this.flexNav && this.flexNav.opened) {
			return this.closeFlex();
		} else {
			return AccountBox.toggle();
		}
	}
	overArrow() {
		return this.arrow.addClass('hover');
	}
	leaveArrow() {
		return this.arrow.removeClass('hover');
	}
	arrowBindHover() {
		this.arrow.on('mouseenter', () => {
			return this.sideNav.find('header').addClass('hover');
		});
		return this.arrow.on('mouseout', () => {
			return this.sideNav.find('header').removeClass('hover');
		});
	}
	focusInput() {
		const sideNavDivs = _.filter(document.querySelectorAll('aside.side-nav')[0].children, function(ele) {
			return ele.tagName === 'DIV' && !ele.classList.contains('hidden');
		});
		let highestZidx = 0;
		let highestZidxElem;
		_.each(sideNavDivs, (ele) => {
			const zIndex = Number(window.getComputedStyle(ele).zIndex);
			if (Number(zIndex) > highestZidx) {
				highestZidx = Number(zIndex);
				highestZidxElem = ele;
			}
		});
		setTimeout(() => {
			const ref = highestZidxElem.querySelector('input');
			return ref && ref.focus();
		}, 200);
	}
	validate() {
		const invalid = [];
		this.sideNav.find('input.required').each(function() {
			if (!this.value.length) {
				return invalid.push($(this).prev('label').html());
			}
		});
		if (invalid.length) {
			return invalid;
		}
		return false;
	}

	openFlex(callback) {
		if (!this.initiated) {
			return this.openQueue.push({
				config: this.getFlex(),
				callback
			});
		}
		if (this.animating === true) {
			return;
		}
		AccountBox.close();
		this.toggleArrow(0);
		this.toggleFlex(1, callback);
		//return this.focusInput();
		//angle 20170422
	}

	init() {
		this.sideNav = $('.side-nav');
		this.flexNav = this.sideNav.find('.flex-nav');
		this.arrow = this.sideNav.children('.arrow');
		this.setFlex('');
		this.arrowBindHover();
		this.initiated = true;
		if (this.openQueue.length > 0) {
			this.openQueue.forEach((item) => {
				this.setFlex(item.config.template, item.config.data);
				return this.openFlex(item.callback);
			});
			return this.openQueue = [];
		}
	}
	getSideNav() {
		return this.sideNav;
	}
};
