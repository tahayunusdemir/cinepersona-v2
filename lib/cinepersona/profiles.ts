import type { TypeProfile } from "./types";

// English adaptations of docs/MBTI/cinepersona-type-profiles.md.
// One entry per type code; each profile has 8 sections, ~4–5 strengths and
// ~4 weaknesses, plus 5 directors / 5 films / 3 genres.

export const profiles: TypeProfile[] = [
  // ──────────────────────────────────────────────────────────────────────
  // AUTEURS
  // ──────────────────────────────────────────────────────────────────────
  {
    code: "ESAC",
    sections: [
      {
        slug: "overview",
        title: "Introduction",
        body:
          "The Interpreter both lives a film and decodes it. They bond with characters in earnest — the kind of viewer who stays loyal to a lead for days, even mourns one. At the same time they track every scene's subtext, motifs and the director's intent; they judge the craft consciously; they plan their viewing.\n\nThe combination is rare because it looks contradictory: surrender and analytical distance at once. For ESAC it isn't a contradiction but a cycle. The first watch is emotional; the second is analytical. Their relationship with a film is a process, not a moment.\n\nThe most emotional member of the Auteurs, and the most systematic of the Devoted strategists. They take cinema seriously, but they do it with affection.",
      },
      {
        slug: "watching-style",
        title: "How They Watch",
        body:
          "At night, phone off, ideally while the rest of the house sleeps. Big screen, decent sound. They don't watch with a laptop open, but a notebook within reach is fine. Solo by default; a watch with the right person adds a layer — the post-film conversation.\n\nThey often watch a film twice: first viewing emotional, second analytical. Some films get reopened years later.",
      },
      {
        slug: "discovery",
        title: "How They Discover",
        body:
          "Curatorial — chosen by plan, not by mood. Letterboxd critics and lists they trust, director filmographies they want to finish, festival lineups (Cannes, Berlinale, Sundance), specific movements or eras (New Hollywood, Hong Kong New Wave), themes from the books and podcasts they're already in.\n\nA new film comes to them through research, not chance.",
      },
      {
        slug: "conversation",
        title: "After the Credits",
        body:
          "They want to talk. To one trusted person, in detail: what they felt, what they noticed. Then they read reviews — but only after forming their own verdict. Disagreeing with the consensus doesn't bother them; it's interesting.\n\nSometimes they write to themselves — a Letterboxd review, a private journal entry. It's a kind of closing of accounts; the film has to be \"closed\" before they can move to the next.",
      },
      {
        slug: "recommendations",
        title: "What They'd Love",
        body:
          "Directors who reward both feeling and rereading: Andrei Tarkovsky, Krzysztof Kieślowski, Wong Kar-wai, Lynne Ramsay, Yorgos Lanthimos. Films like Stalker, Three Colors: Blue, In the Mood for Love, We Need to Talk About Kevin, The Banshees of Inisherin. Genres: slow cinema, psychological drama, allegorical sci-fi, art cinema.",
      },
      {
        slug: "conclusion",
        title: "Conclusion",
        body:
          "The Interpreter is a rare viewer: the one who feels and decodes, surrenders and judges. It makes them a wonderful audience and a tired one. Their relationship to cinema shouldn't always feel like work; loosening up, watching whatever's on, going in with no preparation — those things feed them too.",
      },
    ],
    traits: [
      { kind: "strength", label: "Deep Empathy", description: "Steps into the character's place and reads motivation from the inside. Even the most layered scripts become legible." },
      { kind: "strength", label: "Symbol Hunter", description: "Recurring images, musical motifs and colour palettes show up to them naturally — and they expect that to happen on the second watch." },
      { kind: "strength", label: "Disciplined Discovery", description: "Finishes director filmographies in order. Enters genres chronologically. Has lists and respects them." },
      { kind: "strength", label: "Talks It Out", description: "Wants a conversation after — an analysis, a reaction, a comparison. Even watching alone, they message someone on the way out." },
      { kind: "strength", label: "Strong But Generous", description: "Has clear opinions and shares them without belittling others. Knows the difference between \"I loved it\" and \"it was good\"." },
      { kind: "weakness", label: "Over-Prepared", description: "Reads so much before pressing play that the freshness of a first watch can be lost." },
      { kind: "weakness", label: "Low Tolerance for Failed Auteurs", description: "Won't forgive a weak film by a director they admire, while being more generous to weak genre films." },
      { kind: "weakness", label: "Emotional Burnout", description: "Giving this much to every film is tiring. They struggle to recognise when they need a break." },
      { kind: "weakness", label: "Tyranny of the List", description: "The watchlist sometimes turns from a path into a cage." },
    ],
    recommendations: [
      { kind: "director", title: "Andrei Tarkovsky" },
      { kind: "director", title: "Krzysztof Kieślowski" },
      { kind: "director", title: "Wong Kar-wai" },
      { kind: "director", title: "Lynne Ramsay" },
      { kind: "director", title: "Yorgos Lanthimos" },
      { kind: "film", title: "Stalker", year: 1979 },
      { kind: "film", title: "Three Colors: Blue", year: 1993 },
      { kind: "film", title: "In the Mood for Love", year: 2000 },
      { kind: "film", title: "We Need to Talk About Kevin", year: 2011 },
      { kind: "film", title: "The Banshees of Inisherin", year: 2022 },
      { kind: "genre", title: "Slow Cinema" },
      { kind: "genre", title: "Psychological Drama" },
      { kind: "genre", title: "Allegorical Sci-Fi" },
    ],
  },

  {
    code: "ESAW",
    sections: [
      {
        slug: "overview",
        title: "Introduction",
        body:
          "The Essayist is the loose cousin of the Interpreter. Same emotional bond, same eye for symbols, same care about craft — but no list. They discover spontaneously and then go deep enough to lose track of the time.\n\nThe Free Spirit auteur: respects cinema but won't chase it; waits for it to arrive. Stumbling onto a film gives them more pleasure than deciding to watch one. And the film they stumble onto will likely be watched twice.\n\nThe name fits because their thinking takes essay form — meandering, but sharp. They'll describe a film in ten lines someone else couldn't capture in a thousand pages.",
      },
      {
        slug: "watching-style",
        title: "How They Watch",
        body:
          "When, where, how — unpredictable. Sometimes 11 in the morning, sometimes 3 in the morning. Phone in hand or in another room, depending. What matters is whether the film talks to them. If it doesn't, they close it.\n\nUsually alone. Co-watching is too much commitment; pacing themselves around someone else is exhausting.",
      },
      {
        slug: "discovery",
        title: "How They Discover",
        body:
          "Wandering, but the catch is high quality. A still on social media (\"what film is this?\"), a passing reference on a podcast, a classic they've always meant to watch suddenly calling them, idle drift on Letterboxd, a single film by a director (no need to do the rest).\n\n\"I'll watch this on Tuesday\" is a sentence they don't say. \"I'm watching this right now\" is.",
      },
      {
        slug: "conversation",
        title: "After the Credits",
        body:
          "They wander quietly. They leave the film, but the film doesn't leave them. A week later, in one sentence: \"that film I watched the other day — turns out it…\" — the take comes late, but it's complete.\n\nSometimes they write — short, essayistic. Mostly they don't read other reviews; another's interpretation tires more than it informs.",
      },
      {
        slug: "recommendations",
        title: "What They'd Love",
        body:
          "Directors: Apichatpong Weerasethakul, Lucrecia Martel, Chantal Akerman, Hirokazu Kore-eda, Lee Chang-dong. Films: Uncle Boonmee Who Can Recall His Past Lives, Burning, Petite Maman, Drive My Car, Mulholland Drive. Genres: slow cinema, memory cinema, magic realism, festival favourites.",
      },
      {
        slug: "conclusion",
        title: "Conclusion",
        body:
          "ESAW dances with cinema at a half-step distance: not too close, not too far, neither planned nor unplanned. That looseness keeps them alive to it. The risk is that some great films simply never arrive at the \"right moment.\" An occasional list does them good.",
      },
    ],
    traits: [
      { kind: "strength", label: "Empathy + Distance", description: "Bonds with the character but never stops watching the scene. Two consciousnesses at once." },
      { kind: "strength", label: "Intuitive Symbol Reading", description: "Finds motifs by noticing, not by working at it. A natural gift." },
      { kind: "strength", label: "Spontaneous Openness", description: "Hits play without knowing why; while watching, understands why." },
      { kind: "strength", label: "Quick Internalisation", description: "Has something to say once a film ends — it doesn't need to marinate for days." },
      { kind: "strength", label: "Genre-Agnostic", description: "If you ask \"what genre do you watch?\" they have no answer. All of them, if it's good." },
      { kind: "weakness", label: "Unfinished Filmographies", description: "Three films from a director, never the fourth. Doesn't bother them but creates blind spots." },
      { kind: "weakness", label: "Mood-Dependent", description: "A film opened in the wrong mood usually ends up half-watched." },
      { kind: "weakness", label: "Lost in Memory", description: "No list means \"I saw a film once…\" and no name." },
      { kind: "weakness", label: "Doesn't Share", description: "Thinks after a film but rarely puts it out; their mental archive is messy without a journal." },
    ],
    recommendations: [
      { kind: "director", title: "Apichatpong Weerasethakul" },
      { kind: "director", title: "Lucrecia Martel" },
      { kind: "director", title: "Chantal Akerman" },
      { kind: "director", title: "Hirokazu Kore-eda" },
      { kind: "director", title: "Lee Chang-dong" },
      { kind: "film", title: "Uncle Boonmee Who Can Recall His Past Lives", year: 2010 },
      { kind: "film", title: "Burning", year: 2018 },
      { kind: "film", title: "Petite Maman", year: 2021 },
      { kind: "film", title: "Drive My Car", year: 2021 },
      { kind: "film", title: "Mulholland Drive", year: 2001 },
      { kind: "genre", title: "Slow Cinema" },
      { kind: "genre", title: "Memory & Magic Realism" },
      { kind: "genre", title: "Festival Drama" },
    ],
  },

  {
    code: "DSAC",
    sections: [
      {
        slug: "overview",
        title: "Introduction",
        body:
          "The Scholar loves cinema with academic affection. Identifying with a character isn't their mode of viewing — they read a scene as a construction: blocking, mise-en-scène, light, edit. They love decoding symbols, but without surrender. They live this as discipline, not coldness.\n\nThe most distant member of the Auteurs. With the Archivist strategy, the result is a collector: every era's important films catalogued, the canonical three of every director read, the representatives of every movement listed.\n\nNot a critic, but possibly reads more criticism than most critics. They consume film theory the way other people pick up hobbies.",
      },
      {
        slug: "watching-style",
        title: "How They Watch",
        body:
          "Alone, silent, fullscreen. No phone, no snacks. The first half hour usually settles their judgement; the rest is confirmation or revision.\n\nThey have rituals: read the director's bio and filmography before starting on a director, brush up on the historical background before a period film.",
      },
      {
        slug: "discovery",
        title: "How They Discover",
        body:
          "The most systematic of all viewer types: Sight & Sound \"Greatest Films\" lists, the academic canon (Bordwell, Mulvey, Bazin references), full director retrospectives (Kurosawa's thirty films in order), movements and schools (Soviet Montage, French New Wave, Iranian New Wave), the Criterion Collection.\n\nThey either ignore algorithmic recommendations or use them with a faint sneer.",
      },
      {
        slug: "conversation",
        title: "After the Credits",
        body:
          "They keep notes — what they watched, when, how it sat with them. They might write a long Letterboxd review — analytical, not emotional. They read other criticism and compare.\n\nThey enjoy debate but aren't combative; clear argument, clear counter-argument.",
      },
      {
        slug: "recommendations",
        title: "What They'd Love",
        body:
          "Directors: Stanley Kubrick, Robert Bresson, Michael Haneke, Jean-Luc Godard, Béla Tarr. Films: 2001: A Space Odyssey, The Mirror, Sátántangó, Caché, The Conformist. Genres: structuralist cinema, modernist narrative, milestone film history, experimental.",
      },
      {
        slug: "conclusion",
        title: "Conclusion",
        body:
          "The Scholar takes cinema more seriously than any other type. That investment makes them deeply knowledgeable, but it can also make them a lonely viewer — not everyone puts in this work, not everyone speaks the same language. Watching neutrally now and then, watching a \"bad\" film, opening one without expectations — those things help. Cinema isn't only a history of works; it's also experience.",
      },
    ],
    traits: [
      { kind: "strength", label: "Wide Canon Knowledge", description: "Knows the spine of film history; loves contextualising, so each film opens with a reference to the one before it." },
      { kind: "strength", label: "Technical Reading", description: "\"Why this angle in this scene?\" comes naturally. Camera language is parsed line by line." },
      { kind: "strength", label: "Cool Judgement", description: "No emotional investment means no charity for bad films; but no \"I loved it\" for good ones either — \"it succeeds in this respect.\"" },
      { kind: "strength", label: "Systematic", description: "Filmographies, eras, movements — in order, completely." },
      { kind: "strength", label: "Critical Dialogue", description: "Asks \"by what standard?\" of your take. Enjoys layered conversations." },
      { kind: "weakness", label: "Emotional Ice", description: "Sometimes a film has moved them and they refuse to admit it; the analytical shield is too strong." },
      { kind: "weakness", label: "Academic Snobbery", description: "Risks dismissing popular-but-good cinema (genre masters, mainstream auteurs)." },
      { kind: "weakness", label: "Over-Contextualised", description: "Struggles to evaluate a film on its own terms; always inside a frame of reference." },
      { kind: "weakness", label: "First-Watch Distance", description: "Spends the \"pure moment\" of a first viewing on something else — they've already read about it, they already know, they're already expecting." },
    ],
    recommendations: [
      { kind: "director", title: "Stanley Kubrick" },
      { kind: "director", title: "Robert Bresson" },
      { kind: "director", title: "Michael Haneke" },
      { kind: "director", title: "Jean-Luc Godard" },
      { kind: "director", title: "Béla Tarr" },
      { kind: "film", title: "2001: A Space Odyssey", year: 1968 },
      { kind: "film", title: "The Mirror", year: 1975 },
      { kind: "film", title: "Sátántangó", year: 1994 },
      { kind: "film", title: "Caché", year: 2005 },
      { kind: "film", title: "The Conformist", year: 1970 },
      { kind: "genre", title: "Structuralist & Modernist" },
      { kind: "genre", title: "Film History Milestones" },
      { kind: "genre", title: "Experimental" },
    ],
  },

  {
    code: "DSAW",
    sections: [
      {
        slug: "overview",
        title: "Introduction",
        body:
          "The Critic is a free-form analyst. Hunts for symbols, reads the craft, keeps distance — but refuses the list. At first glance an unlucky combination: distance plus looseness equals indifference. In fact what comes out is a very picky viewer working on their own terms.\n\nThe Drifter strategy separates them from the typical scholarly critic profile: not academic, more journalist-critic. They watch what comes; they judge sharply.\n\nUsually alone, no time for crowded screenings, but at home in festival environments. Their own curator; doesn't trust other people's lists.",
      },
      {
        slug: "watching-style",
        title: "How They Watch",
        body:
          "Alone, at home or in an empty matinée. Setup is unimportant — bad room is bad room, they keep watching. Coffee to stay awake, nothing more.\n\nNo specific time slots; long film or short, equally fine. If bored they don't pause, they close.",
      },
      {
        slug: "discovery",
        title: "How They Discover",
        body:
          "Festival critic write-ups (read the writer, not the list), a handful of trusted accounts on social, \"new release\" news (open it if the director rings a bell), year-end lists (read others' rather than make their own), streaming algorithms — used, but the compatibility score is ignored in favour of the description.\n\nThey have no urge to finish a director's filmography in order — but the \"talked-about\" film by that director, they'll open.",
      },
      {
        slug: "conversation",
        title: "After the Credits",
        body:
          "Short take, sharp tone. The Letterboxd review of two sentences. They take nuance between \"good\" and \"bad,\" but they don't dwell.\n\nDoesn't go looking for arguments, but if pulled in: incisive. Not interested in extracting why someone else loved a film — \"alright, fine, you love it.\"",
      },
      {
        slug: "recommendations",
        title: "What They'd Love",
        body:
          "Directors: David Cronenberg, Paul Verhoeven, Claire Denis, Lars von Trier, Olivier Assayas. Films: Crash, Mulholland Drive, Personal Shopper, The House That Jack Built, Titane. Genres: provocative art cinema, transgressive film, art-house thriller, neo-noir.",
      },
      {
        slug: "conclusion",
        title: "Conclusion",
        body:
          "The Critic is one of the hardest viewers to \"sell\" — they trust their own picks, they're cool to outside recommendations. That independence keeps their quality filter sharp; it also drifts them away from the wider cinema community. Now and then, writing long about a film they love or sharing it does them good. Films are watched alone, but they aren't lived alone.",
      },
    ],
    traits: [
      { kind: "strength", label: "Quick Diagnosis", description: "Reads a film in the first twenty minutes. Places its style, its genre, its intent immediately." },
      { kind: "strength", label: "Unprejudiced Opening", description: "Same distance for every film — neither excessive reverence nor excessive scorn." },
      { kind: "strength", label: "Independent Verdict", description: "Often holds opinions far from the critical average and defends them." },
      { kind: "strength", label: "Efficient", description: "No problem closing a film mid-way; their time is finite." },
      { kind: "strength", label: "Wide Genre Range", description: "Coolness means no allergies — they'll try anything." },
      { kind: "weakness", label: "Cold Messaging", description: "Doesn't excite anyone after a film; \"it was good,\" they say, and move on." },
      { kind: "weakness", label: "Canonical Gaps", description: "Without a system they may have skipped some accepted classics." },
      { kind: "weakness", label: "One-Watch Rule", description: "Rarely believes in second viewings. \"Once was enough, verdict's in.\"" },
      { kind: "weakness", label: "No Records", description: "Forgets what they watched a few months on." },
    ],
    recommendations: [
      { kind: "director", title: "David Cronenberg" },
      { kind: "director", title: "Paul Verhoeven" },
      { kind: "director", title: "Claire Denis" },
      { kind: "director", title: "Lars von Trier" },
      { kind: "director", title: "Olivier Assayas" },
      { kind: "film", title: "Crash", year: 1996 },
      { kind: "film", title: "Mulholland Drive", year: 2001 },
      { kind: "film", title: "Personal Shopper", year: 2016 },
      { kind: "film", title: "The House That Jack Built", year: 2018 },
      { kind: "film", title: "Titane", year: 2021 },
      { kind: "genre", title: "Provocative Art Cinema" },
      { kind: "genre", title: "Transgressive Film" },
      { kind: "genre", title: "Neo-Noir" },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // VISIONARIES
  // ──────────────────────────────────────────────────────────────────────
  {
    code: "ESIC",
    sections: [
      {
        slug: "overview",
        title: "Introduction",
        body:
          "The Dreamer treats cinema as an inner journey. Bonds with characters, hunts for symbols — but the hunt happens by feeling, not by analysis. They might not be able to explain why a film moved them, but they know in their bones that it did.\n\nThe Devoted strategy turns them into a ritualised, not chaotic, surrender. There is a list, an order, but each film waits for its right moment. Watching the wrong film at the wrong time feels like wasting it.\n\nThe most disciplined of the Visionaries — but the discipline isn't academic, it's almost spiritual.",
      },
      {
        slug: "watching-style",
        title: "How They Watch",
        body:
          "Ritual. Dark room, headphones or good speakers, phone in another room. Sometimes a candle — they don't find it absurd. They might sit silently for five minutes before pressing play.\n\nWatching together is rare; if it happens, no one talks during the film. Conversation is afterwards, certainly.",
      },
      {
        slug: "discovery",
        title: "How They Discover",
        body:
          "Curatorial but not academic: thematic curation (films about grief, about mothers and daughters), seasons and times (Tarkovsky in autumn, Bergman in winter evenings), the other films of a director they once loved, the favourites lists of one Letterboxd account they trust, communities for slow, silent or symbolic cinema.\n\nThe list exists, but the choice of when to watch what is intuitive.",
      },
      {
        slug: "conversation",
        title: "After the Credits",
        body:
          "Quiet first. Doesn't speak, won't even turn the light on. Leaving a film is a passage — not to be rushed.\n\nLater, they write — short, almost poetic notes. Or one sentence to a friend: \"watched a film, it described me a little.\" They read criticism but consume it as poems, not as verdicts.",
      },
      {
        slug: "recommendations",
        title: "What They'd Love",
        body:
          "Directors: Andrei Tarkovsky, Terrence Malick, Wim Wenders, Theo Angelopoulos, Tsai Ming-liang. Films: The Tree of Life, Stalker, Wings of Desire, Eternity and a Day, Solaris. Genres: poetic cinema, contemplative drama, slow cinema, spiritual film.",
      },
      {
        slug: "conclusion",
        title: "Conclusion",
        body:
          "The Dreamer watches as if making an offering. The intensity is both wealth and weight. Accepting that films feed and tire them, allowing themselves a \"light\" film occasionally, makes them a more sustainable viewer. Not every film has to be a ceremony; some are just dinner.",
      },
    ],
    traits: [
      { kind: "strength", label: "Deep Emotional Memory", description: "Years later, they remember the feeling a film gave them. Not \"which scene\" but \"which feeling\"." },
      { kind: "strength", label: "Intuitive Symbolism", description: "Sees meaning without forcing it; can't give the academic explanation but can tell you \"what it's saying.\"" },
      { kind: "strength", label: "Picks the Right Moment", description: "Chooses what to watch when wisely; that's why their ratio of films-they-loved is high." },
      { kind: "strength", label: "Empathic Reach", description: "Bonds quickly across foreign languages, cultures and eras." },
      { kind: "strength", label: "Atmosphere First", description: "The flow of feeling matters more than story — making them the ideal audience for the great poet-directors." },
      { kind: "weakness", label: "Hard to Articulate", description: "Struggles to put into words and share why a film mattered." },
      { kind: "weakness", label: "Hyper-Sensitive", description: "A heavy film at the wrong time can leave them off-balance for days." },
      { kind: "weakness", label: "Intuitive Loyalty", description: "Tends to elevate even the weak film of a director they revere." },
      { kind: "weakness", label: "The Right-Moment Trap", description: "The right moment never arrives, and films sit unopened for years." },
    ],
    recommendations: [
      { kind: "director", title: "Andrei Tarkovsky" },
      { kind: "director", title: "Terrence Malick" },
      { kind: "director", title: "Wim Wenders" },
      { kind: "director", title: "Theo Angelopoulos" },
      { kind: "director", title: "Tsai Ming-liang" },
      { kind: "film", title: "The Tree of Life", year: 2011 },
      { kind: "film", title: "Stalker", year: 1979 },
      { kind: "film", title: "Wings of Desire", year: 1987 },
      { kind: "film", title: "Eternity and a Day", year: 1998 },
      { kind: "film", title: "Solaris", year: 1972 },
      { kind: "genre", title: "Poetic Cinema" },
      { kind: "genre", title: "Spiritual / Contemplative" },
      { kind: "genre", title: "Heavy Drama" },
    ],
  },

  {
    code: "ESIW",
    sections: [
      {
        slug: "overview",
        title: "Introduction",
        body:
          "The Mystic is the unscheduled sibling of the Dreamer. Same feeling, same hunt for symbols, same surrender — but no calendar, no list, no ritual. Goes with the flow of the moment; and surprisingly often, the right film finds them.\n\nThe most mystical Free Spirit: relationship to a film is an approach. They don't go to the film; the film comes. When it does, the door is open.\n\nThis viewer doesn't engage much with cinema-as-culture conversations; the relationship is personal, not communal.",
      },
      {
        slug: "watching-style",
        title: "How They Watch",
        body:
          "Highly variable. Sometimes silent room start to finish, sometimes half on the couch. The setting doesn't matter; the mood does — wherever fits.\n\nUsually alone. Watching with someone takes a special moment; it isn't routine.",
      },
      {
        slug: "discovery",
        title: "How They Discover",
        body:
          "Wandering but deep: a sentence, an image, a recommendation is enough. A film opened by chance can stay with them for years. They trust social spark over algorithm. Don't read year-end lists or canon lists. Sometimes a musician or writer they love drops a film name and that's enough.\n\nMostly they don't watch the rest of a director's films; that one film was complete with them.",
      },
      {
        slug: "conversation",
        title: "After the Credits",
        body:
          "Usually silent. Leaving a film is like waking up — they don't want to wake too quickly. They don't write, don't share, just carry it.\n\nA film they really love might get told to one person, but even that's rare.",
      },
      {
        slug: "recommendations",
        title: "What They'd Love",
        body:
          "Directors: Apichatpong Weerasethakul, Hayao Miyazaki, Pedro Almodóvar, Sofia Coppola, Hirokazu Kore-eda. Films: Spirited Away, Lost in Translation, Past Lives, Aftersun, Memoria. Genres: atmospheric drama, art animation, magic realism, intimate drama.",
      },
      {
        slug: "conclusion",
        title: "Conclusion",
        body:
          "The Mystic might be the most personal viewer of all — cinema is an inner conversation, not a public consumption. That beauty also carries a risk of isolation. Sharing occasionally, watching a film they love with someone else, even getting into a boring argument — these things keep them tied to the wider community.",
      },
    ],
    traits: [
      { kind: "strength", label: "Flow", description: "Once inside a film, the outside world disappears. A master of full immersion." },
      { kind: "strength", label: "Intuitive Choice", description: "Knows what to watch without being able to explain the choice. Usually it lands." },
      { kind: "strength", label: "Wordless Conveyance", description: "Can't explain a film, but transmits it through gesture, expression, what they share." },
      { kind: "strength", label: "Open Door", description: "No prejudices; new languages, new genres and new forms are always welcome." },
      { kind: "strength", label: "Personal Bond", description: "Beloved films are almost like friends." },
      { kind: "weakness", label: "Canonical Holes", description: "Half of the \"you have to see\" films are unwatched, and they don't regret it." },
      { kind: "weakness", label: "Pure Subjectivity", description: "\"Is this actually a good film?\" has no answer; \"it worked for me\" is enough." },
      { kind: "weakness", label: "Refuses Argument", description: "No interest in proving a beloved film is good — which can isolate them." },
      { kind: "weakness", label: "Weak Recall", description: "Remembers a film by \"that scene I cried in\" but can't name the director." },
    ],
    recommendations: [
      { kind: "director", title: "Apichatpong Weerasethakul" },
      { kind: "director", title: "Hayao Miyazaki" },
      { kind: "director", title: "Pedro Almodóvar" },
      { kind: "director", title: "Sofia Coppola" },
      { kind: "director", title: "Hirokazu Kore-eda" },
      { kind: "film", title: "Spirited Away", year: 2001 },
      { kind: "film", title: "Lost in Translation", year: 2003 },
      { kind: "film", title: "Past Lives", year: 2023 },
      { kind: "film", title: "Aftersun", year: 2022 },
      { kind: "film", title: "Memoria", year: 2021 },
      { kind: "genre", title: "Atmospheric Drama" },
      { kind: "genre", title: "Art Animation" },
      { kind: "genre", title: "Intimate Drama" },
    ],
  },

  {
    code: "DSIC",
    sections: [
      {
        slug: "overview",
        title: "Introduction",
        body:
          "The Curator is a rare combination: distant but absorbed, systematic but emotionally open. Doesn't identify with characters but enters the atmosphere. Hunts for symbols intuitively rather than analytically. Has a list — and the list is poetic.\n\nThe Archivist strategy distinguishes them from the Scholar: the Scholar is academic, the Curator is aesthetic. The Scholar becomes a film historian; the Curator becomes a gallery curator. Same discipline, different purpose.\n\nSees cinema as the art of collecting. Which film entered them, where it sits in their collection — that matters.",
      },
      {
        slug: "watching-style",
        title: "How They Watch",
        body:
          "Setup matters a great deal. Screen quality, sound, room light — all treated with the precision of hanging a poster. They might refuse to watch in a poor environment.\n\nMostly alone; a co-viewer only adds value if there's an aesthetic dialogue. With the right person, the experience can be extraordinary.",
      },
      {
        slug: "discovery",
        title: "How They Discover",
        body:
          "Aesthetic movements (the gaze of Wong Kar-wai, Sofia Coppola, Park Chan-wook), curations that follow film style (Mubi lists), specific cinematographers (Roger Deakins, Hoyte van Hoytema), thematic moodboard lists, art cinema archives (Mubi, Criterion Channel).\n\nFestival aftermath lists, \"best cinematography of the year\" curations.",
      },
      {
        slug: "conversation",
        title: "After the Credits",
        body:
          "They keep records — Letterboxd, a personal database, even a visual moodboard. Their notes mix in visual references: \"this film and that one share a temperature.\"\n\nThey curate more than they converse: recommending a film to someone is like gifting a composition.",
      },
      {
        slug: "recommendations",
        title: "What They'd Love",
        body:
          "Directors: Wong Kar-wai, Park Chan-wook, Yorgos Lanthimos, Luca Guadagnino, Nicolas Winding Refn. Films: In the Mood for Love, Oldboy, Drive, Call Me by Your Name, The Neon Demon. Genres: stylish noir, romantic art-house, hyper-aesthetic horror, sensory cinema.",
      },
      {
        slug: "conclusion",
        title: "Conclusion",
        body:
          "The Curator curates cinema like a gallery. The rigour makes the collection unique, but it can also close them in. Watching a bad film occasionally, giving \"story-not-form\" films a chance, touching the social side of cinema — these things help. The purer the aesthetic, the lonelier it gets.",
      },
    ],
    traits: [
      { kind: "strength", label: "Aesthetic Filter", description: "No tolerance for poorly designed films, but deep surrender when the design lands." },
      { kind: "strength", label: "Systematic Mood Hunt", description: "Searches for specific moods systematically — winter noirs, summer melancholy, retro-futurism." },
      { kind: "strength", label: "Personal Canon", description: "Has a private canon that overlaps with the mainstream by maybe 30%." },
      { kind: "strength", label: "Distant Immersion", description: "Inside the film without the emotional bruises; it's an aesthetic bath." },
      { kind: "strength", label: "Strong Recommender", description: "Gives good recs — why this film, for this person, at this moment." },
      { kind: "weakness", label: "Form Over Story", description: "Will forgive a poorly written but beautifully shot film, blurring judgement." },
      { kind: "weakness", label: "Cool Bond", description: "Even a beloved film is described with words at a distance." },
      { kind: "weakness", label: "Niche Trap", description: "Once buried in an aesthetic, struggles to step outside." },
      { kind: "weakness", label: "Character Neglect", description: "A film without a human story can still be \"enough\" — strange to other viewers." },
    ],
    recommendations: [
      { kind: "director", title: "Wong Kar-wai" },
      { kind: "director", title: "Park Chan-wook" },
      { kind: "director", title: "Yorgos Lanthimos" },
      { kind: "director", title: "Luca Guadagnino" },
      { kind: "director", title: "Nicolas Winding Refn" },
      { kind: "film", title: "In the Mood for Love", year: 2000 },
      { kind: "film", title: "Oldboy", year: 2003 },
      { kind: "film", title: "Drive", year: 2011 },
      { kind: "film", title: "Call Me by Your Name", year: 2017 },
      { kind: "film", title: "The Neon Demon", year: 2016 },
      { kind: "genre", title: "Stylish Noir" },
      { kind: "genre", title: "Romantic Art-House" },
      { kind: "genre", title: "Hyper-Aesthetic Horror" },
    ],
  },

  {
    code: "DSIW",
    sections: [
      {
        slug: "overview",
        title: "Introduction",
        body:
          "The Wanderer might be the most zen of all 16 types. Unplanned, distant, but absorbed once inside — a true spectator with no urge to interfere. Films are landscapes for them: they go, they look, they come back.\n\nThe symbolist Drifter: stumbles, gets carried, but doesn't hold on. No list, no criticism, no catalogue — just memories.\n\nThis viewer might be the quietest member of cinema culture; but ask them and they answer in depth.",
      },
      {
        slug: "watching-style",
        title: "How They Watch",
        body:
          "Whenever, wherever. No specific ritual. The phone may be near, but once the film starts the phone gets put down by itself.\n\nMostly alone; not seeking solitude, not socially driven.",
      },
      {
        slug: "discovery",
        title: "How They Discover",
        body:
          "An offhand recommendation (one \"watch this\" is enough), the streaming algorithm (used without questioning), happy accidents, an old film and a sudden \"I'll open this now,\" a music or book reference.\n\nThe idea of making a list tires them.",
      },
      {
        slug: "conversation",
        title: "After the Credits",
        body:
          "Quiet. No writing, no records, no sharing. A week later: \"saw a good film,\" no detail.\n\nIf a film does sink in, it lives in their head for days — but doesn't come out.",
      },
      {
        slug: "recommendations",
        title: "What They'd Love",
        body:
          "Directors: Jim Jarmusch, Aki Kaurismäki, Tsai Ming-liang, Béla Tarr, Lisandro Alonso. Films: Stranger Than Paradise, Paterson, The Match Factory Girl, Jauja, Goodbye, Dragon Inn. Genres: slow cinema, deadpan comedy, contemplative minimalism, silent cinema.",
      },
      {
        slug: "conclusion",
        title: "Conclusion",
        body:
          "The Wanderer doesn't fold cinema into the rhythm of life so much as visit it. The lightness keeps them free; it also keeps them slightly outside the cinematic experience. Investing in a film occasionally — writing, talking, finishing a director in order — would enrich that flow.",
      },
    ],
    traits: [
      { kind: "strength", label: "Unprejudiced Flow", description: "Same blank slate for every film — produces the purest viewing experience." },
      { kind: "strength", label: "Mystical Recall", description: "Years later, summons a frame, a sentence, a piece of music from memory." },
      { kind: "strength", label: "No Pressure", description: "Free of \"should-have-watched\" guilt; watches when they watch." },
      { kind: "strength", label: "Atmosphere-Friendly", description: "Sits comfortably with slow films and wordless scenes." },
      { kind: "strength", label: "Joy Without Validation", description: "Doesn't care what critics said; their experience is enough." },
      { kind: "weakness", label: "No Records", description: "Doesn't remember what they watched, when, or in what order — \"there was a film…\"" },
      { kind: "weakness", label: "Patchy Knowledge", description: "Their cinema literacy is randomly distributed because acquisition is spontaneous." },
      { kind: "weakness", label: "Hard to Articulate", description: "When telling a friend about a film: \"the thing, with the thing, you know…\"" },
      { kind: "weakness", label: "One-Take", description: "Rarely rewatches, so some films don't fully open." },
    ],
    recommendations: [
      { kind: "director", title: "Jim Jarmusch" },
      { kind: "director", title: "Aki Kaurismäki" },
      { kind: "director", title: "Tsai Ming-liang" },
      { kind: "director", title: "Béla Tarr" },
      { kind: "director", title: "Lisandro Alonso" },
      { kind: "film", title: "Stranger Than Paradise", year: 1984 },
      { kind: "film", title: "Paterson", year: 2016 },
      { kind: "film", title: "The Match Factory Girl", year: 1990 },
      { kind: "film", title: "Jauja", year: 2014 },
      { kind: "film", title: "Goodbye, Dragon Inn", year: 2003 },
      { kind: "genre", title: "Slow Cinema" },
      { kind: "genre", title: "Deadpan Comedy" },
      { kind: "genre", title: "Contemplative Minimalism" },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // CONNOISSEURS
  // ──────────────────────────────────────────────────────────────────────
  {
    code: "ELAC",
    sections: [
      {
        slug: "overview",
        title: "Introduction",
        body:
          "The Enthusiast is in love with cinema's well-made stories. Bonds with characters but expects the writing to deserve it. Doesn't hunt for symbols; script consistency, performance reality, directorial craft — those are their love language.\n\nThe warmest member of the Connoisseurs. Defends the films they love, has lists, has arguments at the ready. A bad film makes them angry; a good one makes them eloquent. Cinema chat for them isn't a wind-down — it's sport.",
      },
      {
        slug: "watching-style",
        title: "How They Watch",
        body:
          "Tidy. Evening, after dinner, room in order. Solo or with a partner / friend. Phone off; co-watching open to dialogue at appropriate moments.\n\nLikes going to the cinema — the big screen experience matters.",
      },
      {
        slug: "discovery",
        title: "How They Discover",
        body:
          "Year-end lists (Variety / Rolling Stone, not Sight & Sound), Oscar / Bafta / Cannes main competitions, Letterboxd \"popular this week,\" the new film of an actor they love, canonical \"must-see\" films within a genre (best biopics, best courtroom dramas).\n\nThe watchlist is meticulous — they can tell you why each film is on it.",
      },
      {
        slug: "conversation",
        title: "After the Credits",
        body:
          "They want to talk, and to argue. Explain a film they didn't like with reasons; a film they did with enthusiasm. Letterboxd stars and a short note.\n\nThey read criticism — pleased when in agreement, intrigued when not.",
      },
      {
        slug: "recommendations",
        title: "What They'd Love",
        body:
          "Directors: Christopher Nolan, Denis Villeneuve, David Fincher, Greta Gerwig, Bong Joon-ho. Films: The Social Network, Parasite, Sicario, Little Women, Whiplash. Genres: high-budget auteur, prestige drama, smart genre, well-crafted thriller.",
      },
      {
        slug: "conclusion",
        title: "Conclusion",
        body:
          "ELAC defends cinema's successful middle ground — neither too experimental nor purely commercial. That stance makes them a reliable viewer, but it can keep the door closed on cinema's rule-breaking wings (experimental, slow, symbolic). Giving those wings a chance now and then expands their map.",
      },
    ],
    traits: [
      { kind: "strength", label: "Sensitive to Character Writing", description: "Spots inconsistency in a character immediately, and it bothers them." },
      { kind: "strength", label: "Mainstream Quality Filter", description: "Best thriller, best biopic, best superhero, best rom-com — they can defend each." },
      { kind: "strength", label: "Enthusiastic Conversation", description: "When they talk about a film they love, they pull others into it." },
      { kind: "strength", label: "Systematic Genre Exploration", description: "Once inside a genre, finishes its canonical films." },
      { kind: "strength", label: "Eye for Performance", description: "Special respect for acting; \"what are they doing in this scene?\" is their native question." },
      { kind: "weakness", label: "Closed to Symbolism", description: "Open-ended / symbolic films can be dismissed as \"lazy writing.\"" },
      { kind: "weakness", label: "Allergic to Slow Cinema", description: "Slow tempo equals \"missing story\" for them." },
      { kind: "weakness", label: "Plot-Hole Obsession", description: "Even a beloved film feels broken if a plot hole appears." },
      { kind: "weakness", label: "Reliant on Critic Consensus", description: "Can over-trust IMDb / Rotten Tomatoes scores." },
    ],
    recommendations: [
      { kind: "director", title: "Christopher Nolan" },
      { kind: "director", title: "Denis Villeneuve" },
      { kind: "director", title: "David Fincher" },
      { kind: "director", title: "Greta Gerwig" },
      { kind: "director", title: "Bong Joon-ho" },
      { kind: "film", title: "The Social Network", year: 2010 },
      { kind: "film", title: "Parasite", year: 2019 },
      { kind: "film", title: "Sicario", year: 2015 },
      { kind: "film", title: "Little Women", year: 2019 },
      { kind: "film", title: "Whiplash", year: 2014 },
      { kind: "genre", title: "Prestige Drama" },
      { kind: "genre", title: "Smart Genre" },
      { kind: "genre", title: "Well-Crafted Thriller" },
    ],
  },

  {
    code: "ELAW",
    sections: [
      {
        slug: "overview",
        title: "Introduction",
        body:
          "The Explorer is open-minded, demands quality, but roams. Bonds with characters, wants realism, notices craft — but does all of this by watching whatever shows up. More curiosity than list.\n\nThe Free Spirit Connoisseur: \"having a good time while looking for a good film.\" An objection to classical list-rigour: \"is the good film always on the list?\"\n\nGenre-hopping record holder — noir this week, documentary the next, romantic comedy after that.",
      },
      {
        slug: "watching-style",
        title: "How They Watch",
        body:
          "Whenever. Sunday morning documentary, Tuesday evening thriller, Friday night rom-com. Open to co-watching; socially relaxed.\n\nLocation doesn't matter: living room, cinema, plane, hotel — anywhere works.",
      },
      {
        slug: "discovery",
        title: "How They Discover",
        body:
          "Friend recommendations (the strongest source), \"this week's releases,\" random clicks, genre anthologies — but not in order — films being talked about on social media.\n\nNo watchlist, or one they don't really check.",
      },
      {
        slug: "conversation",
        title: "After the Credits",
        body:
          "Talks, shares, but doesn't write at length. \"Watched it, liked it / didn't, here's why, moving on.\" Minimal Letterboxd notes.\n\nLikes debate but as fun, not combat. \"You loved it, I didn't\" — relaxed.",
      },
      {
        slug: "recommendations",
        title: "What They'd Love",
        body:
          "Directors: Steven Spielberg, Rian Johnson, Chloé Zhao, Taika Waititi, Edgar Wright. Films: Knives Out, Hot Fuzz, Catch Me If You Can, Nomadland, Jojo Rabbit. Genres: genre-bender, dramedy, fun high-quality, mainstream auteur.",
      },
      {
        slug: "conclusion",
        title: "Conclusion",
        body:
          "ELAW is the member of the cinema community who, on a good day, can watch with anyone. The openness enriches them but can prevent depth. Finishing a director in order, reading a genre systematically — those would open another layer of pleasure. The talent is there; it just needs a channel.",
      },
    ],
    traits: [
      { kind: "strength", label: "Genre Flexibility", description: "No allergies; looks for quality in every genre." },
      { kind: "strength", label: "Verdict + Chance", description: "Sharp on judgement, but open to the experiment first." },
      { kind: "strength", label: "Spontaneous Bonding", description: "An unexpected character in an unexpected film can hit them." },
      { kind: "strength", label: "Socially Open", description: "Warm to recommendations; doesn't see another's enthusiasm as a threat." },
      { kind: "strength", label: "Variable Pace", description: "Can do fast-paced action and slow drama; the mood is allowed to flex." },
      { kind: "weakness", label: "Lacks Depth", description: "Watches one film by a director, loves it, never tries another." },
      { kind: "weakness", label: "Memory Confusion", description: "Watches so many films that they blur." },
      { kind: "weakness", label: "Loss From Drift", description: "Can skip a canonical film for years." },
      { kind: "weakness", label: "Quick to Quit", description: "Closes what they don't like, sometimes too early." },
    ],
    recommendations: [
      { kind: "director", title: "Steven Spielberg" },
      { kind: "director", title: "Rian Johnson" },
      { kind: "director", title: "Chloé Zhao" },
      { kind: "director", title: "Taika Waititi" },
      { kind: "director", title: "Edgar Wright" },
      { kind: "film", title: "Knives Out", year: 2019 },
      { kind: "film", title: "Hot Fuzz", year: 2007 },
      { kind: "film", title: "Catch Me If You Can", year: 2002 },
      { kind: "film", title: "Nomadland", year: 2020 },
      { kind: "film", title: "Jojo Rabbit", year: 2019 },
      { kind: "genre", title: "Genre-Bender" },
      { kind: "genre", title: "Dramedy" },
      { kind: "genre", title: "Mainstream Auteur" },
    ],
  },

  {
    code: "DLAC",
    sections: [
      {
        slug: "overview",
        title: "Introduction",
        body:
          "The Analyst's relationship with cinema resembles an engineer's with structure. Distant, concrete, analytical, systematic — they look for evaluation, not emotional investment. They don't identify with characters, but they inspect the quality of character writing scrupulously.\n\nThe coolest of the Connoisseurs. Believes there's such a thing as an objectively good film and tries to measure it. Lists, scores, comparison frameworks.\n\nFilm reviewer, film teacher, quality control eye.",
      },
      {
        slug: "watching-style",
        title: "How They Watch",
        body:
          "Alone, focused, uninterrupted. May take notes — structure, beat, scene transition. Not afraid of a second viewing, but for analysis, not feeling.\n\nPrefers home over theatre — pause, rewind, replay.",
      },
      {
        slug: "discovery",
        title: "How They Discover",
        body:
          "Sight & Sound, BFI, AFI lists; film school syllabi; genre canons; director retrospectives; academic film books.\n\nDeep suspicion of algorithms.",
      },
      {
        slug: "conversation",
        title: "After the Credits",
        body:
          "They write — long, structural, with arguments. Letterboxd numbers and prose. Enjoys debate but doesn't take it as personal attack; replies with arguments.\n\nMentally \"converses\" with critics; an important reader of professional criticism.",
      },
      {
        slug: "recommendations",
        title: "What They'd Love",
        body:
          "Directors: Sidney Lumet, William Wyler, Billy Wilder, Akira Kurosawa, Sergio Leone. Films: 12 Angry Men, The Godfather, Double Indemnity, Seven Samurai, No Country for Old Men. Genres: classical Hollywood, canonical thriller, courtroom / procedural, structural canon.",
      },
      {
        slug: "conclusion",
        title: "Conclusion",
        body:
          "DLAC is the curator-analyst of cinema. The rigour keeps quality sensitivity high but can wall off the experiential wing of cinema (immersive, symbolic, open-ended). Watching a \"bad\" film occasionally, looking without rating — those help. Rules are useful, but not every beauty is measurable.",
      },
    ],
    traits: [
      { kind: "strength", label: "Structural Analysis", description: "Three-act, beat sheet, character arc — reads the script's architecture." },
      { kind: "strength", label: "Performance Recognition", description: "Knows when an actor is \"good\" vs \"showy\"." },
      { kind: "strength", label: "Genre Fluency", description: "Knows every genre's conventions and when they're broken." },
      { kind: "strength", label: "Systematic Canon", description: "Has \"must-see\" lists for every genre and every era." },
      { kind: "strength", label: "Consistent Verdict", description: "Applies the same criteria across films with the same severity." },
      { kind: "weakness", label: "Rule-Bound", description: "Tendency to call \"non-structural\" films \"failed.\"" },
      { kind: "weakness", label: "Cool Communication", description: "Even talking about a beloved film can sound dry." },
      { kind: "weakness", label: "Resistance to Symbol", description: "Sees interpretive films as authorial laziness." },
      { kind: "weakness", label: "Refuses Emotional Speech", description: "Hard to say \"I found it moving\" — usually \"it was effectively made.\"" },
    ],
    recommendations: [
      { kind: "director", title: "Sidney Lumet" },
      { kind: "director", title: "William Wyler" },
      { kind: "director", title: "Billy Wilder" },
      { kind: "director", title: "Akira Kurosawa" },
      { kind: "director", title: "Sergio Leone" },
      { kind: "film", title: "12 Angry Men", year: 1957 },
      { kind: "film", title: "The Godfather", year: 1972 },
      { kind: "film", title: "Double Indemnity", year: 1944 },
      { kind: "film", title: "Seven Samurai", year: 1954 },
      { kind: "film", title: "No Country for Old Men", year: 2007 },
      { kind: "genre", title: "Classical Hollywood" },
      { kind: "genre", title: "Courtroom / Procedural" },
      { kind: "genre", title: "Structural Canon" },
    ],
  },

  {
    code: "DLAW",
    sections: [
      {
        slug: "overview",
        title: "Introduction",
        body:
          "The Pragmatist is cool-headed, concrete, analytical — and unscheduled. Stays away from symbols, won't be swept up by atmosphere, finds lists pointless. What do they want from a film? It does the job. Made well, time well spent, no complaints when it ends.\n\nThe most pragmatic Connoisseur. Not cold to \"cinema as art\" — they just personally find quality entertainment to be enough.\n\nMaybe the least emotionally invested viewer; not negative, just practical.",
      },
      {
        slug: "watching-style",
        title: "How They Watch",
        body:
          "Evening, on the couch, ideally at home. Theatre for a specific film (a big release) — otherwise no need. Phone might be nearby — not a big deal.\n\nUsually alone or with a roommate; no production around it.",
      },
      {
        slug: "discovery",
        title: "How They Discover",
        body:
          "Streaming home page, friend rec (one sentence is enough), \"5 films to watch this week\" lists, the new film of an actor they like, IMDb 7.5+ filter.\n\nNo watchlist, or one they've forgotten.",
      },
      {
        slug: "conversation",
        title: "After the Credits",
        body:
          "\"Good\" / \"bad\" / \"meh.\" Might not use Letterboxd; if they do, a star and half a sentence.\n\nWill engage in a debate but ends it quickly. Doesn't read criticism.",
      },
      {
        slug: "recommendations",
        title: "What They'd Love",
        body:
          "Directors: Doug Liman, Antoine Fuqua, Jeff Nichols, Steven Soderbergh, Michael Mann. Films: Heat, The Bourne Identity, Mud, Logan, Ocean's Eleven. Genres: high-quality entertainment, smart action, thriller, professional procedural.",
      },
      {
        slug: "conclusion",
        title: "Conclusion",
        body:
          "DLAW treats cinema as a tool — a good tool for pleasure, fine for other things too. That sensible bond makes them a contented viewer, but it can keep them from cinema's marking, lasting wing. Giving a film a chance (slow, symbolic or an old classic) can surprise them and broaden their taste.",
      },
    ],
    traits: [
      { kind: "strength", label: "Low Expectation, High Satisfaction", description: "Most films feel reasonable; not a ruined viewer." },
      { kind: "strength", label: "Recognises Quality", description: "Knows when a film is well made; doesn't oversell it." },
      { kind: "strength", label: "Doesn't Waste Time", description: "Closes a film they're not enjoying without difficulty." },
      { kind: "strength", label: "Genre Flexible", description: "Action, thriller, biopic, comedy — open to it all." },
      { kind: "strength", label: "Practical Debate", description: "\"Loved it / didn't, here's why\" — doesn't drag on." },
      { kind: "weakness", label: "Refuses Depth", description: "Long thinking about a film feels unnecessary; some richness is lost." },
      { kind: "weakness", label: "Door Closed to Art Cinema", description: "Slow, symbolic films are not on the leisure list." },
      { kind: "weakness", label: "Forgets", description: "Months later, can't remember which film was which." },
      { kind: "weakness", label: "Dry on Recommendation", description: "Hard to convey to others why a film is good." },
    ],
    recommendations: [
      { kind: "director", title: "Doug Liman" },
      { kind: "director", title: "Antoine Fuqua" },
      { kind: "director", title: "Jeff Nichols" },
      { kind: "director", title: "Steven Soderbergh" },
      { kind: "director", title: "Michael Mann" },
      { kind: "film", title: "Heat", year: 1995 },
      { kind: "film", title: "The Bourne Identity", year: 2002 },
      { kind: "film", title: "Mud", year: 2012 },
      { kind: "film", title: "Logan", year: 2017 },
      { kind: "film", title: "Ocean's Eleven", year: 2001 },
      { kind: "genre", title: "Smart Action" },
      { kind: "genre", title: "Thriller" },
      { kind: "genre", title: "Procedural" },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // ESCAPISTS
  // ──────────────────────────────────────────────────────────────────────
  {
    code: "ELIC",
    sections: [
      {
        slug: "overview",
        title: "Introduction",
        body:
          "The Loyalist makes a home in cinema. Close attachment to characters — they know them like friends. Story coherence matters, but for love, not for analysis. They don't hunt symbols; technical quality is mostly background, as long as it carries them.\n\nThe Devoted Escapist — the perfect picture of fandom. Loyal to the universes they love (Marvel, Harry Potter, Star Wars, anime franchises, long-running shows). They keep lists, but the list is \"finish what I love.\"\n\nThe poet of binge-watching.",
      },
      {
        slug: "watching-style",
        title: "How They Watch",
        body:
          "Tidy, ritualised. Same couch, same blanket, same drink. Friday night is show night. Co-watching is normal — partner, friends, family.\n\nLong sessions; binge is the default mode. Marathons aren't the exception.",
      },
      {
        slug: "discovery",
        title: "How They Discover",
        body:
          "New content from beloved universes (top priority), \"if you liked this you'll like this\" recs in the same genre, streaming \"you might like,\" annual franchise updates, the new project of a beloved actor.\n\nSlow to try a new genre — but if they do, they bond fast.",
      },
      {
        slug: "conversation",
        title: "After the Credits",
        body:
          "Talks, a lot. Social media, fandom forums, group chats. Spoiler hunting, prediction games, fan theories.\n\nReddit and Twitter more than Letterboxd — fandom platforms are home.",
      },
      {
        slug: "recommendations",
        title: "What They'd Love",
        body:
          "Directors: the Russo Brothers, Peter Jackson, Denis Villeneuve, Greta Gerwig, James Gunn. Films / Series: the Marvel Cinematic Universe, The Lord of the Rings, Dune, Game of Thrones, Stranger Things. Genres: franchise / IP, big-budget fantasy / sci-fi, prestige TV, romantic drama.",
      },
      {
        slug: "conclusion",
        title: "Conclusion",
        body:
          "ELIC represents the most lived-in form of love for cinema and TV — bonding, following, sharing. That warmth is wealth, but a single-genre passion can narrow the view. A \"completely foreign\" experiment once a year (a non-English drama, a slow classic) can land surprisingly well.",
      },
    ],
    traits: [
      { kind: "strength", label: "Deep Character Loyalty", description: "Bonds with characters like friends; that investment enriches the experience." },
      { kind: "strength", label: "Long-Form Patience", description: "An eight-season series is bread and butter." },
      { kind: "strength", label: "Community Gift", description: "Active in fandom; loves talking films and shows with others." },
      { kind: "strength", label: "Continuity Sensitivity", description: "Easily disturbed when a character isn't \"themselves.\"" },
      { kind: "strength", label: "Anticipation Pays Off", description: "New seasons, new films — the wait is part of the pleasure." },
      { kind: "weakness", label: "Comfort Zone", description: "Hard to leave the genres they love; resists art cinema, foreign film, slow tempo." },
      { kind: "weakness", label: "Over-Loyalty", description: "Defends the weak entries of a beloved universe; judgement blurs." },
      { kind: "weakness", label: "Distant From Symbol", description: "Open endings frustrate them." },
      { kind: "weakness", label: "Single-Genre Risk", description: "Sating a genre raises the bar for satisfaction." },
    ],
    recommendations: [
      { kind: "director", title: "Russo Brothers" },
      { kind: "director", title: "Peter Jackson" },
      { kind: "director", title: "Denis Villeneuve" },
      { kind: "director", title: "Greta Gerwig" },
      { kind: "director", title: "James Gunn" },
      { kind: "film", title: "The Lord of the Rings: The Fellowship of the Ring", year: 2001 },
      { kind: "film", title: "Avengers: Endgame", year: 2019 },
      { kind: "film", title: "Dune: Part Two", year: 2024 },
      { kind: "film", title: "Game of Thrones (Series)" },
      { kind: "film", title: "Stranger Things (Series)" },
      { kind: "genre", title: "Franchise / IP" },
      { kind: "genre", title: "Prestige TV" },
      { kind: "genre", title: "Big-Budget Fantasy / Sci-Fi" },
    ],
  },

  {
    code: "ELIW",
    sections: [
      {
        slug: "overview",
        title: "Introduction",
        body:
          "The Romantic watches cinema as if drifting on feeling — by the mood of the moment. Bonds intensely with characters, dives into story, lets themselves go. Quality matters but sits second; feeling rules.\n\nThe Free Spirit Escapist: soft, open, unscheduled, but bonds with passion. \"What should I watch?\" gets answered with \"what am I feeling right now?\"\n\nThe most heart-led type — not naïve, but a conscious choice.",
      },
      {
        slug: "watching-style",
        title: "How They Watch",
        body:
          "Mood-driven setup — blanket, light, even solitude or company. Mood-setting before pressing play matters.\n\nCo-watching is gentle: with the right person, crying or laughing together is priceless.",
      },
      {
        slug: "discovery",
        title: "How They Discover",
        body:
          "\"What would feel good right now?\" An emotional still on social, a friend says \"you have to watch this\" and they open it the next day, the new film of a beloved actor, streaming's mood-based recs.\n\nEven if they make a list, they don't stick to it; the call of the moment wins.",
      },
      {
        slug: "conversation",
        title: "After the Credits",
        body:
          "Feel, carry, sometimes share. Talk at length about a beloved film — but not structurally; \"that scene\" leads in, \"that feeling\" leads out.\n\nLetterboxd, if used, with feeling-first comments.",
      },
      {
        slug: "recommendations",
        title: "What They'd Love",
        body:
          "Directors: Hayao Miyazaki, Greta Gerwig, Pedro Almodóvar, Richard Linklater, Hirokazu Kore-eda. Films: Before Sunrise, Lady Bird, Spirited Away, Past Lives, Shoplifters. Genres: romantic drama, coming-of-age, family drama, animation, slice-of-life.",
      },
      {
        slug: "conclusion",
        title: "Conclusion",
        body:
          "ELIW may be cinema's most human viewer: heart open, list absent, judgement waived, just \"I'm here, film, talk to me.\" That openness is beautiful but can underplay the canon; stepping outside loved genres opens new connections. Watching a beloved director's full filmography in order is unusual for them — but rewarding.",
      },
    ],
    traits: [
      { kind: "strength", label: "Emotional Readiness", description: "Enters with an open heart; the most genuine response." },
      { kind: "strength", label: "Genre Range by Mood", description: "Romance today, family drama tomorrow, animation the day after." },
      { kind: "strength", label: "Empathy Depth", description: "When they bond with a character, that character can join their life." },
      { kind: "strength", label: "Films as Nourishment", description: "Treats film as experience; not information, but emotional capital." },
      { kind: "strength", label: "Unprejudiced", description: "The critic's verdict is irrelevant; their reaction is enough." },
      { kind: "weakness", label: "Wrong-Mood Films", description: "A film opened in the wrong mood gets ruined; the verdict ends up unfair." },
      { kind: "weakness", label: "Indifference to Craft", description: "Will love a technically weak film and struggle to defend it under critique." },
      { kind: "weakness", label: "Feeling-First Recall", description: "Describes a film as \"the one I cried in\" rather than by name." },
      { kind: "weakness", label: "Distant From Symbolism", description: "Open-ended, heavy-text films feel \"dry.\"" },
    ],
    recommendations: [
      { kind: "director", title: "Hayao Miyazaki" },
      { kind: "director", title: "Greta Gerwig" },
      { kind: "director", title: "Pedro Almodóvar" },
      { kind: "director", title: "Richard Linklater" },
      { kind: "director", title: "Hirokazu Kore-eda" },
      { kind: "film", title: "Before Sunrise", year: 1995 },
      { kind: "film", title: "Lady Bird", year: 2017 },
      { kind: "film", title: "Spirited Away", year: 2001 },
      { kind: "film", title: "Past Lives", year: 2023 },
      { kind: "film", title: "Shoplifters", year: 2018 },
      { kind: "genre", title: "Romantic Drama" },
      { kind: "genre", title: "Coming-of-Age" },
      { kind: "genre", title: "Slice-of-Life" },
    ],
  },

  {
    code: "DLIC",
    sections: [
      {
        slug: "overview",
        title: "Introduction",
        body:
          "The Completionist is a curious mix: distant but absorbed, concrete but planned. Doesn't identify with characters but enjoys diving into the story. Doesn't hunt for symbols, technical quality is secondary — but they finish everything they start, keep records, and go in order.\n\nThe Archivist Escapist: the collector-who-surrenders. Starts a series, finishes eight seasons. Enters a director's filmography, finishes it in order — not for analysis but for completeness. They watch cinema like doing homework, and they enjoy that.\n\nThe core user of Discord / Trakt / Letterboxd-style logging platforms.",
      },
      {
        slug: "watching-style",
        title: "How They Watch",
        body:
          "Tidy. Specific evenings for shows, weekends for films. Mostly alone; co-watching disrupts the rhythm (someone else's tendency to drop something irritates them).\n\nCares about audio and subtitle accuracy. Bad subtitles will pause the watch — but never cancel the goal of finishing.",
      },
      {
        slug: "discovery",
        title: "How They Discover",
        body:
          "\"All-time-must-watch\" lists, director filmographies (in order), the watch feeds of people they follow on Trakt, \"finished\" badges, full genre catalogues (every Coen film, every Studio Ghibli film).\n\nWeak trust in algorithms; person-first recommendations.",
      },
      {
        slug: "conversation",
        title: "After the Credits",
        body:
          "Logs and rates. Brief comment sometimes — but consistent. Doesn't usually argue; listens, says \"fair\" / \"I disagree\" and moves on.\n\nVisitors to their Trakt / Letterboxd profile say \"oh you watched that!\" — that's their hidden communication.",
      },
      {
        slug: "recommendations",
        title: "What They'd Love",
        body:
          "Directors: Coen Brothers, Christopher Nolan, Quentin Tarantino, Hayao Miyazaki, Wes Anderson. Films / Series: Breaking Bad, The Sopranos, the Coen filmography, Mad Men, the Studio Ghibli collection. Genres: prestige TV, auteur filmography, thematic genre collections, canonical series.",
      },
      {
        slug: "conclusion",
        title: "Conclusion",
        body:
          "DLIC is the viewer who is dedicated to film and TV without being invested. The balance gives them a rich back catalogue, but \"what am I finishing this for?\" can occasionally go unanswered. Allowing themselves to drop something — consciously — gives them peace. Completing is good but not the only value.",
      },
    ],
    traits: [
      { kind: "strength", label: "Disciplined Immersion", description: "Enters a story world and finishes it; \"abandon\" isn't in the dictionary." },
      { kind: "strength", label: "Catalogue Knowledge", description: "Knows every work of a beloved director or genre, no exceptions." },
      { kind: "strength", label: "Systematic Recall", description: "Trakt / Letterboxd account is full — what was watched and when." },
      { kind: "strength", label: "Stable Quality Filter", description: "Finishing what they start means they see the weak entries too — that enriches the catalogue." },
      { kind: "strength", label: "Data for Debate", description: "\"That season was weak\" comes with evidence; they watched the whole season." },
      { kind: "weakness", label: "Fatigue From Finishing", description: "Sometimes finishing replaces watching." },
      { kind: "weakness", label: "Cool-Immersion Paradox", description: "Doesn't bond with characters but finishes 80 hours of TV; can puzzle others." },
      { kind: "weakness", label: "Won't Try New Things", description: "With a list to finish, opening a new genre feels like \"loss of focus.\"" },
      { kind: "weakness", label: "Dry on Sharing", description: "Watches a lot, but says little besides \"finished it.\"" },
    ],
    recommendations: [
      { kind: "director", title: "Coen Brothers" },
      { kind: "director", title: "Christopher Nolan" },
      { kind: "director", title: "Quentin Tarantino" },
      { kind: "director", title: "Hayao Miyazaki" },
      { kind: "director", title: "Wes Anderson" },
      { kind: "film", title: "Breaking Bad (Series)" },
      { kind: "film", title: "The Sopranos (Series)" },
      { kind: "film", title: "Mad Men (Series)" },
      { kind: "film", title: "No Country for Old Men", year: 2007 },
      { kind: "film", title: "Spirited Away", year: 2001 },
      { kind: "genre", title: "Prestige TV" },
      { kind: "genre", title: "Auteur Filmography" },
      { kind: "genre", title: "Canonical Series" },
    ],
  },

  {
    code: "DLIW",
    sections: [
      {
        slug: "overview",
        title: "Introduction",
        body:
          "The Casual is cinema's relaxed viewer. No bonding to characters, no hunting for symbols — just a nice couple of hours. Pulled in but distant, wants the concrete but isn't insistent, no list, no pressure.\n\nThe Drifter Escapist — cinema as social background music. Cinema is there, gets opened when needed, gets closed when it doesn't.\n\nProbably the most common viewer; \"casual\" isn't a slight here, it's a comfortable relationship with film.",
      },
      {
        slug: "watching-style",
        title: "How They Watch",
        body:
          "Evening, couch, phone nearby. Open to talking (sometimes scrolls without thinking). Cinema occasionally, for a big release.\n\nCo-watching is common — partner, friend, roommate, family.",
      },
      {
        slug: "discovery",
        title: "How They Discover",
        body:
          "Streaming home page (the strongest source), friend recommendations, films / shows being talked about, the new project of an actor they like, the year's box-office winners.\n\nNo watchlist, or one they've forgotten.",
      },
      {
        slug: "conversation",
        title: "After the Credits",
        body:
          "\"Good\" / \"bad\" — said when it ends, evening ends. Might not use Letterboxd.\n\nDoesn't argue, doesn't read criticism, doesn't go deep. The viewer of cinema's moments.",
      },
      {
        slug: "recommendations",
        title: "What They'd Love",
        body:
          "Directors: Christopher McQuarrie, Greta Gerwig, Taika Waititi, J.J. Abrams, Edgar Wright. Films: Top Gun: Maverick, Knives Out, the Mission: Impossible series, Barbie, Spider-Man: Into the Spider-Verse. Genres: high-budget entertainment, romantic comedy, smart action, animation.",
      },
      {
        slug: "conclusion",
        title: "Conclusion",
        body:
          "DLIW is cinema's democratic viewer: no harm, no pressure, no loneliness, no snobbery. That healthy stance makes them a contented consumer. If they want a little more from cinema: trying a film from a year-end list, watching two films by one director — those small investments can produce surprising value. But they don't have to. \"Casual\" is its own valid way of watching.",
      },
    ],
    traits: [
      { kind: "strength", label: "Stress-Free", description: "Watching isn't \"a thing to do\" — it happens if it happens. That lightness keeps them content." },
      { kind: "strength", label: "Low Critical Bar (in a Good Way)", description: "Most films feel reasonable; even a bad film gets a \"yeah, fine.\"" },
      { kind: "strength", label: "Socially Easy", description: "Suitable for co-watching; the everyday movie night is their natural home." },
      { kind: "strength", label: "Open to Genres", description: "No specific genre allegiance; whatever shows up gets watched." },
      { kind: "strength", label: "Easy to Stop", description: "Closes what they don't enjoy with no fuss." },
      { kind: "weakness", label: "Lacks Deep Bond", description: "\"Films that changed my life\" memories are rare." },
      { kind: "weakness", label: "Canonical Holes", description: "Doesn't reach the classics; doesn't feel \"I should've watched this.\"" },
      { kind: "weakness", label: "Resistance to Symbol / Slow", description: "Open-ended, slow films are on the boring list." },
      { kind: "weakness", label: "Weak Recall", description: "Months later, what was what gets blurry." },
    ],
    recommendations: [
      { kind: "director", title: "Christopher McQuarrie" },
      { kind: "director", title: "Greta Gerwig" },
      { kind: "director", title: "Taika Waititi" },
      { kind: "director", title: "J.J. Abrams" },
      { kind: "director", title: "Edgar Wright" },
      { kind: "film", title: "Top Gun: Maverick", year: 2022 },
      { kind: "film", title: "Knives Out", year: 2019 },
      { kind: "film", title: "Mission: Impossible — Fallout", year: 2018 },
      { kind: "film", title: "Barbie", year: 2023 },
      { kind: "film", title: "Spider-Man: Into the Spider-Verse", year: 2018 },
      { kind: "genre", title: "High-Budget Entertainment" },
      { kind: "genre", title: "Smart Action" },
      { kind: "genre", title: "Animation" },
    ],
  },
];

export const profileByCode = new Map(profiles.map((p) => [p.code, p]));

export function getProfile(code: string) {
  return profileByCode.get(code.toUpperCase());
}
