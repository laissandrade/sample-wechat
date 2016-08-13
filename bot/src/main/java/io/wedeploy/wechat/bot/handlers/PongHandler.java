package io.wedeploy.wechat.bot.handlers;

import com.wedeploy.api.sdk.Response;

/**
 * @author cirocosta
 */
public class PongHandler {

	public void handle(Response response) {
		response.end("PONG");
	}

}