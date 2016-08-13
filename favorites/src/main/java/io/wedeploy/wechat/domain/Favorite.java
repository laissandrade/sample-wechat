package io.wedeploy.wechat.domain;

public class Favorite {

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getMessageId() {
		return messageId;
	}

	public void setMessageId(String messageId) {
		this.messageId = messageId;
	}

	public String getId() {
		return userId + "#" + messageId;
	}

	private String userId;
	private String messageId;

}
