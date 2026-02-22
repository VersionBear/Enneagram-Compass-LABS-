const typeProfiles = {
  1: {
    title: "Type 1 - The Reformer",
    subtitle: "Principled, disciplined, improvement-focused",
    description:
      "You are motivated to do what is right and uphold strong standards. You thrive when your effort creates fairness and meaningful progress.",
  },
  2: {
    title: "Type 2 - The Helper",
    subtitle: "Warm, supportive, people-attuned",
    description:
      "You naturally track others' needs and build connection through generosity. Growth often comes from balancing care for others with care for yourself.",
  },
  3: {
    title: "Type 3 - The Achiever",
    subtitle: "Driven, adaptive, success-oriented",
    description:
      "You are motivated by progress, impact, and tangible results. You shine when your ambition aligns with authentic values, not only external validation.",
  },
  4: {
    title: "Type 4 - The Individualist",
    subtitle: "Sensitive, expressive, identity-seeking",
    description:
      "You are deeply tuned to emotional nuance and personal meaning. Your gift is originality and depth, especially when grounded in steady routines.",
  },
  5: {
    title: "Type 5 - The Investigator",
    subtitle: "Curious, analytical, independent",
    description:
      "You are motivated to understand how things work before engaging fully. Your clarity and insight become strongest when paired with practical action.",
  },
  6: {
    title: "Type 6 - The Loyalist",
    subtitle: "Responsible, security-minded, committed",
    description:
      "You notice risk early and build dependable systems for people you care about. You grow by trusting your own judgment as much as external guidance.",
  },
  7: {
    title: "Type 7 - The Enthusiast",
    subtitle: "Optimistic, exploratory, future-focused",
    description:
      "You bring energy, ideas, and possibility to any room. Your range expands when you stay present through discomfort instead of outrunning it.",
  },
  8: {
    title: "Type 8 - The Challenger",
    subtitle: "Direct, protective, powerful",
    description:
      "You value autonomy and speak with bold conviction. Your leadership is most effective when strength is paired with vulnerability and listening.",
  },
  9: {
    title: "Type 9 - The Peacemaker",
    subtitle: "Steady, receptive, harmony-building",
    description:
      "You create calm and bridge different perspectives. Growth comes from staying connected to your own priorities, not only the group's comfort.",
  },
};

const typeNouns = {
  1: "clarity",
  2: "care",
  3: "drive",
  4: "depth",
  5: "insight",
  6: "loyalty",
  7: "possibility",
  8: "strength",
  9: "peace",
};

const defaultAverageScores = {
  1: 12,
  2: 12,
  3: 12,
  4: 12,
  5: 12,
  6: 12,
  7: 12,
  8: 12,
  9: 12,
};

const resultStorageKey = "enneagram-result-history-v1";
const savedResultsKey = "enneagram-saved-results-v1";
const baselineMinSample = 5;
let averageScores = { ...defaultAverageScores };
let averageSampleSize = 0;
let currentResult = null;

const questionBank = [
  { type: 1, text: "I feel a strong pull to improve processes that seem flawed or sloppy." },
  { type: 1, text: "I often notice what could be done better before I can relax." },
  { type: 1, text: "I hold myself to high standards, even when no one else expects it." },
  { type: 1, text: "I can get frustrated when people ignore rules that protect quality." },

  { type: 2, text: "I naturally check in on people and offer help without being asked." },
  { type: 2, text: "Feeling needed by others gives me a strong sense of purpose." },
  { type: 2, text: "I read emotional cues quickly and respond supportively." },
  { type: 2, text: "I sometimes prioritize others so much that my own needs wait." },

  { type: 3, text: "I feel energized by goals, milestones, and visible progress." },
  { type: 3, text: "I adapt my style quickly to be effective in different settings." },
  { type: 3, text: "I am highly motivated to perform well and be recognized for it." },
  { type: 3, text: "I prefer being productive over dwelling on uncertain emotions." },

  { type: 4, text: "I often feel emotions deeply and search for personal meaning in experiences." },
  { type: 4, text: "Authenticity matters to me more than fitting in." },
  { type: 4, text: "I am drawn to beauty, symbolism, and creative self-expression." },
  { type: 4, text: "I can feel misunderstood when others overlook emotional complexity." },

  { type: 5, text: "I like to gather information thoroughly before taking action." },
  { type: 5, text: "I value privacy and need solo time to recharge mentally." },
  { type: 5, text: "I enjoy mastering complex topics and systems." },
  { type: 5, text: "I may detach from feelings when I am focused on understanding." },

  { type: 6, text: "I think ahead about risks so people can be better prepared." },
  { type: 6, text: "I am loyal to people and commitments that feel trustworthy." },
  { type: 6, text: "I often test plans by asking what could go wrong." },
  { type: 6, text: "I feel most at ease when expectations and roles are clear." },

  { type: 7, text: "I get excited by new ideas, options, and future adventures." },
  { type: 7, text: "I prefer to keep momentum rather than stay in heavy emotions." },
  { type: 7, text: "I am skilled at reframing challenges into opportunities." },
  { type: 7, text: "I dislike feeling trapped by rigid routines or limitations." },

  { type: 8, text: "I speak directly and take charge when situations are uncertain." },
  { type: 8, text: "I stand up quickly when I sense unfairness or manipulation." },
  { type: 8, text: "I prefer to rely on my own strength rather than appear vulnerable." },
  { type: 8, text: "I respect people who are honest and strong under pressure." },

  { type: 9, text: "I work to maintain harmony, even when conflict is uncomfortable." },
  { type: 9, text: "I can see multiple sides of an issue and help people meet in the middle." },
  { type: 9, text: "I sometimes delay my own priorities to keep things smooth." },
  { type: 9, text: "I value steady routines and peaceful environments." },
];

const state = {
  index: 0,
  answers: new Array(questionBank.length).fill(null),
};

const introPanel = document.getElementById("introPanel");
const quizPanel = document.getElementById("quizPanel");
const resultsPanel = document.getElementById("resultsPanel");
const questionCounter = document.getElementById("questionCounter");
const questionText = document.getElementById("questionText");
const progressBar = document.getElementById("progressBar");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const scoreBars = document.getElementById("scoreBars");
const resultTitle = document.getElementById("resultTitle");
const resultSubtitle = document.getElementById("resultSubtitle");
const resultDescription = document.getElementById("resultDescription");
const dynamicSummary = document.getElementById("dynamicSummary");
const wingPill = document.getElementById("wingPill");
const wingCopy = document.getElementById("wingCopy");
const averageToggle = document.getElementById("averageToggle");
const averageLabel = document.getElementById("averageLabel");
const shareFriendBtn = document.getElementById("shareFriendBtn");
const saveResultBtn = document.getElementById("saveResultBtn");
const savedResultsSection = document.getElementById("savedResultsSection");
const savedResultsList = document.getElementById("savedResultsList");
const autoNextToggle = document.getElementById("autoNextToggle");
const scaleButtons = Array.from(document.querySelectorAll(".scale-btn"));

let lastWingContext = null;

loadAggregateBaseline();
renderAverageLabel();
renderSavedResults();
loadAutoNextPreference();

document.getElementById("startBtn").addEventListener("click", () => {
  introPanel.classList.add("hidden");
  quizPanel.classList.remove("hidden");
  renderQuestion();
});

document.getElementById("retakeBtn").addEventListener("click", () => {
  state.index = 0;
  state.answers.fill(null);
  resultsPanel.classList.add("hidden");
  quizPanel.classList.remove("hidden");
  averageToggle.checked = false;
  scoreBars.classList.remove("show-average");
  renderQuestion();
});

averageToggle.addEventListener("change", () => {
  scoreBars.classList.toggle("show-average", averageToggle.checked);
});

autoNextToggle.addEventListener("change", () => {
  saveAutoNextPreference(autoNextToggle.checked);
});

wingPill.addEventListener("mouseenter", setWingBarHighlight);
wingPill.addEventListener("mouseleave", clearWingBarHighlight);
wingPill.addEventListener("focus", setWingBarHighlight);
wingPill.addEventListener("blur", clearWingBarHighlight);

shareFriendBtn.addEventListener("click", async () => {
  const title = resultTitle.textContent || "My Enneagram result";
  const text = `I got ${title} on Enneagram Compass. Compare your type with mine.`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Enneagram Compass",
        text,
      });
      return;
    } catch {
      // fall through to clipboard
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    window.alert("Result blurb copied. Send it to a friend and compare your results.");
  } catch {
    window.alert(text);
  }
});

saveResultBtn.addEventListener("click", () => {
  if (!currentResult) {
    return;
  }

  const saved = saveResult(currentResult);
  if (saved) {
    saveResultBtn.textContent = "Saved!";
    saveResultBtn.disabled = true;
    renderSavedResults();
    setTimeout(() => {
      saveResultBtn.textContent = "Save this result";
      saveResultBtn.disabled = false;
    }, 1500);
  }
});

nextBtn.addEventListener("click", () => {
  if (state.answers[state.index] === null) {
    return;
  }

  if (state.index < questionBank.length - 1) {
    state.index += 1;
    renderQuestion();
    return;
  }

  showResults();
});

backBtn.addEventListener("click", () => {
  if (state.index === 0) {
    return;
  }

  state.index -= 1;
  renderQuestion();
});

scaleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = Number(button.dataset.value);
    state.answers[state.index] = value;
    syncScaleButtons();
    nextBtn.disabled = false;
    
    if (autoNextToggle.checked) {
      setTimeout(() => {
        if (state.index < questionBank.length - 1) {
          state.index += 1;
          renderQuestion();
        } else {
          showResults();
        }
      }, 250);
    }
  });
});

function renderQuestion() {
  const question = questionBank[state.index];
  questionCounter.textContent = `Question ${state.index + 1} of ${questionBank.length}`;
  questionText.textContent = question.text;
  progressBar.style.width = `${((state.index + 1) / questionBank.length) * 100}%`;
  backBtn.disabled = state.index === 0;
  nextBtn.textContent = state.index === questionBank.length - 1 ? "See Result" : "Next";
  nextBtn.disabled = state.answers[state.index] === null;
  syncScaleButtons();
}

function syncScaleButtons() {
  const selected = state.answers[state.index];
  scaleButtons.forEach((button) => {
    const isActive = Number(button.dataset.value) === selected;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function showResults() {
  const totals = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };

  questionBank.forEach((question, idx) => {
    totals[question.type] += Number(state.answers[idx]) || 0;
  });

  const ranked = Object.entries(totals)
    .map(([type, score]) => ({ type: Number(type), score }))
    .sort((a, b) => b.score - a.score);

  const winner = ranked[0];
  const wing = guessWing(ranked);
  const profile = typeProfiles[winner.type];

  currentResult = {
    scores: totals,
    ranked,
    winnerType: winner.type,
    wing,
    timestamp: Date.now(),
  };

  persistResult(totals);
  loadAggregateBaseline();
  renderAverageLabel();

  resultTitle.textContent = profile.title;
  resultSubtitle.textContent = `${profile.subtitle}${wing ? ` | likely wing ${wing}` : ""}`;
  resultDescription.textContent = profile.description;
  dynamicSummary.textContent = buildDynamicSummary(ranked);
  setWingCard(winner.type, wing);

  renderScoreBars(ranked, winner.type);
  scoreBars.classList.toggle("show-average", averageToggle.checked);
  quizPanel.classList.add("hidden");
  resultsPanel.classList.remove("hidden");
  
  updateSaveButtonState();
}

function buildDynamicSummary(ranked) {
  const [first, second, third] = ranked;
  return `You lead with ${typeNouns[first.type]} (Type ${first.type}), with strong ${typeNouns[second.type]} from Type ${second.type} and ${typeNouns[third.type]} from Type ${third.type}. This blend suggests a layered style rather than a single-note profile.`;
}

function loadAggregateBaseline() {
  const injectedBaseline = normalizeBaseline(window.ENNEAGRAM_BASELINE);
  if (injectedBaseline) {
    averageScores = injectedBaseline.scores;
    averageSampleSize = injectedBaseline.sampleSize;
    return;
  }

  const history = readResultHistory();
  averageSampleSize = history.length;
  if (history.length < baselineMinSample) {
    averageScores = { ...defaultAverageScores };
    return;
  }

  averageScores = computeAverageScores(history);
}

function renderAverageLabel() {
  if (averageSampleSize >= baselineMinSample) {
    averageLabel.textContent = `Show average score baseline (${averageSampleSize} responses)`;
    return;
  }

  averageLabel.textContent = `Show average score baseline (collecting data: ${averageSampleSize}/${baselineMinSample})`;
}

function readResultHistory() {
  try {
    const raw = localStorage.getItem(resultStorageKey);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((entry) => isScoreSet(entry?.scores)).map((entry) => entry.scores);
  } catch {
    return [];
  }
}

function persistResult(scores) {
  try {
    const history = readResultHistory();
    history.push(scores);
    if (history.length > 500) {
      history.splice(0, history.length - 500);
    }

    const payload = history.map((scoreSet) => ({
      scores: scoreSet,
    }));
    localStorage.setItem(resultStorageKey, JSON.stringify(payload));
  } catch {
    // ignore storage failures
  }
}

function computeAverageScores(history) {
  const totals = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };

  history.forEach((scoreSet) => {
    Object.keys(totals).forEach((type) => {
      totals[type] += Number(scoreSet[type]) || 0;
    });
  });

  const averages = { ...totals };
  Object.keys(averages).forEach((type) => {
    averages[type] = Number((totals[type] / history.length).toFixed(1));
  });

  return averages;
}

function normalizeBaseline(candidate) {
  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  if (isScoreSet(candidate)) {
    return {
      scores: candidate,
      sampleSize: Number(candidate.sampleSize) || 0,
    };
  }

  if (isScoreSet(candidate.scores)) {
    return {
      scores: candidate.scores,
      sampleSize: Number(candidate.sampleSize) || 0,
    };
  }

  return null;
}

function isScoreSet(value) {
  if (!value || typeof value !== "object") {
    return false;
  }

  return [1, 2, 3, 4, 5, 6, 7, 8, 9].every((type) => Number.isFinite(Number(value[type])));
}

function setWingCard(coreType, wing) {
  if (!wing) {
    wingPill.textContent = `Type ${coreType} with balanced wings`;
    wingCopy.textContent = "Your adjacent wing scores are close, so your style may shift based on context.";
    lastWingContext = { coreType, wingType: null };
    return;
  }

  const wingType = Number(wing.slice(-1));
  wingPill.textContent = `Likely wing ${wing}`;
  wingCopy.textContent = `Hover this badge to spotlight how Type ${coreType} and Type ${wingType} connect in your chart.`;
  lastWingContext = { coreType, wingType };
}

function guessWing(ranked) {
  const topType = ranked[0].type;
  const leftWing = topType === 1 ? 9 : topType - 1;
  const rightWing = topType === 9 ? 1 : topType + 1;

  const leftScore = ranked.find((entry) => entry.type === leftWing)?.score || 0;
  const rightScore = ranked.find((entry) => entry.type === rightWing)?.score || 0;

  if (leftScore === rightScore) {
    return null;
  }

  return leftScore > rightScore ? `${topType}w${leftWing}` : `${topType}w${rightWing}`;
}

function renderScoreBars(ranked, coreType) {
  scoreBars.innerHTML = "";
  const maxScore = 20;
  const leftWing = coreType === 1 ? 9 : coreType - 1;
  const rightWing = coreType === 9 ? 1 : coreType + 1;

  const lookup = new Map(ranked.map((entry) => [entry.type, entry]));
  const ordered = [lookup.get(coreType), lookup.get(leftWing), lookup.get(rightWing)]
    .filter(Boolean)
    .concat(ranked.filter((entry) => ![coreType, leftWing, rightWing].includes(entry.type)));

  ordered.forEach((entry) => {
    const row = document.createElement("div");
    row.className = "bar-row";
    row.dataset.type = String(entry.type);
    if (entry.type === coreType) {
      row.classList.add("core-row");
    }
    if (entry.type === leftWing || entry.type === rightWing) {
      row.classList.add("wing-row");
    }

    const label = document.createElement("span");
    label.textContent = `Type ${entry.type}`;

    const track = document.createElement("div");
    track.className = "bar-track";

    const average = document.createElement("span");
    average.className = "bar-average";
    average.style.left = `${(averageScores[entry.type] / maxScore) * 100}%`;

    const fill = document.createElement("div");
    fill.className = "bar-fill";
    fill.style.width = `${(entry.score / maxScore) * 100}%`;
    fill.classList.add(getTriadClass(entry.type));
    if (entry.type === coreType) {
      fill.style.background = "linear-gradient(90deg, #74c59b, #2b8a5f)";
    }
    const value = document.createElement("span");
    value.className = "bar-value";
    value.textContent = String(entry.score);

    track.appendChild(average);
    track.appendChild(fill);
    row.append(label, track, value);
    scoreBars.appendChild(row);
  });
}

function getTriadClass(type) {
  if ([8, 9, 1].includes(type)) {
    return "triad-gut";
  }

  if ([2, 3, 4].includes(type)) {
    return "triad-heart";
  }

  return "triad-head";
}

function setWingBarHighlight() {
  if (!lastWingContext?.wingType) {
    return;
  }

  const rows = Array.from(scoreBars.querySelectorAll(".bar-row"));
  rows.forEach((row) => {
    const rowType = Number(row.dataset.type);
    const isLinked = rowType === lastWingContext.coreType || rowType === lastWingContext.wingType;
    row.classList.toggle("linked", isLinked);
  });
}

function clearWingBarHighlight() {
  const rows = Array.from(scoreBars.querySelectorAll(".bar-row"));
  rows.forEach((row) => row.classList.remove("linked"));
}

function saveResult(result) {
  try {
    const saved = readSavedResults();
    
    const alreadyExists = saved.some(
      (item) => item.timestamp === result.timestamp
    );
    
    if (alreadyExists) {
      return false;
    }
    
    const savedEntry = {
      id: Date.now().toString(),
      scores: result.scores,
      ranked: result.ranked,
      winnerType: result.winnerType,
      wing: result.wing,
      timestamp: result.timestamp,
    };
    
    saved.unshift(savedEntry);
    
    if (saved.length > 50) {
      saved.pop();
    }
    
    localStorage.setItem(savedResultsKey, JSON.stringify(saved));
    return true;
  } catch {
    return false;
  }
}

function readSavedResults() {
  try {
    const raw = localStorage.getItem(savedResultsKey);
    if (!raw) {
      return [];
    }
    
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    
    return parsed;
  } catch {
    return [];
  }
}

function deleteSavedResult(id) {
  try {
    const saved = readSavedResults();
    const filtered = saved.filter((item) => item.id !== id);
    localStorage.setItem(savedResultsKey, JSON.stringify(filtered));
    renderSavedResults();
  } catch {
    // ignore
  }
}

function renderSavedResults() {
  const saved = readSavedResults();
  
  if (saved.length === 0) {
    savedResultsList.innerHTML = '<p class="saved-results-empty">No saved results yet. Complete the test and save your results to track your progress over time.</p>';
    return;
  }
  
  savedResultsList.innerHTML = "";
  
  saved.forEach((item) => {
    const row = document.createElement("div");
    row.className = "saved-result-item";
    
    const profile = typeProfiles[item.winnerType];
    const date = new Date(item.timestamp);
    const dateStr = date.toLocaleDateString(undefined, { 
      year: "numeric", 
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    
    const info = document.createElement("div");
    info.className = "saved-result-info";
    
    const title = document.createElement("div");
    title.className = "saved-result-title";
    title.textContent = `${profile.title}${item.wing ? ` (${item.wing})` : ""}`;
    
    const dateEl = document.createElement("div");
    dateEl.className = "saved-result-date";
    dateEl.textContent = dateStr;
    
    info.appendChild(title);
    info.appendChild(dateEl);
    
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "saved-result-delete";
    deleteBtn.innerHTML = "✕";
    deleteBtn.title = "Delete this result";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteSavedResult(item.id);
    });
    
    row.appendChild(info);
    row.appendChild(deleteBtn);
    
    row.addEventListener("click", () => {
      loadSavedResult(item);
    });
    
    savedResultsList.appendChild(row);
  });
}

function loadSavedResult(item) {
  const profile = typeProfiles[item.winnerType];
  
  resultTitle.textContent = profile.title;
  resultSubtitle.textContent = `${profile.subtitle}${item.wing ? ` | likely wing ${item.wing}` : ""}`;
  resultDescription.textContent = profile.description;
  dynamicSummary.textContent = buildDynamicSummary(item.ranked);
  setWingCard(item.winnerType, item.wing);
  
  renderScoreBars(item.ranked, item.winnerType);
  scoreBars.classList.toggle("show-average", averageToggle.checked);
  
  currentResult = null;
  updateSaveButtonState();
  
  resultsPanel.classList.remove("hidden");
  quizPanel.classList.add("hidden");
  
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateSaveButtonState() {
  if (!currentResult) {
    saveResultBtn.textContent = "Save this result";
    saveResultBtn.disabled = false;
    return;
  }
  
  const saved = readSavedResults();
  const alreadyExists = saved.some(
    (item) => item.timestamp === currentResult.timestamp
  );
  
  if (alreadyExists) {
    saveResultBtn.textContent = "Already saved";
    saveResultBtn.disabled = true;
  } else {
    saveResultBtn.textContent = "Save this result";
    saveResultBtn.disabled = false;
  }
}

const autoNextStorageKey = "enneagram-auto-next-v1";

function loadAutoNextPreference() {
  try {
    const saved = localStorage.getItem(autoNextStorageKey);
    if (saved !== null) {
      autoNextToggle.checked = JSON.parse(saved);
    }
  } catch {
    // ignore
  }
}

function saveAutoNextPreference(enabled) {
  try {
    localStorage.setItem(autoNextStorageKey, JSON.stringify(enabled));
  } catch {
    // ignore
  }
}
