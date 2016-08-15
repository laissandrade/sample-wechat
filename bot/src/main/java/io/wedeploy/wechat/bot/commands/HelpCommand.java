package io.wedeploy.wechat.bot.commands;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author cirocosta
 */
public class HelpCommand implements Command {

	@Override
	public String getDescription() {
		return "Display currently available commands.";
	}

	@Override
	public Pattern getPattern() {
		return pattern;
	}

	@Override
	public Matcher match(String message) {
		return pattern.matcher(message);
	}

	@Override
	public String respond(Bot bot, Matcher matcher) {
		StringBuilder sb = new StringBuilder();

		sb.append("Available Commands:\n");

		bot
			.getCommands()
			.forEach(cmd -> {
				sb.append("- " + cmd.getPattern().toString());

				if (!cmd.getDescription().isEmpty()) {
					sb.append("(" + cmd.getDescription() + ")");
				}

				sb.append("\n");
			});

		return sb.toString();
	}

	private static Pattern pattern = Pattern.compile("help");

}