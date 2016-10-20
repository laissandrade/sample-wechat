package io.wedeploy.wechat.bot;

import com.wedeploy.api.WeDeploy;
import com.wedeploy.api.realtime.RealTime;
import com.wedeploy.api.sdk.Context;
import com.wedeploy.api.sdk.Lifecycle;
import com.wedeploy.api.serializer.Parser;

import io.wedeploy.wechat.bot.commands.Bot;
import io.wedeploy.wechat.bot.commands.HelpCommand;
import io.wedeploy.wechat.bot.commands.RemoteCommand;
import io.wedeploy.wechat.bot.commands.SayHelloCommand;
import io.wedeploy.wechat.bot.commands.SentimentCommand;

import java.util.List;
import java.util.Map;

import org.json.JSONObject;

/**
 * @author Ciro S. Costa
 */
public class ChatListenerRuntime implements Lifecycle {

	@Override
	public void start(Context context) {
		messagesClient = WeDeploy
			.url("data")
			.path("messages");

		bot = new Bot()
			.registerDefaultCommand(new HelpCommand())
			.registerCommand(new SayHelloCommand())
			.registerCommand(new SentimentCommand())
			.registerCommand(new HelpCommand());

		WeDeploy
			.url("data")
			.path("/commands")
			.param("limit", 1000)
			.get()
			.bodyList(RemoteCommand.class)
			.forEach(bot::registerCommand);

		messageRealtime = messagesClient
			.limit(1)
			.sort("id", "desc")
			.watch()
			.on("changes", res -> {
				List<Map> messages = Parser
					.get()
					.parse(res[0].toString());

				messages.forEach(this::onNewMessage);
			});
	}

	@Override
	public void stop(Context context) {
		if (messageRealtime != null) {
			messageRealtime.close();
		}
	}

	private void onNewMessage(Map message) {
		Map<String, Object> author = (Map<String, Object>)message.get("author");

		if (author.get("id").equals("TheBot")) {
			return;
		}

		JSONObject botMessage = bot.processMessage(
			(String)message.get("content"));

		if (botMessage != null) {
			messagesClient.post(botMessage.toString());
		}
	}

	public Bot getBot() {
		return bot;
	}

	private Bot bot;
	private WeDeploy messagesClient;
	private RealTime messageRealtime;

}