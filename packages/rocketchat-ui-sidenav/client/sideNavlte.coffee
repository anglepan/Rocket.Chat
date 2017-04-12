Template.sideNavlte.helpers
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

Template.sideNavlte.events
	'click .close-flex': ->
		SideNav.closeFlex()

	'click .arrow': ->
		SideNav.toggleCurrent()

	'mouseenter .header': ->
		SideNav.overArrow()

	'mouseleave .header': ->
		SideNav.leaveArrow()

	'scroll .rooms-list': ->
		menu.updateUnreadBars()

	'dropped .side-nav': (e) ->
		e.preventDefault()

Template.sideNavlte.onRendered ->
	SideNav.init()
	menu.init()

	#Make sure the body tag has the .fixed class
	if !$('body').hasClass('fixed')
	  $('body').addClass 'fixed'
	  #Enable slimscroll for fixed layout
	  if $.AdminLTE.options.sidebarSlimScroll
	    if typeof $.fn.slimScroll != 'undefined'
	      console.log 'fixSidebar2 do'
	      #Destroy if it exists
	      $('.sidebar').slimScroll(destroy: true).height 'auto'
	      #Add slimscroll
	      $('.sidebar').slimScroll
	        height: $(window).height() - $('.sidebar-header').height() + 'px'
	        color: 'rgba(0,0,0,0.2)'
	        size: '3px'
  
	Meteor.defer ->
		menu.updateUnreadBars()
