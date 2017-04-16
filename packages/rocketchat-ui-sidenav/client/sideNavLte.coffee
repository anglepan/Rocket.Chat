Template.sideNavLte.helpers
	flexTemplate: ->
		return SideNav.getFlex().template

	flexData: ->
		return SideNav.getFlex().data

	footer: ->
		return RocketChat.settings.get 'Layout_Sidenav_Footer'

	showStarredRooms: ->
		favoritesEnabled = RocketChat.settings.get 'Favorite_Rooms'
		hasFavoriteRoomOpened = ChatSubscription.findOne({ f: true, open: true })

		return true if favoritesEnabled and hasFavoriteRoomOpened

	roomType: ->
		return RocketChat.roomTypes.getTypes()

	canShowRoomType: ->
		userPref = Meteor.user()?.settings?.preferences?.mergeChannels
		globalPref = RocketChat.settings.get('UI_Merge_Channels_Groups')
		mergeChannels = if userPref? then userPref else globalPref
		if mergeChannels
			return RocketChat.roomTypes.checkCondition(@) and @template isnt 'privateGroups'
		else
			return RocketChat.roomTypes.checkCondition(@)

	templateName: ->
		userPref = Meteor.user()?.settings?.preferences?.mergeChannels
		globalPref = RocketChat.settings.get('UI_Merge_Channels_Groups')
		mergeChannels = if userPref? then userPref else globalPref
		if mergeChannels
			return if @template is 'channels' then 'combined' else @template
		else
			return @template

	hasUnread: ->
		let unread = false
		if not Meteor.user()?.settings?.preferences?
			unread = true
		else if Meteor.user()?.settings?.preferences?.unreadRoomsMode and Template.instance().unreadRooms.count() > 0
			unread = true
		return unread
		#return true if Meteor.user()?.settings?.preferences?.unreadRoomsMode and Template.instance().unreadRooms.count() > 0

	unreadRms: ->
		return Template.instance().unreadRooms

Template.sideNavLte.events
	'click .close-flex': ->
		SideNav.closeFlex()

	'click .arrow': ->
		SideNav.toggleCurrent()

	'mouseenter .header': ->
		SideNav.overArrow()

	'mouseleave .header': ->
		SideNav.leaveArrow()

	'dropped .side-nav': (e) ->
		e.preventDefault()

Template.sideNavLte.onRendered ->
	SideNav.init()
	menu.init()

	#Make sure the body tag has the .fixed class
	if !$('body').hasClass('fixed')
	  $('body').addClass 'fixed'
	  #Enable slimscroll for fixed layout
	  if $.AdminLTE.options.sidebarSlimScroll
	  	if typeof $.fn.slimScroll == 'undefined' and window.console
  		  window.console.error 'Error: the fixed layout requires the slimscroll plugin!'
	    if typeof $.fn.slimScroll != 'undefined'
	      console.log 'fixSidebar sidenavlte.html do'
	      #Destroy if it exists
	      $('.sidebar').slimScroll(destroy: true).height 'auto'
	      #Add slimscroll
	      $('.sidebar').slimScroll
	        height: $(window).height() - $('.sidebar-header').height() + 'px'
	        color: 'rgba(0,0,0,0.2)'
	        size: '3px'
	      console.log $(window).height()
	      console.log $('.sidebar-header').height()
	      console.log $('.user-panel').height()
	      console.log $('.sidebar-form').height()

Template.sideNavLte.onCreated ->
	@autorun =>
	query =
		alert: true
		open: true

	@unreadRooms = ChatSubscription.find query, { sort: 't': 1, 'name': 1 }
