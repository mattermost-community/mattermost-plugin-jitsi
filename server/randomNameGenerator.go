package main

import (
	"crypto/rand"
	"math/big"
	"strings"

	"github.com/google/uuid"
	"github.com/mattermost/mattermost-server/v5/mlog"
)

var PLURALNOUN = []string{"Aliens", "Animals", "Antelopes", "Ants", "Apes", "Apples", "Baboons",
	"Bacteria", "Badgers", "Bananas", "Bats", "Bears", "Birds", "Bonobos",
	"Brides", "Bugs", "Bulls", "Butterflies", "Cheetahs", "Cherries", "Chicken",
	"Children", "Chimps", "Clowns", "Cows", "Creatures", "Dinosaurs", "Dogs",
	"Dolphins", "Donkeys", "Dragons", "Ducks", "Dwarfs", "Eagles", "Elephants",
	"Elves", "Fathers", "Fish", "Flowers", "Frogs", "Fruit", "Fungi",
	"Galaxies", "Geese", "Goats", "Gorillas", "Hedgehogs", "Hippos", "Horses",
	"Hunters", "Insects", "Kids", "Knights", "Lemons", "Lemurs", "Leopards",
	"LifeForms", "Lions", "Lizards", "Mice", "Monkeys", "Monsters", "Mushrooms",
	"Octopodes", "Oranges", "Orangutans", "Organisms", "Pants", "Parrots",
	"Penguins", "People", "Pigeons", "Pigs", "Pineapples", "Plants", "Potatoes",
	"Priests", "Rats", "Reptiles", "Reptilians", "Rhinos", "Seagulls", "Sheep",
	"Siblings", "Snakes", "Spaghetti", "Spiders", "Squid", "Squirrels",
	"Stars", "Students", "Teachers", "Tigers", "Tomatoes", "Trees", "Vampires",
	"Vegetables", "Viruses", "Vulcans", "Weasels", "Werewolves", "Whales",
	"Witches", "Wizards", "Wolves", "Workers", "Worms", "Zebras"}

var VERB = []string{"Abandon", "Adapt", "Advertise", "Answer", "Anticipate", "Appreciate",
	"Approach", "Argue", "Ask", "Bite", "Blossom", "Blush", "Breathe", "Breed",
	"Bribe", "Burn", "Calculate", "Clean", "Code", "Communicate", "Compute",
	"Confess", "Confiscate", "Conjugate", "Conjure", "Consume", "Contemplate",
	"Crawl", "Dance", "Delegate", "Devour", "Develop", "Differ", "Discuss",
	"Dissolve", "Drink", "Eat", "Elaborate", "Emancipate", "Estimate", "Expire",
	"Extinguish", "Extract", "Facilitate", "Fall", "Feed", "Finish", "Floss",
	"Fly", "Follow", "Fragment", "Freeze", "Gather", "Glow", "Grow", "Hex",
	"Hide", "Hug", "Hurry", "Improve", "Intersect", "Investigate", "Jinx",
	"Joke", "Jubilate", "Kiss", "Laugh", "Manage", "Meet", "Merge", "Move",
	"Object", "Observe", "Offer", "Paint", "Participate", "Party", "Perform",
	"Plan", "Pursue", "Pierce", "Play", "Postpone", "Pray", "Proclaim",
	"Question", "Read", "Reckon", "Rejoice", "Represent", "Resize", "Rhyme",
	"Scream", "Search", "Select", "Share", "Shoot", "Shout", "Signal", "Sing",
	"Skate", "Sleep", "Smile", "Smoke", "Solve", "Spell", "Steer", "Stink",
	"Substitute", "Swim", "Taste", "Teach", "Terminate", "Think", "Type",
	"Unite", "Vanish", "Worship"}

var ADVERB = []string{"Absently", "Accurately", "Accusingly", "Adorably", "AllTheTime", "Alone",
	"Always", "Amazingly", "Angrily", "Anxiously", "Anywhere", "Appallingly",
	"Apparently", "Articulately", "Astonishingly", "Badly", "Barely",
	"Beautifully", "Blindly", "Bravely", "Brightly", "Briskly", "Brutally",
	"Calmly", "Carefully", "Casually", "Cautiously", "Cleverly", "Constantly",
	"Correctly", "Crazily", "Curiously", "Cynically", "Daily", "Dangerously",
	"Deliberately", "Delicately", "Desperately", "Discreetly", "Eagerly",
	"Easily", "Euphoricly", "Evenly", "Everywhere", "Exactly", "Expectantly",
	"Extensively", "Ferociously", "Fiercely", "Finely", "Flatly", "Frequently",
	"Frighteningly", "Gently", "Gloriously", "Grimly", "Guiltily", "Happily",
	"Hard", "Hastily", "Heroically", "High", "Highly", "Hourly", "Humbly",
	"Hysterically", "Immensely", "Impartially", "Impolitely", "Indifferently",
	"Intensely", "Jealously", "Jovially", "Kindly", "Lazily", "Lightly",
	"Loudly", "Lovingly", "Loyally", "Magnificently", "Malevolently", "Merrily",
	"Mightily", "Miserably", "Mysteriously", "NOT", "Nervously", "Nicely",
	"Nowhere", "Objectively", "Obnoxiously", "Obsessively", "Obviously",
	"Often", "Painfully", "Patiently", "Playfully", "Politely", "Poorly",
	"Precisely", "Promptly", "Quickly", "Quietly", "Randomly", "Rapidly",
	"Rarely", "Recklessly", "Regularly", "Remorsefully", "Responsibly",
	"Rudely", "Ruthlessly", "Sadly", "Scornfully", "Seamlessly", "Seldom",
	"Selfishly", "Seriously", "Shakily", "Sharply", "Sideways", "Silently",
	"Sleepily", "Slightly", "Slowly", "Slyly", "Smoothly", "Softly", "Solemnly",
	"Steadily", "Sternly", "Strangely", "Strongly", "Stunningly", "Surely",
	"Tenderly", "Thoughtfully", "Tightly", "Uneasily", "Vanishingly",
	"Violently", "Warmly", "Weakly", "Wearily", "Weekly", "Weirdly", "Well",
	"Well", "Wickedly", "Wildly", "Wisely", "Wonderfully", "Yearly"}

var ADJECTIVE = []string{"Abominable", "Accurate", "Adorable", "All", "Alleged", "Ancient", "Angry",
	"Anxious", "Appalling", "Apparent", "Astonishing", "Attractive", "Awesome",
	"Baby", "Bad", "Beautiful", "Benign", "Big", "Bitter", "Blind", "Blue",
	"Bold", "Brave", "Bright", "Brisk", "Calm", "Camouflaged", "Casual",
	"Cautious", "Choppy", "Chosen", "Clever", "Cold", "Cool", "Crawly",
	"Crazy", "Creepy", "Cruel", "Curious", "Cynical", "Dangerous", "Dark",
	"Delicate", "Desperate", "Difficult", "Discreet", "Disguised", "Dizzy",
	"Dumb", "Eager", "Easy", "Edgy", "Electric", "Elegant", "Emancipated",
	"Enormous", "Euphoric", "Evil", "Fast", "Ferocious", "Fierce", "Fine",
	"Flawed", "Flying", "Foolish", "Foxy", "Freezing", "Funny", "Furious",
	"Gentle", "Glorious", "Golden", "Good", "Green", "Green", "Guilty",
	"Hairy", "Happy", "Hard", "Hasty", "Hazy", "Heroic", "Hostile", "Hot",
	"Humble", "Humongous", "Humorous", "Hysterical", "Idealistic", "Ignorant",
	"Immense", "Impartial", "Impolite", "Indifferent", "Infuriated",
	"Insightful", "Intense", "Interesting", "Intimidated", "Intriguing",
	"Jealous", "Jolly", "Jovial", "Jumpy", "Kind", "Laughing", "Lazy", "Liquid",
	"Lonely", "Longing", "Loud", "Loving", "Loyal", "Macabre", "Mad", "Magical",
	"Magnificent", "Malevolent", "Medieval", "Memorable", "Mere", "Merry",
	"Mighty", "Mischievous", "Miserable", "Modified", "Moody", "Most",
	"Mysterious", "Mystical", "Needy", "Nervous", "Nice", "Objective",
	"Obnoxious", "Obsessive", "Obvious", "Opinionated", "Orange", "Painful",
	"Passionate", "Perfect", "Pink", "Playful", "Poisonous", "Polite", "Poor",
	"Popular", "Powerful", "Precise", "Preserved", "Pretty", "Purple", "Quick",
	"Quiet", "Random", "Rapid", "Rare", "Real", "Reassuring", "Reckless", "Red",
	"Regular", "Remorseful", "Responsible", "Rich", "Rude", "Ruthless", "Sad",
	"Scared", "Scary", "Scornful", "Screaming", "Selfish", "Serious", "Shady",
	"Shaky", "Sharp", "Shiny", "Shy", "Simple", "Sleepy", "Slow", "Sly",
	"Small", "Smart", "Smelly", "Smiling", "Smooth", "Smug", "Sober", "Soft",
	"Solemn", "Square", "Square", "Steady", "Strange", "Strong", "Stunning",
	"Subjective", "Successful", "Surly", "Sweet", "Tactful", "Tense",
	"Thoughtful", "Tight", "Tiny", "Tolerant", "Uneasy", "Unique", "Unseen",
	"Warm", "Weak", "Weird", "WellCooked", "Wild", "Wise", "Witty", "Wonderful",
	"Worried", "Yellow", "Young", "Zealous"}

var LETTERS = []rune("abcdefghijklmnopqrstuvwxyz")

func randomInt(max int) int {
	value, err := rand.Int(rand.Reader, big.NewInt(int64(max)))
	if err != nil {
		mlog.Error("Error generating random number", mlog.Err(err))
		panic(err.Error())
	}
	return int(value.Int64())
}

func randomElement(s []string) string {
	return s[randomInt(len(s))]
}

func randomString(runes []rune, n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = runes[randomInt(len(runes))]
	}
	return string(b)
}

func generateEnglishName(delimiter string) string {
	var components = []string{
		randomElement(ADJECTIVE),
		randomElement(PLURALNOUN),
		randomElement(VERB),
		randomElement(ADVERB),
	}
	return strings.Join(components, delimiter)
}

func generateEnglishTitleName() string {
	return generateEnglishName("")
}

func generateUUIDName() string {
	id := uuid.New()
	return (id.String())
}

func generateTeamChannelName(teamName string, channelName string) string {
	name := teamName
	if name != "" {
		name += "-"
	}
	name += channelName
	name += "-" + randomString(LETTERS, 10)

	return name
}

func generatePersonalMeetingName(username string) string {
	return username + "-" + randomString(LETTERS, 20)
}
