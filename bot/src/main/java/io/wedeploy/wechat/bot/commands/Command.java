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
	 * Checks whether the command was called.
	 */
	public Matcher match(String message);

	/**
	 * Responds to a given message that called the bot command.
	 */
	public String respond(Bot bot, Matcher matcher);

}