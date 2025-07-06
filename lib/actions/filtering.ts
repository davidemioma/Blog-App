const MIN_VOTE_THRESHOLD = 1 as const;

// New comments get higher scores
// Old comments become less relevant over time
export const calculateMainScore = ({
  upvotes,
  downvotes,
  createdAt,
}: {
  upvotes: number;
  downvotes: number;
  createdAt: Date;
}): number => {
  const voteDifference = upvotes - downvotes;

  const totalVotes = upvotes + downvotes;

  const commentAge = (Date.now() - new Date(createdAt).getTime()) / 1000; // in seconds

  if (totalVotes < MIN_VOTE_THRESHOLD) return 0;

  const timeDecay = 1 / Math.pow(commentAge / 3600 + 2, 1.5);

  return voteDifference * timeDecay;
};

// Calculates the "hot" score for a comment, favoring both high-scoring and recent comments.
// 'baseScore' is the main score (vote difference with time decay), and 'recency' boosts newer comments.
// This helps surface comments that are both popular and fresh.
export const calculateHotScore = ({
  upvotes,
  downvotes,
  createdAt,
}: {
  upvotes: number;
  downvotes: number;
  createdAt: Date;
}): number => {
  const baseScore = calculateMainScore({ upvotes, downvotes, createdAt });

  const recency = 1 / ((Date.now() - new Date(createdAt).getTime()) / 1000 + 1);

  return baseScore * recency;
};

export const calcTopScore = ({
  upvotes,
  downvotes,
}: {
  upvotes: number;
  downvotes: number;
}): number => {
  return upvotes - downvotes;
};

// Calculates how controversial a comment is based on its upvotes and downvotes.
// The score is higher when upvotes and downvotes are both high and balanced (i.e., lots of disagreement).
// 'balance' measures how evenly split the votes are (1 = perfectly balanced, 0 = all votes one-sided).
// 'magnitude' increases with the total number of votes, using a logarithmic scale.
export const calcControversialScore = ({
  upvotes,
  downvotes,
}: {
  upvotes: number;
  downvotes: number;
}): number => {
  const total = upvotes + downvotes;

  if (total === 0) return 0;

  const balance = Math.min(upvotes, downvotes) / Math.max(upvotes, downvotes);

  const magnitude = Math.log10(total);

  return balance * magnitude;
};
