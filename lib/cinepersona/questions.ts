import type { Question } from "./types";

// 48 questions, 12 per axis, 6 in each direction.
// `direction` is the pole the answer "Strongly Agree" pushes the score toward.
export const questions: Question[] = [
  // Axis 1 — Empathic (E) ↔ Detached (D)
  { id: 1, axis: 1, direction: "E", body: "When something bad happens to a character, I physically feel it." },
  { id: 2, axis: 1, direction: "E", body: "If I don't like a character, the film becomes hard to watch." },
  { id: 3, axis: 1, direction: "E", body: "Crying during a film is normal for me." },
  { id: 4, axis: 1, direction: "E", body: "Whether I love a film depends largely on whether I bond with the lead." },
  { id: 5, axis: 1, direction: "E", body: "If a villain is written with empathy, I can feel sorry for them too." },
  { id: 6, axis: 1, direction: "E", body: "Characters stay with me for a while after the film ends." },
  { id: 7, axis: 1, direction: "D", body: "Characters don't need to be likeable for me — interesting is enough." },
  { id: 8, axis: 1, direction: "D", body: "I notice visual language and atmosphere more than characters." },
  { id: 9, axis: 1, direction: "D", body: "A poorly written but visually striking film can still satisfy me." },
  { id: 10, axis: 1, direction: "D", body: "It's normal for me to wonder \"how was this shot?\" while watching." },
  { id: 11, axis: 1, direction: "D", body: "Knowing a character's backstory doesn't add much for me; what matters is what they do on screen." },
  { id: 12, axis: 1, direction: "D", body: "I don't need to put myself in a character's place to be moved by a film." },

  // Axis 2 — Symbolic (S) ↔ Literal (L)
  { id: 13, axis: 2, direction: "S", body: "Open endings satisfy me." },
  { id: 14, axis: 2, direction: "S", body: "I enjoy thinking about what a film is really trying to say." },
  { id: 15, axis: 2, direction: "S", body: "Spotting a recurring visual motif across scenes excites me." },
  { id: 16, axis: 2, direction: "S", body: "I'm happy to rewatch a film just to understand it better." },
  { id: 17, axis: 2, direction: "S", body: "Researching the director's intent is part of how I watch." },
  { id: 18, axis: 2, direction: "S", body: "A film being open to symbolic interpretation makes it more interesting." },
  { id: 19, axis: 2, direction: "L", body: "I prefer films that explain everything." },
  { id: 20, axis: 2, direction: "L", body: "Unrealistic films bother me." },
  { id: 21, axis: 2, direction: "L", body: "I notice logical inconsistencies while watching." },
  { id: 22, axis: 2, direction: "L", body: "Story coherence matters more to me than symbolic depth." },
  { id: 23, axis: 2, direction: "L", body: "Long scenes without dialogue bore me." },
  { id: 24, axis: 2, direction: "L", body: "I care more about how things turn out than about the film's message." },

  // Axis 3 — Analytical (A) ↔ Immersive (I)
  { id: 25, axis: 3, direction: "A", body: "I notice editing mistakes or continuity errors while watching." },
  { id: 26, axis: 3, direction: "A", body: "I look up the director or cast before I watch." },
  { id: 27, axis: 3, direction: "A", body: "Bad acting ruins a film for me." },
  { id: 28, axis: 3, direction: "A", body: "IMDb or Letterboxd ratings affect what I choose to watch." },
  { id: 29, axis: 3, direction: "A", body: "I consciously evaluate technical elements like cinematography or score." },
  { id: 30, axis: 3, direction: "A", body: "After a film, I enjoy reading reviews or technical analysis." },
  { id: 31, axis: 3, direction: "I", body: "Even a technically weak film can win me over if I get pulled in." },
  { id: 32, axis: 3, direction: "I", body: "If a film moved me, I can overlook its technical shortcomings." },
  { id: 33, axis: 3, direction: "I", body: "I focus on the flow of the story, not technical details." },
  { id: 34, axis: 3, direction: "I", body: "I don't really separate \"objectively good\" from \"good for me\"." },
  { id: 35, axis: 3, direction: "I", body: "I can love a film critics dislike, and that doesn't bother me." },
  { id: 36, axis: 3, direction: "I", body: "When picking a film, I go by how I feel rather than by ratings." },

  // Axis 4 — Curatorial (C) ↔ Wandering (W)
  { id: 37, axis: 4, direction: "C", body: "I keep a list of films I want to watch." },
  { id: 38, axis: 4, direction: "C", body: "I enjoy going through a director's filmography in order." },
  { id: 39, axis: 4, direction: "C", body: "An unfinished film bothers me." },
  { id: 40, axis: 4, direction: "C", body: "I do some research before watching a film." },
  { id: 41, axis: 4, direction: "C", body: "I systematically explore a particular genre or era." },
  { id: 42, axis: 4, direction: "C", body: "After watching, I record my notes or rating somewhere." },
  { id: 43, axis: 4, direction: "W", body: "I pick films by mood, not by my list." },
  { id: 44, axis: 4, direction: "W", body: "I have no problem closing a film I'm not enjoying." },
  { id: 45, axis: 4, direction: "W", body: "I don't need a special time or setting to watch a film." },
  { id: 46, axis: 4, direction: "W", body: "I follow several shows in parallel at the same time." },
  { id: 47, axis: 4, direction: "W", body: "Taking film recommendations is easier than choosing on my own." },
  { id: 48, axis: 4, direction: "W", body: "I decide what to watch without thinking too much." },
];

