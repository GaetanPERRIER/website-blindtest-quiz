const STOP_WORDS = new Set([
    "feat",
    "featuring",
    "ft",
    "vs",
    "and",
    "avec",
    "with"
]);

const stripParentheses = (value) => value.replace(/\([^)]*\)/g, " ");

const stripAccents = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const sanitizeSeparators = (value) => value
    .replace(/&/g, " and ")
    .replace(/\//g, " ")
    .replace(/\s+/g, " ");

const removePunctuation = (value) => value.replace(/[^a-z0-9\s]/g, " ");

const cleanupStopWords = (value) => value
    .split(" ")
    .filter((word) => word && !STOP_WORDS.has(word))
    .join(" ");

function normalizeText(input) {
    if (!input || typeof input !== "string") {
        return "";
    }

    const lowered = input.toLowerCase();
    const withoutParentheses = stripParentheses(lowered);
    const withoutAccents = stripAccents(withoutParentheses);
    const noPunctuation = removePunctuation(withoutAccents);
    const unifiedSeparators = sanitizeSeparators(noPunctuation);
    const withoutStopWords = cleanupStopWords(unifiedSeparators);

    return withoutStopWords.trim().replace(/\s+/g, " ");
}

function levenshteinDistance(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;

    const matrix = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));

    for (let i = 0; i <= a.length; i++) {
        matrix[i][0] = i;
    }

    for (let j = 0; j <= b.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }

    return matrix[a.length][b.length];
}

function computeSimilarity(distance, lengthA, lengthB) {
    const longest = Math.max(lengthA, lengthB, 1);
    return Math.max(0, (longest - distance) / longest);
}

function bestSegmentMatch(candidate, expected) {
    const candidateWords = candidate.split(" ");
    const baseDistance = levenshteinDistance(candidate, expected);
    let best = {
        segment: candidate,
        distance: baseDistance,
        similarity: computeSimilarity(baseDistance, candidate.length, expected.length)
    };

    for (let size = 1; size <= candidateWords.length; size++) {
        for (let start = 0; start <= candidateWords.length - size; start++) {
            const segment = candidateWords.slice(start, start + size).join(" ");
            if (!segment || segment === candidate) {
                continue;
            }

            const distance = levenshteinDistance(segment, expected);
            const similarity = computeSimilarity(distance, segment.length, expected.length);

            if (similarity > best.similarity) {
                best = {
                    segment,
                    distance,
                    similarity
                };
            }
        }
    }

    return best;
}

function passesThreshold(expected, distance, similarity) {
    const length = expected.length;

    if (length <= 3) {
        return distance === 0;
    }

    if (length <= 5) {
        return distance <= 1 || similarity >= 0.85;
    }

    if (length <= 8) {
        return distance <= 2 || similarity >= 0.8;
    }

    return similarity >= 0.75 || distance <= Math.ceil(length * 0.25);
}

function findBestMatch(candidates, expectedValues, similarityThreshold) {
    let bestMatch = null;

    expectedValues.forEach((expectedRaw) => {
        const normalizedExpected = normalizeText(expectedRaw);
        if (!normalizedExpected) {
            return;
        }

        candidates.forEach((candidateRaw) => {
            const normalizedCandidate = normalizeText(candidateRaw);
            if (!normalizedCandidate) {
                return;
            }

            const { segment, distance, similarity } = bestSegmentMatch(normalizedCandidate, normalizedExpected);

            const isBetter = !bestMatch || similarity > bestMatch.similarity;
            if (!isBetter) {
                return;
            }

            const thresholdPassed = similarityThreshold
                ? similarity >= similarityThreshold
                : passesThreshold(normalizedExpected, distance, similarity);

            bestMatch = {
                expectedRaw,
                candidateRaw,
                normalizedExpected,
                normalizedCandidate: segment,
                distance,
                similarity,
                matched: thresholdPassed
            };
        });
    });

    return bestMatch || {
        expectedRaw: null,
        candidateRaw: null,
        normalizedExpected: "",
        normalizedCandidate: "",
        distance: Infinity,
        similarity: 0,
        matched: false
    };
}

function toAnswerPayload(answer) {
    if (answer && typeof answer === "object") {
        const title = typeof answer.title === "string" ? answer.title : "";
        const artist = typeof answer.artist === "string" ? answer.artist : "";
        const combined = typeof answer.combined === "string" ? answer.combined : `${title} ${artist}`.trim();

        return {
            title,
            artist,
            combined
        };
    }

    if (typeof answer === "string") {
        return {
            title: answer,
            artist: "",
            combined: answer
        };
    }

    return { title: "", artist: "", combined: "" };
}

function evaluateAnswerAgainstTrack(answer, track, thresholds = {}) {
    const payload = toAnswerPayload(answer);

    const titleCandidates = [payload.title, payload.combined].filter(Boolean);
    const artistCandidates = [payload.artist, payload.combined].filter(Boolean);

    const expectedTitles = [track?.title, track?.title_short, track?.title_version]
        .filter(Boolean);
    const expectedArtists = [track?.artist?.name]
        .concat(Array.isArray(track?.contributors) ? track.contributors.map((c) => c.name) : [])
        .filter(Boolean);

    const titleMatch = findBestMatch(titleCandidates, expectedTitles, thresholds.titleThreshold);
    const artistMatch = findBestMatch(artistCandidates, expectedArtists, thresholds.artistThreshold);

    return {
        payload,
        titleMatch,
        artistMatch
    };
}

module.exports = {
    normalizeText,
    levenshteinDistance,
    computeSimilarity,
    findBestMatch,
    evaluateAnswerAgainstTrack
};

