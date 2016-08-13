package io.wedeploy.wechat.bot;

import com.wedeploy.api.WeDeploy;
import com.wedeploy.api.realtime.RealTime;
import com.wedeploy.api.sdk.ContentType;
import com.wedeploy.api.sdk.Context;
import com.wedeploy.api.sdk.Lifecycle;
import com.wedeploy.api.serializer.Parser;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * @author cirocosta
 */
public class ChatListenerRuntime implements Lifecycle {

	public void searchForCommands(String message) {
		int botPrefixIndex = message.indexOf(BOT_PREFIX);

		if (botPrefixIndex == -1) {
			return;
		}

		String command = message.substring(botPrefixIndex, message.length());

		if (commands.contains(command)) {
			System.out.println("Command found: " + command);
		}
	}

	@Override
	public void start(Context context) {
		messagesClient = WeDeploy
			.url("data")
			.path("messages");
		commands = Arrays.asList(COMMANDS);

		realtime = messagesClient
			.limit(1)
			.sort("id", "desc")
			.watch()
			.on("changes", res -> {
				List<Map> messages = Parser
					.get()
					.parse(res[0].toString());

				messages.forEach(message -> {
					try {
						messagesClient
							.contentType(ContentType.JSON)
							.post(
								createBotMessage("Hello Fellas")
								.toString());

						System.out.println(createBotMessage("Hello Fellas"));

					} catch (JSONException e) {
						e.printStackTrace();
					}
				});
			});
	}

	@Override
	public void stop(Context context) {
		System.out.println("Stopping");

		if (realtime != null) {
			realtime.close();
		}
	}

	private JSONObject createBotMessage(String content) throws JSONException {
		JSONObject author = new JSONObject()
			.put("id", "TheBot")
			.put("name", "TheBot")
			.put("color", "color-1");

		JSONObject object = new JSONObject()
			.put("content", content)
			.put("time", "whatever")
			.put("author", author);

		return object;
	}

	private static final String BOT_PREFIX = "bot: ";

	private final String[] COMMANDS = {"say_hi"};

	private List<String> commands;
	private WeDeploy messagesClient;
	private RealTime realtime;

}