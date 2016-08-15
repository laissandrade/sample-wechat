package io.wedeploy.wechat.bot;

import com.wedeploy.api.WeDeploy;
import com.wedeploy.api.realtime.RealTime;
import com.wedeploy.api.sdk.Context;
import com.wedeploy.api.sdk.Lifecycle;
import com.wedeploy.api.serializer.Parser;
import io.wedeploy.wechat.bot.commands.Bot;
import io.wedeploy.wechat.bot.commands.HelpCommand;
import io.wedeploy.wechat.bot.commands.SayHelloCommand;
import org.json.JSONObject;

import java.util.List;
import java.util.Map;

/**
 * @author cirocosta
 */
public class ChatListenerRuntime implements Lifecycle {

	@Override
	public void start(Context context) {
		messagesClient = WeDeploy
			.url("data")
			.path("messages");

		bot = new Bot()
			.registerCommand(new SayHelloCommand())
			.registerCommand(new HelpCommand());

		realtime = messagesClient
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
		if (realtime != null) {
			realtime.close();
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
			messagesClient .post(botMessage.toString());
		}
	}

	private Bot bot;
	private WeDeploy messagesClient;
	private RealTime realtime;

}
