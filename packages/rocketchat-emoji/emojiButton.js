/* globals Template */
Template.messageBox.events({
	'click .emoji-picker-icon'(event, instance) {
		event.stopPropagation();
		if (RocketChat.EmojiPicker.isOpened()) {
			RocketChat.EmojiPicker.close();
		} else {
			RocketChat.EmojiPicker.open(event.currentTarget, (emoji) => {
				const input = $(event.currentTarget).parent().parent().find('.input-message');

				const emojiValue = ':' + emoji + ':';

				var caretPos = input.prop('selectionStart');
				var textAreaTxt = input.val();

				input.val(textAreaTxt.substring(0, caretPos) + emojiValue + textAreaTxt.substring(caretPos));

				input.focus();

				input.prop('selectionStart', caretPos + emojiValue.length);
				input.prop('selectionEnd', caretPos + emojiValue.length);

				instance.isMessageFieldEmpty.set(false)
			});
		}
	}
});

Template.messageBox.onCreated(function() {
	RocketChat.EmojiPicker.init();
});
