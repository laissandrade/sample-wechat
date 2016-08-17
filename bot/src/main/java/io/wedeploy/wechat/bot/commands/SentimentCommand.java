package io.wedeploy.wechat.bot.commands;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author cirocosta
 */
public class SentimentCommand implements Command {

	Pattern pattern = Pattern.compile("sentiment(?: (?<name>.*))");

	@Override
	public String getDescription() {
		return "Analyzes the sentiment of the chat";
	}

	@Override
	public Pattern getPattern() {
		return pattern;
	}

	@Override
	public String respond(Bot bot, Matcher matcher) {
		String name = matcher.group("name");

		if (name != null)	{
			return analyzeName(name);
		}

		return analyzeEntireChat();
	}

	private String analyzeName (String name) {
		return "just-the-name";
	}

	private String analyzeEntireChat () {
		return "entire";
	}
}
