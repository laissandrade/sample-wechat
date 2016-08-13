package io.wedeploy.wechat.bot.commands;

import com.wedeploy.api.WeDeploy;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * @author Ciro S. Costa
 */
public class SentimentCommand implements Command {

	Pattern pattern = Pattern.compile("sentiment");

	public SentimentCommand() {
		sentimenterClient = WeDeploy.url("sentimenter");
		dataClient = WeDeploy.url("data");
	}

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
		List<Map> messages = dataClient
			.path("messages")
			.filter("author.name", "!=", "TheBot")
			.get("messages")
			.bodyList(Map.class);

		if (messages.isEmpty())	 {
			return "No texts to analyze bro!";
		}

		List<String> contents = messages
			.stream()
			.map(message -> (String)message.get("content"))
			.collect(Collectors.toList());

		Map texts = new HashMap<>();

		texts.put("texts", contents);

		Map<String, Object> score = sentimenterClient
			.path("analyzeAll")
			.post(texts)
			.bodyValue();

		return getSentimentTextFromScore((Double)score.get("score"));
	}

	private String getSentimentTextFromScore(Double score) {
		String message = null;

		if (score < -1) {
			message = "The chat is super bad :(";
		} else if (score < 0) {
			message = "Kinda bad, huh?";
		} else if (score == 0) {
			message = "Looks like things are neutral here";
		} else if (score > 1) {
			message = "The dudes here are super positive!";
		} else if (score < 1) {
			message = "Kinda positive, cool!";
		}

		return message;
	}

	private WeDeploy sentimenterClient;
	private WeDeploy dataClient;
}