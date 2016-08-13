package io.wedeploy.wechat.bot;

import com.wedeploy.api.WeDeploy;
import com.wedeploy.api.realtime.RealTime;
import com.wedeploy.api.sdk.Context;
import com.wedeploy.api.sdk.Lifecycle;

import java.util.Arrays;
import java.util.List;

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
			.watch()
			.on("changes", res -> {
				System.out.println("Received some messages: ");
				System.out.println(res);
			});
	}

	@Override
	public void stop(Context context) {
		System.out.println("Stopping");

		if (realtime != null) {
			realtime.close();
		}
	}

	private static final String BOT_PREFIX = "bot: ";

	private final String[] COMMANDS = {"say_hi"};

	private List<String> commands;
	private WeDeploy messagesClient;
	private RealTime realtime;

}