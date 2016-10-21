package io.wedeploy.wechat.bot.commands;

import com.wedeploy.api.WeDeploy;
import com.wedeploy.api.serializer.Serialize;
import sun.security.provider.MD5;

import java.util.Base64;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author cirocosta
 */
@Serialize(strict = true)
public class RemoteCommand implements Command {

	@Override
	public String getDescription() {
		return "Remote call to " + webhook;
	}

	@Override
	public Pattern getPattern() {
		return pattern;
	}

	@Override
	public String respond(Bot bot, Matcher matcher) {
		return WeDeploy.url(webhook).get().body();
	}

	@Serialize
	public String getCommand() {
		return pattern.pattern();
	}

	public void setCommand(String command) {
		this.pattern = Pattern.compile(command);
	}

	@Serialize
	public String getWebhook() {
		return webhook;
	}

	public void setWebhook(String webhook) {
		this.webhook = webhook;
	}

	@Serialize
	public String getId() {
		return String.valueOf(getCommand().hashCode());
	}

	public void setId(String id) {
	}

	private Pattern pattern;
	private String webhook;

}