package io.wedeploy.wechat.bot.commands;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author cirocosta
 */
public class SayHelloCommand implements Command {

	public SayHelloCommand() {
	}

	@Override
	public Pattern getPattern() {
		return pattern;
	}

	@Override
	public String respond(Bot bot, Matcher matcher) {
		return "Hello!";
	}

	private static Pattern pattern = Pattern.compile("say hello");

}