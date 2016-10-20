package io.wedeploy.wechat.bot.handlers;

import com.wedeploy.api.WeDeploy;
import com.wedeploy.api.sdk.Request;
import com.wedeploy.api.sdk.Response;
import io.wedeploy.wechat.bot.ChatListenerRuntime;
import io.wedeploy.wechat.bot.commands.Bot;
import io.wedeploy.wechat.bot.commands.RemoteCommand;

/**
 * @author cirocosta
 */
public class CommandHandler {

	public CommandHandler(ChatListenerRuntime runtime) {
		this.bot = runtime.getBot();
	}

	public void handle(Request request) {
		RemoteCommand command = request.values(RemoteCommand.class);

		Response commandResponse = WeDeploy
			.url("data")
			.path("commands")
			.post(command);

		if (commandResponse.succeeded()) {
			bot.registerCommand(command);
		}

		commandResponse.pipe(request.response());
	}

	private Bot bot;

}