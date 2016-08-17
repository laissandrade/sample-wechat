package io.wedeploy.wechat.bot.commands;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * @author Ciro Costa
 */
public class Bot {

	public Bot() {
		commands = new ArrayList<>();
	}

	public List<Command> getCommands() {
		return commands;
	}

	public JSONObject processMessage(String message) {
		final String command = getCommandFromMessage(message);

		if (command == null) {
			return null;
		}

		for (Command cmd : commands) {
			Matcher matcher = cmd.getPattern().matcher(command);

			if (matcher.matches()) {
				String response = cmd.respond(this, matcher);

				return createBotMessage(response);
			}
		}

		return createBotMessage(defaultCommand.respond(this, null));
	}

	public Bot registerCommand(Command command) {
		commands.add(command);
		return this;
	}

	public Bot registerDefaultCommand(Command command) {
		defaultCommand = command;
		return this;
	}

	private JSONObject createBotMessage(String content) {
		JSONObject author;
		JSONObject message;

		try {
			author = new JSONObject()
				.put("id", "TheBot")
				.put("name", "TheBot")
				.put("color", "color-1");

			message = new JSONObject()
				.put("content", content)
				.put("time", "whatever")
				.put("author", author);

		} catch (JSONException e) {
			throw new RuntimeException(e);
		}

		return message;
	}

	private String getCommandFromMessage(String message) {
		int botPrefixIndex = message.indexOf(BOT_PREFIX);

		if (botPrefixIndex == -1) {
			return null;
		}

		return message.substring(BOT_PREFIX.length(), message.length());
	}

	private static final String BOT_PREFIX = "TheBot: ";

	private List<Command> commands;
	private Command defaultCommand;

}