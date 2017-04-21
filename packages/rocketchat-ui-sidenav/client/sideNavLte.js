 /* globals menu*/

Template.sideNavLte.helpers({
	flexTemplate() {
		return SideNav.getFlex().template;
	},

	flexData() {
		return SideNav.getFlex().data;
	},

	footer() {
		return RocketChat.settings.get('Layout_Sidenav_Footer');
	},

	showStarredRooms() {
		const favoritesEnabled = RocketChat.settings.get('Favorite_Rooms');
		const hasFavoriteRoomOpened = ChatSubscription.findOne({ f: true, open: true });

		if (favoritesEnabled && hasFavoriteRoomOpened) { return true; }
	},

	roomType() {
		return RocketChat.roomTypes.getTypes();
	},

	canShowRoomType() {
		let userPref = undefined;
		if (Meteor.user() && Meteor.user().settings && Meteor.user().settings.preferences) {
			userPref = Meteor.user().settings.preferences.mergeChannels;
		}
		const globalPref = RocketChat.settings.get('UI_Merge_Channels_Groups');
		const mergeChannels = (userPref != null) ? userPref : globalPref;
		if (mergeChannels) {
			return RocketChat.roomTypes.checkCondition(this) && (this.template !== 'privateGroups');
		} else {
			return RocketChat.roomTypes.checkCondition(this);
		}
	},

	templateName() {
		let userPref = undefined;
		if (Meteor.user() && Meteor.user().settings && Meteor.user().settings.preferences) {
			userPref = Meteor.user().settings.preferences.mergeChannels;
		}
		const globalPref = RocketChat.settings.get('UI_Merge_Channels_Groups');
		const mergeChannels = (userPref != null) ? userPref : globalPref;
		if (mergeChannels) {
			return this.template === 'channels' ? 'combined' : this.template;
		} else {
			return this.template;
		}
	},

	hasUnread() {
		let unread = false;		
		if(Template.instance().unreadRooms.count() > 0){
			unread = true;
		}
		return unread;		
	},

	unreadRms() {
		return Template.instance().unreadRooms;
	}
});

Template.sideNavLte.events({
	'click .close-flex'() {
		return SideNav.closeFlex();
	},

	'click .arrow'() {
		return SideNav.toggleCurrent();
	},

	'mouseenter .header'() {
		return SideNav.overArrow();
	},

	'mouseleave .header'() {
		return SideNav.leaveArrow();
	},

	//'scroll .rooms-list'() {
	//	return menu.updateUnreadBars();
	//},

	'dropped .side-nav'(e) {
		return e.preventDefault();
	}
});

Template.sideNavLte.onRendered(function() {
	SideNav.init();
	menu.init();
	
	//return Meteor.defer(() => menu.updateUnreadBars());
});

Template.sideNavLte.onCreated(function() {
	return this.autorun(() => {
			const query = {
			alert: true,
			open: true
		}
	
		this.unreadRooms = ChatSubscription.find (query, { sort: {'t': 1, 'name': 1 }});
	});
})
