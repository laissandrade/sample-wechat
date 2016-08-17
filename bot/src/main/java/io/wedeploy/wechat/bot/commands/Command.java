package io.wedeploy.wechat.bot.commands;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author Ciro Costa
 */
public interface Command {

	/**
	 * Returns the description of the command.
	 */
	default public String getDescription() {
		return "";
	}

	/**
	 * Returns the pattern used for matching the command.
	 */
	public Pattern getPattern();

	/**
	 * Responds to a given message that called the bot command. The matcher
	 * object passed as argument might be null in case the command is
	 * registered as default command.
	 */
	public String respond(Bot bot, Matcher matcher);

}
